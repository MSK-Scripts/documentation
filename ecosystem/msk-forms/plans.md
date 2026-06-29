---
title: Plans & Limits
sidebar_position: 8
---

# Plans & Limits

MSK Forms has three tiers — **Free**, **Pro**, and **Enterprise**. The authoritative, up-to-date pricing is always on the [pricing page](https://forms.msk-scripts.de/pricing).

:::info[Subscriptions are per Discord server]
A subscription applies to **one guild**. Each server you run is upgraded independently — upgrading one doesn't upgrade the others.
:::

---

## At a glance

| | **Free** | **Pro** | **Enterprise** |
|---|:-:|:-:|:-:|
| Price (per month) | 0 € | 4.99 € | 9.99 € |
| Forms per server | 3 | Unlimited | Unlimited |
| Submissions / month | 100 | 5,000 | Unlimited |
| Team members | 2 | 15 | Unlimited |
| All field types, logic, multi-step | ✅ | ✅ | ✅ |
| Quiz / scoring + calculated fields | ✅ | ✅ | ✅ |
| Review pipeline, custom statuses, Kanban | ✅ | ✅ | ✅ |
| Discord bot, status DMs, activity log | ✅ | ✅ | ✅ |
| Accent color + logo branding | ✅ | ✅ | ✅ |
| Form categories + public hub | ✅ | ✅ | ✅ |
| 7 languages, installable PWA | ✅ | ✅ | ✅ |
| Exports | CSV | + XLSX / JSON / PDF | + XLSX / JSON / PDF |
| Import / export forms (JSON) | — | ✅ | ✅ |
| "Powered by MSK Forms" badge | shown | hidden | hidden |
| Custom CSS | — | ✅ | ✅ |
| Custom domain | — | ✅ | ✅ |
| Per-guild Discord login + captcha | — | ✅ | ✅ |
| Outgoing webhooks | — | ✅ | ✅ |
| Automations (when-then) | — | ✅ | ✅ |
| A/B testing | — | ✅ | ✅ |
| REST API + API keys | — | — | ✅ |
| Zapier / Make integration | — | — | ✅ |

> Prices shown for reference — see the [pricing page](https://forms.msk-scripts.de/pricing) for the current values.

---

## How limits are enforced

- **Forms** — the Free plan blocks creating a 4th form. Pro and Enterprise are unlimited.
- **Submissions** — counted per calendar month, per server. Over the limit, the public form returns a "limit reached" response until the next month.
- **Members** — counts managers, global reviewers, and anyone with a per-form grant. You're only blocked when **adding** beyond the limit; nobody is removed on a downgrade.
- **Pro-only features** for a Free guild are either **gated** (you see an upgrade prompt) or **stripped** on save (e.g. custom CSS, automations) — accent color and logo always stay free.

---

## Upgrading

Upgrade from the gated tabs (Domain, Webhooks, or when you hit the form limit) or the Forms page header. Billing runs through **Stripe**:

- **Free → Pro** or **Free → Enterprise** — Stripe Checkout.
- **Pro → Enterprise** — an upgrade button on the Forms page.
- **Manage billing** — paying guilds get a **Manage subscription** button (Stripe billing portal) to update payment details or cancel.

A downgrade revokes the tier's features (e.g. Enterprise API access) but never deletes your data.

---

:::info
Next: [Privacy & Security](privacy.md) — what data is stored and how it's protected.
:::
