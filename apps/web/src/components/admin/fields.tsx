"use client";
import { useState } from "react";
import type { FieldSpec } from "@/lib/adminSchema";

const base =
  "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors";
const baseStyle = {
  background: "#ffffff",
  borderColor: "#e0ddd3",
  color: "#23211c",
} as const;

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
      <span className="text-[12px] font-medium" style={{ color: "#73726c" }}>
        {spec.label}
      </span>
      <Control spec={spec} value={value} onChange={onChange} />
    </label>
  );
}

function focus(e: React.FocusEvent<HTMLElement>) {
  (e.currentTarget as HTMLElement).style.borderColor = "#d97757";
}
function blur(e: React.FocusEvent<HTMLElement>) {
  (e.currentTarget as HTMLElement).style.borderColor = "#e0ddd3";
}

function Control({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (spec.type) {
    case "textarea":
      return (
        <textarea className={base} style={baseStyle} rows={3} placeholder={spec.placeholder}
          value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />
      );
    case "markdown":
      return (
        <textarea className={`${base} font-mono`} style={baseStyle} rows={10}
          placeholder={spec.placeholder ?? "## Markdown supported"}
          value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />
      );
    case "number":
      return (
        <input type="number" className={base} style={baseStyle} value={Number(value ?? 0)}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} onFocus={focus} onBlur={blur} />
      );
    case "select":
      return (
        <select className={base} style={baseStyle} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur}>
          {!spec.options?.includes(String(value)) && <option value="">—</option>}
          {spec.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );
    case "boolean":
      return (
        <button type="button" onClick={() => onChange(!value)}
          className="flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: "#e0ddd3", background: "#fff", color: value ? "#2f9e44" : "#73726c" }}>
          <span className="inline-block h-4 w-4 rounded" style={{ background: value ? "#2f9e44" : "transparent", border: "1.5px solid currentColor" }} />
          {value ? "Yes" : "No"}
        </button>
      );
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input type="color" className="h-9 w-11 cursor-pointer rounded-lg border" style={{ borderColor: "#e0ddd3", background: "#fff" }}
            value={String(value ?? "#d97757")} onChange={(e) => onChange(e.target.value)} />
          <input className={base} style={baseStyle} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />
        </div>
      );
    case "tags":
      return <TagsInput value={(value as string[]) ?? []} onChange={onChange} placeholder={spec.placeholder} />;
    case "datetime":
      return (
        <input type="text" className={base} style={baseStyle} placeholder="2026-06-23T00:00:00Z"
          value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />
      );
    default:
      return (
        <input className={base} style={baseStyle} placeholder={spec.placeholder}
          value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} onFocus={focus} onBlur={blur} />
      );
  }
}

function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div className={`${base} flex flex-wrap items-center gap-2`} style={baseStyle}>
      {value.map((t) => (
        <span key={t} className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
          style={{ background: "rgba(217,119,87,0.12)", color: "#c2613f" }}>
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="opacity-60 hover:opacity-100">×</button>
        </span>
      ))}
      <input className="min-w-[80px] flex-1 bg-transparent text-sm outline-none" style={{ color: "#23211c" }}
        placeholder={placeholder ?? "type & Enter"} value={draft} onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add} />
    </div>
  );
}
