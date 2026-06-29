---
title: REST API v1 endpoint index
sidebar_label: Endpoint index
slug: /api/spec/reference
---

:::warning
The Silhouette REST API v1 spec is in beta and may change as RFQ workflows evolve.
:::

This index links to the generated endpoint reference pages for every operation in the OpenAPI spec.

## Endpoints

| Area | Endpoint | Operation ID | Summary | Auth |
|------|----------|--------------|---------|------|
| Auth | [`POST /v1/auth/challenge`](/docs/api/spec/auth#post-v1-auth-challenge) | `authChallenge` | Request a login challenge. | None |
| Auth | [`POST /v1/auth/api-keys`](/docs/api/spec/auth#post-v1-auth-api-keys) | `siweLogin` | SIWE login - mint an HMAC credential pair. | None |
| Auth | [`GET /v1/auth/api-keys`](/docs/api/spec/auth#get-v1-auth-api-keys) | `listApiKeys` | List the caller's API keys. | HMAC |
| Auth | [`DELETE /v1/auth/api-keys`](/docs/api/spec/auth#delete-v1-auth-api-keys) | `revokeAllApiKeys` | Revoke all the caller's API keys. | HMAC |
| Auth | [`DELETE /v1/auth/api-keys/{accessKey}`](/docs/api/spec/auth#delete-v1-auth-api-keys-accesskey) | `revokeApiKey` | Revoke one API key. | HMAC |
| Instruments | [`GET /v1/rfq/instruments`](/docs/api/spec/instruments#get-v1-rfq-instruments) | `listInstruments` | List supported instruments. | None |
| Balances | [`GET /v1/rfq/balances`](/docs/api/spec/balances#get-v1-rfq-balances) | `getBalances` | Get balances. | HMAC |
| Balances | [`GET /v1/rfq/ledger`](/docs/api/spec/balances#get-v1-rfq-ledger) | `getLedger` | Get the account ledger. | HMAC |
| RFQ | [`POST /v1/rfq/requests`](/docs/api/spec/rfq#post-v1-rfq-requests) | `createRfqRequest` | Submit an RFQ request. | HMAC |
| RFQ | [`GET /v1/rfq/requests`](/docs/api/spec/rfq#get-v1-rfq-requests) | `listRfqRequests` | List RFQ requests. | HMAC |
| RFQ | [`GET /v1/rfq/rfqs`](/docs/api/spec/rfq#get-v1-rfq-rfqs) | `listSettledRfqs` | List settled RFQs (trades). | HMAC |
| RFQ | [`GET /v1/rfq/requests/{id}`](/docs/api/spec/rfq#get-v1-rfq-requests-id) | `getRfqRequest` | Get an RFQ request. | HMAC |
| RFQ | [`POST /v1/rfq/requests/{id}/accept`](/docs/api/spec/rfq#post-v1-rfq-requests-id-accept) | `acceptRfqQuote` | Accept a quote. | HMAC |
| RFQ | [`POST /v1/rfq/requests/{id}/cancel`](/docs/api/spec/rfq#post-v1-rfq-requests-id-cancel) | `cancelRfqRequest` | Cancel an RFQ request. | HMAC |
| RFQ | [`GET /v1/rfq/requests/{id}/quotes`](/docs/api/spec/rfq#get-v1-rfq-requests-id-quotes) | `listRfqRequestQuotes` | List the quotes on an RFQ request. | HMAC |
| Maker | [`POST /v1/rfq/quotes`](/docs/api/spec/maker#post-v1-rfq-quotes) | `createMakerQuote` | Submit a quote. | HMAC |
| Maker | [`GET /v1/rfq/quotes`](/docs/api/spec/maker#get-v1-rfq-quotes) | `listMakerQuotes` | List the maker's quotes. | HMAC |
| Maker | [`POST /v1/rfq/quotes/{quoteId}/cancel`](/docs/api/spec/maker#post-v1-rfq-quotes-quoteid-cancel) | `cancelMakerQuote` | Cancel a quote. | HMAC |
| Maker | [`GET /v1/rfq/requests/open`](/docs/api/spec/maker#get-v1-rfq-requests-open) | `listMakerRequests` | List open RFQs to quote. | HMAC |
| Funding | [`GET /v1/rfq/deposits`](/docs/api/spec/funding#get-v1-rfq-deposits) | `listDeposits` | List deposits. | HMAC |
| Funding | [`GET /v1/rfq/deposits/{depositId}`](/docs/api/spec/funding#get-v1-rfq-deposits-depositid) | `getDeposit` | Get a deposit. | HMAC |
| Funding | [`GET /v1/rfq/withdrawals`](/docs/api/spec/funding#get-v1-rfq-withdrawals) | `listWithdrawals` | List withdrawals. | HMAC |
| Funding | [`POST /v1/rfq/withdrawals`](/docs/api/spec/funding#post-v1-rfq-withdrawals) | `createWithdrawal` | Create a withdrawal. | HMAC |
| Funding | [`GET /v1/rfq/withdrawals/{withdrawalId}`](/docs/api/spec/funding#get-v1-rfq-withdrawals-withdrawalid) | `getWithdrawal` | Get a withdrawal. | HMAC |