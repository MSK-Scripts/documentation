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

  organizationName: 'MSK Scripts',
  projectName: 'documentation',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    // SEO Meta Tags
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content:
          'Official Documentation for MSK Scripts — FiveM Ressources, Discord Bots, Ecosystem and Guides.',
      },
    },
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
    {
      tagName: 'meta',
      attributes: {
        property: 'og:locale',
        content: 'en_US',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:url',
        content: 'https://docu.msk-scripts.de/',
      },
    },
    // Theme Color (MSK Grün)
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#00E676',
      },
    },
    // Canonical URL
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://docu.msk-scripts.de/',
      },
    },
  ],

  plugins: [
    ['docusaurus-lunr-search', {}],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guides',
        path: 'guides',
        routeBasePath: 'guides',
        sidebarPath: './sidebars-guides.ts',
        editUrl: 'https://github.com/MSK-Scripts/documentation/tree/main/',
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
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/msk_scripts_banner.png',
    heroImage: 'img/msk_documentation_banner.png',
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
