import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import { ArrowIcon } from '../icons/arrow.icon';
import { InfoIcon } from '../icons/info.icon';
import { QuestionMarkIcon } from '../icons/questionMark.icon';
import { BookIcon } from '../icons/book.icon';
import { XIcon } from '../icons/x.icon';
import { TelegramIcon } from '../icons/telegram.icon';
import { GithubIcon } from '../icons/github.icon';
import { SilhouetteChromatic } from '../components/silhouetteChromatic/SilhouetteChromatic';

const featureCards = [
    {
        title: 'What is Silhouette?',
        description: 'Learn about the core concepts of Silhouette.',
        link: '/docs/about-silhouette',
        Icon: InfoIcon,
    },
    {
        title: 'Architecture',
        description: 'Learn about the architecture of the Silhouette platform.',
        link: '/docs/architecture/overview',
        Icon: BookIcon,
    },
    {
        title: 'Our FAQ',
        description: 'Read through our most common questions.',
        link: '/docs/faq',
        Icon: QuestionMarkIcon,
    },
];

const socialLinks = [
    {
        title: 'Follow Us',
        description: 'See what we are getting up to on X',
        link: 'https://x.com/silhouette_ex',
        Icon: XIcon,
    },
    {
        title: 'Telegram',
        description: 'Join our discussions on telegram',
        link: 'https://t.me/silhouette_exchange',
        Icon: TelegramIcon,
    },
    {
        title: 'GitHub',
        description: 'View our repositories',
        link: 'https://github.com/silhouette-exchange',
        Icon: GithubIcon,
    },
]

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Official documentation for Silhouette Exchange - Your comprehensive resource for guides, tutorials and references">
      <header className={styles.heroBanner}>
        <SilhouetteChromatic className={styles.heroBackground} />
        <div className={`container ${styles.heroContainer}`}>
          <Heading as="h1" className={styles.heroTitle}>
            Welcome to the Silhouette Docs
          </Heading>
        </div>
      </header>
      <main className="container">
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

        {/* Social Links Section */}
        <section className={styles.section}>
            <div className={styles.socialContainer}>
              {socialLinks.map((item, idx) => (
                  <Link to={item.link} className={styles.socialLink} key={idx}>
                      <item.Icon className={styles.socialIcon} />
                      <div>
                          <strong>{item.title}</strong>
                          <p style={{marginBottom: 0}}>{item.description}</p>
                      </div>
                  </Link>
              ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
