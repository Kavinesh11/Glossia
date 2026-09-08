"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";

export default function AdminPage() {
  const [out, setOut] = useState("");

  return (
    <main>
      <h2>Admin</h2>
      <p>These endpoints require ADMIN role (RBAC enforced by backend).</p>
      <div style={{ display: "grid", gap: 8, maxWidth: 920 }}>
        <button
          onClick={async () => {
            setOut("");
            try {
              const res = await apiFetch<any>(`/api/admin/conversions`, { auth: true });
              setOut(JSON.stringify(res, null, 2));
            } catch (e: any) {
              setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
            }
          }}
        >
          List conversions
        </button>
        <button
          onClick={async () => {
            setOut("");
            try {
              const res = await apiFetch<any>(`/api/admin/audit-logs`, { auth: true });
              setOut(JSON.stringify(res, null, 2));
            } catch (e: any) {
              setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
            }
          }}
        >
          View audit logs
        </button>
        <a href="/dashboard">Back</a>
        <pre style={{ whiteSpace: "pre-wrap", background: "#fafafa", padding: 12, border: "1px solid #eee" }}>{out}</pre>
      </div>
    </main>
  );
}


