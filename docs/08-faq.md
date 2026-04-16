---
id: faq
title: FAQs
sidebar_label: FAQs
pagination_label: FAQs
description: "Find answers to common questions about Silhouette - shielded trading on Hyperliquid, security, funds, withdrawals, and supported markets."
keywords:
  - FAQ
  - shielded trading
  - Silhouette Exchange
  - Hyperliquid
  - DeFi privacy
  - shielded execution
  - trading fees
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


## Security and Trust

### How Does Silhouette Integrate With HyperCore?

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

<FAQSchema
  questions={[
    {
      q: "What is Silhouette?",
      a: "Silhouette is shielded trading on Hyperliquid. It gives you the ability to trade on Hyperliquid's order book without exposing your strategy, size, or intent. Trades settle on the same order book with the same liquidity, the difference is that no one sees you coming.",
    },
    {
      q: "Is Silhouette a separate exchange?",
      a: "No. Every trade on Silhouette settles on Hyperliquid. Silhouette is not a separate venue with separate liquidity. It is a shielded route to the same order book everyone else uses.",
    },
    {
      q: "Is Silhouette a mixer?",
      a: "No. Mixers enable private transactions between two addresses to obfuscate the movement of funds. Silhouette only permits deposits and withdrawals from the same address. It hides order and balance data, while deposits and withdrawals remain visible on HyperCore.",
    },
    {
      q: "Is Silhouette just an off-chain orderbook?",
      a: "No. Silhouette is a matching and execution engine that leverages Hyperliquid for settlement. All trades execute against Hyperliquid's order book, providing deeper liquidity than a standalone off-chain orderbook could offer. Hyperliquid remains the settlement layer.",
    },
    {
      q: "What is the difference between obfuscation and mixing?",
      a: "Obfuscation hides trade and order data from outsiders. Mixing prevents traceability of funds by intertwining multiple users' funds. Silhouette is an obfuscation system that hides order and balance data while deposits and withdrawals remain open on HyperCore.",
    },
    {
      q: "What trading modes are available on Silhouette?",
      a: "Two modes: shielded and naked. Shielded routes orders through Silhouette's secure execution environment, hiding activity from the public ledger. Naked routes directly to Hyperliquid and is fully visible. You choose on every trade.",
    },
    {
      q: "What markets are supported on Silhouette?",
      a: "Shielded trading currently supports spot markets on Hyperliquid. Naked trading supports both spot and perpetuals. Shielded perpetuals are on the roadmap.",
    },
    {
      q: "What order types are supported on Silhouette?",
      a: "Market and limit orders are supported in naked mode. Market orders are supported in shielded mode. Shielded limit orders, TWAPs, VWAPs, and RFQs are on the roadmap.",
    },
    {
      q: "How does Silhouette integrate with HyperCore?",
      a: "Silhouette's system comprises delegated wallets on HyperCore and a Trusted Execution Environment. The TEE interacts with HyperCore for state management, deposits and withdrawals, and order settlement.",
    },
    {
      q: "Can the Silhouette team see my trades?",
      a: "No. Orders are processed inside a Trusted Execution Environment, a hardware-isolated computing environment that no one can access, including the Silhouette team. Strategy, size, and intent stay sealed inside the enclave.",
    },
    {
      q: "What happens if Silhouette goes offline?",
      a: "Funds are managed within Silhouette's secure environment on Hyperliquid. Trading activity and balances remain private and visible only to you. Deposits and withdrawals continue to flow through HyperCore when the system is available.",
    },
    {
      q: "How can I verify the Silhouette TEE is running the correct code?",
      a: "Silhouette's TEE runs in AWS Nitro Enclaves, which produce cryptographic attestation documents signed by the Nitro Hypervisor. These include a PCR0 hash that uniquely identifies the exact code running inside the enclave and can be verified against the open-sourced build.",
    },
    {
      q: "Can someone front-run my shielded orders?",
      a: "No. Shielded orders are processed inside the TEE, where they are invisible to everyone including copytrade bots and signaling watchers. The only point where a trade becomes visible is when it executes on Hyperliquid through a delegated wallet, at which point it is already filled.",
    },
    {
      q: "Where are my funds held on Silhouette?",
      a: "Funds are stored within Silhouette's secure environment on Hyperliquid. The Silhouette team cannot see balances or trading activity. Delegated wallets on HyperCore act as the settlement interface between the TEE and the order book.",
    },
    {
      q: "How do I withdraw from Silhouette?",
      a: "Initiate a withdrawal through the Silhouette UI. Funds return to your wallet on HyperCore with no waiting period and no approval process. Programmatic withdrawals are also available through the Silhouette API.",
    },
    {
      q: "What happens if I clear my browser data?",
      a: "If you clear browser data you may need to reconnect your wallet and re-authenticate your session. Your deposited balance is not affected by clearing local browser storage and will still be available when you sign back in.",
    },
  ]}
/>
