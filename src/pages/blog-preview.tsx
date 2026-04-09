/*
 * INTERNAL DEV PREVIEW PAGE - DELETE BEFORE MERGE TO MAIN
 *
 * Visual harness for the Phase 2 blog redesign components. Mounts each
 * component in isolation with realistic props so we can eyeball them
 * end-to-end before stacking more on top.
 *
 * Reachable at /blog-preview on the dev server.
 *
 * To remove: delete this file. No other references exist.
 */

import { useState } from 'react';
import Layout from '@theme/Layout';

import BlogPublicationHeader from '@site/src/components/blog/BlogPublicationHeader';
import BlogCategoryPills from '@site/src/components/blog/BlogCategoryPills';
import BlogCoverFallback from '@site/src/components/blog/BlogCoverFallback';
import BlogCoverImage from '@site/src/components/blog/BlogCoverImage';
import BlogEyebrow from '@site/src/components/blog/BlogEyebrow';
import BlogByline from '@site/src/components/blog/BlogByline';
import BlogPostCard, {
  type BlogPostLike,
} from '@site/src/components/blog/BlogPostCard';
import BlogHero from '@site/src/components/blog/BlogHero';
import BlogSeriesCard from '@site/src/components/blog/BlogSeriesCard';
import BlogSeriesBand from '@site/src/components/blog/BlogSeriesBand';
import BlogLatestBand from '@site/src/components/blog/BlogLatestBand';
import BlogArchiveList from '@site/src/components/blog/BlogArchiveList';
import { CATEGORIES } from '@site/src/data/blog/categories';

/* Mock post fixtures used across the Phase 2 composition sections. */
const heroPost: BlogPostLike = {
  slug: 'shielded-execution-explained',
  title: 'Shielded Execution Explained: Why Public Orderbooks Leak Strategy',
  permalink: 'https://example.com/preview-mock/shielded-execution-explained',
  category: 'research',
  dek: 'Public orderbooks leak strategy to copytrade bots and signal-aware liquidity providers. Shielded execution closes the leakage by encrypting orders until match. Here is how the system works end to end.',
  coverImage: '/img/hero.png',
  readingTime: 9,
  authorName: 'Wayne van Niekerk',
  authorImageUrl: '/img/logo-square-light.png',
  date: '2026-04-08',
};

const latestPosts: BlogPostLike[] = [
  {
    slug: 'why-tee-not-zk',
    title: 'Why TEEs and Not Zero Knowledge for Shielded Trading',
    permalink: 'https://example.com/preview-mock/why-tee-not-zk',
    category: 'explainers',
    dek: 'A pragmatic look at the latency, throughput, and developer-experience trade-offs that pushed Silhouette to a TEE-first design.',
    coverImage: '/img/hero.png',
    readingTime: 6,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-05',
  },
  {
    slug: 'fee-rebate-mechanism',
    title: '95 Percent of the Hyperliquid Volume Discount, Returned',
    permalink: 'https://example.com/preview-mock/fee-rebate-mechanism',
    category: 'product',
    dek: 'How Silhouette routes the Hyperliquid taker rebate back to the trader who actually moved the size, with an on-chain proof for every payout.',
    readingTime: 4,
    authorName: 'Sydney',
    date: '2026-04-03',
  },
  {
    slug: 'first-week-numbers',
    title: 'Our First Week on Mainnet, Numbers and Lessons',
    permalink: 'https://example.com/preview-mock/first-week-numbers',
    category: 'announcements',
    dek: 'Volume, fills, latency, the boring failure modes, and the one thing we did not see coming.',
    coverImage: '/img/hero.png',
    readingTime: 5,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-01',
  },
  {
    slug: 'order-router-internals',
    title: 'Inside the Order Router: From Encryption to Match',
    permalink: 'https://example.com/preview-mock/order-router-internals',
    category: 'research',
    dek: 'A walkthrough of the path your order takes from the moment it leaves the keystore to the moment a fill notification reaches your client.',
    readingTime: 8,
    authorName: 'Sydney',
    date: '2026-03-29',
  },
];

