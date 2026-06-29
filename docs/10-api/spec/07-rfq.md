---
title: RFQ API
sidebar_label: RFQ
slug: /api/spec/rfq
---

:::warning
The Silhouette REST API v1 spec is in beta and may change as RFQ workflows evolve.
:::

RFQ taker request, quote-read, and acceptance operations.

## Operations

| Endpoint | Operation ID | Summary | Auth |
|----------|--------------|---------|------|
| [`POST /v1/rfq/requests`](#post-v1-rfq-requests) | `createRfqRequest` | Submit an RFQ request. | HMAC |
| [`GET /v1/rfq/requests`](#get-v1-rfq-requests) | `listRfqRequests` | List RFQ requests. | HMAC |
| [`GET /v1/rfq/rfqs`](#get-v1-rfq-rfqs) | `listSettledRfqs` | List settled RFQs (trades). | HMAC |
| [`GET /v1/rfq/requests/{id}`](#get-v1-rfq-requests-id) | `getRfqRequest` | Get an RFQ request. | HMAC |
| [`POST /v1/rfq/requests/{id}/accept`](#post-v1-rfq-requests-id-accept) | `acceptRfqQuote` | Accept a quote. | HMAC |
| [`POST /v1/rfq/requests/{id}/cancel`](#post-v1-rfq-requests-id-cancel) | `cancelRfqRequest` | Cancel an RFQ request. | HMAC |
| [`GET /v1/rfq/requests/{id}/quotes`](#get-v1-rfq-requests-id-quotes) | `listRfqRequestQuotes` | List the quotes on an RFQ request. | HMAC |

## Submit an RFQ request {#post-v1-rfq-requests}

`POST /v1/rfq/requests`

| Field | Value |
|-------|-------|
| Operation ID | `createRfqRequest` |
| Authentication | HMAC |

Accepts an RFQ request for orchestration. The request is written `Pending`
and the engine settles it asynchronously; poll `GET /v1/rfq/requests/{id}`
or the WebSocket for the outcome. Not idempotent.

### Parameters

None.

### Request body

Content type: `application/json`

Schema: [CreateRfqRequestInput](/api/spec/schemas#createrfqrequestinput)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `autoAccept` | boolean | No | Quote-selection mode. When `false` (the default) the taker reads the competing quotes and explicitly accepts one with `POST /v1/rfq/requests/{id}/accept` before the deadline (the three-round flow); funds lock at acceptance. When `true` the engine auto-accepts the best conforming quote at the deadline (the two-round flow); funds lock at submission. |
| `baseQty` | [PositiveDecimalString](/api/spec/schemas#positivedecimalstring) | Yes |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes | Canonical instrument identifier (e.g. `XTSLA-USDC-SPOT`). |
| `quoteLimit` | [PositiveDecimalString](/api/spec/schemas#positivedecimalstring) | Yes | BUY = max we'll pay; SELL = min we'll accept. |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |
| `windowSecs` | integer (int64) | No | How long the RFQ stays open for quotes, in seconds - the taker's lever on the speed/price-discovery tradeoff: a short window settles a time-sensitive order quickly; a longer one gathers more competitive quotes. Clamped server-side to `[1, operator-max]`, where the operator-configured default window is the max; omit it to use that default. The bound is coupled to the maximum quote lifetime (`windowSecs + settlement_headroom <= max_quote_lifetime`), so a quote stays acceptable for the entire window. |

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | Accepted for orchestration. | [CreateRfqRequestResponse](/api/spec/schemas#createrfqrequestresponse) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `409` | Insufficient balance. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `503` | Solvency-locked. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## List RFQ requests {#get-v1-rfq-requests}

`GET /v1/rfq/requests`

| Field | Value |
|-------|-------|
| Operation ID | `listRfqRequests` |
| Authentication | HMAC |

Returns the signed account's RFQ requests in every lifecycle state, most
recent first.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `limit` | query | No | integer (int32) | Page size. Defaults to 50, maximum 100. |
| `cursor` | query | No | string | Opaque pagination cursor from a previous page's `nextCursor`. Clients must not parse or construct it. |
| `status` | query | No | array of [RfqStatus](/api/spec/schemas#rfqstatus) | Filter by one or more lifecycle statuses. Repeat the key for multiple, e.g. `?status=QUOTED&status=SETTLED`. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | RFQ requests page. | [RfqsPage](/api/spec/schemas#rfqspage) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## List settled RFQs (trades) {#get-v1-rfq-rfqs}

`GET /v1/rfq/rfqs`

| Field | Value |
|-------|-------|
| Operation ID | `listSettledRfqs` |
| Authentication | HMAC |

Returns the signed account's settled RFQs - the executed trades - newest
first. A trade is an RFQ in the `SETTLED` state carrying its settlement
transaction hash and `settledAt`. This is the reconciliation surface for
completed trades, distinct from `GET /v1/rfq/requests`, which lists requests
in every lifecycle state.

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
| `200` | Settled RFQs page. | [RfqsPage](/api/spec/schemas#rfqspage) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Forbidden: the access key is recognised but the request signature does not match the HMAC the gateway recomputes over the received request. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Get an RFQ request {#get-v1-rfq-requests-id}

`GET /v1/rfq/requests/{id}`

| Field | Value |
|-------|-------|
| Operation ID | `getRfqRequest` |
| Authentication | HMAC |

Returns a single RFQ request owned by the signed account, in any lifecycle
state.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `id` | path | Yes | string | RFQ request ID. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Request detail. | [Rfq](/api/spec/schemas#rfq) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Request belongs to another account. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `404` | Not found. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Accept a quote {#post-v1-rfq-requests-id-accept}

`POST /v1/rfq/requests/{id}/accept`

| Field | Value |
|-------|-------|
| Operation ID | `acceptRfqQuote` |
| Authentication | HMAC |

Explicitly accepts one quote on an RFQ the taker submitted with
`autoAccept: false`. Acceptance locks the taker's funds and commits to that
quote, so the trade can settle before the RFQ deadline ("early"). It is
valid only while the request is `Pending` and the chosen quote is still
`Submitted` and unexpired. The maker retains the option not to deliver, in
which case the trade fails (cascading to another maker where one exists).

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `id` | path | Yes | string | RFQ request ID. |

### Request body

Content type: `application/json`

Schema: [AcceptRfqQuoteRequest](/api/spec/schemas#acceptrfqquoterequest)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quoteId` | [QuoteId](/api/spec/schemas#quoteid) | Yes |  |

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | Quote accepted; settlement proceeds. | [Rfq](/api/spec/schemas#rfq) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Request belongs to another account. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `404` | Request or quote not found. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `409` | Request is not Pending, the quote is no longer acceptable, or the funds are insufficient. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Cancel an RFQ request {#post-v1-rfq-requests-id-cancel}

`POST /v1/rfq/requests/{id}/cancel`

| Field | Value |
|-------|-------|
| Operation ID | `cancelRfqRequest` |
| Authentication | HMAC |

Cancels the signed account's own still-open RFQ before its deadline and
releases any funds locked for it - the safety affordance for a taker who
submitted in error or saw the market move. An RFQ that is already settled,
failed, cancelled, or past its deadline cannot be cancelled.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `id` | path | Yes | string | RFQ request ID. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The cancelled RFQ. | [Rfq](/api/spec/schemas#rfq) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Request belongs to another account. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `404` | Not found. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `409` | The RFQ is no longer open and cannot be cancelled. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## List the quotes on an RFQ request {#get-v1-rfq-requests-id-quotes}

`GET /v1/rfq/requests/{id}/quotes`

| Field | Value |
|-------|-------|
| Operation ID | `listRfqRequestQuotes` |
| Authentication | HMAC |

Returns the competing quotes on the taker's own RFQ, for the taker to choose
one to accept (`autoAccept: false`). The view carries no Permit2
authorisation - that is the winning maker's settlement secret.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `id` | path | Yes | string | RFQ request ID. |
| `limit` | query | No | integer (int32) | Page size. Defaults to 50, maximum 100. |
| `cursor` | query | No | string | Opaque pagination cursor from a previous page's `nextCursor`. Clients must not parse or construct it. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Quotes on the request. | [QuotesPage](/api/spec/schemas#quotespage) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Request belongs to another account. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `404` | Not found. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |
