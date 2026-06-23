"use client";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";

type Item = { id: string; [k: string]: unknown };

const inputStyle = {
  background: "#08070f",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e8e8f0",
} as const;

export function CollectionEditor({ model, label }: { model: string; label: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [newDraft, setNewDraft] = useState("{\n  \n}");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const data = (await adminApi.list(model)) as Item[];
    setItems(data);
    setDrafts(Object.fromEntries(data.map((i) => [i.id, JSON.stringify(stripId(i), null, 2)])));
  }, [model]);

  useEffect(() => {
    load().catch((e) => setStatus(String(e)));
  }, [load]);

  function stripId(i: Item) {
    const { id: _id, ...rest } = i;
    void _id;
    return rest;
  }

  async function save(id: string) {
    try {
      await adminApi.update(model, id, JSON.parse(drafts[id]));
      setStatus(`Saved ${label} ${id}`);
      await load();
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  }
  async function remove(id: string) {
    if (!confirm(`Delete this ${label}?`)) return;
    await adminApi.remove(model, id);
    await load();
  }
  async function create() {
    try {
      await adminApi.create(model, JSON.parse(newDraft));
      setNewDraft("{\n  \n}");
      setStatus(`Created ${label}`);
      await load();
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  }

  return (
    <section className="mb-10">
      <h2 className="mb-2 text-lg font-bold" style={{ color: "#22d3ee" }}>
        {label} <span style={{ color: "#6b6b88" }}>({items.length})</span>
      </h2>
      {status && <p className="mb-2 text-xs" style={{ color: "#ffd23f" }}>{status}</p>}
      <div className="flex flex-col gap-3">
        {items.map((i) => (
          <div key={i.id} className="rounded p-3" style={{ border: "1px solid rgba(176,38,255,0.2)" }}>
            <textarea
              value={drafts[i.id] ?? ""}
              onChange={(e) => setDrafts((d) => ({ ...d, [i.id]: e.target.value }))}
              rows={Math.min(14, (drafts[i.id]?.split("\n").length ?? 4) + 1)}
              className="w-full rounded p-2 font-mono text-xs"
              style={inputStyle}
            />
            <div className="mt-2 flex gap-2">
              <button onClick={() => save(i.id)} className="rounded px-3 py-1 text-xs font-bold" style={{ background: "#22d3ee", color: "#08070f" }}>
                Save
              </button>
              <button onClick={() => remove(i.id)} className="rounded px-3 py-1 text-xs font-bold" style={{ background: "#ff2d9b", color: "#08070f" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded p-3" style={{ border: "1px dashed rgba(34,211,238,0.3)" }}>
        <div className="mb-1 text-xs" style={{ color: "#9a9ab8" }}>New {label} (JSON)</div>
        <textarea
          value={newDraft}
          onChange={(e) => setNewDraft(e.target.value)}
          rows={6}
          className="w-full rounded p-2 font-mono text-xs"
          style={inputStyle}
        />
        <button onClick={create} className="mt-2 rounded px-3 py-1 text-xs font-bold" style={{ background: "linear-gradient(135deg,#22d3ee,#b026ff)", color: "#08070f" }}>
          + Add
        </button>
      </div>
    </section>
  );
}
