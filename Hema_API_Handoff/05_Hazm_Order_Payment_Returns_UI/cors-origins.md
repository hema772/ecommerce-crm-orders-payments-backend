# Frontend Guide: Allowed CORS Origins & Port Configuration

Hi Hazm! This document lists the currently configured Cross-Origin Resource Sharing (CORS) origins accepted by the backend.

---

## 1. Allowed Origins

By default, the backend allows credentials and cross-origin requests from:
- `http://localhost:3000` (Standard Next.js / Create React App dev server)
- `http://localhost:5173` (Standard Vite dev server)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

---

## 2. Using an Alternative Port?
If your Vite dev server runs on another port (e.g., `http://localhost:5174`, `http://localhost:8080`, or `http://localhost:4173`):
1. Let me know your active port.
2. We add it to the `.env` configuration:
   ```ini
   CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:5174
   ```
3. The server hot-reloads with full CORS support for your active port.

---

## 3. Allowed HTTP Headers & Methods
- **Methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- **Headers:** `Content-Type`, `Authorization`, `x-mock-user`, `x-user-role`, `x-razorpay-signature`
- **Credentials:** `true` (supports cookies and authorization headers)
