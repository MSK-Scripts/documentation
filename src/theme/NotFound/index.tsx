import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {PageMetadata} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from '@site/src/pages/404.module.css';

export default function NotFound(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <>
      <PageMetadata title={`404 – ${siteConfig.title}`} />
      <Layout>
        <main className={styles.root}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.topline} aria-hidden="true" />

          <div className={styles.inner}>
            <p className={styles.code}>404</p>

            <Heading as="h1" className={styles.title}>
              Page not found
            </Heading>

            <p className={styles.sub}>
              The requested page does not exist or has been moved.
            </p>

            <div className={styles.actions}>
              <Link className={styles.btnPrimary} to="/">
                ← Back to Home
              </Link>
              <Link className={styles.btnGhost} to="/docs">
                Browse Docs
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
