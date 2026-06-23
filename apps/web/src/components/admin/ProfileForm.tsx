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

  if (!values) return <p style={{ color: "#9b9890" }}>Loading…</p>;

  return (
    <div>
      <h1 className="mb-1 text-[26px] font-semibold" style={{ color: "#23211c" }}>👤 Profile</h1>
      <p className="mb-6 text-sm" style={{ color: "#9b9890" }}>Your hero card &amp; identity.</p>
      {status && <p className="mb-4 text-sm" style={{ color: "#c2613f" }}>{status}</p>}
      <div className="grid grid-cols-1 gap-4 rounded-2xl p-6 sm:grid-cols-2" style={{ background: "#ffffff", border: "1px solid #ece9e1", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {PROFILE_FIELDS.map((f) => (
          <Field key={f.name} spec={f} value={values[f.name]} onChange={(v) => setValues((prev) => ({ ...prev!, [f.name]: v }))} />
        ))}
      </div>
      <button onClick={save} className="mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:brightness-95" style={{ background: "#d97757" }}>
        Save profile
      </button>
    </div>
  );
}
