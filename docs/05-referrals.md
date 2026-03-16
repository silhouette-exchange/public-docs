---
id: referrals
title: Referrals
sidebar_label: Referrals
pagination_label: Referrals
description: "Overview of Silhouette Exchange's referral system, including the current live status of codes, thresholds, and reward mechanics."
keywords:
  - Silhouette Exchange
  - shielded trading
  - Hyperliquid
  - DeFi privacy
  - decentralized exchange
  - referral program
---

# Referrals

<!-- DOCS_REWRITE: aligned referral docs with current fee config and UI state -->
Silhouette currently exposes referral registration and referral codes in the app. Trading-fee rebates and claimable rewards are configured for future rollout, but the current live implementation does not yet apply non-zero referral fee rates.

## How It Works

**For referrers:** Referral codes can be generated once you meet the activation threshold. Reward accrual and claiming are not yet live in the current app.

**For referees:** You can register with a referral code today, but the current live fee discount is `0%`.

## Program Details

| Parameter | Value |
|---|---|
| **Referrer rebate** | 0% in the current live config |
| **Referee discount** | 0% in the current live config |
| **Activation threshold** | $10,000 notional trading volume to generate a referral code |
| **Referrer cap** | $1B notional volume per referee |
| **Referee discount cap** | $25M notional volume |

## Activation

To generate and share a referral code, you need a minimum of **$10,000 in notional trading volume** on Silhouette. This threshold ensures referral codes come from active traders with real experience on the platform.

## Caps

Both sides of the referral relationship have configured volume caps:

- **Referrers** earn rebates on up to $1B of notional volume per referee. After that, the rebate stops for that specific referee.
- **Referees** receive the fee discount on up to $25M of notional volume. After that, standard fees apply.

These caps keep the program focused on onboarding new traders.

## Claiming Rewards

Reward claiming is not yet live in the current app. The referral page currently exposes your code and referred-user stats, while the reward cards remain marked as coming soon.

For details on the fee structure that referral discounts apply to, see [Fees](/trading/fees).
