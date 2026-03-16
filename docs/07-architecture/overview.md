---
title: Architecture Overview
sidebar_label: Overview
pagination_label: Architecture Overview
description: "Learn how Silhouette Exchange enables shielded trading on Hyperliquid."
keywords:
  - Silhouette Exchange
  - architecture
  - shielded trading
  - Hyperliquid
  - TEE
  - trusted execution environment
  - delegated wallets
---

# Architecture Overview

:::info For All Users
This overview explains how Silhouette's components work together. Traders can skim the diagrams and design principles. Those conducting security due diligence should review all sections.
:::

### Silhouette App

The application where you interact with the platform. The app handles:

- Wallet connection and authentication
- Order placement (shielded and naked)
- Shielded API authentication and session management
- Real-time balance and order status display

The app communicates with HyperCore for deposit and withdrawal flows, and with Silhouette's shielded API for login, order placement, balances, and real-time events.

### Hyperliquid

Hyperliquid is the live market and transfer surface for Silhouette. In the current user flow it:

- Receives deposits via token transfers to the Silhouette address
- Executes shielded spot trades through delegated wallets
- Delivers withdrawals back to user wallets on HyperCore

### Trusted Execution Environment (TEE)

The TEE hosts Silhouette's matching engine and acts as the bridge between users and Hyperliquid. It:

- Receives and processes shielded orders
- Executes shielded spot trades on HyperCore through delegated wallets
- Tracks shielded account balances and order state
- Monitors HyperCore for deposit and withdrawal events

The TEE runs in an AWS Nitro Enclave - a secure, isolated environment where the code runs confidentially. No one can access the data inside, not even the Silhouette team or AWS. For more details, see [Trusted Execution Environments](/architecture/tee).

## How They Work Together

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│             │     │                 │     │              │
│   Your      │────▶│   Silhouette    │────▶│  Hyperliquid │
│   Browser   │     │   TEE           │     │  Order Book  │
│             │◀────│                 │◀────│              │
└─────────────┘     └─────────────────┘     └──────────────┘
```

**Deposit flow:**
1. You deposit funds from your wallet to the Silhouette address
2. The TEE detects your deposit by monitoring HyperCore
3. Silhouette credits your shielded account inside the service

**Trading flow:**
1. You submit a shielded order through the UI
2. The TEE processes and matches your order
3. The TEE executes the trade on [Hyperliquid](/architecture/hyperliquid) via delegated wallets
4. Silhouette updates your shielded account state and reports it back through the app/API

**Withdrawal flow:**
1. You request a withdrawal through the UI
2. The shielded service updates your account balance and initiates a transfer on HyperCore
3. Funds return to your wallet on HyperCore

## Design Principles

**Separated responsibilities.** The app handles authentication and UX and the TEE handles shielded execution and account state.
