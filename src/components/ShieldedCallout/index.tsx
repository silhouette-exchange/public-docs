import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export type ShieldedCalloutType = 'note' | 'tip' | 'warning' | 'danger';

export interface ShieldedCalloutProps {
  type?: ShieldedCalloutType;
  title?: string;
  children: React.ReactNode;
}

export default function ShieldedCallout({
  type = 'note',
  title,
  children,
}: ShieldedCalloutProps) {
  return (
    <aside className={clsx(styles.callout, styles[type])}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
