"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";

export default function MfaSetupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [setup, setSetup] = useState<any>(null);
  const [totp, setTotp] = useState("");
  const [out, setOut] = useState("");

  return (
    <main>
      <h2>MFA Setup (TOTP)</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
        <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button
          onClick={async () => {
            setOut("");
            try {
              const res = await apiFetch<any>(`/api/auth/mfa/setup`, {
                method: "POST",
                body: JSON.stringify({ username, password }),
              });
              setSetup(res);
            } catch (e: any) {
              setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
            }
          }}
        >
          Generate QR
        </button>

        {setup && (
          <>
            <div>
              <div style={{ fontWeight: 700 }}>Scan QR in Google Authenticator</div>
              <img
                alt="TOTP QR"
                src={`data:image/png;base64,${setup.qr_code_base64_png}`}
                style={{ marginTop: 8, border: "1px solid #eee" }}
              />
              <div style={{ marginTop: 8 }}>
                <div>Secret (backup/manual entry):</div>
                <code>{setup.totp_secret}</code>
              </div>
            </div>

            <hr />

            <div style={{ fontWeight: 700 }}>Verify Setup</div>
            <input placeholder="6-digit TOTP" value={totp} onChange={(e) => setTotp(e.target.value)} />
            <button
              onClick={async () => {
                setOut("");
                try {
                  const res = await apiFetch<any>(`/api/auth/mfa/verify-setup`, {
                    method: "POST",
                    body: JSON.stringify({ username, password, totp_code: totp }),
                  });
                  setOut(`MFA enabled. Backup codes (save once):\n${(res.backup_codes || []).join("\n")}`);
                } catch (e: any) {
                  setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
                }
              }}
            >
              Enable MFA
            </button>
          </>
        )}

        <a href="/login">Back to login</a>
        <pre style={{ whiteSpace: "pre-wrap" }}>{out}</pre>
      </div>
    </main>
  );
}


