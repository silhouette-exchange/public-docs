---
title: Custody & Settlement
sidebar_label: Custody & Settlement
pagination_label: Custody & Settlement
description: "Learn how Silhouette manages custody and settles trades on Hyperliquid."
keywords:
  - custody
  - settlement
  - Silhouette Exchange
  - Hyperliquid
  - TEE
  - shielded trading
---

# Custody & Settlement

:::info For All Users
This page covers fund custody and settlement mechanics. Essential reading for institutions evaluating Silhouette's security model.
:::

Silhouette manages user funds within a secure environment powered by a Trusted Execution Environment (TEE). This page explains how custody works and how trades settle on Hyperliquid.

## Custody Model

When you deposit into Silhouette, your funds are held in Silhouette's address on Hyperliquid. The [TEE](/architecture/tee) manages these funds on your behalf, tracking your encrypted balance internally and executing trades against Hyperliquid's order book.

The TEE is an isolated computing environment that processes your instructions while keeping your activity private. Your balance is encrypted - only you can decrypt it using a key stored locally in your browser.

## How Settlement Works

All trades on Silhouette settle on Hyperliquid's order book. When you place a shielded order:

1. Your order enters the TEE
2. The TEE matches and executes the trade on Hyperliquid
3. Your encrypted balance is updated within the TEE
4. The trade settles on Hyperliquid's order book

From the outside, trades appear as activity from Silhouette's address. Individual users and their positions are not visible onchain.

## Deposits and Withdrawals

**Deposits**: When you deposit, your funds move from your wallet to Silhouette's address on Hyperliquid. The TEE credits your encrypted balance.

**Withdrawals**: When you withdraw, the TEE debits your encrypted balance and sends funds from Silhouette's address back to your wallet. Withdrawals are processed promptly with no waiting period.

## Trust Model

When using Silhouette's shielded mode, you trust:

- **The TEE** - an isolated environment that processes your trades privately
- **Hyperliquid's infrastructure** - where all trades ultimately settle
- **Your local encryption key** - which only you control

The TEE cannot expose your balance or trading activity because it operates in an isolated environment. For more on how the TEE works, see [Trusted Execution Environment](/architecture/tee).

For an overview of how all components fit together, see [Architecture Overview](/architecture/overview).
