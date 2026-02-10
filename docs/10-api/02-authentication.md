---
title: Authentication
sidebar_label: Authentication
slug: /api/authentication
---

:::warning
The Silhouette API and SDK is currently in beta and under active development. More operations and features will be added soon.
:::

The Silhouette API uses [Sign-In With Ethereum (SIWE)](https://docs.login.xyz/) for authentication, which allows you to prove your identity using your Ethereum wallet without requiring traditional API keys or passwords.

## Overview of SIWE

SIWE is a standard authentication method that uses cryptographic signatures to prove ownership of an Ethereum address. Instead of creating usernames and passwords, you sign a message with your wallet's private key, and the server verifies the signature to confirm your identity.

How it works:

1. You generate a SIWE message containing information about your wallet address and the authentication request
2. You sign this message using your wallet's private key
3. You send the signed message and signature to the `login` operation
4. The server verifies the signature and issues a JWT (JSON Web Token) [bearer token](https://datatracker.ietf.org/doc/html/rfc6750)
5. You include this bearer token in the `Authorization` header of all subsequent API requests

Your user identity is automatically derived from your wallet address, which is embedded in the bearer token. This means you can only access your own account data, and no additional credentials or registration is required.

:::warning
Anyone with your bearer token will have full access to your Silhouette account until it expires.
:::

## Using the login assistant (recommended)

The easiest way to authenticate is through the Silhouette login assistant web interface.

Steps:

1. Visit [https://login.silhouette.exchange/](https://login.silhouette.exchange/)
2. Click "Connect Wallet" and select your Ethereum wallet provider (MetaMask, WalletConnect, etc.)
3. Approve the connection request in your wallet
4. Review the SIWE authentication message
5. Sign the message in your wallet
6. Copy the bearer token displayed on the screen

Save this token securely. You'll need to include it in all API requests.

## Manual authentication flow (advanced)

If you're integrating programmatically or prefer to handle authentication manually, follow these steps:

### Step 1: Install required libraries

```bash
npm install siwe viem
```

### Step 2: Generate and sign the SIWE message

Here's a complete example using Node.js:

```javascript
const { SiweMessage, generateNonce } = require('siwe');
const { privateKeyToAccount } = require('viem/accounts');

// Create an account from your private key
const privateKey = '0x...'; // Your wallet's private key
const account = privateKeyToAccount(privateKey);

// Create the SIWE message
const message = new SiweMessage({
  domain: 'api.silhouette.exchange',
  address: account.address,
  statement: 'Sign in with Ethereum to the app.',
  uri: 'https://api.silhouette.exchange/login',
  version: '1',
  chainId: 1,
  nonce: generateNonce(),
});

// Sign the message
const signature = await account.signMessage({
  message: message.prepareMessage(),
});

// Get the message string to send to the API
const messageString = message.toMessage();

console.log('Message to send:', messageString);
console.log('Signature:', signature);
```

This will produce a SIWE message like:

```text
api.silhouette.exchange wants you to sign in with your Ethereum account:
0x1234567890123456789012345678901234567890

Sign in with Ethereum to the app.

URI: https://api.silhouette.exchange/login
Version: 1
Chain ID: 1
Nonce: abcdefghijklmnopqrstuvwxyz123456
Issued At: 2025-01-15T10:30:00.000Z
```

Key points:

- `message.prepareMessage()` returns the formatted message string to sign
- `account.signMessage()` creates the cryptographic signature
- `message.toMessage()` returns the complete message string to send in the API request
- The SIWE library automatically adds the `Issued At` timestamp

### Step 3: Call the login operation

Send the SIWE message and signature to the API's `login` operation:

Request:

```bash
curl https://api.silhouette.exchange/v0 \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "login",
    "message": "api.silhouette.exchange wants you to sign in with your Ethereum account:\n0x1234567890123456789012345678901234567890\n\nSign in with Ethereum to the app.\n\nURI: https://api.silhouette.exchange/login\nVersion: 1\nChain ID: 1\nNonce: abcdefghijklmnopqrstuvwxyz123456\nIssued At: 2024-01-15T10:30:00.000Z",
    "signature": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab"
  }'
```

Success response:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "responseMetadata": {
    "timestamp": 1234567890,
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

Error response example:

```json
{
  "operation": "login",
  "error": "Invalid signature",
  "code": "INVALID_SIGNATURE",
  "responseMetadata": {
    "timestamp": 1234567890
  }
}
```

For complete details on the `login` operation, see the [reference](reference#login) documentation.

### Step 4: Store the bearer token

The `token` field in the response contains your JWT bearer token. Store this token securely, as you'll need it for all authenticated API requests.

## Using the bearer token

Once you have a bearer token, include it in the `Authorization` header of every API request:

```text
Authorization: Bearer YOUR_TOKEN_HERE
```

Example authenticated request:

```bash
curl https://api.silhouette.exchange/v0 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "operation": "getBalances"
  }'
```

## Token expiry and renewal

Bearer tokens expire after 24 hours. When your token expires, you'll receive an authentication error when making API requests. To continue using the API, you'll need to repeat the authentication process to obtain a new token.

Signs your token has expired:

- API requests return authentication errors
- Error code `UNAUTHORIZED` or `TOKEN_EXPIRED`
- Error message indicating token is invalid or expired

When this happens, simply go through the authentication flow again (using the login assistant or manual flow) to obtain a fresh token.

For troubleshooting authentication issues, see the [troubleshooting](troubleshooting) page.
