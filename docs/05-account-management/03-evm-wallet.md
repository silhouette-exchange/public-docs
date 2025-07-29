---
title: EVM Wallets
sidebar_label: EVM Wallets
pagination_label: EVM Wallets
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

There are certain functions that only the EVM wallet can perform, namely:
- Deposits
- Update encryption key

The remaining functions can be performed by both the EVM and Managed Wallets:
- Create an order
- Cancel an order
- Update (create or replace) the Managed Wallet
- Withdraw

<ThemedImage
  alt="EVM Diagram"
  sources={{
    light: useBaseUrl('/img/evm-light.svg'),
    dark: useBaseUrl('/img/evm-dark.svg'),
  }}
/>
