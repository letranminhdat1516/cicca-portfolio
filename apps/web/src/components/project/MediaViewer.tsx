"use client";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { ACCENT } from "@/data/home";
import { MONO, PlayIcon } from "@/components/site/ui";

export interface MediaItem {
  kind: "VIDEO" | "IMAGE";
  label: string;
  short: string;
  /** Screenshot to show; without one the stage draws the glyph/play placeholder. */
  src?: string;
  alt?: string;
}

/**
 * Big media stage + thumbnail picker (ARIA tabs, arrow keys move between thumbnails).
 * A single item gets the stage only — no picker.
 */
export function MediaViewer({ items, glyph }: { items: MediaItem[]; glyph: string }) {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = items[sel] ?? items[0];
  if (!current) return null;
  const multi = items.length > 1;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : delta ? (i + delta + items.length) % items.length : -1;
    if (to < 0) return;
    e.preventDefault();
    setSel(to);
    tabs.current[to]?.focus();
  };

  return (
    <section
      aria-label="Project media"
      style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 72px", display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div
        id="media-panel"
        role={multi ? "tabpanel" : "group"}
        aria-label={current.label}
        className="ph"
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          borderRadius: 28,
          overflow: "hidden",
          border: "1px solid rgba(111,168,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {current.src ? (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt ?? current.label}
            fill
            priority={sel === 0}
            sizes="(max-width: 1240px) 100vw, 1192px"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        ) : current.kind === "VIDEO" ? (
          <span
            aria-hidden="true"
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 40px -16px rgba(47,123,255,0.6)",
            }}
          >
            <PlayIcon size={34} color="#FFFFFF" />
          </span>
        ) : (
          <span aria-hidden="true" style={{ ...MONO, fontSize: "clamp(40px, 6vw, 72px)", color: "rgba(232,238,255,0.35)" }}>
            {glyph}
          </span>
        )}
        <span
          style={{
            ...MONO,
            position: "absolute",
            left: 24,
            bottom: 20,
            background: "rgba(10,16,52,0.7)",
            borderRadius: 999,
            padding: "8px 16px",
            fontSize: 13,
          }}
        >
          {current.label}
        </span>
        <span
          style={{
            ...MONO,
            position: "absolute",
            right: 24,
            bottom: 20,
            background: "#0A1034",
            color: "#C9D4F2",
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 12,
          }}
        >
          {current.kind} · {sel + 1} / {items.length}
        </span>
      </div>
      {multi && (
        <div
          role="tablist"
          aria-label="Choose media"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(150px, 100%), 1fr))", gap: 12 }}
        >
          {items.map((m, i) => (
            <button
              key={m.short}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={i === sel}
              aria-controls="media-panel"
              tabIndex={i === sel ? 0 : -1}
              onClick={() => setSel(i)}
              onKeyDown={(e) => onKey(e, i)}
              className="ph btn-reset"
              style={{
                aspectRatio: "16 / 10",
                borderRadius: 16,
                border: i === sel ? `2px solid ${ACCENT}` : "1px solid rgba(111,168,255,0.25)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {m.src && (
                <Image src={m.src} alt="" fill sizes="200px" style={{ objectFit: "cover", objectPosition: "top", opacity: i === sel ? 1 : 0.7 }} />
              )}
              {m.kind === "VIDEO" && <PlayIcon size={26} color="#E8EEFF" />}
              <span
                style={{
                  ...MONO,
                  position: "absolute",
                  left: 10,
                  bottom: 8,
                  fontSize: 11,
                  color: "#C9D4F2",
                  ...(m.src ? { background: "rgba(3,6,26,0.75)", borderRadius: 999, padding: "2px 8px" } : {}),
                }}
              >
                {m.short}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
