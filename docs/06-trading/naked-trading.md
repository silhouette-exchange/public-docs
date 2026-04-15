---
title: Naked Trading
sidebar_label: Naked Trading
pagination_label: Naked Trading
description: "Naked trading on Silhouette routes orders directly to Hyperliquid via Builder Codes. Full visibility, full order type support across spot and perpetuals."
keywords:
  - naked trading
  - Silhouette Exchange
  - Hyperliquid
  - market order
  - limit order
  - TWAP
  - scale order
  - perpetuals
  - spot trading
---

# Naked Trading

Naked trading on Silhouette routes your orders directly to Hyperliquid via [Builder Codes](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes). Your trades are fully visible on the public ledger - the same experience as any other Hyperliquid frontend.

## How It Works

When you select naked mode, your order bypasses Silhouette's [shielded execution](/trading/shielded-trading) environment and goes straight to Hyperliquid's order book. Your wallet address, order size, and intent are all visible onchain.

Both **spot** and **perpetuals** markets are supported in naked mode.

## When to Trade Naked

Visibility is not always a disadvantage. There are times when you want the market to see what you are doing:

- **Signalling conviction.** A large, visible buy can communicate confidence to the market.
- **Perpetuals trading.** Shielded perps are on the roadmap but not yet live. Naked mode gives you access to Hyperliquid's full perpetuals market today.
- **Low-stakes trades.** If the size or asset does not warrant confidentiality, naked trading is simpler and equally effective.
- **Building a public track record.** Some traders want their performance visible and verifiable onchain.

## Supported Markets

| Market | Status |
|--------|--------|
| Spot | Live |
| Perpetuals | Live |

## Order Types

### Market Orders

A market order requests immediate execution at the best available price. Your order routes directly to Hyperliquid's order book.

<div className="screenshot-pair">
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_SpotMarketOrder_BUY.png" alt="Naked spot market buy order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Spot market order</figcaption>
</figure>
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_PerpsMarket_LONG.png" alt="Naked perpetuals market long order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Perps market order</figcaption>
</figure>
</div>

### Limit Orders

A limit order executes at your specified price or better. You set the asset, the size, and the price you are willing to pay or receive. Limit orders rest on the book until filled or cancelled.

<div className="screenshot-pair">
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_SpotLimitOrder_BUY.png" alt="Naked spot limit buy order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Spot limit order</figcaption>
</figure>
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_PerpsLimit_LONG.png" alt="Naked perpetuals limit long order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Perps limit order</figcaption>
</figure>
</div>

### Advanced Order Types

#### TWAP (Time-Weighted Average Price)

Break large orders into optimized slices executed over time. Accumulate or distribute positions without leaving a visible footprint.

<div className="screenshot-pair">
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_SpotTWAP_BUY.png" alt="Naked spot TWAP buy order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Spot TWAP order</figcaption>
</figure>
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_PerpsTWAP_LONG.png" alt="Naked perpetuals TWAP long order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Perps TWAP order</figcaption>
</figure>
</div>

#### Scale Orders

Distribute your order across a price range with customizable distribution, allowing you to ladder into or out of positions gradually.

<div className="screenshot-pair">
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_SpotSCALE_BUY.png" alt="Naked spot scale buy order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Spot scale order</figcaption>
</figure>
<figure className="screenshot-figure">
<img src="/img/app-screenshots/naked_PerpsSCALE_LONG.png" alt="Naked perpetuals scale long order" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Perps scale order</figcaption>
</figure>
</div>

## Naked vs Shielded

The choice between naked and shielded is available on every trade. You can place a [shielded spot order](/trading/shielded-trading) and follow it with a naked perps order in the same session.

The question is simple: does this trade benefit from confidentiality? If yes, trade [shielded](/trading/shielded-trading). If not, trade naked.

To understand the full flow of how orders move through the system, see [Order Lifecycle](/trading/order-lifecycle). For fee details, see [Fees](/trading/fees).
