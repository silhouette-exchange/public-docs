---
title: Hyperliquid Ecosystem
sidebar_label: Hyperliquid
pagination_label: Hyperliquid
---

## Hyperliquid is one blockchain

HyperCore and HyperEVM are two components of a single system. They have separate execution environments, but share a single global ledger state which is secured by [HyperBFT](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview#consensus). This means that one set of validators ('replicas' in HotStuff) is producing one chain of blocks that may contain both HyperCore and HyperEVM transactions.

A single state provides the ability to transfer assets directly between components, and for smart contracts on the HyperEVM to access HyperCore.

> *"The Hyperliquid blockchain features two key parts: HyperCore and HyperEVM. The HyperEVM is not a separate chain, but rather, secured by the same HyperBFT consensus as HyperCore. This lets the HyperEVM interact directly with parts of HyperCore, such as spot and perp order books."* - [Hyperliquid Docs](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperevm)


## Different Components Work on Different Timescales

Hyperliquid has successfully segregated its components according to the speed at which different types of transactions need to occur. 
- HyperCore is incredibly fast because it is purpose-built to run financial primitives
- HyperEVM has fast (small) and slow (large) blocks to cater to users and builders respectively
This means that the single, sequential Hyperliquid blockchain includes transactions from the different components at different times.

> HyperCore transaction batches are included every *70ms*, small HyperEVM transaction batches ("blocks") every *2s*, and large HyperEVM batches every *1min*.> HyperCore transaction batches are included every *70ms*, small HyperEVM transaction batches ("blocks") every *2s*, and large HyperEVM batches every *1min*.
> HyperCore transaction batches are included every *70ms*, small HyperEVM transaction batches ("blocks") every *2s*, and large HyperEVM batches every *1min*.   