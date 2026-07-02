---
title: Discord Bot
sidebar_position: 5
---

# Discord Bot

The Discord bot is what sets MSK Forms apart. One shared bot serves every server (it's multi-tenant) — you just invite it. This page covers commands, the review workflow, status DMs, the activity log, and the bot's language.

---

## Inviting & linking

Invite the bot from [forms.msk-scripts.de](https://forms.msk-scripts.de) → **Invite the bot** (you need **Manage Server**). On join, MSK Forms links the guild automatically:

- The guild and its owner are recorded; the **owner becomes the MSK Forms owner**.
- The server appears in the dashboard.

No channels or roles are required up front.

---

## Slash commands

| Command | Who | What it does |
|---|---|---|
| `/forms list` | Anyone | Lists the server's live forms. |
| `/forms post` | Manage Server | Posts a form (embed + link button) to a channel. Autocompletes your live forms. |
| `/forms setup` | Anyone | Returns a link to the dashboard. |
| `/forms language <locale>` | Manage Server | Sets the language the bot speaks in this server (see [Bot language](#bot-language)). |

:::note[Command propagation]
After the bot updates its commands, global Discord command propagation can take up to ~1 hour to appear everywhere.
:::

---

## Review workflow

Configure a **review channel** on the dashboard **Bot** page (Bot config: review channel + accepted role). Then:

1. **New submission → review channel.** When someone submits, the bot posts an embed to your review channel with the key details and an **"Open in dashboard"** link.
2. **Accept / Reject buttons.** The embed carries **Accept** and **Reject** buttons (Manage Server to use). Clicking one:
   - Writes the new status (exactly like a web review).
   - DMs the applicant their result via the status outbox.
   - On **Accept**, grants the configured **accepted role(s)**.
   - Updates the embed to reflect the action.

A form can override the guild's review channel and accepted role(s) — see [Form Builder → Per-form overrides](form-builder.md#per-form-overrides).

### Automatic role grants

The **accepted role** is granted on **every** acceptance path — the Discord button, a web review, a bulk action, or an [automation](form-builder.md#automations) — as long as the applicant logged in with Discord. Roles are only added if missing, so there's never a double-grant.

---

## Status DMs

When a submission's status changes (or a reviewer sends a public message), the bot **DMs the applicant** with the new status and a link to their status page — provided the applicant logged in with Discord (anonymous applicants have no Discord to DM). If your guild has a verified [custom domain](branding-and-domains.md#custom-domains), the status link points there, keeping applicants on your own domain.

A status change that a reviewer marks [hidden](submissions-and-review.md#reviewing-a-submission) sends no DM.

Under the hood this is an **outbox**: the web app records a notification in the same transaction as the status change; the bot polls every 15 seconds and delivers it, retrying transient failures and dropping ones where DMs are impossible (e.g. the user blocks DMs).

DMs use the server's [bot language](#bot-language) when one is set, so the whole bot speaks one language. If the server hasn't set a bot language, DMs fall back to the **applicant's own Discord language**.

---

## Activity log

Point the bot at a **log channel** (Bot config → Log channel) and it posts an embed for **every recorded event** in the guild — a Discord-native audit log. Logged actions include:

- Submission lifecycle — created, status changed, message sent, withdrawn, deleted
- Role granted on acceptance
- Form admin — created, updated, deleted, posted
- Team & config — member added / role changed / removed, bot config updated, branding updated, domain updated

If no log channel is set, nothing is posted.

---

## Bot language

A server can choose the language the **bot speaks for the whole server** — slash-command replies, review embeds (New submission / Accept / Reject), activity-log embeds, and applicant status DMs. Set it with:

- `/forms language <locale>` in Discord, **or**
- the **Bot** page dropdown in the dashboard.

Supported: English, German, Hungarian, French, Spanish, Portuguese (BR), Polish. When set, the bot language also applies to **applicant status DMs**, so applicants hear from you in your community's language. Leave it unset and DMs fall back to each applicant's own Discord language.

---

## Posting appearance

Because the bot is shared, it can't have a per-server profile picture. Instead, set a **post name** on the **Bot** page and the bot posts forms and review embeds through its own webhook under **your chosen name + your guild logo**, while keeping the interactive buttons working. Without the Manage Webhooks permission it falls back to a normal message.

The embed color follows your [branding accent color](branding-and-domains.md#accent-color).

---

:::info
Next: [Branding & Custom Domains](branding-and-domains.md) — make forms look like yours.
:::
