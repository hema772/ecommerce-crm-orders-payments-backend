# E-Commerce CRM — Entity Lifecycle Statuses & State Machine Transitions

This document provides the definitive state machine specifications and valid status transitions for all core entities: **Orders**, **Payments**, **Returns**, and **Refunds**.

---

## 1. Order Status Lifecycle

```
[PLACED] ──────────► [CONFIRMED] ──────────► [PROCESSING] ──────────► [PACKED] ──────────► [SHIPPED] ──────────► [OUT_FOR_DELIVERY] ──────────► [DELIVERED]
   │                      │                       │                      │
   ▼                      ▼                       ▼                      ▼
[CANCELLED]          [CANCELLED]             [CANCELLED]            [CANCELLED]
```

### Valid Transition Matrix

| Current Status | Allowed Next Statuses | Notes |
|---|---|---|
| `PLACED` | `CONFIRMED`, `CANCELLED` | Initial order state upon creation. |
| `CONFIRMED` | `PROCESSING`, `CANCELLED` | Set automatically once payment is verified or COD accepted. |
| `PROCESSING` | `PACKED`, `CANCELLED` | Order assigned to warehouse fulfillment team. |
| `PACKED` | `SHIPPED`, `CANCELLED` | Items boxed, packing slip & shipping label attached. |
| `SHIPPED` | `OUT_FOR_DELIVERY` | Handed over to logistics carrier. **Cancellation is strictly forbidden from this point onwards.** |
| `OUT_FOR_DELIVERY` | `DELIVERED` | Courier delivery agent on route with parcel. |
| `DELIVERED` | *(None - Terminal)* | Customer received package. Starts 7-day return eligibility window. |
| `CANCELLED` | *(None - Terminal)* | Terminal state. Reserved stock is restored to catalog. If previously paid, flagged for refund. |

### Cancellation Rule
- Cancellation is permitted **only** when status is in: `['PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED']`.
- Any attempt to cancel an order that is `SHIPPED`, `OUT_FOR_DELIVERY`, or `DELIVERED` returns HTTP `400 Bad Request`.

---

## 2. Order Payment Status Lifecycle

An order tracks its financial state separately from its fulfillment state via `paymentStatus`:

| Status | Description |
|---|---|
| `PENDING` | Order created; payment not yet captured or offline remittance pending. |
| `PAID` | Full payment captured via Razorpay checkout, webhook, or offline record. |
| `FAILED` | Gateway transaction failed or expired. |
| `REFUND_PENDING` | Order cancelled before shipment or return approved; awaiting refund disbursement. |
| `PARTIALLY_REFUNDED` | One or more items refunded; refund sum < order grand total. |
| `REFUNDED` | Full order value has been refunded back to customer. |

---

## 3. Payment Record Status Lifecycle

Individual transaction records stored in the `Payment` collection:

| Status | Description |
|---|---|
| `PENDING` | Razorpay order created (`order_xxx`); customer checkout modal open. |
| `PAID` | Signature verified or `payment.captured` webhook received. |
| `FAILED` | Customer abandoned payment, bank declined, or signature check failed. |

---

## 4. Return Status Lifecycle

```
[REQUESTED] ──────► [APPROVED] ──────► [PICKUP_SCHEDULED] ──────► [RECEIVED] ──────► [INSPECTED] ──────► [REFUNDED]
    │                                                                                       │
    ▼                                                                                       ▼
[REJECTED]                                                                              [REJECTED]
```

### Valid Return Transition Matrix

| Current Status | Allowed Next Statuses | Action / Performed By |
|---|---|---|
| `REQUESTED` | `APPROVED`, `REJECTED` | Submitted by customer within 7 days of delivery. Support agent reviews request. |
| `APPROVED` | `PICKUP_SCHEDULED` | Support agent approves. Reverse pickup scheduled with courier. |
| `PICKUP_SCHEDULED`| `RECEIVED` | Carrier collects parcel and delivers to returns warehouse. |
| `RECEIVED` | `INSPECTED` | Warehouse logs receipt; triggers catalog restock via inventory service. |
| `INSPECTED` | `REFUNDED`, `REJECTED` | QA checks item condition. If approved, creates pending refund. |
| `REFUNDED` | *(None - Terminal)* | Finance executes gateway disbursement; money credited to customer. |
| `REJECTED` | *(None - Terminal)* | Request rejected with mandatory reason note. |

### Return Eligibility Criteria
1. Order `status` must be strictly `DELIVERED`.
2. Time elapsed since delivery must not exceed `RETURN_WINDOW_DAYS` (default: 7 days).
3. Return quantity for any item must not exceed the delivered order quantity minus already returned quantities.
4. Duplicate active returns on the same order item are rejected with HTTP `400`.

---

## 5. Refund Record Status Lifecycle

Individual refund records stored in the `Refund` collection:

| Status | Description |
|---|---|
| `PENDING` | Created for an inspected return or cancelled order. Waiting for Finance execution. |
| `PROCESSED` | Gateway disbursement completed via Razorpay `payments.refund()` or webhook confirmed. |
| `FAILED` | Gateway rejected refund (e.g. gateway balance low, invalid payment ID). |
