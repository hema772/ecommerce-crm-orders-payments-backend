# Handoff Package: Gayathri (Product & Inventory Module)

Hi Gayathri! Here is the complete integration handoff package for connecting your Product Catalog and Warehouse Inventory modules with my Orders, Returns, and Refunds services.

---

## 1. What I'm giving you

1. **`productStub.js`**:
   - The current adapter stub (`src/integrations/stubs/productStub.js`) used to fetch product details and enrich order items with authoritative pricing and taxes.
2. **`inventoryStub.js`**:
   - The current stock management stub (`src/integrations/stubs/inventoryStub.js`) implementing stock checks, reservations, releases, and restocks.
3. **`order-item-snapshot.md`**:
   - Specification of the immutable item snapshot schema stored in each order (`product`, `sku`, `name`, `qty`, `unitPrice`, `discount`, `tax`, `subtotal`).
4. **`stock-change-timing.md`**:
   - Precise breakdown of the 3 key lifecycle triggers:
     - Reserve on order creation (`POST /api/v1/orders`)
     - Release on pre-shipment cancellation (`POST /api/v1/orders/:id/cancel`)
     - Restock on return warehouse receipt (`PATCH /api/v1/returns/:id/status` to `RECEIVED`)

---

## 2. What I need back from you

1. **Product & Inventory Model Names & ID Types**:
   - What are your Mongoose model names (e.g. `Product`, `InventoryItem`, `Stock`)?
   - Do you use standard MongoDB `ObjectId` or custom string IDs for products?
2. **Service Functions to Export**:
   - We need your real service modules exporting these 4 async methods:
     - `checkStock(items: Array<{ sku: string, qty: number }>): Promise<{ available: boolean, items: Array }>`
     - `reserveStock(items: Array<{ sku: string, qty: number }>, orderId: string): Promise<{ success: boolean, reservationId: string }>`
     - `releaseStock(items: Array<{ sku: string, qty: number }>, orderId: string): Promise<{ success: boolean, releasedCount: number }>`
     - `restock(items: Array<{ sku: string, qty: number }>, returnId: string): Promise<{ success: boolean, restockedCount: number }>`
3. **Confirmation on Integer Paise**:
   - Please confirm that your `Product.unitPrice` is stored in **integer paise** (e.g. `₹799.00` is stored as `79900`), and whether product taxes/discounts are pre-calculated or percentage-based.
