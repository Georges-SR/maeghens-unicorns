/**
 * GLSL for the hero sky. Kept as plain strings so they live next to the scene code
 * without extra build tooling.
 */

/** Full-screen nebula: drifting fractal noise in lapis, teal and a breath of gold. */
export const nebulaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

export const nebulaFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uIntensity;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);
    p += uMouse * 0.04;
    float t = uTime * 0.018;
    vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 4.0));
    float n = fbm(p * 2.2 + q * 1.4 + vec2(t * 0.6, -t));

    vec3 ink    = vec3(0.027, 0.043, 0.078);
    vec3 lapis  = vec3(0.16, 0.26, 0.48);
    vec3 teal   = vec3(0.05, 0.20, 0.20);
    vec3 gold   = vec3(0.79, 0.64, 0.36);

    vec3 col = ink;
    col = mix(col, lapis, smoothstep(0.35, 0.85, n) * 0.55);
    col = mix(col, teal, smoothstep(0.45, 0.9, q.x) * 0.35);
    col += gold * pow(smoothstep(0.62, 0.95, n * q.y * 1.6), 2.0) * 0.12;

    // keep the left (where the title sits) calmer, glow toward the constellation on the right
    float glow = smoothstep(1.1, 0.0, length(p - vec2(0.45 * uAspect * 0.5, 0.05)));
    col += lapis * glow * 0.18;

    // vignette and fade to page colour at the bottom edge
    col *= smoothstep(1.25, 0.25, length(p * vec2(0.8, 1.1)));
    col = mix(ink, col, uIntensity * smoothstep(0.0, 0.35, vUv.y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Point stars, shared by the background field and the constellation.
 * aSize: base size · aPhase: twinkle phase · aColor: tint · aSparkle: 1 = draw cross rays
 * aOrder: 0..1 order of appearance (compared to uReveal).
 */
export const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  attribute float aSparkle;
  attribute float aOrder;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uReveal;
  uniform float uScale;
  uniform float uTwinkle;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSparkle;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    vec2 ndc = gl_Position.xy / gl_Position.w;
    float d = length((ndc - uMouse) * vec2(uAspect, 1.0));
    float near = smoothstep(0.32, 0.0, d);

    float twinkle = mix(1.0, 0.6 + 0.4 * sin(uTime * (0.8 + aPhase) + aPhase * 6.2831), uTwinkle);
    float appear = smoothstep(aOrder, aOrder + 0.08, uReveal);

    vColor = aColor;
    vSparkle = aSparkle;
    vAlpha = twinkle * appear + near * 0.6 * appear;
    gl_PointSize = aSize * uScale * uPixelRatio * (1.0 + near * 0.9) * (12.0 / -mv.z) * (0.4 + 0.6 * appear);
  }
`;

export const starFragment = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vSparkle;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float r = length(p);
    float core = smoothstep(0.12, 0.0, r);
    float halo = pow(smoothstep(0.5, 0.0, r), 2.6) * 0.55;
    float rays = vSparkle * (
      smoothstep(0.03, 0.0, abs(p.x)) * smoothstep(0.5, 0.0, abs(p.y)) +
      smoothstep(0.03, 0.0, abs(p.y)) * smoothstep(0.5, 0.0, abs(p.x))
    ) * 0.9;
    float a = (core + halo + rays) * vAlpha * uOpacity;
    if (a < 0.003) discard;
    gl_FragColor = vec4(mix(vColor, vec3(1.0, 0.97, 0.88), core), a);
  }
`;
