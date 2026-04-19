import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MSK Scripts Documentation',
  tagline: 'Dokumentation & Guides',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docu.msk-scripts.de',
  baseUrl: '/',

  organizationName: 'MSK Scripts',
  projectName: 'msk-scripts-documentation',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guides',
        path: 'guides',
        routeBasePath: 'guides',
        sidebarPath: './sidebars-guides.ts',
        editUrl: 'https://github.com/MSK-Scripts/msk-scripts-documentation/tree/main/',
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
            'https://github.com/MSK-Scripts/msk-scripts-documentation/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/msk-scripts-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'MSK Scripts Documentation',
      logo: {
        alt: 'MSK Scripts Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Dokumentation',
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
          label: 'Tebex',
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
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Tebex',
              href: 'https://www.msk-scripts.de',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/5hHSBRHvJE',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MSK Scripts`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'ini', 'sql', 'apacheconf', 'java', 'json', 'yaml', 'lua'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
