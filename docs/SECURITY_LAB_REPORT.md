## SignSec – Security Lab Layer (Foundations of Cyber Security)

This document is written to match the **20-mark rubric**: Authentication, Authorization, Encryption, Hashing/Digital Signatures, Encoding, Security Levels/Risks, Attacks/Mitigations, and Viva discussion points.

### 1) Architecture & Folder Structure

- **Backend (Flask)**: `signsec_backend/`
  - `app_factory.py`: App creation + blueprint registration + security integrations
  - `routes/`: API endpoints (`auth.py`, `conversions.py`, `media.py`, `admin.py`, `legacy_transcript.py`)
  - `security/`: AuthN/AuthZ/Crypto primitives (`passwords.py`, `jwt_tokens.py`, `mfa_totp.py`, `authz.py`, `hybrid_crypto.py`, `crypto_keys.py`, `signatures.py`, `audit.py`)
  - `storage/`: IPFS/Pinata **stub** (`ipfs_stub.py`) storing ciphertext locally for the lab
- **Database**: PostgreSQL migration SQL in `migrations/001_init.sql`

### 2) Authentication (3 marks)

#### 2.1 Single-factor (password) – 1.5

- **Registration**: `POST /api/auth/register`
  - Enforces password policy:
    - Min 12 chars
    - ≥1 upper, ≥1 lower, ≥1 digit, ≥1 special
  - Hashing: **PBKDF2-SHA256**, 32-byte salt, iterations configurable (default 150k).
- **Login**: `POST /api/auth/login`
  - **No user enumeration**: generic “Invalid credentials”.
  - **Rate limiting**:
    - IP-based limiter (Flask-Limiter) + username-based window using `login_failures` table.
    - After threshold: **429 Too Many Requests**.
  - **JWT issuance**:
    - Access token includes `sub=user_id`, `role`, 1 hour expiry.

**Viva points**:
- PBKDF2 slows offline cracking if DB is stolen; salt prevents rainbow tables.
- Rate limiting mitigates brute-force and credential stuffing.

#### 2.2 MFA (TOTP) – 1.5

- Setup: `POST /api/auth/mfa/setup`
  - Generates base32 secret and returns:
    - `otpauth://` URI
    - QR code as base64 PNG
  - Stores secret as **pending** until verified.
- Verify setup: `POST /api/auth/mfa/verify-setup`
  - Verifies 6-digit code with ±1 step window (clock drift).
  - Persists secret, sets `mfa_enabled=true`.
  - Generates **10 backup codes** (stored hashed, shown once).
- Login step-up:
  - Password step returns an **MFA challenge token** (short-lived) if MFA enabled.
  - `POST /api/auth/login/mfa` validates TOTP or backup code, then issues access JWT.

**Why TOTP (vs SMS)?**
- TOTP avoids SIM-swap weaknesses; relies on shared secret and time window (RFC 6238).

### 3) Authorization / Access Control (3 marks)

#### 3.1 RBAC + ACL model (matrix)

Roles:
- ADMIN
- CONTENT_CREATOR
- STANDARD_USER
- GUEST

Objects:
- ConversionJob
- MediaFile
- AuditLog

Permissions (examples implemented):
- CREATE_CONVERSION, VIEW_OWN_CONVERSIONS, VIEW_ALL_CONVERSIONS
- DELETE_OWN_CONVERSIONS, DELETE_ANY_CONVERSIONS
- UPLOAD_FILE, DOWNLOAD_VIDEO, SHARE_VIDEO
- MANAGE_USERS, VIEW_AUDIT_LOGS

**Access Control Matrix (minimum demo)**

| Subject \\ Object | Conversion (own) | Conversion (any) | Media (own) |
|---|---:|---:|---:|
| ADMIN | RW/D | RW/D | RW/D |
| CONTENT_CREATOR | RW/D | - | RW/D |
| STANDARD_USER | RW/D | - | RW/D |
| GUEST | R (only via share/ACL) | - | - |

Implementation:
- RBAC via `ROLE_PERMISSIONS` in `signsec_backend/security/authz.py`
- ACL via `acl` table (`subject_type`, `subject_id`, `object_type`, `object_id`, `permission`, `expires_at`)

