---
title: API Overview
slug: /api
description: "Programmatic access to shielded trading on Hyperliquid via the Silhouette API. Single-endpoint design with SIWE authentication."
keywords:
  - Silhouette API
  - Hyperliquid API
  - trading API
  - shielded trading
  - SIWE authentication
  - programmatic trading
  - DeFi API
  - API reference
---

:::warning
The Silhouette API and SDK are in beta. We are actively adding new operations.
:::

## Overview

The Silhouette API provides programmatic access to shielded trading on Hyperliquid. Deposit funds, place and manage orders, and process withdrawals - all through a single endpoint.

:::info
**Mainnet**: `https://api.silhouette.exchange/`
**Testnet**: `https://api-testnet.silhouette.exchange/`
:::

All API requests are `POST` requests sent to the same URL. Rather than separate endpoints for each operation (like `/orders` or `/balances`), the API uses a discriminated union pattern - you specify the operation in the `operation` field of your request body. This provides a consistent request structure across all operations.

Authentication uses [Sign-In With Ethereum (SIWE)](https://docs.login.xyz/), which proves your identity through your Ethereum wallet. Once authenticated, you receive a [bearer token](https://datatracker.ietf.org/doc/html/rfc6750) to include in all subsequent requests. See the [Authentication](/api/authentication) page for full details.

## Sections

1. [Quick Start](/api/quick-start) - Set up your account, obtain a bearer token, and make your first API call
2. [Authentication](/api/authentication) - Detailed SIWE authentication flow
3. [Reference](/api/reference) - Complete documentation for all API operations
4. [Troubleshooting](/api/troubleshooting) - Common errors and solutions
5. [OpenAPI Specification](/api/openapi) - Generate strongly-typed client libraries from our OpenAPI spec

For a higher-level integration, see the [Python SDK](/sdk).
