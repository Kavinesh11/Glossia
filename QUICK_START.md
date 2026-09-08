# Quick Start Guide - SignSec OTP + Admin System

Get the application running in 5 minutes!

---

## ⚡ 5-Minute Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL 12+

### Step 1: Backend (3 mins)

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Create PostgreSQL database
createdb signsec

# 3. Set database URL
export DATABASE_URL="postgresql://localhost/signsec"

# 4. Initialize database
python -c "from signsec_backend.db import Base, engine; Base.metadata.create_all(bind=engine)"

# 5. Create admin user (constant credentials)
python -m signsec_backend.init_admin

# 6. Start backend
python app.py
```

✅ Backend running at `http://localhost:5000`

### Step 2: Frontend (2 mins)

```bash
# 1. Go to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

✅ Frontend running at `http://localhost:3000`

---

## 🎯 Immediate Tests (Try These First)

### Test 1: Admin Login
```
URL: http://localhost:3000/login
Username: admin
Password: StrongPass!234
→ Click Login
→ See Dashboard with "Admin Panel" link
→ Click Admin Panel
→ View audit logs & conversions
```

### Test 2: User Registration
```
URL: http://localhost:3000/register

Step 1 - Email:
- Email: testuser@example.com
- Delivery: Email
- Click "Send OTP"

Check Backend Console:
- Copy the OTP code (e.g., 123456)

Step 2 - OTP:
- Paste OTP code: 123456
- Click "Verify OTP"

Step 3 - Credentials:
- Username: testuser
- Password: ValidPass!123
- Click "Create Account"

→ Redirected to Login
→ Login with new credentials
→ See Dashboard with "testuser" 
→ "Admin Panel" link is NOT visible
```

### Test 3: Admin Feature Gating
```
Login as regular user (from Test 2)
Try to access: http://localhost:3000/admin
→ Should see 403 Forbidden
OR: Try API call:
curl http://localhost:5000/api/admin/audit-logs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
→ Returns 403 (no permission)
```

---

## 📱 API Quick Reference

### Registration
```bash
# Step 1: Request OTP
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","delivery_method":"email"}'

# Response:
# {
#   "registration_id": "uuid-xxx",
#   "otp_required": true,
#   "message": "OTP sent to email"
# }

# Check backend console for OTP code

# Step 2: Verify OTP & Create Account
curl -X POST http://localhost:5000/api/auth/register/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "registration_id":"uuid-xxx",
    "otp_code":"123456",
    "username":"myuser",
    "password":"StrongPass!123"
  }'

# Response:
# {
#   "id": "uuid-xxx",
#   "username": "myuser",
#   "email": "user@example.com",
#   "role": "USER"
# }
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"StrongPass!234"}'

# Response:
# {
#   "access_token": "eyJ...",
#   "token_type": "Bearer",
#   "expires_in": 3600
# }
```

### Admin: View Audit Logs
```bash
curl http://localhost:5000/api/admin/audit-logs \
  -H "Authorization: Bearer eyJ..."

# Response: List of all audit events
```

### Admin: View All Conversions
```bash
curl http://localhost:5000/api/admin/conversions \
  -H "Authorization: Bearer eyJ..."

# Response: List of all conversions
```

---

## 🔑 Test Credentials

### Pre-Created Admin Account
```
Email: admin@example.edu
Username: admin
Password: StrongPass!234
Role: ADMIN
```

### Create Your Own User Account
1. Go to `/register`
2. Follow 3-step OTP flow
3. Example:
   - Email: `yourname@example.com`
   - Username: `yourname`
   - Password: `StrongPass!123`

---

## 🐛 Troubleshooting

### Backend won't start
```
Error: database does not exist
→ Run: createdb signsec

Error: "relation \"users\" does not exist"
→ Run: python -c "from signsec_backend.db import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Admin user doesn't exist
```
Error: Invalid credentials for admin@example.edu
→ Run: python -m signsec_backend.init_admin
```

### OTP code not appearing
```
Check backend console output (same terminal where python app.py runs)
OTP codes are printed to stdout for demo purposes
```

### Frontend can't connect to backend
```
Error: Failed to fetch from http://localhost:5000
→ Make sure backend is running: python app.py
→ Check NEXT_PUBLIC_API_BASE in frontend .env
```

### Port 5000 or 3000 already in use
```
# Backend on different port:
PORT=8000 python app.py

# Frontend on different port:
npm run dev -- -p 3001
```

---

## 📚 Deep Dives

Want to understand the system better?

- **Architecture & Security**: See [README.md](README.md)
- **Security Details**: See [docs/SECURITY_LAB_REPORT.md](docs/SECURITY_LAB_REPORT.md)
- **Test Scenarios**: See [docs/TEST_IDEAS.md](docs/TEST_IDEAS.md)
- **Implementation Details**: See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## ✨ Key Features to Explore

1. **OTP Registration** - 3-step flow with email/SMS
2. **Admin Dashboard** - View all users' audit logs
3. **Rate Limiting** - Try 5 failed logins → see rate limit error
4. **Encryption** - Upload a file in `/upload` (AES-256-GCM)
5. **Signatures** - Sign a conversion, verify signature
6. **Role-Based Access** - Try admin features as regular user → 403

---

## 🎓 Learning Objectives

This lab teaches:
- ✅ Secure registration (OTP-based)
- ✅ Authentication (password + optional MFA)
- ✅ Authorization (RBAC with 2 tiers)
- ✅ Encryption (hybrid RSA + AES)
- ✅ Hashing (PBKDF2 passwords)
- ✅ Digital signatures (RSA-PSS)
- ✅ Audit logging (immutable records)
- ✅ Rate limiting (brute force protection)
- ✅ No user enumeration

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Replace email/SMS stubs with real services
- [ ] Use httpOnly cookies instead of localStorage
- [ ] Add CSRF token protection
- [ ] Enable HTTPS/TLS
- [ ] Rotate database passwords
- [ ] Set strong JWT secret
- [ ] Configure rate limits appropriately
- [ ] Set up log aggregation
- [ ] Add input validation/sanitization
- [ ] Regular security audits

---

**Ready to explore? Start with the admin login test above! 🎉**
