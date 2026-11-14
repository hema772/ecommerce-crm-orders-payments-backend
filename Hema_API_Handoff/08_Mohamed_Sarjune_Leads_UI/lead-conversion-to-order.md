# Specification: Converting CRM Leads Directly into Orders

Hi Mohamed Sarjune! If your Leads UI supports a **"Convert Lead to Order"** action (e.g., when a prospective buyer approves a sales quote), here is the exact specification for creating an order directly from lead data.

---

## 1. Convert Lead Endpoint: `POST /api/v1/orders`

- **Endpoint:** `POST /api/v1/orders`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <token>`
- **Permissions:** `orders.create`

### Request Body Format:
```json
{
  "customer": {
    "customerId": "lead_10492",
    "name": "Arjun Singhania",
    "email": "arjun.singhania@corp.example.com",
    "phone": "+919876543299"
  },
  "items": [
    {
      "product": "prod_101",
      "sku": "SKU-TSHIRT-BLK-M",
      "qty": 50
    }
  ],
  "shippingAddress": {
    "street": "Plot 14, Electronic City Phase 1",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560100",
    "country": "India"
  },
  "billingAddress": {
    "street": "Plot 14, Electronic City Phase 1",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560100",
    "country": "India"
  },
  "paymentMethod": "RAZORPAY",
  "notes": "Converted from B2B Corporate Merchandise Lead #LEAD-7892"
}
```

---

## 2. Server Processing
1. **Inventory Reservation:** Server automatically checks stock and reserves the 50 units for this order.
2. **Pricing Calculation:** Unit prices and taxes are looked up directly from the product catalog in integer paise.
3. **Status:** Initial status is `PLACED` with `paymentStatus: PENDING`.
4. **Returns:** Responds with HTTP `201 Created` returning the generated `orderNumber` (e.g. `ORD-20261113-B4C5D6`) and `_id` so your Leads screen can show a success banner: *"Order #ORD-... created successfully! Link: [View Order]"*.
