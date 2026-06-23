"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function XpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  const reduced = useReducedMotion();
  const [fill, setFill] = useState(reduced ? pct : 0);

  useEffect(() => {
    if (reduced) {
      setFill(pct);
      return;
    }
    const t = setTimeout(() => setFill(pct), 120);
    return () => clearTimeout(t);
  }, [pct, reduced]);

  return (
    <div className="w-full">
      <div
        className="mb-1 flex justify-between text-[10px] tracking-widest"
        style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8" }}
      >
        <span>XP</span>
        <span>
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div
        className="h-[8px] w-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(176,38,255,0.25)" }}
      >
        <div
          className="h-full"
          style={{
            width: `${fill}%`,
            background: "linear-gradient(135deg,#22d3ee,#b026ff)",
            boxShadow: "0 0 12px rgba(176,38,255,0.5)",
            transition: "width 2s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </div>
  );
}
