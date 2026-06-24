// Server-side requests (SSR/ISR) prefer the internal URL so they hit the API
// directly over the container network — no public domain or tunnel needed, and
// faster. The browser bundle never sees API_INTERNAL_URL, so it falls back to
// the public NEXT_PUBLIC_API_URL.
const BASE =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:3001';

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init });
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
