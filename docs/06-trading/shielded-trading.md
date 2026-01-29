---
title: Shielded Trading
sidebar_label: Shielded Trading
pagination_label: Shielded Trading
---

## What is Shielded Trading on Silhouette?

Shielded Trading on Silhouette provides full order privacy. Trades are hidden within the Silhouette Heimdall TEE. Silhouette’s matching engine runs inside Heimdall, a private environment that ensures orders are matched securely and secretly. Trade data remains private to each user; data inside Heimdall is inaccessible to the Silhouette team. Processing trades internally and only creating Hypercore transactions for deposits and withdrawals ensures maximal privacy with CEX-like efficiency. The only user transactions with publicly visible amounts when using Shielded Trading are deposits and withdrawals to and from Silhouette. Once a user has deposited, trades update a user’s encrypted balance on the Silhouette smart contract without revealing balances.


> *Note: This describes the planned implementation, not the current one.*


## What is currently available on Silhouette?

Shielded Level 1, also known as **delegated trading**, places orders on behalf of users via agent wallets controlled by Silhouette. When delegated trades are filled, the user's encrypted balance in Silhouette is updated. Delegated trades are placed as IoC (immediate or cancel) orders on Hyperliquid, so there are no resting orders or pending states. This allows traders to tap into Hyperliquid’s deep order book without publicly broadcasting their alpha - trades are anonymised, shielding trading strategies.