---
title: Quick start
sidebar_label: Quick start
slug: /api/quick-start
---

:::warning
The Silhouette API is currently in beta and under active development on testnet. More operations and features will be added soon.
:::

This guide will walk you through making your first API call to the Silhouette exchange, from setting up prerequisites to checking your balance.

## Prerequisites

Before you can use the Silhouette API, you need to complete the following steps:

1. You must have a wallet address on Hyperliquid's L1 testnet chain (HyperCore). This is your identity on the Silhouette platform.

2. Since Silhouette is currently running on testnet, you'll need testnet USDC. Visit the [Hyperliquid testnet faucet](https://hyperliquid.gitbook.io/hyperliquid-docs/onboarding/testnet-faucet) to obtain testnet funds for your HyperCore address.

3. Use Hyperliquid's `spotSend` operation to transfer funds to the Silhouette testnet contract address to activate your account in Silhouette:

   ```text
   0x2B065d0C4865a520bab6821C835a66B073e4e590
   ```

   :::warning
   This contract address is on the Hyperliquid testnet, not mainnet.
   :::
   :::warning
   You must deposit at least 5 USDC to activate your account.
   :::

   The `spotSend` operation transfers assets between addresses on the Hyperliquid network. Refer to the [Hyperliquid documentation](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint#core-spot-transfer) for details on executing this operation.

## Quick Start

### Step 0: Meet the prerequisites

Make sure you meet all the [prerequisites](#prerequisites) before interacting with Silhouette.

### Step 1: Obtain a bearer token

:::warning
Anyone with your bearer token will have full access to your Silhouette account until it expires.
:::

You need a [bearer token](https://datatracker.ietf.org/doc/html/rfc6750) to authenticate your API requests. The easiest way to obtain one is through the login assistant:

1. Visit the [login assistant](https://login.silhouette.exchange/)
2. Connect your Ethereum wallet
3. Sign the authentication message
4. Copy the bearer token provided

For detailed information about the authentication process, including manual authentication flow, see the [authentication](authentication) page.

### Step 2: Make your first API call

Now that you have a bearer token, you can make your first API call. Let's retrieve your account balance using the `getBalances` operation.

**Request:**

```bash
curl https://api.silhouette.exchange/v0 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "operation": "getBalances"
  }'
```

Replace `YOUR_TOKEN_HERE` with the bearer token you obtained in Step 1.

**Expected response:**

```json
{
  "data": {
    "balances": [
      {
        "token": "USDC",
        "available": "1000000000",
        "availableFloat": "1000.0",
        "locked": "0",
        "lockedFloat": "0.0",
        "total": "1000000000",
        "totalFloat": "1000.0"
      }
    ]
  },
  "responseMetadata": {
    "timestamp": 1234567890,
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

The `balances` array shows your available balance for each token. Note that balances are represented in the token's smallest unit (for USDC, this is micro-USDC, so the value `"1000000000"` represents 1,000 USDC).

You've successfully made your first API call! You can now explore other operations in the [reference](reference) documentation.

## Next steps

- Explore the [authentication](authentication) page for detailed information about SIWE authentication
- Review the [reference](reference) for all available API operations
- Check the [troubleshooting](troubleshooting) page if you encounter any issues
