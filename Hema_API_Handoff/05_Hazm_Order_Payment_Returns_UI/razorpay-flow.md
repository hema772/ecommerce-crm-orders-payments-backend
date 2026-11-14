# Frontend Guide: Razorpay Test Mode Checkout Integration Flow

Hi Hazm! Here is the step-by-step React implementation for the Razorpay Test Mode checkout lifecycle.

---

## 1. Safety & Credential Rules
- **Public Razorpay Test KEY ID:** `rzp_test_51Ng8BqWXYZ123` (or read from your Vite `.env` as `VITE_RAZORPAY_KEY_ID`).
- **NEVER use or request the Razorpay Key Secret on the frontend.** The secret is strictly server-side.

---

## 2. The 3-Step Checkout Sequence

```
1. Frontend Calls POST /payments/create-order
   └── Receives: razorpayOrderId, amount in paise, keyId

2. Frontend Opens Razorpay Checkout.js Modal
   └── Customer enters test card/UPI details
   └── Razorpay emits success handler with (payment_id, order_id, signature)

3. Frontend Calls POST /payments/verify
   └── Sends: { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId }
   └── Server verifies HMAC-SHA256 signature
   └── Server marks Order as PAID & status advances to CONFIRMED
```

---

## 3. Step 1: Initialize Payment from Frontend

When user clicks **"Proceed to Pay"**:

```javascript
const { data } = await api.post('/payments/create-order', {
  orderId: currentOrderId
});

const { razorpayOrderId, amount, keyId, customer } = data.data;
```

---

## 4. Step 2: Open Razorpay Checkout Modal

Add Razorpay script dynamically or via `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`:

```javascript
const options = {
  key: keyId, // "rzp_test_51Ng8BqWXYZ123"
  amount: amount, // in integer paise (e.g. 188564)
  currency: "INR",
  name: "E-Commerce CRM Store",
  description: `Payment for Order #${orderNumber}`,
  order_id: razorpayOrderId,
  prefill: {
    name: customer.name,
    email: customer.email,
    contact: customer.phone
  },
  theme: {
    color: "#4F46E5" // Indigo brand color
  },
  handler: async function (response) {
    // response contains:
    // response.razorpay_order_id
    // response.razorpay_payment_id
    // response.razorpay_signature
    await verifyPayment(response);
  },
  modal: {
    ondismiss: function () {
      toast.info("Payment cancelled by customer.");
    }
  }
};

const rzp = new window.Razorpay(options);
rzp.open();
```

---

## 5. Step 3: Verify Signature on Server

In your `handler` callback:

```javascript
async function verifyPayment(rzpResponse) {
  try {
    const result = await api.post('/payments/verify', {
      orderId: currentOrderId,
      razorpayOrderId: rzpResponse.razorpay_order_id,
      razorpayPaymentId: rzpResponse.razorpay_payment_id,
      razorpaySignature: rzpResponse.razorpay_signature
    });

    toast.success("Payment verified! Order confirmed.");
    navigate(`/orders/${currentOrderId}`);
  } catch (err) {
    toast.error("Payment signature verification failed.");
  }
}
```

---

## 6. Razorpay Test Mode Card Details
Use these mock credentials during testing:
- **Card Number:** `4111 1111 1111 1111` or `4012 0000 0000 0002`
- **Expiry:** Any future date (e.g. `12/28`)
- **CVV:** Any 3 digits (e.g. `123`)
- **OTP:** Any 4 or 6 digits (e.g. `123456`) or click **"Success"** on the Razorpay test bank screen.
