# MSK Scripts Documentation

Official documentation site for [MSK Scripts](https://msk-scripts.de): FiveM resources, Discord bots, and related ecosystem projects by [Musiker15](https://musiker15.de).

Live site: **[docu.msk-scripts.de](https://docu.msk-scripts.de)**

Built with [Docusaurus 3.10](https://docusaurus.io/) (TypeScript, React 19) and the `@docusaurus/faster` Rspack pipeline. The site is bilingual, English by default with a German version under `/de/`.

## Requirements

- Node.js `>=24.0`
- Yarn 1 (Classic), the lockfile is `yarn.lock`

## Installation

```bash
yarn
```

## Local development

```bash
yarn start
```

Starts a dev server with hot reload at `http://localhost:3000`. It serves the **default locale only**. To work on the German version:

```bash
yarn start --locale de
```

To preview a finished build instead, run `yarn build` and then `yarn serve`.

## Build

```bash
yarn build
```

This is not plain Docusaurus. The script runs `docusaurus build && node scripts/generate-csp.mjs`, so it does two things:

1. Builds **both locales**, English into `build/` and German into `build/de/`.
2. Generates `build/csp-hashes.conf` from the built HTML. That file carries the hashes for the site's Content Security Policy and is installed into the Apache configuration during deployment.

Anyone changing the build pipeline has to carry the CSP step along, otherwise the security headers stop matching what is served.

## Typecheck

```bash
yarn typecheck
```

## Translations

German translations live under `i18n/de/`:

| What | Where |
|---|---|
| Markdown | `i18n/de/docusaurus-plugin-content-docs-<id>/current/<same path as the original>` |
| UI strings from `src/` and the theme | `i18n/de/code.json` |
| Navbar and sidebar labels | `i18n/de/docusaurus-theme-classic/navbar.json` and the `current.json` of each docs plugin |

`discord/`, `ecosystem/` and `guides/` are fully translated. `docs/` with the FiveM scripts is English only and falls back to the original text under `/de/`, which is deliberate: a missing file in the i18n tree is served from the source, there is no 404.

After adding or changing text:

```bash
yarn write-translations --locale de
```

Then translate the new keys in `code.json`. Note that React pages under `src/` never move into the i18n tree, their strings have to go through `<Translate>`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and copies it **over SFTP to the project's own Apache server**, not to GitHub Pages. A post-deploy step sets file ownership, installs the generated CSP snippet into `/etc/apache2/snippets/`, tests the Apache configuration and reloads it.

The vhost that serves the site is documented in [apache/vhost.example.conf](apache/vhost.example.conf), including the permanent redirects for pages that have moved. Changes there are applied on the server by hand, the deploy does not touch the vhost.

The `yarn deploy` script from the Docusaurus template still exists in `package.json` but is **not** the deployment path used here.

Four more workflows run alongside it: CodeQL, Dependency Review, secret scanning with TruffleHog, and an automatic release job.

## Project structure

```
.
├── docs/                  # FiveM scripts, the main documentation
├── discord/               # Discord bot documentation
├── ecosystem/             # Ecosystem projects and the public API
├── guides/                # How-to guides
├── blog/                  # Currently disabled, see `blog: false` in the config
├── i18n/de/               # German translations
├── src/                   # React pages, swizzled theme components, custom CSS
├── static/                # Static assets (images, fonts, downloads)
├── scripts/               # generate-csp.mjs, runs after every build
├── apache/                # vhost reference for the server
└── docusaurus.config.ts   # Site configuration
```

Each of the four documentation areas has its own sidebar file (`sidebars.ts`, `sidebars-guides.ts`, `sidebars-discord.ts`, `sidebars-ecosystem.ts`). A new page needs both a file in the folder and an entry in the matching sidebar, otherwise it is not reachable.

## Security

Found a vulnerability? Please see [SECURITY.md](SECURITY.md) for the disclosure process.

Dependency updates are managed by Dependabot. Pinned overrides for transitive dependencies live in the `resolutions` block of [package.json](package.json).

## Links

- Website: [msk-scripts.de](https://msk-scripts.de)
- Documentation: [docu.msk-scripts.de](https://docu.msk-scripts.de)
- Contact: info@msk-scripts.de
