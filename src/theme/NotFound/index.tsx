import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
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
              <Translate
                id="notFound.title"
                description="Headline of the 404 page">
                Page not found
              </Translate>
            </Heading>

            <p className={styles.sub}>
              <Translate
                id="notFound.subtitle"
                description="Explanation below the headline of the 404 page">
                The requested page does not exist or has been moved.
              </Translate>
            </p>

            <div className={styles.actions}>
              <Link className={styles.btnPrimary} to="/">
                <Translate
                  id="notFound.backHome"
                  description="Label of the button leading back to the homepage on the 404 page">
                  ← Back to Home
                </Translate>
              </Link>
              <Link className={styles.btnGhost} to="/docs">
                <Translate
                  id="notFound.browseDocs"
                  description="Label of the button leading to the docs on the 404 page">
                  Browse Docs
                </Translate>
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
