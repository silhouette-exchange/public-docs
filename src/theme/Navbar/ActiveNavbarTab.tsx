import React, { useEffect } from "react";
import { useLocation } from "@docusaurus/router";

/**
 * Client-side component that dynamically updates navbar tab active states
 * based on the current route.
 */
export default function ActiveNavbarTab(): null {
  const location = useLocation();

  useEffect(() => {
    // Wait for DOM to be ready and navbar tabs to be rendered
    const updateActiveTab = () => {
      // Find all navbar tabs
      const navbarTabs = document.querySelectorAll(".navbar-tab");

      if (navbarTabs.length === 0) {
        // If tabs aren't ready yet, try again on next frame
        requestAnimationFrame(updateActiveTab);
        return;
      }

      // Remove active class from all tabs
      navbarTabs.forEach((tab) => {
        tab.classList.remove("navbar-tab-active");
      });

      // Determine which tab should be active based on current pathname
      const currentPath = location.pathname;
      let activeIndex = -1;

      // Order matters: check most specific routes first
      // FAQ tab (index 2)
      if (currentPath === "/docs/faq" || currentPath.startsWith("/docs/faq/")) {
        activeIndex = 2;
      }
      // API tab (index 1)
      else if (currentPath.startsWith("/api")) {
        activeIndex = 1;
      }
      // Docs tab (index 0) - matches /docs routes and home page
      else if (
        currentPath.startsWith("/docs") ||
        currentPath === "/" ||
        currentPath === ""
      ) {
        activeIndex = 0;
      }

      // Add active class to the matching tab
      if (activeIndex >= 0 && navbarTabs[activeIndex]) {
        navbarTabs[activeIndex].classList.add("navbar-tab-active");
      }
    };

    // Use requestAnimationFrame for smoother DOM updates
    requestAnimationFrame(updateActiveTab);
  }, [location.pathname]);

  // This component doesn't render anything
  return null;
}
