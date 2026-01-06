import { JSX } from "react";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const docsPrefix = "/docs";

export default function NavbarItems(): JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which tab should be active based on current pathname
  const getActiveTab = (): string => {
    // Check specific routes first (more specific before general)
    if (currentPath.startsWith(`${docsPrefix}/faq`)) {
      return "faq";
    }
    if (currentPath.startsWith(`${docsPrefix}/api`)) {
      return "api";
    }
    if (currentPath.startsWith(`${docsPrefix}/blog`)) {
      return "blog";
    }
    // Docs tab - matches /docs routes and home page
    if (
      currentPath.startsWith(docsPrefix) ||
      currentPath === "/" ||
      currentPath === ""
    ) {
      return docsPrefix;
    }
    return "";
  };

  const activeTab = getActiveTab();

  return (
    <div className={styles.navbarItemsContainer}>
      <div className={styles.navbarItemsInner}>
        <Link
          to="/docs/about-silhouette"
          className={`${styles.navbarItem} ${
            activeTab === docsPrefix ? styles.navbarItemActive : ""
          }`}
        >
          SILHOUETTE DOCS
        </Link>
        <Link
          to="/docs/api"
          className={`${styles.navbarItem} ${
            activeTab === "api" ? styles.navbarItemActive : ""
          }`}
        >
          API
        </Link>
        <Link
          to="/docs/faq"
          className={`${styles.navbarItem} ${
            activeTab === "faq" ? styles.navbarItemActive : ""
          }`}
        >
          FAQ
        </Link>
        <Link
          to="/docs/blog"
          className={`${styles.navbarItem} ${
            activeTab === "blog" ? styles.navbarItemActive : ""
          }`}
        >
          BLOG
        </Link>
      </div>
    </div>
  );
}
