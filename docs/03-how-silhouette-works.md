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

## How does Silhouette work?

Silhouette adds a shielded execution layer on top of Hyperliquid. Trading activity is not exposed on the public ledger. Orders route to the same Hyperliquid order book and access the same liquidity used by any other Hyperliquid frontend.

<img src="/img/app-screenshots/trade-full.png" alt="Silhouette Exchange trade page overview" className="app-screenshot app-screenshot--lg" />

Here's what happens when you trade on Silhouette, step by step:

## 1. Connect and Deposit

You connect your wallet to Silhouette - the same wallet you use across Hyperliquid. When you deposit, your funds move into Silhouette's secure environment. The TEE manages your balance internally and executes trades on your behalf. Learn more in [Architecture Overview](/architecture/overview) and [TEE documentation](/architecture/tee).

Deposits and withdrawals are visible onchain and attributable to the user's wallet. Everything in between - individual orders, fill prices, sizes, and balances inside Silhouette - is not attributable. Silhouette's delegated wallets trade on Hyperliquid, and those fills are publicly visible, but the mapping from any given fill back to an individual user is not. The more users routing through delegated wallets, the larger the anonymity set.

<img src="/img/app-screenshots/portfolio-sidebar.png" alt="Portfolio sidebar showing account structure and balances" className="app-screenshot app-screenshot--sm" />

## 2. Choose Your Mode

You decide how to execute every trade:

- **Shielded**: Your order is routed through Silhouette's secure execution environment. Your intent, size and strategy are hidden from the public ledger.
- **Naked**: Your order routes directly to Hyperliquid via Builder Codes. Fully visible, same as trading on any other Hyperliquid frontend.

Mode can be changed on a per-trade basis. There is no lockup or minimum duration for either mode. See [Shielded Trading](/trading/shielded-trading) and [Naked Trading](/trading/naked-trading) for a deeper comparison.

## 3. Shielded Execution

When you trade shielded, your order enters Silhouette's Trusted Execution Environment (TEE) - a secure, isolated computing environment. Data inside the enclave is not readable by anyone, including the Silhouette team.

Inside the TEE, your order is processed and matched. When it is time to settle, the trade is executed on Hyperliquid's order book via delegated wallets. These wallets aggregate activity from multiple users, so individual trades cannot be traced back to you. The market sees volume, but not who is behind it. Your shielded balance is updated inside Silhouette's TEE.

## 4. Settlement

All shielded trades settle on Hyperliquid. Silhouette does not operate a separate off-chain orderbook; it is a shielded route to the Hyperliquid order book. Execution occurs against Hyperliquid's live liquidity at prevailing market prices. For more detail, see [Order Lifecycle](/trading/order-lifecycle).

The only onchain actions that are publicly visible are:
- **Deposits** into Silhouette
- **Withdrawals** from Silhouette

Between those two events, the mapping from individual orders, fills, and balances to the user is not exposed. Delegated-wallet activity on Hyperliquid is visible, but it aggregates flow from all Silhouette users and is not attributable to any one of them.

## 5. Withdraw Anytime

When you are ready to withdraw, you withdraw from Silhouette through your wallet like any other DeFi application. Your funds return to your address on HyperCore. Withdrawals are processed promptly with no waiting period.

## What the Public Ledger Sees

When trading shielded on Silhouette, the public ledger distinguishes between what is attributable to the user and what is not:

| Attributable to the user's wallet | Not attributable to the user |
|---|---|
| Deposits into Silhouette | Individual orders and fills (visible as delegated-wallet activity, but with no onchain mapping back to the user) |
| Withdrawals from Silhouette | Balances inside Silhouette |
| | Strategy and intent |

Delegated-wallet fills are publicly visible on Hyperliquid. Silhouette's privacy model is unlinkability: the anonymity set is all Silhouette users routing through the same delegated wallets. As more users trade through Silhouette, the difficulty of attributing any given fill to any given user increases.

## Rationale

On a transparent ledger, orders placed from a known wallet are publicly attributable at the point of placement. Copy-trading bots can mirror the position, front-runners can extract value from the execution path, and wallet-tracking accounts can broadcast the activity to followers. Shielded execution addresses these costs by routing orders through a TEE that settles on Hyperliquid via delegated wallets. The fills remain visible on Hyperliquid, but the mapping from a given fill to a specific user is not exposed, while execution still occurs against the same order book, prices, and liquidity.

<TechArticleSchema
  headline="How Silhouette Works: Deposit, Shielded Execution, Settlement"
  description="Learn how Silhouette works - from deposit to shielded execution to settlement on Hyperliquid. Same order book, same liquidity, fully private."
  proficiencyLevel="Intermediate"
  keywords={[
    "shielded trading",
    "Hyperliquid trading",
    "shielded execution",
    "TEE",
    "trade privacy",
    "Silhouette Exchange",
    "decentralized exchange",
  ]}
/>
