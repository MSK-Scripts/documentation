# MSK Scripts — Documentation

Official documentation site for [MSK Scripts](https://msk-scripts.de) — FiveM resources, Discord bots, and related ecosystem projects by [Musiker15](https://musiker15.de).

Live site: **[docu.msk-scripts.de](https://docu.msk-scripts.de)**

Built with [Docusaurus 3](https://docusaurus.io/) (TypeScript, React 19) and the `@docusaurus/faster` Rspack pipeline.

## Requirements

- Node.js `>=20.0`
- Yarn 1 (Classic)

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

Starts a local dev server with hot-reload at `http://localhost:3000`.

## Build

```bash
yarn build
```

Generates static content into the `build/` directory, ready to be served by any static host.

## Typecheck

```bash
yarn typecheck
```

## Deployment

Deployment to GitHub Pages is handled automatically by the workflow in `.github/workflows/`.

Manual deploy (if needed):

```bash
# Using SSH
USE_SSH=true yarn deploy

# Using HTTPS
GIT_USER=<Your GitHub username> yarn deploy
```

## Project Structure

```
.
├── blog/                  # Blog / changelog posts
├── docs/                  # Main documentation (FiveM scripts)
├── discord/               # Discord bot documentation
├── ecosystem/             # Ecosystem / integrations
├── guides/                # How-to guides
├── src/                   # React components, pages, custom CSS
├── static/                # Static assets (images, fonts, downloads)
└── docusaurus.config.ts   # Site configuration
```

## Security

Found a vulnerability? Please see [SECURITY.md](SECURITY.md) for the disclosure process.

Dependency updates are managed by Dependabot. Pinned overrides for transitive dependencies live in the `resolutions` block of [package.json](package.json).

## Links

- Website: [msk-scripts.de](https://msk-scripts.de)
- Documentation: [docu.msk-scripts.de](https://docu.msk-scripts.de)
- Contact: info@msk-scripts.de
