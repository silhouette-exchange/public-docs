---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
pagination_label: Quickstart
description: "Get started with shielded trading on Silhouette in five steps. Connect your wallet, deposit funds, and trade on Hyperliquid without showing your hand."
keywords:
  - Silhouette Exchange
  - shielded trading
  - Hyperliquid trading
  - crypto trading
  - decentralized exchange
  - DeFi privacy
---

# Quickstart

Get trading on Silhouette in five steps. You will need an EVM wallet and funds on Hyperliquid.

## 1. Connect Your Wallet

Go to [app.silhouette.exchange](https://app.silhouette.exchange) and click **Connect Wallet**. Silhouette supports MetaMask, Rabby, WalletConnect, Coinbase Wallet, and email login.

<img src="/img/flows/connect.png" alt="Connect wallet" className="app-screenshot app-screenshot--sm" />

## 2. Switch between Naked and Shielded Mode

At the top of the page, toggle the switch between **Naked** and **Shielded**. Shielded mode routes your orders through the secure execution environment. Naked mode routes directly to Hyperliquid. To understand the difference, see [Shielded Trading](/trading/shielded-trading) and [Naked Trading](/trading/naked-trading).

<figure className="screenshot-figure">
<img src="/img/app-screenshots/shield-naked-switch.gif" alt="Switching between Naked and Shielded mode" className="app-screenshot app-screenshot--lg" />
<figcaption className="screenshot-caption">Toggle between Naked and Shielded mode in the top bar</figcaption>
</figure>

## 3. Connect to Shielded Trading

Once in Shielded mode, you will be prompted to click the **Connect Shielded** button in the Accounts Dashboard. This establishes your encrypted connection with Silhouette's TEE.

<img src="/img/flows/connect-shielded.png" alt="Connect Shielded" className="app-screenshot app-screenshot--sm" />

## 4. Deposit Funds

There are two ways to get funds into Silhouette:

**From HyperCore** - If you already have assets on Hyperliquid, click **To Silhouette** in the Accounts Dashboard or **Transfer to/from Silhouette** in the Balances section. This moves funds from your HyperCore balance into Silhouette's shielded environment.

<figure className="screenshot-figure">
<img src="/img/app-screenshots/transfer-modal.png" alt="Transfer funds from HyperCore to Silhouette" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Transfer from HyperCore to Silhouette</figcaption>
</figure>

**From any chain via Li.Fi** - Click **Deposit** in the app to open the cross-chain bridge. This deposits directly into your Silhouette account from Ethereum, Arbitrum, Base, or any supported chain - skipping the HyperCore transfer step entirely.

<figure className="screenshot-figure">
<img src="/img/app-screenshots/deposit-modal.png" alt="Deposit from any chain via Li.Fi bridge" className="app-screenshot app-screenshot--sm" />
<figcaption className="screenshot-caption">Cross-chain deposit via Li.Fi - funds go straight into Silhouette</figcaption>
</figure>

## 5. Start Trading

You are ready to trade. Place shielded spot orders on any supported pair shown in the app. Your orders are processed inside the TEE and settled on Hyperliquid--without anyone seeing your strategy.

For more detail on how shielded trading works, see [Shielded Trading](/trading/shielded-trading).

## Next Steps

- [Start Trading](/onboarding/start-trading) - Detailed guide covering spot and perpetuals trading
- [Shielded Trading](/trading/shielded-trading) and [Naked Trading](/trading/naked-trading) - Understand the two trading modes
- [How Silhouette Works](/how-silhouette-works) - End-to-end walkthrough of the system

<TechArticleSchema
  headline="Silhouette Quickstart: Start Shielded Trading in Five Steps"
  description="Get started with shielded trading on Silhouette in five steps. Connect your wallet, deposit funds, and trade on Hyperliquid without showing your hand."
  proficiencyLevel="Beginner"
  keywords={[
    "Silhouette Exchange",
    "shielded trading",
    "Hyperliquid trading",
    "crypto trading",
    "decentralized exchange",
    "DeFi privacy",
  ]}
/>
