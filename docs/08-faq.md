---
title: Community FAQs
sidebar_label: FAQ
pagination_label: FAQ
slug: /faq
---

## FAQs ✍️

 ### How does Silhouette integrate with HyperCore and the HyperEVM?

The Silhouette system is comprised of a smart contract, smart wallets, and a TEE (Trusted Execution Environment) that connect together to enable private trading. The TEE interacts with the smart contracts and HyperCore for state management, deposits/withdrawals, and order settlement.

### Is Silhouette a mixer?

No. Mixers enable private transactions between two different addresses to obfuscate the movement of funds. Silhouette only permits deposits and withdrawals from the same address.

 ### What is the difference between shielding and mixing? What is Silhouette doing?

Shielding hides trade and order data from outsiders. Mixing prevents traceability of funds by intertwining the funds of multiple users and different addresses. Silhouette is a shielding system, since it only aims to hide order and balance data, while deposits and withdrawals remain "open" on HyperCore.

 ### What is the difference between Naked and Shielded trading?

**Naked** - This means trading on Hyperliquid with no privacy/shielding of transactions. Your trades are in the open and visible for all to see. When Silhouette’s product is in “Naked” mode, the front end is simply a UI for Hyperlquid.

**Shielded** - This means trades are routed to the TEE (Trusted Execution Environment).

 ### Is Silhouette just an off-chain orderbook?

Silhouette is a matching and privacy engine that contains a built-in orderbook, along with privacy-enhancing mechanisms to protect users' trades. It leverages the Hyperliquid blockchain for settlement, providing more liquidity access than a standalone off-chain orderbook. 
    
In order for Silhouette to work as designed, we need an underlying settlement chain. This is the Hyperliquid. The net result of all trades on Silhouette go through Hyperliquid.
    
 ### Does Silhouette Custody assets?

No Silhouette will never custody assets but will make use of Hyperliquid’s API (Agent) wallets. For more information on how this works read here: [Nonces and API wallets](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets?q=agent%20wallet&scope=current#api-wallets).

The user retains full control through their primary wallet. Instructions flow one way: from the user's wallet to the Agent wallet, and from the Agent wallet to Silhouette's system. At no point can Silhouette initiate actions without authorization from the user's controlling key. 

### How do I know I’m connecting to the real enclave?

Clients verify an attestation bound to the enclave’s code measurement and keys, then complete a one round-trip handshake to establish a secure channel. If the attestation or PCRs do not match what is registered onchain, the session is rejected.

### What happens if my order is too big for the private book?

We support flexible settlement. Orders can settle entirely in Silhouette, partially on Hyperliquid, or fully on Hyperliquid when advantageous, preserving as much privacy as possible while guaranteeing fills.

### How do I get access to the closed beta?
Join the waitlist [here](https://silhouette.exchange/).