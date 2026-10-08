/**
 * The hero's WebGL night sky (three.js).
 *
 *  - a full-screen shader nebula,
 *  - a deep starfield spread through 3D space, so moving the camera gives real parallax,
 *  - the Monoceros constellation, aligned to the static SVG fallback's on-screen box
 *    (CSS owns the layout; this scene just follows it),
 *  - shooting stars on click and at random.
 *
 * The scene renders from GSAP's ticker only while the hero is on screen.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { edges, sparkles, stars, type EdgeKind, type StarName } from '@/content/constellation';
import { gsap } from '@/scripts/core/motion';
import { nebulaFragment, nebulaVertex, starFragment, starVertex } from './shaders';

const CAMERA_Z = 10;
const FOV = 50;

const PALETTE = {
  white: new Color('#efe6d2'),
  warm: new Color('#f1d99a'),
  cool: new Color('#aac3f0'),
  gold: new Color('#f1d99a'),
  goldDim: new Color('#c9a45c'),
  lapis: new Color('#7fa2dc'),
};

const EDGE_STYLE: Record<EdgeKind, { color: Color; opacity: number }> = {
  horn: { color: PALETTE.gold, opacity: 0.95 },
  outline: { color: PALETTE.goldDim, opacity: 0.5 },
  mane: { color: PALETTE.lapis, opacity: 0.5 },
};

interface EdgeRuntime {
  kind: EdgeKind;
  from: StarName;
  to: StarName;
  /** 0 → 1 drawing progress. */
  progress: number;
}

