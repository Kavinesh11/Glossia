"use client";

import { useState } from "react";
import { apiBase, getToken } from "../../lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [mediaId, setMediaId] = useState("");
  const [password, setPassword] = useState("");
  const [out, setOut] = useState("");

  return (
    <main>
      <h2>Upload / Download (Hybrid AES+RSA)</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          onClick={async () => {
            setOut("");
            if (!file) return setOut("Pick a file first.");
            const token = getToken();
            if (!token) return setOut("Login first.");

            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch(`${apiBase()}/api/media/upload`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: fd,
            });
            const json = await res.json();
            if (!res.ok) return setOut(`Error: ${json?.error?.code} - ${json?.error?.message}`);
            setMediaId(json.media_file_id);
            setOut(`Uploaded. media_file_id=${json.media_file_id}\nCID=${json.cid}`);
          }}
        >
          Upload (encrypt)
        </button>

        <hr />

        <input placeholder="media_id" value={mediaId} onChange={(e) => setMediaId(e.target.value)} />
        <input
          placeholder="password (unlock private key)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={async () => {
            setOut("");
            const token = getToken();
            if (!token) return setOut("Login first.");
            if (!mediaId) return setOut("Enter media_id.");

            const res = await fetch(`${apiBase()}/api/media/${mediaId}/download`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            });
            if (!res.ok) {
              const json = await res.json();
              return setOut(`Error: ${json?.error?.code} - ${json?.error?.message}`);
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "media.bin";
            a.click();
            URL.revokeObjectURL(url);
            setOut("Downloaded (decrypted) to media.bin");
          }}
        >
          Download (decrypt)
        </button>

        <a href="/dashboard">Back</a>
        <pre style={{ whiteSpace: "pre-wrap" }}>{out}</pre>
      </div>
    </main>
  );
}


