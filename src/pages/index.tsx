import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <img
          src="img/logo.png"
          alt="MSK Scripts Logo"
          className={styles.heroLogo}
        />
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.heroButtons}>
          <Link className="button button--primary button--lg" to="/docs">
            Browse Docs
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://discord.gg/5hHSBRHvJE"
          >
            Discord
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Resource Cards ───────────────────────────────────────────────────────────

type Resource = {
  title: string;
  image: string;
  description: string;
  badges: string[];
  to: string;
  features: string[];
};

const resources: Resource[] = [
  {
    title: 'Discord Ticketbot',
    image: '/img/discord_ticketbot_banner.png',
    badges: ['Javascript'],
    description:
      'A Dicord ticketbot, allowing players to create support tickets directly from Discord.',
    to: '/docs/discord_ticketbot/getting-started',
    features: ['Installation', 'Configuration'],
  },
  {
    title: 'MSK Core',
    image: '/img/logo.png',
    badges: ['Standalone'],
    description:
      'Our core library for our resources, providing common utilities, and more.',
    to: '/docs/msk_core/',
    features: ['Client', 'Shared', 'Server'],
  },
  {
    title: 'MSK Handcuffs',
    image: '/img/msk_handcuffs.png',
    badges: ['ESX', 'QBCore'],
    description:
      'A handcuff resource, allowing you to restrain players with various options and features.',
    to: '/docs/msk_handcuffs/',
    features: ['Events', 'Exports', 'Event Handler'],
  },
  {
    title: 'MSK Vehiclekeys',
    image: '/img/msk_vehiclekeys.png',
    badges: ['ESX', 'QBCore'],
    description:
      'A vehicle key management resource, allowing you to manage vehicle keys with various options and features.',
    to: '/docs/msk_vehiclekeys/',
    features: ['Exports'],
  },
];

function ResourceCard({ title, image, badges, description, to, features }: Resource) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={image} alt={title} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <Heading as="h2" className={styles.cardTitle}>
            {title}
          </Heading>
          <div className={styles.cardBadges}>
            {badges.map((b) => (
              <span key={b} className={styles.cardBadge}>{b}</span>
            ))}
          </div>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardTags}>
          {features.map((f) => (
            <span key={f} className={styles.cardTag}>
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <Link className="button button--primary button--block" to={to}>
          Get Started →
        </Link>
      </div>
    </div>
  );
}

function Resources() {
  return (
    <section className={styles.resources}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Resources
        </Heading>
        <p className={styles.sectionSubtitle}>
          Select a resource to browse its documentation.
        </p>
        <div className={styles.cardGrid}>
          {resources.map((r) => (
            <ResourceCard key={r.title} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Info Banner ──────────────────────────────────────────────────────────────

function InfoBanner() {
  return (
    <section className={styles.infoBanner}>
      <div className="container">
        <div className={styles.infoBannerInner}>
          <div className={styles.infoBannerText}>
            <Heading as="h3">Need help?</Heading>
            <p>
              Join the MSK Scripts Discord for support, updates and community discussions..
            </p>
          </div>
          <div className={styles.infoBannerActions}>
            <Link
              className="button button--primary button--lg"
              href="https://discord.gg/5hHSBRHvJE"
            >
              Join Discord
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/MSK-Scripts"
            >
              Github
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation for MSK Scripts resources."
    >
      <Hero />
      <main>
        <Resources />
        <InfoBanner />
      </main>
    </Layout>
  );
}
