---
title: Overview
sidebar_position: 1
---

# MSK Shortener

**A self-hosted URL shortener with click statistics, QR codes, and password protection** — the first web project in the MSK ecosystem.

- **Live instance:** [s.msk-scripts.de](https://s.msk-scripts.de)
- **Source code:** [github.com/MSK-Scripts/msk-shortener](https://github.com/MSK-Scripts/msk-shortener)
- **License:** AGPL-3.0-or-later

---

## What is MSK Shortener?

MSK Shortener turns long URLs into short, shareable links — like Bitly or TinyURL, but **without the tracking**. It is built for personal use, team workflows, and small communities that want their own short-link domain.

The hosted instance at [s.msk-scripts.de](https://s.msk-scripts.de) is free to use. If you want your own short domain (e.g. `s.example.com`), you can self-host it on your own server — see [Installation](installation.md).

---

## Features

- **Auto-generated short codes** (default 7 characters) using nanoid
- **Custom short codes** — pick your own (3–20 chars, `[a-zA-Z0-9_-]`)
- **Click statistics** — anonymous timeline, browser/OS/device aggregations, top referrers
- **QR codes** — download as PNG or SVG with MSK branding
- **Password protection** with bcrypt (cost 12) and brute-force throttling
- **Expiration dates** — let links auto-expire at any future ISO timestamp
- **Delete tokens** — remove links without an account
- **REST API** for every UI feature
- **Bilingual UI** (German / English) with cookie-based language switching
- **Global statistics page** with anonymous aggregate data
- **SSRF protection** — private IP ranges (RFC 1918, loopback, link-local) are rejected as targets
- **No tracking cookies, no GeoIP, no third-party analytics**

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
| Passwords | bcryptjs (cost 12) |
| Short codes | nanoid |
| QR codes | `qrcode` |
| Charts | Recharts |
| UA parsing | `ua-parser-js` |
| Web server | Apache2 (reverse proxy) |
| Process manager | systemd |

---

## How click tracking works

Unlike MSK Paste (which only counts views), MSK Shortener stores anonymized **per-click** rows for richer statistics — but no piece of data identifies the visitor:

| Stored | Not stored |
|---|---|
| Timestamp | IP address (plain text) |
| Browser family (e.g. `Firefox`) | Full user agent |
| OS family (e.g. `Linux`) | GeoIP / country |
| Device type (`desktop` / `mobile` / `tablet`) | Cookies |
| Referrer host | Query strings |
| HMAC-SHA-256(IP) | Account / session info |

IPs are hashed with a server-side secret (`IP_HASH_SECRET`) using HMAC-SHA-256 — they cannot be reversed without the secret.

---

## Where to go next

- [Installation](installation.md) — Self-host MSK Shortener on your own Debian/Ubuntu server
- [Usage](usage.md) — Walkthrough of creating, managing, and tracking links
- [REST API](api.md) — Programmatic access for scripts and CLI tools
- [Privacy & Security](privacy.md) — How your data is (and isn't) stored
- [FAQ](faq.md) — Common questions and troubleshooting

---

:::info
Questions or feedback? Join the [Discord](https://discord.gg/5hHSBRHvJE) or open an issue on [GitHub](https://github.com/MSK-Scripts/msk-shortener/issues).
:::
