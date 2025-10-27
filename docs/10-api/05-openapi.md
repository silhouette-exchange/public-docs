---
title: OpenAPI specification
sidebar_label: OpenAPI specification
slug: /api/openapi
---

:::warning
The Silhouette API is currently in beta and under active development on testnet. More operations and features will be added soon.
:::

## Overview

For developers who want to build strongly-typed integrations, we provide an OpenAPI specification for the Silhouette API. The spec is available at:

```text
<API_URL>/swagger/v0/json
```

You can use this specification with code generation tools to automatically create type-safe client libraries in your preferred programming language.

## Using the OpenAPI specification

### What is OpenAPI?

OpenAPI (formerly known as Swagger) is a standard specification format for describing RESTful APIs. It provides a machine-readable description of your API's endpoints, request/response formats, authentication methods, and more.

### Generate client libraries

You can use the [OpenAPI Generator](https://openapi-generator.tech/) tool to automatically generate client SDKs in your preferred programming language.

**Example: Generate a TypeScript client**

```bash
# Install the OpenAPI Generator CLI
npm install @openapitools/openapi-generator-cli -g

# Generate a TypeScript Axios client
openapi-generator-cli generate \
  -i <API_URL>/swagger/v0/json \
  -g typescript-axios \
  -o ./generated-client
```

**Example: Generate a Python client**

```bash
openapi-generator-cli generate \
  -i <API_URL>/swagger/v0/json \
  -g python \
  -o ./generated-client
```

The generator supports many languages including JavaScript, TypeScript, Python, Java, Go, Rust, PHP, Ruby, and more. See the [OpenAPI Generator documentation](https://openapi-generator.tech/docs/generators) for a complete list.

### Benefits of using generated clients

- **Type safety**: Generated clients include full type definitions for all operations and data structures
- **Validation**: Built-in request/response validation based on the OpenAPI schema
- **Auto-completion**: IDE support for all API methods and parameters
- **Documentation**: Inline documentation from the OpenAPI spec
- **Consistency**: Guaranteed compatibility with the API specification

## Interactive documentation

You can also use the OpenAPI specification with [Swagger UI](https://swagger.io/tools/swagger-ui/) to create interactive API documentation:

```bash
# Using Docker
docker run -p 8080:8080 \
  -e SWAGGER_JSON_URL=<API_URL>/swagger/v0/json \
  swaggerapi/swagger-ui
```

Then visit `http://localhost:8080` to explore the API interactively.

## Resources

- [OpenAPI Specification Documentation](https://spec.openapis.org/oas/latest.html) – Learn about the OpenAPI spec format
- [OpenAPI Generator](https://openapi-generator.tech/) – Generate client SDKs, server stubs, and API documentation
- [OpenAPI Generator Generators List](https://openapi-generator.tech/docs/generators) – See all supported languages
- [Swagger UI](https://swagger.io/tools/swagger-ui/) – Interactive API documentation
