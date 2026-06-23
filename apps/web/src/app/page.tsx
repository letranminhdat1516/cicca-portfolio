import { apiGet } from '@/lib/api';

export default async function Home() {
  let health = 'unknown';
  try {
    const h = await apiGet<{ status: string }>('/health', { cache: 'no-store' });
    health = h.status;
  } catch {
    health = 'unreachable';
  }
  return (
    <main style={{ padding: 40, fontFamily: 'monospace' }}>
      <h1>PLAYER_01.sys — scaffold OK</h1>
      <p>API health: {health}</p>
    </main>
  );
}
