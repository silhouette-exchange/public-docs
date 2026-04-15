---
title: Shielded Trading
sidebar_label: Shielded Trading
pagination_label: Shielded Trading
description: "Shielded trading keeps your orders, identity, and strategy private while you trade on Hyperliquid's full order book. Spot markets live, perpetuals on the roadmap."
keywords:
  - shielded trading
  - Silhouette Exchange
  - DeFi privacy
  - private trading
  - shielded execution
  - Hyperliquid
  - crypto trading
---

# Shielded Trading

Shielded trading on Silhouette keeps your orders inside a secure execution environment and settles them on Hyperliquid through delegated wallets. The market can see delegated-wallet executions, but it does not get a direct mapping back to your wallet, size, or strategy.

## How It Works

When you place a shielded order, it is routed to Silhouette's Trusted Execution Environment (TEE) - a secure, isolated computing environment hosted on AWS Nitro Enclaves. The TEE processes your order and executes it on Hyperliquid's order book through delegated wallets - agent wallets controlled by the TEE that aggregate volume from multiple users. Individual activity is obscured within the wallet's total volume.

After execution, Silhouette updates your shielded account state and reports the result back to the app through authenticated API responses and events. Trade data remains private to each user. Data inside the TEE is inaccessible to the Silhouette team.

## What Stays Private

| What the public sees | What stays private |
|---|---|
| Your deposit to Silhouette | Your individual orders |
| Your withdrawal from Silhouette | Your fill prices and sizes |
| Aggregate volume from delegated wallets | Your balance inside Silhouette |
| | Your strategy and intent |

<img src="/img/app-screenshots/balances-panel.png" alt="Balances panel showing shielded spot holdings" className="app-screenshot app-screenshot--md" />

## Supported Markets

| Market | Status |
|--------|--------|
| Spot | Live |
| Perpetuals | On the roadmap |

<img src="/img/app-screenshots/ShieldedMarketsSelector.png" alt="Shielded markets asset selector showing available spot pairs" className="app-screenshot app-screenshot--sm" />

## Order Types

### Market Orders

Market orders are live in shielded mode. The webapp computes a price cap from your slippage settings and submits the order to the TEE as a delegated IoC (Immediate or Cancel). If enough liquidity is available within that price cap, it fills immediately; otherwise the unfilled portion cancels.

<div className="screenshot-pair">
<figure className="screenshot-figure">
<img src="/img/app-screenshots/shielded_SpotMarketOrder_BUY.png" alt="Shielded spot market buy order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Shielded spot market buy</figcaption>
</figure>
<figure className="screenshot-figure">
<img src="/img/app-screenshots/shielded_SpotMarketOrder_SELL.png" alt="Shielded spot market sell order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Shielded spot market sell</figcaption>
</figure>
</div>

### Limit Orders - Coming Soon

Shielded limit orders are in development. In the current flow, shielded orders are submitted as delegated IoC orders, so they do not rest on the public book. Resting shielded limits will allow you to set your price and wait for the market to come to you, without revealing your intent.

### Advanced Orders - Coming Soon

TWAP, Scale, VWAP, and RFQ order types are planned for shielded mode. Each will extend the shielded layer to more trading strategies - same order book, same liquidity, without showing your hand.

## Why Trade Shielded

Every trade you place on a transparent ledger is information. That information has value - and right now, you are giving it away for free.

- **Accumulate without signalling.** Buy HYPE for staking, HIP-3 deployment, or portfolio building without the market front-running your intent.
- **Protect your strategy.** Your research, your thesis, your timing - these are your intellectual property. Shielded execution keeps them yours.
- **Eliminate the watchers.** Copy-trading bots, whale trackers, and signal-aware LPs cannot extract value from trades they cannot see.
- **Trade at scale.** Large orders move markets when they are visible. Shielded execution lets you trade size without market impact signalling.

Compare shielded trading with [naked trading](/trading/naked-trading) to understand when each mode is appropriate. For the full order flow, see [Order Lifecycle](/trading/order-lifecycle). For fee details, see [Fees](/trading/fees).
