"use client";
import { useState } from "react";
import type { FieldSpec } from "@/lib/adminSchema";

const base = "w-full rounded-md px-3 py-2 text-sm outline-none transition-colors";
const baseStyle = {
  background: "#0a0a12",
  border: "1px solid rgba(176,38,255,0.22)",
  color: "#e8e8f0",
} as const;
const mono = { fontFamily: "var(--font-mono), monospace" } as const;

function focus(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = "#22d3ee";
}
function blur(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = "rgba(176,38,255,0.22)";
}

export function Field({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${spec.full ? "sm:col-span-2" : ""}`}>
      <span className="text-[10px] tracking-[2px]" style={{ ...mono, color: "#9a9ab8" }}>
        {spec.label}
      </span>
      <Control spec={spec} value={value} onChange={onChange} />
    </label>
  );
}

function Control({ spec, value, onChange }: { spec: FieldSpec; value: unknown; onChange: (v: unknown) => void }) {
  switch (spec.type) {
    case "textarea":
      return <textarea className={base} style={baseStyle} rows={3} placeholder={spec.placeholder} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />;
    case "markdown":
      return <textarea className={base} style={{ ...baseStyle, ...mono }} rows={9} placeholder={spec.placeholder ?? "## Markdown"} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />;
    case "number":
      return <input type="number" className={base} style={baseStyle} value={Number(value ?? 0)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} onFocus={focus} onBlur={blur} />;
    case "select":
      return (
        <select className={base} style={baseStyle} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur}>
          {!spec.options?.includes(String(value)) && <option value="">—</option>}
          {spec.options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    case "boolean":
      return (
        <button type="button" onClick={() => onChange(!value)} className="flex w-fit items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ ...baseStyle, color: value ? "#4ade80" : "#9a9ab8" }}>
          <span className="inline-block h-4 w-8 rounded-full p-0.5" style={{ background: value ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)" }}>
            <span className="block h-3 w-3 rounded-full transition-transform" style={{ background: value ? "#4ade80" : "#6b6b88", transform: value ? "translateX(16px)" : "none" }} />
          </span>
          {value ? "ON" : "OFF"}
        </button>
      );
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" className="h-9 w-11 cursor-pointer rounded-md" style={{ background: "#0a0a12", border: "1px solid rgba(176,38,255,0.22)" }} value={String(value ?? "#22d3ee")} onChange={(e) => onChange(e.target.value)} />
          <input className={base} style={{ ...baseStyle, ...mono }} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />
        </div>
      );
    case "tags":
      return <TagsInput value={(value as string[]) ?? []} onChange={onChange} placeholder={spec.placeholder} />;
    case "datetime":
      return <input type="text" className={base} style={{ ...baseStyle, ...mono }} placeholder="2026-06-23T00:00:00Z" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />;
    default:
      return <input className={base} style={baseStyle} placeholder={spec.placeholder} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />;
  }
}

function TagsInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    const next = [...value];
    for (const p of parts) if (!next.includes(p)) next.push(p);
    onChange(next);
    setDraft("");
  };
  return (
    <div className={`${base} flex flex-wrap items-center gap-2`} style={baseStyle}>
      {value.map((t, i) => (
        <span key={`${t}-${i}`} className="flex items-center gap-1 rounded px-2 py-0.5 text-xs" style={{ background: "rgba(34,211,238,0.14)", color: "#22d3ee", ...mono }}>
          {t}
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100">×</button>
        </span>
      ))}
      <input className="min-w-[80px] flex-1 bg-transparent text-sm outline-none" style={{ color: "#e8e8f0" }} placeholder={placeholder ?? "type & Enter"} value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
        onBlur={add} />
    </div>
  );
}
