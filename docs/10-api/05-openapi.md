---
title: OpenAPI Specification
sidebar_label: OpenAPI Specification
slug: /api/openapi
description: "Generate strongly-typed client libraries from the Silhouette OpenAPI spec. Supports TypeScript, Python, Go, Rust, and more."
keywords:
  - Silhouette API
  - Hyperliquid API
  - trading API
  - API reference
  - programmatic trading
  - Python SDK
  - DeFi API
---

:::warning
The Silhouette API and SDK are in beta. We are actively adding new operations.
:::

## Overview

For developers who want to build strongly-typed integrations, we provide an OpenAPI specification for the Silhouette API. The spec is available at:

```text
https://api.silhouette.exchange/swagger/v0/json
```

You can use this specification with code generation tools to automatically create type-safe client libraries in your preferred programming language. For a ready-to-use client, see the [Python SDK](/sdk).

## Using the OpenAPI Specification

### What Is OpenAPI?

OpenAPI (formerly known as Swagger) is a standard specification format for describing RESTful APIs. It provides a machine-readable description of your API's endpoints, request/response formats, authentication methods, and more.

### Generate Client Libraries

You can use the [OpenAPI Generator](https://openapi-generator.tech/) tool to automatically generate client SDKs in your preferred programming language.

**Example: Generate a TypeScript Client**

```bash
# Install the OpenAPI Generator CLI
npm install @openapitools/openapi-generator-cli -g

# Generate a TypeScript Axios client
openapi-generator-cli generate \
  -i https://api.silhouette.exchange/swagger/v0/json \
  -g typescript-axios \
  -o ./generated-client
```

**Example: Generate a Python Client**

```bash
openapi-generator-cli generate \
  -i https://api.silhouette.exchange/swagger/v0/json \
  -g python \
  -o ./generated-client
```

The generator supports many languages including JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby, and more. See the [OpenAPI Generator documentation](https://openapi-generator.tech/docs/generators) for a complete list.

### Benefits of Using Generated Clients

- **Type safety**: Generated clients include full type definitions for all operations and data structures
- **Validation**: Built-in request/response validation based on the OpenAPI schema
- **Auto-completion**: IDE support for all API methods and parameters
- **Documentation**: Inline documentation from the OpenAPI spec
- **Consistency**: Guaranteed compatibility with the API specification

## Interactive Documentation

You can also use the OpenAPI specification with [Swagger UI](https://swagger.io/tools/swagger-ui/) to create interactive API documentation:

```bash
# Using Docker
docker run -p 8080:8080 \
  -e SWAGGER_JSON_URL=https://api.silhouette.exchange/swagger/v0/json \
  swaggerapi/swagger-ui
```

Then visit `http://localhost:8080` to explore the API interactively.

## Resources

- [OpenAPI Specification Documentation](https://spec.openapis.org/oas/latest.html) - Learn about the OpenAPI spec format
- [OpenAPI Generator](https://openapi-generator.tech/) - Generate client SDKs, server stubs, and API documentation
- [OpenAPI Generator Generators List](https://openapi-generator.tech/docs/generators) - See all supported languages
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive API documentation
- [Silhouette API Reference](/api/reference) - Complete operation documentation
- [Silhouette API Quick Start](/api/quick-start) - Get started with your first API call
