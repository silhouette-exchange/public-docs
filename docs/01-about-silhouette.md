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

## What is Silhouette?

Silhouette is a shielded layer on top of Hyperliquid, not a separate exchange. Every trade settles on Hyperliquid's order book, so orders access the same liquidity as any other Hyperliquid frontend. Silhouette adds confidentiality to execution; it does not replace the underlying infrastructure.

Silhouette supports two modes on a per-trade basis: **Shielded** and **Naked**. Shielded routes the order through Silhouette's TEE, obscuring order details from the public ledger. Naked routes the order directly to Hyperliquid, fully visible, like any builder-code frontend. See [Shielded Trading](/trading/shielded-trading) and [Naked Trading](/trading/naked-trading) for the mechanics of each mode.

## What Makes Silhouette Different

### Net settlement layer

Silhouette is a net settlement layer on Hyperliquid. Orders are processed inside the TEE and submitted to Hyperliquid's order book through delegated wallets shared across Silhouette users. Hyperliquid retains price discovery and full order book depth.

## The Problem Silhouette Addresses

For onchain financial markets to support institutional participation, there must be a mechanism for confidential execution. Unrestricted transparency into every position at all times exposes legitimate use cases to front-running, copy-trading, and strategic leakage, particularly for entities executing large or directional trades.

Previous attempts to introduce confidentiality into DeFi fragmented liquidity by moving execution off the primary venue, or lacked the auditability and compliance controls required by regulated entities. Silhouette addresses both constraints: shielded execution settles on the primary Hyperliquid order book, and a compliance layer screens all participants at the point of access.

## Roadmap

Shielded spot is live today. Additional order types are planned, including TWAP, VWAP, RFQ, perpetuals, and prediction markets. Each extends the same shielded execution core to a new order type on Hyperliquid.

## Core Team

The Silhouette team brings together engineers and researchers from zero-knowledge cryptography, exchange infrastructure, and protocol design. Prior experience spans DeFi protocols, cloud infrastructure, and centralised exchanges.

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
