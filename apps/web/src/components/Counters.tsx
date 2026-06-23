"use client";
import { counters } from "@/data/profile";
import { useCountUp } from "@/hooks/useCountUp";

function Counter({ label, value, suffix, color }: (typeof counters)[number]) {
  const { value: n, ref } = useCountUp<HTMLDivElement>(value, 1500);
  return (
    <div
      ref={ref}
      className="p-5 text-center"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(176,38,255,0.18)",
        clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))",
      }}
    >
      <div
        className="font-black"
        style={{ fontFamily: "var(--font-title), sans-serif", fontSize: 32, color }}
      >
        {n.toLocaleString()}
        {suffix ?? ""}
      </div>
      <div
        className="mt-1 text-[10px] tracking-[2px]"
        style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8" }}
      >
        {label}
      </div>
    </div>
  );
}

export function Counters() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 [@media(min-width:560px)]:grid-cols-2 [@media(min-width:900px)]:grid-cols-4">
      {counters.map((c) => (
        <Counter key={c.label} {...c} />
      ))}
    </div>
  );
}
