# Specification: Inventory Stock Change Timing & Lifecycle Hooks

Hi Gayathri! Here is the precise timing and lifecycle trigger specification for when our Order, Payment, and Return workflows reserve, deduct, release, or restock catalog inventory.

---

## 1. Stock Lifecycle Summary

| Lifecycle Event | Action on Inventory | API Trigger | Methods Called |
|---|---|---|---|
| **Order Created** (`POST /api/v1/orders`) | **Check availability & Reserve/Deduct** | Order creation transaction | `checkStock(items)`, `reserveStock(items, orderId)` |
| **Order Cancelled** (`POST /api/v1/orders/:id/cancel`) | **Release & Restock** | Pre-shipped order cancellation | `releaseStock(items, orderId)` |
| **Return Received** (`PATCH /api/v1/returns/:id/status` -> `RECEIVED`) | **Restock Returned Items** | Warehouse physically receives reverse parcel | `restock(items, returnId)` |

---

## 2. Detailed Timing & Logic

### A. Order Placement (Stock Reservation / Deduction)
- **When:** Inside `orders.service.js` during the `createOrder` database transaction.
- **Pre-check:** `await inventoryService.checkStock(items)`
  - If any SKU has `availableStock < requestedQty`, the entire order creation fails immediately with HTTP `400 Bad Request` and detailed error objects indicating which SKUs were insufficient.
- **Reservation:** `await inventoryService.reserveStock(items, order._id)`
  - Stock count is decremented immediately so other shoppers cannot purchase the same physical items.
  - Generates a `reservationId` stored on the order.

### B. Order Cancellation (Stock Release)
- **When:** Inside `orders.service.js` during `cancelOrder`.
- **Condition:** Order must be cancelled **before** `SHIPPED` status (`PLACED`, `CONFIRMED`, `PROCESSING`, or `PACKED`).
- **Execution:** `await inventoryService.releaseStock(order.items, order._id)`
  - Quantities for all order items are added back into the warehouse inventory pool.

### C. Return Processing (Restock upon Warehouse Receipt)
- **When:** Inside `returns.service.js` during `advanceReturnStatus` when transitioning to `RECEIVED`.
- **Condition:** Physical return package has arrived at the warehouse facility.
- **Execution:** `await inventoryService.restock(returnRecord.items, returnRecord._id)`
  - Adds verified returned item quantities back into available inventory for resale.
