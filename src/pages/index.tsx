import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";
import { ArrowIcon } from "../icons/arrow.icon";
import { InfoIcon } from "../icons/info.icon";
import { QuestionMarkIcon } from "../icons/questionMark.icon";
import { BookIcon } from "../icons/book.icon";
import { XIcon } from "../icons/x.icon";
import { TelegramIcon } from "../icons/telegram.icon";
import { GithubIcon } from "../icons/github.icon";
import Searchbar from "@theme/SearchBar";

const featureCards = [
  {
    title: "What is Silhouette",
    description:
      "Learn about the core concepts of Silhouette and how to get started.",
    link: "/docs/about-silhouette",
    Icon: InfoIcon,
  },
  {
    title: "Get Started",
    description: "Connect your wallet, deposit your funds, and start trading privately.",
    link: "/docs/quickstart",
    Icon: BookIcon,
  },
  {
    title: "FAQ",
    description: "Read through our most common questions.",
    link: "/docs/faq",
    Icon: QuestionMarkIcon,
  },
];

const socialLinks = [
  {
    title: "Telegram",
    description: "Join our discussions on Telegram",
    link: "https://t.me/silhouette_exchange",
    Icon: TelegramIcon,
  },
  {
    title: "GitHub",
    description: "View our repositories",
    link: "https://github.com/silhouette-exchange",
    Icon: GithubIcon,
  },
  {
    title: "Follow Us",
    description: "See what we are getting up to on X",
    link: "https://x.com/silhouette_ex",
    Icon: XIcon,
  },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Official documentation for Silhouette Exchange - Your comprehensive resource for guides, tutorials and references"
    >
      <div className={styles.pageWrapper}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroTextContainer}>
              <Heading as="h1" className={styles.heroTitle}>
                {`Welcome to `}
                {`Silhouette Docs`}
              </Heading>
              <p className={styles.heroSubtitle}>
                Learn how to trade privately on Hyperliquid.
              </p>
              <Searchbar />
            </div>
            <div className={styles.cardContainer}>
              {featureCards.map((card, idx) => (
                <Link to={card.link} className={styles.card} key={idx}>
                  <div className={styles.cardHeader}>
                    <card.Icon className={styles.cardIcon} />
                    <ArrowIcon className={styles.linkIcon} />
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardText}>{card.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className={styles.socialContainer}>
              {socialLinks.map((item, idx) => (
                <Link to={item.link} className={styles.socialLink} key={idx}>
                  <item.Icon className={styles.socialIcon} />
                  <div>
                    <strong>{item.title}</strong>
                    <p style={{ marginBottom: 0 }}>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* TradingView Attribution */}
            <div className={styles.tradingViewAttribution}>
              <img
                src="/img/logo-square-light.png"
                alt="TradingView"
                className={styles.tradingViewLogo}
              />
              <p className={styles.tradingViewText}>
                Charts on Silhouette are powered by{" "}
                <Link to="https://www.tradingview.com/">TradingView</Link>, a
                multi-functionality platform that provides in-depth information
                on every aspect of trading, including technical and fundamental
                data, news and analysis, ideas, and community discussions, and
                allows you to follow real-time prices across a wide range of
                trading pairs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
