import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export interface RoleCardProps {
  role: 'developer' | 'institution' | 'trader';
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
}

export default function RoleCard({
  role,
  title,
  description,
  href,
  ctaLabel = 'Start here',
}: RoleCardProps) {
  return (
    <Link to={href} className={`${styles.card} ${styles[role]}`}>
      <div className={styles.tag}>{role}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.cta}>{ctaLabel} →</div>
    </Link>
  );
}
