---
title: Getting Started
description: Getting Started
sidebar_position: 1
---

![Discord Ticket Bot](/img/discord_ticketbot_banner.png)

A modern, self-hosted Discord ticket bot built on **Discord.js v14** and **SQLite** — no external database, no telemetry, full feature set out of the box.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blueviolet?style=flat-square)](https://www.gnu.org/licenses/agpl-3.0)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=flat-square&logo=discord)](https://discord.js.org)
[![Documentation](https://img.shields.io/badge/Docs-docu.msk--scripts.de-5eb131?style=flat-square)](https://docu.msk-scripts.de/discord/discord_ticketbot/getting-started)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎫 Ticket Types | Up to 25 configurable types with individual emoji, color, category & questions |
| 📋 Questionnaires | Modal forms (up to 5 questions) shown when opening a ticket |
| 🙋 Claim System | Staff can claim/unclaim — button toggles, embed & topic update automatically |
| 🔴 Priorities | Low / Medium / High / Urgent via `/priority` — shown in channel topic & embed |
| 📝 Staff Notes | Private notes via `/note add` / `/note list` |
| 🔀 Move Ticket | Move to a different type/category via `/move` or button (staff only) |
| 🛡️ Type-specific Staff Roles | Each ticket type can define its own staff roles |
| 🖼️ Panel Logo & Banner | Optional logo thumbnail and/or banner image in the panel embed |
| 🎛️ Panel Interaction Type | Choose between a Button or a direct Select Menu in the panel |
| ⭐ Rating System | 1–5 star feedback after closing, automatically posted to a configured channel |
| ⏰ Staff Reminder | Automatic ping inside the ticket if no staff responds within X hours |
| ⏰ Auto-Close | Automatically close inactive tickets with a configurable warning period |
| 🔗 Transcript Links | Transcripts stored online and accessible via a public link |
| 📄 HTML Transcript | Full HTML transcript with all messages, embeds and attachments |
| 🌐 Custom Domain | Premium users can serve transcripts under their own domain |
| 📊 Statistics | Server-wide stats and detailed per-user stats via `/stats` |
| 🚫 Blacklist | `/blacklist add/remove/list` to block users from opening tickets |
| 🌍 Multilingual | German and English included, easily extensible |
| 🗄️ SQLite | No external database required — file is created automatically |

---

## 🔗 MSK Transcript Service

Instead of sending transcripts as file attachments via DM, the bot can upload them to **[www.msk-scripts.de](https://www.msk-scripts.de)** and generate a public link — accessible in any browser, no download required.

### Subscription Tiers

| Feature | Basic (free) | Premium (€5/mo) | Premium+ (€10/mo) |
|---|---|---|---|
| Transcript as link | ✅ | ✅ | ✅ |
| Max. transcript size | 10 MB | 100 MB | 250 MB |
| File attachments in transcript | ❌ | ✅ | ✅ |
| Max. attachment size per ticket | — | 150 MB | 500 MB |
| Custom domain | ❌ | ✅ | ✅ |
| Storage duration | 30 days | 60 days | 90 days |

> Premium and Premium+ are unlocked via **[GitHub Sponsors](https://github.com/sponsors/MSK-Scripts)**.

### Getting your API Key

1. Visit **[www.msk-scripts.de/verify](https://www.msk-scripts.de/verify)**
2. Sign in with your GitHub account
3. Connect your Discord account
4. Select your server → your API key is generated instantly

Then add it to your `.env`:
```bash
MSK_API_KEY='your_api_key_here'
MSK_API_URL="https://www.msk-scripts.de"
```

### Custom Domain (Premium & Premium+)

Premium users can serve transcripts under their own domain (e.g. `tickets.yourserver.com`).

1. Visit **[www.msk-scripts.de/dashboard](https://www.msk-scripts.de/dashboard)** after verifying
2. Enter your domain and set a DNS **A-Record** pointing to the server IP shown
3. Click **"Check DNS"** once propagation is complete — SSL is set up automatically

> 📖 Full setup guide: [docu.msk-scripts.de](https://docu.msk-scripts.de/discord/discord_ticketbot/getting-started)

---

## 📁 Project Structure

```
discord_ticketbot/
├── index.js                    # Entry point
├── package.json
├── .env.example                # Environment variable template
├── ticketbot.service           # systemd unit file for Linux servers
├── assets/                     # Static files (logo, banner images)
│   ├── logo.png                # Panel logo thumbnail (place your own here)
│   └── banner.png              # Panel banner image (place your own here)
├── config/
│   └── config.example.jsonc    # Configuration template (with comments)
├── docs/
│   ├── setup-en.md             # MSK Transcript Service setup guide (English)
│   └── setup-de.md             # MSK Transcript Service setup guide (German)
├── locales/
│   ├── de.json                 # German
│   └── en.json                 # English
├── data/
│   └── tickets.db              # SQLite database (auto-created)
└── src/
    ├── client.js               # Extended Discord Client
    ├── config.js               # Config loader & validation
    ├── database.js             # All DB operations (SQLite)
    ├── handlers/
    │   ├── commandHandler.js   # Loads & registers slash commands
    │   ├── eventHandler.js     # Loads Discord events
    │   └── componentHandler.js # Loads buttons, modals, menus
    ├── commands/               # Slash commands
    │   ├── setup.js            # /setup      – Send panel
    │   ├── close.js            # /close      – Close ticket
    │   ├── add.js              # /add        – Add user
    │   ├── remove.js           # /remove     – Remove user
    │   ├── claim.js            # /claim      – Claim ticket
    │   ├── unclaim.js          # /unclaim    – Unclaim ticket
    │   ├── move.js             # /move       – Move ticket
    │   ├── rename.js           # /rename     – Rename channel
    │   ├── transcript.js       # /transcript – Generate HTML transcript
    │   ├── priority.js         # /priority   – Set priority (topic + embed)
    │   ├── note.js             # /note       – Staff notes
    │   ├── blacklist.js        # /blacklist  – Block users
    │   └── stats.js            # /stats      – Statistics (server & user)
    ├── events/
    │   ├── ready.js            # Bot start, status, auto-close & staff reminder loop
    │   ├── messageCreate.js    # Track last activity
    │   └── interactionCreate.js # Route all interactions
    ├── components/
    │   ├── buttons/
    │   │   ├── openTicket.js       # tb_open
    │   │   ├── closeTicket.js      # tb_close
    │   │   ├── claimTicket.js      # tb_claim
    │   │   ├── unclaimTicket.js    # tb_unclaim
    │   │   ├── moveTicket.js       # tb_move
    │   │   ├── deleteTicket.js     # tb_delete
    │   │   ├── deleteConfirm.js    # tb_deleteConfirm
    │   │   ├── deleteCancel.js     # tb_deleteCancel
    │   │   └── rateTicket.js       # tb_rate:N
    │   ├── modals/
    │   │   ├── closeReason.js      # tb_modalClose
    │   │   └── ticketQuestions.js  # tb_modalQuestions:type
    │   └── menus/
    │       ├── panelSelect.js      # tb_panelSelect
    │       ├── ticketType.js       # tb_selectType
    │       └── moveSelect.js       # tb_moveSelect
    └── utils/
        ├── logger.js           # Coloured console logger
        ├── embeds.js           # All embed constructors
        ├── transcript.js       # HTML transcript generator
        ├── mskApi.js           # MSK Transcript Service API client
        └── ticketActions.js    # Core logic: openTicket, performClose, performMove
```

---

## ⚙️ Slash Commands

| Command             | Permission    | Description                                                           |
| ------------------- | ------------- | --------------------------------------------------------------------- |
| `/setup`            | Administrator | Send the ticket panel                                                 |
| `/close [reason]`   | Configurable  | Close the current ticket                                              |
| `/claim`            | Staff         | Claim a ticket — updates topic & embed, button toggles to Unclaim     |
| `/unclaim`          | Staff         | Release a claimed ticket — updates topic & embed, button toggles back |
| `/move`             | Staff         | Move ticket to a different type/category                              |
| `/add <user>`       | Staff         | Add a user to the ticket                                              |
| `/remove <user>`    | Staff         | Remove a user from the ticket                                         |
| `/rename <name>`    | Staff         | Rename the ticket channel                                             |
| `/transcript`       | Staff         | Generate an HTML transcript                                           |
| `/priority <level>` | Staff         | Set ticket priority (updates channel topic & embed)                   |
| `/note add <text>`  | Staff         | Add a staff note                                                      |
| `/note list`        | Staff         | List all notes for this ticket                                        |
| `/stats`            | Staff         | Server-wide ticket statistics                                         |
| `/stats @user`      | Staff         | Detailed statistics for a specific user                               |
| `/blacklist add`    | Manage Guild  | Block a user                                                          |
| `/blacklist remove` | Manage Guild  | Unblock a user                                                        |
| `/blacklist list`   | Manage Guild  | Show the blacklist                                                    |

---

## 🔘 Ticket Buttons

Every ticket channel contains a button row at the top:

| Button          | Visible when                         | Description                                                          |
| --------------- | ------------------------------------ | -------------------------------------------------------------------- |
| 🔒 Close Ticket  | Always (configurable)                | Disables all buttons, generates transcript, closes & renames channel |
| 🙋 Claim         | `claimButton: true`, not yet claimed | Staff claims — topic & embed update, button becomes Unclaim          |
| 🙌 Unclaim       | `claimButton: true`, already claimed | Staff releases — topic & embed update, button becomes Claim          |
| 🔀 Move          | More than 1 ticket type configured   | Staff opens type selection (staff only)                              |
| 🗑️ Delete Ticket | After closing                        | Deletes the channel after confirmation                               |

---

## 🗄️ Database Schema

The SQLite database is created automatically at `data/tickets.db`. Existing databases are automatically migrated if columns are missing.

| Table         | Contents                                                              |
| ------------- | --------------------------------------------------------------------- |
| `tickets`     | All tickets: status, type, priority, claim info, reminder, transcript |
| `blacklist`   | Blocked users with reason and timestamp                               |
| `staff_notes` | Private staff notes per ticket                                        |
| `ratings`     | Ratings (1–5 ⭐) with optional comment                                 |

---

## 🌍 Adding a New Language

1. Copy `locales/de.json`, e.g. as `locales/fr.json`
2. Translate all strings
3. Set `"lang": "fr"` in `config/config.jsonc`

---

## 📝 License

AGPL-3.0 — Source code must remain open and be published under the same license when distributed or hosted.

Forks and modifications that remove or bypass the MSK Transcript Service integration are not permitted.
