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

This page is for institutions, compliance teams, and traders who need to understand how Silhouette handles regulatory obligations before onboarding. If you are evaluating Silhouette for a fund, desk, or regulated entity, this is the reference.

## Why Compliance Matters on a Shielded Platform

Shielded trading protects your strategy - not bad actors. Privacy and compliance are not in tension. The goal is to shield legitimate trading activity from copy bots, signal-aware LPs, and whale trackers, while ensuring the platform is not used for money laundering, terrorist financing, or sanctions evasion.

Without a compliance layer, shielded execution becomes a liability for every serious participant. Institutions cannot touch it. Regulated desks cannot justify it. The compliance engine is what makes shielded trading viable for professional use.

## How Screening Works

Silhouette screens all user addresses through a compliance engine before granting access to the platform. The compliance engine gates access to Silhouette's frontend and backend in both naked and shielded modes.

Multiple criteria are used to determine whether an address is permitted to access Silhouette, including:

- **Sanctions lists** - addresses appearing on OFAC, EU, or other applicable sanctions lists
- **Restricted jurisdictions** - access attempts from blocked regions
- **Exposure analysis** - addresses with material exposure to sanctioned entities

Should Silhouette's primary compliance partner become unavailable, a backup provider ensures continuous screening. Access to the platform is blocked in the unlikely event that both compliance providers are temporarily offline. Silhouette does not fall back to unscreened access.

## AML and CTF

The purpose of Silhouette's compliance engine is to support compliance with applicable AML and CTF laws. These obligations exist across jurisdictions and apply to platforms that facilitate financial transactions, regardless of whether they custody funds directly.

Silhouette treats these obligations as a design constraint, not an afterthought. The screening layer was built into the platform architecture from day one.

## KYC-Gated Features

Silhouette plans to support KYC-only access to certain features, ensuring that regulated entities can trade in a fenced compliant environment. The first KYC-gated feature will be **Request for Quote (RFQ)** orders, allowing institutional participants to request block-sized quotes from verified market makers within the shielded environment.

KYC verification will be handled through a third-party identity provider. Details on the verification process and supported jurisdictions will be published ahead of launch.

## What This Means for Traders

- **Retail traders** - you connect your wallet and the compliance engine screens your address automatically. If you pass, you trade. No manual steps.
- **Institutions and desks** - the screening layer gives you a defensible answer when your compliance team asks how the platform handles AML/CTF. KYC-gated features are coming for entities that need them.
- **Developers** - API access is also gated by the compliance engine. Authenticated sessions require a screened address.

For details on how Silhouette's architecture separates shielded execution from compliance, see [Architecture Overview](/architecture/overview).
