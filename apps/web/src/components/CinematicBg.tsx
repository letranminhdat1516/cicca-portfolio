"use client";
import { useRef } from "react";
import { useParticles } from "@/hooks/useParticles";

export function CinematicBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef, 70);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%,rgba(176,38,255,0.14),transparent 55%),radial-gradient(ellipse at 100% 100%,rgba(34,211,238,0.10),transparent 50%),#08070f",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(176,38,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.06) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "gridPan 14s linear infinite",
          maskImage: "radial-gradient(ellipse at 50% 30%,#000 30%,transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%,#000 30%,transparent 85%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg,rgba(0,0,0,0.16) 0px,rgba(0,0,0,0.16) 1px,transparent 1px,transparent 3px)",
          opacity: 0.5,
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          height: 140,
          background:
            "linear-gradient(180deg,transparent,rgba(34,211,238,0.07),transparent)",
          animation: "scan 7s linear infinite",
        }}
      />
    </div>
  );
}
