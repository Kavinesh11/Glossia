"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../../lib/api";

export default function SharedPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const [data, setData] = useState<any>(null);
  const [out, setOut] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch<any>(`/api/conversions/shared/${token}`, { method: "GET" });
        setData(res);
      } catch (e: any) {
        setOut(`Not found or expired.`);
      }
    })();
  }, [token]);

  return (
    <main>
      <h2>Shared Conversion</h2>
      <pre style={{ background: "#fafafa", padding: 12, border: "1px solid #eee" }}>
        {data ? JSON.stringify(data, null, 2) : out || "Loading..."}
      </pre>
      <a href="/">Home</a>
    </main>
  );
}


