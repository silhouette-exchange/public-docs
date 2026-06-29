---
title: OpenAPI tools
sidebar_label: OpenAPI tools
slug: /api/openapi
---

:::warning
The Silhouette API and SDK is currently in beta and under active development. More operations and features will be added soon.
:::

## Spec sources

For developers who want to build strongly-typed integrations, Silhouette provides OpenAPI specifications for the available API surfaces.

| API | Spec URL | Notes |
|-----|----------|-------|
| REST API v1/RFQ | [`/api/rfq-openapi.yaml`](/api/rfq-openapi.yaml) | OpenAPI source for the generated RFQ API Spec section |
| `/v0` operation API | `https://api.silhouette.exchange/swagger/v0/json` | Live Swagger JSON for the operation-style API |

The REST API v1 spec also has a dedicated docs section:

- [RFQ API Spec overview](/docs/api/spec)
- [HMAC authentication](/docs/api/spec/authentication)
- [Endpoint index](/docs/api/spec/reference)
- [Schema catalog](/docs/api/spec/schemas)

## Using OpenAPI specs

You can use these specifications with code generation tools to automatically create type-safe client libraries in your preferred programming language.

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
  -i https://docs.silhouette.exchange/api/rfq-openapi.yaml \
  -g typescript-axios \
  -o ./generated-client
```

**Example: Generate a Python client**

```bash
openapi-generator-cli generate \
  -i https://docs.silhouette.exchange/api/rfq-openapi.yaml \
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
  -e SWAGGER_JSON_URL=https://docs.silhouette.exchange/api/rfq-openapi.yaml \
  swaggerapi/swagger-ui
```

Then visit `http://localhost:8080` to explore the API interactively.

## Resources

- [OpenAPI Specification Documentation](https://spec.openapis.org/oas/latest.html) – Learn about the OpenAPI spec format
- [OpenAPI Generator](https://openapi-generator.tech/) – Generate client SDKs, server stubs, and API documentation
- [OpenAPI Generator Generators List](https://openapi-generator.tech/docs/generators) – See all supported languages
- [Swagger UI](https://swagger.io/tools/swagger-ui/) – Interactive API documentation
