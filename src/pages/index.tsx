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

const featureCards = [
  {
    title: "What is Silhouette",
    description:
      "Learn about the core concepts of Silhouette, and how to get started.",
    link: "/docs/about-silhouette",
    Icon: InfoIcon,
  },
  {
    title: "smart contracts",
    description: "Learn about the architecture of our smart contracts.",
    link: "/docs/architecture/overview",
    Icon: BookIcon,
  },
  {
    title: "Look through our FAQ",
    description: "Read through our most common questions.",
    link: "/docs/faq",
    Icon: QuestionMarkIcon,
  },
];

const tutorials = [
  {
    title: "Quickstart",
    description: "Connect Your EVM Wallet to the Silhouette webapp",
    link: "/docs/about-silhouette",
  },
  {
    title: "Deposit Assets",
    description:
      "Silhouette uses the HYPE or USDC you already have on HyperCore.",
    link: "/docs/about-silhouette",
  },
  {
    title: "Withdrawing Assets",
    description:
      "The webapp will facilitate the withdrawal. Just enter the amount.",
    link: "/docs/about-silhouette",
  },
];

const socialLinks = [
  {
    title: "Telegram",
    description: "Join our discussions on telegram",
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
          </div>
        </section>

        <main className="container">
          {/* Get Started Section */}
          <section className={styles.getStartedSection}>
            <h2 className={styles.sectionTitle}>Get started with Silhouette</h2>
            <p className={styles.sectionSubtitle}>
              Explore these guided tutorials to get started with Silhouette
            </p>
            <div className={styles.tutorialContainer}>
              {tutorials.map((tutorial, idx) => (
                <Link
                  to={tutorial.link}
                  className={styles.tutorialLink}
                  key={idx}
                >
                  <div>
                    <h4 className={styles.tutorialTitle}>{tutorial.title}</h4>
                    <p className={styles.tutorialDescription}>
                      {tutorial.description}
                    </p>
                  </div>
                  <ArrowIcon className={styles.tutorialIcon} />
                </Link>
              ))}
            </div>
          </section>

          {/* Social Links Section */}
          <section className={styles.section}>
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
          </section>
        </main>
      </div>
    </Layout>
  );
}
