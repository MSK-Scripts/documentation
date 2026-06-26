---
title: Getting Started
sidebar_position: 2
---

# Getting Started

This page walks you through your **first ten minutes** with MSK Forms: inviting the bot, building a form, posting it to Discord, and reviewing the first submission.

There's nothing to install — MSK Forms is hosted at [forms.msk-scripts.de](https://forms.msk-scripts.de).

---

## 1. Invite the bot to your server

1. Go to [forms.msk-scripts.de](https://forms.msk-scripts.de) and click **Invite the bot**.
2. Pick the Discord server (guild) you want to use and authorize the bot. You need the **Manage Server** permission on that guild to add it.
3. The moment the bot joins, MSK Forms links your server: the guild owner becomes the **owner** in MSK Forms, and the server shows up in the dashboard.

That's all the setup the bot needs. It doesn't require any channels or roles up front — you configure those later when you want review embeds and automatic role grants.

---

## 2. Log in to the dashboard

1. Click **Log in with Discord** (top-right). MSK Forms uses Discord OAuth — it only ever asks for `identify`, `email`, and your server list.
2. You land on the **dashboard**, which lists every server where the bot is installed and you're a member.
3. Click your server to open it.

:::info Roles
Your standing in a guild decides what you can do:

- **Owner / Admin** — *managers*: build forms, configure the bot, branding, team, everything.
- **Reviewer** — review submissions across all forms.
- **Viewer** — the default for newly seen members; no data access until a manager grants a role or a specific form.

Managers assign roles on the **Team** page. See [Submissions & Review](submissions-and-review.md#team--access) for the full model.
:::

---

## 3. Build your first form

In your server's dashboard, open the **Forms** tab and click **New form**.

1. Give the form a **title** and (optionally) a description.
2. Add fields from the field picker — start simple with a couple of **Short text** fields and a **Single choice**.
3. Mark the fields applicants must fill as **required** (or use **Make all required** to flip them all at once).
4. Set **visibility** — public (anyone with the link) or login-required.
5. Click **Save**. The form is created as a draft.

When you're ready, set the form **status to Live** so it accepts submissions. A live form gets a public URL:

```
https://forms.msk-scripts.de/f/<your-form-slug>
```

There's a huge amount more the builder can do — multi-step pages, conditional logic, scoring, file uploads, scheduling, A/B tests, automations. See the [Form Builder](form-builder.md) page for the full tour.

---

## 4. Share the form

On the **Forms** list, each live form has a **Share** panel:

- **Direct link** — the `/f/<slug>` URL above
- **QR code** — server-rendered, ready to drop into a poster or an image
- **Embed** — an `<iframe>` snippet for your own website

Or post it straight to Discord — see the next step.

---

## 5. Post the form to a Discord channel

From inside Discord, run:

```
/forms post
```

Pick the form (the bot autocompletes your live forms) and the channel. The bot posts an embed with a button that links applicants to the form. You need **Manage Server** to post.

Other handy commands:

- `/forms list` — list the server's live forms
- `/forms setup` — get a link to the dashboard

Full command reference: [Discord Bot](discord-bot.md).

---

## 6. Receive and review the first submission

When someone submits:

1. They're redirected to their **private status page** — `https://forms.msk-scripts.de/s/<submission-id>` — where they'll see their status update live from now on.
2. In the dashboard, the submission appears under the **Submissions** tab.
3. Open it to see every answer. Use the review panel to **change the status**, add an **internal note** (reviewers only), or send a **public message** the applicant sees on their status page.

If you've configured a review channel (see [Discord Bot → Review workflow](discord-bot.md#review-workflow)), the bot also posts a "new submission" embed there with **Accept** / **Reject** buttons.

---

## 7. Close the loop

Change a submission's status to **Accepted**. Three things happen:

- The applicant's status page updates **instantly** (it's live).
- If the applicant logged in with Discord, the bot **DMs them** the new status with a link.
- If you configured an **accepted role**, the bot **grants that role** on your server.

That's the whole point of MSK Forms: the applicant always knows where they stand, and acceptance can be fully automated into your Discord.

---

## What's next

- [Form Builder](form-builder.md) — field types, logic, scheduling, scoring, A/B tests, automations
- [Submissions & Review](submissions-and-review.md) — statuses, the Kanban board, bulk actions, exports
- [Discord Bot](discord-bot.md) — commands, review embeds, role grants, status DMs, activity log
- [Plans & Limits](plans.md) — what Free / Pro / Enterprise include

---

:::info
Stuck on something? Open an [issue](https://github.com/MSK-Scripts/msk-forms/issues) or join the [Discord](https://discord.gg/5hHSBRHvJE).
:::
