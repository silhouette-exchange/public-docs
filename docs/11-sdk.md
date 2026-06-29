---
id: sdk
title: Python SDK
sidebar_label: Python SDK
slug: /sdk
description: "Official Python SDK for the Silhouette API, providing programmatic access to shielded trading on Hyperliquid."
keywords:
  - Python SDK
  - Silhouette API
  - Hyperliquid API
  - trading API
  - shielded trading
  - programmatic trading
  - DeFi API
---

The official Python SDK provides programmatic access to the Silhouette API. All requests route through shielded execution, so strategy, size, and intent are not attributable to the user's wallet on the public orderbook.

## Installation

```bash
pip install silhouette-python-sdk
```

The package is available on [PyPI](https://pypi.org/project/silhouette-python-sdk/).

## Quick Start

```python
import os
from silhouette import SilhouetteApiClient

# Initialize the client with your private key
# Never hardcode your private key - use environment variables
client = SilhouetteApiClient(
    base_url="https://api.silhouette.exchange",
    private_key=os.environ["SILHOUETTE_PRIVATE_KEY"],
    auto_auth=True,
)

# Check your balances
balances = client.user.get_balances()
print(balances)

# Place an order
order = client.order.create_order(
    side="buy",
    order_type="limit",
    base_token="HYPE",
    quote_token="USDC",
    amount="1.0",
    price="0.001",
)
print(f"Order placed: {order['orderId']}")
```

## Resources

- [PyPI package](https://pypi.org/project/silhouette-python-sdk/)
- [API Reference](/api/reference) - All available operations
- [Authentication](/api/authentication) - Details on the SIWE authentication flow
- [Quick Start](/api/quick-start) - Set up prerequisites and make your first API call
- [Troubleshooting](/api/troubleshooting) - Common errors and solutions
- [OpenAPI Specification](/api/openapi) - Generate typed clients in other languages

<TechArticleSchema
  headline="Silhouette Python SDK"
  description="Official Python SDK for Silhouette - build trading bots and automate shielded trading on Hyperliquid."
  proficiencyLevel="Advanced"
  keywords={['Python SDK', 'Silhouette API', 'Hyperliquid API', 'trading API', 'shielded trading']}
/>
