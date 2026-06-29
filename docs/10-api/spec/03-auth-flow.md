---
title: E2E auth flow
sidebar_label: Auth flow example
slug: /api/spec/auth-flow
---

:::warning
The Silhouette REST API v1 spec is in beta and may change as RFQ workflows evolve.
:::

This walkthrough shows the full REST API v1 authentication lifecycle: minting API keys with SIWE, signing private requests with HMAC, rotating individual keys, and revoking every live key for an account.

Do not hard-code wallet private keys, HMAC secrets, or generated access keys in application code. The HMAC secret is returned once when a key is minted and should be stored as a production secret.

## End-to-end sequence

1. Request a single-use SIWE challenge with `POST /v1/auth/challenge`.
2. Build a SIWE message that includes the returned nonce, the gateway domain, the URI, the chain ID, and the issued-at timestamp.
3. Sign the SIWE message with the wallet that owns the account.
4. Submit the signed message to `POST /v1/auth/api-keys`.
5. Store the returned `accessKey` and `secret`.
6. Sign every private request with the HMAC secret.
7. List or revoke live API keys with the auth key-management endpoints.

## SIWE message shape

The SIWE message must match exactly what the wallet signs. Whitespace and line breaks are part of the signed payload.

```text
{domain} wants you to sign in with your Ethereum account:
{address}

Silhouette /ws session

URI: https://{domain}/
Version: 1
Chain ID: {chainId}
Nonce: {nonce}
Issued At: {issuedAt}
```

After signing, mint the HMAC credential pair:

```http
POST /v1/auth/api-keys
Content-Type: application/json

{
  "message": "<siwe-message>",
  "signature": "<0x-wallet-signature>"
}
```

The response includes a public `accessKey` and a base64 `secret`. The secret is returned only once.

## HMAC signing helper

The HMAC signature covers the exact timestamp, HTTP method, path with query string, and request body that the server receives.

```python
import base64
import hashlib
import hmac
import time

TIMESTAMP_HEADER = "Silhouette-API-Timestamp"
SIGNATURE_HEADER = "Silhouette-API-Signature"


def hmac_headers(access_key, secret_b64, method, path, body=""):
    secret = base64.b64decode(secret_b64)
    timestamp = str(int(time.time() * 1000))
    message = "\n".join([timestamp, method.upper(), path, body]).encode()
    signature = base64.b64encode(
        hmac.new(secret, message, hashlib.sha256).digest()
    ).decode()

    return {
        "Authorization": f"Bearer {access_key}",
        TIMESTAMP_HEADER: timestamp,
        SIGNATURE_HEADER: signature,
    }
```

For `GET` and `DELETE` requests without a body, pass an empty body string. For paths with query parameters, include the query string in the signed path, such as `/v1/auth/api-keys?all=true`.

## Signing private requests

Any live key for the account can sign private requests. This makes rotation possible without forcing downtime.

```python
headers = hmac_headers(access_key, secret_b64, "GET", "/v1/rfq/balances")
```

For `POST` requests, sign the exact JSON bytes you send. If your client serializes JSON before sending, sign the serialized string, not a reconstructed object.

```python
import json

body = json.dumps(
    {
        "instrumentId": "XTSLA-USDC-SPOT",
        "side": "BUY",
        "baseQty": "0.5",
        "quoteLimit": "1000",
        "autoAccept": True,
    },
    separators=(",", ":"),
)

headers = hmac_headers(access_key, secret_b64, "POST", "/v1/rfq/requests", body)
headers["Content-Type"] = "application/json"
```

If the request body does not match the body used to compute the signature, the gateway rejects the request.

## Multi-key lifecycle test

An end-to-end auth test can verify that key minting, request signing, and revocation all work together.

| Step | Request | Signer | Expected result |
|------|---------|--------|-----------------|
| Mint key 1 | `POST /v1/auth/challenge`, then `POST /v1/auth/api-keys` | Wallet SIWE signature | First `accessKey` and `secret` |
| Mint key 2 | `POST /v1/auth/challenge`, then `POST /v1/auth/api-keys` | Wallet SIWE signature | Second live key for the same account |
| Mint key 3 | `POST /v1/auth/challenge`, then `POST /v1/auth/api-keys` | Wallet SIWE signature | Third live key for the same account |
| Use key 1 | `GET /v1/rfq/balances` | Key 1 HMAC | Authenticated private request |
| Use key 2 | `POST /v1/rfq/requests` | Key 2 HMAC | Authenticated RFQ request, with business validation applied after auth |
| Use key 3 | `GET /v1/auth/api-keys` | Key 3 HMAC | Three live keys listed |
| Revoke key 1 | `DELETE /v1/auth/api-keys/{accessKey}` | Key 2 HMAC | Key 1 stops authenticating |
| List keys again | `GET /v1/auth/api-keys` | Key 2 HMAC | Two live keys listed |
| Revoke all keys | `DELETE /v1/auth/api-keys?all=true` | Key 3 HMAC | All live keys are revoked |
| Confirm revocation | `GET /v1/auth/api-keys` | Key 3 HMAC | `401`, because key 3 revoked itself |

The `DELETE /v1/auth/api-keys?all=true` operation is a sign-out-everywhere action. The `all=true` query parameter is required and is part of the signed path.

## Related reference

- [HMAC authentication](/api/spec/authentication)
- [Auth endpoints](/api/spec/auth)
- [Submit an RFQ request](/api/spec/rfq#post-v1-rfq-requests)
