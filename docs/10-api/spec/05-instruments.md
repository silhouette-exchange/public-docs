---
title: Instruments API
sidebar_label: Instruments
slug: /api/spec/instruments
---

Public instrument metadata.

## Operations

| Endpoint | Operation ID | Summary | Auth |
|----------|--------------|---------|------|
| [`GET /v1/rfq/instruments`](#get-v1-rfq-instruments) | `listInstruments` | List supported instruments. | None |

## List supported instruments {#get-v1-rfq-instruments}

`GET /v1/rfq/instruments`

| Field | Value |
|-------|-------|
| Operation ID | `listInstruments` |
| Authentication | None |

Returns the instruments currently tradable through Silhouette, sorted by `instrumentId`
ascending.

### Parameters

None.

### Request body

None.

### Responses

| Status | Description | Schema |
|--------|-------------|--------|
| `200` | Supported instruments. | [ListInstrumentsResponse](/api/spec/schemas#listinstrumentsresponse) |
| `500` | Internal server error. | [ErrorResponse](/api/spec/schemas#errorresponse) |
