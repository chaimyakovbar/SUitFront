# PayPal Integration - Server Setup

## Overview

This document explains how to set up the server-side components for the PayPal integration that pre-fills user data and stores order information securely.

## Required Server Endpoints

### 1. POST /orders

**Purpose**: Save order data to database (excluding payment information)

**Request Body**:

```json
{
  "userId": "string",
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "address": "string",
  "paymentId": "string",
  "paymentStatus": "string",
  "totalAmount": "number",
  "paymentDate": "string (ISO date)",
  "selectedSuits": ["array of suit IDs"],
  "shippingCost": "number"
}
```

**Response**:

```json
{
  "success": true,
  "orderId": "string",
  "message": "Order saved successfully"
}
```

### 2. GET /orders/user/:userId

**Purpose**: Get all orders for a specific user

**Response**:

```json
{
  "orders": [
    {
      "orderId": "string",
      "userId": "string",
      "name": "string",
      "email": "string",
      "phoneNumber": "string",
      "address": "string",
      "paymentId": "string",
      "paymentStatus": "string",
      "totalAmount": "number",
      "paymentDate": "string",
      "selectedSuits": ["array"],
      "shippingCost": "number",
      "createdAt": "string"
    }
  ]
}
```

### 3. GET /orders/:orderId

**Purpose**: Get specific order details

**Response**:

```json
{
  "order": {
    "orderId": "string",
    "userId": "string",
    "name": "string",
    "email": "string",
    "phoneNumber": "string",
    "address": "string",
    "paymentId": "string",
    "paymentStatus": "string",
    "totalAmount": "number",
    "paymentDate": "string",
    "selectedSuits": ["array"],
    "shippingCost": "number",
    "createdAt": "string"
  }
}
```

### 4. PATCH /orders/:orderId

**Purpose**: Update order status

**Request Body**:

```json
{
  "status": "string"
}
```

## Database Schema

### Orders Collection

```javascript
{
  _id: ObjectId,
  userId: String,
  name: String,
  email: String,
  phoneNumber: String,
  address: String,
  paymentId: String,        // PayPal payment ID
  paymentStatus: String,    // "COMPLETED", "PENDING", etc.
  totalAmount: Number,
  paymentDate: Date,
  selectedSuits: [String],  // Array of suit IDs
  shippingCost: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

### ✅ What to Store

- User identification data (name, email, phone)
- Shipping address
- Order details (suits, amounts)
- Payment status and ID (from PayPal)
- Order timestamps

### ❌ What NOT to Store

- Credit card numbers
- PayPal account passwords
- Any financial credentials
- CVV codes
- Bank account details

## GDPR Compliance

### Data Minimization

- Only store necessary user data for order fulfillment
- Don't collect excessive personal information
- Allow users to request data deletion

### User Rights

- Right to access their order data
- Right to request data deletion
- Right to data portability
- Right to be informed about data usage

### Data Retention

- Keep order data for legal requirements (tax, accounting)
- Implement automatic data deletion after retention period
- Document data retention policies

## Error Handling

### Common Error Scenarios

1. **Invalid user data**: Return 400 Bad Request
2. **Database connection issues**: Return 500 Internal Server Error
3. **Duplicate payment ID**: Return 409 Conflict
4. **User not found**: Return 404 Not Found

### Error Response Format

```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## Testing

### Test Cases

1. **Valid order creation**: Should save order and return success
2. **Missing required fields**: Should return validation error
3. **Duplicate payment ID**: Should handle gracefully
4. **Database failure**: Should return appropriate error
5. **Invalid user ID**: Should return user not found error

## Environment Variables

```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Implementation Notes

1. **Validation**: Always validate user data before saving
2. **Sanitization**: Sanitize input data to prevent injection attacks
3. **Logging**: Log all order operations for audit purposes
4. **Monitoring**: Monitor payment success/failure rates
5. **Backup**: Implement regular database backups
6. **Rate Limiting**: Implement rate limiting on order endpoints
