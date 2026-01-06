import React, { JSX } from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig();
  const { pathname } = useLocation();

  if (!footer || pathname !== "/") {
    return null;
  }

  const { links, logo } = footer;

  return (
    <footer className="footer" data-name="Footer">
      <div className="footer__container-wrapper">
        {logo && (
          <img
            src={useBaseUrl(logo.src)}
            alt={logo.alt}
            className="footer__logo"
          />
        )}

        {links && (
          <div className="footer__columns">
            {links.map((column, i) => (
              <div key={i} className="footer__col">
                <div className="footer__title">{column.title}</div>
                <ul className="footer__items clean-list">
                  {column.items.map((item, j) => (
                    <li key={j} className="footer__item">
                      <Link className="footer__link-item" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
