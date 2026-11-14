# Handoff Package: Yogesh (Auth & RBAC Module)

Hi Yogesh! Here are the integration contracts, interim middlewares, permission keys, and request context requirements for wiring your Auth and RBAC service with my Orders, Payments, Returns, and Refunds modules.

---

## 1. What I'm giving you

1. **`auth.middleware.js`**:
   - The interim authentication middleware I built to test Phase 1, Phase 2, and Phase 3.
   - It validates Bearer JWT tokens, handles fallback headers (`x-mock-user` and `x-user-role`), and includes a `generateToken()` helper function used in our test suites.
2. **`permission.middleware.js`**:
   - The RBAC guard (`requirePermission` and `requireAnyPermission`) that wraps all routes.
   - Automatically permits `admin` / `superadmin` and checks `req.user.permissions` for all other roles.
3. **`PERMISSIONS.md`**:
   - The complete table of all 10 granular permission keys enforced in my code (`orders.read`, `orders.create`, `orders.update_status`, `orders.cancel`, `payments.read`, `payments.create`, `returns.read`, `returns.create`, `returns.approve`, `refunds.approve`).
   - Detailed role-to-permission mapping recommendations.
4. **`req-user-shape.md`**:
   - Detailed specification of the `req.user` object (`id`, `name`, `email`, `role`, `permissions`) that my route handlers read.

---

## 2. What I need back from you

1. **Your real `auth.middleware.js`**:
   - To replace the interim stub in `src/middleware/auth.middleware.js`.
   - Must attach the exact `req.user` shape defined in `req-user-shape.md`.
2. **JWT Payload Format & Secret Convention**:
   - Confirmation that you are signing tokens with `process.env.JWT_SECRET`.
   - Token expiration standard (e.g. `1d` or refresh token flow).
3. **Login & Registration Endpoints**:
   - The exact endpoint paths (e.g. `POST /api/v1/auth/login`, `POST /api/v1/auth/register`).
4. **User / Role / Permission Models**:
   - Mongoose schemas or export references if we need to query user profiles directly.
5. **Database Seed Script**:
   - A script that seeds default roles (`admin`, `manager`, `support_agent`, `finance_agent`, `customer`) with my permission keys properly populated into the database.
