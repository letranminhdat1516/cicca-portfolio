const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init });
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
