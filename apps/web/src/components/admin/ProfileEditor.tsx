"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

export function ProfileEditor() {
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    adminApi
      .getProfile()
      .then((p) => {
        const obj = p as Record<string, unknown>;
        delete obj.id;
        setDraft(JSON.stringify(obj, null, 2));
      })
      .catch((e) => setStatus(String(e)));
  }, []);

  async function save() {
    try {
      await adminApi.updateProfile(JSON.parse(draft));
      setStatus("Profile saved");
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  }

  return (
    <section className="mb-10">
      <h2 className="mb-2 text-lg font-bold" style={{ color: "#22d3ee" }}>
        Profile
      </h2>
      {status && <p className="mb-2 text-xs" style={{ color: "#ffd23f" }}>{status}</p>}
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={16}
        className="w-full rounded p-2 font-mono text-xs"
        style={{ background: "#08070f", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0" }}
      />
      <button onClick={save} className="mt-2 rounded px-3 py-1 text-xs font-bold" style={{ background: "#22d3ee", color: "#08070f" }}>
        Save profile
      </button>
    </section>
  );
}
