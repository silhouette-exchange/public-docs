---
id: faq
title: FAQs
sidebar_label: FAQs
pagination_label: FAQs
description: "Find answers to common questions about Silhouette - shielded trading on Hyperliquid, security, funds, withdrawals, and supported markets."
keywords:
  - FAQ
  - shielded trading
  - Hyperliquid API
  - Silhouette API
  - DeFi API
  - trading API
  - SIWE authentication
---

# Frequently Asked Questions

## General

### What Is Silhouette?

Silhouette is shielded trading on Hyperliquid. We give you the ability to trade on Hyperliquid's order book without exposing your strategy, size, or intent. Your trades settle on the same order book, with the same liquidity - the difference is that no one sees you coming.

### Is Silhouette a Separate Exchange?

No. Every trade on Silhouette settles on Hyperliquid. We are not a separate venue with separate liquidity. We are a shielded route to the same order book everyone else uses.

### Is Silhouette a Mixer?

No. Mixers enable private transactions between two addresses to obfuscate the movement of funds. Silhouette only permits deposits and withdrawals from the same address. We are an obfuscation system - we hide order and balance data, while deposits and withdrawals remain visible on HyperCore.

### Is Silhouette Just an Off-Chain Orderbook?

No. Silhouette is a matching and execution engine that leverages Hyperliquid for settlement. All trades execute against Hyperliquid's order book, providing deeper liquidity than a standalone off-chain orderbook could offer. Hyperliquid is the settlement layer - the net result of all trades on Silhouette flows through Hyperliquid.

### What Is the Difference Between Obfuscation and Mixing?

Obfuscation hides trade and order data from outsiders. Mixing prevents traceability of funds by intertwining multiple users' funds. Silhouette is an **obfuscation** system - we aim to hide order and balance data while deposits and withdrawals remain open on HyperCore.

## Trading

### What Trading Modes Are Available?

Two modes: **shielded** and **naked**. Shielded routes your orders through Silhouette's secure execution environment, hiding your activity from the public ledger. Naked routes directly to Hyperliquid, fully visible. You choose on every trade.

### What Markets Are Supported?

Shielded trading currently supports **spot markets** on Hyperliquid. Naked trading supports both **spot and perpetuals**. Shielded perpetuals are on the roadmap.

### What Order Types Are Supported?

Market and limit orders are supported in naked mode, and market orders are supported in shielded mode. Shielded limit orders, TWAPs, VWAPs, and RFQs are on the roadmap.

### How Does Silhouette Handle Latency?

Silhouette's primary constraint is the time between fast blocks on the HyperEVM, which is currently 1 second. Order processing within the TEE adds minimal overhead. Shielded trades settle on Hyperliquid within seconds.

### Are There Fees?

Silhouette is currently in **Open Beta with zero fees**. A tiered fee structure based on trading volume is planned. See the [Fees](/trading/fees) page for details.

## Security and Trust

### How Does Silhouette Integrate With HyperCore and the HyperEVM?

Silhouette's system comprises delegated wallets on HyperCore and a TEE. The TEE interacts with HyperCore for state management, deposits/withdrawals, and order settlement.

### Can the Silhouette Team See My Trades?
No. Your orders are processed inside a Trusted Execution Environment (TEE) - a hardware-isolated computing environment that no one can access, including the Silhouette team.

### What Happens if Silhouette Goes Offline?

Your funds are managed within Silhouette's secure environment. Your trading activity and balances remain private, visible only to you.

### How Can I Verify the System Is Running the Correct Code?

Silhouette's TEE runs in AWS Nitro Enclaves, which produce cryptographic attestation documents signed by the Nitro Hypervisor. These documents include a PCR0 hash that uniquely identifies the exact code running inside the enclave. When Silhouette open sources the enclave code, anyone will be able to rebuild it, reproduce the PCR0, and verify it against the running attestation.

### Can Someone Front-Run My Shielded Orders?

No. Your shielded orders are processed inside the TEE, where they are invisible to everyone - including bots, MEV searchers, and copy-trading services. The only point where a trade becomes visible is when it executes on Hyperliquid through a delegated wallet, at which point it is already filled.

## Funds and Withdrawals

### Where Are My Funds Held?
Funds are stored within Silhouette's secure environment on Hyperliquid. The Silhouette team cannot see your balances or trading activity.

### How Do I Withdraw?

Initiate a withdrawal through the Silhouette UI. Your funds return to your wallet on HyperCore. No waiting period, no approval process. See the [Withdraw](/onboarding/withdraw) page for a step-by-step guide. You can also withdraw programmatically using the [API](/api/reference).

### What if I Clear My Browser Data?

If you clear your browser data, you may need to reconnect your wallet and re-authenticate your session. Your deposited balance is not deleted by clearing local browser storage.

### How Do I Provide Feedback?

Click the **FEEDBACK** button at the bottom right of the Silhouette app to report bugs or request features. You can also reach us on [Telegram](https://t.me/silhouette_exchange) or [X (Twitter)](https://x.com/silhouette_ex).
