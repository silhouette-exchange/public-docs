---
id: fees
title: Fees
---

At Silhouette, our fee structure is designed to promote accessibility, liquidity, and growth within our shielded exchange on Hyperliquid. We draw inspiration from established models while incorporating features tailored to our ecosystem, such as maker/taker distinctions, volume-based tiers, and staking incentives. This creates a balanced system that rewards active participation and aligns with community-driven growth.

Fees fund platform operations and contribute to rewards like rebates from the Silhouette Assistance Fund. In this document, we'll outline the key components of our fee system, including how fees are calculated and applied.

## Core Principles

Our fee design follows these guiding principles:

1. **Accessibility and Familiarity**: We mirror proven structures to make onboarding seamless for users familiar with similar platforms.
2. **Incentivization**: Discounts and rebates encourage liquidity provision and high-volume trading.
3. **Fairness**: Fees are tiered based on activity, with exclusions for external volumes to ensure rewards reflect genuine platform engagement.
4. **Innovation**: Unique enhancements, like bonuses for ecosystem-specific pairs, drive targeted growth.

## Core Fee Structure: Maker/Taker with Volume Tiers

We use a maker/taker model, where makers (who add liquidity via limit orders) pay lower fees than takers (who remove liquidity via market orders). Fees are tiered based on your 14-day rolling weighted volume, assessed daily. Sub-accounts aggregate to the master account, while vaults are treated separately.

Volume weighting accounts for different asset types, with spot trades generally weighted higher than perps to reflect their impact.

### Spot Trading Fees

| Tier | 14d Weighted Volume (US$) | Taker Fee | Maker Fee |
| --- | --- | --- | --- |
| 0 | ≤5M | 0.0650% | 0.0350% |
| 1 | >5M | 0.0550% | 0.0250% |
| 2 | >25M | 0.0450% | 0.0150% |
| 3 | >100M | 0.0375% | 0.0050% |
| 4 | >500M | 0.0325% | 0.0000% |
| 5 | >2B | 0.0300% | 0.0000% |
| 6 | >7B | 0.0250% | 0.0000% |

### Perp Trading Fees

| Tier | 14d Weighted Volume (US$) | Taker Fee | Maker Fee |
| --- | --- | --- | --- |
| 0 | ≤5M | 0.0400% | 0.0150% |
| 1 | >5M | 0.0350% | 0.0120% |
| 2 | >25M | 0.0300% | 0.0080% |
| 3 | >100M | 0.0280% | 0.0040% |
| 4 | >500M | 0.0260% | 0.0000% |
| 5 | >2B | 0.0255% | 0.0000% |
| 6 | >7B | 0.0240% | 0.0000% |

## Staking Discounts: HYPE Integration

Staking HYPE provides progressive discounts on base fees (applied before volume tiers). Balances are fetched via API, with permanent account linking.

Enhancements include loyalty bonuses for staking through Silhouette-specific mechanisms, stacking additively up to a maximum.

### Staking Tiers

| Tier | HYPE Staked | Base Discount | Max with Loyalty Boost |
| --- | --- | --- | --- |
| Wood | >10 | 2% | 7% |
| Bronze | >100 | 5% | 10% |
| Silver | >1,000 | 10% | 15% |
| Gold | >10,000 | 20% | 25% |
| Platinum | >100,000 | 27.5% | 32.5% |
| Diamond | >500,000 | 35% | 40% |

This integration ties into broader ecosystem rewards, allocating a portion of fees to community incentives.

## RFQ System and Fee Structure

For larger trades (over $100K notional), we offer a Request for Quote (RFQ) system as an optional private execution path. Takers initiate requests and select from liquidity provider (LP) responses.

### Key Features

- **Taker Fee**: Flat base rate (approximately half the standard order book rate), with HYPE staking discounts applied.
- **Maker Rebate**: Funded from taker fees to incentivize LP participation.
- **No-Execution Fee**: Zero cost for unmatched or canceled RFQs.
- **Settlement Costs**: Minimal on-chain fees, potentially reimbursable via staking.
- **Threshold**: Available for qualifying trade sizes; smaller trades default to the standard order book.

This system reduces slippage for institutional flows while maintaining simplicity and user control.

## Roadmap and Updates

Our fee structure will evolve based on user feedback and ecosystem needs. Stay tuned for enhancements, such as expanded referral integrations and performance-based elements.

Thank you for trading on Silhouette! If you have questions, check our support resources or contact the team.