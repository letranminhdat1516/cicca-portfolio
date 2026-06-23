"use client";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { emptyValues, type EntitySchema, type FieldSpec } from "@/lib/adminSchema";
import { Field } from "./fields";

type Row = { id: string; [k: string]: unknown };

function buildPayload(fields: FieldSpec[], values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    let v = values[f.name];
    if (f.type === "datetime" && (v === "" || v == null)) v = null;
    out[f.name] = v;
  }
  return out;
}

const card = { background: "#ffffff", border: "1px solid #ece9e1" } as const;

export function EntityManager({ schema }: { schema: EntitySchema }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await adminApi.list(schema.model)) as Row[];
      setRows(data);
    } catch (e) {
      setStatus(String(e));
    } finally {
      setLoading(false);
    }
  }, [schema.model]);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setEditingId(null);
    setEditing(emptyValues(schema.fields));
  }
  function startEdit(row: Row) {
    setEditingId(row.id);
    const v: Record<string, unknown> = {};
    for (const f of schema.fields) v[f.name] = row[f.name] ?? (f.type === "tags" ? [] : "");
    setEditing(v);
  }
  function cancel() {
    setEditing(null);
    setEditingId(null);
  }

  async function save() {
    if (!editing) return;
    const payload = buildPayload(schema.fields, editing);
    try {
      if (editingId) await adminApi.update(schema.model, editingId, payload);
      else await adminApi.create(schema.model, payload);
      setStatus(editingId ? "Saved." : "Created.");
      cancel();
      await load();
    } catch (e) {
      setStatus(`Error: ${e}`);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete this ${schema.singular}?`)) return;
    await adminApi.remove(schema.model, id);
    await load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-semibold" style={{ color: "#23211c" }}>
            {schema.icon} {schema.label}
          </h1>
          <p className="text-sm" style={{ color: "#9b9890" }}>{rows.length} item(s)</p>
        </div>
        {!editing && (
          <button onClick={startCreate} className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:brightness-95" style={{ background: "#d97757" }}>
            + New {schema.singular}
          </button>
        )}
      </div>

      {status && <p className="mb-4 text-sm" style={{ color: "#c2613f" }}>{status}</p>}

      {editing ? (
        <div className="rounded-2xl p-6" style={{ ...card, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 className="mb-5 text-lg font-semibold" style={{ color: "#23211c" }}>
            {editingId ? `Edit ${schema.singular}` : `New ${schema.singular}`}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {schema.fields.map((f) => (
              <Field key={f.name} spec={f} value={editing[f.name]} onChange={(v) => setEditing((prev) => ({ ...prev!, [f.name]: v }))} />
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={save} className="rounded-lg px-4 py-2 text-sm font-semibold text-white hover:brightness-95" style={{ background: "#d97757" }}>
              Save
            </button>
            <button onClick={cancel} className="rounded-lg border px-4 py-2 text-sm" style={{ borderColor: "#e0ddd3", color: "#73726c" }}>
              Cancel
            </button>
          </div>
        </div>
      ) : loading ? (
        <p style={{ color: "#9b9890" }}>Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.length === 0 && <p style={{ color: "#9b9890" }}>No items yet — add one.</p>}
          {rows.map((row) => (
            <div key={row.id} className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors" style={card}>
              <div className="min-w-0">
                <div className="truncate font-medium" style={{ color: "#23211c" }}>
                  {String(row[schema.titleField] ?? "(untitled)")}
                </div>
                {schema.subtitleField && (
                  <div className="truncate text-xs" style={{ color: "#9b9890" }}>
                    {String(row[schema.subtitleField] ?? "")}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => startEdit(row)} className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#f3f1ea]" style={{ color: "#c2613f" }}>
                  Edit
                </button>
                <button onClick={() => remove(row.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[#f9efec]" style={{ color: "#b5503a" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
