"use client";
import { useEffect, useRef } from 'react';

export default function ConfettiBurst({ durationMs = 2000 }: { durationMs?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const context: CanvasRenderingContext2D = ctx;
    let raf = 0;
    let start = performance.now();
    const particles = Array.from({ length: 120 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 4,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * -6 - 4,
      g: 0.18 + Math.random() * 0.06,
      w: 4 + Math.random() * 4,
      h: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      color: randomColor(),
    }));

    function step(t: number) {
      const elapsed = t - start;
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        context.save();
        context.translate(p.x, p.y);
        context.rotate(p.rot);
        context.fillStyle = p.color;
        context.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        context.restore();
      });
      if (elapsed < durationMs) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(200, Math.floor(rect.height * 0.5));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [durationMs]);

  return <canvas ref={canvasRef} className="w-full h-48" />;
}

function randomColor() {
  const palette = ['#f97316', '#ea580c', '#0b0b0b', '#ffffff'];
  return palette[Math.floor(Math.random() * palette.length)];
}
