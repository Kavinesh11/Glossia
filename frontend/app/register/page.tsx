"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "credentials">("email");
  
  // Step 1: Email
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Step 2: OTP
  const [otpCode, setOtpCode] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  
  // Step 3: Credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // UI State
  const [out, setOut] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async () => {
    setOut("");
    setLoading(true);
    try {
      const body: any = { email, delivery_method: deliveryMethod };
      if (deliveryMethod === "sms") {
        body.phone_number = phoneNumber;
      }
      
      const res = await apiFetch<{ otp_required: boolean; registration_id: string; message: string }>(
        `/api/auth/register`,
        { method: "POST", body: JSON.stringify(body) }
      );
      
      if (res.otp_required) {
        setRegistrationId(res.registration_id);
        setOut(`✓ OTP sent to ${deliveryMethod}. Check your ${deliveryMethod}.`);
        setTimeout(() => {
          setStep("otp");
          setOut("");
        }, 1000);
      }
    } catch (e: any) {
      setOut(`Error: ${e?.error?.message || "Failed to request OTP"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setOut("");
    setLoading(true);
    try {
      // Just verify OTP and move to credentials step
      setOut("✓ OTP verified. Now set your credentials.");
      setTimeout(() => {
        setStep("credentials");
        setOut("");
      }, 1000);
    } catch (e: any) {
      setOut(`Error: ${e?.error?.message || "OTP verification failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async () => {
    setOut("");
    setLoading(true);
    try {
      await apiFetch<{ id: string; username: string; email: string }>(
        `/api/auth/register/verify-otp`,
        {
          method: "POST",
          body: JSON.stringify({
            registration_id: registrationId,
            otp_code: otpCode,
            username,
            password,
          }),
        }
      );
      
      setOut("✓ Registration successful! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1000);
    } catch (e: any) {
      setOut(`Error: ${e?.error?.message || "Registration failed"}`);
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: 520,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 18px 45px rgba(15,23,42,0.18)",
          padding: 24,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 4 }}>Create your SignSec account</h1>
        <p style={{ marginTop: 0, color: "#64748b", fontSize: 14, marginBottom: 16 }}>
          Sign up with your email. We'll send you an OTP to verify your identity.
        </p>

        {step === "email" && (
          <div style={{ display: "grid", gap: 10 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Email Address
              <input
                placeholder="you@example.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              OTP Delivery Method
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value as "email" | "sms")}
                style={inputStyle}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </label>

            {deliveryMethod === "sms" && (
              <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                Phone Number
                <input
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={inputStyle}
                />
              </label>
            )}

            <button
              onClick={handleEmailSubmit}
              disabled={loading || !email}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "none",
                background: !email ? "#cbd5f0" : "#4f46e5",
                color: "white",
                fontWeight: 600,
                cursor: !email || loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ color: "#64748b", fontSize: 13 }}>
              Enter the 6-digit OTP code sent to your {deliveryMethod}.
            </p>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              OTP Code
              <input
                placeholder="123456"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                style={inputStyle}
              />
            </label>

            <button
              onClick={handleOtpSubmit}
              disabled={loading || otpCode.length !== 6}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "none",
                background: otpCode.length !== 6 ? "#cbd5f0" : "#4f46e5",
                color: "white",
                fontWeight: 600,
                cursor: otpCode.length !== 6 || loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>

            <button
              onClick={() => {
                setStep("email");
                setOtpCode("");
                setOut("");
              }}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid #cbd5f0",
                background: "transparent",
                color: "#64748b",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to Email
            </button>
          </div>
        )}

        {step === "credentials" && (
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ color: "#64748b", fontSize: 13 }}>
              Create your account credentials. <b>Password:</b> 12+ characters with uppercase, lowercase, digit, special char.
            </p>
            
            <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Username
              <input
                placeholder="e.g. alice_user"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Password
              <input
                placeholder="StrongPassword!234"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </label>

            <button
              onClick={handleCredentialsSubmit}
              disabled={loading || !username || !password}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "none",
                background: !username || !password ? "#cbd5f0" : "#4f46e5",
                color: "white",
                fontWeight: 600,
                cursor: !username || !password || loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating Account…" : "Create Account"}
            </button>

            <button
              onClick={() => {
                setStep("otp");
                setOut("");
              }}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid #cbd5f0",
                background: "transparent",
                color: "#64748b",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Back to OTP
            </button>
          </div>
        )}

        <div style={{ fontSize: 13, color: "#64748b", marginTop: 14 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#4f46e5", fontWeight: 600 }}>
            Sign in
          </a>
        </div>

        {out && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: out.startsWith("Error") ? "#fef2f2" : "#ecfdf3",
              color: out.startsWith("Error") ? "#991b1b" : "#166534",
              fontSize: 13,
            }}
          >
            {out}
          </div>
        )}
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
  boxSizing: "border-box",
};


