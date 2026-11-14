# Frontend Guide: API Error Format & Form Validation Handling

Hi Hazm! Every error response from our backend adheres to a single uniform JSON envelope so your React Hook Form, TanStack Query, and Axios interceptors can handle errors predictively.

---

## 1. Standard Error Envelope Structure

```typescript
interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;       // e.g. 'items', 'customer.email', 'shippingAddress.postalCode'
    message: string;      // Human-readable error description
    location?: 'body' | 'query' | 'params';
  }>;
}
```

---

## 2. Common HTTP Error Status Codes

| Status | Meaning | Typical Scenario | UI Action |
|---|---|---|---|
| `400 Bad Request` | Zod validation failure or state machine violation | Missing items, invalid postal code, attempting to cancel a shipped order, or return window expired | Highlight field errors in Red on the form / show toast |
| `401 Unauthorized`| Missing or invalid JWT Bearer token | Token expired or absent | Redirect user to Login modal / clear session |
| `403 Forbidden`   | Authenticated user lacks required permission key | Support agent attempting to disburse refund, or viewer attempting to create order | Disable button with tooltip: *"You lack permissions"* |
| `404 Not Found`   | Resource does not exist | Order ID not in DB | Display "Record Not Found" 404 empty state |
| `409 Conflict`    | Duplicate unique key | Duplicate order number | Inform user and retry with refreshed state |
| `500 Server Error`| Unhandled server crash | Infrastructure failure | Display generic error toast |

---

## 3. Recommended Axios Interceptor Pattern

```javascript
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const message = errorData?.message || "An unexpected error occurred.";
    
    // Bind field errors directly to React Hook Form:
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach(err => {
        if (err.field) {
          // form.setError(err.field, { message: err.message });
        }
      });
    }

    toast.error(message);
    return Promise.reject(errorData || error);
  }
);
```
