import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';

// ─── Footer ───────────────────────────────────────────────────────────────────

// Dieser Footer ersetzt den Theme-Footer vollstaendig. `themeConfig.footer` aus
// der docusaurus.config.ts wird hier NICHT gelesen, die Uebersetzungen in
// i18n/<locale>/docusaurus-theme-classic/footer.json haben deshalb keine
// Wirkung. Alles Uebersetzbare laeuft ueber <Translate> bzw. translate() und
// landet damit in i18n/<locale>/code.json.
export default function Footer(): ReactNode {
  // Die Spalten stehen bewusst innerhalb der Komponente: translate() liest die
  // Uebersetzungen der aktiven Locale zur Renderzeit.
  const columns = [
    {
      title: translate({
        id: 'footer.column.ecosystem',
        message: 'Ecosystem',
        description: 'Title of the Ecosystem column in the site footer',
      }),
      links: [
        { label: 'MSK Forms', to: '/ecosystem/msk-forms/' },
        { label: 'MSK Paste', to: '/ecosystem/msk-paste/' },
        { label: 'MSK Shortener', to: '/ecosystem/msk-shortener/' },
        // { label: 'MSKanban', to: '/ecosystem/mskanban/' },
      ],
    },
    {
      title: translate({
        id: 'footer.column.discordBots',
        message: 'Discord Bots',
        description: 'Title of the Discord Bots column in the site footer',
      }),
      links: [
        { label: 'Ticketbot', to: '/discord/discord_ticketbot/getting-started' },
        { label: 'Giveawaybot', to: '/discord/discord_giveaway/getting-started' },
        { label: 'Multibot', to: '/discord/discord_multibot/getting-started' },
      ],
    },
    {
      title: translate({
        id: 'footer.column.fivemResources',
        message: 'FiveM Resources',
        description: 'Title of the FiveM Resources column in the site footer',
      }),
      links: [
        { label: 'MSK Core', to: '/docs/msk_core/' },
        { label: 'MSK Garage', to: '/docs/msk_garage/' },
        { label: 'MSK Handcuffs', to: '/docs/msk_handcuffs/' },
        { label: 'MSK VehicleKeys', to: '/docs/msk_vehiclekeys/' },
        { label: 'MSK EngineToggle', to: '/docs/msk_enginetoggle/' },
        { label: 'MSK Fuel', to: '/docs/msk_fuel/' },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink}>
            <img
              src="/img/logo.png"
              alt={translate({
                id: 'footer.logo.alt',
                message: 'MSK Scripts Logo',
                description: 'Alt text of the logo in the site footer',
              })}
              className={styles.brandLogo}
            />
            <span className={styles.brandName}>MSK Scripts</span>
          </Link>
          <p className={styles.brandTagline}>
            <Translate
              id="footer.tagline"
              description="Tagline below the logo in the site footer">
              Documentation for MSK Scripts resources.
            </Translate>
          </p>
          <div className={styles.brandBadge}>
            <Translate
              id="footer.badge.official"
              description="Badge below the tagline in the site footer">
              Official
            </Translate>
          </div>
        </div>

        {/* Link Columns */}
        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.title} className={styles.column}>
              <p className={styles.columnTitle}>{col.title}</p>
              <ul className={styles.columnList}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link className={styles.columnLink} to={link.to}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>
          {/* Das Jahr kommt als Platzhalter herein, damit die Uebersetzung es
              nicht einfriert. */}
          <Translate
            id="footer.copyright"
            description="Copyright line at the bottom of the site footer"
            values={{ year: String(new Date().getFullYear()) }}>
            {'Copyright © {year} MSK Scripts. All rights reserved.'}
          </Translate>
        </p>
        <div className={styles.legalLinks}>
          <Link className={styles.legalLink} to="/impressum">Impressum</Link>
          <span className={styles.legalDivider}>·</span>
          <Link className={styles.legalLink} to="/datenschutz">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}
