# Frontend Guide: Customer 360 Transaction Lookups

Hi Goodson! This document specifies how your Customer 360 profile tabs can seamlessly fetch all purchase history, payment transactions, and return requests for any selected customer.

---

## 1. Customer Purchases Tab: `GET /api/v1/orders`
Query orders placed by a specific customer ID:

- **Endpoint:** `GET /api/v1/orders?customerId={customerId}&page=1&limit=10`
- **Permissions:** `orders.read`
- **Sorting:** Default sorting is descending by creation date (`createdAt: -1`).
- **Response Fields:**
  - `orderNumber`: e.g. `ORD-20261113-A1B2C3`
  - `status`: Order progression (`PLACED` through `DELIVERED`, or `CANCELLED`)
  - `paymentStatus`: `PAID`, `PENDING`, `REFUNDED`, `PARTIALLY_REFUNDED`
  - `totalPaise`: Integer paise (divide by 100 in UI for ₹)
  - `itemsCount`: Number of items in parcel
  - `createdAt`: ISO timestamp

---

## 2. Customer Order Details & Tracking: `GET /api/v1/orders/:id`
When the support agent clicks on an order in the Customer 360 list:

- **Endpoint:** `GET /api/v1/orders/{orderId}`
- **Permissions:** `orders.read`
- **Response Fields:**
  - Full items array with SKU, unit price, discounts, and item subtotals.
  - Complete `statusHistory` timeline with dates, user IDs, and notes.
  - Shipping address and live carrier tracking details (`courier`, `trackingNumber`, `trackingUrl`).

---

## 3. Customer Returns Tab: `GET /api/v1/returns`
Query return requests filed by this customer:

- **Endpoint:** `GET /api/v1/returns?customerId={customerId}&page=1&limit=10`
- **Permissions:** `returns.read`
- **Response Fields:**
  - `returnNumber`: e.g. `RET-20261113-X1Y2Z3`
  - `orderNumber`: Associated order
  - `status`: `REQUESTED`, `APPROVED`, `RECEIVED`, `INSPECTED`, `REFUNDED`, `REJECTED`
  - `refundAmount`: Amount eligible for credit (in integer paise)
  - `reasonCategory`: e.g. `SIZE_FIT_ISSUE`, `DEFECTIVE_PRODUCT`

---

## 4. Customer Payments Tab: `GET /api/v1/payments`
Query financial ledger and payment attempts:

- **Endpoint:** `GET /api/v1/payments?customerId={customerId}&page=1&limit=10`
- **Permissions:** `payments.read`
- **Response Fields:**
  - `transactionId`: Gateway reference or offline ID
  - `method`: `RAZORPAY`, `COD`, `BANK_TRANSFER`
  - `amount`: In integer paise
  - `status`: `PAID`, `PENDING`, `FAILED`
