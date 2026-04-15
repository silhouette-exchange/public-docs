import React, { type ReactNode } from 'react';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/Hero';
import RoleCard from '@site/src/components/RoleCard';
import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout
      title="Shielded trading on Hyperliquid"
      description="Silhouette is a shielded perpetuals exchange on Hyperliquid. Orders are encrypted until match. 95% of the Hyperliquid volume discount passes back to takers."
    >
      <Hero
        eyebrow="Shield Everything"
        status="live"
        headline="Shielded trading on Hyperliquid"
        accentWord="Shielded"
        sub="Every trade on a public order book is a confession to copy trade bots, signal-aware LPs, and every desk watching your wallet. Silhouette encrypts your orders until match and passes 95% of the Hyperliquid volume discount back to you."
        ctas={[
          { label: 'Read the docs', href: '/about-silhouette', variant: 'primary' },
          { label: 'Build on Silhouette', href: '/api', variant: 'secondary' },
        ]}
        stats={[
          { label: 'Taker fee', value: '-95%' },
          { label: 'Order leakage', value: 'None' },
          { label: 'Settlement', value: 'HyperCore' },
        ]}
        panelTitle="SLH/SYS"
        panelRows={[
          { label: 'Settlement', value: 'HyperCore' },
          { label: 'Orderbook', value: 'Public' },
          { label: 'Order flow', value: 'Shielded', highlight: true },
          { label: 'Identity', value: 'Delegated' },
          { label: 'Leakage', value: 'None', highlight: true },
        ]}
      />

      <section className={styles.roleSection}>
        <header className={styles.roleHeader}>
          <div className={styles.roleHeaderLeft}>
            <span className={styles.roleKicker}>02 / Pick your path</span>
            <h2 className={styles.roleTitle}>
              <span className={styles.roleTitleInner}>
                Three doors. One shielded venue.
              </span>
            </h2>
          </div>
          <p className={styles.roleHint}>
            Whatever brought you here, the docs are organised so you don't have to read them in order.
          </p>
        </header>

        <div className={styles.roleGrid}>
          <RoleCard
            role="developer"
            index="01"
            kicker="Developer"
            title="Developers"
            description="Build bots, agents, and integrations against Silhouette's shielded API. OpenAPI spec, SDKs, rate limits, and a testnet quickstart."
            meta="OpenAPI / Python SDK"
            href="/api"
            ctaLabel="API reference"
          />
          <RoleCard
            role="institution"
            index="02"
            kicker="Institution"
            title="Institutions"
            description="Due-diligence the TEE threat model, attestation walkthrough, audit reports, reproducible builds, and custody model in one place."
            meta="TEE attested / reproducible"
            href="/architecture/overview"
            ctaLabel="Security and architecture"
          />
          <RoleCard
            role="trader"
            index="03"
            kicker="Trader"
            title="Traders"
            description="Place your first shielded trade in about three minutes. Quickstart, fees, naked vs shielded, and common mistakes."
            meta="3 min setup"
            href="/quickstart"
            ctaLabel="Quickstart"
          />
        </div>
      </section>
    </Layout>
  );
}
