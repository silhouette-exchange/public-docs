import React, { type ReactNode } from "react";
import styles from "./styles.module.css";

/*
 * JoinUs
 *
 * Article-page CTA block that replaces the legacy markdown snippet
 * the early Silhouette blog posts all copy-pasted into their bodies:
 *
 *     ### Join Us
 *     Follow our journey and stay informed.
 *     [X](...) | [Website](...) | [Blog](...) | [Telegram](...)
 *
 * That pipe-separated link row was ugly (underlined text links
 * stacked under a heading) and not hoverable in any meaningful way.
 * This component swaps it for four circular icon buttons with
 * an accessible label per icon and a cyan-glow hover state matching
 * the rest of the site's accent language. The icons are inlined as
 * SVGs so the component has no runtime icon-library dependency and
 * the colours follow `currentColor` cleanly.
 *
 * Usage (from inside an MDX blog post):
 *
 *     <JoinUs />
 *
 * Or with custom title / subtitle:
 *
 *     <JoinUs title="Stay in the loop" subtitle="Follow along as we build." />
 *
 * Registered in src/theme/MDXComponents.tsx so it is available to
 * every MDX file without an explicit import. Phase 4 will eventually
 * move this CTA out of the markdown body entirely and inject it via
 * a BlogPostItem/Footer swizzle, but until that ships this component
 * is the minimal, dry-er replacement for the hand-written text rows.
 */

interface SocialDescriptor {
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
}

const SOCIALS: readonly SocialDescriptor[] = [
  {
    label: "Follow Silhouette on X",
    href: "https://x.com/silhouette_ex",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Visit silhouette.exchange",
    href: "https://silhouette.exchange/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 3.6 9 14 14 0 0 1-3.6 9 14 14 0 0 1-3.6-9 14 14 0 0 1 3.6-9z" />
      </svg>
    ),
  },
  {
    label: "Read the Silhouette blog",
    href: "/blog",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2 2 2 0 0 1-2-2V11a1 1 0 0 1 1-1h2" />
        <path d="M18 14H10" />
        <path d="M15 18H10" />
        <path d="M10 6h8v4h-8z" />
      </svg>
    ),
  },
  {
    label: "Join the Silhouette Telegram",
    href: "https://t.me/silhouette_exchange",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
      </svg>
    ),
  },
];

export interface JoinUsProps {
  /** Heading text. Default: "Join Us". */
  readonly title?: string;
  /** Subtitle paragraph. Default: "Follow our journey and stay informed." */
  readonly subtitle?: string;
}

export default function JoinUs({
  title = "Join Us",
  subtitle = "Follow our journey and stay informed.",
}: JoinUsProps): ReactNode {
  return (
    <aside className={styles.joinUs} aria-labelledby="join-us-heading">
      <h3 id="join-us-heading" className={styles.title}>
        {title}
      </h3>
      <p className={styles.subtitle}>{subtitle}</p>
      <ul className={styles.row}>
        {SOCIALS.map((social) => {
          const isExternal = !social.href.startsWith("/");
          return (
            <li key={social.label} className={styles.item}>
              <a
                href={social.href}
                className={styles.iconButton}
                aria-label={social.label}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {social.icon}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
