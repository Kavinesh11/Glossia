"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function ConversionDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [data, setData] = useState<any>(null);
  const [out, setOut] = useState("");
  const [ttl, setTtl] = useState("60");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<any>(`/api/conversions/${id}`, { auth: true });
        setData(res);
      } catch (e: any) {
        setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
      }
    })();
  }, [id]);

  return (
    <main>
      <h2>Conversion</h2>
      <div style={{ display: "grid", gap: 10, maxWidth: 920 }}>
        <pre style={{ background: "#fafafa", padding: 12, border: "1px solid #eee" }}>
          {data ? JSON.stringify(data, null, 2) : "Loading..."}
        </pre>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 700 }}>Share (creates token + QR)</div>
          <input value={ttl} onChange={(e) => setTtl(e.target.value)} placeholder="ttl_minutes" />
          <button
            onClick={async () => {
              setOut("");
              try {
                const res = await apiFetch<any>(`/api/conversions/${id}/share`, {
                  method: "POST",
                  auth: true,
                  body: JSON.stringify({ ttl_minutes: Number(ttl) }),
                });
                setOut(`Share URL: ${res.share_url}\nExpires: ${res.expires_at}`);
                const img = document.getElementById("share-qr") as HTMLImageElement | null;
                if (img) img.src = `data:image/png;base64,${res.qr_code_base64_png}`;
              } catch (e: any) {
                setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
              }
            }}
          >
            Create share link
          </button>
          <img id="share-qr" alt="share qr" style={{ maxWidth: 240, border: "1px solid #eee" }} />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 700 }}>Sign metadata (RSA-PSS)</div>
          <input
            placeholder="password (unlock private key)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={async () => {
              setOut("");
              try {
                const res = await apiFetch<any>(`/api/conversions/${id}/sign`, {
                  method: "POST",
                  auth: true,
                  body: JSON.stringify({ password }),
                });
                setOut(`Signed. Signature (base64):\n${res.signature_base64}`);
              } catch (e: any) {
                setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
              }
            }}
          >
            Sign
          </button>
          <button
            onClick={async () => {
              setOut("");
              try {
                const res = await apiFetch<any>(`/api/conversions/${id}/verify-signature`, { auth: true });
                setOut(`Verify: is_signed=${res.is_signed}, is_valid=${res.is_valid}`);
              } catch (e: any) {
                setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
              }
            }}
          >
            Verify signature
          </button>
        </div>

        <a href="/conversions">Back</a>
        <pre style={{ whiteSpace: "pre-wrap" }}>{out}</pre>
      </div>
    </main>
  );
}


