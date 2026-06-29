---
title: Balances API
sidebar_label: Balances
slug: /api/spec/balances
---

Private account balance state.

## Operations

| Endpoint | Operation ID | Summary | Auth |
|----------|--------------|---------|------|
| [`GET /v1/rfq/balances`](#get-v1-rfq-balances) | `getBalances` | Get balances. | HMAC |
| [`GET /v1/rfq/ledger`](#get-v1-rfq-ledger) | `getLedger` | Get the account ledger. | HMAC |

## Get balances {#get-v1-rfq-balances}

`GET /v1/rfq/balances`

| Field | Value |
|-------|-------|
| Operation ID | `getBalances` |
| Authentication | HMAC |

Returns the signed account's token balances.

### Parameters

None.

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Balances for the signed account. | [GetBalancesResponse](/api/spec/schemas#getbalancesresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Get the account ledger {#get-v1-rfq-ledger}

`GET /v1/rfq/ledger`

| Field | Value |
|-------|-------|
| Operation ID | `getLedger` |
| Authentication | HMAC |

Returns the signed account's recent ledger entries - the append-only audit
rows behind every balance change (deposit, fill, withdrawal, adjustment),
newest first. A reconciliation surface for auditing balance movements.

### Parameters

None.

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The account's recent ledger entries. | [GetLedgerResponse](/api/spec/schemas#getledgerresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |
