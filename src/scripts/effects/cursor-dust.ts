/**
 * A trail of gold dust behind the mouse cursor, drawn on a fixed full-screen canvas.
 * The loop only runs while particles are alive.
 */
import { hasFinePointer, prefersReducedMotion } from '@/scripts/core/env';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
}

const MAX_PARTICLES = 160;
const SPACING_PX = 8;

export function initCursorDust(canvas: HTMLCanvasElement): void {
  if (!hasFinePointer() || prefersReducedMotion()) {
    canvas.remove();
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles: Particle[] = [];
  let running = false;
  let last = { x: 0, y: 0 };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const frame = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.01;
      p.life -= 0.022;
      const life = Math.max(p.life, 0);
      ctx.fillStyle = `rgb(241 217 154 / ${life * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * life, 0, Math.PI * 2);
      ctx.fill();
    }
    particles = particles.filter((p) => p.life > 0);
    if (particles.length) requestAnimationFrame(frame);
    else running = false;
  };

  const onMove = (e: PointerEvent) => {
    const distance = Math.hypot(e.clientX - last.x, e.clientY - last.y);
    last = { x: e.clientX, y: e.clientY };
    const spawn = Math.min(3, Math.floor(distance / SPACING_PX));
    for (let i = 0; i < spawn; i++) {
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 6,
        y: e.clientY + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.6 + 0.2,
        r: Math.random() * 1.4 + 0.4,
        life: 1,
      });
    }
    if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  };

  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', onMove, { passive: true });
}
