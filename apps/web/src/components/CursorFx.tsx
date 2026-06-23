"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Signature cursor: a reticle ring that eases toward the pointer + a fading
// particle trail. Disabled on touch devices and when reduced motion is set.
export function CursorFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === "undefined" || "ontouchstart" in window) return;
    const canvas = canvasRef.current;
    const reticle = reticleRef.current;
    if (!canvas || !reticle) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    const trail: { x: number; y: number; a: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      reticle.style.opacity = "1";
      trail.push({ x: mx, y: my, a: 1 });
      if (trail.length > 22) trail.shift();
    };
    const onOut = () => {
      reticle.style.opacity = "0";
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      reticle.style.transform = `translate(${rx}px, ${ry}px)`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of trail) {
        p.a *= 0.92;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${p.a})`;
        ctx.shadowColor = "rgba(34,211,238,0.9)";
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
    };
  }, [reduced]);

  return (
    <>
      <div
        ref={reticleRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          width: 34,
          height: 34,
          margin: "-17px 0 0 -17px",
          border: "1px solid rgba(34,211,238,0.6)",
          borderRadius: "50%",
          boxShadow: "0 0 12px rgba(34,211,238,0.45)",
          opacity: 0,
          transition: "opacity 0.3s",
          mixBlendMode: "screen",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9997] h-full w-full"
      />
    </>
  );
}