const seriesPosts: BlogPostLike[] = [
  {
    slug: 'what-is-silhouette',
    title: 'What Is Silhouette?',
    permalink: 'https://example.com/preview-mock/what-is-silhouette',
    category: 'explainers',
    dek: 'A 4-minute primer on shielded perpetuals and why a private orderbook matters when bots watch every wallet.',
    readingTime: 4,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-08',
    series: 'silhouette-primer',
    seriesOrder: 1,
  },
  {
    slug: 'why-shielded',
    title: 'Why Shielded Trading Matters',
    permalink: 'https://example.com/preview-mock/why-shielded',
    category: 'explainers',
    dek: 'Strategy leakage is not theoretical. We measured it. The cost surprised us.',
    readingTime: 6,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-07',
    series: 'silhouette-primer',
    seriesOrder: 2,
  },
  {
    slug: 'tee-architecture',
    title: 'TEE Architecture for Crypto Orderbooks',
    permalink: 'https://example.com/preview-mock/tee-architecture',
    category: 'research',
    dek: 'Attestation, side-channel hardening, and the operational realities of running a TEE in production.',
    readingTime: 10,
    authorName: 'Sydney',
    date: '2026-04-06',
    series: 'silhouette-primer',
    seriesOrder: 3,
  },
  {
    slug: 'how-orders-encrypt',
    title: 'How Your Orders Get Encrypted',
    permalink: 'https://example.com/preview-mock/how-orders-encrypt',
    category: 'guides',
    dek: 'A guided tour of the client-side encryption flow, with diagrams.',
    readingTime: 5,
    authorName: 'Wayne van Niekerk',
    date: '2026-04-05',
    series: 'silhouette-primer',
    seriesOrder: 4,
  },
  {
    slug: 'matching-engine',
    title: 'Inside the Matching Engine',
    permalink: 'https://example.com/preview-mock/matching-engine',
    category: 'research',
    dek: 'How Silhouette settles a trade without ever exposing the resting book to the operator.',
    readingTime: 8,
    authorName: 'Sydney',
    date: '2026-04-04',
    series: 'silhouette-primer',
    seriesOrder: 5,
  },
];

const archivePosts: BlogPostLike[] = [
  {
    slug: 'origin-story',
    title: 'The Silhouette Origin Story: Three Years and a Thesis',
    permalink: 'https://example.com/preview-mock/origin-story',
    category: 'announcements',
    readingTime: 7,
    authorName: 'Wayne van Niekerk',
    date: '2026-02-15',
  },
  {
    slug: 'pre-launch-checklist',
    title: 'The Pre-Launch Audit Checklist We Used',
    permalink: 'https://example.com/preview-mock/pre-launch-checklist',
    category: 'guides',
    readingTime: 9,
    authorName: 'Sydney',
    date: '2026-02-08',
  },
  {
    slug: 'what-we-learned-on-testnet',
    title: 'What We Learned From Six Weeks on Testnet',
    permalink: 'https://example.com/preview-mock/what-we-learned-on-testnet',
    category: 'product',
    readingTime: 6,
    authorName: 'Wayne van Niekerk',
    date: '2026-01-28',
  },
];

const sectionStyle: React.CSSProperties = {
  borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
  paddingTop: '32px',
  paddingBottom: '32px',
};

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: 'var(--text-muted)',
  marginBottom: '16px',
  display: 'block',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1280px',
  marginInline: 'auto',
  paddingInline: '20px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '24px',
};

const cardLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--text-muted)',
  marginTop: '8px',
  display: 'block',
};

