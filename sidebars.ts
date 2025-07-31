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
      label: "Account Management",
      items: [
        "account-management/overview",
        "account-management/encryption-key",
        "account-management/evm-wallet",
        "account-management/managed-wallets",
      ],
    },
    {
      type: "category",
      label: "Trading",
      items: [
        "trading/order-details", 
        "trading/matching-engine"
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/webapp',
        'architecture/smart-contract',
        'architecture/tee',
        'architecture/hyperliquid',
        'architecture/sdk-api',
        'architecture/system-flows'
      ],
    },
    {
      type: 'link',
      href: '/docs/faq',
      label: 'FAQ',
    },
    {
      type: 'link',
      href: '/docs/legal-compliance',
      label: 'Legal & Compliance',
    },
    {
      type: 'link',
      href: '/docs/glossary',
      label: 'Glossary',
    }
  ],
};

export default sidebars;
