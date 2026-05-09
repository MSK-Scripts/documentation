---
title: Getting Started
description: Getting Started
sidebar_position: 1
---

# Discord Multi-Bot

A modular Discord bot system built with **discord.js v14**, running three independent bots in a single Node.js process. Developed and maintained by [MSK Scripts](https://www.msk-scripts.de).

All three bots run in parallel. If one crashes, it automatically restarts after 10 seconds without affecting the others.

---

## ✨ Features

### Commands Bot

| Command | Description | Role-restricted |
|---|---|---|
| `/information` | Posts a branded server information embed | ✅ Manager / Founder |
| `/rules` | Posts the server rules with Verification & Giveaway Notify buttons | ✅ Manager / Founder |
| `/roles` | Posts script update notification role buttons | ✅ Manager / Founder |
| `/script_guides` | Links to documentation for a chosen script | ✅ Support+ |
| `/donation` | Displays donation options with payment links | ✅ Manager / Founder |
| `/order_terms` | Sends the terms of service PDF with Accept / Reject buttons | ✅ Developer / Manager / Founder |
| `/order_price` | Shows an order price with Accept / Reject buttons | ✅ Developer / Manager / Founder |
| `/send_message` | Sends a custom message to any channel via modal | ✅ Manager / Founder |
| `/send_embed` | Sends a fully customizable embed to any channel | ✅ Manager / Founder |
| `/backup_database` | Creates a MySQL database backup and uploads it to the log channel | ✅ Founder |
| `/ping` | Shows bot latency and API response time | — |
| `/userinfo` | Shows info and minigame points for a user | — |
| `/clear` | Bulk-deletes up to 100 messages | ✅ Team |
| `/random` | Picks a random number in a given range (for guess games) | ✅ Team |
| `/rg` | Guess the currently active secret number | — |
| `/flachwitz` | Posts a random flat joke from the local collection | — |
| `/add_flachwitz` | Adds a new joke to the collection | ✅ Team |

**Persistent role-toggle buttons** (survive bot restarts):
- `✅ Verification` — assigns the Member role
- `🎁 Giveaway Notify` — toggles the Giveaway notification role
- `⏰ Garage / Handcuffs / Storage / Vehicle Keys` — toggles script update notification roles

---

### Events Bot

**Guild logging** — All events are posted as colored embeds to the configured log channel:

| Category | Events logged |
|---|---|
| Members | Join, Leave, Kick, Ban, Unban, Timeout set/removed |
| Roles | Role Added (incl. added by), Role Removed (incl. removed by) |
| Username / Nickname | Username changed, Nickname changed |
| Messages | Edited, Deleted (incl. deleted by), Bulk delete (incl. deleted by) |
| Channels | Created, Deleted, Updated (name, topic, slowmode, NSFW) |
| Server Roles | Created, Deleted, Updated (name, color, permissions diff) |
| Voice | Joined, Left, Moved, Server Muted/Unmuted, Server Deafened/Undeafened |
| Invites | Created (with max uses & expiry), Deleted |

**Additional behavior:**
- **Auto-reply** — Automatically responds when non-team members mention "Musiker15"
- **Feedback embed** — Messages posted in the feedback channel are auto-converted to branded embeds; the original message is deleted

**Context menus** (right-click on messages):

| Command | Description | Role-restricted |
|---|---|---|
| `📝 Comment Feedback` | Adds a moderator comment to a feedback embed and DMs the author | ✅ Manager / Founder |
| `💬 Answer a Message` | Sends a reply to any message via modal | ✅ Manager / Founder |
| `✏️ Edit Message` | Edits a bot message via modal | ✅ Manager / Founder |
| `🖼️ Edit Embed` | Edits a bot embed (title, description, thumbnail, image, footer) via modal | ✅ Manager / Founder |

---

### Minigames Bot

All minigames are session-based (no global state) and award or deduct points on each outcome.
Use `/points` to check your current score and progress toward rewards.

#### Commands

| Command | Description |
|---|---|
| `/8ball` | Magic 8-Ball — asks a yes/no question |
| `/dice` | Roll a die — d4 to d100, 1–10 dice |
| `/flipcoin` | Flip a coin — Heads or Tails |
| `/rps` | Rock Paper Scissors vs. the bot |
| `/slots` | Slot machine with animated spin and 7 symbol tiers |
| `/trivia` | Multiple-choice trivia (OpenTrivia DB + local fallback) |
| `/hangman` | Classic Hangman with letter-modal input |
| `/wordle` | Wordle — guess the 5-letter word in 6 tries |
| `/tictactoe` | TicTacToe — Easy / Medium / Minimax Hard AI |
| `/connect4` | Connect Four — bot AI with win/block/center logic |
| `/blackjack` | Blackjack — Hit, Stand, Double Down vs. the dealer |
| `/points` | Shows your current point balance with a progress bar |

> `/8ball` is excluded from the points system.

#### Reward Tiers

| Points | Reward |
|---|---|
| 500 | 🥉 Bronze Player |
| 1,500 | 🥈 Silver Player |
| 4,000 | 🥇 Gold Player |
| 10,000 | 💎 Diamond Player |

> Point values and rewards can be adjusted in `bots/minigames/points_config.json`.
> Add Discord role IDs there to enable automatic role assignment — restart the bot after changes.

---

## 📁 Project Structure

```
discord_multibot_js/
├── main.js                          ← Starts all 3 bots, handles auto-restart
├── package.json
├── .env                             ← Not committed (see .gitignore)
├── .github/
│   └── dependabot.yml               ← Weekly dependency update checks
├── core/
│   ├── config.js                    ← Environment config
│   ├── utils.js                     ← Shared helpers (makeEmbed, readJson, …)
│   └── pointsManager.js             ← Points read/write + reward notifications
├── data/
│   ├── points.json                  ← Persistent user points (auto-created)
│   └── backups/                     ← Database backup files (auto-created, auto-deleted)
├── assets/                          ← Static files, e.g. terms PDF
└── bots/
    ├── commands/
    │   ├── bot.js
    │   └── commands/
    │       ├── community.js          ← /information, /rules, /roles
    │       ├── admin.js              ← /backup_database, /send_message, /send_embed
    │       ├── support.js            ← /script_guides
    │       ├── orders.js             ← /donation, /order_terms, /order_price
    │       ├── utility.js            ← /ping, /userinfo, /clear
    │       └── minigames.js          ← /random, /rg, /flachwitz, /add_flachwitz
    ├── events/
    │   ├── bot.js
    │   └── handlers/
    │       ├── logging.js
    │       ├── messageHandler.js
    │       └── contextMenus.js
    └── minigames/
        ├── bot.js
        ├── points_config.json
        └── commands/
            ├── eightball.js, dice.js, flipcoin.js, rps.js
            ├── slots.js, trivia.js, hangman.js, wordle.js
            ├── tictactoe.js, connect4.js, blackjack.js, points.js
```

---

## 📝 License

AGPL-3.0 — Source code must remain open and be published under the same license when distributed or hosted.
