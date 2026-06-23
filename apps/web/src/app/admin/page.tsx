"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/adminApi";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

const COLLECTIONS: { model: string; label: string }[] = [
  { model: "stats", label: "Stats" },
  { model: "counters", label: "Counters" },
  { model: "projects", label: "Projects (Missions)" },
  { model: "skills", label: "Skills" },
  { model: "achievements", label: "Achievements" },
  { model: "socials", label: "Socials" },
  { model: "experiences", label: "Experiences" },
  { model: "resources", label: "Resources" },
  { model: "blog", label: "Blog Posts" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/admin/login");
    else setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "#22d3ee" }}>
          CONTROL PANEL
        </h1>
        <button
          onClick={() => {
            clearToken();
            router.replace("/admin/login");
          }}
          className="rounded px-3 py-1 text-xs font-bold"
          style={{ border: "1px solid rgba(255,45,155,0.5)", color: "#ff2d9b" }}
        >
          Log out
        </button>
      </div>
      <ProfileEditor />
      {COLLECTIONS.map((c) => (
        <CollectionEditor key={c.model} model={c.model} label={c.label} />
      ))}
    </main>
  );
}
