# Handoff Package: Hazm (Order, Payment & Returns UI)

Hi Hazm! Here is your complete UI implementation package for designing and developing the frontend screens for Order Fulfillment, Razorpay Checkout, and Returns & Refunds.

---

## 1. What I'm giving you

1. **`ecommerce-crm-complete.postman_collection.json`**:
   - Complete Postman collection for all 32 endpoints, with pre-configured requests and auto-saving test variables.
2. **`openapi.json`**:
   - Full OpenAPI 3.0.3 specification ready for typed SDK generation or importing into Swagger.
3. **`sample-responses/`**:
   - 35 real JSON sample files covering both success and validation/business rule error responses for every endpoint.
4. **`STATUSES.md`**:
   - Definitive state machine diagrams and transition matrices for Orders, Payments, and Returns.
5. **`error-format.md`**:
   - Standard API error envelope specification with Axios interceptor snippet for React Hook Form integration.
6. **`razorpay-flow.md`**:
   - 3-step Razorpay Test Mode checkout implementation guide using the test Key ID `rzp_test_51Ng8BqWXYZ123` (never contains secrets).
7. **`multipart-return-evidence.md`**:
   - File upload specification: field name must be `evidence`, up to 5 files, JPEG/PNG/WEBP/PDF, max 5MB.
8. **`amounts-in-paise.md`**:
   - Currency guidelines and helper functions (`formatPaiseToINR`, `inrToPaise`) — divide API amounts by 100 for display.
9. **`cors-origins.md`**:
   - Allowed dev server origins (`localhost:3000`, `localhost:5173`).

---

## 2. What I need back from you

1. **Frontend Dev Port**:
   - If your Vite/React server runs on a port other than `5173` or `3000`, send it over so I can add it to `CORS_ORIGIN`.
2. **Additional Fields or Screen Filters**:
   - Let me know if any of your UI tables require extra query filters (e.g. date range picker, customer search, SKU search) or additional metadata fields on orders/returns.
3. **Bug Reports & Feedback**:
   - Any validation quirks or status transition errors you encounter during frontend-backend integration.
