"use client";
import { useState } from "react";
import { ACCENT, PEEK_CELLS, SNEAK_PEEK } from "@/data/home";
import { MONO } from "./ui";

/** A pixel mosaic that hides the next tool until the visitor asks to see it. */
export function SneakPeek() {
  const [revealed, setRevealed] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn-reset"
        aria-pressed={revealed}
        aria-controls="sneak-peek"
        onClick={() => setRevealed((r) => !r)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          alignSelf: "flex-start",
          background: ACCENT,
          color: "#FFFFFF",
          padding: "12px 20px",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 500,
          boxShadow: "0 0 24px rgba(47,123,255,0.6)",
        }}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 3l18 18" />
          <path d="M10.6 6.1A10 10 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.6 3.2M6.6 6.6C4.3 8.2 3 12 3 12s4 6 9 6a9 9 0 0 0 4.4-1.2" />
        </svg>
        {revealed ? SNEAK_PEEK.shownLabel : SNEAK_PEEK.hiddenLabel}
      </button>
      <div id="sneak-peek" aria-live="polite">
        {revealed ? (
          <a
            href={SNEAK_PEEK.href}
            target="_blank"
            rel="noopener"
            style={{
              textDecoration: "none",
              aspectRatio: "4 / 3",
              borderRadius: 16,
              background: "linear-gradient(140deg,rgba(47,107,255,0.45),rgba(91,75,230,0.35))",
              border: "1px solid rgba(111,168,255,0.5)",
              padding: 26,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <span
              style={{
                ...MONO,
                alignSelf: "flex-start",
                background: "#FFFFFF",
                color: "#1C3FD6",
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              {SNEAK_PEEK.badge}
            </span>
            <span style={{ fontWeight: 800, fontSize: 28, lineHeight: 1.05 }}>{SNEAK_PEEK.title}</span>
            <span style={{ fontSize: 14, color: "#DCE4FF" }}>{SNEAK_PEEK.body}</span>
          </a>
        ) : (
          <div
            aria-hidden="true"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              aspectRatio: "4 / 3",
              borderRadius: 16,
              overflow: "hidden",
              background: "#0B1233",
            }}
          >
            {PEEK_CELLS.map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
