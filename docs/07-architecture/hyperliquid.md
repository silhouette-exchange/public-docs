---
title: Hyperliquid Integration
sidebar_label: Hyperliquid
pagination_label: Hyperliquid
description: "Learn how Silhouette integrates with Hyperliquid's HyperCore and HyperEVM to deliver shielded trading with deep liquidity and fast execution."
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

Silhouette is built directly on Hyperliquid - the highest-performance decentralized exchange in crypto. Every shielded trade settles on Hyperliquid's order book. Understanding how Hyperliquid works helps explain why Silhouette is built the way it is.

## One Blockchain, Two Components

Hyperliquid is a single blockchain with two execution environments: **HyperCore** and **HyperEVM**. They share a single global ledger state, secured by [HyperBFT](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview#consensus) consensus. One set of validators produces one chain of blocks that may contain transactions from both components.

> *"The Hyperliquid blockchain features two key parts: HyperCore and HyperEVM. The HyperEVM is not a separate chain, but rather, secured by the same HyperBFT consensus as HyperCore. This lets the HyperEVM interact directly with parts of HyperCore, such as spot and perp order books."* - [Hyperliquid Docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm)

### HyperCore

The high-performance trading engine. Purpose-built for financial primitives with sub-millisecond execution. This is where Hyperliquid's spot and perpetuals order books live, and where Silhouette's shielded trades ultimately settle.

HyperCore blocks are included approximately every **70ms**, supporting around 200,000 orders per second.

### HyperEVM

<!-- DOCS_REWRITE: updated HyperEVM description to match the live contract role -->
The Ethereum Virtual Machine-compatible layer. This is where smart contracts run, including the [Silhouette smart contract](/architecture/smart-contract) used in Silhouette's custody and withdrawal flow.

HyperEVM has two block types to serve different needs:
- **Fast blocks**: 1-second duration with a 2M gas limit - for user-facing transactions
- **Large blocks**: 1-minute duration with a 30M gas limit - for builder and infrastructure operations

## How Silhouette Uses Both Components

Silhouette leverages the unique architecture of Hyperliquid by operating across both components:

| Component | Silhouette's Use |
|---|---|
| **HyperCore** | Trade execution - shielded orders settle on the spot and perps order books |
| **HyperEVM** | Fund custody and withdrawal flow - the [smart contract](/architecture/smart-contract) provides Silhouette's onchain contract component |

Because HyperCore and HyperEVM share a single ledger state, assets can move directly between them. This enables Silhouette to hold funds on the EVM (where smart contract logic provides security guarantees) while settling trades on HyperCore (where the order book provides liquidity and execution speed).

## Why Hyperliquid

Silhouette is built on Hyperliquid because it is the best execution venue in DeFi:

- **Deepest liquidity**: More volume than any other decentralized exchange
- **Fastest execution**: Sub-second finality on HyperCore
- **Native EVM**: Smart contract capabilities without bridging to a separate chain
- **Builder Codes**: A native framework for building execution infrastructure on top of Hyperliquid's order book
- **Unified state**: Seamless flows between EVM smart contracts and the core order book

Silhouette does not compete with Hyperliquid. We extend it. Every trade on Silhouette is a trade on Hyperliquid - just with a shielded route to get there.

For a full picture of how Silhouette's components interact with Hyperliquid, see [Architecture Overview](/architecture/overview). To understand the role of the [TEE](/architecture/tee) in executing trades, see [Trusted Execution Environments](/architecture/tee).
