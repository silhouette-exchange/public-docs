---
title: Compliance
sidebar_label: Compliance
pagination_label: Compliance
description: "How Silhouette screens addresses, supports AML/CTF obligations, and plans for KYC-gated features."
keywords:
  - compliance
  - AML
  - CTF
  - sanctions screening
  - KYC
  - Silhouette Exchange
  - regulated trading
---

# Compliance

## Who This Is For

This page is for institutions, compliance teams, and traders who need to understand how Silhouette handles regulatory obligations before onboarding. It describes the controls in place for funds, desks, and regulated entities evaluating Silhouette.

## Why Compliance Matters on a Shielded Platform

Silhouette's shielded execution is designed to protect legitimate trading strategy from public-ledger exposure. The compliance layer is designed to deter and block use by sanctioned or high-risk actors. Shielding and screening operate as complementary controls, not as trade-offs.

Shielded execution without a compliance layer is not viable for institutional participation. Funds, desks, and regulated entities require documented screening controls before they can engage with a platform that obscures onchain activity. The compliance engine is a baseline requirement for that engagement, not an optional add-on.

## How Screening Works

Silhouette screens all user addresses through a compliance engine before granting access to the platform. The compliance engine gates access to Silhouette's frontend and backend in both naked and shielded modes.

Multiple criteria are used to determine whether an address is permitted to access Silhouette, including:

- **Sanctions lists** - addresses appearing on OFAC, EU, or other applicable sanctions lists
- **Restricted jurisdictions** - access attempts from blocked regions
- **Exposure analysis** - addresses with material exposure to sanctioned entities

Should Silhouette's primary compliance partner become unavailable, a backup provider ensures continuous screening. Access to the platform is blocked in the unlikely event that both compliance providers are temporarily offline. Silhouette does not fall back to unscreened access.

## AML and CTF

The purpose of Silhouette's compliance engine is to support compliance with applicable AML and CTF laws. These obligations exist across jurisdictions and apply to platforms that facilitate financial transactions, regardless of whether they custody funds directly.

Screening is implemented at the platform architecture layer rather than as an external wrapper.

## KYC-Gated Features

Silhouette plans to support KYC-gated access to selected features for regulated entities. The first KYC-gated feature will be **Request for Quote (RFQ)** orders, which allow institutional participants to request block-sized quotes from verified market makers within the shielded environment.

KYC verification will be handled through a third-party identity provider. Details on the verification process and supported jurisdictions will be published ahead of launch.

## Applicability by User Type

- **Retail traders.** Wallet connection triggers automatic address screening. No manual steps are required.
- **Institutions and desks.** The screening layer provides documented controls for compliance review. KYC-gated features are planned for entities requiring additional verification.
- **Developers.** API access is gated by the same compliance engine. Authenticated sessions require a screened address.

For details on how Silhouette's architecture separates shielded execution from compliance, see [Architecture Overview](/architecture/overview).

<TechArticleSchema
  headline="Silhouette Compliance"
  description="How Silhouette screens addresses, supports AML/CTF obligations, and plans for KYC-gated features."
  proficiencyLevel="Intermediate"
  keywords={['compliance', 'AML', 'CTF', 'sanctions screening', 'KYC', 'Silhouette Exchange']}
/>
