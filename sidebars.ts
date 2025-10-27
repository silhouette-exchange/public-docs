import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  Sidebar: [
    {
      type: 'link',
      href: '/docs/about-silhouette',
      label: 'About Silhouette',
    },
    {
      type: 'link',
      href: '/docs/quickstart',
      label: 'Quickstart',
    },
    {
      type: "category",
      label: "Architecture",
      items: [
        'trading/order-details',
        'trading/matching-engine'
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/webapp',
        'architecture/smart-contract',
        'architecture/tee',
        'architecture/hyperliquid'
      ],
    },
    {
      type: "category",
      label: "Trading",
      items: ["trading/order-details", "trading/matching-engine"],
    },
    {
      type: "category",
      label: "Account management",
      items: [
        "account/overview",
        "account/evm-wallet",
        "account/managed-wallets",
        "account/encryption-key",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: [
        "10-api/01-api-reference",
      ],
    },
    {
      type: 'link',
      href: '/docs/faq',
      label: 'FAQ',
    },
    {
      type: 'link',
      href: '/docs/glossary',
      label: 'Glossary',
    }
  ],
};

export default sidebars;
