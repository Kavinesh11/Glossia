import React from "react";

export const metadata = {
  title: "SignSec Demo",
  description: "Security lab UI for Sign Language Extension platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <a href="/" style={{ fontWeight: 700, textDecoration: "none", color: "#111" }}>
            SignSec Demo
          </a>
          <span style={{ marginLeft: 12, color: "#666" }}>Auth • RBAC/ACL • Crypto • Signatures</span>
        </div>
        <div style={{ padding: 16, maxWidth: 920, margin: "0 auto" }}>{children}</div>
      </body>
    </html>
  );
}


