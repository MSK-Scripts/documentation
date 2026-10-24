---
title: Getting Started
description: Getting Started
sidebar_position: 1
---

![Discord Ticket Bot](/img/discord_ticketbot_banner.png)

A modern, self-hosted Discord ticket bot built on **Discord.js v14**: SQLite out of the box (no external database required), with optional **MySQL/MariaDB** and **PostgreSQL** support. No telemetry, full feature set out of the box.

It is a **plain Discord bot**: no game server, no FiveM, no ESX or QBCore, no framework. All it needs is Node.js and a bot token.

[`License: AGPL-3.0`](https://www.gnu.org/licenses/agpl-3.0) · [`Node.js 24+`](https://nodejs.org) · [`Discord.js v14`](https://discord.js.org) · [`Docs: docu.msk-scripts.de`](https://docu.msk-scripts.de/discord/discord_ticketbot/getting-started)

Prefer the overview first? The
[self-hosted Discord ticket bot](https://www.msk-scripts.de/ticketbot) page on msk-scripts.de
walks through the features, the transcript tiers and the verification flow.
Auf Deutsch: [Discord Ticket Bot zum Selbsthosten](https://www.msk-scripts.de/de/ticketbot).

Still deciding between the options? The
[comparison of self-hosted Discord ticket bots](https://www.msk-scripts.de/ticketbot/compare)
puts this bot next to Discord Tickets, Sayrix Ticket-Bot and the hosted Ticket Tool,
including the cases where another project is the better fit.
Auf Deutsch: [Ticket Bots im Vergleich](https://www.msk-scripts.de/de/ticketbot/compare).

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎫 Ticket Types | Up to 25 types, each with its own emoji, color, category, staff roles, start priority and questions |
| 📋 Questionnaires | Up to 5 questions in a modal when a ticket is opened. The answers appear in the ticket and in the transcript |
| 🎛️ Panel | Button or select menu, optional logo and banner. The `/setup` panel refreshes itself on every start |
| 🙋 Claim System | Claim and unclaim per button or command, embed and channel topic update automatically |
| 🔴 Priorities | Low, Medium, High, Urgent. Predefined per ticket type or set with `/priority` |
| 🛡️ Type-specific Staff | A ticket type with its own `staffRoles` is handled by those roles only, for channel access and for every staff action |
| 🚧 Open Restrictions | Blocked roles, per-type `cantAccess`, a blacklist and a per-user open limit that cannot be raced |
| 📝 Staff Notes | Private notes per ticket with `/note` |
| 🔀 Move Ticket | Move a ticket to another type and category, with the matching permissions |
| 🔒 Ticket Lock | The creator and added users can no longer write |
| ♻️ Reopen Tickets | Reopen a closed ticket per button or `/reopen`, restores access and category |
| ⏰ Auto-Close | Closes inactive tickets after a warning, can be paused per ticket with `/autoclose` |
| ⏰ Staff Reminder | Pings the ticket's staff roles when nobody answered within X hours |
| ⭐ Rating System | 1 to 5 stars with an optional comment, posted with the ticket category and the user's avatar. Staff can reply via the **Comment Feedback** context menu |
| 📄 HTML Transcript | Self-contained HTML in a **modern** or **classic** design. Avatars, custom emojis and, without an API key, the images are embedded, so the file works offline |
| 🔗 Transcript Links | With an MSK API key, transcripts are uploaded and shared as a link, optionally under your own domain |
| 💬 Canned Responses | Snippets with placeholders and autocomplete, defined in `snippets.jsonc` |
| 📢 Broadcast | One message to every open ticket |
| 🔔 User Notifications | Optional "Notify me" button, the creator gets a DM when staff replies |
| 📊 Statistics | Server-wide and per-user stats with `/stats` |
| 🎮 Dynamic Bot Status | Shows the number of open tickets in the bot status |
| 🌍 Multilingual | 7 languages included (English, German, French, Spanish, Portuguese, Polish, Hungarian), easily extensible |
| 🗄️ Flexible Database | SQLite out of the box, optional MySQL/MariaDB or PostgreSQL via `DATABASE_URL`, with a migration script |
| 🔄 Update Notice | Checks GitHub releases on start and posts new versions to the log channel |
| 🖥️ Web Dashboard | Optional browser dashboard: tickets, statistics, config editor, bot control, permissions and an end-user portal. See [Web Dashboard](./dashboard.md) |
| 🐳 Docker | Official images for `linux/amd64` and `linux/arm64`. See [Docker](./docker.md) |

---

## 🔗 MSK Transcript Service

Without an API key nothing leaves your server: the transcript is attached as a self-contained HTML file to the log channel and, if you want, to the close DM. With an API key the bot uploads it to **[www.msk-scripts.de](https://www.msk-scripts.de)** instead and shares a public link that opens in any browser.

Four tiers are available: **Basic** (free), **Premium** (€4.99/mo), **Premium+** (€9.99/mo) and **Business** (€19.99/mo), each paid tier also billed yearly with two months free. Paid tiers add larger transcripts and file attachments, longer storage, custom domains and the right to remove the MSK notice. From Premium+ on, the bot itself can be hosted on our servers. All paid tiers start with a **14-day free trial** that takes no credit card.

To get started, grab your API key at **[www.msk-scripts.de/ticketbot/verify](https://www.msk-scripts.de/ticketbot/verify)** (sign in with Discord, pick your server) and add it to your `.env`:

```bash
MSK_API_KEY='your_api_key_here'
MSK_API_URL="https://www.msk-scripts.de"
```

> 📖 Full walkthrough (tier comparison, API key, custom domain): **[Service Setup](./service-setup.md)**

---

## 🖥️ Hosted Bot Management (Premium+ & Business)

Do not want to run a server at all? On Premium+ and Business the bot can be **hosted by MSK Scripts**, and you set it up yourself in the dashboard at **[msk-scripts.de/ticketbot/dashboard](https://www.msk-scripts.de/ticketbot/dashboard)**. Enter your bot token, client ID and client secret, press one button, and we install it, start it and check that it came up.

![Dashboard, Hosted Bot Management](/img/discord_ticketbot_hosting_dashboard.png)

Your bot then gets its own address, `tickets-<id>.msk-scripts.de` or a domain of your own, with its own Discord login. That is what lets your whole support team into the bot's dashboard, not just you.

> 📖 Details: **[Service Setup → Hosted Bot Management](./service-setup.md)**

---

## 🖥️ Self-Hosted Web Dashboard

Running the bot yourself? The optional web dashboard lets you manage tickets, statistics, the configuration and the bot process from your browser, with a permission model for your team. It is disabled by default and safe out of the box.

See the dedicated **[Web Dashboard](./dashboard.md)** page for setup, security and the full permission model.

---

## 📁 Project Structure

```
discord_ticketbot/
├── index.js                 # the plain bot (npm start)
├── dashboard.js             # supervisor + web dashboard, forks index.js (npm run dashboard)
├── config/                  # *.example.jsonc templates; your configs are gitignored
├── locales/                 # bot strings: main.json (source), en, de, fr, es, pt, pl, hu
├── assets/                  # panel logo and banner
├── data/                    # runtime data, SQLite database
├── docs/                    # setup, configuration and dashboard guides
├── scripts/                 # migrate-db.js, dashboard-setup.js
├── tests/                   # node:test suites (npm test)
├── web/                     # dashboard UI (React + Vite), web/dist is committed
└── src/
    ├── client.js            # boot flow and staff checks
    ├── config.js            # JSONC parser + validation
    ├── commands/            # slash commands and the "Comment Feedback" context menu
    ├── components/          # buttons/, menus/, modals/ (custom ids start with tb_)
    ├── events/              # ready, interactionCreate, messageCreate, channelDelete
    ├── handlers/            # loaders for commands, components, events
    ├── database/            # async DB layer for SQLite, MySQL/MariaDB, PostgreSQL
    ├── dashboard/           # web server, supervisor, auth, permissions
    └── utils/               # ticket lifecycle, transcript, embeds, MSK API client, …
```

The full layout is in [docs/development-en.md](https://github.com/MSK-Scripts/discord_ticketbot/blob/main/docs/development-en.md) on GitHub.

---

## ⚙️ Slash Commands

| Command | Who | Description |
|---|---|---|
| `/setup` | Administrator | Send the ticket panel |
| `/close [reason]` | `closeOption.whoCanCloseTicket` | Close the current ticket |
| `/reopen` | `reopenOption.whoCanReopen` | Reopen a closed ticket, restores access and category |
| `/claim` · `/unclaim` | Staff | Claim or release the ticket, topic and embed update |
| `/move` | Staff | Move the ticket to another type |
| `/add <user>` · `/remove <user>` | Staff | Add or remove a user |
| `/rename <name>` | Staff | Rename the ticket channel |
| `/priority <level>` | Staff | Set low, medium, high or urgent |
| `/note add <text>` · `/note list` | Staff | Private staff notes |
| `/lock lock [reason]` · `/lock unlock` | Staff | Lock or unlock the ticket |
| `/autoclose pause` · `/autoclose resume` | Staff | Pause or resume auto-close and the staff reminder for this ticket |
| `/transcript` | Staff | Generate the HTML transcript now |
| `/snippet send <name>` · `/snippet list` | Staff | Send or list canned responses |
| `/broadcast <message> [type] [embed]` | Staff | Message every open ticket |
| `/blacklist add/remove/list` | Manage Server | Manage the blacklist |
| `/stats [user]` | Staff | Server-wide or per-user statistics |

**Staff** means the staff roles of the ticket's type, or the global `rolesWhoHaveAccessToTheTickets` for types without their own. Administrators always count as staff. `/setup` and `/blacklist` ship with a default permission that the server admin can widen under *Server Settings → Integrations*.

### Context Menu

| Entry | Target | Who | Description |
|---|---|---|---|
| **Comment Feedback** | A posted rating (right click → Apps) | `ratingSystem.commentRoles`, otherwise staff | Adds a team comment to the rating embed. A second comment by the same person replaces the first |

---

## 🔘 Ticket Buttons

| Button | Visible when | Description |
|---|---|---|
| 🔒 Close Ticket | `closeOption.closeButton` | Close the ticket, optionally with a reason |
| 🙋 Claim / 🙌 Unclaim | `claimOption.claimButton` | Toggles between the two |
| 🔀 Move | More than one ticket type | Choose a new type, staff only |
| 🔕 Notify me | `userNotifications.enabled` | The creator opts in to DM notifications |
| 🗑️ Delete Ticket | After closing | Deletes the channel after confirmation |
| ♻️ Reopen | After closing, `reopenOption.button` | Reopens the ticket |
| ⭐ 1 to 5 | Rating request after closing | Only the ticket creator can rate |

---

## 🗄️ Database Schema

The database is created automatically. By default this is a local SQLite file (`data/tickets.db`); set `DATABASE_URL` to use MySQL/MariaDB or PostgreSQL instead (see [Database](/discord/discord_ticketbot/database)). The same schema applies to every backend, and missing columns are added automatically on start.

| Table | Contents |
|---|---|
| `tickets` | One row per ticket: status, type, priority, claim, lock, notifications, reminder, auto-close pause, transcript |
| `blacklist` | Blocked users per server, with reason and timestamp |
| `staff_notes` | Private staff notes per ticket |
| `ratings` | One rating per ticket (1 to 5 ⭐) with optional comment |
| `panel_messages` | Location of the `/setup` panel message, for the refresh on start |
| `dashboard_access` | Dashboard permissions per role or user |
| `dashboard_audit` | Append-only log of every dashboard change |

---

## 🌍 Adding a New Language

Seven languages ship with the bot: English, German, French, Spanish, Portuguese, Polish and Hungarian (`locales/en.json`, `de.json`, `fr.json`, `es.json`, `pt.json`, `pl.json`, `hu.json`). To use one, set its code in `config/config.jsonc` (`"lang": "fr"`).

To add another language:

1. Copy `locales/en.json`, e.g. as `locales/it.json`
2. Translate all strings (including the `transcript` block)
3. Set `"lang": "it"` in `config/config.jsonc` (and optionally `"transcriptLang": "it"`)

---

## 📝 License

AGPL-3.0-only. Anyone who distributes or hosts a modified version must publish its source under the same license.

One additional term under Section 7(b): the notice identifying the software as MSK Ticket Bot has to stay visible to the people using the bot. Servers with an active Premium or Premium+ subscription are exempt. The exact wording is in the [NOTICE](https://github.com/MSK-Scripts/discord_ticketbot/blob/main/NOTICE) file.
