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

## What is a TEE?

Silhouette's core matching engine runs inside a Trusted Execution Environment (TEE), an isolated computing environment in which orders are processed confidentially. Data inside the enclave is not readable by the Silhouette team or the cloud provider.

## AWS Nitro Enclaves

Silhouette uses [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) as its TEE, deployed on the [Marlin](https://www.marlin.org/) network. Nitro Enclaves provide hardware-level isolation for confidential computation. Neither AWS nor anyone else has access to the data being processed inside the enclave.

Deployments are multi-region with active-passive failover for reliability.

Expansion to include [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html) is on the roadmap, providing additional TEE diversity under the appropriate conditions.

## Role of the TEE

The TEE is the component that enables shielded trading. Without hardware-isolated execution, orders processed by the matching engine would be readable by the Silhouette team, a server operator, or the cloud provider. Inside the TEE:

- **Order confidentiality** - order details are accessible only to the user who submitted the order
- **Isolated matching** - the matching engine runs in a hardware-isolated environment
- **No operator read access** - Silhouette engineers cannot read data inside the enclave
- **No cloud provider read access** - AWS cannot inspect the contents of a Nitro Enclave

This differs from conventional exchange infrastructure, where operators retain read access to all orders in the matching engine.

## Verifiable Execution

TEE integrity is cryptographically verifiable and does not rely on operator assertions.

### How Verification Works

When code is deployed to a Nitro Enclave, it is packaged into an Enclave Image File (EIF). This file produces a **PCR0 value** - a `SHA-384` hash that uniquely identifies the exact code inside the enclave.

The Nitro Hypervisor - the hardware layer managed by AWS - produces attestation documents for each enclave. These are CBOR-encoded, COSE-signed documents that include the PCR0 value, definitively identifying the exact code running inside the enclave.

The hypervisor's signatures can be [verified](https://docs.aws.amazon.com/enclaves/latest/user/verify-root.html) through the certificate chain leading to the AWS root certificate. Once verified, an attestation document confirms:

1. The enclave is running on genuine AWS Nitro Enclave hardware
2. The code inside the enclave matches a specific, known PCR0 hash
3. The enclave's contents have not been tampered with

Signed attestation documents are available on request from the Silhouette team in the interim. A self-service verification flow is under development and will be published ahead of the attestation endpoint going live.

### Reproducible Builds

Silhouette will, at the appropriate time, open source the code used to create the Enclave Image File. The build system uses [Nix](https://edolstra.github.io/pubs/phd-thesis.pdf), which enables fully deterministic and reproducible builds.

This means anyone in the community will be able to:
1. Build the EIF from source code
2. Produce the same PCR0 hash
3. Compare it against the attestation from the running enclave
4. Verify that the code running in production matches the public source

When the self-service verification flow is live, community members will be able to fetch a signed attestation from the running enclave at any time and reproduce the PCR0 hash locally, matching the one in the attestation. Until then, the Silhouette team will provide signed attestations on request.

## Summary

The combination of hardware-isolated execution, cryptographic attestation, and reproducible builds makes the system's integrity independently verifiable rather than operator-claimed. Orders are processed inside the enclave, and fills settle on [Hyperliquid's](/architecture/hyperliquid) public order book. The fills themselves are publicly visible; the mapping from a given fill to an individual user is not exposed.

For an overview of how the TEE fits into Silhouette's broader architecture, see [Architecture Overview](/architecture/overview).

<TechArticleSchema
  headline="Trusted Execution Environments (TEE) at Silhouette"
  description="Discover how Silhouette uses AWS Nitro Enclaves and trusted execution environments to enable confidential, verifiable shielded trading."
  proficiencyLevel="Advanced"
  keywords={['trusted execution environment', 'TEE', 'AWS Nitro', 'attestation', 'shielded trading', 'DeFi privacy']}
/>
