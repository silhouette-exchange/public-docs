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

Silhouette is built directly on Hyperliquid - the highest-performance decentralised exchange in crypto. Every shielded trade settles on Hyperliquid's order book. Understanding how Hyperliquid works helps explain why Silhouette is built the way it is.

## One Blockchain, Two Components

Hyperliquid is a single blockchain with two execution environments: **HyperCore** and **HyperEVM**. They share a single global ledger state, secured by [HyperBFT](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview#consensus) consensus. One set of validators produces one chain of blocks that may contain transactions from both components.

> *"The Hyperliquid blockchain features two key parts: HyperCore and HyperEVM. The HyperEVM is not a separate chain, but rather, secured by the same HyperBFT consensus as HyperCore. This lets the HyperEVM interact directly with parts of HyperCore, such as spot and perp order books."* - [Hyperliquid Docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm)

### HyperCore

The high-performance trading engine. Purpose-built for financial primitives with sub-millisecond execution. This is where Hyperliquid's spot and perpetuals order books live, and where Silhouette's shielded trades ultimately settle.

HyperCore blocks are included approximately every **70ms**, supporting around 200,000 orders per second.

## Why Hyperliquid

Silhouette is built on Hyperliquid because it is the best execution venue in DeFi:

- **Deepest liquidity**: More volume than any other decentralized exchange
- **Fastest execution**: Sub-second finality on HyperCore
- **Builder Codes**: A native framework for building execution infrastructure on top of Hyperliquid's order book

Silhouette does not compete with Hyperliquid. We extend it. Every trade on Silhouette is a trade on Hyperliquid - just with a shielded route to get there.

For a full picture of how Silhouette's components interact with Hyperliquid, see [Architecture Overview](/architecture/overview). To understand the role of the [TEE](/architecture/tee) in executing trades, see [Trusted Execution Environments](/architecture/tee).
