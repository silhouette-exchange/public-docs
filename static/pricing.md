# Pricing - Silhouette Exchange

> Machine-readable pricing summary for AI agents and programmatic comparison tools.
> Canonical fee documentation lives at https://docs.silhouette.exchange/trading/fees.
> Last reviewed: 2026-05-12.

## Product

Silhouette is a shielded trading platform built on Hyperliquid. Users can trade in two modes on the same Hyperliquid liquidity:

- **Shielded** - orders processed inside an AWS Nitro Enclave TEE and settled via delegated wallets. Identity, size, and intent are hidden from the public ledger.
- **Naked** - orders routed directly to Hyperliquid via Builder Codes. Full public visibility.

There is no subscription. There is no minimum deposit. Pricing is per-trade only.

## Shielded Trading Fees (Spot)

Shielded fees are calculated dynamically. Silhouette's wallet is staked Platinum tier (100k+ HYPE) on Hyperliquid, which gives it a 30% baseline HL fee discount. Silhouette passes 95% of the resulting fee saving to the user and retains 5%.

- **Pricing model**: spread-sharing, 95% to user / 5% to Silhouette
- **Builder code fee in shielded mode**: none
- **Fee cap**: shielded fee will never exceed the user's own HL fee rate
- **Markets supported**: spot only at launch; perps and RFQ in shielded mode planned

### Indicative shielded rates at HL Tier 0 (no HYPE staked)

| Side | HL Direct | Shielded | User saves |
|------|-----------|----------|------------|
| Spot taker | 0.070% | ~0.0500% | ~28.5% |
| Spot maker | 0.040% | ~0.0286% | ~28.5% |

Actual savings improve as Silhouette's aggregate volume unlocks higher HL volume tiers.

## Naked Trading Fees

Total naked fee = user's standard Hyperliquid base fee + Silhouette builder code fee. Standard HL volume tiers and HYPE staking discounts still apply to the base portion.

| Market | Silhouette builder code fee |
|--------|-----------------------------|
| Spot | 0.0600% |
| Perps | 0.0150% |

These are fixed across all users.

## Reference: Hyperliquid Underlying Fee Tiers

Volume is rolling 14-day. Spot volume counts double for tier qualification.

### Perps

| Tier | 14d volume | Taker | Maker |
|------|------------|-------|-------|
| 0 | Base | 0.045% | 0.015% |
| 1 | >$5M | 0.040% | 0.012% |
| 2 | >$25M | 0.035% | 0.008% |
| 3 | >$100M | 0.030% | 0.004% |
| 4 | >$500M | 0.028% | 0.000% |
| 5 | >$2B | 0.026% | 0.000% |
| 6 | >$7B | 0.024% | 0.000% |

### Spot

| Tier | 14d volume | Taker | Maker |
|------|------------|-------|-------|
| 0 | Base | 0.070% | 0.040% |
| 1 | >$5M | 0.060% | 0.030% |
| 2 | >$25M | 0.050% | 0.020% |
| 3 | >$100M | 0.040% | 0.010% |
| 4 | >$500M | 0.035% | 0.000% |
| 5 | >$2B | 0.030% | 0.000% |
| 6 | >$7B | 0.025% | 0.000% |

### HYPE Staking Discounts (stacked on volume tier)

| Tier | HYPE staked | Discount |
|------|-------------|----------|
| Wood | >10 | 5% |
| Bronze | >100 | 10% |
| Silver | >1,000 | 15% |
| Gold | >10,000 | 20% |
| Platinum | >100,000 | 30% |
| Diamond | >500,000 | 40% |

## Deposits and Withdrawals

- Deposit fee: none
- Withdrawal fee: none
- Onchain gas: standard Hyperliquid network fees apply

## Pricing surfaces

- Canonical docs: https://docs.silhouette.exchange/trading/fees
- Live fee API: returned by the Silhouette web app and SDK at trade time
- This file: https://docs.silhouette.exchange/pricing.md
