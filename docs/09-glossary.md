---
title: Glossary
sidebar_label: Glossary
pagination_label: Glossary
slug: /glossary
---

This reference defines technical terms used throughout Silhouette documentation.

---

## A

**AES-GCM**  
Advanced Encryption Standard with Galois/Counter Mode. Symmetric encryption algorithm that encrypts order details and communications between browser and enclave.

**Agent Wallet**  
Fresh Hyperliquid wallets used to execute aggregated trades on HyperCore. Maximises privacy by obscuring individual trader activity during settlement.

**Allowlist**  
Curated list of users authorised to place orders on Silhouette MVP. Any user may deposit regardless of allowlist status.

**Attestation**  
CBOR-encoded, COSE-signed documents from Nitro Hypervisor that verify the exact code running inside an enclave. Proves computational integrity.

---

## C

**CBOR**  
Concise Binary Object Representation. Encoding format for attestation documents that enables efficient binary serialisation.

**Cipher-text**  
Encrypted data resulting from encryption of plaintext order details. Only decryptable by intended recipients.

**COSE**  
CBOR Object Signing and Encryption. Signing format for attestation documents that ensures authenticity and integrity.

---

## E

**ECDH**  
Elliptic Curve Diffie-Hellman. Key agreement protocol enabling two parties to establish a shared secret over insecure channels.

**EIF**  
Enclave Image File. Contains application and runtime dependencies for deployment to Nitro Enclave. Hash determines PCR0 value.

**Enclave**  
See Trusted Execution Environment (TEE).

**Encryption Key**  
AES symmetric key derived from X25519 key exchange that shields balances and trading activity from all parties except the trader.

**End-to-End Encryption**  
Encryption where only communicating parties (browser and enclave) can decrypt information. No intermediaries have access.

---

## G

**Good Til Cancelled (GTC)**  
Default order type in Silhouette. Remains active until filled, cancelled, or expired.

---

## H

**HKDF**  
HMAC-based Key Derivation Function. Derives encryption keys from X25519 shared secrets for secure communication.

**HyperBFT**  
Consensus mechanism securing the unified Hyperliquid blockchain containing both HyperCore and HyperEVM.

**HyperCore**  
High-performance trading component of Hyperliquid. Purpose-built for financial primitives with sub-millisecond execution.

**HyperEVM**  
Ethereum Virtual Machine-compatible component of Hyperliquid. Supports smart contracts with fast and slow execution blocks.

---

## I

**Immediate or Cancel (IOC)**  
Order type used when Silhouette orders expire and are placed on Hyperliquid exchange. Executes immediately or cancels remainder.

**IndexedDB**  
Browser storage where private encryption keys are stored locally. Namespaced by account address and network ID.

---

## K

**KDF**  
Key Derivation Function. Cryptographic primitive that expands key material into one or more cryptographic keys.

---

## L

**L1**  
Deprecated term for HyperCore. Previously used to refer to the main Hyperliquid blockchain layer where final settlement occurs.

**Limit Order**  
Order to buy or sell at specific price or better. Provides price protection for traders.

---

## M

**Managed Wallet**  
Ephemeral wallet created in trader's browser. Authorised to submit orders on behalf of primary account for frictionless trading.

**Market Order**  
Order to buy or sell immediately at current market price. Prioritises execution speed over price control.

**Matching Engine**  
System that matches buy and sell orders according to price-time priority rules. Runs inside secure enclave.

---

## N

**Nix**  
Deterministic build system used by Silhouette to achieve reproducible builds of enclave code.

**Nonce**  
Number used once in cryptographic operations. Ensures security and prevents replay attacks.

---

## O

**Order Book**  
List of buy and sell orders for trading pair. Maintained privately within secure enclave.

**Order Expiry**  
Timestamp after which order expires in Silhouette's order book and gets settled on HyperCore.

---

## P

**Partial Fill**  
When order is only partially executed, leaving remaining balance to be filled later.

**PCR0**  
Platform Configuration Register 0. SHA-384 hash of enclave image file that definitively identifies exact code running inside Nitro Enclave.

**Perps**  
Perpetual futures contracts. Currently unsupported on Silhouette but available on Hyperliquid.

**Price-Time Priority**  
Matching algorithm that prioritises orders first by price, then by timestamp for orders at same price level.

**Primary EVM Wallet**  
Root wallet (MetaMask, WalletConnect, Frame) that controls Silhouette account and performs critical functions like deposits.

---

## S

**Settlement**  
Final execution and clearing of trades. Occurs on HyperCore for expired orders through agent wallets.

**Shared Secret**  
Cryptographic secret derived through X25519 ECDH between webapp and enclave for secure communication.

**Shielded Exchange**  
Privacy-preserving trading platform that protects order flow from public visibility while maintaining full functionality.

**Silhouette Contract**  
Primary smart contract deployed on HyperEVM. Orchestrates exchange operations and stores encrypted state.

**Silhouette UI**  
Frontend interface enabling direct HyperCore actions, Silhouette Contract interaction, and encryption key management.

**Spot Trading**  
Direct trading of tokens (as opposed to derivatives). Supported on both Silhouette and Hyperliquid.

**Strategy Protection**  
Ability to trade without signalling intentions or revealing strategies to other market participants.

**szDecimals**  
Hyperliquid's precision specification for token amounts. ETH has szDecimals of 4, meaning prices are quoted to 4 decimal places.

---

## T

**TEE**  
Trusted Execution Environment. Secure, isolated computing environment enabling confidential computation. Silhouette uses AWS Nitro Enclaves.

---

## U

**UI Encryption Key**  
X25519 key pair generated in browser for encrypting communications with secure enclave. Private component never leaves browser.

---

## X

**X25519**  
Elliptic curve in Montgomery form over field with 2^255 + 19 elements. Used for Diffie-Hellman key exchange to establish shared secrets between webapp and enclave.

---

> ℹ️ **Info:** This documentation is for informational purposes only and does not constitute financial advice.