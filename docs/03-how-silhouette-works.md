---
id: how-silhouette-works
title: How Silhouette Works
sidebar_label: How Silhouette Works
pagination_label: How Silhouette Works
slug: /how-silhouette-works
description: "Learn how Silhouette works - from deposit to shielded execution to settlement on Hyperliquid. Same order book, same liquidity, fully private."
keywords:
  - shielded trading
  - Hyperliquid trading
  - shielded execution
  - TEE
  - trade privacy
  - Silhouette Exchange
  - decentralized exchange
---

# How Silhouette Works

Silhouette adds a shielded execution layer on top of Hyperliquid. From the outside, your trading activity is invisible. From the inside, you get the same order book, the same liquidity, and the same execution quality, without broadcasting your intent.

Here's what happens when you trade on Silhouette, step by step:

## 1. Connect and Deposit

You connect your wallet to Silhouette - the same wallet you use across Hyperliquid. When you deposit, your funds move into Silhouette's secure environment. The TEE manages your balance internally and executes trades on your behalf. Learn more in [Architecture Overview](/architecture/overview) and [TEE documentation](/architecture/tee).

Your deposit is the last publicly visible action until you withdraw. Everything that happens inside Silhouette stays between you and the system.

## 2. Choose Your Mode

You decide how to execute every trade:

- **Shielded**: Your order is routed through Silhouette's secure execution environment. Your intent, size and strategy are hidden from the public ledger.
- **Naked**: Your order routes directly to Hyperliquid via Builder Codes. Fully visible, same as trading on any other Hyperliquid frontend.

You can switch between modes at any time. There is no commitment, no lockup, no penalty. The choice is yours on every single trade. See [Shielded Trading](/trading/shielded-trading) and [Naked Trading](/trading/naked-trading) for a deeper comparison.

## 3. Shielded Execution

When you trade shielded, your order enters Silhouette's Trusted Execution Environment (TEE) - a secure, isolated computing environment that no one can access, not even the Silhouette team.

Inside the TEE, your order is processed and matched. When it is time to settle, the trade is executed on Hyperliquid's order book via agent wallets. These wallets aggregate activity from multiple users, so individual trades cannot be traced back to you. The market sees volume, but not who is behind it. Your balance is securely updated within Silhouette's TEE.

## 4. Settlement

All shielded trades settle on Hyperliquid. Instead of an off-chain orderbook, Silhouette is a shielded route to the same order book everyone else uses. You get real execution against real liquidity at real prices. For more detail, see [Order Lifecycle](/trading/order-lifecycle).

The only onchain actions that are publicly visible are:
- **Deposits** into Silhouette
- **Withdrawals** from Silhouette

Everything between those two events - your trades, your balances, your strategy - remains shielded.

## 5. Withdraw Anytime

When you are ready to withdraw, you withdraw from Silhouette through your wallet like any other DeFi application. Your funds return to your address on HyperCore. No waiting period, no approval process.

## What the Public Ledger Sees

When you trade shielded on Silhouette, here is what is visible onchain versus what stays private:

| Visible onchain | Private to you |
|---|---|
| Your deposit into Silhouette | Your trading activity |
| Your withdrawal from Silhouette | Your balances inside Silhouette |
| Aggregate volume from delegated wallets | Your individual orders and fills |
| | Your strategy and intent |

The result: you trade with the full depth of Hyperliquid's liquidity, and the market sees none of your moves.

## Why This Matters

On a fully transparent ledger, every trade is a signal. The moment you place an order, copy-trading bots can mirror your position, front-runners can extract value from your execution, and whale-tracking accounts can broadcast your activity.

Silhouette removes you from that equation. Same market, same prices, same liquidity. But your strategy stays yours.
