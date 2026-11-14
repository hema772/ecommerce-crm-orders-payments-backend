# API Specification: Customer Orders, Payments & Returns Lookups

Hi Pranesh! For your Customer 360 view, CRM profile pages, and Lead conversion tracking, here are the exact endpoints to query all transaction activity associated with a given `customerId`.

---

## 1. List All Orders for a Customer
Retrieve paginated orders placed by a specific customer:

- **Method / Endpoint:** `GET /api/v1/orders?customerId={customerId}&page=1&limit=10`
- **Permissions:** `orders.read`
- **Sample Request:**
  ```http
  GET /api/v1/orders?customerId=cust_101&page=1&limit=10 HTTP/1.1
  Host: localhost:5000
  Authorization: Bearer <token>
  ```
- **Response Shape:**
  ```json
  {
    "success": true,
    "message": "Orders retrieved successfully",
    "data": [
      {
        "_id": "6734a1b2c3d4e5f6a7b8c901",
        "orderNumber": "ORD-20261113-A1B2C3",
        "customer": {
          "customerId": "cust_101",
          "name": "Aarav Sharma",
          "email": "aarav.sharma@example.com"
        },
        "itemsCount": 2,
        "totalPaise": 188564,
        "currency": "INR",
        "status": "DELIVERED",
        "paymentStatus": "PAID",
        "paymentMethod": "RAZORPAY",
        "createdAt": "2026-11-10T09:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalRecords": 12,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
  ```

---

## 2. List All Returns for a Customer
Retrieve returns submitted by a customer:

- **Method / Endpoint:** `GET /api/v1/returns?customerId={customerId}&page=1&limit=10`
- **Permissions:** `returns.read`
- **Response Data:** Returns array with return status (`REQUESTED`, `APPROVED`, `INSPECTED`, `REFUNDED`), refund amounts, and item names.

---

## 3. List All Payments for a Customer
Retrieve payment history:

- **Method / Endpoint:** `GET /api/v1/payments?customerId={customerId}&page=1&limit=10`
- **Permissions:** `payments.read`
- **Response Data:** Gateway transaction IDs, amounts, payment methods (`RAZORPAY`, `COD`), and statuses (`PAID`, `FAILED`).
