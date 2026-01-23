---
title: Order Details
sidebar_label: Order Details
pagination_label: Order Details
---

# Order Details

Silhouette currently only supports limit orders. 

Orders specify the following:
- `token_pair`: The token pair being traded (e.g. HYPE/USDC).
- `side`: Whether this is a buy or sell order.
- `amount`: The amount of tokens being bought or sold.
- `expiry`: The timestamp after which the order expires in Silhouette's order book. Expired orders are settled on HyperCore in the next batch (see [Matching Engine](matching-engine)).

## Precision
Silhouette follows Hyperliquid's levels of precision for prices and amounts, which are represented by a `uint64` in the smart contract. Token prices may have up to 5 significant figures. Each token on Hyperliquid has a `szDecimals` (for example, ETH has a `szDecimals` of 4). Prices for a specific token can have a maximum of `8 - szDecimals` decimal places. For example, ETH transactions have 5 significant figures and up to 4 decimal places.

`szDecimals` is also the highest number of decimal places when specifying the size of a trade in a token: you can specify ETH amounts up to 4 decimals of precision. See the [Hyperliquid docs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size) for more information.
