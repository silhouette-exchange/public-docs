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
        headline="Shielded trading on Hyperliquid."
        sub="Every trade on a public orderbook is a confession to copytrade bots, signal-aware LPs, and every desk watching your wallet. Silhouette encrypts your orders until match and passes 95% of the Hyperliquid volume discount back to you."
        ctas={[
          { label: 'Read the docs', href: '/about-silhouette', variant: 'primary' },
          { label: 'Build on Silhouette', href: '/api', variant: 'secondary' },
        ]}
      />

      <section className={styles.roles}>
        <div className={styles.rolesGrid}>
          <RoleCard
            role="developer"
            title="Developers"
            description="Build bots, agents, and integrations against Silhouette's shielded API. OpenAPI spec, SDKs, rate limits, and a testnet quickstart."
            href="/api"
            ctaLabel="API reference"
          />
          <RoleCard
            role="institution"
            title="Institutions"
            description="Due-diligence the TEE threat model, attestation walkthrough, audit reports, reproducible builds, and custody model in one place."
            href="/architecture/overview"
            ctaLabel="Security and architecture"
          />
          <RoleCard
            role="trader"
            title="Traders"
            description="Place your first shielded trade in about three minutes. Quickstart, fees, naked vs shielded, and common mistakes."
            href="/quickstart"
            ctaLabel="Quickstart"
          />
        </div>
      </section>
    </Layout>
  );
}
