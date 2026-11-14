# Frontend Guide: Currency & Amounts in Integer Paise

Hi Hazm! This document explains our money handling conventions so your UI components display and format prices correctly.

---

## 1. Core Rule: Amounts Are Integer Paise
In financial software, floating point numbers (e.g., `0.1 + 0.2 = 0.30000000000000004`) cause rounding and currency drift bugs.

- **Storage Standard:** All monetary values in our backend are stored and transmitted as **non-negative integer paise** (1 INR = 100 paise).
- **Rule for UI:**
  - When **displaying** an amount from the API: **Divide by 100**.
  - When **sending** an amount to the API: **Multiply by 100** (or let the server calculate totals from unit prices).

---

## 2. Formatting Utility Functions for React

Here are the standard TypeScript helpers to drop into your `src/lib/utils.ts` or `src/utils/money.ts`:

```typescript
/**
 * Convert integer paise to formatted Indian Rupee string (e.g. 188564 -> "₹1,885.64")
 */
export function formatPaiseToINR(paise: number): string {
  if (typeof paise !== 'number' || isNaN(paise)) return '₹0.00';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rupees);
}

/**
 * Convert Rupee decimal input to integer paise (e.g. 799.50 -> 79950)
 */
export function inrToPaise(rupees: number | string): number {
  const numeric = typeof rupees === 'string' ? parseFloat(rupees) : rupees;
  if (isNaN(numeric)) return 0;
  return Math.round(numeric * 100);
}
```

---

## 3. Pre-formatted Fields from API
Our invoice endpoint (`GET /api/v1/orders/:id/invoice`) already supplies pre-formatted display strings alongside the raw paise integers:
```json
{
  "unitPricePaise": 79900,
  "unitPriceFormatted": "₹799.00",
  "grandTotalPaise": 188564,
  "grandTotalFormatted": "₹1,885.64"
}
```
You can use `grandTotalFormatted` directly in invoice tables and print views!
