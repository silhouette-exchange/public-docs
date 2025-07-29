import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import type {Props} from '@theme/Footer/Layout';
import styles from './index.module.css';

export default function FooterLayout({
  style,
  links,
  logo,
  // copyright,
}: Props): ReactNode {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className={
        clsx(
          "container container-fluid",
          styles.footer_container
        )
      }>
        {(logo) && (
          <div className={clsx(
          )}>
            {logo && <div className="margin-bottom--sm">{logo}</div>}
            {/* {copyright} */}
          </div>
        )}
        {links}
      </div>
    </footer>
  );
}
