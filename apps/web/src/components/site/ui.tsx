import type { CSSProperties, ReactNode } from "react";
import { ACCENT } from "@/data/home";

export const MONO: CSSProperties = { fontFamily: "var(--font-jetbrains), ui-monospace, monospace" };

export const PANEL: CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(111,168,255,0.3)",
  background: "rgba(10,16,52,0.75)",
};

/** Blue-to-violet gradient fill for one or two words of a headline ("AI-Native"). */
export const GRADIENT_TEXT: CSSProperties = {
  background: "linear-gradient(90deg,#5FC0FF,#3D6BFF 60%,#8A6BFF)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Fill for primary buttons: the hero's blue-to-violet, a touch deeper so white text stays readable. */
export const BUTTON_GRADIENT = "linear-gradient(100deg,#2F7BFF,#3D5BFF 50%,#7B5CFF)";


/** Small mono kicker above a section heading ("01 · SELECTED WORK"). */
export function Eyebrow({ children, color = "#6FA8FF" }: { children: ReactNode; color?: string }) {
  return (
    <span style={{ ...MONO, fontSize: 12, letterSpacing: "0.1em", color }}>{children}</span>
  );
}

/** The tilted accent block behind one word of a heading. */
export function Highlight({ children, big = false }: { children: ReactNode; big?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: ACCENT,
        color: "#FFFFFF",
        padding: big ? "0 16px 6px" : "0 14px 4px",
        borderRadius: big ? "10px 22px 12px 26px" : "10px 20px 12px 22px",
        transform: "rotate(-2deg)",
        boxShadow: "0 0 30px rgba(47,123,255,0.6)",
      }}
    >
      {children}
    </span>
  );
}

export const H2: CSSProperties = {
  margin: 0,
  fontWeight: 800,
  fontSize: "clamp(34px, 4.5vw, 54px)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
};

export const PILL_OUTLINE: CSSProperties = {
  textDecoration: "none",
  fontSize: 14,
  padding: "10px 20px",
  borderRadius: 999,
  border: "1px solid rgba(111,168,255,0.55)",
};

export function Beam() {
  return <div className="beam" aria-hidden="true" style={{ maxWidth: 900, margin: "60px auto 0" }} />;
}

export function Tag({ children, size = 12 }: { children: ReactNode; size?: number }) {
  return (
    <span style={{ fontSize: size, padding: "3px 10px", borderRadius: 999, background: "rgba(47,107,255,0.2)", color: "#9CC2FF" }}>
      {children}
    </span>
  );
}

const svg = { "aria-hidden": true, viewBox: "0 0 24 24" } as const;

export function PlayIcon({ size = 10, color = "#DCE4FF" }: { size?: number; color?: string }) {
  return (
    <svg {...svg} width={size} height={size} fill={color}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function FolderIcon({ size = 18, fill = "none", stroke = "#8C97B8", width = 1.5 }: { size?: number; fill?: string; stroke?: string; width?: number }) {
  return (
    <svg {...svg} width={size} height={size} fill={fill} stroke={stroke} strokeWidth={width} strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg {...svg} width={18} height={18} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  );
}

export function LinkedinIcon() {
  return (
    <svg {...svg} width={18} height={18} fill="currentColor">
      <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h2.9v1.7c.4-.8 1.4-1.9 3.3-1.9 3.2 0 3.8 2.1 3.8 4.8V21h-3v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V21H9z" />
    </svg>
  );
}

export function DocIcon() {
  return (
    <svg {...svg} width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg {...svg} width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function LinkOutIcon() {
  return (
    <svg {...svg} width={15} height={15} fill="none" stroke="#6FA8FF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg role="img" aria-label="Private" viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="#8C97B8" strokeWidth={1.8} strokeLinecap="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
