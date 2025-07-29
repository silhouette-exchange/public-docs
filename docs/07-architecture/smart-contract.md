---
title: Smart Contracts
sidebar_label: Smart Contracts
pagination_label: Smart Contracts
---
A smart contract on the HyperEVM serves as the ground truth for the current state of the Silhouette protocol. The contract stores the encrypted state for the Silhouette protocol. This includes user balances and the state of all orders in the order book. The contract also serves as the entry point for all actions on Silhouette: actions such as depositing, placing orders, and withdrawing are performed on the EVM by supplying the required encrypted data. Silhouette's secure enclave monitors the EVM for these transactions to maintain and update its internal decrypted state.


## Allowlist
Any user may deposit into the Silhouette MVP. However, only users on the allowlist will receive onboarding gas and are able to place orders.
