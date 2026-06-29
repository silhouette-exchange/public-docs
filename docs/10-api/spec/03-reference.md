---
title: REST API v1 endpoint index
sidebar_label: Endpoint index
slug: /api/spec/reference
---

This index links to the generated endpoint reference pages for every operation in the OpenAPI spec.

## Endpoints

| Area | Endpoint | Operation ID | Summary | Auth |
|------|----------|--------------|---------|------|
| Auth | [`POST /v1/auth/challenge`](/api/spec/authentication#post-v1-auth-challenge) | `authChallenge` | Request a login challenge. | None |
| Auth | [`POST /v1/auth/api-keys`](/api/spec/authentication#post-v1-auth-api-keys) | `siweLogin` | SIWE login - mint an HMAC credential pair. | None |
| Auth | [`GET /v1/auth/api-keys`](/api/spec/authentication#get-v1-auth-api-keys) | `listApiKeys` | List the caller's API keys. | HMAC |
| Auth | [`DELETE /v1/auth/api-keys`](/api/spec/authentication#delete-v1-auth-api-keys) | `revokeAllApiKeys` | Revoke all the caller's API keys. | HMAC |
| Auth | [`DELETE /v1/auth/api-keys/{accessKey}`](/api/spec/authentication#delete-v1-auth-api-keys-accesskey) | `revokeApiKey` | Revoke one API key. | HMAC |
| Instruments | [`GET /v1/rfq/instruments`](/api/spec/instruments#get-v1-rfq-instruments) | `listInstruments` | List supported instruments. | None |
| Balances | [`GET /v1/rfq/balances`](/api/spec/balances#get-v1-rfq-balances) | `getBalances` | Get balances. | HMAC |
| Balances | [`GET /v1/rfq/ledger`](/api/spec/balances#get-v1-rfq-ledger) | `getLedger` | Get the account ledger. | HMAC |
| RFQ | [`POST /v1/rfq/requests`](/api/spec/rfq#post-v1-rfq-requests) | `createRfqRequest` | Submit an RFQ request. | HMAC |
| RFQ | [`GET /v1/rfq/requests`](/api/spec/rfq#get-v1-rfq-requests) | `listRfqRequests` | List RFQ requests. | HMAC |
| RFQ | [`GET /v1/rfq/rfqs`](/api/spec/rfq#get-v1-rfq-rfqs) | `listSettledRfqs` | List settled RFQs (trades). | HMAC |
| RFQ | [`GET /v1/rfq/requests/{id}`](/api/spec/rfq#get-v1-rfq-requests-id) | `getRfqRequest` | Get an RFQ request. | HMAC |
| RFQ | [`POST /v1/rfq/requests/{id}/accept`](/api/spec/rfq#post-v1-rfq-requests-id-accept) | `acceptRfqQuote` | Accept a quote. | HMAC |
| RFQ | [`POST /v1/rfq/requests/{id}/cancel`](/api/spec/rfq#post-v1-rfq-requests-id-cancel) | `cancelRfqRequest` | Cancel an RFQ request. | HMAC |
| RFQ | [`GET /v1/rfq/requests/{id}/quotes`](/api/spec/rfq#get-v1-rfq-requests-id-quotes) | `listRfqRequestQuotes` | List the quotes on an RFQ request. | HMAC |
| Maker | [`POST /v1/rfq/quotes`](/api/spec/maker#post-v1-rfq-quotes) | `createMakerQuote` | Submit a quote. | HMAC |
| Maker | [`GET /v1/rfq/quotes`](/api/spec/maker#get-v1-rfq-quotes) | `listMakerQuotes` | List the maker's quotes. | HMAC |
| Maker | [`POST /v1/rfq/quotes/{quoteId}/cancel`](/api/spec/maker#post-v1-rfq-quotes-quoteid-cancel) | `cancelMakerQuote` | Cancel a quote. | HMAC |
| Maker | [`GET /v1/rfq/requests/open`](/api/spec/maker#get-v1-rfq-requests-open) | `listMakerRequests` | List open RFQs to quote. | HMAC |
| Funding | [`GET /v1/rfq/deposits`](/api/spec/funding#get-v1-rfq-deposits) | `listDeposits` | List deposits. | HMAC |
| Funding | [`GET /v1/rfq/deposits/{depositId}`](/api/spec/funding#get-v1-rfq-deposits-depositid) | `getDeposit` | Get a deposit. | HMAC |
| Funding | [`GET /v1/rfq/withdrawals`](/api/spec/funding#get-v1-rfq-withdrawals) | `listWithdrawals` | List withdrawals. | HMAC |
| Funding | [`POST /v1/rfq/withdrawals`](/api/spec/funding#post-v1-rfq-withdrawals) | `createWithdrawal` | Create a withdrawal. | HMAC |
| Funding | [`GET /v1/rfq/withdrawals/{withdrawalId}`](/api/spec/funding#get-v1-rfq-withdrawals-withdrawalid) | `getWithdrawal` | Get a withdrawal. | HMAC |
