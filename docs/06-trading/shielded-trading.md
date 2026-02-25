---
title: Shielded Trading
sidebar_label: Shielded Trading
pagination_label: Shielded Trading
---

Silhouette's trading mechanism involves users depositing funds into a wallet. This wallet processes and executes trades based on instructions received from the Silhouette TEE (Trusted Execution Environment), which are in turn initiated by the user.

Crucially, user funds can only be managed via the user's original wallet. The Silhouette system is designed to only process orders originating from the user's wallet, meaning it has no direct control over the user's funds without explicit instructions.

Trades are executed directly on the Hyperliquid orderbook using the Silhouette wallet. Upon trade completion, user balances are encrypted within a smart contract. This smart contract is essential for our Sovereign Withdrawal feature, as it ensures access to funds even if the Silhouette system is unavailable.

<img src="/img/shielded-trading-diagram.png" alt="Shielded Trading" />

## Why Trade Shielded?

The system is the first step toward a fully fledged execution engine that can directly integrate with Hyperliquid order books. 

The current version enables a series of use cases: 
- User trades are shielded by the wallet's total trading volume, with higher volume making individual activity harder to isolate.
- Silhouette wallets will soon get lower fees. We are working with partners to make Silhouette the cheapest venue to buy HYPE. More on this soon
- The TEE is a conduit for users' intents on Hyperliquid while always maintaining funds are controlled by the users.

With all the above in mind, soon HIP-3 deployers, Spot buyers and [Spot Equities](https://x.com/WaynesWorldza/status/2016110304858427619?s=20) buyers will be able to discretely accumulate the required HYPE and other spot assets at the best possible price anywhere. This will be complimented with customisable policy engines for all your compliance needs.
