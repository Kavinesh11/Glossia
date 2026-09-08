# SignSec - Test Ideas & Scenarios

This document outlines manual and automated test scenarios for verifying security features.

---

## 🧪 Manual Test Scenarios

### 1. OTP Registration Flow

**Test 1.1: Happy Path Email OTP**
```
1. Navigate to /register
2. Enter email: testuser@example.com
3. Select "Email" delivery method
4. Click "Send OTP"
5. → Backend logs OTP code to console (e.g., 123456)
6. Enter OTP code
7. Click "Verify OTP"
8. Enter username: testuser
9. Enter password: ValidPass!123
10. Click "Create Account"
11. ✓ Redirected to /login
12. ✓ Account created in database
```

**Test 1.2: Invalid OTP (Expired)**
```
1. Request OTP for email
2. Wait 11 minutes (OTP TTL is 10 minutes)
3. Enter OTP code
4. ✗ Error: "Invalid or expired OTP code"
```

**Test 1.3: Invalid OTP (Wrong Code)**
```
1. Request OTP for email: 123456
2. Enter wrong code: 654321
3. ✗ Error: "Invalid or expired OTP code"
```

**Test 1.4: SMS OTP Stub**
```
1. Navigate to /register
2. Enter email: testuser2@example.com
3. Select "SMS" delivery method
4. Enter phone number: +14155552671
5. Click "Send OTP"
6. ✓ Backend prints OTP to console (not actually sent via SMS)
7. Complete OTP verification
8. ✓ Account created
```

**Test 1.5: Duplicate Email**
```
1. Register user: admin@example.edu (already exists)
2. ✗ Error: "Email already registered"
```

**Test 1.6: Duplicate Username**
```
1. Register user with email: user1@example.com
2. Complete OTP verification
3. Enter username: admin (already taken)
4. ✗ Error: "Username already taken"
```

---

### 2. Login & Authentication

**Test 2.1: Admin Login (Happy Path)**
```
1. Navigate to /login
2. Username: admin
3. Password: StrongPass!234
4. Click "Login"
5. ✓ Redirected to /dashboard
6. ✓ Role shows: "ADMIN"
7. ✓ "Admin Panel" link is visible
```

**Test 2.2: User Login (Happy Path)**
```
1. Register new user (e.g., newuser@example.com → username: alice → password: StrongPass!123)
2. Navigate to /login
3. Username: alice
4. Password: StrongPass!123
5. ✓ Redirected to /dashboard
6. ✓ Role shows: "USER"
7. ✓ "Admin Panel" link is NOT visible
```

**Test 2.3: Invalid Password**
```
1. Username: admin
2. Password: WrongPassword!234
3. ✗ Error: "Invalid credentials"
4. ✓ No indication whether username exists (no user enumeration)
```

**Test 2.4: Non-existent Username**
```
1. Username: nonexistent_user
2. Password: SomePassword!123
3. ✗ Error: "Invalid credentials" (generic)
```

**Test 2.5: Rate Limiting (5 attempts in 15 sec)**
```
1. Attempt login with wrong password 5 times rapidly
2. On 6th attempt within 15 seconds:
3. ✗ Error: "Too many attempts. Try again later."
4. Wait 15 seconds
5. ✓ Can login again
```

---

### 3. Authorization & RBAC

**Test 3.1: Admin Access to Admin Panel**
```
1. Login as admin (admin / StrongPass!234)
2. Navigate to /admin
3. ✓ Can view audit logs
4. ✓ Can view all conversions
5. ✓ Can see actions from all users
```

**Test 3.2: User Cannot Access Admin Panel**
```
1. Login as regular user (alice / StrongPass!123)
2. Try to navigate to /admin
3. ✗ Error: "Insufficient permissions" (403 Forbidden)
4. OR: "Admin Panel" link is hidden on /dashboard
```

**Test 3.3: Invalid Token Access**
```
1. Manually set Authorization header: Bearer invalid_token
2. Try to access protected endpoint (/api/admin/audit-logs)
3. ✗ Error: "Invalid token" or "Unauthorized" (401)
```

