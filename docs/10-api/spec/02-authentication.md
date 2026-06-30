---
title: RFQ API authentication
sidebar_label: Authentication
slug: /api/spec/authentication
---

The RFQ API uses wallet-based SIWE login to mint API credentials, then HMAC signatures for private REST requests. Public auth endpoints issue the challenge and credential pair. All private RFQ, maker, funding, balance, and key-management endpoints require HMAC headers.

## Flow

1. Request a single-use nonce with `POST /v1/auth/challenge`.
2. Build a SIWE message that includes the nonce, gateway domain, URI, chain ID, and issued-at timestamp.
3. Sign the SIWE message with the account wallet.
4. Submit the SIWE message and wallet signature to `POST /v1/auth/api-keys`.
5. Store the returned `accessKey` and base64 `secret`.
6. Sign each private request with the HMAC secret.

The secret is returned only once. Treat it as a production secret and rotate it by minting a new key before revoking the old one.

## Auth endpoints

| Method | Path | Operation ID | Auth | Purpose |
|--------|------|--------------|------|---------|
| `POST` | `/v1/auth/challenge` | `authChallenge` | None | Issue a single-use SIWE nonce. |
| `POST` | `/v1/auth/api-keys` | `siweLogin` | None | Verify SIWE and mint an HMAC credential pair. |
| `GET` | `/v1/auth/api-keys` | `listApiKeys` | HMAC | List the caller's live API keys. |
| `DELETE` | `/v1/auth/api-keys?all=true` | `revokeAllApiKeys` | HMAC | Revoke every live key for the caller. |
| `DELETE` | `/v1/auth/api-keys/{accessKey}` | `revokeApiKey` | HMAC | Revoke one key for the caller. |

## SIWE message

Whitespace and line breaks are part of the SIWE payload, so sign exactly the message you send to the API.

```text
{domain} wants you to sign in with your Ethereum account:
{address}

Create Silhouette API key

URI: https://{domain}/
Version: 1
Chain ID: {chainId}
Nonce: {nonce}
Issued At: {issuedAt}
```

Submit the signed message to mint credentials:

```http
POST /v1/auth/api-keys
Content-Type: application/json

{
  "message": "<siwe-message>",
  "signature": "<0x-wallet-signature>"
}
```

The response returns the public `accessKey` and base64 `secret`.

## HMAC headers

Every private endpoint requires these headers:

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <access-key>` |
| `Silhouette-API-Timestamp` | Unix timestamp in milliseconds |
| `Silhouette-API-Signature` | Base64 HMAC-SHA256 signature |

The signature is computed over the exact request data the server receives:

```text
{timestamp}
{METHOD}
{path}?{query}
{body}
```

Use the exact HTTP method, path, query string, and serialized body bytes. For `GET` and bodyless `DELETE` requests, the body line is empty. For query-string endpoints, such as `DELETE /v1/auth/api-keys?all=true`, include the query string in the signed path.

Requests are accepted only when the timestamp is fresh within the gateway window, currently 30 seconds.

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

For `POST` requests, sign the serialized JSON string you send:

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

If the body bytes differ from the bytes used to compute the signature, the gateway rejects the request.

## Key lifecycle

Multiple live keys can belong to the same account at the same time. This allows gradual rotation:

1. Mint a new key.
2. Move traffic to the new key.
3. Confirm the new key can sign private requests.
4. Revoke the old key with `DELETE /v1/auth/api-keys/{accessKey}`.

For a sign-out-everywhere action, send `DELETE /v1/auth/api-keys?all=true`. The signing key used for that request is revoked too, so the next request signed by that key should fail with `401`.

## Endpoint details

### Request a login challenge {#post-v1-auth-challenge}

`POST /v1/auth/challenge`

Issues a single-use nonce to embed in the SIWE login message. This endpoint is public.

| Status | Meaning |
|--------|---------|
| `200` | Challenge nonce returned. |
| `500` | Internal server error. |

### Mint an HMAC credential pair {#post-v1-auth-api-keys}

`POST /v1/auth/api-keys`

Verifies the SIWE message and wallet signature, then returns an `accessKey` and base64 `secret`.

| Field | Required | Notes |
|-------|----------|-------|
| `message` | Yes | SIWE message containing the challenge nonce, domain, and chain ID. |
| `signature` | Yes | Wallet signature over `message`, as a `0x`-prefixed hex string. |
| `expiresInSecs` | No | Requested credential lifetime. Omit for the default; requests above the maximum are rejected. |

| Status | Meaning |
|--------|---------|
| `200` | Credential pair minted. |
| `400` | Request validation failed. |
| `401` | SIWE verification failed. |
| `500` | Internal server error. |

### List live API keys {#get-v1-auth-api-keys}

`GET /v1/auth/api-keys`

Returns live key metadata for the caller. Secrets are never returned after issuance.

| Status | Meaning |
|--------|---------|
| `200` | Live keys returned. |
| `401` | Missing, expired, revoked, or unknown access key. |
| `403` | Signature mismatch. |
| `500` | Internal server error. |

### Revoke all API keys {#delete-v1-auth-api-keys}

`DELETE /v1/auth/api-keys?all=true`

Revokes every live key for the caller. The `all=true` query parameter is required and must be included in the signed path.

| Status | Meaning |
|--------|---------|
| `204` | Every live key was revoked. |
| `400` | Missing or invalid `all=true` query parameter. |
| `401` | Missing, expired, revoked, or unknown access key. |
| `403` | Signature mismatch. |
| `500` | Internal server error. |

### Revoke one API key {#delete-v1-auth-api-keys-accesskey}

`DELETE /v1/auth/api-keys/{accessKey}`

Revokes one key owned by the caller. Use this for routine rotation or to contain a leaked credential.

| Status | Meaning |
|--------|---------|
| `204` | Key revoked. |
| `401` | Missing, expired, revoked, or unknown signing key. |
| `403` | Signature mismatch. |
| `404` | Key not found for the caller. |
| `500` | Internal server error. |
