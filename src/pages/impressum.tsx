import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './legal.module.css';

const STORAGE_KEY = 'msk-docu-legal-lang';

const content = {
  de: {
    title: 'Impressum',
    sections: (
      <>
        <h1>Impressum</h1>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          <strong>Moritz Kohm</strong><br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen
        </p>
        <p><strong>Kontakt:</strong><br />E-Mail: info@msk-scripts.de</p>

        <p>
          <strong>Umsatzsteuer-Identifikationsnummer gem. § 27a UStG:</strong><br />
          DE364543992
        </p>

        <p>
          <strong>Hinweis nach § 19 UStG:</strong><br />
          Gemäß § 19 UStG wird keine Umsatzsteuer erhoben und ausgewiesen (Kleinunternehmerregelung).
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          <strong>Moritz Kohm</strong><br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen
        </p>

        <h2>Haftungsausschluss</h2>

        <h3>Haftung für Inhalte</h3>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
        </p>

        <h2>Widerspruch gegen Werbe-Mails</h2>
        <p>
          Der Nutzung der im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
        </p>

        <h2>Streitbeilegung</h2>
        <h3>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h3>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </>
    ),
  },
  en: {
    title: 'Legal Notice',
    sections: (
      <>
        <h1>Legal Notice</h1>

        <h2>Information according to § 5 DDG</h2>
        <p>
          <strong>Moritz Kohm</strong><br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen<br />
          Germany
        </p>
        <p><strong>Contact:</strong><br />Email: info@msk-scripts.de</p>

        <p>
          <strong>VAT ID number pursuant to § 27a UStG:</strong><br />
          DE364543992
        </p>

        <p>
          <strong>Notice pursuant to § 19 UStG:</strong><br />
          In accordance with § 19 UStG, no VAT is charged or shown (small business regulation).
        </p>

        <h2>Responsible for content according to § 18 Para. 2 MStV</h2>
        <p>
          <strong>Moritz Kohm</strong><br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str. 41<br />
          35410 Hungen<br />
          Germany
        </p>

        <h2>Disclaimer</h2>

        <h3>Liability for content</h3>
        <p>
          The contents of our pages have been created with the greatest care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content.
        </p>

        <h3>Liability for links</h3>
        <p>
          Our offer contains links to external third-party websites over whose content we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the linked pages is always responsible for the content of those pages. The linked pages were checked for possible legal violations at the time of linking. Illegal content was not recognisable at the time of linking. However, permanent content control of the linked pages is unreasonable without concrete evidence of a violation of the law. If we become aware of any legal violations, we will remove such links immediately.
        </p>

        <h3>Copyright</h3>
        <p>
          The content and works on these pages created by the site operators are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this page are only permitted for private, non-commercial use. Insofar as the content on this page was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please notify us accordingly. If we become aware of any infringements, we will remove such content immediately.
        </p>

        <h2>Objection to Promotional Emails</h2>
        <p>
          The use of contact data published as part of the imprint obligation for the purpose of sending unsolicited advertising and information material is hereby objected to. The operators of the pages expressly reserve the right to take legal action in the event of the unsolicited sending of advertising information, e.g. via spam emails.
        </p>

        <h2>Dispute Resolution</h2>
        <h3>Consumer Dispute Resolution / Universal Arbitration Board</h3>
        <p>
          We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.
        </p>
      </>
    ),
  },
};

export default function Impressum() {
  const [lang, setLang] = useState<'de' | 'en'>('en');

  useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored === 'de' || stored === 'en') {
      setLang(stored);
      return;
    }
    const browserLang =
      typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() ?? '' : '';
    setLang(browserLang.startsWith('de') ? 'de' : 'en');
  }, []);

  const handleChange = (value: 'de' | 'en') => {
    setLang(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  };

  const c = content[lang];

  return (
    <Layout title={c.title}>
      <div className={styles.legalPage}>
        <div className={styles.langSwitcher}>
          <span className={styles.langLabel} aria-hidden="true">
            🌐
          </span>
          <select
            value={lang}
            onChange={(e) => handleChange(e.target.value as 'de' | 'en')}
            className={styles.langSelect}
            aria-label="Sprache wählen / Choose language"
          >
            <option value="de">🇩🇪 Deutsch</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
        <div className={styles.legalContent}>{c.sections}</div>
      </div>
    </Layout>
  );
}
