---
title: Request for Quote (RFQ) - Coming Soon
sidebar_label: Request for Quote (RFQ)
pagination_label: Request for Quote (RFQ)
slug: /trading/shielded/rfq
description: "Shielded Request for Quote (RFQ) on Silhouette will let traders request block-sized quotes from market makers inside the shielded environment."
keywords:
  - shielded RFQ
  - Request for Quote
  - block trade
  - KYC
  - Silhouette Exchange
  - Hyperliquid
---

# Request for Quote (RFQ)

:::info Coming soon
Shielded RFQ is in development. This page describes the planned behaviour.
:::

## What it is

RFQ will allow traders to request block-sized quotes from market makers within the shielded environment. This is designed for large orders where direct market execution would create significant impact.

RFQ will be the first [KYC-gated](/compliance#kyc-gated-features) feature on Silhouette, ensuring verified counterparties on both sides.

## How it fits

Spot, RFQ, and [Binary Outcomes (HIP-4)](/trading/shielded/binary-outcomes) are the three shielded products. Each runs through the same TEE-attested execution layer, each is a distinct venue.

- [Shielded Spot](/trading/shielded-trading) - order book execution for standard order sizes.
- **RFQ** - quote-driven execution for block sizes that would cause significant market impact if routed to the order book.
- [Binary Outcomes (HIP-4)](/trading/shielded/binary-outcomes) - shielded execution on binary event markets.
