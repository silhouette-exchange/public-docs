---
title: Funding API
sidebar_label: Funding
slug: /api/spec/funding
---

Deposits and withdrawals.

## Operations

| Endpoint | Operation ID | Summary | Auth |
|----------|--------------|---------|------|
| [`GET /v1/rfq/deposits`](#get-v1-rfq-deposits) | `listDeposits` | List deposits. | HMAC |
| [`GET /v1/rfq/deposits/{depositId}`](#get-v1-rfq-deposits-depositid) | `getDeposit` | Get a deposit. | HMAC |
| [`GET /v1/rfq/withdrawals`](#get-v1-rfq-withdrawals) | `listWithdrawals` | List withdrawals. | HMAC |
| [`POST /v1/rfq/withdrawals`](#post-v1-rfq-withdrawals) | `createWithdrawal` | Create a withdrawal. | HMAC |
| [`GET /v1/rfq/withdrawals/{withdrawalId}`](#get-v1-rfq-withdrawals-withdrawalid) | `getWithdrawal` | Get a withdrawal. | HMAC |

## List deposits {#get-v1-rfq-deposits}

`GET /v1/rfq/deposits`

| Field | Value |
|-------|-------|
| Operation ID | `listDeposits` |
| Authentication | HMAC |

Returns deposits observed and credited by Silhouette for the signed account.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `limit` | query | No | integer (int32) | Page size. Defaults to 50, maximum 100. |
| `cursor` | query | No | string | Opaque pagination cursor from a previous page's `nextCursor`. Clients must not parse or construct it. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Deposits page. | [DepositsPage](/api/spec/schemas#depositspage) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Get a deposit {#get-v1-rfq-deposits-depositid}

`GET /v1/rfq/deposits/{depositId}`

| Field | Value |
|-------|-------|
| Operation ID | `getDeposit` |
| Authentication | HMAC |

Returns a single deposit owned by the signed account. A chain transaction
can carry several deposits, so the lookup is by stable deposit ID.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `depositId` | path | Yes | string | Stable Silhouette deposit ID. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Deposit detail. | [Deposit](/api/spec/schemas#deposit) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Deposit belongs to another account. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `404` | Not found. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## List withdrawals {#get-v1-rfq-withdrawals}

`GET /v1/rfq/withdrawals`

| Field | Value |
|-------|-------|
| Operation ID | `listWithdrawals` |
| Authentication | HMAC |

Returns withdrawals for the signed account.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `limit` | query | No | integer (int32) | Page size. Defaults to 50, maximum 100. |
| `cursor` | query | No | string | Opaque pagination cursor from a previous page's `nextCursor`. Clients must not parse or construct it. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Withdrawals page. | [WithdrawalsPage](/api/spec/schemas#withdrawalspage) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Create a withdrawal {#post-v1-rfq-withdrawals}

`POST /v1/rfq/withdrawals`

| Field | Value |
|-------|-------|
| Operation ID | `createWithdrawal` |
| Authentication | HMAC |

Reserves the funds and queues an asynchronous on-chain withdrawal to the
account's registered address; the caller cannot specify a destination. Not
idempotent.

### Parameters

None.

### Request body

Content type: `application/json`

Schema: [CreateWithdrawalRequest](/api/spec/schemas#createwithdrawalrequest)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | [PositiveDecimalString](/api/spec/schemas#positivedecimalstring) | Yes |  |
| `token` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes |  |

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | Withdrawal accepted for processing. | [CreateWithdrawalResponse](/api/spec/schemas#createwithdrawalresponse) |
| `400` | Invalid request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `409` | Insufficient balance. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Get a withdrawal {#get-v1-rfq-withdrawals-withdrawalid}

`GET /v1/rfq/withdrawals/{withdrawalId}`

| Field | Value |
|-------|-------|
| Operation ID | `getWithdrawal` |
| Authentication | HMAC |

Returns a single withdrawal owned by the signed account.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `withdrawalId` | path | Yes | string | Silhouette withdrawal ID. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Withdrawal detail. | [Withdrawal](/api/spec/schemas#withdrawal) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Withdrawal belongs to another account. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `404` | Not found. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |
