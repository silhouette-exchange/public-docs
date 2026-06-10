---
id: tee-vs-zk-vs-mpc
title: "TEE vs ZK vs MPC: Privacy Approaches for Trading"
sidebar_label: TEE vs ZK vs MPC
description: An honest comparison of Trusted Execution Environments, Zero-Knowledge Proofs, and Multi-Party Computation for private trading. How each approach works, what it gives up, and why Silhouette chose TEE.
keywords:
  - TEE vs ZK
  - TEE vs MPC
  - ZK vs MPC
  - trusted execution environment
  - zero knowledge proofs trading
  - multi party computation trading
  - shielded trading
  - private DEX
  - DeFi privacy comparison
---

# TEE vs ZK vs MPC

*Silhouette uses TEE-based architecture. We have aimed to represent each approach fairly, but readers should weigh our perspective accordingly. All figures as of April 2026.*

Three cryptographic approaches compete to solve the same problem: how to trade without exposing your strategy. Each makes real tradeoffs. Here is how they compare from a trader's perspective.

---

## The comparison

| | TEE | ZK Proofs | MPC |
|---|---|---|---|
| **What's private** | Everything inside the enclave: your orders, balances, and matching logic. The enclave runs in hardware-isolated memory that the host system and operator cannot access. | Transaction validity is provable without revealing sender, amount, or order details. The proof itself leaks nothing. Also useful for hiding function inputs in isolated computations. | Each party's inputs remain private from all other parties, including the matching engine. Only matched outputs are revealed. |
| **Execution speed** | 4-10% overhead vs native. No proof generation - your order executes at near-native speed. Milliseconds, not seconds. | Sub-second for purpose-built circuits. Seconds to minutes for general computation with GPU acceleration. Improving rapidly, but proof generation is inherent to the model. | High overhead when you factor in networking between parties. Seconds to minutes depending on complexity, number of nodes, and network conditions. |
| **Liquidity** | Can interface with existing orderbooks. Silhouette wraps Hyperliquid's full depth - same spreads, same books, no migration to a new pool. | Typically requires a dedicated shielded pool, separate from public venues. Liquidity must be bootstrapped from scratch. Railgun holds ~$100M; Penumbra holds ~$12K. | Requires dedicated matching infrastructure. Renegade uses Binance mid-market as a reference price rather than discovering price natively. |
| **What can go wrong** | Side-channel attacks on the hardware (Downfall, SGAxe, AEPIC Leak - several are software-exploitable in shared environments). You trust the hardware provider (AMD, Intel, AWS) to ship secure silicon and honest attestation. A hardware flaw can affect all enclaves on that chip. | Under-constrained circuits are the primary bug class. Formal verification tooling is maturing. The underlying math is unbroken - no one has forged a valid ZK proof from invalid inputs. | Smallest attack surface to date, partly because few systems are live at scale. Must trust that fewer than t-of-n parties collude. No hardware dependency means no hardware failure mode. |
| **Who you trust** | The hardware provider (AMD, Intel, AWS), their firmware, and their attestation infrastructure. A layered chain where any link can fail. | The math. Modern systems (PLONK, Halo2, STARKs) have eliminated trusted setup ceremonies. | A threshold of independent parties. No single entity has your data. No vendor dependency. |
| **Best suited for** | High-throughput execution and applications that need networking - orderbook matching, real-time trading, any system where latency matters. | Isolated computations with no networking requirement. Proving correctness without revealing inputs. Lower-throughput applications where proof generation time is acceptable. | Distributed trust across parties. Applications where no single entity should control the computation, and latency is less critical than trust distribution. |

---

## What is a TEE?

A Trusted Execution Environment is a hardware-enforced secure area of a processor. When code runs inside a TEE, it operates in isolated memory that the host system cannot access. The processor itself enforces the boundary - not software, not the operating system, not the hypervisor. Even with root access, an attacker cannot RAM dump, inspect CPU registers, or snapshot the VM of an enclave. This is due to hardware-enforced isolation of memory and CPU.

The two implementations that matter for production DeFi infrastructure are **Intel TDX** and **AWS Nitro Enclaves**. These provide the memory and CPU flexibility that server-grade applications require. Intel SGX (process-level enclaves) is being phased out on consumer hardware. ARM TrustZone is primarily used in consumer devices and is too constrained for exchange infrastructure.

TEEs provide three properties:

**Confidentiality.** Data processed inside the enclave is isolated in hardware-protected memory. Even with root access to the host system, an attacker cannot read the contents of enclave memory.

**Integrity.** Code running inside the TEE cannot be tampered with from outside. If the enclave binary is modified, the attestation measurement changes and the discrepancy is detectable.

**Attestation.** A TEE can produce a cryptographic proof that a specific piece of code is running inside a genuine, unmodified enclave. Any participant can verify this proof - but they still trust the hardware provider (AMD, Intel, AWS) to have issued honest attestation keys.

That third property is what makes TEEs useful for financial applications. You don't rely on the operator's word that the system is behaving honestly. You verify the attestation. The tradeoff is that attestation verifies what code was *loaded* - it is a point-in-time measurement at startup, not continuous runtime monitoring.

