---
id: about-silhouette
title: Introduction
sidebar_label: Introduction
pagination_label: Introduction
slug: /about-silhouette
description: "Silhouette is shielded trading on Hyperliquid. Trade on the same order book with full liquidity while keeping your strategy, size, and intent private."
keywords:
  - Silhouette Exchange
  - shielded trading
  - Hyperliquid trading
  - DeFi privacy
  - trade privacy
  - decentralized exchange
  - shielded execution
---

# Introduction

Trades placed on a public ledger are visible to any observer. Copy-trading bots can mirror positions, front-runners can extract value from execution, and wallet-tracking accounts can broadcast activity to their followers. On a transparent venue, strategy, size, and timing become public information.

Silhouette is a shielded execution layer on top of Hyperliquid. Orders route through Silhouette's Trusted Execution Environment (TEE) and settle on Hyperliquid's order book through delegated wallets. Trades access the same liquidity and prices as any other Hyperliquid frontend. Delegated-wallet fills are publicly visible, but they aggregate flow from all Silhouette users; the mapping from any given fill back to an individual user's wallet is not exposed on the public ledger.

## What is Silhouette?

Silhouette is a shielded layer on top of Hyperliquid, not a separate exchange. Every trade settles on Hyperliquid's order book, so orders access the same liquidity as any other Hyperliquid frontend. Silhouette adds confidentiality to execution; it does not replace the underlying infrastructure.

Silhouette supports two modes on a per-trade basis: **Shielded** and **Naked**. Shielded routes the order through Silhouette's TEE, obscuring order details from the public ledger. Naked routes the order directly to Hyperliquid, fully visible, like any builder-code frontend. See [Shielded Trading](/trading/shielded-trading) and [Naked Trading](/trading/naked-trading) for the mechanics of each mode.

## What Makes Silhouette Different

### Same order book, same liquidity

Silhouette does not run a separate liquidity pool. Every shielded and naked trade executes against the full depth of Hyperliquid's order book, preserving Hyperliquid's price discovery.

### Per-trade mode selection

Silhouette supports toggling between Shielded and Naked mode on every order. Traders can select the appropriate mode for each trade based on whether confidentiality is required, without entering a separate venue or fragmenting liquidity.

### Custody and account state

User funds are held in a smart contract on Hyperliquid and managed by Silhouette's TEE. Trading activity and balances are not readable by external parties, including the Silhouette team. For the full architecture, see [Architecture Overview](/architecture/overview) and [Trusted Execution Environments](/architecture/tee).

## The Problem Silhouette Addresses

For onchain financial markets to support institutional participation, there must be a mechanism for confidential execution. Unrestricted transparency into every position at all times exposes legitimate use cases to front-running, copy-trading, and strategic leakage, particularly for entities executing large or directional trades.

Every mature financial market has a mechanism for shielded execution. Dark pools handle over 40% of US equity volume. Block trading desks operate at every major bank. Information barriers are regulatory requirements, not optional features. Adoption of shielded execution in crypto markets is a question of implementation, not demand.

Previous attempts to introduce confidentiality into DeFi fragmented liquidity by moving execution off the primary venue, or lacked the auditability and compliance controls required by regulated entities. Silhouette addresses both constraints: shielded execution settles on the primary Hyperliquid order book, and a compliance layer screens all participants at the point of access.

## Roadmap

Shielded spot is live today. Additional order types are planned, including TWAP, VWAP, RFQ, perpetuals, and prediction markets. Each extends the same shielded execution core to a new order type on Hyperliquid.

## Core Team

The Silhouette team has backgrounds in zero-knowledge cryptography, exchange engineering, and protocol design, with experience across DeFi teams (UMA, Across, Etherfi), infrastructure (AWS), and centralised exchanges (Luno, Coinbase).

<TechArticleSchema
  headline="Silhouette Exchange: Shielded Trading on Hyperliquid"
  description="Silhouette is shielded trading on Hyperliquid. Trade on the same order book with full liquidity while keeping your strategy, size, and intent private."
  proficiencyLevel="Beginner"
  keywords={[
    "Silhouette Exchange",
    "shielded trading",
    "Hyperliquid trading",
    "DeFi privacy",
    "trade privacy",
    "decentralized exchange",
    "shielded execution",
  ]}
/>
