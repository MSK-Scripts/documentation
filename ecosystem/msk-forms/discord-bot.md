---
title: Discord Bot
sidebar_position: 5
---

# Discord Bot

The Discord bot is what sets MSK Forms apart. One shared bot serves every server (it's multi-tenant), you just invite it. This page covers commands, the review workflow, status DMs, the activity log, and the bot's language.

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

A form can override the guild's review channel and accepted role(s), see [Form Builder → Per-form overrides](form-builder.md#per-form-overrides).

### Automatic role grants

The **accepted role** is granted on **every** acceptance path: the Discord button, a web review, a bulk action, or an [automation](form-builder.md#automations), as long as the applicant logged in with Discord. Roles are only added if missing, so there's never a double-grant.

---

## Status DMs

When a submission's status changes (or a reviewer sends a public message), the bot **DMs the applicant** with the new status and a link to their status page, provided the applicant logged in with Discord (anonymous applicants have no Discord to DM). If your guild has a verified [custom domain](branding-and-domains.md#custom-domains), the status link points there, keeping applicants on your own domain.

A status change that a reviewer marks [hidden](submissions-and-review.md#reviewing-a-submission) sends no DM.

Under the hood this is an **outbox**: the web app records a notification in the same transaction as the status change; the bot polls every 15 seconds and delivers it, retrying transient failures and dropping ones where DMs are impossible (e.g. the user blocks DMs).

DMs use the server's [bot language](#bot-language) when one is set, so the whole bot speaks one language. If the server hasn't set a bot language, DMs fall back to the **applicant's own Discord language**.

---

## Activity log

Every change in your server's MSK Forms setup is recorded: who did it, what changed and when. Each entry names the person with their Discord mention next to the name, so it stays attributable even after they rename themselves. Entries about a submission link straight to it in the dashboard.

There are two ways to receive the log in Discord. You can use both at the same time.

### Audit log webhooks (recommended)

Open the **Audit log** tab in the dashboard. This works on every plan.

1. In Discord, open the settings of the channel that should receive the log, go to **Integrations → Webhooks → New Webhook** and copy the webhook URL.
2. Paste the URL into **Add Discord webhook**, optionally give it a name (for example "Mod log").
3. Choose **what should be logged**. Everything is selected by default, grouped into Submissions, Forms, Team, Settings and Security & integrations. You can also limit the webhook to a single form.
4. Click **Add webhook**. MSK Forms checks the URL with Discord before saving it.

You can add up to 10 webhooks, each with its own selection, for example one channel for the moderators with only submission events and one for the admins with team and settings changes. **Send test** posts a test entry right away, and each webhook shows whether its last delivery went through.

A few details worth knowing:

- The bot does not need to be in the server the webhook points to, so you can log into a private staff server.
- Treat the webhook URL like a password, anyone who has it can post into the channel. The dashboard only ever shows it masked.
- Pausing, changing or removing a webhook is logged too, before the change takes effect. When a webhook is removed it receives one last message saying who removed it, so the log cannot be switched off unnoticed.
- If the webhook is deleted in Discord, MSK Forms pauses it and shows why.
- A burst of changes (for example a bulk status change) is delivered at Discord's pace and in order, nothing gets dropped.

### Log channel

Alternatively point the bot at a **log channel** (Bot config → Log channel). The bot then posts **every** entry there, without a selection. This needs the bot to be able to post in that channel.

### What gets logged

- **Submissions:** new submission, status changed, message sent to the applicant, internal note added (not its content), role granted on acceptance, archived, restored, withdrawn or deleted by the applicant, exported (format and number of rows)
- **Forms:** created, edited, archived, restored, permanently deleted, posted in Discord, categories changed
- **Team:** member added, role changed, form access changed, member removed
- **Settings:** bot settings, branding, statuses, status messages, custom domain, public hub link, Discord login settings, captcha settings
- **Security & integrations:** webhooks added, changed or removed, API keys created or revoked, who may delete forms permanently, plan changes, data processing agreement accepted

The entries use the bot's language for your server (see below).

---

## Bot language

A server can choose the language the **bot speaks for the whole server**: slash-command replies, review embeds (New submission / Accept / Reject), activity-log embeds, and applicant status DMs. Set it with:

- `/forms language <locale>` in Discord, **or**
- the **Bot** page dropdown in the dashboard.

Supported: English, German, Hungarian, French, Spanish, Portuguese (BR), Polish. When set, the bot language also applies to **applicant status DMs**, so applicants hear from you in your community's language. Leave it unset and DMs fall back to each applicant's own Discord language.

---

## Posting appearance

Because the bot is shared, it can't have a per-server profile picture. Instead, set a **post name** on the **Bot** page and the bot posts forms and review embeds through its own webhook under **your chosen name + your guild logo**, while keeping the interactive buttons working. Without the Manage Webhooks permission it falls back to a normal message.

The embed color follows your [branding accent color](branding-and-domains.md#accent-color).

---

:::info
Next: [Branding & Custom Domains](branding-and-domains.md), to make forms look like yours.
:::
