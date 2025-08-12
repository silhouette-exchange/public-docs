import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Silhouette Docs',
  tagline: 'Documentation Portal',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.silhouette.exchange',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'silhouette-exchange',
  projectName: 'public-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  future: {
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true,
    },
  },
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&display=swap",
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          // sidebarPath: require.resolve('./sidebars.ts'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-vercel-analytics',
      {
        mode: 'auto',
      },
    ],
  ],
  themeConfig: {
    // Replace with social card
    colorMode: {
      defaultMode: 'dark',
    },
    image: 'img/silhouette-social-card.png',
    navbar: {
      title: 'Silhouette Docs',
      logo: {
        alt: 'Silhouette Exchange',
        src: 'img/logo.jpg',
      },
      items: [
        {
          // sidebarId: 'Sidebar',
          to: '/docs/about-silhouette',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/faq',
          label: 'FAQ',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/silhouette-exchange',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      logo: {
        alt: 'Silhouette Exchange',
        src: 'img/silhouette-title-logo.svg',
      },
      style: 'dark',
      links: [
        // {
        //   title: 'GitHub',
        //   items: [
        //     {
        //       label: 'Contract',
        //       href: '#',
        //     },
        //     {
        //       label: 'Hyperliquid token IDs',
        //       href: '#',
        //     },
        //     {
        //       label: 'Deployment',
        //       href: '#',
        //     },
        //   ],
        // },
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'Brand Assets',
              href: 'https://silhouette-exchange.notion.site/brand-kit',
            },
            {
              label: 'Hyperliquid',
              href: 'https://hyperliquid.xyz',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Blog',
              href: '/blog',
            },
            {
              label: 'Silhouette X',
              href: 'https://x.com/silhouette_ex',
            },
            {
              label: 'Silhouette Telegram',
              href: 'https://t.me/silhouette_exchange',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Silhouette Exchange. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      // sidebar: {
      //   hideable: true,
      // },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
