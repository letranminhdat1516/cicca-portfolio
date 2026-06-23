"use client";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "portfolio_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = (await res.json()) as { access_token: string };
  setToken(data.access_token);
}

async function authed(path: string, init: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 401) {
    clearToken();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}`);
  return res.status === 204 ? null : res.json();
}

export const adminApi = {
  list: (model: string) => authed(`/admin/${model}`),
  create: (model: string, data: unknown) =>
    authed(`/admin/${model}`, { method: "POST", body: JSON.stringify(data) }),
  update: (model: string, id: string, data: unknown) =>
    authed(`/admin/${model}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (model: string, id: string) =>
    authed(`/admin/${model}/${id}`, { method: "DELETE" }),
  getProfile: () => authed(`/admin/profile`),
  updateProfile: (data: unknown) =>
    authed(`/admin/profile`, { method: "PATCH", body: JSON.stringify(data) }),
};
