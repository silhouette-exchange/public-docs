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

Public visibility is appropriate in several cases:

- **Public signalling.** A visible buy or sell communicates intent onchain and can be used deliberately as a signal.
- **Perpetuals.** Shielded perpetuals are not yet available. Naked mode supports Hyperliquid's full perpetuals market today.
- **Small orders.** Orders that do not require confidentiality can be routed directly to Hyperliquid without the TEE execution path.
- **Public track record.** Trades routed in naked mode are recorded onchain and attributable to the user's wallet, producing a verifiable trading history.

## Supported Markets

Naked mode routes directly to Hyperliquid via Builder Codes. You have access to the full Hyperliquid market set - every spot pair and perpetual contract available on Hyperliquid is tradeable through Silhouette in naked mode.

- **Spot**: All [spot pairs](https://app.hyperliquid.xyz/trade) listed on Hyperliquid
- **Perpetuals**: All 100+ [perpetual contracts](https://app.hyperliquid.xyz/trade) listed on Hyperliquid

Markets update automatically as Hyperliquid adds new listings.

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

Break a large order into smaller suborders executed over a configured duration. In naked mode, each suborder is visible onchain as it executes.

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

Distribute an order across a configured price range. The distribution across the range is adjustable, supporting laddered entries and exits.

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

Mode is selected per trade. A [shielded spot order](/trading/shielded-trading) can be placed in the same session as a naked perps order. Shielded is appropriate when a trade requires confidentiality; naked is appropriate otherwise.

To understand the full flow of how orders move through the system, see [Order Lifecycle](/trading/order-lifecycle). For fee details, see [Fees](/trading/fees).

<TechArticleSchema
  headline="Naked Trading on Silhouette Exchange"
  description="Naked trading on Silhouette routes orders directly to Hyperliquid via Builder Codes. Full visibility, full order type support across spot and perpetuals."
  proficiencyLevel="Intermediate"
  keywords={['naked trading', 'Silhouette Exchange', 'Hyperliquid', 'market order', 'limit order', 'TWAP', 'perpetuals']}
/>
