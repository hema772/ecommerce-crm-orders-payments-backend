# Specification: Stock-Affecting Events & Stock Movement History

Hi Mohamed Hasik! For your Product UI's **Stock Movement History** / **Inventory Audit Log** tab, here are the 3 core events triggered by our Orders and Returns modules that adjust physical inventory.

---

## 1. Stock Movement Event Registry

| Event Trigger | Direction | Delta | Reason Tag | Associated Reference |
|---|---|---|---|---|
| **Order Placed** | `OUT` / `DEDUCT` | `-qty` | `ORDER_RESERVATION` | `orderNumber` (e.g. `ORD-20261113-A1B2C3`) |
| **Order Cancelled** | `IN` / `RESTOCK` | `+qty` | `ORDER_CANCELLATION` | `orderNumber` (e.g. `ORD-20261113-A1B2C3`) |
| **Return Received & Inspected** | `IN` / `RESTOCK` | `+qty` | `RETURN_RESTOCK` | `returnNumber` (e.g. `RET-20261113-X1Y2Z3`) |

---

## 2. Event Details & Payload Example

When an order or return occurs, your stock movement table should record:

```typescript
interface StockMovementLogEntry {
  sku: string;                     // e.g. 'SKU-TSHIRT-BLK-M'
  movementType: 'IN' | 'OUT';      // IN = restock, OUT = sold/reserved
  quantity: number;                // e.g. 2
  reason: 'ORDER_RESERVATION' | 'ORDER_CANCELLATION' | 'RETURN_RESTOCK';
  referenceId: string;             // orderNumber or returnNumber
  actorId: string;                 // e.g. 'cust_101', 'warehouse_01', 'system'
  timestamp: string;               // ISO 8601 date
}
```

### Example Log Entry for an Order:
```json
{
  "sku": "SKU-TSHIRT-BLK-M",
  "movementType": "OUT",
  "quantity": 2,
  "reason": "ORDER_RESERVATION",
  "referenceId": "ORD-20261113-A1B2C3",
  "actorId": "cust_101",
  "timestamp": "2026-11-13T12:00:00.000Z"
}
```

### Example Log Entry for a Return Restock:
```json
{
  "sku": "SKU-TSHIRT-BLK-M",
  "movementType": "IN",
  "quantity": 1,
  "reason": "RETURN_RESTOCK",
  "referenceId": "RET-20261113-X1Y2Z3",
  "actorId": "warehouse_01",
  "timestamp": "2026-11-13T12:25:00.000Z"
}
```

---

## 3. Real-Time Consumption
You can subscribe to these stock adjustments in real time using the shared `DomainEventBus`:
- `eventBus.on('return.status_updated', ...)`: When status reaches `RECEIVED` or `INSPECTED`.
- Or consume notifications via Mohana's Socket.IO broadcast.
