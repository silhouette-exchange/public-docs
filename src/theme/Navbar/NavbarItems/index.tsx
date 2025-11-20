import React, { type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function NavbarItems(): ReactNode {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which tab should be active based on current pathname
  const getActiveTab = () => {
    // Blog tab
    if (currentPath.startsWith("/docs/blog")) {
      return "blog";
    }
    // FAQ tab
    else if (
      currentPath === "/docs/faq" ||
      currentPath.startsWith("/docs/faq/")
    ) {
      return "faq";
    }
    // API tab
    else if (currentPath.startsWith("/docs/api")) {
      return "/docs/api";
    }
    // Docs tab - matches /docs routes and home page
    else if (
      currentPath.startsWith("/docs") ||
      currentPath === "/" ||
      currentPath === ""
    ) {
      return "docs";
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
            activeTab === "docs" ? styles.navbarItemActive : ""
          }`}
        >
          SILHOUETTE DOCS
        </Link>
        <Link
          to="/docs/api"
          className={`${styles.navbarItem} ${
            activeTab === "/docs/api" ? styles.navbarItemActive : ""
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
