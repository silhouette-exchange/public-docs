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

<!-- DOCS_REWRITE: updated shielded order semantics to match current IOC delegated-order behavior -->
Silhouette currently exposes market and limit order entry in the UI. In [naked](/trading/naked-trading) mode, orders route directly to Hyperliquid. In [shielded](/trading/shielded-trading) mode, the live spot flow submits delegated IOC orders, so shielded orders do not rest on the public book.

## Market Orders

A market order is the fastest way to request immediate execution. In naked mode, it routes directly to Hyperliquid. In the current shielded flow, the client derives a price cap from your slippage settings and submits the order as a delegated IOC.

**Use market orders when:**
- Speed of execution matters more than price precision
- You want immediate entry or exit from a position
- The asset has sufficient liquidity that slippage is minimal

**How it works with shielded trading:** The webapp computes a price cap for your market-intent order and submits it to the TEE. The TEE then places a delegated IoC (Immediate or Cancel) order on Hyperliquid. If enough liquidity is available within that price cap, it fills immediately; otherwise the unfilled portion cancels.

## Limit Orders

A limit order executes at your specified price or better. You set the asset, the size, and the price you are willing to pay (or receive).

**Use limit orders when:**
- You want to control the exact price of your execution
- You are willing to wait for the market to come to you
- You want to set a buy below or sell above the current market price

**How it works with shielded trading:** In the current live flow, shielded limit orders are also submitted as delegated IoC orders. They are price-capped at your chosen limit price, and any unfilled remainder cancels rather than resting indefinitely.

## Coming Soon

Silhouette is building towards a full suite of order types, each benefiting from [shielded execution](/trading/shielded-trading):

- **TWAP (Time-Weighted Average Price)**: Break large orders into optimized slices executed over time. Accumulate or distribute positions without leaving a visible footprint.
- **VWAP (Volume-Weighted Average Price)**: Execute orders proportionally to market volume, minimizing market impact.
- **RFQ (Request for Quote)**: Connect with market makers for block-sized trades with competitive pricing, all within the shielded environment.

Each new order type extends the shielded layer to more trading strategies, reinforcing the same principle: same order book, same liquidity, without showing your hand.

For a detailed breakdown of how orders move through the system, see [Order Lifecycle](/trading/order-lifecycle).
