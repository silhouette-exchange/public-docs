---
title: Shielded Trading
sidebar_label: Shielded Trading
pagination_label: Shielded Trading
description: "Shielded trading keeps your orders, identity, and strategy private while you trade on Hyperliquid's full order book. Spot markets live, perpetuals on the roadmap."
keywords:
  - shielded trading
  - Silhouette Exchange
  - DeFi privacy
  - private trading
  - shielded execution
  - Hyperliquid
  - crypto trading
---

# Shielded Trading

Shielded trading on Silhouette keeps your orders inside a secure execution environment and settles them on Hyperliquid through delegated wallets. The market can see delegated-wallet executions, but it does not get a direct mapping back to your wallet, size, or strategy.

## How It Works

When you place a shielded order, it is routed to Silhouette's Trusted Execution Environment (TEE) - a secure, isolated computing environment hosted on AWS Nitro Enclaves. The TEE processes your order and executes it on Hyperliquid's order book through delegated wallets - agent wallets controlled by the TEE that aggregate volume from multiple users. Individual activity is obscured within the wallet's total volume.

After execution, Silhouette updates your shielded account state and reports the result back to the app through authenticated API responses and events. Trade data remains private to each user. Data inside the TEE is inaccessible to the Silhouette team.

## What Stays Private

| What the public sees | What stays private |
|---|---|
| Your deposit to Silhouette | Your individual orders |
| Your withdrawal from Silhouette | Your fill prices and sizes |
| Aggregate volume from delegated wallets | Your balance inside Silhouette |
| | Your strategy and intent |

## Supported Markets

Shielded trading currently supports **spot markets** on Hyperliquid. Shielded perpetuals are on the roadmap.

| Token | Description | Markets |
|-------|-------------|---------|
| <img src="/img/tokens/usdc.png" className="token-icon" alt="" /> USDC | USD Coin | Base pair |
| <img src="/img/tokens/hype.png" className="token-icon" alt="" /> HYPE | Hyperliquid | HYPE/USDC, HYPE/USDH |
| <img src="/img/tokens/usdh.jpg" className="token-icon" alt="" /> USDH | Hyperliquid Dollar | USDH/USDC |
| <img src="/img/tokens/btc.png" className="token-icon" alt="" /> BTC | Bitcoin | UBTC/USDC, UBTC/USDH |
| <img src="/img/tokens/eth.png" className="token-icon" alt="" /> ETH | Ethereum | UETH/USDC, UETH/USDH |
| <img src="/img/tokens/sol.png" className="token-icon" alt="" /> SOL | Solana | USOL/USDC |
| <img src="/img/tokens/zec.png" className="token-icon" alt="" /> ZEC | Zcash | UZEC/USDC |
| <img src="/img/tokens/usdt.svg" className="token-icon" alt="" /> USDT | Tether | USDT0/USDC |
| <img src="/img/tokens/fart.svg" className="token-icon" alt="" /> FART | Fartcoin | UFART/USDC |
| <img src="/img/tokens/pump.svg" className="token-icon" alt="" /> PUMP | Pump Fun | UPUMP/USDC |
| <img src="/img/tokens/usde.svg" className="token-icon" alt="" /> USDe | Ethena USDe | USDE/USDC |
| <img src="/img/tokens/purr.svg" className="token-icon" alt="" /> PURR | Purr | PURR/USDC |
| <img src="/img/tokens/xaut.svg" className="token-icon" alt="" /> XAUT | Tether Gold | XAUT0/USDC |
| <img src="/img/tokens/kntq.svg" className="token-icon" alt="" /> KNTQ | Kinetiq | KNTQ/USDH |
| <img src="/img/tokens/khype.svg" className="token-icon" alt="" /> KHYPE | Kinetiq Staked HYPE | KHYPE/USDH |

Additional pairs are added as Hyperliquid's spot market offering expands.

<figure className="screenshot-figure">
<img src="/img/app-screenshots/ShieldedMarketsSelector.png" alt="Shielded markets asset selector showing available spot pairs" className="app-screenshot app-screenshot--wide" />
<figcaption className="screenshot-caption">Select the asset selector in the top-left of the trading terminal to browse available shielded spot markets</figcaption>
</figure>

## Order Types

### Market Orders

Market orders are live in shielded mode. The webapp computes a price cap from your slippage settings and submits the order to the TEE as a delegated IoC (Immediate or Cancel). If enough liquidity is available within that price cap, it fills immediately; otherwise the unfilled portion cancels.

<div className="screenshot-pair">
<figure className="screenshot-figure">
<img src="/img/app-screenshots/shielded_SpotMarketOrder_BUY.png" alt="Shielded spot market buy order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Shielded spot market buy</figcaption>
</figure>
<figure className="screenshot-figure">
<img src="/img/app-screenshots/shielded_SpotMarketOrder_SELL.png" alt="Shielded spot market sell order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Shielded spot market sell</figcaption>
</figure>
</div>

### Limit Orders - Coming Soon

Shielded limit orders are in development. In the current flow, shielded orders are submitted as delegated IoC orders, so they do not rest on the public book. Resting shielded limits will allow you to set your price and wait for the market to come to you, without revealing your intent.

### Advanced Orders - Coming Soon

TWAP, Scale, and VWAP order types are planned for shielded mode. Each will extend the shielded layer to more trading strategies - same order book, same liquidity, without showing your hand.

### Request for Quote (RFQ) - Coming Soon

RFQ will allow traders to request block-sized quotes from market makers within the shielded environment. This is designed for large orders where direct market execution would create significant impact. RFQ will be the first [KYC-gated](/compliance#kyc-gated-features) feature on Silhouette, ensuring verified counterparties on both sides.

### Shielded Binary Outcomes (HIP-4) - Coming Soon

Silhouette plans to support shielded execution for Hyperliquid's HIP-4 binary outcome markets. This will let you take positions on binary events without revealing your conviction or size to other market participants.

## Why Trade Shielded

Every trade you place on a transparent ledger is information. That information has value - and right now, you are giving it away for free.

- **Accumulate without signalling.** Buy HYPE for staking, HIP-3 deployment, or portfolio building without the market front-running your intent.
- **Protect your strategy.** Your research, your thesis, your timing - these are your intellectual property. Shielded execution keeps them yours.
- **Eliminate the watchers.** Copy-trading bots, whale trackers, and signal-aware LPs cannot extract value from trades they cannot see.
- **Trade at scale.** Large orders move markets when they are visible. Shielded execution lets you trade size without market impact signalling.

Compare shielded trading with [naked trading](/trading/naked-trading) to understand when each mode is appropriate. For the full order flow, see [Order Lifecycle](/trading/order-lifecycle). For fee details, see [Fees](/trading/fees).
