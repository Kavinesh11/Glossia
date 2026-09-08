## SignSec Frontend (Next.js demo UI)

### Environment

Set:
- `NEXT_PUBLIC_API_BASE` (example: `http://localhost:5000`)

You can set it in your shell before running `npm run dev`, or create a local `.env.local` file if allowed in your environment.

### Security note (lab)

This demo stores the JWT in `localStorage` for simplicity. In production, prefer **httpOnly Secure cookies + CSRF protection** to reduce token theft risk from XSS.


