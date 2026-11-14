# Frontend Guide: Multipart Return Evidence Uploads

Hi Hazm! When a customer submits a return request with photos or proof of defect, our backend supports both pure JSON (with pre-uploaded image URLs) and `multipart/form-data` file uploads.

---

## 1. Multipart Form-Data Specifications

- **Endpoint:** `POST /api/v1/returns`
- **Content-Type:** `multipart/form-data`
- **File Field Name:** `evidence` (Strictly must be named `evidence`)
- **Max Files:** Up to `5` files per return request
- **Max File Size:** `5 MB` per file
- **Allowed MIME Types:**
  - `image/jpeg` (`.jpg`, `.jpeg`)
  - `image/png` (`.png`)
  - `image/webp` (`.webp`)
  - `application/pdf` (`.pdf`)

---

## 2. Frontend FormData Construction Example

```javascript
const formData = new FormData();

// Append return metadata as JSON string:
formData.append('orderId', '6734a1b2c3d4e5f6a7b8c901');
formData.append('reasonCategory', 'DEFECTIVE_PRODUCT');
formData.append('reasonDetails', 'Seam tore along the shoulder after one gentle hand wash.');
formData.append('items', JSON.stringify([
  {
    orderItemId: '6734a1b2c3d4e5f6a7b8c902',
    qty: 1,
    reason: 'DAMAGED_ITEM',
    condition: 'DEFECTIVE'
  }
]));

// Append physical files under the field name "evidence":
selectedFiles.forEach((file) => {
  formData.append('evidence', file);
});

// Send request via Axios:
await api.post('/returns', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

---

## 3. Alternative: Pre-uploaded URLs via JSON
If you upload images via a direct Cloudinary frontend widget first, you can send standard `application/json`:
```json
{
  "orderId": "6734a1b2c3d4e5f6a7b8c901",
  "reasonCategory": "DEFECTIVE_PRODUCT",
  "reasonDetails": "Torn fabric",
  "evidenceUrls": [
    "https://res.cloudinary.com/crm-demo/image/upload/v1/evidence/tear.jpg"
  ],
  "items": [
    {
      "orderItemId": "6734a1b2c3d4e5f6a7b8c902",
      "qty": 1,
      "reason": "DAMAGED_ITEM"
    }
  ]
}
```
Both modes are fully supported!
