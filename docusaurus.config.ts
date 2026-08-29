import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MSK Scripts - Documentation',
  tagline: 'Documentation & Guides',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docu.msk-scripts.de',
  baseUrl: '/',

  // Apache answers /path with a 301 to /path/, but Docusaurus emitted the
  // canonical link WITHOUT the trailing slash. The canonical therefore pointed
  // at a URL that redirects away from the page carrying it, and Google indexed
  // both spellings: the Search Console lists
  // /discord/discord_ticketbot/getting-started/ with 107 impressions and
  // /discord/discord_ticketbot/getting-started with another 42, so one page's
  // ranking signals sit on two URLs. This makes every generated link, sitemap
  // entry and canonical match what the server actually serves.
  trailingSlash: true,

  organizationName: 'MSK Scripts',
  projectName: 'documentation',

  onBrokenLinks: 'throw',

  // Zweisprachig seit 29.08.2026. Uebersetzt wird bewusst nur der
  // Discord-Bereich: die deutsche Suche will Anleitungen, und dort ist die
  // Konkurrenz am schwaechsten. Alles andere bleibt englisch und faellt unter
  // /de/ auf den englischen Originaltext zurueck.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    localeConfigs: {
      en: { label: 'English' },
      de: { label: 'Deutsch' },
    },
  },

  headTags: [
    // SEO Meta Tags
    //
    // Hier steht bewusst KEINE description. headTags gilt fuer jede Seite, die
    // statische Fassung stand also als englisches Duplikat auf 204 von 210
    // Seiten, auf den deutschen zusaetzlich in der falschen Sprache. Docusaurus
    // leitet die Beschreibung pro Seite aus Frontmatter oder erstem Absatz ab.
    // Seiten, die mit einem Code-Block beginnen, brauchen sie im Frontmatter.
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'MSK Scripts, Musiker15, FiveM, Discord Bots, Documentation, Guides, msk_core, msk_garage, ESX, QBCore, ox_core',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'Musiker15',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow',
      },
    },
    // Open Graph (Facebook, Discord, etc.)
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'MSK Scripts Documentation',
      },
    },
    // og:locale, og:url und rel=canonical stehen hier bewusst NICHT mehr.
    // headTags gilt fuer jede Seite, die statischen Werte zeigten also auf
    // jeder der gut 200 Unterseiten auf die Startseite. Zusammen mit dem
    // korrekten, seiteneigenen Canonical von Docusaurus standen damit zwei
    // widersprechende rel=canonical im head, und die wertet Google gar nicht
    // aus. Docusaurus erzeugt alle drei Tags ohnehin pro Seite und pro Sprache.
    // Theme Color (MSK Grün)
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#00E676',
      },
    },
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guides',
        path: 'guides',
        routeBasePath: 'guides',
        sidebarPath: './sidebars-guides.ts',
        editUrl: 'https://github.com/MSK-Scripts/documentation/tree/main/',
        // Ohne lastUpdatedAt schreibt das Sitemap-Plugin kein <lastmod>.
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'discord',
        path: 'discord',
        routeBasePath: 'discord',
        sidebarPath: './sidebars-discord.ts',
        editUrl: 'https://github.com/MSK-Scripts/documentation/tree/main/',
        // Ohne lastUpdatedAt schreibt das Sitemap-Plugin kein <lastmod>.
        showLastUpdateTime: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ecosystem',
        path: 'ecosystem',
        routeBasePath: 'ecosystem',
        sidebarPath: './sidebars-ecosystem.ts',
        editUrl: 'https://github.com/MSK-Scripts/documentation/tree/main/',
        // Ohne lastUpdatedAt schreibt das Sitemap-Plugin kein <lastmod>.
        showLastUpdateTime: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/MSK-Scripts/documentation/tree/main/',
          // Ohne lastUpdatedAt schreibt das Sitemap-Plugin kein <lastmod>.
          showLastUpdateTime: true,
        },
        blog: false,
        // Die Defaults des Sitemap-Plugins schreiben auf jede der 208 URLs
        // changefreq weekly und priority 0.5. Beides wertet Google nicht aus,
        // und das eine Feld, das ausgewertet wird, fehlte komplett. Also
        // umgekehrt: lastmod an, die beiden Placebo-Felder aus.
        sitemap: {
          lastmod: 'date',
          changefreq: null,
          priority: null,
          // Die Suchseite ist eine Ergebnisseite ohne eigenen Inhalt. Sie hat
          // deshalb auch keine description und gehoert nicht in den Index.
          ignorePatterns: ['**/search', '**/search/'],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Offline-Volltextsuche, die vollständig im Browser läuft und KEIN
  // `unsafe-eval` benötigt (im Gegensatz zu docusaurus-lunr-search).
  // Wichtig für die strikte Content-Security-Policy (siehe apache/).
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'de'],
        indexBlog: false,
        // Alle vier Docs-Instanzen indexieren (Default + guides/discord/ecosystem)
        docsRouteBasePath: ['docs', 'guides', 'discord', 'ecosystem'],
        docsDir: ['docs', 'guides', 'discord', 'ecosystem'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
      },
    ],
  ],

  themeConfig: {
    image: 'img/msk_scripts_banner.png',
    heroImage: 'img/msk_scripts_banner.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'MSK Scripts',
      logo: {
        alt: 'MSK Scripts Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'FiveM Ressources',
        },
        {
          type: 'docSidebar',
          sidebarId: 'discordSidebar',
          docsPluginId: 'discord',
          position: 'left',
          label: 'Discord Bots',
        },
        {
          type: 'docSidebar',
          sidebarId: 'ecosystemSidebar',
          docsPluginId: 'ecosystem',
          position: 'left',
          label: 'Ecosystem',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          docsPluginId: 'guides',
          position: 'left',
          label: 'Guides',
        },
        {
          href: 'https://www.msk-scripts.de',
          label: 'Shop',
          position: 'right',
        },
        {
          href: 'https://github.com/MSK-Scripts',
          label: 'Github',
          position: 'right',
        },
        {
          href: 'https://discord.gg/5hHSBRHvJE',
          label: 'Discord',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Dokumentation',
              to: '/docs',
            },
            {
              label: 'Guides',
              to: '/guides',
            },
            {
              label: 'Ecosystem',
              to: '/ecosystem',
            },
            {
              label: 'Discord Bots',
              to: '/discord',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Shop',
              href: 'https://www.msk-scripts.de',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/MSK-Scripts',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/5hHSBRHvJE',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Impressum',
              to: '/impressum',
            },
            {
              label: 'Datenschutz',
              to: '/datenschutz',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MSK Scripts. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'ini', 'sql', 'apacheconf', 'java', 'json', 'yaml', 'lua'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