---

## How Silhouette uses TEEs

Silhouette's matching engine runs inside a TEE on Hyperliquid. Orders enter the enclave, are matched against Hyperliquid's orderbook depth, and results are published to the public ledger. The enclave provides isolation - orders do not need to be separately encrypted because the TEE's hardware boundary prevents external access to its memory.

What the market sees: aggregate flow, settlement data, fill prices, and volumes - all published to Hyperliquid's ledger after trades clear. Full transparency on outcomes.

What the market doesn't see: individual orders, sizes, directions, and strategies before or during execution. Your intent stays private until the trade settles.

This is the distinction between a shielded exchange and a dark pool. A dark pool hides settlement data, breaking price discovery. Silhouette shields order intent before execution while publishing all settlement data publicly. The market stays transparent. The participant gets confidentiality.

---

## The honest tradeoffs

### Why TEE over ZK for trading?

ZK-based private exchanges build their own liquidity pool. That pool starts empty. Penumbra has $12K in TVL. Renegade references Binance for pricing because it cannot discover price natively. Even Railgun, the most successful ZK privacy system at ~$100M TVL, is a fraction of what Hyperliquid clears in a single hour. The math is sound. The liquidity is not.

ZK proofs are best suited for isolated computations - proving that something happened correctly without revealing the inputs, in applications where there is no networking requirement and proof generation latency is acceptable. For a matching engine processing orders against a live orderbook in milliseconds, proof generation creates a throughput ceiling that does not exist with TEEs.

### Why TEE over MPC for trading?

MPC distributes trust across multiple parties - no single point of hardware failure, no manufacturer to trust. That is a genuine advantage and the core reason MPC exists as an alternative. But MPC's overhead is high when you account for the networking between parties, not just the computation. Matching an order through MPC takes seconds to minutes depending on complexity and node count. For periodic dark pool crossing, MPC works. For continuous trading against a live book, it is too slow today.

### What TEE gives up

We depend on hardware providers (AMD, Intel, AWS) shipping secure silicon and maintaining honest attestation infrastructure. Side-channel attacks on TEEs are real and regularly discovered - some are software-exploitable by co-located processes in cloud environments. We mitigate through hardware selection, operational security, and participation in the [Proof of Cloud](https://proofofcloud.org/) consortium.

The other honest gap: remote attestation in its current form is a startup-time measurement. It verifies that the correct code was loaded into the enclave. It does not provide continuous runtime verification that the computation inside is behaving as expected at every moment. This is an area the industry is actively working on, and hybrid TEE+ZK architectures (where the TEE produces ZK proofs of its own execution) are the most promising path forward.

---

## The security picture

### TEE attacks

Academic research has demonstrated several TEE attack vectors. Side-channel attacks, speculative execution vulnerabilities, and physical memory interposition have all been shown to extract information from TEE memory under various conditions.

The critical distinction is the threat model. Physical attacks (WireTap, TEE.Fail, Battering RAM) require access to the hardware - interposing on the memory bus to extract keys. Software attacks (Downfall, SGAxe, AEPIC Leak) exploit microarchitectural side channels and can be executed by a co-located process on the same machine. In cloud environments, this means a co-tenant on the same server could potentially attack your enclave.

In over a decade of Intel SGX deployment across server infrastructure, there is no documented case of a TEE being physically compromised in a production financial system. But the software-exploitable attack surface is real and expanding. Intel is transitioning from SGX to TDX. Mitigations include hardware integrity trees (5th Gen Xeon+), the Proof of Cloud consortium for physical facility verification, and blocking end-of-life hardware.

### ZK security

Under-constrained circuits are the primary bug class - roughly 96% of documented ZK bugs. The proof system accepts inputs it should reject. The Solana ZK ElGamal vulnerability (April 2025) could have allowed unlimited token minting but was caught and patched before exploitation. Formal verification tools (Ecne, Picus) are reducing incidence. The underlying cryptographic primitives - discrete log, collision-resistant hash functions - have no known breaks.

### MPC security

MPC has the smallest production attack surface, partly because fewer systems are deployed at scale. The theoretical attack is threshold collusion - if enough parties coordinate, they can reconstruct private inputs. The practical attack surface has seen less adversarial pressure than TEE deployments.

---

## The future is hybrid

The "pick one" framing is increasingly outdated. The most robust architectures combine approaches:

- **Flashbots** uses TEE for fast block building with plans for ZK verification of enclave execution.
- **Renegade** uses MPC for private order matching with ZK proofs for on-chain settlement.
- **Fireblocks** combines MPC key management with TEE execution.

A TEE that produces ZK proofs of its own computation would offer hardware speed with mathematical verifiability - the best of both worlds. This is the direction the industry is heading, and it is the direction we are paying close attention to.

---

## Further reading

- [How Silhouette Works](/how-silhouette-works) - our TEE architecture in detail
- [TEE and Attestation](/architecture/tee) - how remote attestation works
- [Why Dark Pools Haven't Worked Onchain](/blog/why-dark-pool-havent-worked) - the liquidity problem that shaped our approach
