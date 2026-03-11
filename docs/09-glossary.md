---
id: glossary
title: Glossary
sidebar_label: Glossary
pagination_label: Glossary
slug: /glossary
description: "Comprehensive glossary of technical terms used in Silhouette documentation, covering shielded trading, TEE, HyperCore, and DeFi concepts."
keywords:
  - glossary
  - shielded trading
  - Hyperliquid API
  - Silhouette API
  - DeFi API
  - trading API
  - programmatic trading
---

# Glossary

Technical terms used throughout Silhouette documentation.

---

## A

**Agent Wallet**
See Delegated Wallet.

**Attestation**
Cryptographic proof, signed by the hardware platform, that verifies the exact code running inside a Trusted Execution Environment. Used to prove computational integrity without trusting the operator.

---

## B

**Builder Codes**
Hyperliquid's native framework that allows third-party applications to place trades on the Hyperliquid order book. Silhouette uses Builder Codes for naked trading.

---

## D

**Delegated Wallet**
Fresh Hyperliquid wallets used by Silhouette's TEE to execute shielded trades on HyperCore. Aggregate activity from multiple users, obscuring individual trader identity during settlement.

---

## E

**Encrypted Balance**
Your balance inside Silhouette, stored as encrypted data within the TEE. Only decryptable by you using your local encryption key.

**Encryption Key**
A key generated and stored locally in your browser that shields your balances and trading activity from all parties except you. The private component never leaves your browser.

---

## H

**HyperBFT**
Consensus mechanism securing the Hyperliquid blockchain, covering both HyperCore and HyperEVM.

**HyperCore**
The high-performance trading engine of Hyperliquid. Purpose-built for financial primitives with sub-millisecond execution. This is where Silhouette's shielded trades settle.

**HyperEVM**
The Ethereum Virtual Machine-compatible layer of Hyperliquid. Supports smart contracts and decentralized applications.

---

## I

**Immediate or Cancel (IoC)**
Order type used when Silhouette submits shielded trades to Hyperliquid. The order either executes immediately or cancels - no resting orders are left on the book.

---

## M

**Matching Engine**
The system inside Silhouette's TEE that processes and matches shielded orders according to price-time priority rules.

---

## N

**Naked Trading**
Trading on Silhouette with full public visibility. Orders route directly to Hyperliquid via Builder Codes, identical to any other Hyperliquid frontend.

**Net Settlement**
A design where only the final net result of trading activity is reflected onchain, rather than individual trades. Reduces onchain footprint and strengthens confidentiality.

---

## O

**Order Book**
The list of buy and sell orders for a trading pair on Hyperliquid. Silhouette's shielded trades execute against this same order book.

---

## P

**PCR0**
Platform Configuration Register 0. A SHA-384 hash of the Enclave Image File that uniquely identifies the exact code running inside an AWS Nitro Enclave.

---

## S

**Settlement**
The final execution and clearing of trades on Hyperliquid's order book. For shielded trades, settlement occurs through delegated wallets.

**Shielded Trading**
Trading on Silhouette where your orders are processed inside the TEE and executed via delegated wallets. Your identity, size, and intent are hidden from the public ledger.

---

## T

**TEE (Trusted Execution Environment)**
A secure, hardware-isolated computing environment that enables confidential computation. Silhouette uses AWS Nitro Enclaves. No one - including the Silhouette team and the cloud provider - can access data inside the TEE.

**Transparency Tax**
The cost traders pay because their activity is visible on a public ledger. Includes losses from front-running, copy trading, liquidation hunting, and strategy decay.

---

> This documentation is for informational purposes only and does not constitute financial advice.
