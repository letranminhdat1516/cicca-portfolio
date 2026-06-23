"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { PROFILE_FIELDS } from "@/lib/adminSchema";
import { Field } from "./fields";

export function ProfileForm() {
  const [values, setValues] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    adminApi
      .getProfile()
      .then((p) => {
        const obj = (p ?? {}) as Record<string, unknown>;
        const v: Record<string, unknown> = {};
        for (const f of PROFILE_FIELDS) v[f.name] = obj[f.name] ?? (f.type === "tags" ? [] : "");
        setValues(v);
      })
      .catch((e) => setStatus(String(e)));
  }, []);

  async function save() {
    if (!values) return;
    try {
      await adminApi.updateProfile(values);
      setStatus("Profile saved.");
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  }

  if (!values) return <p className="text-[#9a9ab8]">Loading…</p>;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-white">👤 Profile</h1>
      <p className="mb-6 text-sm text-[#9a9ab8]">Your hero card & identity.</p>
      {status && <p className="mb-4 text-sm text-[#ffd23f]">{status}</p>}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#b026ff]/30 bg-[#08070f] p-5 sm:grid-cols-2">
        {PROFILE_FIELDS.map((f) => (
          <Field
            key={f.name}
            spec={f}
            value={values[f.name]}
            onChange={(v) => setValues((prev) => ({ ...prev!, [f.name]: v }))}
          />
        ))}
      </div>
      <button onClick={save} className="mt-5 rounded-md bg-[#22d3ee] px-4 py-2 text-sm font-bold text-[#08070f]">
        Save profile
      </button>
    </div>
  );
}
