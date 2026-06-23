"use client";
import { useEffect, useRef } from "react";
import type { Stat } from "@portfolio/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function RadarChart({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (stats.length === 0) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 440;
    const H = 380;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2 + 6;
    const R = 130;
    const n = stats.length;
    const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

    let raf = 0;
    let progress = reduced ? 1 : 0;
    let started = false;
    let t0 = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // rings
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const a = angle(i % n);
          const r = (R * ring) / 4;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(176,38,255,0.12)";
        ctx.stroke();
      }

      // spokes + labels
      ctx.font = "10px monospace";
      for (let i = 0; i < n; i++) {
        const a = angle(i);
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "rgba(34,211,238,0.12)";
        ctx.stroke();
        ctx.fillStyle = "#9a9ab8";
        ctx.textAlign = "center";
        ctx.fillText(stats[i].label, cx + Math.cos(a) * (R + 22), cy + Math.sin(a) * (R + 22) + 3);
      }

      // value polygon
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const a = angle(idx);
        const r = (R * stats[idx].value * progress) / 100;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      grad.addColorStop(0, "rgba(34,211,238,0.4)");
      grad.addColorStop(1, "rgba(176,38,255,0.4)");
      ctx.fillStyle = grad;
      ctx.strokeStyle = "rgba(34,211,238,0.8)";
      ctx.fill();
      ctx.stroke();

      // vertices
      for (let i = 0; i < n; i++) {
        const a = angle(i);
        const r = (R * stats[i].value * progress) / 100;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#b026ff";
        ctx.fill();
      }
    };

    const animate = (now: number) => {
      if (!t0) t0 = now;
      const t = Math.min((now - t0) / 1100, 1);
      progress = 1 - Math.pow(1 - t, 3);
      draw();
      if (t < 1) raf = requestAnimationFrame(animate);
    };

    if (reduced) {
      draw();
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            raf = requestAnimationFrame(animate);
            obs.unobserve(canvas);
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(canvas);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [reduced, stats]);

  return <canvas ref={ref} aria-label="Skill radar chart" className="mx-auto" />;
}
