"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ENTITIES,
  PROFILE_FIELDS,
  getEntity,
  emptyValues,
  coerce,
  type EntitySchema,
} from "@/lib/adminSchema";
import { adminApi, getToken, clearToken, login } from "@/lib/adminApi";
import { Field } from "./fields";
import { Preview } from "./Preview";
import { ResumeView } from "./ResumeView";
import { Icon } from "./icons";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

const mono = { fontFamily: "var(--font-mono), monospace" } as const;
const ui = { fontFamily: "var(--font-ui), sans-serif" } as const;
type Row = { id: string; [k: string]: unknown };
type Route = { name: "dashboard" | "profile" | "collection" | "resume"; model?: string };

const chamfer = "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))";
const btnPrimary = { background: "linear-gradient(135deg,#22d3ee,#b026ff)", color: "#08070f" } as const;

function parseHash(): Route {
  const h = (typeof window !== "undefined" ? window.location.hash : "").replace(/^#\/?/, "");
  if (h === "profile") return { name: "profile" };
  if (h === "resume") return { name: "resume" };
  if (h && getEntity(h)) return { name: "collection", model: h };
  return { name: "dashboard" };
}

export function AdminApp() {
  const [token, setTok] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [route, setRoute] = useState<Route>({ name: "dashboard" });

  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const [data, setData] = useState<Record<string, Row[]>>({});
  const [flash, setFlash] = useState("");

  // form state
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const dragId = useRef<string | null>(null);

  const flashMsg = useCallback((m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 2400);
  }, []);

  const loadAll = useCallback(async () => {
    try {
      const [prof, ...lists] = await Promise.all([
        adminApi.getProfile(),
        ...ENTITIES.map((e) => adminApi.list(e.model)),
      ]);
      setProfile((prof as Record<string, unknown>) ?? {});
      const next: Record<string, Row[]> = {};
      ENTITIES.forEach((e, i) => (next[e.model] = (lists[i] as Row[]) ?? []));
      setData(next);
    } catch {
      clearToken();
      setTok(null);
    }
  }, []);

  useEffect(() => {
    const t = getToken();
    setTok(t);
    setRoute(parseHash());
    setReady(true);
    const onHash = () => {
      setRoute(parseHash());
      setFormOpen(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (token) loadAll();
  }, [token, loadAll]);

  // hydrate the profile form when entering the profile view (also covers deep-links / reload)
  useEffect(() => {
    if (route.name !== "profile" || formOpen) return;
    const v: Record<string, unknown> = {};
    for (const f of PROFILE_FIELDS) v[f.name] = profile[f.name] ?? (f.type === "tags" ? [] : "");
    setValues(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.name, profile]);

  function go(r: Route) {
    setFormOpen(false);
    window.location.hash = r.name === "dashboard" ? "/" : `/${r.model ?? r.name}`;
    setRoute(r);
  }

  if (!ready) return null;
  if (!token) return <LoginView onDone={() => setTok(getToken())} />;

  const schema = route.name === "collection" && route.model ? getEntity(route.model) : undefined;

  function openNew(sc: EntitySchema) {
    setEditId(null);
    setValues(emptyValues(sc.fields));
    setFormOpen(true);
  }
  function openEdit(sc: EntitySchema, row: Row) {
    setEditId(row.id);
    const v: Record<string, unknown> = {};
    for (const f of sc.fields) v[f.name] = row[f.name] ?? (f.type === "tags" ? [] : "");
    setValues(v);
    setFormOpen(true);
  }

  async function saveCollection(sc: EntitySchema) {
    setSaving(true);
    try {
      const payload = coerce(sc.fields, values);
      if (editId) await adminApi.update(sc.model, editId, payload);
      else await adminApi.create(sc.model, payload);
      setFormOpen(false);
      await loadAll();
      flashMsg(editId ? "Saved" : "Created");
    } catch (e) {
      flashMsg(`Error: ${e}`);
    } finally {
      setSaving(false);
    }
  }

  async function removeRow(sc: EntitySchema, row: Row) {
    if (!confirm(`Delete this ${sc.singular}?`)) return;
    await adminApi.remove(sc.model, row.id);
    await loadAll();
    flashMsg("Deleted");
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await adminApi.updateProfile(coerce(PROFILE_FIELDS, values));
      flashMsg("Profile saved");
    } catch (e) {
      flashMsg(`Error: ${e}`);
    } finally {
      setSaving(false);
    }
  }

  async function onDrop(sc: EntitySchema, targetId: string) {
    const src = dragId.current;
    dragId.current = null;
    if (!src || src === targetId) return;
    const rows = data[sc.model] ?? [];
    const a = rows.find((r) => r.id === src);
    const b = rows.find((r) => r.id === targetId);
    if (!a || !b) return;
    try {
      await Promise.all([
        adminApi.update(sc.model, a.id, { order: b.order ?? 0 }),
        adminApi.update(sc.model, b.id, { order: a.order ?? 0 }),
      ]);
      await loadAll();
    } catch (e) {
      flashMsg(`Error: ${e}`);
    }
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ profile, ...data }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-content.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function logout() {
    clearToken();
    setTok(null);
  }

  // open profile form values when entering profile view
  function enterProfile() {
    const v: Record<string, unknown> = {};
    for (const f of PROFILE_FIELDS) v[f.name] = profile[f.name] ?? (f.type === "tags" ? [] : "");
    setValues(v);
    go({ name: "profile" });
  }

  if (route.name === "resume") {
    return (
      <ResumeView
        profile={profile}
        experiences={data.experiences ?? []}
        skills={data.skills ?? []}
        achievements={data.achievements ?? []}
        missions={data.projects ?? []}
        onBack={() => go({ name: "dashboard" })}
      />
    );
  }

  return (
    <div className="relative flex min-h-screen" style={{ background: "#08070f", color: "#e8e8f0" }}>
      <Backdrop />
      {/* sidebar */}
      <aside
        className="sticky top-0 z-10 hidden h-screen w-[252px] shrink-0 flex-col p-4 md:flex"
        style={{ background: "rgba(10,8,20,0.7)", backdropFilter: "blur(12px)", borderRight: "1px solid rgba(176,38,255,0.2)" }}
      >
        <button onClick={() => go({ name: "dashboard" })} className="mb-6 flex items-center gap-2.5 text-left">
          <span className="grid h-8 w-8 place-items-center text-[13px] font-bold" style={{ color: "#22d3ee", border: "1px solid rgba(34,211,238,0.5)", clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 8px) 100%,0 100%)", ...mono }}>P1</span>
          <span>
            <span className="block text-[13px] tracking-widest" style={{ ...mono, color: "#e8e8f0" }}>PORTFOLIO CMS</span>
            <span className="block text-[10px]" style={{ ...mono, color: "#6b6b88" }}>CONTENT TERMINAL</span>
          </span>
        </button>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          <NavItem active={route.name === "dashboard"} icon="dashboard" label="DASHBOARD" onClick={() => go({ name: "dashboard" })} />
          <NavItem active={route.name === "profile"} icon="profile" label="PROFILE" onClick={enterProfile} />
          {ENTITIES.map((e) => (
            <NavItem key={e.model} active={route.model === e.model} icon={e.icon} label={e.label} count={(data[e.model] ?? []).length} onClick={() => go({ name: "collection", model: e.model })} />
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-1 border-t pt-4 text-[11px]" style={{ borderColor: "rgba(176,38,255,0.2)", ...mono }}>
          <button onClick={() => go({ name: "resume" })} className="flex items-center gap-2 rounded px-3 py-1.5 text-left hover:text-[#22d3ee]" style={{ color: "#9a9ab8" }}><Icon name="file" size={13} /> Export Résumé</button>
          <button onClick={exportJSON} className="flex items-center gap-2 rounded px-3 py-1.5 text-left hover:text-[#22d3ee]" style={{ color: "#9a9ab8" }}><Icon name="download" size={13} /> Export JSON</button>
          <a href="/" target="_blank" className="flex items-center gap-2 rounded px-3 py-1.5 no-underline hover:text-[#22d3ee]" style={{ color: "#9a9ab8" }}><Icon name="external" size={13} /> View site</a>
          <button onClick={logout} className="flex items-center gap-2 rounded px-3 py-1.5 text-left" style={{ color: "#ff2d9b" }}><Icon name="logout" size={13} /> Log out</button>
        </div>
      </aside>

      {/* main */}
      <main className="relative z-10 flex-1 px-6 py-7 md:px-9">
        {/* mobile nav */}
        <div className="mb-4 flex gap-1 overflow-x-auto md:hidden">
          <MobileTab active={route.name === "dashboard"} label="DASH" onClick={() => go({ name: "dashboard" })} />
          <MobileTab active={route.name === "profile"} label="PROFILE" onClick={enterProfile} />
          {ENTITIES.map((e) => <MobileTab key={e.model} active={route.model === e.model} label={e.label} onClick={() => go({ name: "collection", model: e.model })} />)}
          <MobileTab active={false} label="LOGOUT" onClick={logout} />
        </div>

        {route.name === "dashboard" && (
          <Dashboard profile={profile} data={data} onProfile={enterProfile} onModel={(m) => go({ name: "collection", model: m })} />
        )}

        {route.name === "profile" && (
          <Editor
            kicker="IDENTITY" icon="profile" title="Profile"
            previewKind="profile" previewValues={values}
          >
            <FormCard heading="Edit Profile" saving={saving} onSave={saveProfile}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {PROFILE_FIELDS.map((f) => <Field key={f.name} spec={f} value={values[f.name]} onChange={(v) => setValues((p) => ({ ...p, [f.name]: v }))} />)}
              </div>
            </FormCard>
          </Editor>
        )}

        {route.name === "collection" && schema && (
          <CollectionView
            schema={schema}
            rows={data[schema.model] ?? []}
            formOpen={formOpen}
            editId={editId}
            values={values}
            saving={saving}
            onNew={() => openNew(schema)}
            onEdit={(row) => openEdit(schema, row)}
            onCancel={() => setFormOpen(false)}
            onSave={() => saveCollection(schema)}
            onRemove={(row) => removeRow(schema, row)}
            onChange={(name, v) => setValues((p) => ({ ...p, [name]: v }))}
            onDragStart={(id) => (dragId.current = id)}
            onDrop={(id) => onDrop(schema, id)}
          />
        )}
      </main>

      {flash && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 text-sm font-semibold" style={{ background: "rgba(12,8,18,0.95)", border: "1px solid rgba(34,211,238,0.5)", color: "#22d3ee", clipPath: chamfer }}>
          <Icon name="check" size={15} /> {flash}
        </div>
      )}
    </div>
  );
}

function NavItem({ active, icon, label, count, onClick }: { active: boolean; icon: string; label: string; count?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 rounded px-3 py-2 text-left text-[12px] tracking-wider transition-colors" style={{ ...mono, background: active ? "rgba(34,211,238,0.12)" : "transparent", color: active ? "#22d3ee" : "#9a9ab8" }}>
      <Icon name={icon} size={15} />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-[10px]" style={{ color: "#6b6b88" }}>{count}</span>}
    </button>
  );
}
function MobileTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="shrink-0 rounded px-3 py-1.5 text-[11px]" style={{ ...mono, color: active ? "#22d3ee" : "#9a9ab8", background: active ? "rgba(34,211,238,0.12)" : "transparent" }}>{label}</button>;
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: "radial-gradient(ellipse at 0% 0%,rgba(176,38,255,0.12),transparent 55%),radial-gradient(ellipse at 100% 100%,rgba(34,211,238,0.08),transparent 55%),#08070f" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(176,38,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.04) 1px,transparent 1px)", backgroundSize: "48px 48px", animation: "gridPan 16s linear infinite" }} />
    </div>
  );
}

function Header({ kicker, icon, title, count, newLabel, onNew }: { kicker: string; icon: string; title: string; count?: number; newLabel?: string; onNew?: () => void }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <div className="text-[10px] tracking-[3px]" style={{ ...mono, color: "#b026ff" }}>{kicker}</div>
        <h1 className="mt-1 flex items-center gap-2.5 text-[28px] font-bold" style={{ fontFamily: "var(--font-title), sans-serif", color: "#fff" }}>
          <Icon name={icon} size={26} style={{ color: "#22d3ee" }} />{title}{count != null && <span className="ml-1 text-[14px]" style={{ ...mono, color: "#6b6b88" }}>{count}</span>}
        </h1>
      </div>
      {onNew && <button onClick={onNew} className="px-4 py-2 text-[12px] font-bold tracking-widest" style={{ ...mono, ...btnPrimary, clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 10px) 100%,0 100%)" }}>+ {newLabel}</button>}
    </div>
  );
}

function FormCard({ heading, children, saving, onSave, onCancel }: { heading: string; children: React.ReactNode; saving: boolean; onSave: () => void; onCancel?: () => void }) {
  return (
    <div className="p-5" style={{ background: "rgba(10,8,20,0.6)", border: "1px solid rgba(176,38,255,0.25)", clipPath: chamfer }}>
      <h2 className="mb-4 text-[15px] font-semibold" style={{ ...ui, color: "#22d3ee" }}>{heading}</h2>
      {children}
      <div className="mt-5 flex gap-3">
        <button onClick={onSave} disabled={saving} className="px-4 py-2 text-[12px] font-bold tracking-widest disabled:opacity-60" style={{ ...mono, ...btnPrimary }}>{saving ? "SAVING…" : "SAVE"}</button>
        {onCancel && <button onClick={onCancel} className="px-4 py-2 text-[12px] tracking-widest" style={{ ...mono, border: "1px solid rgba(255,255,255,0.15)", color: "#9a9ab8" }}>CANCEL</button>}
      </div>
    </div>
  );
}

function Editor({ kicker, icon, title, count, newLabel, onNew, previewKind, previewValues, children }: { kicker: string; icon: string; title: string; count?: number; newLabel?: string; onNew?: () => void; previewKind: string; previewValues: Record<string, unknown>; children: React.ReactNode }) {
  return (
    <>
      <Header kicker={kicker} icon={icon} title={title} count={count} newLabel={newLabel} onNew={onNew} />
      <div className="grid grid-cols-1 gap-6 [@media(min-width:980px)]:grid-cols-[1.15fr_0.85fr]">
        <div>{children}</div>
        <Preview kind={previewKind} values={previewValues} />
      </div>
    </>
  );
}

function CollectionView(props: {
  schema: EntitySchema; rows: Row[]; formOpen: boolean; editId: string | null; values: Record<string, unknown>; saving: boolean;
  onNew: () => void; onEdit: (r: Row) => void; onCancel: () => void; onSave: () => void; onRemove: (r: Row) => void;
  onChange: (name: string, v: unknown) => void; onDragStart: (id: string) => void; onDrop: (id: string) => void;
}) {
  const { schema, rows, formOpen, editId, values, saving } = props;
  return (
    <>
      <Header kicker="COLLECTION" icon={schema.icon} title={schema.label} count={rows.length} newLabel={schema.singular.toUpperCase()} onNew={props.onNew} />
      <div className="grid grid-cols-1 gap-6 [@media(min-width:980px)]:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-4">
          {formOpen && (
            <FormCard heading={editId ? `Edit ${schema.singular}` : `New ${schema.singular}`} saving={saving} onSave={props.onSave} onCancel={props.onCancel}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {schema.fields.map((f) => <Field key={f.name} spec={f} value={values[f.name]} onChange={(v) => props.onChange(f.name, v)} />)}
              </div>
            </FormCard>
          )}
          <div className="flex flex-col gap-2">
            {rows.length === 0 && <p className="text-sm" style={{ ...mono, color: "#6b6b88" }}>NO RECORDS. PRESS + {schema.singular.toUpperCase()}</p>}
            {rows.map((row) => (
              <div key={row.id} draggable onDragStart={() => props.onDragStart(row.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => props.onDrop(row.id)}
                className="flex cursor-grab items-center justify-between px-4 py-3 active:cursor-grabbing" style={{ background: "rgba(10,8,20,0.6)", border: "1px solid rgba(176,38,255,0.2)" }}>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium" style={{ ...ui, color: "#fff" }}>{String(row[schema.titleField] ?? "(untitled)")}</div>
                  {schema.subtitleField && <div className="truncate text-[11px]" style={{ ...mono, color: "#6b6b88" }}>{String(row[schema.subtitleField] ?? "")}</div>}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => props.onEdit(row)} className="rounded px-3 py-1 text-[11px] font-semibold hover:bg-[rgba(34,211,238,0.1)]" style={{ ...mono, color: "#22d3ee" }}>EDIT</button>
                  <button onClick={() => props.onRemove(row)} className="rounded px-3 py-1 text-[11px] font-semibold hover:bg-[rgba(255,45,155,0.1)]" style={{ ...mono, color: "#ff2d9b" }}>DEL</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Preview kind={schema.preview} values={formOpen ? values : rows[0] ?? {}} />
      </div>
    </>
  );
}

function Dashboard({ profile, data, onProfile, onModel }: { profile: Record<string, unknown>; data: Record<string, Row[]>; onProfile: () => void; onModel: (m: string) => void }) {
  return (
    <>
      <Header kicker="OVERVIEW" icon="dashboard" title="Dashboard" />

      <AnalyticsDashboard />

      <button onClick={onProfile} className="mb-4 flex w-full items-center justify-between p-5 text-left" style={{ background: "linear-gradient(135deg,rgba(176,38,255,0.12),rgba(34,211,238,0.05))", border: "1px solid rgba(176,38,255,0.3)", clipPath: chamfer }}>
        <div className="flex items-center gap-2.5">
          <Icon name="profile" size={18} style={{ color: "#b026ff" }} />
          <div>
            <div className="text-[16px] font-semibold" style={{ ...ui, color: "#fff" }}>{String(profile.name ?? "[YOUR NAME]")}</div>
            <div className="text-[12px]" style={{ ...mono, color: "#9a9ab8" }}>Edit profile, hero &amp; identity</div>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[12px]" style={{ ...mono, color: "#22d3ee" }}>EDIT <Icon name="arrow" size={13} /></span>
      </button>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ENTITIES.map((e) => (
          <button key={e.model} onClick={() => onModel(e.model)} className="p-4 text-left transition-transform hover:-translate-y-0.5" style={{ background: "rgba(10,8,20,0.6)", border: "1px solid rgba(176,38,255,0.2)", clipPath: chamfer }}>
            <Icon name={e.icon} size={22} style={{ color: "#22d3ee" }} />
            <div className="mt-2 text-[14px] font-semibold" style={{ ...ui, color: "#fff" }}>{e.label}</div>
            <div className="text-[11px]" style={{ ...mono, color: "#6b6b88" }}>{(data[e.model] ?? []).length} item(s)</div>
          </button>
        ))}
      </div>
    </>
  );
}

function LoginView({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      onDone();
    } catch {
      setError("ACCESS DENIED — invalid credentials");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="relative grid min-h-screen place-items-center px-4" style={{ background: "#08070f" }}>
      <Backdrop />
      <form onSubmit={submit} className="relative z-10 w-full max-w-sm p-7" style={{ background: "rgba(10,8,20,0.8)", border: "1px solid rgba(176,38,255,0.35)", backdropFilter: "blur(12px)", clipPath: chamfer }}>
        <div className="mb-1 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center text-sm font-bold" style={{ color: "#22d3ee", border: "1px solid rgba(34,211,238,0.5)", ...mono }}>P1</span>
          <div>
            <h1 className="text-[15px] tracking-widest" style={{ ...mono, color: "#22d3ee" }}>PORTFOLIO CMS</h1>
            <p className="text-[10px] tracking-[2px]" style={{ ...mono, color: "#6b6b88" }}>ACCESS TERMINAL</p>
          </div>
        </div>
        <div className="mb-5 mt-3 flex items-center gap-2 text-[10px]" style={{ ...mono, color: "#4ade80" }}>
          <span className="h-2 w-2 rounded-full" style={{ background: "#4ade80", animation: "pulseGlow 1.6s infinite" }} />SYSTEM ONLINE
        </div>
        <label className="mb-1.5 block text-[10px] tracking-[2px]" style={{ ...mono, color: "#9a9ab8" }}>OPERATOR</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mb-4 w-full rounded-md px-3 py-2 text-sm outline-none" style={{ background: "#0a0a12", border: "1px solid rgba(176,38,255,0.22)", color: "#e8e8f0" }} />
        <label className="mb-1.5 block text-[10px] tracking-[2px]" style={{ ...mono, color: "#9a9ab8" }}>PASSCODE</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mb-4 w-full rounded-md px-3 py-2 text-sm outline-none" style={{ background: "#0a0a12", border: "1px solid rgba(176,38,255,0.22)", color: "#e8e8f0" }} />
        {error && <p className="mb-3 text-[12px]" style={{ ...mono, color: "#ff2d9b" }}>{error}</p>}
        <button type="submit" disabled={busy} className="w-full py-2.5 text-[12px] font-bold tracking-widest disabled:opacity-60" style={{ ...mono, ...btnPrimary, clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 10px) 100%,0 100%)" }}>{busy ? "AUTHENTICATING…" : "▸ ENTER"}</button>
      </form>
    </div>
  );
}
