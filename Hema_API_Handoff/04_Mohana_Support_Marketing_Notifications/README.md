# Handoff Package: Mohana (Support, Marketing, Notifications & Tasks)

Hi Mohana! Here is your integration package for subscribing to order and return events, broadcasting real-time notifications via WebSockets, and linking customer tickets or marketing segments.

---

## 1. What I'm giving you

1. **`notificationStub.js`**:
   - The current adapter stub (`src/integrations/stubs/notificationStub.js`) where `notify(event, payload)` is invoked across our modules.
2. **`eventBus.js`**:
   - The shared `DomainEventBus` singleton (`src/integrations/stubs/eventBus.js`) publishing in-process domain events.
3. **`EVENTS.md`**:
   - The complete catalog of events emitted (`return.requested`, `return.approved`, `return.rejected`, `return.status_updated`, `refund.processed`) along with full JSON payload schemas.
4. **`id-formats.md`**:
   - Complete reference for primary keys (`ObjectId`) and human-readable identifiers (`orderNumber`, `returnNumber`, `refundNumber`, `transactionId`) to embed into your Support Ticket and Task models.

---

## 2. What I need back from you

1. **Real Notification Service & Socket.IO Event Names**:
   - Export your production notification service to replace `notificationStub.js`.
   - What Socket.IO room names and client event names are you using (e.g. `socket.to("user_" + customerId).emit("notification", ...)` or `io.to("role_support_agent").emit("ticket:new", ...)`)?
2. **Event Bus Implementation**:
   - Confirm whether we stick with Node's in-process `DomainEventBus` (ideal for our monolith demo) or if you are introducing Redis Pub/Sub / RabbitMQ.
3. **Support Ticket References**:
   - Confirm that your Support Ticket model stores `orderNumber` and `returnNumber` for cross-linking.
4. **Marketing Segment Queries**:
   - What query parameters or aggregations does your Marketing module need for segmenting customers (e.g. repeat buyers with > 3 delivered orders, high spenders with total spend > ₹10,000, customers with zero return requests)? We can add specialized filters or indexes to support your queries.