export default function BlogPreview(): React.ReactElement {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  return (
    <Layout
      title="Blog component preview (internal)"
      description="Internal visual harness for Phase 2 blog components. Not indexed."
      noFooter={false}
    >
      <main style={containerStyle}>
        <div style={{ paddingTop: '48px', paddingBottom: '16px' }}>
          <span style={sectionLabelStyle}>INTERNAL PREVIEW</span>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--text-muted)',
              maxWidth: '640px',
              margin: 0,
            }}
          >
            Phase 2 blog redesign components rendered in isolation. Delete
            this page after Phase 2 visual review wraps. Active filter is
            wired to BlogCategoryPills onChange so you can verify the
            interactive state.
          </p>
        </div>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>1. BlogPublicationHeader</span>
          <BlogPublicationHeader
            title="Silhouette Stories"
            subtitle="Field notes from a shielded orderbook. Research, guides, and dispatches from the team building private trading on Hyperliquid."
          />
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            2. BlogCategoryPills (interactive — current: {activeSlug ?? 'all'})
          </span>
          <BlogCategoryPills
            activeSlug={activeSlug}
            onChange={setActiveSlug}
          />
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            3. BlogCoverFallback — short, medium, and long titles
          </span>
          <div style={gridStyle}>
            <div>
              <BlogCoverFallback title="Dark Pools" />
              <span style={cardLabelStyle}>short title (2 words)</span>
            </div>
            <div>
              <BlogCoverFallback title="Information Asymmetry on Public Orderbooks" />
              <span style={cardLabelStyle}>medium title (5 words)</span>
            </div>
            <div>
              <BlogCoverFallback title="What is the Real Cost of Strategy Leakage in Crypto Perpetual Trading and How Can Shielded Execution Recover It" />
              <span style={cardLabelStyle}>pathological long title (line-clamp 3)</span>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            4. BlogCoverImage — real image vs fallback delegation
          </span>
          <div style={gridStyle}>
            <div>
              <BlogCoverImage
                src="/img/hero.png"
                alt="Hero image"
                title="Real image with src"
              />
              <span style={cardLabelStyle}>
                src=&quot;/img/hero.png&quot; (hover to fade overlay)
              </span>
            </div>
            <div>
              <BlogCoverImage title="No src - delegates to BlogCoverFallback" />
              <span style={cardLabelStyle}>
                src undefined (renders BlogCoverFallback)
              </span>
            </div>
            <div>
              <BlogCoverImage src="" title="Empty src - also delegates" />
              <span style={cardLabelStyle}>
                src=&quot;&quot; (empty string, also delegates)
              </span>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            5. BlogEyebrow — all 5 categories, both date formats
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
            {CATEGORIES.map((cat) => (
              <BlogEyebrow
                key={cat.slug}
                category={cat.slug}
                readingTime={7}
                date="2026-04-08"
              />
            ))}
            <BlogEyebrow
              category="research"
              readingTime={7}
              date="2026-04-08"
              linkCategory
            />
            <span style={cardLabelStyle}>↑ linkCategory=true (hover the category)</span>
            <BlogEyebrow category="guides" date="2026-04-08" />
            <span style={cardLabelStyle}>↑ no reading time prop</span>
            <BlogEyebrow
              category="explainers"
              readingTime={12}
              date="2026-04-08"
              dateFormat="month-year"
            />
            <span style={cardLabelStyle}>↑ dateFormat="month-year"</span>
            <BlogEyebrow
              category="research"
              readingTime={3}
              date="2026-04-01"
            />
            <span style={cardLabelStyle}>↑ timezone-edge date "2026-04-01" (regression guard)</span>
          </div>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            6. BlogByline — single, multi-author, initials fallback, sizes
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <BlogByline
              avatarSize="md"
              authors={[
                {
                  name: 'Wayne van Niekerk',
                  title: 'Head of Growth',
                  imageUrl: '/img/logo-square-light.png',
                  url: 'https://x.com/WaynesWorldza',
                },
              ]}
            />
            <span style={cardLabelStyle}>↑ single author, md size, with link</span>

            <BlogByline
              avatarSize="md"
              authors={[
                {
                  name: 'Wayne van Niekerk',
                  title: 'Head of Growth',
                  imageUrl: '',
                },
              ]}
            />
            <span style={cardLabelStyle}>↑ single author, no imageUrl → initials fallback "W"</span>

            <BlogByline
              avatarSize="md"
              authors={[
                {
                  name: 'Wayne van Niekerk',
                  title: 'Head of Growth',
                  imageUrl: '/img/this-image-does-not-exist-and-will-onerror.png',
                },
              ]}
            />
            <span style={cardLabelStyle}>↑ broken imageUrl → onError fallback to initials</span>

            <BlogByline
              avatarSize="md"
              authors={[
                { name: 'Wayne', title: 'Head of Growth' },
                { name: 'Sydney', title: 'Product Lead' },
              ]}
            />
            <span style={cardLabelStyle}>↑ 2 authors, both without imageUrl → 2 initials avatars overlapping</span>

            <BlogByline
              avatarSize="md"
              authors={[
                { name: 'Wayne', title: 'Head of Growth' },
                { name: 'Sydney', title: 'Product Lead' },
                { name: 'Jerri', title: 'Marketing Lead' },
              ]}
            />
            <span style={cardLabelStyle}>↑ 3 authors → 2 visible + "+1 more"</span>

            <BlogByline
              avatarSize="md"
              authors={[
                { name: 'Wayne' },
                { name: 'Sydney' },
                { name: 'Jerri' },
                { name: 'Stent' },
                { name: 'Chandler' },
              ]}
            />
            <span style={cardLabelStyle}>↑ 5 authors → 2 visible + "+3 more"</span>

            <BlogByline
              avatarSize="sm"
              authors={[
                {
                  name: 'Wayne van Niekerk',
                  title: 'Head of Growth',
                },
              ]}
            />
            <span style={cardLabelStyle}>↑ avatarSize="sm" (32px, listing card variant)</span>
          </div>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            7. BlogCoverImage with custom className passthrough
          </span>
          <div style={{ ...gridStyle, gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))' }}>
            <BlogCoverImage
              src="/img/hero.png"
              title="Custom width via className"
              className="preview-wide-cover"
            />
          </div>
          <style>{`
            .preview-wide-cover {
              max-width: 720px;
            }
          `}</style>
        </section>

        {/* ============================================================
            COMPOSITION COMPONENTS (Tasks 2.7 - 2.12)
            ============================================================ */}

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            8. BlogPostCard - standard grid card with alternating glow
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '40px 40px',
            }}
          >
            {latestPosts.slice(0, 4).map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
          <span style={cardLabelStyle}>
            ↑ each card's hover glow alternates magenta/cyan deterministically by slug hash
          </span>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            9. BlogHero - featured split-layout card
          </span>
          <BlogHero post={heroPost} />
          <span style={cardLabelStyle}>
            ↑ split layout (cover 60% / copy 40%) at ≥996px, stacks below
          </span>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            10. BlogSeriesCard - numbered step card (rendered solo)
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '900px',
            }}
          >
            {seriesPosts.slice(0, 3).map((post, i) => (
              <BlogSeriesCard
                key={post.slug}
                post={post}
                seriesOrder={i + 1}
                seriesTotal={3}
              />
            ))}
          </div>
          <span style={cardLabelStyle}>
            ↑ cyan-tinted border, decorative "→ READ" footer translates on hover
          </span>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            11. BlogSeriesBand - full conditional series wrapper (filter=null)
          </span>
          <BlogSeriesBand allPosts={seriesPosts} activeFilter={null} />
          <span style={cardLabelStyle}>
            ↑ header with dashed dividers, sub-line, responsive grid (4 col / 3 col / horiz scroll)
          </span>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            12. BlogSeriesBand - hidden when filter is set (returns null)
          </span>
          <div
            style={{
              padding: '24px',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            Below this line, BlogSeriesBand renders nothing because activeFilter="research".
            <br />
            <BlogSeriesBand allPosts={seriesPosts} activeFilter="research" />
            (no output)
          </div>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            13. BlogLatestBand - "LATEST" label, 2-col grid of cards
          </span>
          <BlogLatestBand posts={latestPosts} activeFilter={null} />
          <span style={cardLabelStyle}>
            ↑ "LATEST" label on the all view; 2-column grid below
          </span>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            14. BlogLatestBand - filtered view shows category label
          </span>
          <BlogLatestBand
            posts={latestPosts.filter((p) => p.category === 'research')}
            activeFilter="research"
          />
          <span style={cardLabelStyle}>
            ↑ filtered to "research" - label becomes "RESEARCH"
          </span>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            15. BlogArchiveList - text-only "more essays" tail
          </span>
          <BlogArchiveList posts={archivePosts} />
          <span style={cardLabelStyle}>
            ↑ no cards, no images, just rows. Hover to see the background brighten.
          </span>
        </section>

        <section style={sectionStyle}>
          <span style={sectionLabelStyle}>
            16. End-to-end blog listing preview (everything composed)
          </span>
          <BlogPublicationHeader
            title="Silhouette Stories"
            subtitle="Field notes from a shielded orderbook. Research, guides, and dispatches from the team building private trading on Hyperliquid."
          />
          <BlogCategoryPills activeSlug={activeSlug} onChange={setActiveSlug} />
          <div style={{ height: '48px' }} />
          {activeSlug === null && <BlogHero post={heroPost} />}
          <div style={{ height: '64px' }} />
          {activeSlug === null && (
            <BlogSeriesBand allPosts={seriesPosts} activeFilter={activeSlug} />
          )}
          <div style={{ height: '64px' }} />
          <BlogLatestBand
            posts={
              activeSlug === null
                ? latestPosts
                : latestPosts.filter((p) => p.category === activeSlug)
            }
            activeFilter={activeSlug}
          />
          <div style={{ height: '64px' }} />
          {activeSlug === null && <BlogArchiveList posts={archivePosts} />}
          <span style={cardLabelStyle}>
            ↑ approximation of how the BlogListPage swizzle (Phase 3 Task 3.3) will compose
            everything. Click a category pill in section 2 above to filter this composition live.
          </span>
        </section>

        <div style={{ height: '128px' }} />
      </main>
    </Layout>
  );
}
