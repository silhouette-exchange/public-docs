---
title: Community FAQs
sidebar_label: FAQ
pagination_label: FAQ
slug: /faq
---

## FAQs ✍️

### How does Silhouette integrate with HyperCore and the HyperEVM?

The Silhouette system comprises a smart contract, smart wallets, and a TEE (Trusted Execution Environment) that work together to enable private trading. The TEE interacts with the smart contracts and HyperCore for state management, deposits/withdrawals, and order settlement.

### Is Silhouette a mixer?

No. Mixers enable private transactions between two different addresses to obfuscate the movement of funds. Silhouette only permits deposits and withdrawals from the same address.

 ### What is the difference between shielding and mixing? What does Silhouette do?

Shielding hides trade and order data from outsiders. Mixing prevents traceability of funds by intertwining the funds of multiple users and addresses. Silhouette is a shielding system because it hides order and balance data, while deposits and withdrawals remain open on HyperCore.

 ### What is the difference between Naked and Shielded trading?

 **Naked** - This means trading on Hyperliquid with no privacy or shielding of transactions. Your trades are in the open and visible to all. When Silhouette’s product is in “Naked” mode, the frontend is simply a UI for Hyperliquid.

**Shielded** - This means trades are routed to the TEE (Trusted Execution Environment).

 ### Is Silhouette just an off-chain order book?

Silhouette is a matching and privacy engine that contains a built-in order book, along with privacy-enhancing mechanisms to protect users' trades. It leverages the Hyperliquid blockchain for settlement, providing more access to liquidity than a standalone off-chain order book. 
    
Silhouette relies on Hyperliquid as the underlying settlement chain. The net result of all trades on Silhouette settles on Hyperliquid.
    
 ### Does Silhouette custody assets?

No. Silhouette will never custody assets, but it will make use of Hyperliquid’s API (Agent) wallets. For more information on how this works, see: [Nonces and API wallets](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets?q=agent%20wallet&scope=current#api-wallets).

The user retains full control through their primary wallet. Instructions flow one way: from the user's wallet to the Agent wallet, and from the Agent wallet to Silhouette's system. At no point can Silhouette initiate actions without authorization from the user's controlling key. 

### How do I know I’m connecting to the real enclave?

Clients verify an attestation bound to the enclave’s code measurement and keys, then complete a one round-trip handshake to establish a secure channel. If the attestation or PCRs do not match what is registered on-chain, the session is rejected.

### What happens if my order is too big for the private book?

We support flexible settlement. Orders can settle entirely in Silhouette, partially on Hyperliquid, or fully on Hyperliquid when advantageous, preserving as much privacy as possible while guaranteeing fills.

### How do I get access to the closed beta?
Join the waitlist [here](https://silhouette.exchange/).