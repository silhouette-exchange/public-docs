---
title: Maker API
sidebar_label: Maker
slug: /api/spec/maker
---

Maker-side RFQ operations (maker-scoped).

## Operations

| Endpoint | Operation ID | Summary | Auth |
|----------|--------------|---------|------|
| [`POST /v1/rfq/quotes`](#post-v1-rfq-quotes) | `createMakerQuote` | Submit a quote. | HMAC |
| [`GET /v1/rfq/quotes`](#get-v1-rfq-quotes) | `listMakerQuotes` | List the maker's quotes. | HMAC |
| [`POST /v1/rfq/quotes/{quoteId}/cancel`](#post-v1-rfq-quotes-quoteid-cancel) | `cancelMakerQuote` | Cancel a quote. | HMAC |
| [`GET /v1/rfq/requests/open`](#get-v1-rfq-requests-open) | `listMakerRequests` | List open RFQs to quote. | HMAC |

## Submit a quote {#post-v1-rfq-quotes}

`POST /v1/rfq/quotes`

| Field | Value |
|-------|-------|
| Operation ID | `createMakerQuote` |
| Authentication | HMAC |

Submits a quote for an open RFQ. The quote competes with every other
maker's quote for the same RFQ and wins on best price; the
engine selects a winner at the RFQ deadline, so this is accepted
asynchronously (`202`). Requires a maker-scoped credential.

### Parameters

None.

### Request body

Content type: `application/json`

Schema: [CreateMakerQuoteRequest](/api/spec/schemas#createmakerquoterequest)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rfqId` | [RfqId](/api/spec/schemas#rfqid) | Yes |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes |  |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |
| `makerPays` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `makerReceives` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `expiryMs` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | The quote's expiry; the engine converts it to seconds for the on-chain Permit2 deadline. |
| `xchange` | null \| [XchangeBundle](/api/spec/schemas#xchangebundle) | No | xchange-mode settlement bundle; omit for inventory-mode makers. |

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `202` | Quote accepted; stored as `SUBMITTED`. | [CreateMakerQuoteResponse](/api/spec/schemas#createmakerquoteresponse) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Credential is not maker-scoped. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## List the maker's quotes {#get-v1-rfq-quotes}

`GET /v1/rfq/quotes`

| Field | Value |
|-------|-------|
| Operation ID | `listMakerQuotes` |
| Authentication | HMAC |

Returns the authenticated maker's own quotes, cursor-paginated and
optionally filtered by `status`. A maker polls this to learn outcomes: a
`SELECTED` quote carries the engine-signed Permit2 authorisation it relays to
settle on-chain. Requires a maker-scoped credential.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `limit` | query | No | integer (int32) | Page size. Defaults to 50, maximum 100. |
| `cursor` | query | No | string | Opaque pagination cursor from a previous page's `nextCursor`. Clients must not parse or construct it. |
| `status` | query | No | array of [QuoteStatus](/api/spec/schemas#quotestatus) | Filter by one or more quote statuses. Repeat the key for multiple, e.g. `?status=SELECTED&status=SETTLED`. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | The maker's quotes (`SELECTED` ones carry their permit). | [MakerQuotesPage](/api/spec/schemas#makerquotespage) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Credential is not maker-scoped. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## Cancel a quote {#post-v1-rfq-quotes-quoteid-cancel}

`POST /v1/rfq/quotes/{quoteId}/cancel`

| Field | Value |
|-------|-------|
| Operation ID | `cancelMakerQuote` |
| Authentication | HMAC |

Retracts one of the maker's own still-`SUBMITTED` quotes before the RFQ's
auction selects a winner - and so before the maker holds any signed permit.
The quote is marked `CANCELLED` and drops out of the auction, and both the
maker (`quoteStatus`) and the RFQ owner (`quotes`) are notified; the
response carries the `CANCELLED` quote. To re-price instead, submit a fresh
quote for the same RFQ, which replaces the prior terms. Requires a
maker-scoped credential.

### Parameters

| Name | In | Required | Type | Description |
|------|----|----------|------|-------------|
| `quoteId` | path | Yes | string (uuid) | The quote to cancel. |

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Quote cancelled; dropped from the auction. | [MakerQuote](/api/spec/schemas#makerquote) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Quote belongs to another maker, or the credential is not maker-scoped. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `404` | Not found. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `409` | Quote is no longer open to cancel (already selected, settled, expired, or cancelled). | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |

## List open RFQs to quote {#get-v1-rfq-requests-open}

`GET /v1/rfq/requests/open`

| Field | Value |
|-------|-------|
| Operation ID | `listMakerRequests` |
| Authentication | HMAC |

Returns the open RFQs (`PENDING` requests) on the instruments the authenticated
maker is approved for, cursor-paginated. A maker polls this at its own
cadence, then submits quotes for the ones it wants. Requires a maker-scoped
credential.

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
| `200` | Open RFQs the maker may quote. | [OpenRfqsPage](/api/spec/schemas#openrfqspage) |
| `400` | Invalid request: the body or query parameters failed validation. The error `code` is `INVALID_REQUEST`; `details.errors` carries the field-level reasons. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `401` | Unauthorized: missing or expired credentials, or an unknown access key. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `403` | Credential is not maker-scoped. | [ErrorResponse](/api/spec/schemas#errorresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |
