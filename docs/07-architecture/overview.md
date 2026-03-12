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
- Encryption key management - your keys are generated and stored locally in your browser
- Real-time balance and order status display

The app communicates directly with both HyperCore (for deposits and withdrawals) and the [Silhouette smart contract](/architecture/smart-contract) (for balance verification). It also manages the encrypted channel between your browser and the TEE.

### Silhouette Smart Contract

Deployed on the [HyperEVM](/architecture/hyperliquid), the smart contract is the **definitive record** for the platform. It:

- Holds your funds securely
- Stores your encrypted balance onchain
- Enforces protocol rules - state changes must be accompanied by a correctness proof
- Enables sovereign withdrawal - users can always access their funds directly

The smart contract does not trust the TEE blindly. Every balance update submitted by the TEE must be accompanied by a proof that the update follows the protocol rules. The contract verifies this proof onchain before accepting any state change. For more details, see [Smart Contract](/architecture/smart-contract).

### Trusted Execution Environment (TEE)

The TEE hosts Silhouette's matching engine and acts as the bridge between users and Hyperliquid. It:

- Receives and processes shielded orders
- Matches orders internally
- Executes trades on HyperCore through delegated wallets
- Submits encrypted balance updates to the smart contract
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
│  - Holds funds                           │
│  - Stores encrypted balances             │
│  - Enforces protocol rules               │
└──────────────────────────────────────────┘
```

**Deposit flow:**
1. You deposit funds from your wallet to the Silhouette smart contract
2. The TEE detects your deposit by monitoring HyperCore
3. Your encrypted balance is updated on the smart contract

**Trading flow:**
1. You submit a shielded order through the UI
2. The TEE processes and matches your order
3. The TEE executes the trade on [Hyperliquid](/architecture/hyperliquid) via delegated wallets
4. Your encrypted balance is updated on the smart contract

**Withdrawal flow:**
1. You request a withdrawal through the UI
2. The smart contract processes your withdrawal
3. Funds return to your wallet on HyperCore

## Design Principles

**No single point of trust.** The smart contract enforces rules onchain. The TEE runs in a verifiable environment. Your encryption keys stay in your browser. No single component - and no person - has complete control.

**Verifiable execution.** The TEE's code can be independently verified through [attestation](/architecture/tee). The smart contract's logic is onchain and auditable. You do not need to trust Silhouette's claims - you can verify them.

**Sovereign access.** Your funds are always accessible through the [smart contract](/architecture/smart-contract), regardless of whether Silhouette's frontend or backend is online.
