import React from 'react';
import styles from './styles.module.css';

export interface AuthorBylineProps {
  name: string;
  role?: string;
  date?: string;
  lastUpdated?: string;
  sameAs?: string;
}

export default function AuthorByline({
  name,
  role,
  date,
  lastUpdated,
  sameAs,
}: AuthorBylineProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return (
    <div
      className={styles.byline}
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className={styles.avatar} aria-hidden>
        {initials}
      </div>
      <div className={styles.meta}>
        <div className={styles.name}>
          {sameAs ? (
            <a href={sameAs} itemProp="url" rel="author">
              <span itemProp="name">{name}</span>
            </a>
          ) : (
            <span itemProp="name">{name}</span>
          )}
        </div>
        {role && (
          <div className={styles.role} itemProp="jobTitle">
            {role}
          </div>
        )}
        <div className={styles.dates}>
          {date && (
            <time dateTime={date} itemProp="datePublished">
              Published {date}
            </time>
          )}
          {lastUpdated && (
            <time dateTime={lastUpdated} itemProp="dateModified">
              Updated {lastUpdated}
            </time>
          )}
        </div>
      </div>
    </div>
  );
}
