import { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './legal.module.css';

const STORAGE_KEY = 'msk-docu-legal-lang';

const content = {
  de: {
    title: 'Datenschutzerklärung',
    sections: (
      <>
        <h1>Datenschutzerklärung</h1>

        <h2>1. Datenschutz auf einen Blick</h2>

        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten
          sind alle Daten, mit denen Sie persönlich identifiziert werden können.
        </p>

        <h3>Datenerfassung auf dieser Website</h3>
        <p>
          Diese Website ist eine rein statisch generierte Dokumentations­seite (Docusaurus). Es
          findet <strong>keine eigene Datenerhebung</strong> durch den Websitebetreiber statt – weder
          über Formulare noch über Tracking-Skripte oder Analyse-Tools. Die einzige
          Datenverarbeitung erfolgt automatisch durch den Hosting-Provider (siehe Abschnitt
          „Hosting&nbsp;&amp;&nbsp;Server-Log-Dateien").
        </p>

        <h3>Welche Rechte haben Sie bezüglich Ihrer Daten?</h3>
        <p>
          Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und
          Zweck Ihrer gespeicherten personenbezogenen Daten sowie ein Recht auf Berichtigung oder
          Löschung dieser Daten. Hierzu sowie zu weiteren Fragen können Sie sich jederzeit an uns
          wenden.
        </p>

        <h2>2. Hosting &amp; Server-Log-Dateien</h2>
        <p>
          Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
        </p>
        <p>
          <strong>netcup GmbH</strong><br />
          Daimlerstraße 25<br />
          D-76185 Karlsruhe
        </p>
        <p>
          Wenn Sie unsere Website besuchen, erfasst netcup als Auftragsverarbeiter in
          Server-Log-Dateien automatisch folgende Informationen, die Ihr Browser übermittelt:
          Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des
          zugreifenden Rechners, Uhrzeit der Server­anfrage sowie die IP-Adresse. Eine Zusammen­führung
          dieser Daten mit anderen Datenquellen erfolgt nicht.
        </p>
        <p>
          <strong>Speicherdauer:</strong> Die Server-Logs werden ausschließlich zu Zwecken der
          technischen Bereitstellung, Stabilität und Sicherheit verarbeitet. Sie werden gelöscht,
          sobald sie zur Erreichung dieser Zwecke nicht mehr erforderlich sind, oder – im Falle
          eines Sicherheits­vorfalls – bis zur abschließenden Klärung des Vorfalls. Eine Zuordnung
          dieser Daten zu Ihrer Person nehmen wir nicht vor.
        </p>
        <p>
          <strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Grundlage des berechtigten
          Interesses an einer technisch fehlerfreien Bereitstellung und Sicherheit unserer Website
          (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO).
        </p>
        <p>
          Weitere Informationen:{' '}
          <a
            href="https://www.netcup.com/de/kontakt/datenschutzerklaerung"
            target="_blank"
            rel="noreferrer"
          >
            Datenschutzerklärung netcup
          </a>.
        </p>

        <h3>Auftragsverarbeitung</h3>
        <p>
          Mit dem oben genannten Anbieter wurde ein Vertrag über Auftrags­verarbeitung gemäß
          Art.&nbsp;28 DSGVO geschlossen.
        </p>

        <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>

        <h3>Datenschutz</h3>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
          behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
          Datenschutz­vorschriften sowie dieser Datenschutz­erklärung.
        </p>

        <h3>Hinweis zur verantwortlichen Stelle</h3>
        <p>
          Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
        </p>
        <p>
          <strong>Moritz Kohm</strong><br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str.&nbsp;41<br />
          35410 Hungen
        </p>
        <p>
          <strong>Kontakt:</strong><br />
          E-Mail: info@msk-scripts.de
        </p>

        <h3>Datenschutz­beauftragter</h3>
        <p>
          Die Bestellung eines Datenschutz­beauftragten ist gesetzlich nicht erforderlich. Bei
          Anfragen zum Datenschutz wenden Sie sich bitte direkt an die verantwortliche Stelle.
        </p>

        <h3>Speicherdauer</h3>
        <p>
          Soweit innerhalb dieser Datenschutz­erklärung keine speziellere Speicher­dauer genannt wurde,
          verbleiben Ihre personen­bezogenen Daten bei uns, bis der Zweck für die Daten­verarbeitung
          entfällt. Sofern Sie ein berechtigtes Löschungs­ersuchen geltend machen oder eine Einwilligung
          zur Daten­verarbeitung widerrufen, werden Ihre Daten gelöscht, sofern keine anderen
          rechtlich zulässigen Gründe für die Speicherung Ihrer personen­bezogenen Daten bestehen.
        </p>

        <h3>Allgemeine Hinweise zu den Rechtsgrundlagen</h3>
        <p>
          Soweit Sie in eine Daten­verarbeitung eingewilligt haben, verarbeiten wir Ihre personen­bezogenen
          Daten auf Grundlage von Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO. Daten, die zur Erfüllung
          eines Vertrages oder zur Durchführung vor­vertraglicher Maßnahmen erforderlich sind, verarbeiten
          wir auf Grundlage von Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO. Daten, die zur Erfüllung einer
          rechtlichen Verpflichtung erforderlich sind, auf Grundlage von Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;c
          DSGVO. Die Verarbeitung kann zudem auf Grundlage unseres berechtigten Interesses gemäß
          Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO erfolgen.
        </p>

        <h3>Widerruf Ihrer Einwilligung zur Daten­verarbeitung</h3>
        <p>
          Viele Daten­verarbeitungs­vorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
          Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der
          bis zum Widerruf erfolgten Daten­verarbeitung bleibt vom Widerruf unberührt.
        </p>

        <h3>
          Widerspruchsrecht gegen die Daten­erhebung in besonderen Fällen (Art.&nbsp;21 DSGVO)
        </h3>
        <p>
          Wenn die Daten­verarbeitung auf Grundlage von Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;e oder lit.&nbsp;f
          DSGVO erfolgt, haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen
          Situation ergeben, gegen die Verarbeitung Ihrer personen­bezogenen Daten Widerspruch
          einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Wir
          verarbeiten Ihre personen­bezogenen Daten dann nicht mehr, es sei denn, wir können zwingende
          schutz­würdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und
          Freiheiten überwiegen, oder die Verarbeitung dient der Geltend­machung, Ausübung oder
          Verteidigung von Rechtsansprüchen.
        </p>

        <h3>Recht auf Einschränkung der Verarbeitung (Art.&nbsp;18 DSGVO)</h3>
        <p>
          Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personen­bezogenen Daten zu
          verlangen. Hierzu können Sie sich jederzeit an uns wenden. Das Recht auf Einschränkung der
          Verarbeitung besteht u.&nbsp;a. dann, wenn Sie die Richtigkeit Ihrer Daten bestreiten, die
          Verarbeitung unrechtmäßig ist Sie aber statt der Löschung eine Einschränkung wünschen,
          wenn wir die Daten nicht mehr benötigen Sie diese aber zur Geltendmachung von Rechts­ansprüchen
          benötigen, oder wenn Sie Widerspruch nach Art.&nbsp;21 DSGVO eingelegt haben.
        </p>

        <h3>Recht auf Daten­übertragbarkeit</h3>
        <p>
          Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung
          eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen,
          maschinen­lesbaren Format aushändigen zu lassen.
        </p>

        <h3>Auskunft, Berichtigung und Löschung</h3>
        <p>
          Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf
          unentgeltliche Auskunft über Ihre gespeicherten personen­bezogenen Daten, deren Herkunft
          und Empfänger und den Zweck der Daten­verarbeitung sowie ein Recht auf Berichtigung oder
          Löschung dieser Daten.
        </p>

        <h3>Keine automatisierte Entscheidungs­findung</h3>
        <p>
          Eine automatisierte Entscheidungs­findung einschließlich Profiling im Sinne von
          Art.&nbsp;22 DSGVO findet auf dieser Website <strong>nicht</strong> statt.
        </p>

        <h3>Beschwerderecht bei der zuständigen Aufsichts­behörde</h3>
        <p>
          Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei
          einer Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat ihres gewöhnlichen
          Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Für den
          Betreiber zuständige Aufsichts­behörde ist:
        </p>
        <p>
          <strong>
            Der Landesbeauftragte für den Datenschutz und die Informations­freiheit Baden-Württemberg
          </strong>
          <br />
          Lautenschlagerstraße&nbsp;20<br />
          70173 Stuttgart<br />
          Telefon: +49&nbsp;711&nbsp;615541-0<br />
          E-Mail: poststelle@lfdi.bwl.de<br />
          Web:{' '}
          <a
            href="https://www.baden-wuerttemberg.datenschutz.de"
            target="_blank"
            rel="noreferrer"
          >
            baden-wuerttemberg.datenschutz.de
          </a>
        </p>

        <h3>SSL- bzw. TLS-Verschlüsselung</h3>
        <p>
          Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine
          verschlüsselte Verbindung erkennen Sie daran, dass die Adress­zeile des Browsers von
          „http://" auf „https://" wechselt und am Schloss-Symbol in Ihrer Browser­zeile.
        </p>

        <h2>4. Daten­erfassung auf dieser Website</h2>

        <h3>Cookies und lokale Speicher</h3>
        <p>
          Diese Website setzt <strong>keine eigenen Cookies</strong> zu Tracking- oder
          Marketing­zwecken. Es werden außerdem keine Cookies von Drittanbietern eingebunden.
        </p>
        <p>
          Lediglich auf den rechtlichen Seiten („Impressum" und „Datenschutz") verwenden wir den
          lokalen Browser-Speicher (<code>localStorage</code>) ausschließlich dazu, Ihre gewählte
          Anzeigesprache (Deutsch oder Englisch) zu merken, damit Sie diese nicht bei jedem Besuch
          neu wählen müssen. Diese Information verbleibt ausschließlich in Ihrem Browser und wird
          nicht an den Server übertragen. Sie können diesen Speicher jederzeit über Ihre
          Browser­einstellungen löschen.
        </p>

        <h2>5. Eingesetzte Technologien</h2>

        <h3>Lokal eingebundene Webfonts (Fontsource)</h3>
        <p>
          Diese Seite verwendet Open-Source-Schriften (DM Sans, JetBrains Mono, Syne), die über das
          Paket{' '}
          <a href="https://fontsource.org" target="_blank" rel="noreferrer">
            Fontsource
          </a>{' '}
          <strong>lokal</strong> in das Build der Website eingebunden sind. Eine Verbindung zu
          Servern Dritter (insbesondere Google Fonts) findet dabei <strong>nicht</strong> statt.
        </p>

        <h3>Such­funktion (lunr-search)</h3>
        <p>
          Die Such­funktion dieser Dokumentation basiert auf{' '}
          <a
            href="https://github.com/lelouch77/docusaurus-lunr-search"
            target="_blank"
            rel="noreferrer"
          >
            docusaurus-lunr-search
          </a>{' '}
          und läuft vollständig <strong>im Browser des Besuchers</strong>. Es findet keine
          Übermittlung von Such­eingaben an unseren Server oder an externe Such-Dienste statt.
        </p>

        <h3>Externe Links</h3>
        <p>
          Diese Website enthält Links zu externen Diensten wie GitHub, Discord oder dem MSK
          Scripts Shop. Beim Klick auf einen solchen Link verlassen Sie unsere Seite und gelangen
          auf die jeweilige externe Seite, für deren Inhalte und Daten­verarbeitung ausschließlich der
          jeweilige Anbieter verantwortlich ist. Eine Übermittlung Ihrer Daten an diese Anbieter
          findet erst beim Klick auf den jeweiligen Link statt.
        </p>
      </>
    ),
  },
  en: {
    title: 'Privacy Policy',
    sections: (
      <>
        <h1>Privacy Policy</h1>

        <h2>1. Privacy at a Glance</h2>

        <h3>General Information</h3>
        <p>
          The following information provides a simple overview of what happens to your personal data
          when you visit this website. Personal data is any data by which you can be personally
          identified.
        </p>

        <h3>Data Collection on this Website</h3>
        <p>
          This site is a purely static documentation site (Docusaurus). The website operator
          does <strong>not</strong> collect any data themselves – there are no forms, no tracking
          scripts, and no analytics tools. The only data processing happens automatically via the
          hosting provider (see section "Hosting&nbsp;&amp;&nbsp;Server Log Files").
        </p>

        <h3>What rights do you have regarding your data?</h3>
        <p>
          You have the right to receive free information about the origin, recipient and purpose of
          your stored personal data at any time, as well as the right to request correction or
          deletion of this data. Please contact us at any time for this and other questions.
        </p>

        <h2>2. Hosting &amp; Server Log Files</h2>
        <p>
          We host the contents of our website with the following provider:
        </p>
        <p>
          <strong>netcup GmbH</strong><br />
          Daimlerstraße 25<br />
          D-76185 Karlsruhe, Germany
        </p>
        <p>
          When you visit our website, netcup automatically collects the following information in
          server log files, which your browser transmits: browser type and version, operating system,
          referrer URL, hostname of the accessing computer, time of the server request and the IP
          address. This data is not merged with other data sources.
        </p>
        <p>
          <strong>Retention period:</strong> Server logs are processed exclusively for the purposes
          of technical operation, stability and security. They are deleted as soon as they are no
          longer required to achieve these purposes – or, in the event of a security incident, until
          the incident has been fully resolved. We do not associate this data with you personally.
        </p>
        <p>
          <strong>Legal basis:</strong> Processing is based on our legitimate interest in a
          technically error-free presentation and the security of our website (Art.&nbsp;6 para.&nbsp;1
          lit.&nbsp;f GDPR).
        </p>
        <p>
          For more information:{' '}
          <a
            href="https://www.netcup.com/de/kontakt/datenschutzerklaerung"
            target="_blank"
            rel="noreferrer"
          >
            netcup Privacy Policy
          </a>.
        </p>

        <h3>Data Processing Agreement</h3>
        <p>
          A data processing agreement in accordance with Art.&nbsp;28 GDPR has been concluded with
          the hosting provider mentioned above.
        </p>

        <h2>3. General Information and Mandatory Disclosures</h2>

        <h3>Data Protection</h3>
        <p>
          The operators of these pages take the protection of your personal data very seriously. We
          treat your personal data confidentially and in accordance with the statutory data
          protection regulations and this privacy policy.
        </p>

        <h3>Information on the Responsible Party</h3>
        <p>The party responsible for data processing on this website is:</p>
        <p>
          <strong>Moritz Kohm</strong><br />
          c/o Impressumservice Dein-Impressum<br />
          Stettiner Str.&nbsp;41<br />
          35410 Hungen<br />
          Germany
        </p>
        <p>
          <strong>Contact:</strong><br />
          Email: info@msk-scripts.de
        </p>

        <h3>Data Protection Officer</h3>
        <p>
          The appointment of a data protection officer is not required by law in this case. For
          privacy-related inquiries, please contact the responsible party directly.
        </p>

        <h3>Storage Duration</h3>
        <p>
          Unless a more specific storage period has been stated within this privacy policy, your
          personal data will remain with us until the purpose for which it was collected no longer
          applies. If you assert a justified deletion request or revoke consent to data processing,
          your data will be deleted, unless other legally permissible reasons for storing your
          personal data exist.
        </p>

        <h3>General Information on Legal Bases</h3>
        <p>
          If you have consented to data processing, we process your personal data on the basis of
          Art.&nbsp;6 para.&nbsp;1 lit.&nbsp;a GDPR. Data required for the performance of a contract
          or for the implementation of pre-contractual measures is processed on the basis of
          Art.&nbsp;6 para.&nbsp;1 lit.&nbsp;b GDPR. Data required to fulfil a legal obligation is
          processed on the basis of Art.&nbsp;6 para.&nbsp;1 lit.&nbsp;c GDPR. Processing may
          additionally be based on our legitimate interest pursuant to Art.&nbsp;6 para.&nbsp;1
          lit.&nbsp;f GDPR.
        </p>

        <h3>Revocation of your Consent to Data Processing</h3>
        <p>
          Many data processing operations are only possible with your explicit consent. You can
          revoke consent you have already given at any time. The lawfulness of data processing
          carried out until revocation remains unaffected by the revocation.
        </p>

        <h3>
          Right to object to data collection in special cases (Art.&nbsp;21 GDPR)
        </h3>
        <p>
          If data processing is carried out on the basis of Art.&nbsp;6 para.&nbsp;1 lit.&nbsp;e or
          lit.&nbsp;f GDPR, you have the right at any time to object, for reasons arising from your
          particular situation, to the processing of your personal data; this also applies to
          profiling based on these provisions. We will no longer process your personal data unless
          we can demonstrate compelling legitimate grounds for the processing which override your
          interests, rights and freedoms, or the processing serves the establishment, exercise or
          defence of legal claims.
        </p>

        <h3>Right to Restriction of Processing (Art.&nbsp;18 GDPR)</h3>
        <p>
          You have the right to request the restriction of the processing of your personal data.
          To do so, you can contact us at any time. The right to restriction of processing exists,
          among other things, when you dispute the accuracy of your data, when processing is
          unlawful but you prefer restriction over deletion, when we no longer need the data but
          you need it for the establishment of legal claims, or when you have lodged an objection
          pursuant to Art.&nbsp;21 GDPR.
        </p>

        <h3>Right to Data Portability</h3>
        <p>
          You have the right to have data that we process automatically on the basis of your consent
          or in fulfilment of a contract handed over to yourself or to a third party in a commonly
          used, machine-readable format.
        </p>

        <h3>Information, Correction and Deletion</h3>
        <p>
          You have the right to free information about your stored personal data, its origin and
          recipient and the purpose of the data processing at any time, as well as the right to
          correction or deletion of this data.
        </p>

        <h3>No automated decision-making</h3>
        <p>
          Automated decision-making, including profiling within the meaning of Art.&nbsp;22 GDPR,
          does <strong>not</strong> take place on this website.
        </p>

        <h3>Right to Lodge a Complaint with the Supervisory Authority</h3>
        <p>
          In the event of violations of the GDPR, data subjects have the right to lodge a complaint
          with a supervisory authority, in particular in the member state of their habitual
          residence, place of work or place of the alleged violation. The supervisory authority
          responsible for the operator is:
        </p>
        <p>
          <strong>
            State Commissioner for Data Protection and Freedom of Information Baden-Württemberg
          </strong>
          <br />
          Lautenschlagerstraße&nbsp;20<br />
          70173 Stuttgart, Germany<br />
          Phone: +49&nbsp;711&nbsp;615541-0<br />
          Email: poststelle@lfdi.bwl.de<br />
          Web:{' '}
          <a
            href="https://www.baden-wuerttemberg.datenschutz.de"
            target="_blank"
            rel="noreferrer"
          >
            baden-wuerttemberg.datenschutz.de
          </a>
        </p>

        <h3>SSL / TLS Encryption</h3>
        <p>
          This site uses SSL / TLS encryption for security reasons. You can recognise an encrypted
          connection by the fact that the address line of the browser changes from "http://" to
          "https://" and by the lock symbol in your browser bar.
        </p>

        <h2>4. Data Collection on this Website</h2>

        <h3>Cookies and Local Storage</h3>
        <p>
          This website does <strong>not</strong> set any cookies of its own for tracking or
          marketing purposes. No third-party cookies are embedded either.
        </p>
        <p>
          Only on the legal pages ("Legal Notice" and "Privacy Policy") we use the browser's local
          storage (<code>localStorage</code>) exclusively to remember your chosen display language
          (German or English), so you don't have to reselect it on every visit. This information
          stays entirely in your browser and is not transmitted to the server. You can delete this
          storage at any time via your browser settings.
        </p>

        <h2>5. Technologies Used</h2>

        <h3>Locally hosted Webfonts (Fontsource)</h3>
        <p>
          This site uses open source fonts (DM Sans, JetBrains Mono, Syne) bundled <strong>locally</strong>{' '}
          into the website's build via the{' '}
          <a href="https://fontsource.org" target="_blank" rel="noreferrer">
            Fontsource
          </a>{' '}
          packages. <strong>No connection</strong> to third-party servers (in particular Google Fonts)
          takes place.
        </p>

        <h3>Search Function (lunr-search)</h3>
        <p>
          The search function of this documentation is based on{' '}
          <a
            href="https://github.com/lelouch77/docusaurus-lunr-search"
            target="_blank"
            rel="noreferrer"
          >
            docusaurus-lunr-search
          </a>{' '}
          and runs <strong>entirely in the visitor's browser</strong>. Search queries are not
          transmitted to our server or to any external search service.
        </p>

        <h3>External Links</h3>
        <p>
          This website contains links to external services such as GitHub, Discord, or the MSK
          Scripts shop. When you click on such a link, you leave our site and are taken to the
          respective external page. The respective provider is solely responsible for the content
          and data processing on those pages. Data is only transmitted to those providers once you
          click on the respective link.
        </p>
      </>
    ),
  },
};

export default function Datenschutz() {
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
