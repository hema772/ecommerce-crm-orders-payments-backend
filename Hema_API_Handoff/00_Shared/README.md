# E-Commerce CRM — Shared API Specification & Artifacts (`00_Shared`)

Welcome to the shared core documentation and testing artifacts for the **Orders**, **Payments (Razorpay Test Mode)**, and **Returns & Refunds** modules.

This folder contains universal contracts, OpenAPI specifications, Postman collections, real API response samples, permission matrices, and domain events used across all backend services and frontend modules.

---

## 📁 Contents & How to Use Them

### 1. `postman/ecommerce-crm-complete.postman_collection.json`
- **What it is:** Full Postman Collection (v2.1.0) containing all 32 endpoints across Orders, Payments, Returns, Refunds, and System Probes.
- **How to use:**
  1. Open Postman → Click **Import** → Drag and drop this JSON file.
  2. Set collection variables:
     - `baseUrl`: `http://localhost:5000`
     - `authToken`: Your JWT Bearer token (or use `x-user-role: admin` mock header during local development).
  3. Pre-scripted tests automatically save `orderId`, `paymentId`, and `returnId` for chaining sequential workflows.

### 2. `openapi.json`
- **What it is:** The complete OpenAPI 3.0.3 machine-readable specification generated from the codebase router definitions.
- **How to use:**
  - Import into Swagger UI, Swagger Editor, Stoplight, or Postman.
  - Use with code generation tools (e.g. `openapi-typescript-codegen`, `orval`, or `rtk-query-codegen`) to auto-generate typed React hooks and API client SDKs.
  - Can be served locally at `GET /api-docs.json` or viewed interactively in browser at `http://localhost:5000/api-docs`.

### 3. `sample-responses/`
- **What it is:** 35 authentic JSON files containing real success (`200`/`201`) and error (`400`/`404`) response envelopes for every endpoint in the system.
- **Naming Convention:** `<module>.<action>.<status_code>.json`
  - E.g., `orders.create.200.json`, `orders.create.400.json`, `payments.verify.200.json`, `returns.approve.200.json`, `refunds.process.200.json`.
- **How to use:**
  - Frontend developers (Hazm, Goodson, Harini, Mohamed Sarjune, Mohamed Hasik) can use these to mock MSW (Mock Service Worker) handlers, seed local frontend state, or bind Shadcn UI components before connecting to the live API.

### 4. `PERMISSIONS.md`
- **What it is:** Comprehensive registry of all 10 RBAC permission keys (`orders.read`, `orders.create`, `orders.update_status`, `orders.cancel`, `payments.read`, `payments.create`, `returns.read`, `returns.create`, `returns.approve`, `refunds.approve`).
- **How to use:**
  - **Yogesh (Auth/RBAC)**: Use this matrix to seed roles and populate the JWT `permissions` claim.
  - **Frontend UI**: Use permission checks to conditionally show/hide action buttons (e.g. "Approve Return", "Issue Refund", "Cancel Order").

### 5. `EVENTS.md`
- **What it is:** Specification of domain events emitted via `DomainEventBus` and `notificationStub`.
- **Events Covered:** `return.requested`, `return.approved`, `return.rejected`, `return.status_updated`, `refund.processed`.
- **How to use:**
  - **Mohana (Support/Marketing/Notifications)**: Hook listeners up to Socket.IO and customer communication pipelines.
  - **Harini (Dashboard)**: Listen to `*` wildcard events to update real-time revenue and order metrics.

### 6. `STATUSES.md`
- **What it is:** Definitive status flow diagrams and transition tables for Orders, Payments, Returns, and Refunds.
- **How to use:**
  - Understand valid progressions (e.g., `PLACED` → `CONFIRMED` → `PROCESSING` → `PACKED` → `SHIPPED` → `OUT_FOR_DELIVERY` → `DELIVERED`).
  - Strict rule: Orders cannot be cancelled once status reaches `SHIPPED`.
  - Returns require 7-day delivery eligibility window.

### 7. `.env.example`
- **What it is:** Environment variable template with safe placeholders.
- **How to use:** Copy to `.env` in the backend root and update with your local MongoDB URI, JWT secret, and Cloudinary keys.

---

## ⚡ Global API Conventions
- **Base URL:** `http://localhost:5000/api/v1`
- **Money:** Stored strictly as **non-negative integer paise** (₹1.00 = 100 paise). The server handles all pricing, taxes, and discounts. The frontend simply divides by 100 for display.
- **Standard Response Envelope:**
  ```json
  {
    "success": true,
    "message": "Human readable summary",
    "data": { ... },
    "pagination": { "page": 1, "limit": 10, "totalRecords": 45, "totalPages": 5, "hasNext": true, "hasPrev": false }
  }
  ```
- **Standard Error Envelope:**
  ```json
  {
    "success": false,
    "message": "Error description",
    "errors": [{ "field": "items", "message": "Item is required" }]
  }
  ```
