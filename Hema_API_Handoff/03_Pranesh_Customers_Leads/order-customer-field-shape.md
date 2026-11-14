# Specification: Customer & Address Snapshot in Orders

Hi Pranesh! This document outlines how customer identities and delivery addresses are recorded in our Orders and Returns schemas.

---

## 1. Customer Subdocument in `Order` Schema

Orders store an indexed customer snapshot so queries remain lightning-fast and historical contact details are preserved even if the customer profile changes later:

```javascript
customer: {
  customerId: {
    type: String, // Matches your Customer._id (ObjectId string or unique code)
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  }
}
```

---

## 2. Address Snapshot Schema

Both `shippingAddress` and `billingAddress` in `Order` (and `pickupAddress` in `Return`) follow this uniform standard:

```javascript
address: {
  street: { type: String, required: true },     // e.g. 'Flat 402, Green Glen Layout'
  city: { type: String, required: true },       // e.g. 'Bengaluru'
  state: { type: String, required: true },      // e.g. 'Karnataka'
  postalCode: { type: String, required: true }, // e.g. '560103' (6-digit Indian PIN code)
  country: { type: String, default: 'India' }
}
```

---

## 3. Order Placement Flow
When an order is created (`POST /api/v1/orders`), the client provides:
```json
{
  "customer": {
    "customerId": "cust_101",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+919876543210"
  },
  "shippingAddress": { ... },
  "items": [ ... ]
}
```
Our `orders.service.js` calls your `customerStub.validateCustomer(customerId)` to verify that:
1. The customer exists in your database.
2. The account is active (not suspended or banned).
