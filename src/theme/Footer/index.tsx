import React, {type ReactNode} from 'react';

import {useThemeConfig} from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';
import FooterLayout from '@theme/Footer/Layout';
import { useLocation } from '@docusaurus/router';

function Footer(): ReactNode {
  const {footer} = useThemeConfig();
  const {pathname} = useLocation();
  if (!footer) {
    return null;
  }
  const {copyright, links, logo, style} = footer;

  if (pathname !== '/') {
    return <></>;
  }

  return (
    <FooterLayout
      style={style}
      links={links && links.length > 0 && <FooterLinks links={links} />}
      logo={logo && <FooterLogo logo={logo} />}
      copyright={copyright && <FooterCopyright copyright={copyright} />}
    />
  );
}

export default React.memo(Footer);
