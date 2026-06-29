import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  Sidebar: [
    {
      type: 'doc',
      id: 'about-silhouette',
      label: 'About Silhouette',
    },
    {
      type: 'doc',
      id: 'quickstart',
      label: 'Quickstart',
    },
    {
      type: 'category',
      label: 'Onboarding',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'onboarding/start-trading',
          label: 'Start Trading',
        },
        {
          type: 'doc',
          id: 'onboarding/withdraw',
          label: 'Withdraw',
        },
        {
          type: 'doc',
          id: 'onboarding/feedback',
          label: 'Provide Feedback',
        },
      ],
    },
    {
      type: 'category',
      label: 'Trading',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'trading/shielded-trading',
          label: 'Shielded Trading',
        },
        {
          type: 'doc',
          id: 'trading/naked-trading',
          label: 'Naked Trading',
        },
        {
          type: 'doc',
          id: 'trading/order-types',
          label: 'Order Types',
        },
      ],
    },
    {
      type: 'category',
      label: 'RFQ',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'rfq/overview',
          label: 'Overview',
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
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'architecture/tee',
          label: 'TEE',
        },
        {
          type: 'doc',
          id: 'architecture/smart-contract',
          label: 'Smart Contract',
        },
        {
          type: 'doc',
          id: 'architecture/hyperliquid',
          label: 'Hyperliquid',
        },
      ],
    },
    {
      type: 'doc',
      id: 'fees',
      label: 'Fees',
    },
    {
      type: 'doc',
      id: 'referrals',
      label: 'Referrals',
    },
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQs',
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
      items: [
        {
          type: 'doc',
          id: 'api/index',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'api/quick-start',
          label: 'Quick start',
        },
        {
          type: 'doc',
          id: 'api/authentication',
          label: 'Authentication',
        },
        {
          type: 'doc',
          id: 'api/reference',
          label: 'Reference',
        },
        {
          type: 'doc',
          id: 'api/troubleshooting',
          label: 'Troubleshooting',
        },
        {
          type: 'doc',
          id: 'api/openapi',
          label: 'OpenAPI tools',
        },
        {
          type: 'doc',
          id: 'api/sdk',
          label: 'Python SDK',
        },
      ],
    },
    {
      type: 'category',
      label: 'RFQ API Spec',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'api/spec/index',
          label: 'Overview',
        },
        {
          type: 'doc',
          id: 'api/spec/authentication',
          label: 'HMAC authentication',
        },
        {
          type: 'doc',
          id: 'api/spec/auth-flow',
          label: 'Auth flow example',
        },
        {
          type: 'doc',
          id: 'api/spec/reference',
          label: 'Endpoint index',
        },
        {
          type: 'doc',
          id: 'api/spec/auth',
          label: 'Auth',
        },
        {
          type: 'doc',
          id: 'api/spec/instruments',
          label: 'Instruments',
        },
        {
          type: 'doc',
          id: 'api/spec/balances',
          label: 'Balances',
        },
        {
          type: 'doc',
          id: 'api/spec/rfq',
          label: 'RFQ',
        },
        {
          type: 'doc',
          id: 'api/spec/maker',
          label: 'Maker',
        },
        {
          type: 'doc',
          id: 'api/spec/funding',
          label: 'Funding',
        },
        {
          type: 'doc',
          id: 'api/spec/schemas',
          label: 'Schemas',
        },
      ],
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