**Test 3.4: Expired Token**
```
1. Login (get JWT)
2. Wait for token to expire (TTL: 1 hour in config; can set to 5 sec for testing)
3. Try to access protected endpoint
4. ✗ Error: "Invalid token" (401)
```

---

### 4. Encryption & Data Protection

**Test 4.1: File Upload Encryption**
```
1. Login as user
2. Navigate to /upload
3. Select a file (e.g., video.mp4)
4. Click "Upload"
5. ✓ File encrypted with AES-256-GCM
6. ✓ AES key wrapped with user's RSA public key
7. ✓ Stored in backend storage (as plaintext ciphertext)
```

**Test 4.2: File Download Decryption**
```
1. Upload a file (as above)
2. Request download
3. ✓ Backend unwraps AES key with user's RSA private key (needs password step-up)
4. ✓ Decrypts file with AES-GCM
5. ✓ Verifies integrity (SHA-256)
6. ✓ File downloaded successfully
```

**Test 4.3: Tampering Detection**
```
1. Upload file: original.txt (content: "Hello World")
2. Manually corrupt ciphertext in storage
3. Download file
4. ✗ Error: "Integrity check failed" or "Decryption failed"
```

**Test 4.4: User Cannot Decrypt Other User's File**
```
1. User A uploads file with AES key wrapped to User A's RSA public key
2. User B attempts to access User A's file
3. ✗ Error: "404 Not Found" (ownership check) OR "Forbidden" (ACL check)
```

---

### 5. Digital Signatures

**Test 5.1: Sign Conversion Metadata**
```
1. Login as user
2. Create conversion (e.g., YouTube → sign language)
3. Click "Sign Conversion"
4. ✓ Backend signs metadata with user's RSA private key
5. ✓ Signature stored with conversion
6. ✓ Signer's public key stored
```

**Test 5.2: Verify Signature**
```
1. View conversion with signature
2. Click "Verify Signature"
3. ✓ Backend recomputes canonical metadata hash
4. ✓ Verifies RSA-PSS signature matches
5. ✓ Confirms signer identity (public key in record)
```

**Test 5.3: Tampered Metadata Fails Verification**
```
1. Sign conversion as User A
2. Admin manually modifies conversion metadata in DB
3. Click "Verify Signature"
4. ✗ Error: "Signature verification failed"
```

---

### 6. Audit Logging

**Test 6.1: Audit Log Entries Created**
```
1. Register new user → audit log entry: "auth.register"
2. Login → audit log entry: "auth.login"
3. Upload file → audit log entry: "media.upload"
4. Create conversion → audit log entry: "conversion.create"
5. ✓ Each entry has: actor_user_id, action, outcome, timestamp
```

**Test 6.2: Admin Views All Logs**
```
1. Login as admin
2. Navigate to /admin
3. ✓ View logs from all users
4. ✓ Logs show: action, outcome, actor, IP, message, timestamp
```

**Test 6.3: User Cannot View Logs**
```
1. Login as regular user (alice)
2. Try to access /admin → 403 Forbidden
3. Try API call: GET /api/admin/audit-logs → 403
```

**Test 6.4: Logs Are Immutable**
```
1. Manually try to UPDATE/DELETE audit log record in DB
2. ✓ Records should have no update triggers (append-only)
3. Verify logs not deleted during normal operations
```

---

### 7. Password Hashing

**Test 7.1: Password Policy Enforcement**
```
Valid passwords:
- StrongPass!234 ✓
- MyP@ssw0rd! ✓
- Test123!Abc ✓

Invalid passwords:
- password123 ✗ (no uppercase/special)
- Pass!123 ✗ (less than 12 chars)
- ALLUPPER!123 ✗ (no lowercase)
- lowercase123! ✗ (no uppercase)
```

**Test 7.2: Different Users Have Different Password Hashes**
```
1. User A sets password: StrongPass!234
2. User B sets password: StrongPass!234
3. ✓ Database shows different hash values (due to per-user salt)
4. ✓ Both can login with their respective passwords
```

