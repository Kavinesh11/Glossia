"use client";

import { useEffect, useState } from "react";
import { clearToken, getToken, getUserInfo } from "../../lib/api";

export default function DashboardPage() {
  const [tokenPresent, setTokenPresent] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    setTokenPresent(!!token);
    
    if (token) {
      const info = getUserInfo();
      if (info) {
        setUserRole(info.role);
      }
    }
  }, []);

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2>Dashboard</h2>
      <p>
        Token present: <b>{tokenPresent ? "yes" : "no"}</b>
        {userRole && (
          <>
            <br />
            Your role: <b>{userRole}</b>
          </>
        )}
      </p>

      <h3>Navigate:</h3>
      <ul>
        <li>
          <a href="/conversions">Conversions</a>
        </li>
        <li>
          <a href="/upload">Upload (Hybrid AES+RSA Encryption)</a>
        </li>
        {userRole === "ADMIN" && (
          <li>
            <a href="/admin" style={{ fontWeight: "bold", color: "#7c3aed" }}>
              Admin Panel (Audit Logs & All Conversions)
            </a>
          </li>
        )}
      </ul>

      <button
        onClick={() => {
          clearToken();
          window.location.href = "/login";
        }}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: "#ef4444",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </main>
  );
}


