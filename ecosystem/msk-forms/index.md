---
title: Overview
sidebar_position: 1
---

# MSK Forms

**Application & form management with a real status loop** — part of the MSK ecosystem alongside [MSK Paste](../msk-paste/index.md), [MSK Shortener](../msk-shortener/index.md) and [MSKanban](../mskanban/index.md).

- **Hosted at:** [forms.msk-scripts.de](https://forms.msk-scripts.de)
- **Source code:** [github.com/MSK-Scripts/msk-forms](https://github.com/MSK-Scripts/msk-forms) (public, proprietary license)
- **Pricing:** [forms.msk-scripts.de/pricing](https://forms.msk-scripts.de/pricing) — Free, Pro, Enterprise (per Discord server)

---

## What is MSK Forms?

MSK Forms is a form builder — think Google Forms or Typeform — with two things those tools don't have:

1. **A status loop for applicants.** Every submission gets a private link. The applicant opens it and sees their status update live, on the same page they applied — no login required. No more *"did you even see my application?"*.
2. **A Discord bot any server can invite.** Forms are tied to a Discord server (a *guild*). Post a form to a channel, review submissions, accept or reject with a button, hand out a role automatically, and DM the applicant their result — all from Discord.

It's built for communities that recruit: FiveM/roleplay servers (whitelist & staff applications), gaming clans, Discord communities, and any team that runs an application process and wants applicants to actually know where they stand.

This is a **hosted service** — you don't install anything. You invite the bot, log in with Discord, and build forms in the dashboard.

---

## Why MSK Forms?

| Feature | Google Forms | Typeform | **MSK Forms** |
|---|:-:|:-:|:-:|
| Free, no per-response paywall to start | ✅ | ⚠️ | ✅ |
| **Live status feedback to the applicant** | ❌ | ❌ | ✅ |
| **Native Discord bot** (post, review, role grant, DMs) | ❌ | ❌ | ✅ |
| Review pipeline (custom statuses, Kanban) | ❌ | ⚠️ | ✅ |
| Conditional logic + multi-step | ⚠️ | ✅ | ✅ |
| Quiz / scoring + calculated fields | ✅ | ⚠️ | ✅ |
| A/B testing | ❌ | ⚠️ | ✅ |
| Custom domain + branding | ❌ | ✅ | ✅ |
| Webhooks + Zapier / Make + REST API | ⚠️ | ✅ | ✅ |
| GDPR self-service (withdraw / export / delete) | ❌ | ⚠️ | ✅ |
| 7 UI languages | ✅ | ✅ | ✅ |
| Installable PWA (offline status page) | ❌ | ❌ | ✅ |

---

## Feature highlights

- **No-code form builder** — 25+ field types (text, choices, dates, phone, file/image upload, signature, rating/NPS/slider, matrix, …), multi-step pages, layout blocks
- **Conditional logic** — show/hide/require fields and jump between pages based on answers
- **Quiz & scoring** — points per option, calculated fields with formulas, auto-decisions on score
- **A/B testing** — split-test form copy, track views and conversions
- **Review workflow** — custom statuses, a Kanban board, bulk actions, and exports (CSV / XLSX / JSON / PDF)
- **The status loop** — applicants track their status live on a private link; updates push instantly
- **Discord bot** — `/forms` commands, review embeds with Accept/Reject buttons, automatic role grants, status DMs, and a guild activity log
- **Branding** — accent color, logo, custom CSS, and your own custom domain with automatic TLS
- **Automations & integrations** — when-then rules, outgoing webhooks (HMAC-signed), Zapier / Make, and a REST API
- **Applicant self-service (GDPR)** — withdraw, export, or delete a submission from the status page
- **7 languages** — English, German, Hungarian, French, Spanish, Portuguese (BR), Polish
- **Installable PWA** — add it to your home screen; the status page works offline

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19), TypeScript |
| Database | PostgreSQL 16 via Prisma 7 (driver-adapter) |
| Cache / rate-limit | Redis 7 |
| Storage | MinIO (S3-compatible) for file uploads |
| Bot | discord.js v14 (multi-tenant) |
| Real-time | WebSocket service over Postgres `LISTEN/NOTIFY` |
| Styling | Tailwind CSS + shadcn/ui + MSK design tokens |
| Captcha | Cloudflare Turnstile (optional) |
| Billing | Stripe |
| Web server | Apache2 (reverse proxy) |
| CI/CD | GitHub Actions |

---

## Where to go next

- [Getting Started](getting-started.md) — Invite the bot, build your first form, post it, review the first submission
- [Form Builder](form-builder.md) — Every field type, conditional logic, scheduling, scoring, A/B tests, automations
- [Submissions & Review](submissions-and-review.md) — Status pipeline, custom statuses, Kanban board, bulk actions, exports
- [Discord Bot](discord-bot.md) — Commands, review channel, accept/reject, status DMs, activity log, bot language
- [Branding & Custom Domains](branding-and-domains.md) — Accent, logo, custom CSS, your own domain, per-guild login & captcha
- [Integrations & API](integrations-and-api.md) — Webhooks, Zapier / Make, the REST API and API keys
- [Plans & Limits](plans.md) — Free, Pro and Enterprise — what each tier unlocks
- [Privacy & Security](privacy.md) — What data is stored, applicant self-service, GDPR, security model
- [FAQ](faq.md) — Common questions and troubleshooting

---

:::info
Questions or feedback? Join the [Discord](https://discord.gg/5hHSBRHvJE) or open an issue on [GitHub](https://github.com/MSK-Scripts/msk-forms/issues).
:::
