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
      "LEARN ABOUT THE CORE CONCEPTS OF SILHOUETTE, AND HOW TO GET STARTED.",
    link: "/docs/about-silhouette",
    Icon: InfoIcon,
  },
  {
    title: "smart contracts",
    description: "LEARN ABOUT THE ARCHITECTURE OF OUR SMART CONTRACTS.",
    link: "/docs/architecture/overview",
    Icon: BookIcon,
  },
  {
    title: "OUR FAQ",
    description: "READ THROUGH OUR MOST COMMON QUESTIONS.",
    link: "/docs/faq",
    Icon: QuestionMarkIcon,
  },
];

const tutorials = [
  {
    title: "Quickstart",
    description: "CONNECT YOUR EVM WALLET TO THE SILHOUETTE WEBAPP",
    link: "/docs/about-silhouette",
  },
  {
    title: "Deposit Assets",
    description:
      "SILHOUETTE USES THE HYPE OR USDC YOU ALREADY HAVE ON HYPERCORE.",
    link: "/docs/account-management/overview",
  },
  {
    title: "Withdrawing Assets",
    description:
      "THE WEBAPP WILL FACILITATE THE WITHDRAWAL. JUST ENTER THE AMOUNT.",
    link: "/docs/about-silhouette",
  },
];

const socialLinks = [
  {
    title: "Telegram",
    description: "JOIN OUR DISCUSSIONS ON TELEGRAM",
    link: "https://t.me/silhouette_exchange",
    Icon: TelegramIcon,
  },
  {
    title: "GitHub",
    description: "VIEW OUR REPOSITORIES",
    link: "https://github.com/silhouette-exchange",
    Icon: GithubIcon,
  },
  {
    title: "Follow Us",
    description: "SEE WHAT WE ARE GETTING UP TO ON X",
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
