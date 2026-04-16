---
title: Deposits and Withdrawals
sidebar_label: Deposits & Withdrawals
pagination_label: Deposits & Withdrawals
description: "Withdraw funds from Silhouette Exchange. Learn about supported assets and how withdrawals work."
keywords:
  - Silhouette Exchange
  - DeFi privacy
  - Hyperliquid
  - shielded trading
  - crypto trading
  - private trading
---

# Deposits and Withdrawals

## Depositing Funds

To deposit funds into Silhouette, you need assets on HyperCore (Hyperliquid's high-performance trading layer).

1. In the Silhouette app, click **To Silhouette** in the Account Dashboard (when in Naked mode), or click **Transfer to/from Silhouette** in the Balances section at any time
2. Select the asset and amount you want to deposit
3. Confirm the transaction in your wallet

<img src="/img/app-screenshots/transfer-modal.png" alt="Transfer funds modal for depositing into Silhouette" className="app-screenshot app-screenshot--sm" />

<!-- DOCS_REWRITE: removed legacy encrypted-balance wording from onboarding flow -->
Your deposit will be detected by Silhouette's system and your account state will be updated in the shielded service. Deposits are publicly visible on Hyperliquid; once your funds are inside Silhouette, your trading activity is [shielded](/trading/shielded-trading).

## Withdrawing Funds

To withdraw funds from Silhouette back to HyperCore:

1. Click **To Hypercore** in the Account Dashboard, or click **Transfer to/from Silhouette** in the Balances section
2. Select the asset and amount you want to withdraw
3. Confirm the transaction

Your funds return to your wallet on HyperCore. There is no waiting period and no approval process.

Your balances are visible in the Account Dashboard. The Balances panel shows your shielded spot holdings, and the Portfolio sidebar shows your total account value at a glance.

<figure className="screenshot-figure">
<img src="/img/app-screenshots/balance-switch.gif" alt="Switching between spot and perps balances in the Account Dashboard" className="app-screenshot app-screenshot--lg" />
<figcaption className="screenshot-caption">Toggle between spot and perps balances in the Account Dashboard</figcaption>
</figure>

<img src="/img/app-screenshots/portfolio-sidebar.png" alt="Portfolio sidebar showing account values" className="app-screenshot app-screenshot--sm" />

## Supported Assets

How you fund your account depends on which mode you are trading in.

### Shielded mode

Deposits and withdrawals move assets between HyperCore and Silhouette's shielded environment via the Transfer modal. You can deposit and withdraw any asset that has a shielded spot market - see the full list on [Shielded Trading](/trading/shielded-trading#supported-markets).

Your deposit is the last publicly visible action until you withdraw. Everything inside Silhouette stays between you and the system.

### Naked mode

Naked trading uses your HyperCore balance directly - there is no separate deposit step. You fund your Hyperliquid account the normal way (bridge, CEX withdrawal, or L1 transfer) and trade immediately. All spot and perpetual markets on Hyperliquid are available - see [Naked Trading](/trading/naked-trading#supported-markets) for details.

## Fees

Silhouette does not charge fees on deposits or withdrawals. Standard Hyperliquid gas fees apply for onchain transactions.

Ready to start? See [Start Trading](/onboarding/start-trading) to place your first order.
