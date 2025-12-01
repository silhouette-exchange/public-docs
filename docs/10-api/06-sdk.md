---
title: Python SDK
sidebar_label: Python SDK
slug: /api/sdk
---

:::warning
The Silhouette API is currently in beta and under active development on testnet. More operations and features will be added soon.
:::

The official Python SDK provides a convenient way to interact with the Silhouette API.

## Installation

```bash
pip install silhouette-python-sdk
```

The package is available on [PyPI](https://pypi.org/project/silhouette-python-sdk/).

## Quick start

```python
from silhouette import SilhouetteApiClient

# Initialise the client with your private key
client = SilhouetteApiClient(
    base_url="https://api.silhouette.exchange",
    private_key="your_private_key_here",
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

- [GitHub repository](https://github.com/silhouette-exchange/silhouette-python-sdk)
- [API reference](/docs/api/reference) for all available operations
- [Authentication](/docs/api/authentication) for details on the SIWE authentication flow
