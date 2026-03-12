---
title: Order Lifecycle
sidebar_label: Order Lifecycle
pagination_label: Order Lifecycle
description: "Follow the complete lifecycle of shielded and naked orders on Silhouette Exchange, from submission through TEE processing to Hyperliquid settlement."
keywords:
  - order lifecycle
  - shielded trading
  - Silhouette Exchange
  - shielded execution
  - Hyperliquid
  - DeFi privacy
  - crypto trading
---

# Order Lifecycle

This page walks through the complete lifecycle of an order on Silhouette, from the moment you submit it to final settlement on Hyperliquid.

## Shielded Order Lifecycle

### 1. Submission

You place an order through the Silhouette UI - selecting your asset, size, [order type](/trading/order-types) (market or limit), and shielded mode. The order is submitted to Silhouette's Trusted Execution Environment (TEE).

At this point, no information about your order has touched the public ledger. Your intent is confidential.

### 2. Processing

Inside the TEE, your order is validated and queued for execution. For market orders, execution begins immediately. For limit orders, the system holds your order until market conditions match your specified price.

The TEE processes orders from all users in the same secure environment. No one - including the Silhouette team - can see the orders being processed.

### 3. Execution

When your order is ready to execute, the TEE submits it to Hyperliquid's order book through a delegated wallet. The order is placed as an IoC (Immediate or Cancel) order:

- If the order can be filled at the specified price (or better for limits), it fills immediately
- If it cannot be filled, it cancels - there are no resting orders on Hyperliquid from shielded trades

The delegated wallet aggregates activity from multiple users. The market sees the trade but cannot attribute it to any individual.

### 4. Balance Update

After execution, the TEE updates your encrypted balance on the Silhouette smart contract. The update reflects your new position - the asset you bought or sold, and the resulting balance.

Only you can decrypt and view your updated balance. The onchain state contains the encrypted data, but it is meaningless without your local encryption key.

### 5. Settlement Complete

Your trade is now settled on Hyperliquid's order book. Your balance is updated on the Silhouette smart contract. The trade is final.

From the public ledger's perspective, all that happened was a trade from a delegated wallet on Hyperliquid - no connection to your identity, your strategy, or your position.

## Naked Order Lifecycle

Naked orders follow a simpler path:

1. You place an order through the Silhouette UI in [naked mode](/trading/naked-trading)
2. The order routes directly to Hyperliquid via Builder Codes
3. The order executes on Hyperliquid's order book, fully visible
4. Your wallet and trade details are recorded on the public ledger

Naked orders do not interact with the TEE, delegated wallets, or the Silhouette smart contract. They are standard Hyperliquid trades routed through Silhouette's interface.

## Order States

| State | Description |
|---|---|
| **Submitted** | Your order has been received by Silhouette |
| **Processing** | The order is being processed in the TEE |
| **Executing** | The order is being submitted to Hyperliquid |
| **Filled** | The order has been fully executed |
| **Partially Filled** | Part of the order has been executed, with the remainder pending |
| **Cancelled** | The order was cancelled (by you or by IoC expiry) |
| **Expired** | A limit order reached its expiry time without being fully filled |

To learn more about [shielded trading](/trading/shielded-trading) or the available [order types](/trading/order-types), visit the relevant pages.
