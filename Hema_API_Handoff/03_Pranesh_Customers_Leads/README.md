# Handoff Package: Pranesh (Customers & Leads Module)

Hi Pranesh! Here is the integration package for linking your Customer & Lead Management modules with Orders, Payments, and Returns.

---

## 1. What I'm giving you

1. **`customerStub.js`**:
   - The current customer validation adapter (`src/integrations/stubs/customerStub.js`) used by our order creation service to verify active customers.
2. **`order-customer-field-shape.md`**:
   - The exact schema for the customer snapshot and shipping/billing addresses recorded on every order.
3. **`customer-orders-lookup.md`**:
   - Complete documentation of the lookup endpoints (`GET /api/v1/orders?customerId=...`, `GET /api/v1/returns?customerId=...`, `GET /api/v1/payments?customerId=...`) powering your Customer 360 profile views.

---

## 2. What I need back from you

1. **Customer Model Name & ID Convention**:
   - Confirm your Mongoose collection and model name (e.g. `Customer`).
   - Confirm whether `customerId` matches your MongoDB `_id` string or if you have a separate code (e.g. `CUST-10023`).
2. **Real Customer Lookup Service**:
   - Replace `customerStub.js` with your service exporting:
     - `getCustomerById(customerId: string): Promise<Customer>`
     - `validateCustomer(customerId: string): Promise<Customer>` (must throw if account is suspended/inactive).
3. **Address Field Schema**:
   - Confirm that your customer address format matches ours (`street`, `city`, `state`, `postalCode`, `country`).
4. **Lifetime Value (LTV) & Order Metrics Synchronization**:
   - Do you want your Customer model's `lifetimeValuePaise`, `totalOrdersPlaced`, and `totalReturnsCount` updated automatically?
   - Let's agree whether you prefer:
     - **Option A (Recommended):** You listen to our domain events (`refund.processed`, `return.requested`) on `eventBus`.
     - **Option B:** We directly call a service function on your module like `customerService.updatePurchaseStats(customerId, deltaPaise)`.
