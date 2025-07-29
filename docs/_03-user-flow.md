---
title: User Flow
sidebar_label: User Flow
pagination_label: User Flow
slug: /user-flow
---

TODO this will probably be screenshots of the site, not much here for now

To place a trade on Silhouette, you first need to deposit tokens into the platform. This ensures that trading actions are separate from balance updates, preventing others from inferring when trades are placed. Once you have an active balance on Silhouette, you can submit trades to the Silhouette order book. When you submit a trade, you can define an `expiry` timestamp. This timestamp is a deadline for your order to be filled in the trading pool; after the timestamp has passed, the order is filled on the Hyperliquid L1. See [Matching Engine](/docs/trading/matching-engine) for more details.

Once a trade has been filled, you can withdraw the resulting tokens or continue to place more trades on Silhouette.
