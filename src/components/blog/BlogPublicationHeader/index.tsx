import React from 'react';
import styles from './styles.module.css';

export interface BlogPublicationHeaderProps {
  title: string;
  subtitle?: string;
}

export default function BlogPublicationHeader({
  title,
  subtitle,
}: BlogPublicationHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
