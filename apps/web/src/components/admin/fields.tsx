"use client";
import { useState } from "react";
import type { FieldSpec } from "@/lib/adminSchema";

const base =
  "w-full rounded-md bg-[#0a0a12] border border-white/10 px-3 py-2 text-sm text-[#e8e8f0] outline-none focus:border-[#22d3ee] transition-colors";

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
      <span className="text-[11px] font-medium uppercase tracking-wider text-[#9a9ab8]">
        {spec.label}
      </span>
      <Control spec={spec} value={value} onChange={onChange} />
    </label>
  );
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
        <textarea
          className={base}
          rows={3}
          placeholder={spec.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "markdown":
      return (
        <textarea
          className={`${base} font-mono`}
          rows={10}
          placeholder={spec.placeholder ?? "## Markdown supported"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className={base}
          value={Number(value ?? 0)}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      );
    case "select":
      return (
        <select className={base} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {!spec.options?.includes(String(value)) && <option value="">—</option>}
          {spec.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "boolean":
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="flex w-fit items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm"
          style={{ color: value ? "#4ade80" : "#9a9ab8" }}
        >
          <span
            className="inline-block h-4 w-4 rounded-sm"
            style={{ background: value ? "#4ade80" : "transparent", border: "1px solid currentColor" }}
          />
          {value ? "Yes" : "No"}
        </button>
      );
    case "color":
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-transparent"
            value={String(value ?? "#22d3ee")}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            className={base}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    case "tags":
      return <TagsInput value={(value as string[]) ?? []} onChange={onChange} placeholder={spec.placeholder} />;
    case "datetime":
      return (
        <input
          type="text"
          className={base}
          placeholder="2026-06-23T00:00:00Z"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    default:
      return (
        <input
          className={base}
          placeholder={spec.placeholder}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
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
    <div className={`${base} flex flex-wrap items-center gap-2`}>
      {value.map((t) => (
        <span
          key={t}
          className="flex items-center gap-1 rounded bg-[#22d3ee]/15 px-2 py-0.5 text-xs text-[#22d3ee]"
        >
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="text-[#22d3ee]/70 hover:text-white">
            ×
          </button>
        </span>
      ))}
      <input
        className="min-w-[80px] flex-1 bg-transparent text-sm outline-none"
        placeholder={placeholder ?? "type & Enter"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
      />
    </div>
  );
}
