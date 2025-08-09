export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const STORAGE_KEY = 'onx.backendUrl';

export function getBaseUrl() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export async function apiFetch<T = any>(path: string, opts?: RequestInit & { method?: HttpMethod }) {
  const base = getBaseUrl();
  if (!base) throw new Error('Backend URL not configured');
  const url = `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return (await res.json()) as T;
}
