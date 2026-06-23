"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/adminApi";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch {
      setError("Invalid credentials");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg p-6"
        style={{ background: "#08070f", border: "1px solid rgba(176,38,255,0.3)" }}
      >
        <h1 className="mb-1 text-xl font-bold" style={{ color: "#22d3ee" }}>
          ADMIN LOGIN
        </h1>
        <p className="mb-5 text-sm" style={{ color: "#9a9ab8" }}>
          PLAYER_01.sys control panel
        </p>
        <label className="mb-1 block text-xs" style={{ color: "#9a9ab8" }}>
          EMAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded px-3 py-2 text-sm"
          style={{ background: "#0a0a12", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0" }}
        />
        <label className="mb-1 block text-xs" style={{ color: "#9a9ab8" }}>
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded px-3 py-2 text-sm"
          style={{ background: "#0a0a12", border: "1px solid rgba(255,255,255,0.1)", color: "#e8e8f0" }}
        />
        {error && <p className="mb-3 text-sm" style={{ color: "#ff2d9b" }}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded py-2 text-sm font-bold"
          style={{ background: "linear-gradient(135deg,#22d3ee,#b026ff)", color: "#08070f" }}
        >
          {busy ? "..." : "ENTER"}
        </button>
      </form>
    </main>
  );
}
