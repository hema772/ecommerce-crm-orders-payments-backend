# Specification: Dashboard Metrics & Proposed `/orders/stats` Endpoint

Hi Harini! This document describes how you can query order counts, revenue numbers, and refund metrics from our existing endpoints, as well as the proposed contract for a dedicated `/orders/stats` aggregation endpoint.

---

## 1. Existing Endpoints for Dashboard Feeds

### A. Real-Time Order Status Breakdown
You can query the order count for any status by using the `status` filter on `GET /api/v1/orders`:
- `GET /api/v1/orders?status=PLACED&limit=1` → Read `pagination.totalRecords`
- `GET /api/v1/orders?status=CONFIRMED&limit=1`
- `GET /api/v1/orders?status=PROCESSING&limit=1`
- `GET /api/v1/orders?status=SHIPPED&limit=1`
- `GET /api/v1/orders?status=DELIVERED&limit=1`
- `GET /api/v1/orders?status=CANCELLED&limit=1`

### B. Returns & Refunds Volumes
- `GET /api/v1/returns?status=REQUESTED&limit=1` → Pending returns awaiting review
- `GET /api/v1/refunds?status=PROCESSED&limit=1` → Completed refunds

---

## 2. Proposed Dedicated Stats Endpoint (`GET /api/v1/orders/stats`)

To avoid making multiple HTTP calls from your Recharts dashboard, I am ready to implement this aggregated analytics endpoint for you:

### Query Parameters
- `startDate`: ISO 8601 string (e.g. `2026-11-01T00:00:00.000Z`)
- `endDate`: ISO 8601 string (e.g. `2026-11-13T23:59:59.000Z`)
- `customerId`: (Optional) filter stats for a specific customer

### Proposed Response Shape:
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "revenue": {
      "totalGrossRevenuePaise": 54200000,
      "totalGrossRevenueFormatted": "₹5,42,000.00",
      "totalNetRevenuePaise": 51700000,
      "totalNetRevenueFormatted": "₹5,17,000.00",
      "totalRefundedPaise": 2500000,
      "totalRefundedFormatted": "₹25,000.00"
    },
    "ordersCount": {
      "total": 340,
      "byStatus": {
        "PLACED": 15,
        "CONFIRMED": 22,
        "PROCESSING": 48,
        "PACKED": 30,
        "SHIPPED": 65,
        "OUT_FOR_DELIVERY": 10,
        "DELIVERED": 135,
        "CANCELLED": 15
      }
    },
    "returnsCount": {
      "total": 24,
      "byStatus": {
        "REQUESTED": 4,
        "APPROVED": 3,
        "PICKUP_SCHEDULED": 2,
        "RECEIVED": 5,
        "INSPECTED": 2,
        "REFUNDED": 7,
        "REJECTED": 1
      }
    },
    "averageOrderValuePaise": 159411,
    "averageOrderValueFormatted": "₹1,594.11"
  }
}
```
