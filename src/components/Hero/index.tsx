import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface HeroCTA {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface HeroProps {
  headline: string;
  sub: string;
  ctas?: HeroCTA[];
}

export default function Hero({ headline, sub, ctas = [] }: HeroProps) {
  return (
    <section className={styles.hero}>
      <h1 className={styles.headline}>{headline}</h1>
      <p className={styles.sub}>{sub}</p>
      {ctas.length > 0 && (
        <div className={styles.ctaRow}>
          {ctas.map((c, i) => (
            <Link
              key={i}
              to={c.href}
              className={`${styles.cta} ${
                c.variant === 'secondary' ? styles.secondary : styles.primary
              }`}
            >
              {c.label} →
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
