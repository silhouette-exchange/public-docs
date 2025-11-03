---
title: Trusted Execution Environments (Secure Enclaves)
sidebar_label: Trusted Execution Environments
pagination_label: Trusted Execution Environments
---


import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

Silhouette's core matching engine runs in an [AWS Nitro Enclave](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) on the [Marlin](https://www.marlin.org/) network. Expansion to include [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html), under the appropriate conditions, is in the pipeline.

## AWS Nitro Enclaves

Nitro Enclaves are secure, isolated environments that enable confidential computation. Neither AWS, nor anyone else, has access to these environments. Deployments are multi-region with active-passive failover.

## Verifiable execution

### Code deployed to the Nitro Enclave
Deploying code to a Nitro Enclave involves building an enclave image file (.eif) that contains the application and its runtime dependencies. When this file is created, one is provided with the Platform Configuration Register 0 (PCR0) value. This is the SHA-384 hash of the .eif. 

### Verifying the code running in the Nitro Enclave

Nitro Enclaves are managed by the Nitro Hypervisor, which provides attestations (CBOR-encoded and COSE-signed documents) for each enclave that includes PCR0, definitively identifying the exact code running inside the enclave.

The hypervisor signatures can be [verified](https://docs.aws.amazon.com/enclaves/latest/user/verify-root.html) via the certificate chain that leads to the AWS root certificate.

### Reproducible builds

Silhouette will, at the appropriate time, open source the code used to create the .eif file. This will include the build system which uses [Nix](https://edolstra.github.io/pubs/phd-thesis.pdf).

By using Nix, Silhouette is able to achieve a deterministic and reproducible build. This enables anyone in the community to rebuild the .eif running in the Nitro Enclave from source and reproduce PCR0.

Signed attestation documents will be made available (via an endpoint) to allow community members to verify that the PCR0 they produce themselves matches the AWS hypervisor-signed PCR0 from the running enclave.

<ThemedImage
  alt="TEE Flow Diagram"
  sources={{
    light: useBaseUrl('/img/flows/tee - light.svg'),
    dark: useBaseUrl('/img/flows/tee - dark.svg'),
  }}
/>
