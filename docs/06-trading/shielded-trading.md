---
title: Shielded Trading
sidebar_label: Shielded Trading
pagination_label: Shielded Trading
description: "Shielded trading keeps your orders, identity, and strategy private while you trade on Hyperliquid's full order book."
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

When you place a shielded order, it is routed to Silhouette's Trusted Execution Environment (TEE) - a secure, isolated computing environment hosted on AWS Nitro Enclaves. The TEE runs Silhouette's matching engine in a private environment that ensures orders are processed securely and confidentially. Trade data remains private to each user. Data inside the TEE is inaccessible to the Silhouette team.

The TEE processes your order and executes it on Hyperliquid's order book through delegated wallets - agent wallets controlled by the TEE that aggregate volume from multiple users. Individual activity is obscured within the wallet's total volume, shielding your trading strategies.

<!-- DOCS_REWRITE: removed stale encrypted-balance claims and aligned with live account-state behavior -->
After execution, Silhouette updates your shielded account state and reports the result back to the app through authenticated API responses and events.

## What Is Currently Live

The current implementation of shielded trading on Silhouette works as follows:

- The TEE places orders on Hyperliquid via agent wallets it controls
- All orders execute as IoC (Immediate or Cancel), with no resting orders or pending states
- Market-intent orders are submitted with a client-derived price cap
- When trades fill, Silhouette updates your shielded account balances and order state
- You access Hyperliquid's full order book depth without broadcasting your identity

This allows you to trade on the deepest liquidity in DeFi without publicly broadcasting your alpha. Your trades are anonymized, shielding your strategies from copy-trading bots, front-runners, and whale trackers.

## What Stays Private

| What the public sees | What stays private |
|---|---|
| Your deposit to Silhouette | Your individual orders |
| Your withdrawal from Silhouette | Your fill prices and sizes |
| Aggregate volume from delegated wallets | Your balance inside Silhouette |
| | Your strategy and intent |

Once you have deposited, shielded trades update your account state inside Silhouette without creating a direct public link between delegated-wallet executions and your wallet.

## Supported Markets

Shielded trading currently supports **spot markets** on Hyperliquid. We are building shielded perpetuals, TWAP, VWAP, and RFQ [order types](/trading/order-types).

## Why Trade Shielded

Every trade you place on a transparent ledger is information. That information has value - and right now, you are giving it away for free.

- **Accumulate without signalling.** Buy HYPE for staking, HIP-3 deployment, or portfolio building without the market front-running your intent.
- **Protect your strategy.** Your research, your thesis, your timing - these are your intellectual property. Shielded execution keeps them yours.
- **Eliminate the watchers.** Copy-trading bots, whale trackers, and MEV searchers cannot extract value from trades they cannot see.
- **Trade at scale.** Large orders move markets when they are visible. Shielded execution lets you trade size without market impact signalling.

Compare shielded trading with [naked trading](/trading/naked-trading) to understand when each mode is appropriate. Ready to get started? See [Start Trading](/onboarding/start-trading).
