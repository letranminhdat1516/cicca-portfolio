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
          <h1 className="text-2xl font-bold text-white">
            {schema.icon} {schema.label}
          </h1>
          <p className="text-sm text-[#9a9ab8]">{rows.length} item(s)</p>
        </div>
        {!editing && (
          <button
            onClick={startCreate}
            className="rounded-md px-4 py-2 text-sm font-bold text-[#08070f]"
            style={{ background: "linear-gradient(135deg,#22d3ee,#b026ff)" }}
          >
            + New {schema.singular}
          </button>
        )}
      </div>

      {status && <p className="mb-4 text-sm text-[#ffd23f]">{status}</p>}

      {editing ? (
        <div className="rounded-xl border border-[#b026ff]/30 bg-[#08070f] p-5">
          <h2 className="mb-4 text-lg font-semibold text-[#22d3ee]">
            {editingId ? `Edit ${schema.singular}` : `New ${schema.singular}`}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {schema.fields.map((f) => (
              <Field
                key={f.name}
                spec={f}
                value={editing[f.name]}
                onChange={(v) => setEditing((prev) => ({ ...prev!, [f.name]: v }))}
              />
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={save} className="rounded-md bg-[#22d3ee] px-4 py-2 text-sm font-bold text-[#08070f]">
              Save
            </button>
            <button onClick={cancel} className="rounded-md border border-white/15 px-4 py-2 text-sm text-[#9a9ab8]">
              Cancel
            </button>
          </div>
        </div>
      ) : loading ? (
        <p className="text-[#9a9ab8]">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.length === 0 && <p className="text-[#9a9ab8]">No items yet — add one.</p>}
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-[#08070f] px-4 py-3 hover:border-[#22d3ee]/40"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-white">
                  {String(row[schema.titleField] ?? "(untitled)")}
                </div>
                {schema.subtitleField && (
                  <div className="truncate text-xs text-[#9a9ab8]">
                    {String(row[schema.subtitleField] ?? "")}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => startEdit(row)} className="rounded px-3 py-1 text-xs font-semibold text-[#22d3ee] hover:bg-[#22d3ee]/10">
                  Edit
                </button>
                <button onClick={() => remove(row.id)} className="rounded px-3 py-1 text-xs font-semibold text-[#ff2d9b] hover:bg-[#ff2d9b]/10">
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
