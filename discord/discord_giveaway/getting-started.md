---
title: Getting Started
description: Getting Started
sidebar_position: 1
---

![Discord Ticket Bot](/img/msk-giveaway-bot-banner.png)

A multilingual, per-guild configurable Discord giveaway bot built on **Discord.js v14**, persisted via **MariaDB** (Prisma). Restart-safe poll scheduler, entry via button, weighted winner draw with eligibility checks, and reroll. Developed and maintained by [MSK Scripts](https://www.msk-scripts.de).

[`License: AGPL-3.0`](https://www.gnu.org/licenses/agpl-3.0) · [`Node.js 22+`](https://nodejs.org) · [`Discord.js v14`](https://discord.js.org) · [`Docs: docu.msk-scripts.de`](https://docu.msk-scripts.de/discord/discord_giveaway/getting-started)

Prefer the overview first? The
[free Discord giveaway bot](https://www.msk-scripts.de/giveaway) page on msk-scripts.de
covers the features, the command list and the Tebex winner coupons.
Auf Deutsch: [Discord Giveaway Bot, kostenlos und neustartsicher](https://www.msk-scripts.de/de/giveaway).

---

## ➕ Add to Your Server

The easiest way to use the bot is to invite the **official public instance** — no hosting, no database, no setup required.

> [**🎉 Invite the Giveaway Bot →**](https://discord.com/oauth2/authorize?client_id=1512465732179329065&scope=bot+applications.commands&permissions=478208)

You can also retrieve this link at any time inside Discord with the `/ginvite` command.

Once the bot has joined, a server manager runs [`/gcreate`](./commands.md) to open a giveaway. Members join with a single button click, and the bot draws the winners automatically when the timer ends.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎉 Button Entry | Members join with a single click — customisable emoji, label and button style |
| 🔁 Restart-Safe | A poll-based scheduler means no giveaway is lost or orphaned, even after a reboot |
| 🎁 Multiple Prizes | List several prizes per giveaway — either everyone gets all of them, or [each winner gets their own](./commands.md#multiple-prizes) |
| 👥 Weighted Bonus Entries | Grant specific roles extra entries (up to 100), [shown in the giveaway message](./configuration.md#bonus-entries-in-the-embed) so everyone knows about them |
| 🛡️ Eligibility Rules | Whitelist / blacklist roles plus minimum account age and server membership — server-wide, and a single giveaway may use its own rules instead |
| ⏸️ Pause & Resume | Freeze the timer mid-giveaway and resume seamlessly where you left off |
| 🗂️ Templates | Save any giveaway as a template with one click, prizes and entry conditions included, and reuse it by command or in the dashboard |
| ✨ Reroll | Draw fresh winners for any ended giveaway, respecting the blacklist |
| 🖥️ Web Dashboard | Create and fully manage giveaways and settings from the browser — Discord login, no commands required |
| 🏆 Public Results Pages | Every finished giveaway gets a shareable results page with the winners and participant count |
| 🎟️ Tebex Winner Coupons | Connect your own Tebex store and every winner gets their own single-use discount code by DM |
| 🌐 Multilingual | English, German, French, Spanish, Hungarian, Polish and Portuguese — selectable per server |
| 🎨 Per-Guild Branding | Custom embed colour, button emoji and style |
| 📜 Audit Logging | Optional log channel records every giveaway event |
| 🧑‍⚖️ Manager Role | Delegate giveaway control without handing out *Manage Server* |
| 🔒 Least-Privilege | Only the `Guilds` intent and minimal permissions — no message-content access |

---

## 🔑 Required Permissions

When invited via the link above, the bot requests exactly the permissions it needs (permission integer **478208**):

| Permission | Why it is needed |
|---|---|
| View Channel | See the channel the giveaway runs in |
| Send Messages | Post the giveaway message |
| Embed Links | Render the giveaway embed |
| Read Message History | Locate and edit its own giveaway message |
| Use External Emojis | Allow a custom button emoji |
| Mention Everyone | Ping the configured *notify* role on creation |

At runtime, `allowedMentions` restricts pings specifically to the configured notify role — the bot never mass-pings `@everyone`.

The bot uses **only** the `Guilds` gateway intent. It requires no privileged intents and opens no inbound port.

---

## 🌍 Live Statistics

Anonymous, server-wide statistics of the official instance are available at
**[msk-scripts.de/giveaway/stats](https://www.msk-scripts.de/giveaway/stats)** — total servers, giveaways, entries and winners, plus language and status distribution. No server IDs, user IDs or other personal data are shown.

---

## 🖥 Web Dashboard

Prefer a browser over slash commands? Server admins can manage everything at
**[msk-scripts.de/giveaway/dashboard](https://www.msk-scripts.de/giveaway/dashboard)**:

1. Log in with **Discord** (you'll only see servers where you have *Manage Server* **and** the bot is present).
2. Pick a server.
3. Create, edit, extend, pause/resume, end, cancel and reroll giveaways — and change every per-server setting.
4. Manage [templates](./commands.md#templates-in-the-dashboard) in their own tab, and start from one when creating a giveaway: pick it above the form and every field is filled in. **Save as template** on a giveaway card turns a giveaway you already ran into one.
5. Set the [entry conditions](./configuration.md#bonus-entries-weighted-draw): blocked and required roles plus bonus entries per role, server-wide in the *Settings* tab or for one giveaway in its own form. The per-giveaway fields start out as a copy of the server settings and apply instead of them, so you can lift a server-wide rule for a single giveaway.

The dashboard also holds the two things that have no slash command: the [winner coupon](./configuration.md#tebex-winner-coupons) settings of a giveaway, and the **Tebex store** tab, which is visible to the server owner only.

Behind the scenes the dashboard forwards each action to the running bot over a private, server-internal channel, so the Discord message, button, winner DMs and audit log stay perfectly in sync — exactly as if you had used the slash commands. Everything you do on the dashboard is still recorded in your [log channel](./configuration.md).

---

## 🏆 Public Results Pages

When a giveaway ends, the bot publishes a clean, shareable results page at
**`msk-scripts.de/giveaway/g/<token>`** — linked automatically in the results message and in the winner DMs. It shows the giveaway title and prize, the **winners** and the **number of participants**. If the giveaway handed out [one prize per winner](./commands.md#multiple-prizes), each winner is listed with the prize they won. For privacy, the full participant list is never published. The page is removed automatically if the bot is removed from your server.

---

## 🎟️ Tebex Winner Coupons

Run a Tebex shop? Winners can automatically receive a **personal, single-use discount code** for **your own store**, not ours. The server owner connects the store once in the dashboard, then every giveaway can carry a discount percentage, an optional package restriction and an optional validity period.

The code arrives by DM together with the prize and never appears in the public results message or on the results page. On a reroll, the replaced winner's code is revoked before the new one is issued.

Because a Tebex plugin secret grants full access to a shop, connecting a store is restricted to the **server owner** and the key is stored encrypted. Full setup in the [configuration guide](./configuration.md).

---

## 🔒 Self-Hosting

Running your own copy of this bot is **neither supported nor encouraged**. The source code is published for transparency — so users can see exactly how the bot behaves and fellow developers can learn from it — not as a ready-made product to redeploy. There is no support for installing, modifying, or building your own instance.

Just [invite the official instance](https://discord.com/oauth2/authorize?client_id=1512465732179329065&scope=bot+applications.commands&permissions=478208) instead.

---

## 📝 License

AGPL-3.0 — source code must remain open and be published under the same license when distributed or hosted.
