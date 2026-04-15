import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import localSearch from '@easyops-cn/docusaurus-search-local';

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
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          routeBasePath: '/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          editUrl: 'https://github.com/silhouette-exchange/public-docs/tree/main/',
          exclude: ['plans/**'],
        },
        blog: {
          showReadingTime: true,
          routeBasePath: '/blog',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          editUrl: 'https://github.com/silhouette-exchange/public-docs/tree/main/',
          /*
           * blogTitle flows into the `<title>` of /blog and into the
           * og:title / twitter:title meta tags. Previously defaulted to
           * "Blog" which the SEO audit flagged as a wasted keyword slot.
           */
          blogTitle: 'Shielded trading blog | Silhouette',
          /*
           * blogDescription flows into the meta description and og/twitter
           * description of /blog. Previously missing entirely, so the
           * listing page served a blank SERP snippet.
           */
          blogDescription:
            'Research, guides and dispatches on shielded trading, TEE-attested execution, and building privacy-preserving markets on Hyperliquid.',
          /*
           * archiveBasePath: null disables the auto-generated /blog/archive
           * page. The default Docusaurus archive is a thin list of every
           * post grouped by month. The SEO audit flagged it as crawl-budget
           * waste on a site where the real /blog listing is the authored
           * entry point. Same story with authorsBasePath below.
           */
          archiveBasePath: null,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          /*
           * /plans/** are in-repo execution notes, excluded from public
           * discovery. /blog/authors/** is a thin Docusaurus auto-generated
           * author listing tree that the SEO audit flagged as crawl-budget
           * waste (we only have one author today and no real author bios
           * yet). /blog/archive is disabled at the plugin level via
           * archiveBasePath: null.
           */
          ignorePatterns: ['/plans/**', '/blog/authors/**'],
          filename: 'sitemap.xml',
          lastmod: 'date',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      localSearch,
      {
        hashed: true,
        language: ['en'],
        indexBlog: true,
        indexDocs: true,
        docsRouteBasePath: '/',
        blogRouteBasePath: '/blog',
        // Enable search in development mode
        removeDefaultStopWordFilter: true,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guides',
        path: 'guides',
        routeBasePath: 'guides',
        sidebarPath: require.resolve('./guidesSidebars.ts'),
        showLastUpdateTime: true,
        showLastUpdateAuthor: true,
        editUrl: 'https://github.com/silhouette-exchange/public-docs/tree/main/',
      },
    ],
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'Silhouette',
        siteDescription:
          'Silhouette is a shielded perpetuals exchange on Hyperliquid. Orders are encrypted inside a Trusted Execution Environment and settled through delegated wallets, so the market sees fills but never strategy, size, or identity. Silhouette passes 95% of its Hyperliquid volume discount back to takers.',
        depth: 2,
        enableDescriptions: true,
        runOnPostBuild: true,
        onRouteError: 'warn',
        logLevel: 1,
        content: {
          enableMarkdownFiles: true,
          enableLlmsFullTxt: true,
          relativePaths: false,
          includeBlog: true,
          includePages: false,
          includeDocs: true,
          excludeRoutes: [
            '/plans/**',
            '/search',
            /*
             * Docusaurus auto-generated blog index pages. Thin and
             * duplicate-y; SEO audit flagged as crawl budget waste. The
             * archive page is also disabled at the blog plugin level via
             * archiveBasePath: null; /blog/authors/** is excluded from
             * the sitemap. These exclusions keep llms.txt clean too.
             */
            '/blog/authors/**',
            '/blog-preview',
          ],
        },
        includeOrder: [
          '/about-silhouette',
          '/quickstart',
          '/concepts/**',
          '/trading/**',
          '/architecture/**',
          '/api/**',
          '/sdk',
          '/guides/**',
          '/glossary',
          '/faq',
        ],
      },
    ],
    '@stackql/docusaurus-plugin-structured-data',
    /*
     * Local postBuild pass that repairs malformed BreadcrumbList JSON-LD
     * emitted by @stackql/docusaurus-plugin-structured-data. The upstream
     * plugin has a bug where routes like /api/authentication and
     * /concepts/tee fall through the case-1 switch (which only handles
     * `docs` and `blog` as ancestor tokens), leaving `pageName` undefined
     * and `elementIndex` at its init value of 1. The result is a
     * BreadcrumbList with two position-1 entries and one `name: "undefined"`,
     * which Google's Rich Results Test rejects and AI citation scorers
     * ignore. See src/plugins/structured-data-fix/index.js for detail.
     *
     * Registration order matters: this plugin must run AFTER the stackql
     * plugin so its postBuild sees the stackql-written JSON-LD.
     */
    './src/plugins/structured-data-fix',
    [
      '@scalar/docusaurus',
      {
        label: 'API Explorer',
        route: '/api/explorer',
        showNavLink: false, // we add it to the docs sidebar instead
        configuration: {
          /*
           * OpenAPI spec source URLs.
           *
           * Vercel deploys (preview at silhouette-docs-preview.vercel.app
           * and any future Vercel-hosted public deploy) use relative URLs
           * that get proxied to api.silhouette.exchange via the rewrites
           * defined in vercel.json. The proxy makes the spec fetch
           * same-origin from the browser's perspective, which avoids the
           * Silhouette API server's allowlist-based CORS policy that
           * only reflects known origins (localhost:3100 and the public
           * docs.silhouette.exchange).
           *
           * Local dev (`pnpm start`) and any non-Vercel production deploy
           * use the absolute URL because the API server allows their
           * origins natively. Switched via process.env.VERCEL which is
           * set to "1" by Vercel during builds.
           */
          sources: [
            {
              url:
                process.env.VERCEL === '1'
                  ? '/openapi/v0.json'
                  : 'https://api.silhouette.exchange/v0/openapi.json',
              title: 'v0 (current)',
              slug: 'v0',
              default: true,
            },
            {
              url:
                process.env.VERCEL === '1'
                  ? '/openapi/v1.json'
                  : 'https://api.silhouette.exchange/v1/openapi.json',
              title: 'v1 (next)',
              slug: 'v1',
            },
          ],
          darkMode: true,
          hideClientButton: false,
          hideDarkModeToggle: true,
          telemetry: false, // privacy: do not phone home from the docs site
          theme: 'none', // we override CSS variables in custom.css
          layout: 'modern',
          hiddenClients: ['c', 'clojure', 'http', 'ocaml', 'powershell', 'objc', 'r'],
          defaultHttpClient: {
            targetKey: 'shell',
            clientKey: 'curl',
          },
        },
      },
    ],
  ],

  themeConfig: {
    structuredData: {
      excludedRoutes: [
        '/search',
        '/blog/authors',
        '/blog/tags',
        '/blog/archive',
        '/blog',
        '/api/explorer',
      ],
      verbose: false,
      featuredImageDimensions: {
        width: 1200,
        height: 627,
      },
      authors: {
        'Silhouette Team': {
          authorId: 'silhouette-team',
          url: 'https://silhouette.exchange',
          imageUrl: 'https://github.com/silhouette-exchange.png',
          sameAs: [
            'https://x.com/silhouette_ex',
            'https://github.com/silhouette-exchange',
            'https://t.me/silhouette_exchange',
          ],
        },
      },
      organization: {
        name: 'Silhouette Exchange',
        legalName: 'Silhouette Exchange',
        url: 'https://silhouette.exchange',
        sameAs: [
          'https://x.com/silhouette_ex',
          'https://t.me/silhouette_exchange',
          'https://github.com/silhouette-exchange',
        ],
        description:
          'Silhouette is a shielded perpetuals exchange on Hyperliquid. Orders are encrypted inside a Trusted Execution Environment and settled through delegated wallets.',
        logo: {
          '@type': 'ImageObject',
          inLanguage: 'en-US',
          '@id': 'https://docs.silhouette.exchange/#logo',
          url: 'https://docs.silhouette.exchange/img/silhouette-title-logo.svg',
          contentUrl: 'https://docs.silhouette.exchange/img/silhouette-title-logo.svg',
          width: 240,
          height: 32,
          caption: 'Silhouette Exchange',
        },
      },
      website: {
        inLanguage: 'en-US',
      },
      webpage: {
        inLanguage: 'en-US',
        datePublished: '2025-01-01',
      },
      breadcrumbLabelMap: {
        'about-silhouette': 'About',
        'quickstart': 'Quickstart',
        'concepts': 'Core Concepts',
        'trading': 'Trading',
        'architecture': 'Architecture',
        'api': 'API',
        'sdk': 'Python SDK',
        'guides': 'Guides',
        'glossary': 'Glossary',
        'faq': 'FAQs',
      },
    },
    // Replace with social card
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    image: 'img/silhouette-social-card.png',
    metadata: [
      { name: 'theme-color', content: '#13161a' },
      { name: 'og:site_name', content: 'Silhouette Docs' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@silhouette_ex' },
    ],
    navbar: {
      title: 'Silhouette',
      logo: {
        alt: 'Silhouette Exchange',
        src: 'img/silhouette-title-logo.svg',
        height: 18,
      },
      items: [
        { to: '/about-silhouette', label: 'Docs', position: 'left' },
        { to: '/guides', label: 'Guides', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },
        { href: 'https://app.silhouette.exchange', label: 'Launch App', position: 'right' },
      ],
    },
    footer: {
      logo: {
        alt: 'Silhouette Exchange',
        src: 'img/silhouette-title-logo.svg',
      },
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Docs',
              href: '/about-silhouette',
            },
            {
              label: 'Guides',
              href: '/guides',
            },
            {
              label: 'API',
              href: '/api',
            },
          ],
        },
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
      additionalLanguages: ['bash', 'json', 'typescript', 'solidity', 'rust', 'toml', 'yaml'],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'error-next-line',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
