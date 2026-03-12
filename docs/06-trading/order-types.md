---
title: Order Types
sidebar_label: Order Types
pagination_label: Order Types
description: "Explore the order types available on Silhouette Exchange, including market and limit orders for shielded and naked trading on Hyperliquid."
keywords:
  - order types
  - limit order
  - market order
  - Silhouette Exchange
  - shielded trading
  - shielded execution
  - Hyperliquid
---

# Order Types

Silhouette currently supports two order types for both [shielded](/trading/shielded-trading) and [naked](/trading/naked-trading) trading. Additional order types - including TWAP, VWAP, and RFQ - are on the roadmap.

## Market Orders

A market order executes immediately at the best available price on Hyperliquid's order book. You specify the asset and the size. The system fills your order at the current market price.

**Use market orders when:**
- Speed of execution matters more than price precision
- You want immediate entry or exit from a position
- The asset has sufficient liquidity that slippage is minimal

**How it works with shielded trading:** Your market order is processed in the TEE and submitted to Hyperliquid as an IoC (Immediate or Cancel) order through a delegated wallet. It fills against the live order book at the best available price, with your identity obscured.

## Limit Orders

A limit order executes at your specified price or better. You set the asset, the size, and the price you are willing to pay (or receive). The order only fills when the market reaches your price.

**Use limit orders when:**
- You want to control the exact price of your execution
- You are willing to wait for the market to come to you
- You want to set a buy below or sell above the current market price

**How it works with shielded trading:** Your limit order is held in the TEE until the market reaches your specified price. When conditions are met, the order is submitted to Hyperliquid through a delegated wallet at your limit price or better.

## Coming Soon

Silhouette is building towards a full suite of order types, each benefiting from [shielded execution](/trading/shielded-trading):

- **TWAP (Time-Weighted Average Price)**: Break large orders into optimized slices executed over time. Accumulate or distribute positions without leaving a visible footprint.
- **VWAP (Volume-Weighted Average Price)**: Execute orders proportionally to market volume, minimizing market impact.
- **RFQ (Request for Quote)**: Connect with market makers for block-sized trades with competitive pricing, all within the shielded environment.

Each new order type extends the shielded layer to more trading strategies, reinforcing the same principle: same order book, same liquidity, without showing your hand.

For a detailed breakdown of how orders move through the system, see [Order Lifecycle](/trading/order-lifecycle).
