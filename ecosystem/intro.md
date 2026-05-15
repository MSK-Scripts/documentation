---
sidebar_position: 1
slug: /
---

# Welcome to the MSK Ecosystem

The MSK Ecosystem is a growing family of self-hosted, privacy-friendly web tools — built with the same design language, the same code quality standards, and the same respect for your data.

---

## What's inside

- **[MSK Paste](msk-paste/index.md)** — A self-hosted pastebin alternative with syntax highlighting, password protection, and burn-after-read pastes.
- **[MSK Shortener](msk-shortener/index.md)** — A self-hosted URL shortener with anonymous click statistics, QR codes, and link expiration.

More projects are planned — including MSKanban, MSK Banking, and more.

---

## Shared philosophy

Every project in the ecosystem follows the same rules:

- **No accounts, no sessions, no tracking.** Tools are useful without forcing identity.
- **No third-party trackers.** No Google Analytics, no Plausible, no Fathom — nothing.
- **No plain-text IPs.** IP addresses are hashed with a per-installation HMAC secret.
- **No GeoIP.** Location data is never collected.
- **Hard-deletes, not soft-deletes.** When content is removed (manual, expiration, burn-after-read), it's actually gone.
- **Open source under AGPL-3.0.** Every line of code is auditable on [GitHub](https://github.com/MSK-Scripts).

---

## Shared tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Database | MariaDB via `mysql2` |
| Styling | Tailwind CSS + MSK design tokens |
| Validation | Zod 4 |
| i18n | next-intl v4 (German + English, cookie-based) |
| Passwords | bcryptjs (cost 12) |
| Web server | Apache2 (reverse proxy) |
| Process manager | systemd |
| CI/CD | GitHub Actions |

---

:::info
Questions or feedback? Join the [Discord](https://discord.gg/5hHSBRHvJE) or open an issue on [GitHub](https://github.com/MSK-Scripts).
:::
