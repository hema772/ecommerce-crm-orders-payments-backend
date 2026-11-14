# E-Commerce CRM — Domain Events & EventBus Specification

This document details every domain event emitted by the **Orders**, **Payments**, **Returns**, and **Refunds** modules via `src/integrations/stubs/eventBus.js` and `notificationStub.js`, including their exact payload shapes for consumers (Dashboard, Support/Tickets, Marketing, Notifications).

---

## 1. EventBus Architecture

Events are dispatched via the shared event bus singleton (`DomainEventBus` inheriting from Node.js `EventEmitter`):
```js
const eventBus = require('../integrations/stubs/eventBus');

// Listening to a specific event:
eventBus.on('return.requested', ({ event, data, timestamp }) => { ... });

// Listening to all domain events (Wildcard for dashboard/analytics aggregation):
eventBus.on('*', ({ event, data, timestamp }) => { ... });
```

---

## 2. Emitted Domain Events & Payloads

### 1. `return.requested`
Fired immediately when a customer or support agent submits a valid return request within the 7-day window.

**Consumers:** Support Desk (creates ticket), Customer Notifications (sends acknowledgement SMS/Email), Real-time Dashboard.

**Payload Shape:**
```json
{
  "event": "return.requested",
  "data": {
    "returnId": "6734c3d4e5f6a7b8c9020101",
    "returnNumber": "RET-20261113-X1Y2Z3",
    "orderId": "6734a1b2c3d4e5f6a7b8c901",
    "orderNumber": "ORD-20261113-A1B2C3",
    "customerId": "cust_101",
    "refundAmount": 79900,
    "itemsCount": 1
  },
  "timestamp": "2026-11-13T12:15:00.000Z"
}
```

---

### 2. `return.approved`
Fired when a support agent authorizes the return request (`PATCH /api/v1/returns/:id/approve`).

**Consumers:** Logistics/Courier integration (schedules pickup), Customer Notifications (provides pickup label/instructions).

**Payload Shape:**
```json
{
  "event": "return.approved",
  "data": {
    "returnId": "6734c3d4e5f6a7b8c9020101",
    "returnNumber": "RET-20261113-X1Y2Z3",
    "orderId": "6734a1b2c3d4e5f6a7b8c901",
    "orderNumber": "ORD-20261113-A1B2C3",
    "customerId": "cust_101",
    "approvedBy": "usr_support_01",
    "refundAmount": 79900
  },
  "timestamp": "2026-11-13T12:20:00.000Z"
}
```

---

### 3. `return.rejected`
Fired when a return request is rejected by support or quality inspection (`PATCH /api/v1/returns/:id/reject`).

**Consumers:** Customer Notifications (delivers rejection reason), Support Ticket Close.

**Payload Shape:**
```json
{
  "event": "return.rejected",
  "data": {
    "returnId": "6734c3d4e5f6a7b8c9020101",
    "returnNumber": "RET-20261113-X1Y2Z3",
    "orderId": "6734a1b2c3d4e5f6a7b8c901",
    "orderNumber": "ORD-20261113-A1B2C3",
    "customerId": "cust_101",
    "rejectedBy": "usr_support_01",
    "reason": "Item was opened and tags removed; does not meet return eligibility criteria."
  },
  "timestamp": "2026-11-13T12:20:00.000Z"
}
```

---

### 4. `return.status_updated`
Fired whenever the return moves through downstream stages: `PICKUP_SCHEDULED`, `RECEIVED`, or `INSPECTED`.

**Consumers:** Warehouse Management, Product Inventory (restocks catalog when `RECEIVED`), Live Operations Monitor.

**Payload Shape:**
```json
{
  "event": "return.status_updated",
  "data": {
    "returnId": "6734c3d4e5f6a7b8c9020101",
    "returnNumber": "RET-20261113-X1Y2Z3",
    "orderNumber": "ORD-20261113-A1B2C3",
    "previousStatus": "RECEIVED",
    "status": "INSPECTED",
    "updatedBy": "usr_qa_01",
    "inspectionOutcome": "PASSED"
  },
  "timestamp": "2026-11-13T12:25:00.000Z"
}
```

---

### 5. `refund.processed`
Fired when money has been successfully refunded via Razorpay or marked processed (`PATCH /api/v1/refunds/:id/process` or Razorpay `refund.processed` webhook).

**Consumers:** Finance/Ledger, Customer Notifications (credit confirmation with ARN/UTR), Customer 360 (updates customer lifetime value).

**Payload Shape:**
```json
{
  "event": "refund.processed",
  "data": {
    "refundId": "6734d4e5f6a7b8c903010101",
    "refundNumber": "REF-20261113-R1F2N3",
    "orderId": "6734a1b2c3d4e5f6a7b8c901",
    "orderNumber": "ORD-20261113-A1B2C3",
    "customerId": "cust_101",
    "amount": 79900,
    "currency": "INR",
    "razorpayRefundId": "rfnd_Q1w2e3r4t5y6u7"
  },
  "timestamp": "2026-11-13T12:32:00.000Z"
}
```

---

## 3. Inbound Gateway Webhooks (Processed by System)

The Payments module listens to authenticated raw-body webhooks from Razorpay:

| Webhook Event | Handled Action | Target Model Updates |
|---|---|---|
| `payment.captured` | Verifies payment & marks order paid | `Payment.status = 'PAID'`, `Order.status = 'CONFIRMED'`, `Order.paymentStatus = 'PAID'` |
| `payment.failed` | Marks payment failure with gateway error | `Payment.status = 'FAILED'`, `Payment.error = { code, description }` |
| `refund.processed` | Reconciles asynchronous gateway refund | `Refund.status = 'PROCESSED'`, `Order.paymentStatus = 'PARTIALLY_REFUNDED' \| 'REFUNDED'` |
