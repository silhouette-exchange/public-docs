---
title: Community FAQs
sidebar_label: FAQ
pagination_label: FAQ
slug: /faq
---

### How does Silhouette integrate with HyperCore and the HyperEVM?

The Silhouette system is comprised of a smart contract, smart wallets, and a TEE that connect together to enable private trading. The TEE interacts with the smart contracts and HyperCore for state management, deposits/withdrawals, and order settlement.

### What is the difference between obfuscation and mixing? What is Silhouette doing?

Obfuscation hides trade and order data from outsiders. Mixing prevents traceability of funds by intertwining the funds of multiple users. Silhouette is an **obfuscation** system, since it only aims to hide order and balance data, while deposits and withdrawals remain "open" on HyperCore.

### Is Silhouette just an off-chain orderbook?

Silhouette is a matching and privacy engine that contains a built-in orderbook, along with privacy-enhancing mechanisms to protect users' trades. It leverages the Hyperliquid blockchain for settlement, providing more liquidity access than a standalone off-chain orderbook.

In order for Silhouette to work as designed, we need an underlying settlement chain. This is the Hyperliquid. The net result of all trades on Silhouette go through Hyperliquid

### Is Silhouette a mixer?

No. Mixers enable private transactions between two addresses to obfuscate the movement of funds. Silhouette only permits deposits and withdrawals from the same address.

### How does Silhouette address latency by composing it with the challenge of the EVM? What is the latency for trades performed on Silhouette?

Silhouette's primary constraint is the time between fast blocks on the HyperEVM, which is currently 1 second.