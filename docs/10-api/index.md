---
title: API Overview
slug: /api-overview
---

:::warning
The Silhouette API and SDK is currently in beta and under active development. More operations and features will be added soon.
:::

## Overview

The Silhouette API provides programmatic access to the Silhouette shielded exchange, enabling traders to deposit funds, place and manage orders, and process withdrawals.

:::info
The Silhouette API is available at `https://api.silhouette.exchange/v0` for mainnet and `https://api-testnet.silhouette.exchange/v0` for testnet.
:::

All API requests are `POST` requests sent to the same URL. Rather than having separate endpoints for each operation (like `/orders` or `/balances`), the API uses a discriminated union pattern where you specify the operation in the `operation` field of your request body. This approach simplifies integration and provides a consistent request structure across all operations.

Authentication is handled through wallet signing using [Sign-In With Ethereum (SIWE)](https://docs.login.xyz/), which uses your Ethereum wallet to prove your identity. Once authenticated, you receive a [bearer token](https://datatracker.ietf.org/doc/html/rfc6750) that you include in all subsequent API requests.

## Sections

1. [Quick start](/docs/api/quick-start) – Set up your account, obtain a bearer token, and make your first API call
2. [Authentication](/docs/api/authentication) – Detailed information about the SIWE authentication flow
3. [Reference](/docs/api/reference) – Complete documentation for all available API operations
4. [Troubleshooting](/docs/api/troubleshooting) – Common errors and solutions
5. [OpenAPI specification](/docs/api/openapi) – Generate strongly-typed client libraries from our OpenAPI spec
6. [Python SDK](/docs/api/sdk) – Official Python SDK for interacting with the Silhouette API
