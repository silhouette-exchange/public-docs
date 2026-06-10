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

You place an order through the Silhouette UI in shielded mode - selecting your asset, size, and order type. The order is submitted to Silhouette's Trusted Execution Environment (TEE).

At this point, no order information has been written to the public ledger.

Hyperliquid has no native market-order primitive. A "market" order in the UI is a limit order with a slippage-derived price cap and an IoC (Immediate or Cancel) time-in-force. Shielded currently submits every order as a delegated IoC. Resting GTC limit orders for shielded are on the roadmap.

### 2. Processing

Inside the TEE, your order is validated and queued for execution. The TEE processes orders from all users in the same secure environment. Data inside the enclave is inaccessible to anyone, including the Silhouette team.

### 3. Execution

The TEE submits your order to Hyperliquid's order book through a delegated wallet. The order is placed as an IoC (Immediate or Cancel) limit order:

- If the order can be filled at the specified price or better, it fills immediately
- If it cannot be filled in full, the remainder cancels - nothing rests on the public book from shielded trades

The delegated wallet aggregates activity from multiple users. The market sees the trade but cannot attribute it to any individual.

### 4. Balance Update

After execution, the TEE updates your shielded balance. The update reflects your new position - the asset you bought or sold, and the resulting balance. Your shielded balance sits inside the TEE and is not readable by anyone, including Silhouette.

### 5. Settlement Complete

Your trade is now settled on Hyperliquid's order book. Your balance is updated inside the Silhouette TEE. The trade is final.

From the public ledger's perspective, the settled transaction is a fill from a delegated wallet on Hyperliquid. The fill itself is visible, but it is not attributable to an individual user, strategy, or account balance.

## Naked Order Lifecycle

Naked orders follow a simpler path:

1. You place an order through the Silhouette UI in [naked mode](/trading/naked-trading)
2. The order routes directly to Hyperliquid via Builder Codes
3. The order executes on Hyperliquid's order book, fully visible
4. Your wallet and trade details are recorded on the public ledger

Naked orders do not interact with the TEE or delegated wallets. They are standard Hyperliquid trades routed through Silhouette's interface.

## Order States

| State | Description |
|---|---|
| **Submitted** | Your order has been received by Silhouette |
| **Processing** | The order is being processed in the TEE |
| **Executing** | The order is being submitted to Hyperliquid |
| **Filled** | The order has been fully executed |
| **Partially Filled** | Part of the order was filled within the IoC price cap; the remainder cancelled |
| **Cancelled** | The order could not fill within the IoC price cap and was cancelled in full |

To learn more about [shielded trading](/trading/shielded-trading) or [naked trading](/trading/naked-trading), visit the relevant pages.

<TechArticleSchema
  headline="Order Lifecycle on Silhouette Exchange"
  description="Follow the complete lifecycle of shielded and naked orders on Silhouette Exchange, from submission through TEE processing to Hyperliquid settlement."
  proficiencyLevel="Intermediate"
  keywords={['order lifecycle', 'shielded trading', 'Silhouette Exchange', 'shielded execution', 'Hyperliquid']}
/>
