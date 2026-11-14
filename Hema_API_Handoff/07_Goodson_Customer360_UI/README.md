# Handoff Package: Goodson (Customer 360 UI)

Hi Goodson! Here is your integration package for building the Customer 360 view, customer purchase timeline, and cross-module profile tabs.

---

## 1. What I'm giving you

1. **`sample-responses/`**:
   - Real JSON payloads for:
     - `orders.list.200.json` (order history table)
     - `orders.get.200.json` (order detail modal & status timeline)
     - `orders.payments.200.json` (order payment history)
     - `payments.list.200.json` (customer payment transactions)
     - `returns.list.200.json` (customer return requests)
     - `returns.get.200.json` (return detail & evidence photos)
2. **`customer-360-lookups.md`**:
   - Complete guide on using the `customerId` query parameter across Orders, Payments, and Returns endpoints.

---

## 2. What I need back from you

1. **Additional Filters or Fields**:
   - Does your Customer 360 view need any extra filters (e.g. filter customer orders by status or date range)?
   - Do you need aggregate summary headers returned with the list (e.g. total spent by customer across all orders)? Let me know and I can add aggregate helper fields.
2. **UI Feedback**:
   - Any issues encountered rendering the order timeline, refund status badges, or address snapshots.
