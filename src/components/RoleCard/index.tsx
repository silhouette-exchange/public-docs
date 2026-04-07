import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface RoleCardProps {
  role: 'developer' | 'institution' | 'trader';
  index?: string;
  kicker?: string;
  title: string;
  description: string;
  meta?: string;
  href: string;
  ctaLabel?: string;
}

export default function RoleCard({
  role,
  index,
  kicker,
  title,
  description,
  meta,
  href,
  ctaLabel = 'Start here',
}: RoleCardProps) {
  return (
    <Link to={href} className={`${styles.card} ${styles[role]}`}>
      <div className={styles.cardAccent} aria-hidden="true" />
      <div className={styles.cardCorner} aria-hidden="true">
        <span className={styles.cornerLine} />
        <span className={styles.cornerLine} />
      </div>

      <header className={styles.header}>
        {index && <span className={styles.index}>{index}</span>}
        {kicker && <span className={styles.kicker}>{kicker}</span>}
      </header>

      <h3 className={styles.title}>
        <span className={styles.titleInner}>{title}</span>
      </h3>

      <p className={styles.description}>{description}</p>

      {meta && (
        <div className={styles.meta}>
          <span className={styles.metaDot} aria-hidden="true" />
          {meta}
        </div>
      )}

      <footer className={styles.footer}>
        <span className={styles.cta}>{ctaLabel}</span>
        <span className={styles.ctaArrow} aria-hidden="true">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path
              d="M0 5h12M8 1l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </span>
      </footer>
    </Link>
  );
}