**Test 7.3: Password Not Stored in Plaintext**
```
1. Register user with password: StrongPass!234
2. Query database: SELECT password_hash FROM users WHERE email='...'
3. ✓ Shows hashed value (not "StrongPass!234")
4. ✓ Hash is non-reversible
```

---

### 8. OTP vs MFA (Optional for Existing Users)

**Test 8.1: Enable MFA After Registration**
```
1. Login as user who registered via OTP
2. Navigate to account settings (if implemented)
3. Click "Enable MFA"
4. ✓ Backend generates TOTP secret
5. ✓ Displays QR code
6. Scan with Google Authenticator
7. Enter TOTP code to confirm
8. ✓ MFA now enabled
```

**Test 8.2: Login with TOTP**
```
1. User has MFA enabled
2. Login: username + password → OK
3. Redirect to MFA verification page
4. Enter TOTP code from authenticator
5. ✓ JWT access token issued
```

**Test 8.3: Login with Backup Code**
```
1. User has MFA enabled and backup codes
2. Login: username + password → OK
3. Redirect to MFA verification page
4. Click "Use backup code"
5. Enter backup code (e.g., ABCD-1234)
6. ✓ JWT access token issued
7. ✓ Backup code marked as "used" in DB (can't reuse)
```

---

## 🤖 Automated Test Examples (Pytest)

**Test: OTP Verification**
```python
from signsec_backend.security.otp_service import verify_otp, create_otp_secret

def test_otp_expiry():
    otp_code = "123456"
    stored_otp, expiry = create_otp_secret(otp_code, ttl_minutes=10)
    
    # Correct OTP should verify
    assert verify_otp(stored_otp, otp_code, expiry) == True
    
    # Wrong OTP should fail
    assert verify_otp(stored_otp, "000000", expiry) == False
```

**Test: Password Hashing**
```python
from signsec_backend.security.passwords import pbkdf2_hash_password, pbkdf2_verify_password

def test_password_hashing():
    password = "StrongPass!234"
    hashed = pbkdf2_hash_password(password, iterations=150000)
    
    assert pbkdf2_verify_password(password, hashed) == True
    assert pbkdf2_verify_password("WrongPass!234", hashed) == False
```

**Test: JWT Token**
```python
from signsec_backend.security.jwt_tokens import issue_access_token, decode_token
from signsec_backend.config import SETTINGS

def test_jwt_token():
    token = issue_access_token(
        settings=SETTINGS,
        user_id="test-user-id",
        role="USER"
    )
    
    claims = decode_token(settings=SETTINGS, token=token)
    assert claims["sub"] == "test-user-id"
    assert claims["role"] == "USER"
```

**Test: RBAC**
```python
from signsec_backend.security.authz import has_permission
from signsec_backend.models import Permission, Role, User

def test_admin_permissions():
    admin = User(role=Role.ADMIN)
    assert has_permission(user=admin, permission=Permission.VIEW_AUDIT_LOGS) == True

def test_user_permissions():
    user = User(role=Role.USER)
    assert has_permission(user=user, permission=Permission.VIEW_AUDIT_LOGS) == False
```

---

## 🔒 Security Checklist

- [ ] OTP expires after 10 minutes
- [ ] Invalid OTP rejected
- [ ] Rate limiting blocks after 5 failed logins
- [ ] Admin-only endpoints return 403 for non-admins
- [ ] Files encrypted with AES-256-GCM
- [ ] RSA keys 2048-bit
- [ ] Password policy enforced (12+ chars with mixed case/digit/special)
- [ ] Passwords hashed with PBKDF2-SHA256
- [ ] Audit logs immutable
- [ ] No user enumeration on login
- [ ] JWT tokens expire (1 hour TTL)
- [ ] Invalid tokens rejected (401)
- [ ] Digital signatures verify correctly
- [ ] Tampered data fails integrity checks
- [ ] Cross-user access blocked


