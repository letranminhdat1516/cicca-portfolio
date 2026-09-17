"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useCountUp<T extends HTMLElement>(target: number, durationMs = 1500) {
  const ref = useRef<T>(null);
  // Start at the real value so the server-rendered HTML (what crawlers and LLMs
  // read) carries the number; the count-up only replays it once in view.
  const [value, setValue] = useState(target);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    let started = false;
    let startTime = 0;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(animate);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            raf = requestAnimationFrame(animate);
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [target, durationMs, reduced]);

  return { value, ref };
}
