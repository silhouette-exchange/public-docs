import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  Sidebar: [
    { type: 'doc', id: 'about-silhouette', label: 'Introduction' },
    { type: 'doc', id: 'quickstart', label: 'Quickstart' },
    { type: 'doc', id: 'how-silhouette-works', label: 'How Silhouette Works' },

    {
      type: 'category',
      label: 'Onboarding',
      collapsed: true,
      items: [
        'onboarding/start-trading',
        'onboarding/withdraw',
      ],
    },

    {
      type: 'category',
      label: 'Trading',
      collapsed: true,
      items: [
        'trading/shielded-trading',
        'trading/naked-trading',
        'trading/order-lifecycle',
        'trading/fees',
      ],
    },

    {
      type: 'category',
      label: 'Architecture',
      collapsed: true,
      items: [
        'architecture/overview',
        'architecture/tee',
        'architecture/hyperliquid',
      ],
    },

    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: true,
      items: [
        'concepts/shielded-trading',
        'concepts/tee',
        'concepts/strategy-leakage',
        'concepts/copytrade-exposure',
        'concepts/signaling-risk',
        'concepts/adverse-selection',
        'concepts/hyperliquid-integration',
        'concepts/naked-vs-shielded',
      ],
    },

    { type: 'doc', id: 'referrals', label: 'Referrals' },
    { type: 'doc', id: 'faq', label: 'FAQs' },
    { type: 'doc', id: 'glossary', label: 'Glossary' },

    { type: 'html', value: '<div class="sidebar-divider"></div>' },
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
        'api/index',
        'api/quick-start',
        'api/authentication',
        'api/reference',
        { type: 'link', label: 'Interactive Explorer', href: '/api/explorer' },
        'api/troubleshooting',
        'api/openapi',
      ],
    },
    { type: 'doc', id: 'sdk', label: 'Python SDK' },

    { type: 'html', value: '<div class="sidebar-divider"></div>' },
    {
      type: 'html',
      value: '<div class="sidebar-section-title">Ecosystem</div>',
      className: 'sidebar-section-header',
    },

    {
      type: 'link',
      href: 'https://silhouette-exchange.notion.site/brand-kit',
      label: 'Brand Kit',
    },
    {
      type: 'link',
      href: 'https://app.silhouette.exchange',
      label: 'Launch App',
    },
    {
      type: 'link',
      href: 'https://silhouette.exchange',
      label: 'Website',
    },
    {
      type: 'link',
      href: 'https://x.com/silhouette_ex',
      label: 'X',
    },
    {
      type: 'link',
      href: 'https://t.me/silhouette_exchange',
      label: 'Telegram',
    },
  ],
};

export default sidebars;
