"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/adminApi";

const inputStyle = {
  background: "#ffffff",
  border: "1px solid #e0ddd3",
  color: "#23211c",
} as const;

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
    <main
      className="grid min-h-screen place-items-center px-4"
      style={{ background: "#faf9f5", fontFamily: "var(--font-body), Inter, system-ui, sans-serif" }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl p-7"
        style={{ background: "#ffffff", border: "1px solid #ece9e1", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
      >
        <div className="mb-5 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: "#d97757" }}>
            P1
          </span>
          <div>
            <h1 className="text-[17px] font-semibold" style={{ color: "#23211c" }}>Portfolio CMS</h1>
            <p className="text-[12px]" style={{ color: "#9b9890" }}>Sign in to manage content</p>
          </div>
        </div>
        <label className="mb-1.5 block text-[12px] font-medium" style={{ color: "#73726c" }}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="mb-4 w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
        <label className="mb-1.5 block text-[12px] font-medium" style={{ color: "#73726c" }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="mb-4 w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
        {error && <p className="mb-3 text-sm" style={{ color: "#b5503a" }}>{error}</p>}
        <button type="submit" disabled={busy}
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-95 disabled:opacity-60"
          style={{ background: "#d97757" }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
