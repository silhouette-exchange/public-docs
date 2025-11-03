import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  Sidebar: [
    {
      type: 'category',
      label: 'About Silhouette',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'about-silhouette',
          label: 'What is Silhouette?',
        },
        {
          type: 'doc',
          id: 'about/why-silhouette',
          label: 'Why Silhouette?',
        },
        {
          type: 'doc',
          id: 'about/core-contributors',
          label: 'Core Contributors',
        },
      ],
    },
    {
      type: 'category',
      label: 'Onboarding',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'onboarding/index',
        label: 'Onboarding',
      }],
    },
    {
      type: 'category',
      label: 'Trading',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'trading/matching-engine',
          label: 'Matching Engine',
        },
        {
          type: 'doc',
          id: 'trading/order-details',
          label: 'Order Details',
        },
      ],
    },
    {
      type: 'category',
      label: 'Account Management',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'account-management/overview',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'account-management/evm-wallet',
          label: 'EVM Wallet',
        },
        {
          type: 'doc',
          id: 'account-management/managed-wallets',
          label: 'Managed Wallets',
        },
        {
          type: 'doc',
          id: 'account-management/encryption-key',
          label: 'Encryption Key',
        },
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'architecture/overview',
          label: 'Architecture Overview',
        },
        {
          type: 'doc',
          id: 'architecture/webapp',
          label: 'Webapp',
        },
        {
          type: 'doc',
          id: 'architecture/smart-contract',
          label: 'Smart Contracts',
        },
        {
          type: 'doc',
          id: 'architecture/tee',
          label: 'Trusted Execution Environments',
        },
        {
          type: 'doc',
          id: 'architecture/hyperliquid',
          label: 'Hyperliquid',
        },
      ],
    },
    {
      type: 'category',
      label: 'Silhouette Desk',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'silhouette-desk/index',
        label: 'Silhouette Desk',
      }],
      className: 'sidebar-item-coming-soon',
    },
    {
      type: 'category',
      label: 'Points',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'points/index',
        label: 'Points',
      }],
      className: 'sidebar-item-coming-soon',
    },
    {
      type: 'category',
      label: 'Referrals',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'referrals/index',
        label: 'Referrals',
      }],
      className: 'sidebar-item-coming-soon',
    },
    {
      type: 'category',
      label: 'Audits',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'audits/index',
        label: 'Audits',
      }],
    },
    {
      type: 'category',
      label: 'Risk',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'risk/index',
        label: 'Risk',
      }],
    },
    {
      type: 'category',
      label: 'FAQs',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'faq',
        label: 'FAQ',
      }],
    },
    {
      type: 'html',
      value: '<div class="sidebar-divider"></div>',
    },
    {
      type: 'html',
      value: '<div class="sidebar-section-title">For Developers</div>',
      className: 'sidebar-section-header',
    },
    {
      type: 'category',
      label: 'API',
      collapsed: true,
      items: [{
        type: 'doc',
        id: 'api/index',
        label: 'API',
      }],
    },
    {
      type: 'html',
      value: '<div class="sidebar-divider"></div>',
    },
    {
      type: 'html',
      value: '<div class="sidebar-section-title">Brand & Community</div>',
      className: 'sidebar-section-header',
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
      href: 'https://silhouette-exchange.notion.site/brand-kit',
      label: 'Silhouette Media Kit',
    },
    {
      type: 'link',
      href: 'https://app.silhouette.exchange',
      label: 'App',
    },
    {
      type: 'link',
      href: 'https://silhouette.exchange',
      label: 'Website',
    },
    {
      type: 'link',
      href: 'https://x.com/silhouette_ex',
      label: 'X Community',
    },
    {
      type: 'link',
      href: 'https://t.me/silhouette_exchange',
      label: 'Telegram Community',
    },
  ],
};

export default sidebars;
