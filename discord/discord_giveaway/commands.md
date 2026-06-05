---
title: Commands
description: Slash command reference
sidebar_position: 2
---

## 💬 Commands

All commands are Discord **slash commands**. They split into two groups by who may use them:

- **Everyone** — informational commands any member can run
- **Manager** — `Manage Server` permission **or** the configured [`manager` role](./configuration#manager-role)
- **Manage Server** — server settings, gated behind the native *Manage Server* permission

### Manager Commands

| Command | Description |
|---|---|
| `/gcreate` | Opens a modal to create a giveaway in the **current channel** |
| `/gedit <id> [title] [description] [winners] [prize]` | Edit a running giveaway |
| `/gextend <id> <duration>` | Extend the end time of a running giveaway |
| `/gend <id>` | Ends a giveaway immediately and draws the winners |
| `/greroll <id> [winner]` | Draws new winners for an **ended** giveaway. With `winner`, replaces only that single winner |
| `/gcancel <id>` | Cancels an active giveaway **without** drawing a winner |
| `/gpause <id>` | Pauses a giveaway and freezes its timer |
| `/gresume <id>` | Resumes a paused giveaway |
| `/gtemplate save \| list \| delete \| use` | Manage reusable giveaway templates |

### Everyone

| Command | Description |
|---|---|
| `/glist` | Lists the active giveaways in the server |
| `/ginfo <id>` | Shows details about a specific giveaway |
| `/gstats` | Shows this server's giveaway statistics (totals, entries, win rate) |
| `/ghelp` | Overview of all commands |
| `/ginvite` | Returns the bot's invite link |

### Manage Server

| Command | Description |
|---|---|
| `/gsettings show` | Displays the current per-server configuration |
| `/gsettings set …` | Sets or adds a setting — see [Configuration](./configuration) |
| `/gsettings remove …` | Removes or clears a setting — see [Configuration](./configuration) |

> **The giveaway ID** (`<id>`) is the short public code shown in the footer of every giveaway embed (e.g. `A1B2C3`). Use `/glist` or `/ginfo` to look it up.

---

## 🎉 Creating a Giveaway — `/gcreate`

`/gcreate` opens a modal with five fields:

| Field | Type | Limits |
|---|---|---|
| **Title** | Short text | up to 256 characters |
| **Description** | Paragraph | up to 2000 characters |
| **Duration** | Short text | format like `1d2h30m`, `45m`, `90s` — **min 10s, max 1 year** |
| **Winners** | Number | 1–100 |
| **Prize** *(optional)* | Short text | up to 256 characters — shown in the embed and the winner DM |

### Duration format

Durations are written as a chain of `<number><unit>` tokens, where the units are:

| Unit | Meaning |
|---|---|
| `d` | days |
| `h` | hours |
| `m` | minutes |
| `s` | seconds |

**Examples:** `1d` (1 day) · `2h30m` (2½ hours) · `45m` · `1d2h30m` · `90s`

The minimum is **10 seconds** (so the 10-second scheduler tick can fire) and the maximum is **1 year**.

---

## 🔁 Pause, Resume, End & Reroll

- **Pause** (`/gpause`) freezes the countdown — the remaining time is preserved and the button is disabled. **Resume** (`/gresume`) continues exactly where it left off.
- **End** (`/gend`) finishes a giveaway early and immediately draws the winners.
- **Cancel** (`/gcancel`) closes a giveaway with **no** winner draw.
- **Reroll** (`/greroll`) picks new winners for an already-ended giveaway. Blacklisted roles are excluded from the new draw.

---

## 🗂️ Templates — `/gtemplate`

Templates store a reusable giveaway configuration (title, description, duration, number of winners), which is ideal for recurring events.

| Subcommand | Description |
|---|---|
| `/gtemplate save <name>` | Saves the current giveaway settings under a name |
| `/gtemplate list` | Lists all saved templates for the server |
| `/gtemplate use <name>` | Creates a new giveaway from a saved template |
| `/gtemplate delete <name>` | Removes a saved template |
