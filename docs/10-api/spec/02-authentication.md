---
title: HMAC authentication
sidebar_label: HMAC authentication
slug: /api/spec/authentication
---

:::warning
The Silhouette REST API v1 spec is in beta and may change as RFQ workflows evolve.
:::

The REST API v1 uses SIWE to authenticate a wallet, then mints a short-lived HMAC credential pair for private API calls.

## Login flow

1. Request a single-use challenge nonce with `POST /v1/auth/challenge`.
2. Build and sign a SIWE message that includes the challenge nonce.
3. Submit the SIWE message and wallet signature to `POST /v1/auth/api-keys`.
4. Store the returned public access key and base64 secret securely.
5. Sign every private REST request with the secret.

The HMAC secret is returned once at login and is never returned again. Rotate credentials by repeating the SIWE login flow.

## Required headers

Every private endpoint requires these headers:

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <access-key>` |
| `Silhouette-API-Timestamp` | Unix timestamp in milliseconds |
| `Silhouette-API-Signature` | Base64 HMAC-SHA256 signature |

## Canonical string

The signature is the HMAC-SHA256, under the base64 secret, of this canonical string:

```text
{timestamp}
{METHOD}
{path}?{query}
{body}
```

Use the exact request method, path, query string, and body bytes that the server receives. For `GET` requests, the body line is empty.

Requests are accepted only when the timestamp is fresh within the gateway window, currently 30 seconds.

## Public endpoints

These endpoints do not require HMAC headers:

| Method | Path | Operation ID |
|--------|------|--------------|
| `POST` | `/v1/auth/challenge` | `authChallenge` |
| `POST` | `/v1/auth/api-keys` | `siweLogin` |

All other endpoints in the v1 spec require HMAC authentication.

## Key management

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/v1/auth/api-keys` | List live API keys for the caller |
| `DELETE` | `/v1/auth/api-keys` | Revoke all live API keys when `all=true` is present |
| `DELETE` | `/v1/auth/api-keys/{accessKey}` | Revoke one API key |
