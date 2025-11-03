---
title: Silhouette Webapp
sidebar_label: Silhouette Webapp
pagination_label: Silhouette Webapp
---

The Silhouette webapp is the frontend for interacting with the other Silhouette system components. It plays a key role in ensuring that individual order flows and balances are only visible to the trader.

## Core Capabilities

1.  **Authenticate Securely**: Connect a preferred wallet.
2.  **Manage UI Encryption Keys**: The webapp handles the generation and secure local storage of a dedicated X25519 key pair used for encrypting communications with the secure enclave.
3.  **Deposit**: Initiate a direct transfer on HyperCore from the trader's wallet to the Silhouette smart contract's HyperCore wallet.
4.  **Submit Encrypted Communications**: Construct and transmit orders, cancellations, and withdrawal requests, encrypted end-to-end between the browser and the secure enclave.
5.  **Monitor Trading Activity**: View order history, balances, and status updates.

## Enabling Private Trades

Silhouette achieves order flow privacy through a cryptographic protocol orchestrated by the webapp:

1.  **Authentication**: A session is initiated by authenticating with a preferred wallet. The primary wallet's private keys remain under the exclusive control of the trader's wallet.

2.  **UI Encryption Key Establishment**:
    *   The webapp generates a unique X25519 key pair (`ui_keypair`). This key pair is distinct from any authentication-related session keys.
    *   The private component (`ui_private_key`) is stored securely within the browser's **IndexedDB**, namespaced by the connected account address and network ID. This key **never** leaves the browser.
    *   The public component (`ui_public_key`) is registered with the Silhouette smart contract, associating it with the authenticated wallet address.
    *   This X25519 key pair is persistent, allowing the user to decrypt their historical data. Future enhancements may include optional encryption of this key at rest in IndexedDB.

3.  **Secure Channel with Enclave**:
    *   The webapp retrieves the enclave's pre-published X25519 public key (`enclave_public_key`) from the Silhouette smart contract.
    *   Using the `ui_private_key` and `enclave_public_key`, the webapp computes a shared secret via the X25519 Diffie-Hellman (ECDH) algorithm (e.g., using `tweetnacl`).
    *   This shared secret is then typically used with a Key Derivation Function (KDF), like HKDF, to derive a symmetric key suitable for **AES-GCM** encryption.

4.  **Encrypted Order Submission**:
    *   When an order is submitted, the webapp encrypts order details using the derived symmetric key (AES-GCM) and a unique nonce.
    *   The resulting `cipher-text` and `nonce` are transmitted to the Silhouette smart contract. Order details remain opaque to the blockchain.

5.  **Enclave Processing**:
    *   The secure enclave monitors the Silhouette smart contract for new encrypted orders.
    *   For a specific order, the enclave retrieves the corresponding `ui_public_key` from the Silhouette smart contract.
    *   Using its own private key and the `ui_public_key`, the enclave independently computes the identical shared secret.
    *   The enclave uses this shared secret and the received `nonce` to decrypt the order.
    *   Decrypted orders are processed within the enclave's confidential matching engine.

## Webapp Security Model

The webapp focuses on protecting trading intentions and ensuring user control over primary assets:

*   **Wallet Key Isolation**:
    *   Primary wallet private keys are **never** exposed to the webapp. All operations requiring the primary wallet's signature are delegated to the user's connected wallet software.
    *   Direct access to on-chain assets (e.g., withdrawals to arbitrary addresses) is controlled by the primary wallet, not the UI's encryption keys.

*   **UI Encryption Key Security**:
    *   The X25519 private key (`ui_private_key`) used for encrypting communications is generated and stored exclusively within the browser's **IndexedDB**, protected by the browser's same-origin policy.
    *   This key is persistent to allow users to access their historical encrypted data. Users should ensure their browser environment and device are secure.
    *   Compromise of the `ui_private_key` would allow an attacker to:
        *   Decrypt any past and future messages exchanged between the user's browser and the enclave that were encrypted with this key.
        *   Potentially submit new encrypted messages (e.g., trades) to the enclave as if they were the user, depending on the enclave's authorization model beyond just decryption.
    *   However, such a compromise does **not** directly expose the user's primary wallet private keys or allow unauthorized movement of on-chain assets from the primary wallet.

*   **End-to-End Encryption**:
    *   Sensitive trading data (order type, size, and price) is encrypted using **AES-GCM** (derived from the X25519 shared secret) before leaving the browser.
    *   Only the secure enclave, capable of independently deriving the same shared secret and symmetric key, can decrypt this information.
    *   Neither Hyperliquid blockchain validators nor any other intermediaries can view raw order details, including Silhouette.
