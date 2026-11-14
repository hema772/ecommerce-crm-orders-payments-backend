# Specification: `req.user` Object Shape Expected by Orders, Payments & Returns

Hi Yogesh! This document defines the exact object structure my modules expect to find on Express's `req.user` after your authentication middleware executes.

---

## 1. Required `req.user` Structure

When a request passes your `authenticate` middleware, `req.user` must be attached as follows:

```typescript
interface AuthenticatedUserContext {
  /**
   * Unique user identifier (Mongoose ObjectId string or UUID)
   * Stored in order.statusHistory.changedBy, audit logs, and refund records.
   */
  id: string;

  /**
   * Full display name of the user (used in audit trail)
   */
  name: string;

  /**
   * Verified email address
   */
  email: string;

  /**
   * User role name: 'admin' | 'manager' | 'support_agent' | 'finance_agent' | 'viewer' | 'customer'
   * Note: 'admin' and 'superadmin' automatically bypass granular permission checks in permission.middleware.js.
   */
  role: string;

  /**
   * Array of granular permission strings assigned to this user / role.
   * e.g. ['orders.read', 'orders.create', 'payments.read', 'returns.approve']
   */
  permissions: string[];
}
```

### Example JavaScript Object:
```javascript
req.user = {
  id: "usr_6734a1b2c3d4e5f6a7b8c901",
  name: "Support Lead",
  email: "support@examplecrm.com",
  role: "support_agent",
  permissions: [
    "orders.read",
    "orders.create",
    "orders.update_status",
    "orders.cancel",
    "payments.read",
    "returns.read",
    "returns.create",
    "returns.approve"
  ]
};
```

---

## 2. JWT Payload Convention

When issuing tokens at `POST /api/v1/auth/login`, please encode these exact keys inside the JWT payload:

```json
{
  "id": "6734a1b2c3d4e5f6a7b8c901",
  "name": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "role": "customer",
  "permissions": [
    "orders.create",
    "orders.read",
    "orders.cancel",
    "payments.create",
    "returns.create",
    "returns.read"
  ],
  "iat": 1731499200,
  "exp": 1731585600
}
```

> **Fallback Handling in Current Code:**  
> If `decoded.id` is not present, our stub accepts `decoded.userId` or `decoded.sub`. If `decoded.permissions` is omitted in the JWT, our stub falls back to looking up `ROLE_PERMISSIONS_MAP[decoded.role]`. However, encoding `permissions` directly in the JWT is preferred so that permissions are stateless.
