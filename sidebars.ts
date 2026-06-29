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
        {
          type: 'category',
          label: 'Shielded Trading',
          collapsed: false,
          items: [
            'trading/shielded/spot',
            {
              type: 'link',
              label: 'Binary Outcomes (HIP-4)',
              href: '#',
              className: 'sidebar-item-coming-soon sidebar-item-disabled',
            },
          ],
        },
        'trading/naked-trading',
        'trading/order-lifecycle',
        'trading/fees',
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
        'architecture/overview',
        'architecture/tee',
        'architecture/hyperliquid',
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
        {
          type: 'link',
          label: 'Interactive Explorer',
          href: '#',
          className: 'sidebar-item-coming-soon sidebar-item-disabled',
        },
        'api/troubleshooting',
        'api/openapi',
      ],
    },
    { type: 'doc', id: 'sdk', label: 'Python SDK' },

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
          label: 'Authentication',
        },
        {
          type: 'doc',
          id: 'api/spec/reference',
          label: 'Endpoint index',
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
