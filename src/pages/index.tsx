import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header
      className={styles.hero}
      style={{
        backgroundImage: `url("${siteConfig.themeConfig.heroImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '34vh',
      }}
    />
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

// Die Ressourcenliste wird in einer Funktion gebaut, nicht als Modulkonstante:
// translate() liest die Uebersetzungen der aktiven Locale zur Renderzeit.
// Titel und Badges bleiben unuebersetzt, das sind Produkt- und Techniknamen.
function getResources(): Resource[] {
  return [
    {
      title: 'Discord Ticketbot',
      image: '/img/msk-ticket-bot-banner.png',
      badges: ['Javascript'],
      description: translate({
        id: 'home.resource.ticketbot.description',
        message:
          'A Dicord ticketbot, allowing players to create support tickets directly from Discord.',
        description: 'Description of the Discord Ticketbot card on the homepage',
      }),
      to: '/discord/discord_ticketbot/getting-started',
      features: ['Installation', 'Configuration'],
    },
    {
      title: 'Discord Giveawaybot',
      image: '/img/msk-giveaway-bot-banner.png',
      badges: ['Javascript'],
      description: translate({
        id: 'home.resource.giveawaybot.description',
        message:
          'A Dicord giveawaybot, allowing you to create giveaway events directly from Discord.',
        description: 'Description of the Discord Giveawaybot card on the homepage',
      }),
      to: '/discord/discord_giveaway/getting-started',
      features: ['Installation', 'Configuration'],
    },
    {
      title: 'MSK Core',
      image: '/img/msk_core-banner.png',
      badges: ['Lua', 'ESX', 'QBCore'],
      description: translate({
        id: 'home.resource.core.description',
        message: 'Our core library for our resources, providing common utilities, and more.',
        description: 'Description of the MSK Core card on the homepage',
      }),
      to: '/docs/msk_core/',
      features: ['Client', 'Shared', 'Server'],
    },
    {
      title: 'MSK Handcuffs',
      image: '/img/msk_handcuffs-banner.png',
      badges: ['Lua', 'ESX', 'QBCore'],
      description: translate({
        id: 'home.resource.handcuffs.description',
        message:
          'A handcuff resource, allowing you to restrain players with various options and features.',
        description: 'Description of the MSK Handcuffs card on the homepage',
      }),
      to: '/docs/msk_handcuffs/',
      features: ['Events', 'Exports', 'Event Handler'],
    },
    {
      title: 'MSK Vehiclekeys',
      image: '/img/msk_vehiclekeys-banner.png',
      badges: ['Lua', 'ESX', 'QBCore'],
      description: translate({
        id: 'home.resource.vehiclekeys.description',
        message:
          'A vehicle key management resource, allowing you to manage vehicle keys with various options and features.',
        description: 'Description of the MSK Vehiclekeys card on the homepage',
      }),
      to: '/docs/msk_vehiclekeys/',
      features: ['Exports'],
    },
    {
      title: 'MSK Garage',
      image: '/img/msk_garage-banner.png',
      badges: ['Lua', 'ESX', 'QBCore'],
      description: translate({
        id: 'home.resource.garage.description',
        message:
          'A fully-featured garage management system, allowing you to manage vehicle storage and more.',
        description: 'Description of the MSK Garage card on the homepage',
      }),
      to: '/docs/msk_garage/',
      features: ['Exports', 'Event Handler'],
    },
    {
      title: 'MSK EngineToggle',
      image: '/img/msk_enginetoggle-banner.png',
      badges: ['Lua', 'ESX', 'QBCore'],
      description: translate({
        id: 'home.resource.enginetoggle.description',
        message:
          'A resource for toggling vehicle engines, providing a simple and efficient way to manage engine states.',
        description: 'Description of the MSK EngineToggle card on the homepage',
      }),
      to: '/docs/msk_enginetoggle/',
      features: ['Exports', 'Event Handler'],
    },
    {
      title: 'MSK Fuel',
      image: '/img/msk_fuel-banner.png',
      badges: ['Lua', 'ESX', 'QBCore'],
      description: translate({
        id: 'home.resource.fuel.description',
        message:
          'A fuel management resource, allowing you to manage vehicle fuel levels with various options and features.',
        description: 'Description of the MSK Fuel card on the homepage',
      }),
      to: '/docs/msk_fuel/',
      features: ['Exports', 'Event Handler'],
    },
  ];
}

// Beschriftung der kleinen Tags auf einer Karte. Entwicklerbegriffe wie Exports
// oder Event Handler bleiben in jeder Sprache englisch, sie sind trotzdem als
// Schluessel hinterlegt, damit sich das je Sprache nachjustieren laesst.
function featureLabel(feature: string): string {
  const labels: Record<string, string> = {
    Installation: translate({
      id: 'home.feature.installation',
      message: 'Installation',
      description: 'Tag on a homepage resource card',
    }),
    Configuration: translate({
      id: 'home.feature.configuration',
      message: 'Configuration',
      description: 'Tag on a homepage resource card',
    }),
    Client: translate({
      id: 'home.feature.client',
      message: 'Client',
      description: 'Tag on a homepage resource card',
    }),
    Shared: translate({
      id: 'home.feature.shared',
      message: 'Shared',
      description: 'Tag on a homepage resource card',
    }),
    Server: translate({
      id: 'home.feature.server',
      message: 'Server',
      description: 'Tag on a homepage resource card',
    }),
    Events: translate({
      id: 'home.feature.events',
      message: 'Events',
      description: 'Tag on a homepage resource card',
    }),
    Exports: translate({
      id: 'home.feature.exports',
      message: 'Exports',
      description: 'Tag on a homepage resource card',
    }),
    'Event Handler': translate({
      id: 'home.feature.eventHandler',
      message: 'Event Handler',
      description: 'Tag on a homepage resource card',
    }),
  };
  return labels[feature] ?? feature;
}

// Lokaler, CSP-konformer Fallback (img-src 'self'), falls ein Card-Banner fehlt.
// `onerror = null` verhindert eine Endlosschleife, wenn auch der Fallback scheitert.
const FALLBACK_IMAGE = '/img/logo.png';
function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.onerror = null;
  img.src = FALLBACK_IMAGE;
  img.style.objectFit = 'contain';
  img.style.padding = '1.5rem';
  img.style.filter = 'opacity(0.25)';
}

function ResourceCard({ title, image, badges, description, to, features }: Resource) {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={image} alt={title} onError={handleImageError} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <Heading as="h2" className={styles.cardTitle}>
            {title}
          </Heading>
          <div className={styles.cardBadges}>
            {badges.map((b) => (
              <span key={b} className={styles.cardBadge} data-badge={b}>{b}</span>
            ))}
          </div>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <div className={styles.cardTags}>
          {features.map((f) => (
            <span key={f} className={styles.cardTag}>
              {featureLabel(f)}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <Link className="button button--primary button--block" to={to}>
          <Translate
            id="home.card.cta"
            description="Label of the button at the bottom of a homepage resource card">
            Get Started →
          </Translate>
        </Link>
      </div>
    </div>
  );
}

function Resources() {
  return (
    <section className={styles.resources}>
      <div className={styles.wrap}>
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate
            id="home.resources.title"
            description="Headline above the resource cards on the homepage">
            Resources
          </Translate>
        </Heading>
        <p className={styles.sectionSubtitle}>
          <Translate
            id="home.resources.subtitle"
            description="Line below the headline above the resource cards on the homepage">
            Select a resource to browse its documentation.
          </Translate>
        </p>
        <div className={styles.cardGrid}>
          {getResources().map((r) => (
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
      <div className={styles.wrap}>
        <div className={styles.infoBannerInner}>
          <div className={styles.infoBannerText}>
            <Heading as="h3">
              <Translate
                id="home.help.title"
                description="Headline of the help banner at the bottom of the homepage">
                Need help?
              </Translate>
            </Heading>
            <p>
              <Translate
                id="home.help.text"
                description="Text of the help banner at the bottom of the homepage">
                Join the MSK Scripts Discord for support, updates and community discussions..
              </Translate>
            </p>
          </div>
          <div className={styles.infoBannerActions}>
            <Link
              className="button button--lg"
              href="https://discord.gg/5hHSBRHvJE"
              style={{ backgroundColor: '#5865F2', borderColor: '#5865F2', color: '#fff' }}
            >
              <Translate
                id="home.help.discordButton"
                description="Label of the Discord button in the homepage help banner">
                Join Discord
              </Translate>
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
      description={translate({
        id: 'home.meta.description',
        message: 'Documentation for MSK Scripts resources.',
        description: 'Meta description of the homepage',
      })}
    >
      <Hero />
      <main>
        <Resources />
        <InfoBanner />
      </main>
    </Layout>
  );
}
