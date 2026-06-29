---
title: RFQ API Spec
sidebar_label: Overview
slug: /api/spec
---

:::warning
The Silhouette REST API v1 spec is in beta and may change as RFQ workflows evolve.
:::

This section is generated from the OpenAPI 3.1 specification for the Silhouette REST API v1 RFQ surface. It is separate from the older `/v0` operation-style API guides.

For a plain-language explanation of how RFQs work, see the top-level [RFQ overview](/docs/rfq/overview).

## Base URL

```text
https://api.silhouette.exchange
```

## Source

- **API title**: `Silhouette REST API v1`
- **Spec version**: `1.0.0`
- **Raw OpenAPI YAML**: [rfq-openapi.yaml](/api/rfq-openapi.yaml)

## Reference sections

| Section | Description | Operations |
|---------|-------------|------------|
| [Auth](/docs/api/spec/auth) | SIWE login and HMAC credential issuance. | 5 |
| [Instruments](/docs/api/spec/instruments) | Public instrument metadata. | 1 |
| [Balances](/docs/api/spec/balances) | Private account balance state. | 2 |
| [RFQ](/docs/api/spec/rfq) | RFQ taker request, quote-read, and acceptance operations. | 7 |
| [Maker](/docs/api/spec/maker) | Maker-side RFQ operations (maker-scoped). | 4 |
| [Funding](/docs/api/spec/funding) | Deposits and withdrawals. | 5 |

## Authentication model

Public endpoints are unauthenticated. Private endpoints use HMAC-signed requests with credentials minted through SIWE login. See [HMAC authentication](/docs/api/spec/authentication) and the [E2E auth flow](/docs/api/spec/auth-flow).

## Schemas

All request, response, and shared component models are listed in the [schema catalog](/docs/api/spec/schemas).
