---
title: Fees
sidebar_label: Fees
pagination_label: Fees
slug: /trading/fees
description: "Silhouette Exchange fee structure for naked and shielded trading on Hyperliquid. Transparent builder code fees and dynamic shielded savings."
keywords:
  - Silhouette Exchange
  - shielded trading
  - Hyperliquid
  - trading fees
  - builder code
  - maker fees
  - taker fees
---

# Fees

## How much does Silhouette cost?

Silhouette offers two trading modes with different fee structures:

- **Shielded** - Private trading executed inside Silhouette's Trusted Execution Environment (TEE). Your transactions are not publicly visible onchain. Fees are calculated dynamically - Silhouette passes 95% of its HL fee saving directly to you.

- **Naked** - Open, transparent trading through Silhouette's interface. Your transactions are visible on Hyperliquid like any standard trade. Silhouette applies a small fee via Hyperliquid's [builder code](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes) system - a protocol-native mechanism that allows frontends built on Hyperliquid to charge a fee on fills. Naked fees are the same for all users as shown in the fee schedule below.

## Shielded Trading Fees (Spot Only)

:::info
Shielded trading is currently available for **spot markets only**. Perps and RFQs in shielded mode are coming soon.
:::

### How Shielded Fees Are Calculated

When you trade shielded, your orders are executed inside Silhouette's TEE and routed through the **Silhouette wallet** on Hyperliquid, which has **100k HYPE staked (Platinum tier, 30% HL fee discount)**. Because of that staking discount, the wallet pays a lower effective HL fee rate than an individual trader without HYPE staked.

**Silhouette passes 95% of that fee saving directly to you.** There is no builder code fee in shielded mode.

Your shielded fee is calculated dynamically based on the difference between your own HL rate and the Silhouette wallet's HL rate:

1. We look up **your HL fee rate** (your 14-day rolling volume tier + any HYPE staking discount on your own wallet)
2. We compare it to **the Silhouette wallet's HL fee rate** (its volume tier + Platinum staking discount)
3. The **spread** (difference) between the two is your potential saving
4. You receive **95% of that spread** as a fee discount - Silhouette retains 5%

### How It Works in Practice

- **No builder code fee in shielded mode** - Silhouette's 5% of the spread is the only markup. There is no separate builder code fee.
- **Fee cap** - your shielded fee will not exceed your individual HL fee rate. If your personal HL rate matches or beats the Silhouette wallet's rate, you pay your standard HL rate.
- **Savings improve over time** - as Silhouette's aggregate volume grows and unlocks better HL volume tiers, the spread widens and all shielded users benefit automatically.

### What You Pay Today

For a user at HL Tier 0 (base) trading shielded:

| | HL Direct | Shielded | You Save |
|---|-----------|----------|----------|
| **Spot Taker** | 0.070% | ~0.0500% | ~28.5% |
| **Spot Maker** | 0.040% | ~0.0286% | ~28.5% |

The spread between your rate and Silhouette's rate is where your saving comes from. The larger the gap, the more you save.

*Actual savings depend on Silhouette's current HL volume tier and HYPE staking tier. The Silhouette wallet is staked at Platinum (>100k HYPE) for a 30% baseline discount on its HL fees. As aggregate volume grows and unlocks better HL volume tiers, the spread widens and all shielded users benefit automatically.*

## RFQ Fees

RFQ fees are currently being modelled and will be updated shortly

## Hyperliquid Fee Tiers (Reference)

These are the underlying Hyperliquid rates used to calculate both naked base fees and shielded savings. HL tiers are based on your **14-day rolling volume** (spot volume counts double).

### Perps

| Tier | 14d Volume | Taker | Maker |
|------|------------|-------|-------|
| 0 | Base | 0.045% | 0.015% |
| 1 | >$5M | 0.040% | 0.012% |
| 2 | >$25M | 0.035% | 0.008% |
| 3 | >$100M | 0.030% | 0.004% |
| 4 | >$500M | 0.028% | 0.000% |
| 5 | >$2B | 0.026% | 0.000% |
| 6 | >$7B | 0.024% | 0.000% |

### Spot

| Tier | 14d Volume | Taker | Maker |
|------|------------|-------|-------|
| 0 | Base | 0.070% | 0.040% |
| 1 | >$5M | 0.060% | 0.030% |
| 2 | >$25M | 0.050% | 0.020% |
| 3 | >$100M | 0.040% | 0.010% |
| 4 | >$500M | 0.035% | 0.000% |
| 5 | >$2B | 0.030% | 0.000% |
| 6 | >$7B | 0.025% | 0.000% |

### HYPE Staking Discounts

These discounts are applied on top of volume tiers:

| Tier | HYPE Staked | Fee Discount |
|------|-------------|--------------|
| Wood | >10 | 5% |
| Bronze | >100 | 10% |
| Silver | >1,000 | 15% |
| Gold | >10,000 | 20% |
| Platinum | >100,000 | 30% |
| Diamond | >500,000 | 40% |

## Naked Trading Fees

Silhouette charges a small builder code fee on top of Hyperliquid's standard trading fees. **Your total cost = Hyperliquid's base fee (based on your HL volume tier and HYPE staking) + the Silhouette builder code fee below.**

### Silhouette Fixed Builder Code Fee

| Tier | Spot | Perps |
|------|------|-------|
| All Tiers | 0.0600% | 0.0150% |

These are fixed rates applied uniformly, no per-user dynamic calculation. Your Hyperliquid volume tier, HYPE staking discounts, and any other Hyperliquid-native fee reductions still apply to the base portion of your fee. See the [Hyperliquid fee tiers](#hyperliquid-fee-tiers-reference) reference above for the underlying rates.

## No Deposit or Withdrawal Fees

Silhouette does not charge fees on deposits or withdrawals. Standard Hyperliquid gas fees apply for onchain transactions.

## Referral Discounts

Silhouette's [referral program](/referrals) provides additional fee savings. See [Referrals](/referrals) for details.

<TechArticleSchema
  headline="Silhouette Exchange Fees"
  description="Silhouette Exchange fee structure for naked and shielded trading on Hyperliquid. Transparent builder code fees and dynamic shielded savings."
  proficiencyLevel="Beginner"
  keywords={['Silhouette Exchange', 'trading fees', 'Hyperliquid', 'builder code', 'maker fees', 'taker fees', 'shielded trading']}
/>
