---
title: Architecture Overview
sidebar_label: Overview
pagination_label: Architecture Overview
description: "Learn how Silhouette Exchange enables shielded trading on Hyperliquid through its three-component architecture: TEE, smart contract, and UI."
keywords:
  - Silhouette Exchange
  - architecture
  - shielded trading
  - Hyperliquid
  - TEE
  - trusted execution environment
  - smart contract
  - HyperEVM
---

# Architecture Overview

:::info For All Users
This overview explains how Silhouette's components work together. Traders can skim the diagrams and design principles. Those conducting security due diligence should review all sections.
:::

Silhouette is built on three components that work together to provide shielded trading on Hyperliquid. Each component has a clear role, and no single component has complete control over the system.

## The Three Components

### Silhouette App

The application where you interact with the platform. The app handles:

- Wallet connection and authentication
- Order placement (shielded and naked)
- Shielded API authentication and session management
- Real-time balance and order status display

<!-- DOCS_REWRITE: updated app/contract/TEE roles to match the live implementation -->
The app communicates with HyperCore for deposit and withdrawal flows, and with Silhouette's shielded API for login, order placement, balances, and real-time events.

### Silhouette Smart Contract

Deployed on the [HyperEVM](/architecture/hyperliquid), the smart contract is the onchain component of Silhouette's custody and withdrawal flow. In the current live path, it:

- Participates in fund custody and withdrawal finalization
- Gives Silhouette an onchain control point distinct from the frontend
- Works alongside the TEE rather than replacing it as the execution engine

For more details on the current custody model, see [Smart Contract](/architecture/smart-contract).

### Trusted Execution Environment (TEE)

The TEE hosts Silhouette's matching engine and acts as the bridge between users and Hyperliquid. It:

- Receives and processes shielded orders
- Executes shielded spot trades on HyperCore through delegated wallets
- Tracks shielded account balances and order state
- Monitors both HyperCore and HyperEVM for deposit and withdrawal events

The TEE runs in an AWS Nitro Enclave - a secure, isolated environment where the code runs confidentially. No one can access the data inside, not even the Silhouette team or AWS. For more details, see [Trusted Execution Environments](/architecture/tee).

## How They Work Together

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│             │     │                 │     │              │
│   Your      │────▶│   Silhouette    │────▶│  Hyperliquid │
│   Browser   │     │   TEE           │     │  Order Book  │
│             │◀────│                 │◀────│              │
└──────┬──────┘     └────────┬────────┘     └──────────────┘
       │                     │
       │                     │
       ▼                     ▼
┌──────────────────────────────────────────┐
│          Silhouette Smart Contract       │
│            (HyperEVM)                    │
│  - Custody / withdrawal flow             │
│  - Onchain contract component            │
│  - Finalization logic                    │
└──────────────────────────────────────────┘
```

**Deposit flow:**
1. You deposit funds from your wallet to the Silhouette smart contract
2. The TEE detects your deposit by monitoring HyperCore
3. Silhouette credits your shielded account inside the service

**Trading flow:**
1. You submit a shielded order through the UI
2. The TEE processes and matches your order
3. The TEE executes the trade on [Hyperliquid](/architecture/hyperliquid) via delegated wallets
4. Silhouette updates your shielded account state and reports it back through the app/API

**Withdrawal flow:**
1. You request a withdrawal through the UI
2. The shielded service coordinates the withdrawal through the onchain contract path
3. Funds return to your wallet on HyperCore

## Design Principles

**Separated responsibilities.** The app handles authentication and UX, the TEE handles shielded execution, delegated wallets handle market interaction on HyperCore, and the smart contract handles onchain custody/withdrawal logic.

**Verifiable execution.** The TEE's code can be independently verified through [attestation](/architecture/tee). The smart contract's logic is onchain and auditable. You do not need to trust Silhouette's claims - you can verify them.

**Onchain withdrawal path.** Withdrawals ultimately resolve through the onchain contract flow rather than purely offchain bookkeeping.
