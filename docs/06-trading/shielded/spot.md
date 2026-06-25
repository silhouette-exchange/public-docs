---
title: Shielded Spot Trading
sidebar_label: Spot
pagination_label: Shielded Spot Trading
slug: /trading/shielded-trading
description: "Shielded spot trading keeps your orders, identity, and strategy private while you trade on Hyperliquid's full spot order book."
keywords:
  - shielded spot trading
  - shielded trading
  - shielded limit order
  - Silhouette Exchange
  - DeFi privacy
  - private trading
  - shielded execution
  - Hyperliquid
  - crypto trading
---

# Shielded Spot Trading

## What is shielded spot trading?

Shielded spot trading routes orders through Silhouette's Trusted Execution Environment (TEE) and settles them on Hyperliquid through delegated wallets. Delegated-wallet fills are publicly visible, but the mapping from a given fill to an individual user's wallet is not exposed on the public ledger.

## What Stays Private

| What the public sees | What stays private |
|---|---|
| Your deposit to Silhouette | Your individual orders |
| Your withdrawal from Silhouette | Your fill prices and sizes |
| Aggregate volume from delegated wallets | Your balance inside Silhouette |
| | Your strategy and intent |

## Supported Markets

Shielded spot trading is live across Hyperliquid's spot order book. Shielded perpetuals are on the roadmap.

| Token | Description | Markets |
|-------|-------------|---------|
| <img src="/img/tokens/usdc.png" className="token-icon" alt="USDC token icon" /> USDC | USD Coin | Base pair |
| <img src="/img/tokens/hype.png" className="token-icon" alt="HYPE token icon" /> HYPE | Hyperliquid | HYPE/USDC, HYPE/USDH |
| <img src="/img/tokens/usdh.jpg" className="token-icon" alt="USDH token icon" /> USDH | Hyperliquid Dollar | USDH/USDC |
| <img src="/img/tokens/btc.png" className="token-icon" alt="BTC token icon" /> BTC | Bitcoin | UBTC/USDC, UBTC/USDH |
| <img src="/img/tokens/eth.png" className="token-icon" alt="ETH token icon" /> ETH | Ethereum | UETH/USDC, UETH/USDH |
| <img src="/img/tokens/sol.png" className="token-icon" alt="SOL token icon" /> SOL | Solana | USOL/USDC |
| <img src="/img/tokens/zec.png" className="token-icon" alt="ZEC token icon" /> ZEC | Zcash | UZEC/USDC |
| <img src="/img/tokens/usdt.svg" className="token-icon" alt="USDT token icon" /> USDT | Tether | USDT0/USDC |
| <img src="/img/tokens/fart.svg" className="token-icon" alt="FART token icon" /> FART | Fartcoin | UFART/USDC |
| <img src="/img/tokens/pump.svg" className="token-icon" alt="PUMP token icon" /> PUMP | Pump Fun | UPUMP/USDC |
| <img src="/img/tokens/usde.svg" className="token-icon" alt="USDe token icon" /> USDe | Ethena USDe | USDE/USDC |
| <img src="/img/tokens/purr.svg" className="token-icon" alt="PURR token icon" /> PURR | Purr | PURR/USDC |
| <img src="/img/tokens/xaut.svg" className="token-icon" alt="XAUT token icon" /> XAUT | Tether Gold | XAUT0/USDC |
| <img src="/img/tokens/kntq.svg" className="token-icon" alt="KNTQ token icon" /> KNTQ | Kinetiq | KNTQ/USDH |
| <img src="/img/tokens/khype.svg" className="token-icon" alt="KHYPE token icon" /> KHYPE | Kinetiq Staked HYPE | KHYPE/USDH |

Additional pairs are added as Hyperliquid's spot market offering expands.

<figure className="screenshot-figure">
<img src="/img/app-screenshots/ShieldedMarketsSelector.png" alt="Shielded markets asset selector showing available spot pairs" className="app-screenshot app-screenshot--wide" />
<figcaption className="screenshot-caption">Select the asset selector in the top-left of the trading terminal to browse available shielded spot markets</figcaption>
</figure>

## Order Types

### Market Orders

Market orders are live in shielded mode. Hyperliquid has no native market-order primitive - every order on Hyperliquid is a limit order with a time-in-force. A "market" order is a limit order with a slippage-derived price cap and an IoC (Immediate or Cancel) time-in-force. The webapp computes that price cap from your slippage settings, then submits the order to the TEE as a delegated IoC. If enough liquidity is available within the cap, it fills immediately; otherwise the unfilled portion cancels.

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

### Limit Orders

A limit order executes at your specified price or better. You set the asset, size, and the price you are willing to pay or receive, and the order rests until it fills at that price or better, or until you cancel it. Because execution runs through delegated wallets, your price and intent stay private while the order waits on the book.

<div className="screenshot-pair">
<figure className="screenshot-figure">
<img src="/img/app-screenshots/shielded_SpotLimitOrder_BUY.png" alt="Shielded spot limit buy order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Shielded spot limit buy</figcaption>
</figure>
<figure className="screenshot-figure">
<img src="/img/app-screenshots/shielded_SpotLimitOrder_SELL.png" alt="Shielded spot limit sell order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Shielded spot limit sell</figcaption>
</figure>
</div>

### Advanced Orders - Coming Soon

TWAP, Scale, and VWAP order types are planned for shielded mode. These will route through the same Hyperliquid order book and liquidity used by shielded market orders today.

## Use Cases

Orders placed from a known wallet on a public ledger are attributable to that wallet at the point of placement. Shielded execution addresses a specific set of costs that follow from that attribution:

- **Large accumulation.** Buying activity for staking, HIP-3 deployment, or longer-term positioning is not attributable to the user's wallet. This reduces the opportunity for front-running during extended accumulation.
- **Strategy confidentiality.** Order flow that would otherwise reveal research, thesis, or timing is not exposed to onchain observers. Individual fills aggregate into delegated-wallet volume.
- **Resistance to order-flow analysis.** Copy-trading bots, wallet trackers, and signal-aware liquidity providers have no onchain mapping from delegated-wallet fills back to individual users.
- **Size execution.** Large orders that would signal market impact when placed from a known wallet are executed within aggregated delegated-wallet volume.

Compare shielded trading with [naked trading](/trading/naked-trading) for a breakdown of when each mode is appropriate. For the full order flow, see [Order Lifecycle](/trading/order-lifecycle). For fee details, see [Fees](/trading/fees).

<TechArticleSchema
  headline="Shielded Spot Trading on Silhouette Exchange"
  description="Shielded spot trading keeps your orders, identity, and strategy private while you trade on Hyperliquid's full spot order book."
  proficiencyLevel="Intermediate"
  keywords={['shielded spot trading', 'shielded trading', 'Silhouette Exchange', 'DeFi privacy', 'private trading', 'shielded execution', 'Hyperliquid', 'crypto trading']}
/>
