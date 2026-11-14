# Handoff Package: Harini (Dashboard & Analytics)

Hi Harini! Here is your integration package for building the CRM Executive Dashboard, KPI cards, and Recharts visualizations.

---

## 1. What I'm giving you

1. **`ecommerce-crm-complete.postman_collection.json`**:
   - Postman collection for all endpoints.
2. **`openapi.json`**:
   - Complete OpenAPI 3.0.3 specification.
3. **`sample-responses/`**:
   - Full collection of 35 real JSON responses to seed mock data into your dashboard widgets.
4. **`dashboard-metrics-spec.md`**:
   - Guide explaining how to fetch current metrics using existing filtered endpoints, plus the complete proposed schema for the dedicated `GET /api/v1/orders/stats` aggregation endpoint.

---

## 2. What I need back from you

1. **Confirmation of Required Metrics**:
   - Send me the exact list of metrics your charts need (e.g., Gross Revenue, Net Revenue after Refunds, Orders grouped by Status, Daily/Monthly Revenue time series, Return Rate %).
2. **Date Filtering Requirements**:
   - What date filter ranges will your dashboard UI support (Today, Last 7 Days, Last 30 Days, Custom Range)?
3. **Approval of `/orders/stats` Schema**:
   - Review `dashboard-metrics-spec.md`. Once you approve or modify the proposed response shape, I will implement and test `GET /api/v1/orders/stats` in the backend immediately!
