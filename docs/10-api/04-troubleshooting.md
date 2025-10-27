---
title: Troubleshooting
sidebar_label: Troubleshooting
pagination_label: API Troubleshooting
slug: /api/troubleshooting
---

:::warning
The Silhouette API is currently in beta and under active development on testnet. More operations and features will be added soon.
:::

This section covers common errors you may encounter when using the Silhouette API and how to resolve them.

## Common errors

### Missing or invalid bearer token

```json
{
  "operation": "getBalances",
  "error": "Unauthorized",
  "code": "UNAUTHORIZED",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- [Bearer token](https://datatracker.ietf.org/doc/html/rfc6750) not included in the `Authorization` header
- Token format is incorrect (should be `Bearer YOUR_TOKEN_HERE`)
- Token is malformed or invalid
- Token is expired

Solutions:

- Ensure you include the `Authorization: Bearer YOUR_TOKEN_HERE` header in all authenticated requests
- Verify the token format is correct (no extra spaces, correct prefix)
- If the token is invalid or expired, authenticate again using the `login` operation or login assistant

### SIWE signature verification failed

```json
{
  "operation": "login",
  "error": "Invalid signature",
  "code": "INVALID_SIGNATURE",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- The signature doesn't match the SIWE message
- The message was modified after signing
- Wrong private key was used to sign the message

Solutions:

- Verify you're signing the exact SIWE message without modifications
- Ensure the wallet address in the message matches the address of the signing key
- Use the login assistant to simplify the SIWE authentication process (you can view the correct message when you sign)

### Missing required parameters

```json
{
  "operation": "createOrder",
  "error": "Missing required fields: side, orderType, baseToken, quoteToken, and amount are required.",
  "code": "VALIDATION_ERROR",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- One or more required parameters are missing from your request

Solutions:

- Check the operation documentation for required parameters
- Ensure all required fields are included in your request body
- Verify parameter names are spelled correctly (case-sensitive)

### Invalid parameter values or types

```json
{
  "operation": "createOrder",
  "error": "Invalid orderType. Must be 'limit' or 'market'.",
  "code": "VALIDATION_ERROR",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- Parameter value doesn't match the expected format or allowed values
- Invalid enum value (e.g., wrong order type, side, or status)
- Parameter is not in the expected format
- Amount or price is negative, zero, or not a valid number

Solutions:

- Check the operation documentation for valid parameter values
- Ensure you're using the exact string values specified (case-sensitive)
- For numeric values, ensure they're formatted as strings
- Ensure amounts and prices are positive values
- Use decimal strings (e.g., `"100.5"`) or scaled integer strings

### Operation not found

```json
{
  "error": "Operation not found",
  "code": "OPERATION_NOT_FOUND",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- The `operation` field contains an invalid or misspelled operation name
- The operation may not be available on this API version

Solutions:

- Verify the operation name is spelled correctly (case-sensitive)
- Check the Operations section of this documentation for valid operation names
- Ensure you're using the correct API endpoint

### Insufficient balance

```json
{
  "operation": "createOrder",
  "error": "Failed to create order.",
  "code": "ORDER_ERROR",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- You don't have enough available balance to place the order
- Funds are locked in other open orders

Solutions:

- Use `getBalances` to check your available balance
- Cancel existing orders to free up locked funds
- Deposit more funds before placing the order

### Order not found

```json
{
  "operation": "cancelOrder",
  "error": "Failed to cancel order.",
  "code": "CANCELLATION_ERROR",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- The order ID doesn't exist
- The order belongs to another user
- The order has already been cancelled, filled, or expired

Solutions:

- Verify the order ID is correct
- Use `getUserOrders` to check your current orders
- Ensure the order is in an `"open"` state before attempting to cancel

### Withdrawal not found

```json
{
  "operation": "getWithdrawalStatus",
  "error": "Withdrawal not found.",
  "code": "NOT_FOUND",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- The withdrawal ID doesn't exist
- The withdrawal belongs to another user

Solutions:

- Verify the withdrawal ID is correct
- Use `getUserWithdrawals` to view your withdrawal history
- You can only access your own withdrawals

### Withdrawal already in progress

```json
{
  "operation": "initiateWithdrawal",
  "error": "A withdrawal request is already in progress for this user.",
  "code": "CONFLICT",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- You already have a pending withdrawal

Solutions:

- Use `getUserWithdrawals` or `getWithdrawalStatus` to check your pending withdrawal
- Wait for the current withdrawal to complete before initiating a new one
- If a withdrawal is stuck in pending state for an extended period, contact support

### User not found

```json
{
  "operation": "getBalances",
  "error": "User 0x1234567890123456789012345678901234567890 not found",
  "code": "USER_NOT_FOUND",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- Your account hasn't been activated yet
- You haven't completed the deposit prerequisite

Solutions:

- Ensure you've deposited at least 5 USDC to the Silhouette contract address via `spotSend`
- Wait for the deposit transaction to be confirmed on the Hyperliquid testnet
- Verify you sent funds to the correct contract address: `0x564df7E15f24df933270E604192de22e906CEa0c`

### Internal server error

```json
{
  "operation": "getBalances",
  "error": "An internal error occurred",
  "code": "INTERNAL_ERROR",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- Unexpected server-side error
- Database or service unavailability
- System malfunction

Solutions:

- Retry the request after a few seconds
- If the error persists, check the Silhouette status page or contact support
- Ensure your request is properly formatted

### Service unavailable

```json
{
  "operation": "initiateWithdrawal",
  "error": "The withdrawal service is temporarily unavailable. Please try again later.",
  "code": "SERVICE_UNAVAILABLE",
  "responseMetadata": {
    "timestamp": 1705313400
  }
}
```

Causes:

- The service is undergoing maintenance
- High system load
- Temporary service disruption

Solutions:

- Wait a few minutes and retry your request
- Check for any maintenance announcements
- If the service remains unavailable, contact support

## General tips

### Check token validity

Before making API requests, ensure your bearer token is still valid. Tokens expire after 1 hour, and you'll need to re-authenticate. Consider implementing automatic token refresh in your application.

### Verify request format

All API requests must:

- Use the `POST` method
- Target the endpoint: `<API_URL>/v0`
- Include the `Content-Type: application/json` header
- Include a valid `operation` field in the request body
- For authenticated operations, include the `Authorization: Bearer YOUR_TOKEN_HERE` header

### Ensure deposit has processed

Before using the API, ensure your initial testnet deposit has been confirmed on the Hyperliquid network. Your account must be activated with a minimum 5 USDC deposit before you can use any operations besides `login`.

### Check network connectivity

If requests are timing out or failing to connect:

- Verify you can reach the API URL
- Check your firewall settings
- Ensure your network allows HTTPS traffic to the API

### Use the login assistant

For easier authentication without dealing with SIWE message generation and signing manually, use the login assistant at [https://login.silhouette.exchange/](https://login.silhouette.exchange/).

### Refer to operation documentation

Each operation has detailed documentation above, including:

- Required and optional parameters
- Request and response examples
- Common error scenarios
- Field descriptions

Consult the specific operation documentation when encountering issues with a particular operation.
