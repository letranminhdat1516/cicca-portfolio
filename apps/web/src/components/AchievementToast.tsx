"use client";
import { useEffect, useRef, useState } from "react";

// Fires the "ACHIEVEMENT UNLOCKED" toast once, when the trophies section scrolls
// into view. The sentinel is rendered at the top of the Trophies section.
export function AchievementToast({ title }: { title: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !fired) {
            fired = true;
            setShow(true);
            setTimeout(() => setShow(false), 4000);
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute left-0 top-20 h-px w-px" />
      {show && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[9999] min-w-[280px] p-4"
          style={{
            background:
              "linear-gradient(135deg,rgba(28,20,8,0.92),rgba(12,8,18,0.92))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,210,63,0.5)",
            clipPath:
              "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
            boxShadow:
              "0 0 30px rgba(255,210,63,0.25),inset 0 0 20px rgba(255,210,63,0.08)",
            animation: "toastIn 4s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            className="text-[10px] tracking-[3px]"
            style={{ fontFamily: "var(--font-mono), monospace", color: "#ffd23f", textShadow: "0 0 10px rgba(255,210,63,0.7)" }}
          >
            ★ ACHIEVEMENT UNLOCKED
          </div>
          <div
            className="mt-1 text-[15px] font-semibold text-white"
            style={{ fontFamily: "var(--font-ui), sans-serif" }}
          >
            {title}
          </div>
        </div>
      )}
    </>
  );
}
