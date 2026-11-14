# Specification: Order Item Snapshot Schema

Hi Gayathri! When an order is placed in our CRM, it takes an **immutable snapshot** of each product's details at the moment of checkout. This guarantees that future price updates or catalog edits never corrupt historical orders, accounting invoices, or return refund calculations.

---

## 1. Item Snapshot Structure in Order Schema

Each element in `Order.items` conforms to this schema:

```javascript
{
  product: ObjectId,          // Reference to your Product model (or string ID)
  sku: String,                // Stock Keeping Unit, uppercase, indexed (e.g. 'SKU-TSHIRT-BLK-M')
  name: String,               // Product display title at purchase time (e.g. 'Classic Cotton T-Shirt (Black, M)')
  qty: Number,                // Quantity purchased (integer >= 1)
  unitPrice: Number,          // Unit price in NON-NEGATIVE INTEGER PAISE (e.g. 79900 for ₹799.00)
  discount: Number,           // Promo / item discount in INTEGER PAISE (default: 0)
  tax: Number,                // Calculated GST / sales tax in INTEGER PAISE (e.g. 14382 for 18% GST)
  subtotal: Number            // Verified line item subtotal: (unitPrice * qty) - discount
}
```

---

## 2. Server-Authoritative Pricing Rules
1. **Never Trust Frontend Pricing:**  
   The client only submits:
   ```json
   {
     "items": [
       { "product": "prod_101", "sku": "SKU-TSHIRT-BLK-M", "qty": 2 }
     ]
   }
   ```
2. **Server Enrichment via `productStub` / Your Service:**  
   Our `orders.service.js` calls your product service to fetch the authoritative catalog record:
   - Sets `name`
   - Sets `unitPrice` in paise
   - Calculates `tax` in paise (e.g. standard 18% GST)
   - Computes line `subtotal` and order grand `total`
3. **Paise Representation:**  
   - All prices are strictly non-negative integers.
   - Floating point decimals (`799.50`) are strictly forbidden to prevent floating-point rounding errors.
