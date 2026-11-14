# Handoff Package: Mohamed Sarjune (Leads UI)

Hi Mohamed Sarjune! Here is the integration package for wiring CRM Leads to Order Creation.

---

## 1. What I'm giving you

1. **`orders.create.200.json`**:
   - Real response payload when an order is created.
2. **`orders.create.400.json`**:
   - Real response payload when order creation fails (e.g. out-of-stock items or invalid address).
3. **`lead-conversion-to-order.md`**:
   - Complete technical specification on how your UI can dispatch `POST /api/v1/orders` to convert a qualified sales lead directly into a live order.

---

## 2. What I need back from you

1. **Lead Conversion Flow Confirmation**:
   - Please confirm whether your Leads module allows converting leads directly into orders, or if a lead must first convert into a Customer record in Pranesh's module before an order can be placed.
2. **Additional Conversion Metadata**:
   - If you want the created order to store a back-reference to your Lead ID (e.g. `leadId: "lead_10492"` in `order.metadata`), let me know and I will add it to the schema.
