---
title: REST API v1 schemas
sidebar_label: Schemas
slug: /api/spec/schemas
---

Component schemas from the OpenAPI specification.

## ChallengeResponse

A single-use SIWE login challenge.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nonce` | string (uuid) | Yes | Single-use nonce to embed in the SIWE login message; expires shortly. |

## LoginRequest

A SIWE login, exchanged at `POST /v1/auth/api-keys` for an HMAC credential pair.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The SIWE (EIP-4361) message, embedding the challenge nonce and this gateway's domain and chain id. |
| `signature` | string | Yes | The wallet's signature over `message`, as a 0x-prefixed hex string. |
| `expiresInSecs` | integer \| null (int64) | No | Requested credential lifetime in seconds. Omit for the two-week default; capped at three months (90 days), beyond which the request is rejected. |

## LoginResponse

The credential pair minted by a SIWE login, bound to the authenticated account. The secret is returned only here.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string (uuid) | Yes |  |
| `account` | [EvmAddress](/api/spec/schemas#evmaddress) | Yes |  |
| `accessKey` | string | Yes | Public access key, sent on every request as `Authorization: Bearer <access-key>`. |
| `secret` | string | Yes | Base64 secret - returned once. Sign requests with it; never send it on the wire. |
| `expiresAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | Credential expiry. |
| `makerId` | string \| null | No | Present when the account is a registered active market maker, so the client knows to expose the maker surface. |

## ApiKeyView

