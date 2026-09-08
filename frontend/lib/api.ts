export type ApiError = { error: { code: string; message: string; details?: unknown } };

export type UserInfo = {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  typ: string;
};

export function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("signsec_access_token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("signsec_access_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("signsec_access_token");
}

export function getUserInfo(): UserInfo | null {
  const token = getToken();
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decoded = JSON.parse(atob(parts[1]));
    return decoded as UserInfo;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${apiBase()}${path}`, {
    ...opts,
    headers: { ...headers, ...(opts.headers as Record<string, string> | undefined) },
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw json as ApiError;
  return json as T;
}



