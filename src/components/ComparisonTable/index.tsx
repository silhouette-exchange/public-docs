import React from 'react';
import styles from './styles.module.css';

export interface ComparisonColumn {
  label: string;
  accent?: boolean;
}

export interface ComparisonRow {
  criterion: string;
  values: (string | React.ReactNode)[];
}

export interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  caption?: string;
}

export default function ComparisonTable({
  columns,
  rows,
  caption,
}: ComparisonTableProps) {
  return (
    <figure className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col" />
            {columns.map((c, i) => (
              <th key={i} scope="col" className={c.accent ? styles.accent : ''}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <th scope="row">{r.criterion}</th>
              {r.values.map((v, j) => (
                <td key={j}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
