---
title: Auth API
sidebar_label: Auth
slug: /api/spec/auth
---

:::warning
The Silhouette REST API v1 spec is in beta and may change as RFQ workflows evolve.
:::

SIWE login and HMAC credential issuance.

## Operations

| Endpoint | Operation ID | Summary | Auth |
|----------|--------------|---------|------|
| [`POST /v1/auth/challenge`](#post-v1-auth-challenge) | `authChallenge` | Request a login challenge. | None |
| [`POST /v1/auth/api-keys`](#post-v1-auth-api-keys) | `siweLogin` | SIWE login - mint an HMAC credential pair. | None |
| [`GET /v1/auth/api-keys`](#get-v1-auth-api-keys) | `listApiKeys` | List the caller's API keys. | HMAC |
| [`DELETE /v1/auth/api-keys`](#delete-v1-auth-api-keys) | `revokeAllApiKeys` | Revoke all the caller's API keys. | HMAC |
| [`DELETE /v1/auth/api-keys/{accessKey}`](#delete-v1-auth-api-keys-accesskey) | `revokeApiKey` | Revoke one API key. | HMAC |

## Request a login challenge {#post-v1-auth-challenge}

`POST /v1/auth/challenge`

| Field | Value |
|-------|-------|
| Operation ID | `authChallenge` |
| Authentication | None |

Issues a single-use nonce to embed in the SIWE (EIP-4361) login message. The
nonce expires shortly. Unauthenticated.

### Parameters

None.

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | A single-use login challenge nonce. | [ChallengeResponse](/docs/api/spec/schemas#challengeresponse) |
| `500` | Internal server error. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |

## SIWE login - mint an HMAC credential pair {#post-v1-auth-api-keys}

`POST /v1/auth/api-keys`

| Field | Value |
|-------|-------|
| Operation ID | `siweLogin` |
| Authentication | None |

Verifies a SIWE (EIP-4361) message signed by the wallet - embedding the
challenge nonce, this gateway's domain, and its chain id - and on success
autonomously mints a short-lived HMAC credential pair: a public access key
and a base64 secret. The secret is returned once here and never again; sign
every later request with it (see the `hmac` security scheme). Unauthenticated.

### Parameters

None.

### Request body

Content type: `application/json`

Schema: [LoginRequest](/docs/api/spec/schemas#loginrequest)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The SIWE (EIP-4361) message, embedding the challenge nonce and this gateway's domain and chain id. |
| `signature` | string | Yes | The wallet's signature over `message`, as a 0x-prefixed hex string. |
| `expiresInSecs` | integer \| null (int64) | No | Requested credential lifetime in seconds. Omit for the two-week default; capped at three months (90 days), beyond which the request is rejected. |

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The minted credential pair, bound to the authenticated account. | [LoginResponse](/docs/api/spec/schemas#loginresponse) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `401` | SIWE verification failed: bad signature, domain, chain id, or an unknown/consumed nonce. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |

## List the caller's API keys {#get-v1-auth-api-keys}

`GET /v1/auth/api-keys`

| Field | Value |
|-------|-------|
| Operation ID | `listApiKeys` |
| Authentication | HMAC |

Returns the account's live credentials - those neither revoked nor past
their expiry - newest first. Metadata only: the secret leaves the server
once at issuance and is never returned again. Use this to audit which keys
are outstanding before revoking one with `DELETE /v1/auth/api-keys/{accessKey}`.

### Parameters

None.

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The caller's live API keys, newest first. | [ApiKeysResponse](/docs/api/spec/schemas#apikeysresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |

## Revoke all the caller's API keys {#delete-v1-auth-api-keys}

`DELETE /v1/auth/api-keys`

| Field | Value |
|-------|-------|
| Operation ID | `revokeAllApiKeys` |
| Authentication | HMAC |

Retires every live key for the caller's account - a sign-out-everywhere. The
explicit `all=true` query flag is required; a bare `DELETE` on the collection
is rejected `400`, so an accidental request cannot wipe an account's
credentials. The revoked keys stop authenticating immediately.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `all` | query | Yes | boolean | Must be `true`; guards the collection-wide revoke against an accidental bare DELETE. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `204` | Every live key for the account was revoked. | - |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |

## Revoke one API key {#delete-v1-auth-api-keys-accesskey}

`DELETE /v1/auth/api-keys/{accessKey}`

| Field | Value |
|-------|-------|
| Operation ID | `revokeApiKey` |
| Authentication | HMAC |

Retires a single one of the caller's keys by its access key, scoped to the
caller's account: a key that does not exist or belongs to another account is
a `404`. The revoked key stops authenticating immediately - the containment
action for a leaked secret.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `accessKey` | path | Yes | string | The public access key to revoke. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `204` | The key was revoked. | - |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `404` | Not found. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/docs/api/spec/schemas#errorresponse) |
