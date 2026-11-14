# Specification: Order, Return & Payment ID and Number Formats

Hi Mohana! When creating Support Tickets, Tasks, or Marketing Segments linked to transaction records, use this format specification to parse and reference our IDs and human-readable numbers.

---

## 1. Primary Database IDs vs. Human-Readable Numbers

Each entity provides both an internal database `ObjectId` (used for foreign key references) and a human-readable, unique, uppercase string (used on customer invoices, packing slips, email notifications, and support tickets):

| Entity | Primary Key (`_id`) | Human-Readable Number | Generation Pattern | Example |
|---|---|---|---|---|
| **Order** | MongoDB `ObjectId` (24 hex characters) | `orderNumber` | `ORD-YYYYMMDD-<6_HEX>` | `ORD-20261113-A1B2C3` |
| **Return** | MongoDB `ObjectId` (24 hex characters) | `returnNumber` | `RET-YYYYMMDD-<6_HEX>` | `RET-20261113-X1Y2Z3` |
| **Refund** | MongoDB `ObjectId` (24 hex characters) | `refundNumber` | `REF-YYYYMMDD-<6_HEX>` | `REF-20261113-R1F2N3` |
| **Payment**| MongoDB `ObjectId` (24 hex characters) | `transactionId` | Razorpay ID or `OFFLINE-<timestamp>-<rand>` | `pay_Q1w2e3r4t5y6u7` or `OFFLINE-1731499200000-AB12` |
| **Invoice**| Computed virtual / header | `invoiceNumber` | `INV-YYYYMMDD-<6_HEX>` | `INV-20261113-A1B2C3` |

---

## 2. Linking in Support Ticket & Task Models

In your Support Ticket or CRM Task schema, store both fields for fast indexing and human readability:

```javascript
// Suggested Support Ticket Schema snippet:
const ticketSchema = new mongoose.Schema({
  title: String,
  customer: {
    customerId: String,
    email: String
  },
  // References to our Orders module:
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  orderNumber: {
    type: String,
    index: true // Enables fast customer lookup by order number
  },
  returnRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Return'
  },
  returnNumber: {
    type: String,
    index: true
  }
});
```

---

## 3. Regular Expressions for Form Validation
- Order Number Regex: `/^ORD-\d{8}-[A-F0-9]{6}$/`
- Return Number Regex: `/^RET-\d{8}-[A-F0-9]{6}$/`
- Refund Number Regex: `/^REF-\d{8}-[A-F0-9]{6}$/`
- MongoDB ObjectId Regex: `/^[0-9a-fA-F]{24}$/`
