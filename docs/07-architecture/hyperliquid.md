---
title: Hyperliquid Integration
sidebar_label: Hyperliquid
pagination_label: Hyperliquid
description: "Learn how Silhouette integrates with Hyperliquid's HyperCore to deliver shielded trading with deep liquidity and fast execution."
keywords:
  - Hyperliquid
  - HyperEVM
  - shielded trading
  - decentralized exchange
  - DeFi privacy
  - Silhouette Exchange
  - architecture
---

# Hyperliquid Integration

:::info For All Users
This page explains how Silhouette integrates with Hyperliquid. Useful context for understanding performance and settlement, especially for traders familiar with Hyperliquid.
:::

Silhouette is built on Hyperliquid. Every shielded trade settles on Hyperliquid's order book. The sections below describe the parts of Hyperliquid that Silhouette depends on.

## One Blockchain, Two Components

Hyperliquid is a single blockchain with two execution environments: **HyperCore** and **HyperEVM**. They share a single global ledger state, secured by [HyperBFT](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview#consensus) consensus. One set of validators produces one chain of blocks that may contain transactions from both components.

> *"The Hyperliquid blockchain features two key parts: HyperCore and HyperEVM. The HyperEVM is not a separate chain, but rather, secured by the same HyperBFT consensus as HyperCore. This lets the HyperEVM interact directly with parts of HyperCore, such as spot and perp order books."* - [Hyperliquid Docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm)

### HyperCore

Hyperliquid's trading engine. It hosts the spot and perpetuals order books and is the settlement layer for Silhouette's shielded trades.

HyperCore blocks are produced approximately every **70ms** and support throughput of around 200,000 orders per second.

## Integration Dependencies

Silhouette depends on three properties of Hyperliquid:

- **Liquidity.** Hyperliquid's spot and perpetuals order books supply the fills for both shielded and naked orders on Silhouette.
- **Block time.** HyperCore blocks are produced every ~70ms, which supports the latency profile required for order-book execution through the TEE.
- **Builder Codes.** The native framework through which Silhouette registers as an execution integrator on top of Hyperliquid's order book.

Silhouette is an execution layer on top of Hyperliquid, not an alternative venue. Every trade placed through Silhouette settles on Hyperliquid's order book.

For a full picture of how Silhouette's components interact with Hyperliquid, see [Architecture Overview](/architecture/overview). To understand the role of the [TEE](/architecture/tee) in executing trades, see [Trusted Execution Environments](/architecture/tee).

<TechArticleSchema
  headline="Hyperliquid Integration"
  description="Learn how Silhouette integrates with Hyperliquid's HyperCore to deliver shielded trading with deep liquidity and fast execution."
  proficiencyLevel="Intermediate"
  keywords={['Hyperliquid', 'HyperEVM', 'shielded trading', 'decentralized exchange', 'DeFi privacy', 'Silhouette Exchange']}
/>
