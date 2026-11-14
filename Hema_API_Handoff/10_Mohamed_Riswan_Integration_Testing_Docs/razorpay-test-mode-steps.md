# Quality Assurance Guide: Razorpay Test Mode Verification & Testing Steps

Hi Mohamed Riswan! This guide explains how to test and verify the complete Razorpay Test Mode integration, simulate payment successes and failures, trigger webhooks, and execute test refunds.

---

## 1. Environment & Gateway Credentials
- **Mode:** Razorpay Sandbox / Test Mode
- **Public Test Key ID:** `rzp_test_51Ng8BqWXYZ123`
- **Private Key Secret:** Set in your `.env` as `RAZORPAY_KEY_SECRET`
- **Currency:** Strictly `INR` in **integer paise** (e.g. ₹500.00 = `50000`)

---

## 2. End-to-End Test Execution Flow

### Step 1: Create an Order
```bash
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{
    "customer": {
      "customerId": "cust_101",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@example.com",
      "phone": "+919876543210"
    },
    "items": [
      { "product": "prod_101", "sku": "SKU-TSHIRT-BLK-M", "qty": 1 }
    ],
    "shippingAddress": {
      "street": "100 100 Feet Road, Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "postalCode": "560038",
      "country": "India"
    },
    "billingAddress": {
      "street": "100 100 Feet Road, Indiranagar",
      "city": "Bengaluru",
      "state": "Karnataka",
      "postalCode": "560038",
      "country": "India"
    },
    "paymentMethod": "RAZORPAY"
  }'
```
*Note the returned `orderId` (e.g. `6734a1b2c3d4e5f6a7b8c901`).*

---

### Step 2: Initialize Razorpay Gateway Order
```bash
curl -X POST http://localhost:5000/api/v1/payments/create-order \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{ "orderId": "<ORDER_ID>" }'
```
*Returns `razorpayOrderId` (e.g. `order_Q1w2e3r4t5y6u7`), `amount` in paise, and `keyId`.*

---

### Step 3: Complete Signature Verification (Simulating Client Checkout)
Generate HMAC-SHA256 signature: `HMAC_SHA256(order_id + "|" + payment_id, secret)`:
```bash
curl -X POST http://localhost:5000/api/v1/payments/verify \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{
    "orderId": "<ORDER_ID>",
    "razorpayOrderId": "<RAZORPAY_ORDER_ID>",
    "razorpayPaymentId": "pay_test_success_12345",
    "razorpaySignature": "<HMAC_SIGNATURE>"
  }'
```
*Expected: HTTP `200 OK`, `Payment.status = 'PAID'`, `Order.status = 'CONFIRMED'`.*

---

### Step 4: Simulate Payment Failure
Call `POST /payments/verify` with an invalid signature:
```bash
curl -X POST http://localhost:5000/api/v1/payments/verify \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{
    "orderId": "<ORDER_ID>",
    "razorpayOrderId": "<RAZORPAY_ORDER_ID>",
    "razorpayPaymentId": "pay_test_fail_99999",
    "razorpaySignature": "invalid_bogus_signature"
  }'
```
*Expected: HTTP `400 Bad Request`, `Payment.status = 'FAILED'`.*

---

### Step 5: Simulate Razorpay Inbound Webhook (`payment.captured`)
Test webhook endpoint with raw body and header `x-razorpay-signature`:
```bash
curl -X POST http://localhost:5000/api/v1/payments/webhook \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: <WEBHOOK_HMAC_SIGNATURE>" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test_webhook_123",
          "order_id": "<RAZORPAY_ORDER_ID>",
          "amount": 188564,
          "status": "captured",
          "currency": "INR"
        }
      }
    }
  }'
```
*Expected: HTTP `200 OK`. Verifies idempotency — sending duplicate payload will skip re-processing safely.*

---

### Step 6: Test Refund Disbursement
Once an order has been marked `DELIVERED`, a return submitted, and status advanced to `INSPECTED`:
```bash
curl -X PATCH http://localhost:5000/api/v1/refunds/<REFUND_ID>/process \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin"
```
*Expected: HTTP `200 OK`, `Refund.status = 'PROCESSED'`, `Order.paymentStatus = 'PARTIALLY_REFUNDED'` (or `'REFUNDED'`).*

---

## 3. Automated Test Suite Execution
You can also run all 47 automated tests in memory without needing live Razorpay keys:
```bash
cd backend
npm test
```
All unit tests and integration tests will execute against an in-memory MongoDB server with full mocks for Razorpay adapters and Cloudinary uploads.
