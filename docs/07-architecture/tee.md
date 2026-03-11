---
title: Trusted Execution Environments
sidebar_label: Trusted Execution Environments
pagination_label: Trusted Execution Environments
description: "Discover how Silhouette uses AWS Nitro Enclaves and trusted execution environments to enable confidential, verifiable shielded trading."
keywords:
  - trusted execution environment
  - TEE
  - AWS Nitro
  - attestation
  - shielded trading
  - DeFi privacy
  - Silhouette Exchange
---

# Trusted Execution Environments

:::info For All Users
This page explains TEE fundamentals that matter for every trader. The [Technical Verification](#verifiable-execution) section provides deeper detail for auditors and developers who want to independently verify the system.
:::

Silhouette's core matching engine runs inside a Trusted Execution Environment (TEE) - a secure, isolated computing environment that ensures orders are processed confidentially. No one can access the data inside the TEE, not even the Silhouette team.

## AWS Nitro Enclaves

Silhouette uses [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) as its TEE, deployed on the [Marlin](https://www.marlin.org/) network. Nitro Enclaves provide hardware-level isolation for confidential computation. Neither AWS nor anyone else has access to the data being processed inside the enclave.

Deployments are multi-region with active-passive failover for reliability.

Expansion to include [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html) is on the roadmap, providing additional TEE diversity under the appropriate conditions.

## Why a TEE Matters

The TEE is what makes shielded trading possible. Without it, someone - the Silhouette team, a server operator, a cloud provider - would be able to see the orders being processed. The TEE eliminates this risk entirely.

Inside the TEE:
- **Orders are confidential** - only the user who placed the order knows its details
- **Matching happens in isolation** - the matching engine runs in a sealed environment
- **The Silhouette team has no access** - even the engineers who built the system cannot read data inside the enclave
- **The cloud provider has no access** - AWS cannot inspect the contents of a Nitro Enclave

This is a fundamental difference from traditional exchange infrastructure, where operators can (and do) see every order in the system.

## Verifiable Execution

Trust in the TEE is not based on Silhouette's word - it is cryptographically verifiable.

### How Verification Works

When code is deployed to a Nitro Enclave, it is packaged into an Enclave Image File (EIF). This file produces a **PCR0 value** - a `SHA-384` hash that uniquely identifies the exact code inside the enclave.

The Nitro Hypervisor - the hardware layer managed by AWS - produces attestation documents for each enclave. These are CBOR-encoded, COSE-signed documents that include the PCR0 value, definitively identifying the exact code running inside the enclave.

The hypervisor's signatures can be [verified](https://docs.aws.amazon.com/enclaves/latest/user/verify-root.html) through the certificate chain leading to the AWS root certificate. This means anyone can verify that:

1. The enclave is running on genuine AWS Nitro hardware
2. The code inside the enclave matches a specific, known hash
3. No one has tampered with the enclave's contents

### Reproducible Builds

Silhouette will, at the appropriate time, open source the code used to create the Enclave Image File. The build system uses [Nix](https://edolstra.github.io/pubs/phd-thesis.pdf), which enables fully deterministic and reproducible builds.

This means anyone in the community will be able to:
1. Build the EIF from source code
2. Produce the same PCR0 hash
3. Compare it against the attestation from the running enclave
4. Verify that the code running in production matches the public source

Signed attestation documents will be made available via an endpoint, allowing community members to verify the running enclave at any time.

## What This Means for You

You do not need to trust Silhouette. The combination of hardware-isolated execution, cryptographic attestation, and reproducible builds means that the system's integrity is verifiable, not just claimed.

Your orders enter a sealed environment that no one can inspect. They are processed according to rules that anyone can verify. And the results settle on [Hyperliquid's](/architecture/hyperliquid) public order book, where the execution is transparent even though your identity is not.

For an overview of how the TEE fits into Silhouette's broader architecture, see [Architecture Overview](/architecture/overview). To understand how the [smart contract](/architecture/smart-contract) verifies TEE outputs onchain, see [Smart Contract](/architecture/smart-contract).