**401 vs 403 vs 404**
- 401: missing/invalid JWT
- 403: authenticated but not allowed
- 404 (masked): for object access attempts to reduce IDOR oracle

#### 3.2 Quotas
- ADMIN: unlimited
- CONTENT_CREATOR: 100/month
- STANDARD_USER: 20/month
- GUEST: 0

### 4) Encryption (3 marks)

#### 4.1 Key generation/exchange – 1.5

- Per-user **RSA 2048** keypair generated on registration.
- Public key stored in clear; private key stored encrypted:
  - AES-GCM encryption key derived from user password using PBKDF2 (KDF salt + iterations stored).

#### 4.2 Hybrid encryption – 1.5

Media upload: `POST /api/media/upload`
- Generate random AES-256 key
- Encrypt file using **AES-256-GCM**
- Wrap AES key using user RSA public key (**RSA-OAEP**)
- Store ciphertext blob in IPFS stub (represents Pinata/IPFS CID)

Media download: `POST /api/media/<id>/download`
- Checks authorization/ownership
- Requires user password to unlock private key
- RSA decrypts wrapped AES key
- AES-GCM decrypts file; verifies integrity (GCM + salted SHA-256)

**Why not encrypt file directly with RSA?**
- RSA is not for large data; hybrid is standard: RSA for key wrapping, AES for bulk.

### 5) Hashing & Digital Signatures (3 marks)

#### 5.1 Hashing – 1.5
- Passwords: PBKDF2 salted hashing
- Media integrity: salted SHA-256 (`salt || plaintext`) stored in DB for re-check on download

#### 5.2 Digital signatures – 1.5

Conversion signing: `POST /api/conversions/<id>/sign`
- Creates canonical JSON metadata (sorted keys)
- Signs with **RSA-PSS + SHA-256** using user private key (unlocked with password)
- Stores signature + signer public key

Verify: `GET /api/conversions/<id>/verify-signature`
- Recomputes canonical JSON and verifies signature with stored public key

### 6) Encoding Techniques (3 marks)

- Base64:
  - MFA QR image returned as base64 PNG
  - Metadata signatures returned as base64
- URL-safe Base64:
  - Share tokens are URL-safe and random (32 bytes)
- QR codes:
  - MFA provisioning QR
  - Share link QR

### 7) Security Levels & Risks (1 mark)

#### Authentication
- **Level 0**: password-only
  - Likelihood: medium-high (phishing/credential reuse)
  - Impact: account takeover → data exposure
  - Mitigation: strong password + rate limit + monitoring
  - Residual risk: phishing and malware
- **Level 1**: password + TOTP MFA
  - Likelihood: reduced
  - Impact: reduced account takeover probability
  - Residual risk: real-time phishing proxy (MFA fatigue not applicable to TOTP but session hijack still possible)

#### Authorization
- **Level 0**: no checks (broken access control)
- **Level 1**: RBAC only
  - Good for “role-based admin vs user” but weak for per-resource sharing
- **Level 2**: RBAC + ACL
  - Fine-grained sharing with expiry; reduces horizontal privilege escalation

#### Encryption
- **Level 0**: plaintext storage
- **Level 1**: TLS only
  - Protects in-transit but not at-rest compromise
- **Level 2**: TLS + AES-GCM ciphertext at rest + RSA key wrapping
  - Stronger against storage compromise; residual risk: stolen password enabling key unlock

### 8) Attacks & Mitigations (1 mark)

1. **Brute force / dictionary**: mitigated by PBKDF2 + rate limiting + generic errors.
2. **Credential stuffing**: IP/username throttling + MFA reduces success rate.
3. **Phishing**: MFA reduces reuse; still vulnerable to token/session theft.
4. **MITM**: TLS assumed; signed metadata adds integrity even if transport is attacked.
5. **Horizontal privilege escalation (IDOR)**: masked 404 + ownership/ACL checks.
6. **Vertical privilege escalation**: RBAC permission checks; admin endpoints guarded.
7. **Rainbow tables**: salts prevent precomputed tables.
8. **Chosen ciphertext attacks**: RSA-OAEP for key wrapping; AES-GCM for authenticated encryption.
9. **Insider threat**: audit logs + least privilege + encrypted media at rest.
10. **Replay (OTP/TOTP)**: time-window validation + step-up challenge token expiry.


