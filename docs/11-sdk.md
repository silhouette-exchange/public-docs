---
id: sdk
title: Python SDK
sidebar_label: Python SDK
slug: /sdk
description: "Official Python SDK for Silhouette - build trading bots and automate shielded trading on Hyperliquid."
keywords:
  - Python SDK
  - Silhouette API
  - Hyperliquid API
  - trading API
  - shielded trading
  - programmatic trading
  - DeFi API
---

:::warning
The Silhouette API and SDK are in beta and under active development. More operations and features will be added.
:::

The official Python SDK lets you trade programmatically while keeping your strategy, size, and intent private. Build trading bots or automate strategies - all with shielded execution.

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
