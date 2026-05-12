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
  - Silhouette Exchange
  - Hyperliquid
  - TEE
  - DeFi terminology
  - HyperCore
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
A hardware-isolated computing environment that enables confidential computation. Silhouette uses AWS Nitro Enclaves. Data inside the enclave is not readable by the Silhouette team or the cloud provider.

**Transparency Tax**
Aggregate execution cost attributable to public-ledger visibility of trading activity, including front-running, copy trading, liquidation hunting, and strategy decay.

---

> This documentation is for informational purposes only and does not constitute financial advice.

<TechArticleSchema
  headline="Silhouette Glossary"
  description="Comprehensive glossary of technical terms used in Silhouette documentation, covering shielded trading, TEE, HyperCore, and DeFi concepts."
  proficiencyLevel="Beginner"
  keywords={['glossary', 'shielded trading', 'Silhouette Exchange', 'Hyperliquid', 'TEE', 'DeFi terminology']}
/>

<DefinedTermSetSchema
  name="Silhouette Glossary"
  description="Comprehensive glossary of technical terms used in Silhouette documentation, covering shielded trading, TEE, HyperCore, and DeFi concepts."
  pagePath="/glossary"
  terms={[
    {
      term: 'Agent Wallet',
      anchor: 'agent-wallet',
      description: 'See Delegated Wallet.',
    },
    {
      term: 'Attestation',
      anchor: 'attestation',
      description:
        'Cryptographic proof, signed by the hardware platform, that verifies the exact code running inside a Trusted Execution Environment. Used to prove computational integrity without trusting the operator.',
    },
    {
      term: 'Builder Codes',
      anchor: 'builder-codes',
      description:
        "Hyperliquid's native framework that allows third-party applications to place trades on the Hyperliquid order book. Silhouette uses Builder Codes for naked trading.",
    },
    {
      term: 'Delegated Wallet',
      anchor: 'delegated-wallet',
      description:
        "Fresh Hyperliquid wallets used by Silhouette's TEE to execute shielded trades on HyperCore. Aggregate activity from multiple users, obscuring individual trader identity during settlement.",
    },
    {
      term: 'HyperBFT',
      anchor: 'hyperbft',
      description:
        'Consensus mechanism securing the Hyperliquid blockchain, covering both HyperCore and HyperEVM.',
    },
    {
      term: 'HyperCore',
      anchor: 'hypercore',
      description:
        "The high-performance trading engine of Hyperliquid. Purpose-built for financial primitives with sub-millisecond execution. This is where Silhouette's shielded trades settle.",
    },
    {
      term: 'HyperEVM',
      anchor: 'hyperevm',
      description:
        'The Ethereum Virtual Machine-compatible layer of Hyperliquid. Supports smart contracts and decentralized applications.',
    },
    {
      term: 'Immediate or Cancel (IoC)',
      anchor: 'immediate-or-cancel-ioc',
      description:
        'Order type used when Silhouette submits shielded trades to Hyperliquid. The order either executes immediately or cancels, no resting orders are left on the book.',
    },
    {
      term: 'Matching Engine',
      anchor: 'matching-engine',
      description:
        "The system inside Silhouette's TEE that processes and matches shielded orders according to price-time priority rules.",
    },
    {
      term: 'Naked Trading',
      anchor: 'naked-trading',
      description:
        'Trading on Silhouette with full public visibility. Orders route directly to Hyperliquid via Builder Codes, identical to any other Hyperliquid frontend.',
    },
    {
      term: 'Net Settlement',
      anchor: 'net-settlement',
      description:
        'A design where only the final net result of trading activity is reflected onchain, rather than individual trades. Reduces onchain footprint and strengthens confidentiality.',
    },
    {
      term: 'Order Book',
      anchor: 'order-book',
      description:
        "The list of buy and sell orders for a trading pair on Hyperliquid. Silhouette's shielded trades execute against this same order book.",
    },
    {
      term: 'PCR0',
      anchor: 'pcr0',
      description:
        'Platform Configuration Register 0. A SHA-384 hash of the Enclave Image File that uniquely identifies the exact code running inside an AWS Nitro Enclave.',
    },
    {
      term: 'Settlement',
      anchor: 'settlement',
      description:
        "The final execution and clearing of trades on Hyperliquid's order book. For shielded trades, settlement occurs through delegated wallets.",
    },
    {
      term: 'Shielded Trading',
      anchor: 'shielded-trading',
      description:
        'Trading on Silhouette where your orders are processed inside the TEE and executed via delegated wallets. Your identity, size, and intent are hidden from the public ledger.',
    },
    {
      term: 'TEE (Trusted Execution Environment)',
      anchor: 'tee-trusted-execution-environment',
      description:
        'A hardware-isolated computing environment that enables confidential computation. Silhouette uses AWS Nitro Enclaves. Data inside the enclave is not readable by the Silhouette team or the cloud provider.',
    },
    {
      term: 'Transparency Tax',
      anchor: 'transparency-tax',
      description:
        'Aggregate execution cost attributable to public-ledger visibility of trading activity, including front-running, copy trading, liquidation hunting, and strategy decay.',
    },
  ]}
/>
