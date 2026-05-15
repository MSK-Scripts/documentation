---
title: Overview
sidebar_position: 1
---

# MSK Paste

**A self-hosted, privacy-friendly pastebin alternative** — part of the MSK ecosystem alongside [MSK Shortener](https://s.msk-scripts.de).

- **Live instance:** [paste.msk-scripts.de](https://paste.msk-scripts.de)
- **Source code:** [github.com/MSK-Scripts/msk-paste](https://github.com/MSK-Scripts/msk-paste)
- **License:** AGPL-3.0-or-later

---

## What is MSK Paste?

MSK Paste is a drop-in alternative to Pastebin or Hastebin for personal and team use. It is built for sharing code snippets, logs, and configuration files — without analytics, tracking cookies, or user accounts.

The hosted instance at [paste.msk-scripts.de](https://paste.msk-scripts.de) is free to use. If you want full control over your data, you can also self-host it on your own server (see [Installation](installation.md)).

---

## Features

- **Syntax highlighting** for 30+ languages via [Shiki](https://shiki.style/) (VS Code grammars, rendered server-side)
- **Password protection** with bcrypt (cost 12)
- **Expiration dates** from 10 minutes up to 1 year
- **Burn after read** — paste is automatically deleted after the first view
- **Custom paste IDs** (4–32 chars, `[a-zA-Z0-9_-]`)
- **Raw view** (`/raw/:id`) and **download** (`/dl/:id`) with proper file extension
- **Delete tokens** — remove pastes without an account
- **REST API** for CLI tools and automation
- **Bilingual UI** (German / English) with cookie-based language switching
- **Public statistics page** with anonymous aggregate data
- **No tracking, no analytics, no GeoIP**

---

## Supported languages

```
plaintext, bash, shell, powershell,
c, cpp, csharp, go, java, kotlin, rust, swift,
javascript, typescript, jsx, tsx,
python, ruby, php, perl,
html, css, scss, sass,
json, yaml, toml, xml,
sql, graphql, markdown, dockerfile, lua, diff
```

If you need an additional language, please [open an issue](https://github.com/MSK-Scripts/msk-paste/issues).

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Database | MariaDB (via `mysql2`) |
| Styling | Tailwind CSS + MSK design tokens |
| Validation | Zod 4 |
| i18n | next-intl v4 |
| Syntax highlighting | Shiki |
| Passwords | bcryptjs (cost 12) |
| Web server | Apache2 (reverse proxy) |
| Process manager | systemd |

---

## Where to go next

- [Installation](installation.md) — Self-host MSK Paste on your own Debian/Ubuntu server
- [Usage](usage.md) — Walkthrough of creating, viewing, and managing pastes
- [REST API](api.md) — Programmatic access for scripts and CLI tools
- [Privacy & Security](privacy.md) — How your data is (and isn't) stored
- [FAQ](faq.md) — Common questions and troubleshooting

---

:::info
Questions or feedback? Join the [Discord](https://discord.gg/5hHSBRHvJE) or open an issue on [GitHub](https://github.com/MSK-Scripts/msk-paste/issues).
:::
