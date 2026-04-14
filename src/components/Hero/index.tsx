import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface HeroCTA {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HeroDataRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface HeroProps {
  eyebrow?: string;
  status?: 'live' | 'beta' | 'testnet';
  headline: string;
  accentWord?: string;
  sub: string;
  ctas?: HeroCTA[];
  stats?: HeroStat[];
  panelTitle?: string;
  panelRows?: HeroDataRow[];
}

function renderHeadlineWithAccent(headline: string, accentWord?: string) {
  if (!accentWord) return headline;
  const idx = headline.toLowerCase().indexOf(accentWord.toLowerCase());
  if (idx === -1) return headline;
  const before = headline.slice(0, idx);
  const match = headline.slice(idx, idx + accentWord.length);
  const after = headline.slice(idx + accentWord.length);
  return (
    <>
      {before}
      <span className={styles.accent}>{match}</span>
      {after}
    </>
  );
}

export default function Hero({
  eyebrow,
  status = 'live',
  headline,
  accentWord,
  sub,
  ctas = [],
  stats = [],
  panelTitle,
  panelRows = [],
}: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.glowMagenta} />
        <div className={styles.glowCyan} />
        <div className={styles.grid} />
        <div className={styles.scanline} />
        <div className={styles.vignette} />
      </div>

      <div className={styles.shellLeft} aria-hidden="true">
        <div className={styles.shellRule} />
        <div className={styles.shellIndex}>SLH&nbsp;/&nbsp;00</div>
      </div>

      <div className={styles.inner}>
        <div className={styles.content}>
          {eyebrow && (
            <div className={styles.eyebrow}>
              <span
                className={`${styles.statusDot} ${styles[`dot_${status}`]}`}
                aria-hidden="true"
              />
              <span className={styles.eyebrowText}>{eyebrow}</span>
            </div>
          )}

          <h1 className={styles.headline}>
            <span className={styles.headlineInner}>
              {renderHeadlineWithAccent(headline, accentWord)}
            </span>
          </h1>

          <p className={styles.sub}>{sub}</p>

          {ctas.length > 0 && (
            <div className={styles.ctaRow}>
              {ctas.map((c, i) => (
                <Link
                  key={i}
                  to={c.href}
                  className={`${styles.cta} ${styles[c.variant || 'primary']}`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          )}

          {stats.length > 0 && (
            <dl className={styles.stats}>
              {stats.map((s, i) => (
                <div key={i} className={styles.stat}>
                  <dt className={styles.statLabel}>{s.label}</dt>
                  <dd className={styles.statValue}>{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {panelRows.length > 0 && (
          <aside
            className={styles.panel}
            aria-label={panelTitle || 'System status'}
          >
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>
                {panelTitle || 'SLH/SYS'}
              </span>
              <span className={styles.panelStatus}>
                <span className={styles.panelStatusDot} aria-hidden="true" />
                Online
              </span>
            </div>

            <div className={styles.panelDivider} aria-hidden="true" />

            <dl className={styles.panelRows}>
              {panelRows.map((row, i) => (
                <div key={i} className={styles.panelRow}>
                  <dt className={styles.panelRowLabel}>{row.label}</dt>
                  <dd
                    className={`${styles.panelRowValue} ${
                      row.highlight ? styles.panelRowValueHighlight : ''
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className={styles.panelDivider} aria-hidden="true" />

            <div className={styles.panelFooter}>
              <span className={styles.panelTimestamp}>Quote v0.4.2</span>
              <span className={styles.panelPing} aria-hidden="true">
                <span className={styles.panelPingBar} />
                <span className={styles.panelPingBar} />
                <span className={styles.panelPingBar} />
                <span className={styles.panelPingBar} />
                <span className={styles.panelPingBar} />
              </span>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
