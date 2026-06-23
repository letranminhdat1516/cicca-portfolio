"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const onEnter = () => {
      el.style.transition = "transform 0.1s ease";
    };
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateZ(0)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 0.4s ease";
      el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max, reduced]);

  return ref;
}
