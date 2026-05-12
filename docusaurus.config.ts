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
    faster: {
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
      tagName: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
      },
    },
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
          /*
           * Show a "Last updated" footer on every doc page. Sources from
           * git commit history of the source MD/MDX file. AI citation
           * scorers and human readers both weight visible recency signals.
           * Author is suppressed to avoid surfacing GitHub handles on a
           * marketing-facing docs surface where the byline is always
           * "Silhouette Team" in practice.
           */
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          exclude: ['plans/**'],
        },
        blog: {
          showReadingTime: true,
          routeBasePath: '/blog',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
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
          priority: 0.5,
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.map((item) => {
              const path = new URL(item.url).pathname;
              if (path === '/' || path === '/about-silhouette') {
                return { ...item, priority: 0.9 };
              }
              if (
                path === '/quickstart' ||
                path === '/how-silhouette-works' ||
                path.startsWith('/trading/') ||
                path === '/faq'
              ) {
                return { ...item, priority: 0.8 };
              }
              if (
                path.startsWith('/architecture/') ||
                path.startsWith('/api/') ||
                path === '/sdk' ||
                path.startsWith('/blog/')
              ) {
                return { ...item, priority: 0.7 };
              }
              return { ...item, priority: 0.5 };
            });
          },
          /*
           * /plans/** are in-repo execution notes, excluded from public
           * discovery. /blog/authors/** is a thin Docusaurus auto-generated
           * author listing tree that the SEO audit flagged as crawl-budget
           * waste (we only have one author today and no real author bios
           * yet). /blog/archive is disabled at the plugin level via
           * archiveBasePath: null.
           */
          ignorePatterns: [
            '/plans/**',
            '/blog/authors/**',
            '/blog-preview',
            '/search',
            /*
             * Phase 2 stub pages for guide sub-sections. Each contains a
             * single ShieldedCallout with a link to the real content.
             * Excluded from the sitemap to avoid thin-content crawl
             * signals. Re-add when Phase 2 content ships.
             */
            '/guides/for-developers',
            '/guides/for-developers/**',
            '/guides/for-institutions',
            '/guides/for-institutions/**',
            '/guides/for-traders',
            '/guides/for-traders/**',
            '/guides/comparisons',
            '/guides/comparisons/**',
          ],
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
    /*
     * Guides plugin disabled until Phase 2 content ships.
     * The placeholder pages were appearing in the search index even
     * though navbar, sitemap, and llms.txt already excluded them.
     * Disabling the plugin entirely stops the routes from being built,
     * which removes them from every public surface in one shot.
     * To re-enable: uncomment this block. The sidebar file
     * (guidesSidebars.ts) and content under guides/ are kept on disk
     * and ready to ship.
     */
    // [
    //   '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'guides',
    //     path: 'guides',
    //     routeBasePath: 'guides',
    //     sidebarPath: require.resolve('./guidesSidebars.ts'),
    //     showLastUpdateTime: false,
    //     showLastUpdateAuthor: false,
    //   },
    // ],
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'Silhouette',
        siteDescription:
          'Silhouette is a shielded trading platform on Hyperliquid. Trade without exposing your wallet, your strategy, or your size. The cheapest venue to accumulate assets onchain.',
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
            /*
             * Phase 2 guide stub pages. Each is a single ShieldedCallout
             * redirecting to real content. Excluded from llms.txt to
             * avoid polluting AI context with placeholder pages.
             */
            '/guides/for-developers',
            '/guides/for-developers/**',
            '/guides/for-institutions',
            '/guides/for-institutions/**',
            '/guides/for-traders',
            '/guides/for-traders/**',
            '/guides/comparisons',
            '/guides/comparisons/**',
          ],
        },
        includeOrder: [
          '/about-silhouette',
          '/quickstart',
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
     * NOTE: the upstream @stackql plugin emits a malformed BreadcrumbList
     * for any route whose ancestor token is not `docs` or `blog` (e.g.
     * /api/*, /trading/*, /architecture/*). Its case-1 switch falls
     * through with pageName undefined and elementIndex still at 1,
     * producing two ListItems at position 1 and a name "undefined" entry.
     * Google's Rich Results Test rejects this and AI citation scorers
     * ignore it.
     *
     * We previously tried fixing this via a sibling Docusaurus plugin
     * with a postBuild hook. Empirically, Docusaurus does NOT guarantee
     * postBuild execution order, and stackql's postBuild was racing ours
     * and overwriting the repaired output. The fix is now a standalone
     * Node script wired to the npm `postbuild` lifecycle in package.json,
     * which always runs after `docusaurus build` finishes. See
     * scripts/fix-structured-data.mjs.
     */
    // Scalar API Explorer temporarily disabled for public docs launch.
    // Re-enable by uncommenting the block below.
    // [
    //   '@scalar/docusaurus',
    //   {
    //     label: 'API Explorer',
    //     route: '/api/explorer',
    //     showNavLink: false,
    //     configuration: {
    //       sources: [
    //         {
    //           url:
    //             process.env.VERCEL === '1'
    //               ? '/openapi/v0.json'
    //               : 'https://api.silhouette.exchange/v0/openapi.json',
    //           title: 'v0 (current)',
    //           slug: 'v0',
    //           default: true,
    //         },
    //         {
    //           url:
    //             process.env.VERCEL === '1'
    //               ? '/openapi/v1.json'
    //               : 'https://api.silhouette.exchange/v1/openapi.json',
    //           title: 'v1 (next)',
    //           slug: 'v1',
    //         },
    //       ],
    //       darkMode: true,
    //       hideClientButton: false,
    //       hideDarkModeToggle: true,
    //       telemetry: false,
    //       theme: 'none',
    //       layout: 'modern',
    //       hiddenClients: ['c', 'clojure', 'http', 'ocaml', 'powershell', 'objc', 'r'],
    //       defaultHttpClient: {
    //         targetKey: 'shell',
    //         clientKey: 'curl',
    //       },
    //     },
    //   },
    // ],
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
          'Silhouette is a shielded trading platform on Hyperliquid. Trade without exposing your wallet, your strategy, or your size. The cheapest venue to accumulate assets onchain.',
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
        // Guides nav entry temporarily hidden for public launch; re-add when content is ready.
        // { to: '/guides', label: 'Guides', position: 'left' },
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
