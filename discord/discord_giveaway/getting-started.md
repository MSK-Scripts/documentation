---
title: Getting Started
description: Getting Started
sidebar_position: 1
---

# 🎉 Discord Giveaway Bot

A multilingual, per-guild configurable Discord giveaway bot built on **Discord.js v14**, persisted via **MariaDB** (Prisma). Restart-safe poll scheduler, entry via button, weighted winner draw with eligibility checks, and reroll. Developed and maintained by [MSK Scripts](https://www.msk-scripts.de).

[`License: AGPL-3.0`](https://www.gnu.org/licenses/agpl-3.0) · [`Node.js 22+`](https://nodejs.org) · [`Discord.js v14`](https://discord.js.org) · [`Docs: docu.msk-scripts.de`](https://docu.msk-scripts.de/discord/discord_giveaway/getting-started)

---

## ➕ Add to Your Server

The easiest way to use the bot is to invite the **official public instance** — no hosting, no database, no setup required.

> [**🎉 Invite the Giveaway Bot →**](https://discord.com/oauth2/authorize?client_id=1512397062652690502&scope=bot+applications.commands&permissions=478208)

You can also retrieve this link at any time inside Discord with the `/ginvite` command.

Once the bot has joined, a server manager runs [`/gcreate`](./commands) to open a giveaway. Members join with a single button click, and the bot draws the winners automatically when the timer ends.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎉 Button Entry | Members join with a single click — customisable emoji, label and button style |
| 🔁 Restart-Safe | A poll-based scheduler means no giveaway is lost or orphaned, even after a reboot |
| 👥 Weighted Bonus Entries | Grant specific roles extra entries (0–100) for a fairer or reward-driven draw |
| 🛡️ Eligibility Rules | Whitelist / blacklist roles, minimum account age and minimum server membership |
| ⏸️ Pause & Resume | Freeze the timer mid-giveaway and resume seamlessly where you left off |
| 🗂️ Templates | Save and reuse giveaway configurations for recurring events |
| ✨ Reroll | Draw fresh winners for any ended giveaway, respecting the blacklist |
| 🌐 Multilingual | English, German, French and Spanish — selectable per server |
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

## 🔒 Self-Hosting

Running your own copy of this bot is **neither supported nor encouraged**. The source code is published for transparency — so users can see exactly how the bot behaves and fellow developers can learn from it — not as a ready-made product to redeploy. There is no support for installing, modifying, or building your own instance.

Just [invite the official instance](https://discord.com/oauth2/authorize?client_id=1512397062652690502&scope=bot+applications.commands&permissions=478208) instead.

---

## 📝 License

AGPL-3.0 — source code must remain open and be published under the same license when distributed or hosted.
