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

Silhouette offers two trading modes with different fee structures:

- **Naked** - Open, transparent trading through Silhouette's interface. Your transactions are visible on Hyperliquid like any standard trade. Silhouette applies a small fee via Hyperliquid's [builder code](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes) system — a protocol-native mechanism that allows frontends built on Hyperliquid to charge a fee on fills. Naked fees are the same for all users as shown in the fee schedule below.

- **Shielded** - Private trading executed inside Silhouette's Trusted Execution Environment (TEE). Your transactions are not publicly visible onchain. Fees are calculated dynamically — Silhouette passes 95% of its aggregate HL volume discount directly to you.

## Naked Trading Fees

Silhouette charges a small builder code fee on top of Hyperliquid's standard trading fees. **Your total cost = Hyperliquid's base fee (based on your HL tier) + the Silhouette builder code fee below.**

| Tier | 30-Day Rolling Volume (USD) | Perps Builder Code Fee | Spot Builder Code Fee |
|------|----------------------------|------------------------|----------------------|
| 1 | 0 – 500k | 0.02% | 0.10% |
| 2 | 500k – 2M | 0.018% | 0.08% |
| 3 | 2M – 5M | 0.015% | 0.06% |
| 4 | 5M – 10M | 0.012% | 0.04% |
| 5 | 10M+ | 0.01% | 0.02% |

The builder code fee is set at a fixed rate as shown in the table above. These are standard fees applied uniformly - only **shielded** trading uses dynamic, per-user fee calculations.

These fees are applied on top of your existing [Hyperliquid fee tier](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/fees), which is calculated separately by Hyperliquid based on your **14-day rolling volume**. Your HL volume tier, HYPE staking discounts, and any other HL-native fee reductions still apply to the base portion of your fee as normal.

## Shielded Trading Fees (Spot Only)

:::info
Shielded trading is currently available for **spot markets only**. Perps and RFQs in shielded mode are coming soon.
:::

### How Shielded Fees Are Calculated

When you trade shielded, your orders are executed inside Silhouette's TEE and routed through Silhouette's aggregated wallet on Hyperliquid. Because this wallet handles significant volume, it qualifies for lower fee tiers on HL than most individual traders.

**Silhouette passes 95% of that fee saving directly to you.**

Your shielded fee is calculated dynamically based on the difference between your individual Hyperliquid fee tier and Silhouette's fee tier:

1. We look up **your HL fee tier** (based on your 14-day rolling volume on Hyperliquid)
2. We compare it to **Silhouette's HL fee tier** (based on aggregate wallet volume)
3. The **spread** (difference) between the two is your potential saving
4. You receive **95% of that spread** as a fee discount - Silhouette retains 5%

### How It Works in Practice

- **No builder code fee in shielded mode** - Silhouette's 5% of the spread is the only markup. There is no separate builder code fee.
- **Fee cap** - your shielded fee will not exceed your individual HL fee rate. If your personal HL tier matches or beats Silhouette's aggregate tier, you pay your standard HL rate.
- **Savings improve over time** - as Silhouette's aggregate volume grows and unlocks better HL tiers, shielded users benefit automatically

### Example - Spot Taker

Assuming Silhouette's aggregated wallet is at HL Tier 3 (>$100M volume), and a new user is at Tier 0 (base):

| | HL Tier | HL Spot Taker Rate | Shielded Rate | You Save |
|---|---------|-------------------|---------------|----------|
| **You** | Tier 0 (base) | 0.070% | ~0.042% | ~40% |
| **Silhouette Wallet** | Tier 3 (>$100M) | 0.040% | — | — |

### Example — Spot Maker

| | HL Tier | HL Spot Maker Rate | Shielded Rate | You Save |
|---|---------|-------------------|---------------|----------|
| **You** | Tier 0 (base) | 0.040% | ~0.012% | ~70% |
| **Silhouette Wallet** | Tier 3 (>$100M) | 0.010% | — | — |

The spread between your rate and Silhouette's rate is where your saving comes from. The larger the gap, the more you save.

*Actual savings depend on Silhouette's current HL tier. As aggregate volume grows, Silhouette unlocks better tiers and all shielded users benefit. HYPE staking discounts on Silhouette's wallet will further reduce costs in a future update.*

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

## No Deposit or Withdrawal Fees

Silhouette does not charge fees on deposits or withdrawals. Standard Hyperliquid gas fees apply for onchain transactions.

## Referral Discounts

Silhouette's [referral program](/referrals) provides additional fee savings. See [Referrals](/referrals) for details.
