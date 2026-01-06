import React, { JSX } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Searchbar from "@theme/SearchBar";
import styles from "./index.module.css";
import { ArrowIcon } from "../icons";
import { FEATURE_CARDS } from "../constants/feature-cards";
import { SOCIAL_CARDS } from "../constants/social-cards";
import { TUTORIALS } from "../constants/tutorials";

export default function Home(): JSX.Element {
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
              {FEATURE_CARDS.map((card, idx) => (
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
              {TUTORIALS.map((tutorial, idx) => (
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
              {SOCIAL_CARDS.map((item, idx) => (
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
