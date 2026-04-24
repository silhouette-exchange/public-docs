---
title: Custody & Settlement
sidebar_label: Custody & Settlement
pagination_label: Custody & Settlement
description: "How Silhouette manages custody through TEE-controlled delegated wallets and settles shielded trades on Hyperliquid's HyperCore order book."
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

<!-- DOCS_REWRITE: updated custody wording to reflect the current live contract role -->
Deposits to Silhouette enter Silhouette's custody flow on Hyperliquid. The [TEE](/architecture/tee) manages shielded execution and account state. The TEE is an isolated computing environment that processes user instructions without exposing individual account activity to external observers.

## How Settlement Works

All trades on Silhouette settle on Hyperliquid's order book. When you place a shielded order:

1. Your order enters the TEE
2. The TEE matches and executes the trade on Hyperliquid
3. Silhouette records the resulting account updates inside the shielded service
4. The trade settles on Hyperliquid's order book

Onchain, trades appear as activity from Silhouette's delegated-wallet address. The fills are visible, but the mapping from a given fill to an individual user is not exposed on the public ledger.

## Deposits and Withdrawals

**Deposits**: When you deposit, your funds move from your wallet to Silhouette's address on Hyperliquid. The TEE credits your shielded balance.

**Withdrawals**: When you withdraw, the TEE debits your shielded balance and sends funds from Silhouette's address back to your wallet. Withdrawals are processed promptly with no waiting period.

## Trust Model

Using Silhouette in shielded mode involves trust in:

- **The TEE** - an isolated environment that processes orders and manages account state
- **Hyperliquid's infrastructure** - the settlement layer for all trades

The TEE does not expose balance or trading activity to external parties because execution is hardware-isolated. For the full TEE architecture, see [Trusted Execution Environment](/architecture/tee).

For an overview of how all components fit together, see [Architecture Overview](/architecture/overview).

<TechArticleSchema
  headline="Custody and Settlement on Silhouette"
  description="How Silhouette manages custody through TEE-controlled delegated wallets and settles shielded trades on Hyperliquid's HyperCore order book."
  proficiencyLevel="Intermediate"
  keywords={['custody', 'settlement', 'Silhouette Exchange', 'Hyperliquid', 'TEE', 'shielded trading']}
/>
