# E-Commerce CRM — System Permission Matrix & RBAC Specification

This document defines every permission key enforced across the **Orders**, **Payments**, **Returns**, and **Refunds** backend modules, along with the recommended role assignments.

---

## 1. Permission Registry

| Permission Key | Module | Description | Typical HTTP Endpoints |
|---|---|---|---|
| `orders.create` | Orders | Place new orders & initiate checkout | `POST /api/v1/orders` |
| `orders.read` | Orders | View order lists, details, tracking & invoices | `GET /api/v1/orders`, `GET /api/v1/orders/:id`, `GET /api/v1/orders/:id/tracking`, `GET /api/v1/orders/:id/invoice` |
| `orders.update_status` | Orders | Advance order fulfillment status along state machine | `PATCH /api/v1/orders/:id/status` |
| `orders.cancel` | Orders | Cancel order prior to `SHIPPED` status & release inventory | `POST /api/v1/orders/:id/cancel` |
| `payments.create` | Payments | Initiate Razorpay order, verify signature, record manual payment, reconcile | `POST /api/v1/payments/create-order`, `POST /api/v1/payments/verify`, `POST /api/v1/payments`, `PATCH /api/v1/payments/:id/status`, `POST /api/v1/payments/reconcile` |
| `payments.read` | Payments | View payment records, transaction histories, and refund ledgers | `GET /api/v1/payments`, `GET /api/v1/payments/:id`, `GET /api/v1/orders/:id/payment`, `GET /api/v1/refunds`, `GET /api/v1/refunds/:id` |
| `returns.create` | Returns | Submit return request within the 7-day delivery window | `POST /api/v1/returns` |
| `returns.read` | Returns | View return requests, inspection notes & evidence files | `GET /api/v1/returns`, `GET /api/v1/returns/:id` |
| `returns.approve` | Returns | Authorize/reject return requests & advance return lifecycle | `PATCH /api/v1/returns/:id/approve`, `PATCH /api/v1/returns/:id/reject`, `PATCH /api/v1/returns/:id/status` |
| `refunds.approve` | Refunds | Create pending refund and execute gateway disbursement | `POST /api/v1/refunds`, `PATCH /api/v1/refunds/:id/process` |

> **Critical Segregation of Duties:**  
> `returns.approve` (Support role) and `refunds.approve` (Finance/Admin role) are strictly separated. Support specialists authorize the return of goods; only authorized Finance agents or Admins can disburse money back to the customer's source account.

---

## 2. Role-to-Permissions Mapping Matrix

| Role | Description | Assigned Permissions |
|---|---|---|
| **`admin` / `superadmin`** | Full platform superuser | **All permissions** (automatic bypass in middleware) |
| **`manager`** | Store operations & fulfillment manager | `orders.read`, `orders.create`, `orders.update_status`, `orders.cancel`, `payments.read`, `payments.create`, `returns.read`, `returns.create`, `returns.approve`, `refunds.approve` |
| **`support_agent`** | Customer service representative | `orders.read`, `orders.create`, `orders.update_status`, `orders.cancel`, `payments.read`, `returns.read`, `returns.create`, `returns.approve` |
| **`finance_agent`** | Accounting & ledger officer | `orders.read`, `payments.read`, `payments.create`, `refunds.approve` |
| **`warehouse_staff`** | Packing & logistics team | `orders.read`, `orders.update_status`, `returns.read`, `returns.approve` *(status advancement)* |
| **`viewer`** | Read-only analytics & reporting user | `orders.read`, `payments.read`, `returns.read` |
| **`customer`** | Storefront shopper / authenticated buyer | `orders.create`, `orders.read`, `orders.cancel`, `payments.create`, `returns.create`, `returns.read` |

---

## 3. How Permissions are Enforced

Every incoming request passes through:
1. `authenticate` middleware (`src/middleware/auth.middleware.js`):
   - Extracts and verifies Bearer JWT token from `Authorization` header.
   - Populates `req.user = { id, name, email, role, permissions }`.
2. `requirePermission(permissionKey)` (`src/middleware/permission.middleware.js`):
   - Bypasses check if `req.user.role === 'admin' || req.user.role === 'superadmin'`.
   - Otherwise ensures `req.user.permissions.includes(permissionKey)`.
   - Returns HTTP `403 Forbidden` with `{ success: false, message: "Forbidden: You lack..." }` if missing.
