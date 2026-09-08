"use client";

import { useState } from "react";
import { apiFetch } from "../../lib/api";

export default function ConversionsPage() {
  const [sourceType, setSourceType] = useState<"youtube" | "upload" | "text">("text");
  const [sourceValue, setSourceValue] = useState("");
  const [out, setOut] = useState("");

  return (
    <main>
      <h2>Conversions</h2>
      <p>Create a conversion job (stub pipeline) – RBAC + quota enforced server-side.</p>
      <div style={{ display: "grid", gap: 8, maxWidth: 720 }}>
        <select value={sourceType} onChange={(e) => setSourceType(e.target.value as any)}>
          <option value="text">text</option>
          <option value="youtube">youtube</option>
          <option value="upload">upload</option>
        </select>
        <textarea
          placeholder="source_value (text / youtube URL / upload id)"
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
          rows={4}
        />
        <button
          onClick={async () => {
            setOut("");
            try {
              const res = await apiFetch<{ id: string; status: string }>(`/api/conversions`, {
                method: "POST",
                auth: true,
                body: JSON.stringify({ source_type: sourceType, source_value: sourceValue }),
              });
              setOut(`Created conversion: ${res.id} (${res.status})\nOpen: /conversions/${res.id}`);
            } catch (e: any) {
              setOut(`Error: ${e?.error?.code || "unknown"} - ${e?.error?.message || "failed"}`);
            }
          }}
        >
          Create conversion
        </button>
        <a href="/dashboard">Back</a>
        <pre style={{ whiteSpace: "pre-wrap" }}>{out}</pre>
      </div>
    </main>
  );
}


