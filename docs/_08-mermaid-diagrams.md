---
title: Mermaid Diagrams
sidebar_label: Mermaid Diagrams
pagination_label: Mermaid Diagrams
slug: /mermaid-diagrams
---

### [TEEs](/docs/architecture/tee)

```mermaid
flowchart TD
    A[Community Member] -->|Rebuilds .eif from source| B[Deterministic Build System Nix]
    B -->|Produces PCR0 hash| C[Local PCR0]
    D[Nitro Enclave] -->|Runs attestation server| E[Attestation Server]
    E -->|Provides signed PCR0| F[Signed PCR0 from enclave]
    A -->|Requests signed PCR0| E
    A -->|Compares PCR0 hashes| G{Do PCR0 hashes match?}
    G -->|Yes| H[Verification Successful]
    G -->|No| I[Verification Failed]
```



```mermaid
graph TD
    A[silhouette.exchange<br/>Trader Device]

    subgraph Hyperliquid
        direction LR
        B[Hypercore]
        C[HyperEVM]
    end

    D[TEE]

    A --> B
    A --> C
    B --> D
    C --> D
    D --> B
    D --> C

```




| HyperCore | HyperCore + HyperEVM | HyperCore + HyperEVM |
|-----------|---------------------|---------------------|
| **Block Height:** 1001<br/>**Block Hash:** 0xabcde12345...<br/>**Previous Block:** 0x9876543210... | **Block Height:** 1002<br/>**Block Hash:** 0xdef4567890...<br/>**Previous Block:** 0xabcde12345... | **Block Height:** 1003<br/>**Block Hash:** 0x12345fghij...<br/>**Previous Block:** 0xdef4567890... |
| **Contains:**<br/>• **HyperCore transactions** | **Contains:**<br/>• **HyperCore transactions**<br/>• **Fast HyperEVM transactions** | **Contains:**<br/>• **HyperCore transactions**<br/>• **Fast HyperEVM transactions**<br/>• **Slow HyperEVM transactions** |
| *This block happens to hold only native HyperCore activity—orders, trades, and vault changes.* | *This block includes both core exchange activity and EVM smart contract calls—showing Hyperliquid's dual-mode design.* | *This block shows the full capability of the unified chain: core trading, fast contract calls, and large/complex EVM executions all included, all linked, all finalised atomically in one global state.* |