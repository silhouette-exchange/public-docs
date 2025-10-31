---
title: Smart Contract
sidebar_label: Smart Contract
pagination_label: Smart Contract
---
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

The Silhouette smart contract, deployed on the HyperEVM, serves as a guardian and as the **source of truth** for user balances.

The contract holds HyperCore funds in the Silhouette system, and stores state as ciphertexts on the HyperEVM. Ciphertext updates are submitted by the TEE, which is not trusted by the smart contract. State changes must be accompanied by a proof that guarantees the correctness of the update according to the protocol rules.

<ThemedImage
  alt="Silhouette smart contract diagram"
  sources={{
    light: useBaseUrl('/img/flows/contract-light.svg'),
    dark: useBaseUrl('/img/flows/contract-dark.svg'),
  }}
/>