export class SkyScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  private readonly constellation = new Group();
  private readonly mouse = new Vector2(10, 10);
  private readonly mouseTarget = new Vector2(10, 10);
  private readonly parallax = new Vector2();
  private readonly starPositions = new Map<StarName, Vector3>();
  private readonly edgeRuntime: EdgeRuntime[] = edges.map((e) => ({ ...e, progress: 0 }));
  private readonly lineGroups = new Map<
    EdgeKind,
    { mesh: LineSegments; material: LineBasicMaterial; indices: number[]; baseOpacity: number }
  >();
  private readonly ro: ResizeObserver;
  private readonly startTime = performance.now();

  private nebula!: ShaderMaterial;
  private fieldMaterial!: ShaderMaterial;
  private constellationMaterial!: ShaderMaterial;
  private constellationPoints!: Points;
  private width = 1;
  private height = 1;
  private scroll = 0;
  /** Constellation brightness; lower on narrow screens, where it sits behind the title. */
  private figureOpacity = 1;
  private running = false;
  private ambient: gsap.core.Tween | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly container: HTMLElement,
    /**
     * The SVG fallback constellation. Its on-screen box (through its viewBox, in which the
     * figure spans 0–100) tells the scene where to draw, so layout stays in CSS.
     */
    private readonly layoutSvg: SVGSVGElement,
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor('#070b14');
    this.camera.position.set(0, 0, CAMERA_Z);

    this.buildNebula();
    this.buildStarfield();
    this.buildConstellation();
    this.scene.add(this.constellation);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();

    container.addEventListener('pointermove', this.onPointerMove);
    container.addEventListener('pointerleave', this.onPointerLeave);
    canvas.addEventListener('click', this.onClick);
  }

  /* ───────────── public API ───────────── */

  /** Fade in the field, then draw the constellation line by line. */
  playIntro(): gsap.core.Timeline {
    const field = this.fieldMaterial.uniforms;
    const con = this.constellationMaterial.uniforms;
    const tl = gsap.timeline();
    tl.to(field['uReveal']!, { value: 1.1, duration: 2.4, ease: 'power2.out' }, 0);
    tl.to(this.nebula.uniforms['uIntensity']!, { value: 1, duration: 2.6, ease: 'power2.out' }, 0);
    tl.to(con['uReveal']!, { value: 1.1, duration: 3.6, ease: 'power1.inOut' }, 0.5);
    tl.to(
      this.edgeRuntime,
      {
        progress: 1,
        duration: 0.55,
        ease: 'power2.inOut',
        stagger: 0.13,
        onUpdate: () => this.updateLines(),
      },
      0.7,
    );
    return tl;
  }

  /** 0 → 1 as the hero scrolls away: the camera flies into the stars and the figure fades. */
  setScroll(progress: number): void {
    this.scroll = progress;
  }

  setActive(active: boolean): void {
    if (active === this.running) return;
    this.running = active;
    if (active) {
      gsap.ticker.add(this.tick);
      this.scheduleAmbientShootingStar();
    } else {
      gsap.ticker.remove(this.tick);
      this.ambient?.kill();
    }
  }

  destroy(): void {
    this.setActive(false);
    this.ro.disconnect();
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerleave', this.onPointerLeave);
    this.canvas.removeEventListener('click', this.onClick);
    this.scene.traverse((obj) => {
      if ('geometry' in obj && obj.geometry instanceof BufferGeometry) obj.geometry.dispose();
      if ('material' in obj && obj.material instanceof ShaderMaterial) obj.material.dispose();
    });
    this.renderer.dispose();
  }

  /* ───────────── scene building ───────────── */

  private buildNebula(): void {
    this.nebula = new ShaderMaterial({
      vertexShader: nebulaVertex,
      fragmentShader: nebulaFragment,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2() },
        uAspect: { value: 1 },
        uIntensity: { value: 0 },
      },
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), this.nebula);
    quad.frustumCulled = false;
    quad.renderOrder = -1;
    this.scene.add(quad);
  }

  private starMaterial(): ShaderMaterial {
    return new ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: 1 },
        uMouse: { value: this.mouse },
        uAspect: { value: 1 },
        uReveal: { value: 0 },
        uScale: { value: 1 },
        uTwinkle: { value: 1 },
        uOpacity: { value: 1 },
      },
    });
  }

  private buildStarfield(): void {
    const count = 2600;
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const color = new Float32Array(count * 3);
    const sparkle = new Float32Array(count);
    const order = new Float32Array(count);
    const halfFov = Math.tan(((FOV / 2) * Math.PI) / 180);

    for (let i = 0; i < count; i++) {
      const dist = 6 + Math.random() ** 1.4 * 70; // distance from the camera
      const halfH = dist * halfFov * 1.35; // overscan so parallax never shows an edge
      pos[i * 3] = (Math.random() * 2 - 1) * halfH * 2;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * halfH;
      pos[i * 3 + 2] = CAMERA_Z - dist;
      size[i] = 3 + Math.random() ** 3 * 10;
      phase[i] = Math.random();
      const tint = Math.random() < 0.14 ? PALETTE.warm : Math.random() < 0.3 ? PALETTE.cool : PALETTE.white;
      tint.toArray(color, i * 3);
      sparkle[i] = Math.random() < 0.012 ? 1 : 0;
      order[i] = Math.random();
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new BufferAttribute(phase, 1));
    geo.setAttribute('aColor', new BufferAttribute(color, 3));
    geo.setAttribute('aSparkle', new BufferAttribute(sparkle, 1));
    geo.setAttribute('aOrder', new BufferAttribute(order, 1));
    this.fieldMaterial = this.starMaterial();
    const points = new Points(geo, this.fieldMaterial);
    points.frustumCulled = false;
    this.scene.add(points);
  }

  private buildConstellation(): void {
    const names = Object.keys(stars) as StarName[];
    // Real stars, plus a dusting of tiny stars along the horn so it glimmers.
    const hornDust = 16;
    const count = names.length + hornDust;
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const color = new Float32Array(count * 3);
    const sparkle = new Float32Array(count);
    const order = new Float32Array(count);

    names.forEach((name, i) => {
      size[i] = stars[name].size * 11;
      phase[i] = Math.random();
      PALETTE.warm.toArray(color, i * 3);
      sparkle[i] = sparkles.includes(name) ? 1 : 0;
      order[i] = (i / names.length) * 0.85;
    });
    for (let j = 0; j < hornDust; j++) {
      const i = names.length + j;
      size[i] = 4 + Math.random() * 4;
      phase[i] = Math.random();
      PALETTE.gold.toArray(color, i * 3);
      order[i] = 0.05 + (j / hornDust) * 0.2;
    }
    geo.setAttribute('aSize', new BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new BufferAttribute(phase, 1));
    geo.setAttribute('aColor', new BufferAttribute(color, 3));
    geo.setAttribute('aSparkle', new BufferAttribute(sparkle, 1));
    geo.setAttribute('aOrder', new BufferAttribute(order, 1));

    this.constellationMaterial = this.starMaterial();
    this.constellationPoints = new Points(geo, this.constellationMaterial);
    this.constellationPoints.frustumCulled = false;
    this.constellation.add(this.constellationPoints);

    // One LineSegments per edge kind, so each can have its own material.
    (['horn', 'outline', 'mane'] as const).forEach((kind) => {
      const indices = this.edgeRuntime.flatMap((e, i) => (e.kind === kind ? [i] : []));
      const g = new BufferGeometry();
      g.setAttribute('position', new BufferAttribute(new Float32Array(indices.length * 6), 3));
      const { color: c, opacity } = EDGE_STYLE[kind];
      const material =
        kind === 'mane'
          ? new LineDashedMaterial({ color: c, opacity, transparent: true, dashSize: 0.06, gapSize: 0.12 })
          : new LineBasicMaterial({ color: c, opacity, transparent: true });
      material.blending = AdditiveBlending;
      material.depthWrite = false;
      const mesh = new LineSegments(g, material);
      mesh.frustumCulled = false;
      this.constellation.add(mesh);
      this.lineGroups.set(kind, { mesh, material, indices, baseOpacity: opacity });
    });
  }

  /* ───────────── layout ───────────── */

  /** Convert a viewport pixel to world space on the z = 0 plane (camera at rest). */
  private pxToWorld(x: number, y: number, rect: DOMRect): Vector3 {
    const halfH = Math.tan(((FOV / 2) * Math.PI) / 180) * CAMERA_Z;
    const halfW = halfH * this.camera.aspect;
    const nx = ((x - rect.left) / rect.width) * 2 - 1;
    const ny = -(((y - rect.top) / rect.height) * 2 - 1);
    return new Vector3(nx * halfW, ny * halfH, 0);
  }

  private resize(): void {
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    const aspect = this.width / this.height;
    this.nebula.uniforms['uAspect']!.value = aspect;
    for (const m of [this.fieldMaterial, this.constellationMaterial]) {
      m.uniforms['uPixelRatio']!.value = dpr;
      m.uniforms['uAspect']!.value = aspect;
    }
    // Scale constellation stars with the figure so they read the same on phones and big screens.
    this.constellationMaterial.uniforms['uScale']!.value = Math.min(1.15, Math.max(0.6, this.height / 900));

    this.figureOpacity = this.width < 900 ? 0.55 : 1;

    this.layoutConstellation(rect);
  }

  private layoutConstellation(containerRect: DOMRect): void {
    const box = this.layoutSvg.getBoundingClientRect();
    const vb = this.layoutSvg.viewBox.baseVal;
    const toPx = (u: number, v: number) => ({
      x: box.left + ((u * 100 - vb.x) / vb.width) * box.width,
      y: box.top + ((v * 100 - vb.y) / vb.height) * box.height,
    });
    const names = Object.keys(stars) as StarName[];
    const attr = this.constellationPoints.geometry.getAttribute('position') as BufferAttribute;
    names.forEach((name, i) => {
      const s = stars[name];
      const px = toPx(s.x, s.y);
      const v = this.pxToWorld(px.x, px.y, containerRect);
      this.starPositions.set(name, v);
      attr.setXYZ(i, v.x, v.y, v.z);
    });
    // horn dust, scattered along the horn
    const tip = this.starPositions.get('hornTip')!;
    const base = this.starPositions.get('hornBase')!;
    for (let j = 0; j < attr.count - names.length; j++) {
      const t = Math.random();
      const p = tip.clone().lerp(base, t);
      const spread = 0.05 * (1 - t * 0.5);
      attr.setXYZ(
        names.length + j,
        p.x + (Math.random() - 0.5) * spread,
        p.y + (Math.random() - 0.5) * spread,
        0.01,
      );
    }
    attr.needsUpdate = true;
    this.updateLines();
  }

  private updateLines(): void {
    for (const { mesh, material, indices } of this.lineGroups.values()) {
      const attr = mesh.geometry.getAttribute('position') as BufferAttribute;
      indices.forEach((edgeIndex, k) => {
        const edge = this.edgeRuntime[edgeIndex]!;
        const a = this.starPositions.get(edge.from);
        const b = this.starPositions.get(edge.to);
        if (!a || !b) return;
        const end = a.clone().lerp(b, edge.progress);
        attr.setXYZ(k * 2, a.x, a.y, a.z);
        attr.setXYZ(k * 2 + 1, end.x, end.y, end.z);
      });
      attr.needsUpdate = true;
      if (material instanceof LineDashedMaterial) mesh.computeLineDistances();
    }
  }

  /* ───────────── interaction ───────────── */

  private readonly onPointerMove = (e: PointerEvent): void => {
    const r = this.container.getBoundingClientRect();
    this.mouseTarget.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -(((e.clientY - r.top) / r.height) * 2 - 1),
    );
  };

  private readonly onPointerLeave = (): void => {
    this.mouseTarget.set(10, 10);
  };

  private readonly onClick = (e: MouseEvent): void => {
    const r = this.container.getBoundingClientRect();
    const ndc = new Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -(((e.clientY - r.top) / r.height) * 2 - 1),
    );
    for (let i = 0; i < 3; i++) gsap.delayedCall(i * 0.12, () => this.shootingStar(ndc));
  };

  private scheduleAmbientShootingStar(): void {
    this.ambient = gsap.delayedCall(4 + Math.random() * 6, () => {
      this.shootingStar(new Vector2(Math.random() * 2 - 1, 0.2 + Math.random() * 0.8));
      this.scheduleAmbientShootingStar();
    });
  }

  /** A streak with a bright head and a fading tail, launched from a screen point. */
  private shootingStar(ndc: Vector2): void {
    const ray = new Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const start = new Vector3();
    if (!ray.ray.intersectPlane(new Plane(new Vector3(0, 0, 1), 4), start)) return;

    const angle = Math.PI * (0.12 + Math.random() * 0.12);
    const dir = new Vector3(Math.cos(angle) * (Math.random() < 0.5 ? -1 : 1), -Math.sin(angle), 0);
    const length = 1.6 + Math.random();

    const geo = new BufferGeometry();
    const pos = new Float32Array(6);
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    geo.setAttribute('color', new BufferAttribute(new Float32Array([1, 0.97, 0.88, 0.05, 0.04, 0.02]), 3));
    const mat = new LineBasicMaterial({ vertexColors: true, transparent: true, blending: AdditiveBlending });
    const line = new Line(geo, mat);
    line.frustumCulled = false;
    this.scene.add(line);

    const state = { t: 0, fade: 1 };
    gsap
      .timeline({
        onComplete: () => {
          this.scene.remove(line);
          geo.dispose();
          mat.dispose();
        },
      })
      .to(state, {
        t: 1,
        duration: 0.9,
        ease: 'power1.in',
        onUpdate: () => {
          const head = start.clone().addScaledVector(dir, state.t * 6);
          const tail = head.clone().addScaledVector(dir, -length * Math.min(1, state.t * 3));
          pos.set([head.x, head.y, head.z, tail.x, tail.y, tail.z]);
          geo.attributes['position']!.needsUpdate = true;
        },
      })
      .to(mat, { opacity: 0, duration: 0.35 }, '-=0.35');
  }

  /* ───────────── frame ───────────── */

  private readonly tick = (): void => {
    const time = (performance.now() - this.startTime) / 1000;

    // ease the mouse and camera toward their targets
    this.mouse.lerp(this.mouseTarget, 0.08);
    const hovering = this.mouseTarget.x < 5;
    this.parallax.lerp(hovering ? this.mouseTarget : new Vector2(), 0.04);
    this.camera.position.set(this.parallax.x * 0.6, this.parallax.y * 0.4, CAMERA_Z - this.scroll * 6);
    this.camera.lookAt(0, 0, -40);

    this.nebula.uniforms['uTime']!.value = time;
    (this.nebula.uniforms['uMouse']!.value as Vector2).copy(this.parallax);
    this.fieldMaterial.uniforms['uTime']!.value = time;
    this.constellationMaterial.uniforms['uTime']!.value = time;

    const fade = (1 - Math.min(1, this.scroll * 1.6)) * this.figureOpacity;
    this.constellationMaterial.uniforms['uOpacity']!.value = fade;
    for (const group of this.lineGroups.values()) group.material.opacity = group.baseOpacity * fade;

    this.renderer.render(this.scene, this.camera);
  };
}
