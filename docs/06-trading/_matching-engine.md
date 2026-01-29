---
title: Matching Engine
sidebar_label: Matching Engine
pagination_label: Matching Engine
---
Like Hyperliquid, Silhouette matches orders using price-time priority. Each time a new order is placed, the matching engine updates all existing orders. Following standard order book practice, orders are matched at the price of the **sell** order. For example, if a buy order for HYPE with a limit price of 25 USDC matches with a sell order with a limit price of 20 USDC, both orders will receive the equivalent of 20 USDC.

Orders may be partially filled. A HYPE buy order worth 30 USDC can match against two sell orders worth 20 USDC and 7 USDC, leaving a remaining balance of 3 USDC until it is filled. This partial matching also follows price-time priority: the buy order will match with the lowest-priced sell orders first. If two orders have the same price, the oldest order will be filled first.

## Settlement on HyperCore
When a user places an order, it remains in the order book until it is fully filled **or** the order's specified `expiry` timestamp passes. Once this timestamp is passed, the remaining balance is filled on the Hyperliquid L1. To maximise privacy, Silhouette aggregates all orders being settled in each order book update and places the order via a fresh Hyperliquid [agent wallet](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets). For example, when an order is placed at timestamp 5 and two orders with expiry timestamps 3 and 4 are unfilled, a new agent wallet will execute a trade for the combined unfilled amount.
