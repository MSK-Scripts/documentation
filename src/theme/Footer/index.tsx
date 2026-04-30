import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

// ─── Data ─────────────────────────────────────────────────────────────────────

const columns = [
  {
    title: 'Discord Bots',
    links: [
      { label: 'Discord Ticketbot', to: '/discord/discord_ticketbot/getting-started' },
    ],
  },
  {
    title: 'FiveM Resources',
    links: [
      { label: 'MSK Core', to: '/docs/msk_core/' },
      { label: 'MSK Handcuffs', to: '/docs/msk_handcuffs/' },
      { label: 'MSK VehicleKeys', to: '/docs/msk_vehiclekeys/' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Tebex', to: 'https://www.msk-scripts.de' },
      { label: 'GitHub', to: 'https://github.com/MSK-Scripts' },
      { label: 'Discord', to: 'https://discord.gg/5hHSBRHvJE' },
    ],
  },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink}>
            <img
              src="/img/logo.png"
              alt="MSK Scripts Logo"
              className={styles.brandLogo}
            />
            <span className={styles.brandName}>MSK Scripts</span>
          </Link>
          <p className={styles.brandTagline}>
            Documentation for MSK Scripts resources.
          </p>
          <div className={styles.brandBadge}>Official</div>
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
          Copyright © {new Date().getFullYear()} MSK Scripts. All rights reserved.
        </p>
        <p className={styles.disclaimer}>
          <Link className={styles.disclaimer} to="/impressum">
            Impressum
          </Link>
            |
          <Link className={styles.disclaimer} to="/datenschutz">
            Datenschutz
          </Link>
        </p>
      </div>
    </footer>
  );
}