One of the caller's live API keys, as returned by the listing. The secret is
absent by construction - returned once at issuance and never again - so the
listing exposes only the public access key and its lifetime.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accessKey` | string | Yes | Public access key - the `Authorization: Bearer` token for this credential. |
| `createdAtMs` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | When the key was minted. |
| `expiresAtMs` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | When the key expires. |

## ApiKeysResponse

The caller's live API keys.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keys` | array of [ApiKeyView](/api/spec/schemas#apikeyview) | Yes | The caller's live keys, newest first. |

## LedgerView

One ledger entry - the append-only audit row behind a balance change.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ledgerId` | string (uuid) | Yes |  |
| `token` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes |  |
| `delta` | string | Yes | The signed change applied to the balance - positive for a credit, negative for a debit (e.g. `-100`). |
| `source` | string (enum) | Yes | What produced the entry. |
| `createdAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |

## GetLedgerResponse

The account's recent ledger entries, newest first.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `entries` | array of [LedgerView](/api/spec/schemas#ledgerview) | Yes |  |

## AcceptRfqQuoteRequest

Body of `POST /v1/rfq/requests/{id}/accept`: the quote the taker is
accepting, chosen from `GET /v1/rfq/requests/{id}/quotes`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quoteId` | [QuoteId](/api/spec/schemas#quoteid) | Yes |  |

## ApiError


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Stable machine-readable error code, e.g. `INVALID_REQUEST`, `INSUFFICIENT_BALANCE`, `NOT_FOUND`. Open set - new codes are additive. |
| `details` | null \| [ErrorDetails](/api/spec/schemas#errordetails) | No |  |
| `message` | string | Yes | Human-readable message. Not a stable machine contract. |

## Balance

One token's balance: available + locked, plus their `total` for
convenience. Amounts are canonical decimal strings.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `available` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |
| `locked` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |
| `token` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes |  |
| `total` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |

## DecimalString

Exact non-negative canonical decimal string in human-readable units. Responses use canonical formatting with no scientific notation, separators, leading plus sign, unnecessary leading zeros, trailing fractional zeros, or decimal point for integer values. Request parsing accepts and normalises semantically equivalent trailing fractional zeros such as `1.0` or `0.000`; leading plus signs, unnecessary leading zeros, whitespace, scientific notation, missing integer digits, and missing fractional digits are rejected.

Type: `string`

## DepositId

Opaque resource identifier, prefixed `dep_` (the remainder is the id in hex).

Type: `string`

## DepositStatus

Public deposit lifecycle. Our model observes an on-chain transfer and then
credits it; a deposit only appears in the API once credited, so it maps to
`Completed`. `Pending` / `Failed` round out the contract's shape for clients
branching on status. Wire form is `SCREAMING_SNAKE_CASE`; there is no DB enum
(deposits carry no status column - the status is derived).

Allowed values: `PENDING`, `COMPLETED`, `FAILED`

## Deposit

A taker-facing view of a deposit. A deposit appears here once observed
on-chain; `status` is `COMPLETED` once credited, `PENDING` until then.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |
| `createdAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |
| `depositId` | [DepositId](/api/spec/schemas#depositid) | Yes |  |
| `status` | [DepositStatus](/api/spec/schemas#depositstatus) | Yes |  |
| `token` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes |  |
| `txHash` | [TxHash](/api/spec/schemas#txhash) | Yes |  |
| `updatedAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |

## DepositsPage

A cursor-paginated page of deposits.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hasMore` | boolean | Yes |  |
| `items` | array of [Deposit](/api/spec/schemas#deposit) | Yes |  |
| `nextCursor` | string \| null | No |  |

## ErrorDetails


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `errors` | array of [ValidationErrorDetail](/api/spec/schemas#validationerrordetail) | No | Field-level validation errors; present for `INVALID_REQUEST`. |

## ErrorResponse

Nested error envelope: `{ "error": { "code", "message", "details"? } }`.
`code` is a stable, machine-branchable identifier (an open, additive set);
`message` is human-readable and not a stable contract.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `error` | [ApiError](/api/spec/schemas#apierror) | Yes |  |

## EvmAddress

EVM address, 0x-hex (EIP-55 checksummed on output).

Type: `string`

## GetBalancesResponse

`GET /v1/rfq/balances` response: the account's RFQ balances, one entry per token.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `balances` | array of [Balance](/api/spec/schemas#balance) | Yes |  |

## ListInstrumentsResponse

Response body for `GET /v1/rfq/instruments`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `instruments` | array of [Instrument](/api/spec/schemas#instrument) | Yes |  |

## Instrument

An instrument tradable through Silhouette.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `base` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes | Canonical base-token symbol. |
| `type` | [InstrumentType](/api/spec/schemas#instrumenttype) | Yes |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes | Canonical instrument identifier (`BASE-QUOTE-TYPE`, uppercase). |
| `quote` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes | Canonical quote-token symbol. |

## InstrumentType

The instrument type. `SPOT` in v1; further types are added when they ship.

Allowed values: `SPOT`

## OpenRfqsPage

A page of open RFQs, cursor-paginated like every other v1 list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hasMore` | boolean | Yes |  |
| `items` | array of [OpenRfq](/api/spec/schemas#openrfq) | Yes |  |
| `nextCursor` | string \| null | No |  |

## InstrumentId

Canonical instrument identifier, `BASE-QUOTE-TYPE` uppercase (e.g. `XTSLA-USDC-SPOT`).

Type: `string`

## PositiveDecimalString

Exact positive decimal string in human-readable units for action request fields. Zero and zero-equivalent values such as `0.0` are invalid for these fields.

Type: `string`

## QuoteId

Opaque resource identifier, prefixed `qt_` (the remainder is the id in hex).

Type: `string`

## QuoteStatus

Lifecycle of an RFQ quote from the maker's view. Stored on arrival as
`SUBMITTED`; at the deadline selection marks one `SELECTED` and the rest
`NOT_SELECTED`, or `EXPIRED` when the window closes with no winner. A
`SELECTED` quote then settles: `SETTLED` on success, `FAILED` if settlement
does not complete. A maker may also retract a still-`SUBMITTED` quote
before selection, taking it to `CANCELLED`. Wire form is
`SCREAMING_SNAKE_CASE`.

Allowed values: `SUBMITTED`, `SELECTED`, `NOT_SELECTED`, `EXPIRED`, `SETTLED`, `FAILED`, `CANCELLED`

## MakerQuote

One of the maker's quotes. The Permit2 `spender` and `permitSignature` are
present only once the quote is selected; that is the authorisation the maker
relays to settle on its wrapper.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rfqId` | [RfqId](/api/spec/schemas#rfqid) | Yes |  |
| `quoteId` | [QuoteId](/api/spec/schemas#quoteid) | Yes |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes |  |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |
| `status` | [QuoteStatus](/api/spec/schemas#quotestatus) | Yes |  |
| `makerPays` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `makerReceives` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `expiryMs` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | The quote's expiry; on a win the engine uses it, converted to seconds, as the Permit2 deadline. |
| `receivedAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |
| `permitSignature` | string \| null | No | Engine-signed Permit2 signature (0x-hex), to relay on-chain. Present only when selected. |
| `spender` | null \| [EvmAddress](/api/spec/schemas#evmaddress) | No | Permit2 spender (the maker's wrapper). Present only when selected. |

## MakerQuotesPage

A page of the maker's quotes, cursor-paginated.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hasMore` | boolean | Yes |  |
| `items` | array of [MakerQuote](/api/spec/schemas#makerquote) | Yes |  |
| `nextCursor` | string \| null | No |  |

## Quote

A competing quote on the taker's own RFQ, as the taker sees it when choosing
one to accept. It carries no Permit2 authorisation; the engine-signed permit
is the winning maker's settlement secret and is never exposed to the taker.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quoteId` | [QuoteId](/api/spec/schemas#quoteid) | Yes |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes |  |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |
| `status` | [QuoteStatus](/api/spec/schemas#quotestatus) | Yes |  |
| `makerPays` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `makerReceives` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `expiryMs` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | The quote's expiry, beyond which it can't be accepted. |
| `receivedAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |

## QuotesPage

A page of the competing quotes on a taker's RFQ, cursor-paginated.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hasMore` | boolean | Yes |  |
| `items` | array of [Quote](/api/spec/schemas#quote) | Yes |  |
| `nextCursor` | string \| null | No |  |

## OpenRfq

One open RFQ a maker may quote.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `baseQty` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |
| `createdAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |
| `expiresAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | Auction deadline; the maker must quote before this. |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes |  |
| `id` | [RfqId](/api/spec/schemas#rfqid) | Yes |  |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |

## QuoteLeg

One side of a quote's swap, a token and an exact amount.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes |  |
| `amount` | [PositiveDecimalString](/api/spec/schemas#positivedecimalstring) | Yes |  |

## Side


Allowed values: `BUY`, `SELL`

## XchangeBundle

xchange-mode settlement bundle, for makers that settle via an external
adapter; omit for inventory-mode makers. Silhouette routes by `adapter` and
relays the typed `settlement` to the adapter's wrapper. The settlement payload
is a concrete, validated shape - the engine checks it at quote time and
rejects a malformed bundle synchronously, rather than discovering the failure
on-chain at settlement.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `adapter` | string | Yes | Settlement adapter the bundle targets, for example `BACKED`. |
| `settlement` | [XchangeSettlement](/api/spec/schemas#xchangesettlement) | Yes |  |

## XchangeSettlement

Typed xchange settlement payload. Carries the adapter-signed swap message the
wrapper relays into its `executeSwap`, plus the adapter's signature over it.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `swapMessage` | [SwapMessage](/api/spec/schemas#swapmessage) | Yes |  |
| `backedSignature` | string | Yes | The adapter's signature over `swapMessage`, as a 0x-prefixed 65-byte hex string. |

## SwapMessage

The adapter swap typed-data the wrapper relays on settlement.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `quoteId` | [QuoteId](/api/spec/schemas#quoteid) | Yes |  |
| `expiration` | string | Yes | Unix seconds, as a string; equals the quote's `expiryMs` converted to seconds. |
| `incomingTransfer` | [SwapTransfer](/api/spec/schemas#swaptransfer) | Yes |  |
| `outgoingTransfer` | [SwapTransfer](/api/spec/schemas#swaptransfer) | Yes |  |

## SwapTransfer

One leg of a swap message - a single token transfer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | [EvmAddress](/api/spec/schemas#evmaddress) | Yes |  |
| `from` | [EvmAddress](/api/spec/schemas#evmaddress) | Yes |  |
| `to` | [EvmAddress](/api/spec/schemas#evmaddress) | Yes |  |
| `amount` | string | Yes | Raw token amount (base units), as a decimal string. |

## CreateMakerQuoteRequest

A maker's quote on an open RFQ; the same shape as the MM WebSocket `quote`
frame, over REST. `makerPays` and `makerReceives` are from the maker's side
and must be consistent with the RFQ's instrument and side; the engine
validates this and rejects inconsistent quotes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rfqId` | [RfqId](/api/spec/schemas#rfqid) | Yes |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes |  |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |
| `makerPays` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `makerReceives` | [QuoteLeg](/api/spec/schemas#quoteleg) | Yes |  |
| `expiryMs` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | The quote's expiry; the engine converts it to seconds for the on-chain Permit2 deadline. |
| `xchange` | null \| [XchangeBundle](/api/spec/schemas#xchangebundle) | No | xchange-mode settlement bundle; omit for inventory-mode makers. |

## CreateRfqRequestInput


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `autoAccept` | boolean | No | Quote-selection mode. When `false` (the default) the taker reads the competing quotes and explicitly accepts one with `POST /v1/rfq/requests/{id}/accept` before the deadline (the three-round flow); funds lock at acceptance. When `true` the engine auto-accepts the best conforming quote at the deadline (the two-round flow); funds lock at submission. |
| `baseQty` | [PositiveDecimalString](/api/spec/schemas#positivedecimalstring) | Yes |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes | Canonical instrument identifier (e.g. `XTSLA-USDC-SPOT`). |
| `quoteLimit` | [PositiveDecimalString](/api/spec/schemas#positivedecimalstring) | Yes | BUY = max we'll pay; SELL = min we'll accept. |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |
| `windowSecs` | integer (int64) | No | How long the RFQ stays open for quotes, in seconds - the taker's lever on the speed/price-discovery tradeoff: a short window settles a time-sensitive order quickly; a longer one gathers more competitive quotes. Clamped server-side to `[1, operator-max]`, where the operator-configured default window is the max; omit it to use that default. The bound is coupled to the maximum quote lifetime (`windowSecs + settlement_headroom <= max_quote_lifetime`), so a quote stays acceptable for the entire window. |

## CreateRfqRequestResponse


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | [RfqStatus](/api/spec/schemas#rfqstatus) | Yes |  |
| `rfqId` | [RfqId](/api/spec/schemas#rfqid) | Yes |  |
| `expiresAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | The server-selected auction deadline, derived from the requested (clamped) `windowSecs`. Quotes are gathered until this time; with `autoAccept` the engine selects the winner here. Returned so the client knows the effective expiry without re-deriving it. |

## CreateMakerQuoteResponse


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | [QuoteStatus](/api/spec/schemas#quotestatus) | Yes |  |
| `quoteId` | [QuoteId](/api/spec/schemas#quoteid) | Yes |  |

## TokenSymbol

Canonical uppercase token symbol, e.g. `USDC`.

Type: `string`

## RfqId

Opaque resource identifier, prefixed `rfq_` (the remainder is the id in hex).

Type: `string`

## RfqStatus

RFQ lifecycle state.
- `PENDING`: auction open; quotes may be arriving. A taker-driven RFQ awaits the taker's acceptance; an auto-accept RFQ awaits selection at the deadline.
- `QUOTED`: a winning quote has been committed (accepted or auto-selected); settlement is in progress.
- `SETTLED`: settled on-chain, with the settlement transaction hash set. Terminal; this is a trade.
- `FAILED`: a committed RFQ could not complete (no fillable quote under auto-accept, or the winning maker did not deliver by the deadline); any locked funds are released. Terminal.
- `CANCELLED`: the auction reached its deadline with nothing committed (a taker-driven RFQ with no acceptance); no funds moved. Terminal.

Allowed values: `PENDING`, `QUOTED`, `SETTLED`, `FAILED`, `CANCELLED`

## Rfq

A taker-facing view of one RFQ, across its whole lifecycle. Amounts are
canonical decimal strings; timestamps are epoch-ms; the id carries its `rfq_`
prefix. A trade is an RFQ in the SETTLED state carrying the settlement
transaction hash.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `baseQty` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |
| `createdAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |
| `expiresAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes | Auction deadline. |
| `failureReason` | string \| null | No |  |
| `instrumentId` | [InstrumentId](/api/spec/schemas#instrumentid) | Yes |  |
| `quoteLimit` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |
| `quotedAt` | null \| [UnixMillis](/api/spec/schemas#unixmillis) | No |  |
| `settledAt` | null \| [UnixMillis](/api/spec/schemas#unixmillis) | No |  |
| `side` | [Side](/api/spec/schemas#side) | Yes |  |
| `status` | [RfqStatus](/api/spec/schemas#rfqstatus) | Yes |  |
| `id` | [RfqId](/api/spec/schemas#rfqid) | Yes |  |
| `txHash` | null \| [TxHash](/api/spec/schemas#txhash) | No |  |

## RfqsPage

A cursor-paginated page of RFQs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hasMore` | boolean | Yes |  |
| `items` | array of [Rfq](/api/spec/schemas#rfq) | Yes |  |
| `nextCursor` | string \| null | No | Present only when `hasMore` is true; pass as `cursor` for the next page. |

## TxHash

EVM transaction hash, lowercase 0x-hex.

Type: `string`

## UnixMillis

Unix timestamp in milliseconds.

Type: `integer (int64)`

## ValidationErrorDetail


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `field` | string | Yes | Field path using dot/bracket notation, e.g. `orderIds[3]`. |
| `message` | string \| null | No |  |
| `reason` | string | Yes | Stable validation reason. |

## CreateWithdrawalResponse


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | [WithdrawalStatus](/api/spec/schemas#withdrawalstatus) | Yes |  |
| `withdrawalId` | [WithdrawalId](/api/spec/schemas#withdrawalid) | Yes |  |

## WithdrawalId

Opaque resource identifier, prefixed `wd_` (the remainder is the id in hex).

Type: `string`

## CreateWithdrawalRequest


| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | [PositiveDecimalString](/api/spec/schemas#positivedecimalstring) | Yes |  |
| `token` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes |  |

## WithdrawalStatus

Public withdrawal state. The gateway maps the internal processor states onto this set.
- `PENDING`: requested and funds locked; awaiting operator approval.
- `APPROVED`: operator-authorised for payout, not yet broadcast on-chain.
- `PROCESSING`: the settlement transaction is broadcast on-chain and its receipt is pending.
- `COMPLETED`: sent on-chain, with the settlement transaction hash set; locked funds debited. Terminal.
- `FAILED`: definitely failed; locked funds released. Terminal.
- `UNRESOLVED`: on-chain outcome indeterminate (submitted but unconfirmed); funds stay locked pending operator resolution, not auto-released.

`APPROVED` and `PROCESSING` are kept distinct on purpose: `APPROVED` is the operator-authorised, not-yet-broadcast gate, and `PROCESSING` is in-flight on-chain. Collapsing them would let the processor re-pick an in-flight withdrawal and double-submit it.

Allowed values: `PENDING`, `APPROVED`, `PROCESSING`, `COMPLETED`, `FAILED`, `UNRESOLVED`

## Withdrawal

A taker-facing view of a withdrawal across its lifecycle.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | [DecimalString](/api/spec/schemas#decimalstring) | Yes |  |
| `createdAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |
| `failureReason` | string \| null | No |  |
| `status` | [WithdrawalStatus](/api/spec/schemas#withdrawalstatus) | Yes |  |
| `toAddress` | [EvmAddress](/api/spec/schemas#evmaddress) | Yes |  |
| `token` | [TokenSymbol](/api/spec/schemas#tokensymbol) | Yes |  |
| `txHash` | null \| [TxHash](/api/spec/schemas#txhash) | No |  |
| `updatedAt` | [UnixMillis](/api/spec/schemas#unixmillis) | Yes |  |
| `withdrawalId` | [WithdrawalId](/api/spec/schemas#withdrawalid) | Yes |  |

## WithdrawalsPage

A cursor-paginated page of withdrawals.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hasMore` | boolean | Yes |  |
| `items` | array of [Withdrawal](/api/spec/schemas#withdrawal) | Yes |  |
| `nextCursor` | string \| null | No |  |
