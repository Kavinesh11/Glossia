"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken } from "../../lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [out, setOut] = useState<string>("");
   const [loading, setLoading] = useState(false);
   const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#f5f7ff,#eef3ff)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
          padding: 24,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 4 }}>Welcome back</h1>
        <p style={{ marginTop: 0, color: "#64748b", fontSize: 14 }}>
          If MFA is enabled for your account, you&apos;ll be asked for a TOTP or backup code after your password.
        </p>
        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
            Username
            <input
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </label>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
            Password
            <input
              placeholder="••••••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </label>
          <button
            onClick={async () => {
              setOut("");
              setLoading(true);
              try {
                const res = await apiFetch<any>(`/api/auth/login`, {
                  method: "POST",
                  body: JSON.stringify({ username, password }),
                });
                if (res.mfa_required) {
                  window.localStorage.setItem("signsec_mfa_challenge_token", res.mfa_challenge_token);
                  router.push("/mfa");
                  return;
                }
                setToken(res.access_token);
                router.push("/dashboard");
              } catch (e: any) {
                setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
              } finally {
                setLoading(false);
              }
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "none",
              background: "#4f46e5",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            First time here?{" "}
            <a href="/register" style={{ color: "#4f46e5", fontWeight: 600 }}>
              Create an account
            </a>
          </div>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            Want to enable MFA?{" "}
            <a href="/mfa-setup" style={{ color: "#4f46e5", fontWeight: 600 }}>
              Setup TOTP
            </a>
          </div>
          {out && (
            <div
              style={{
                marginTop: 6,
                padding: 10,
                borderRadius: 8,
                background: "#fef2f2",
                color: "#991b1b",
                fontSize: 13,
              }}
            >
              {out}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  marginTop: 4,
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  fontSize: 14,
  outline: "none",
};


