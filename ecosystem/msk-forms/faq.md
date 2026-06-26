---
title: FAQ
sidebar_position: 10
---

# FAQ

Common questions about MSK Forms — usage, the bot, plans, and data.

---

## Getting started

### Do I need to host anything?

No. MSK Forms is a hosted service at [forms.msk-scripts.de](https://forms.msk-scripts.de). You invite the bot, log in with Discord, and build forms. (The source is public on [GitHub](https://github.com/MSK-Scripts/msk-forms), but it's not meant for self-hosting.)

### Do applicants need a Discord account?

Only if the form requires login. Public forms can be filled by **anyone with the link** — no account. Logged-in applicants get the extras: status DMs from the bot and an automatic role on acceptance.

### How do applicants see their status?

Every submission gets a private link (`/s/<id>`). The applicant opens it and sees their status update **live** — no login, no refresh. If they logged in with Discord, the bot also DMs them on each change.

### I invited the bot but my server isn't in the dashboard.

The guild is linked when the bot joins and you log in. Make sure you're logging in with the Discord account that's a **member of that server**, and that the bot is still present. New members show up as **Viewer** with no data access until a manager grants a role.

---

## The bot

### A slash command isn't showing up.

After the bot registers or changes its commands, **global** Discord command propagation can take up to ~1 hour. Give it some time; re-inviting doesn't speed it up.

### Why does the bot post under a generic name / no server avatar?

It's a single shared bot, so it can't have a per-server profile. Set a **post name** on the dashboard **Bot** page — it then posts via a webhook under your chosen name and your guild logo. See [Discord Bot → Posting appearance](discord-bot.md#posting-appearance).

### Accepting a submission didn't grant the role.

Check that: (1) a guild or per-form **accepted role** is configured, (2) the applicant **logged in with Discord** (anonymous applicants have no account to grant to), and (3) the bot's role is **above** the role it's trying to grant in the server's role hierarchy.

### Can the bot speak my language?

Yes — set it with `/forms language <locale>` or the **Bot** page dropdown (EN/DE/HU/FR/ES/PT/PL). That covers command replies, review embeds, and the activity log. Applicant DMs use the applicant's own Discord language, falling back to the server language.

---

## Forms

### What field types are there?

25+ — text, email, URL, number, phone, choices (single/multi/dropdown), yes-no, consent, dates/times, ratings (stars/NPS/emoji/slider), file & image upload, signature, matrix, and calculated fields, plus layout blocks. Full list: [Form Builder](form-builder.md#fields).

### Can a form branch based on answers?

Yes — [conditional logic](form-builder.md#conditional-logic) can show, hide, require, or jump to a page based on answers. Combine it with [multi-step pages](form-builder.md#multi-step-pages) for branching flows.

### Can I make it a quiz?

Yes. Give choice options **points** and MSK Forms scores submissions server-side. You can then auto-decide with an [automation](form-builder.md#automations) — e.g. *"Score ≥ 80 → Accepted"*. See [Quiz & scoring](form-builder.md#quiz--scoring).

### Can I schedule a form to open/close?

Yes — set an [open/close window](form-builder.md#scheduling). Before it opens it shows "Opens \<time\>"; in the last 24 h before closing it shows an "Ending soon" banner.

---

## Plans & data

### How does pricing work?

Three tiers — Free, Pro, Enterprise — **per Discord server**. Each server is upgraded independently. See [Plans & Limits](plans.md) and the [pricing page](https://forms.msk-scripts.de/pricing).

### What are the Free limits?

3 forms, 100 submissions/month, 2 team members, CSV export, and a "Powered by" badge. Pro and Enterprise raise the limits and unlock branding/domain/automation/API features. See [Plans & Limits](plans.md).

### Is MSK Forms end-to-end encrypted like MSKanban?

No. Reviewers need to read submissions, so answers are stored readable by the guild's team and the operator. Sensitive integration secrets (OAuth, captcha) are encrypted at rest. See [Privacy & Security](privacy.md).

### How do I (or an applicant) delete a submission?

An applicant can **delete** their own submission from the status page (it removes the row and any uploaded files). Teams can delete submissions or whole forms. This satisfies GDPR erasure. See [Applicant self-service](submissions-and-review.md#applicant-self-service-gdpr).

### Can I export submissions?

Yes — CSV on all plans; XLSX, JSON, and PDF on Pro+. Exports are reviewer-only. See [Exports](submissions-and-review.md#exports).

### Can I use my own domain?

Yes, on Pro — add a CNAME + TXT record and verify; TLS is automatic. You can also bring your own Discord login app and Turnstile captcha for that domain. See [Branding & Custom Domains](branding-and-domains.md#custom-domains).

---

## Still stuck?

- [GitHub issues](https://github.com/MSK-Scripts/msk-forms/issues) for bugs and feature requests
- [Discord](https://discord.gg/5hHSBRHvJE) for community questions
