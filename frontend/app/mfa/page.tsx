"use client";

import { useState } from "react";
import { apiFetch, setToken } from "../../lib/api";

export default function MfaPage() {
  const [totp, setTotp] = useState("");
  const [backup, setBackup] = useState("");
  const [out, setOut] = useState("");

  return (
    <main>
      <h2>MFA Verification</h2>
      <p>Enter either a 6-digit TOTP code or a backup code.</p>
      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <input placeholder="TOTP (6 digits)" value={totp} onChange={(e) => setTotp(e.target.value)} />
        <input placeholder="Backup code" value={backup} onChange={(e) => setBackup(e.target.value)} />
        <button
          onClick={async () => {
            setOut("");
            const mfaToken = window.localStorage.getItem("signsec_mfa_challenge_token");
            if (!mfaToken) {
              setOut("Missing MFA challenge token. Please login again.");
              return;
            }
            try {
              const res = await apiFetch<any>(`/api/auth/login/mfa`, {
                method: "POST",
                body: JSON.stringify({
                  mfa_challenge_token: mfaToken,
                  totp_code: totp || undefined,
                  backup_code: backup || undefined,
                }),
              });
              setToken(res.access_token);
              window.localStorage.removeItem("signsec_mfa_challenge_token");
              window.location.href = "/dashboard";
            } catch (e: any) {
              setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
            }
          }}
        >
          Verify MFA
        </button>
        <pre style={{ whiteSpace: "pre-wrap" }}>{out}</pre>
      </div>
    </main>
  );
}


