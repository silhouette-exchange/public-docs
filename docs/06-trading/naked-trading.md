---
title: Naked Trading
sidebar_label: Naked Trading
pagination_label: Naked Trading
description: "Understand naked trading on Silhouette Exchange - fully visible trades routed to Hyperliquid via Builder Codes for perpetuals and public execution."
keywords:
  - naked trading
  - Silhouette Exchange
  - Hyperliquid
  - crypto trading
  - shielded vs naked
  - DeFi privacy
  - private trading
---

# Naked Trading

Naked trading on Silhouette routes your orders directly to Hyperliquid via [Builder Codes](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes). Your trades are fully visible on the public ledger - the same experience as any other Hyperliquid frontend.

## How It Works

When you select naked mode, your order bypasses Silhouette's [shielded execution](/trading/shielded-trading) environment and goes straight to Hyperliquid's order book. Your wallet address, order size, and intent are all visible onchain, exactly as they would be if you were trading directly on Hyperliquid.

Perpetuals and spot markets are both supported via naked trading.

## When to Trade Naked

Naked trading exists because visibility is not always a disadvantage. There are times when you want the market to see what you are doing:

- **Signalling conviction.** A large, visible buy can communicate confidence to the market. Sometimes you want the signal.
- **Perpetuals trading.** Shielded perps are on the roadmap but not yet live. Naked mode gives you access to Hyperliquid's full perpetuals market today.
- **Low-stakes trades.** If the size or asset does not warrant confidentiality, naked trading is simpler and equally effective.
- **Building a public track record.** Some traders want their performance to be visible and verifiable onchain.

## Naked vs Shielded

The choice between naked and shielded is available on every trade. There is no commitment to one mode. You can place a [shielded spot order](/trading/shielded-trading) and follow it with a naked perps order in the same session.

The question is simple: does this trade benefit from confidentiality? If yes, trade shielded. If no, trade naked.

Most traders who try both modes quickly develop an intuition for when each is appropriate. The important thing is that the choice exists. On every other Hyperliquid frontend, you are trading naked by default, with no alternative. On Silhouette, naked is a conscious decision - not the only option.

To understand the full flow of how orders move through the system, see [Order Lifecycle](/trading/order-lifecycle).
