# MSK Scripts Documentation

[![Deploy](https://github.com/MSK-Scripts/documentation/actions/workflows/deploy.yml/badge.svg)](https://github.com/MSK-Scripts/documentation/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/MSK-Scripts/documentation/actions/workflows/codeql.yml/badge.svg)](https://github.com/MSK-Scripts/documentation/actions/workflows/codeql.yml)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.10-3ECC5F?style=flat-square&logo=docusaurus&logoColor=white)](https://docusaurus.io/)

Source of [docu.msk-scripts.de](https://docu.msk-scripts.de), the documentation for MSK Scripts' FiveM resources and Discord bots.

The site covers four areas, each with its own sidebar: the FiveM scripts (`docs/`), the Discord bots (`discord/`), the ecosystem projects and the public API (`ecosystem/`) and how-to guides (`guides/`). It is built with Docusaurus, bilingual with English by default and German under `/de/`, and deployed to MSK Scripts' own server on every push to `main`.

## Quick start

Requirements: Node.js 24 or newer and Yarn 1 (Classic).

```bash
yarn
yarn start                 # dev server at http://localhost:3000, English only
yarn start --locale de     # the German version
```

`yarn build` builds both languages and generates the CSP hashes for the server. Details in [DEVELOPMENT.md](DEVELOPMENT.md).

## Documentation

| Topic | Where |
|---|---|
| Local development, build, typecheck | [DEVELOPMENT.md](DEVELOPMENT.md) |
| Translations (`i18n/de/`) | [DEVELOPMENT.md → Translations](DEVELOPMENT.md#translations) |
| Deployment, Apache and CSP | [DEVELOPMENT.md → Deployment](DEVELOPMENT.md#deployment) |
| Project structure and sidebars | [DEVELOPMENT.md → Project structure](DEVELOPMENT.md#project-structure) |
| Server vhost and redirects | [apache/vhost.example.conf](apache/vhost.example.conf) |

## Help and contributing

- Found a mistake in the docs? Open an [issue](https://github.com/MSK-Scripts/documentation/issues) or a pull request. Every page that changes needs its German counterpart under `i18n/de/` too.
- Support for the scripts and bots: [Discord](https://discord.gg/5hHSBRHvJE) or info@msk-scripts.de
- Security issues, please report privately: [SECURITY.md](SECURITY.md)

## License

Copyright © Moritz Kohm (MSK Scripts). This repository has no open-source license; the documentation is published to be read on [docu.msk-scripts.de](https://docu.msk-scripts.de).
