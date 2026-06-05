---
title: Configuration
description: Per-server settings
sidebar_position: 3
---

## 🛠️ Configuration

Every server configures the bot **independently** — there are no config files to edit. All settings are managed in Discord with `/gsettings`, gated behind the native **Manage Server** permission.

- `/gsettings show` — display the current configuration
- `/gsettings set <option> …` — change a single option

Settings take effect immediately and apply to all future giveaways on that server.

> **Toggle behaviour:** for the role and channel options (blacklist, whitelist, manager, notify, log), running the command again with the **same** value removes it. For `bonus`, an amount of `0` removes the bonus for that role.

---

## ⚙️ Options

| `/gsettings set …` | Value | Default | Description |
|---|---|---|---|
| `lang <value>` | `en` · `de` · `fr` · `es` | `en` | UI language of the bot for this server |
| `color <value>` | `#RRGGBB` | `#00e676` | Embed accent colour |
| `emoji <value>` | any emoji | 🎉 | Emoji on the entry button |
| `button <value>` | `PRIMARY` · `SECONDARY` · `SUCCESS` · `DANGER` | `PRIMARY` | Entry button style |
| `blacklist <role>` | role | — | Members with this role **cannot** enter (toggle) |
| `whitelist <role>` | role | — | If any whitelist role is set, members need **at least one** to enter (toggle) |
| `bonus <role> <amount>` | role + `0`–`100` | — | Extra entries granted to a role for a weighted draw (`0` removes) |
| `minaccount <days>` | `0`–`3650` | `0` (off) | Minimum Discord **account age** in days to enter |
| `minmember <days>` | `0`–`3650` | `0` (off) | Minimum **server membership** in days to enter |
| `manager <role>` | role | — | Role allowed to manage giveaways without *Manage Server* (toggle) |
| `notify <role>` | role | — | Role pinged when a giveaway is created (toggle) |
| `log <channel>` | channel | — | Channel that receives giveaway audit logs (toggle) |

---

### Button Styles

| Value | Appearance |
|---|---|
| `PRIMARY` | Blurple |
| `SECONDARY` | Grey |
| `SUCCESS` | Green |
| `DANGER` | Red |

---

### Eligibility Rules

Several options combine to decide who may enter a giveaway:

- **Blacklist** — members holding a blacklisted role can never enter.
- **Whitelist** — if one or more whitelist roles are configured, a member must hold **at least one** of them. With no whitelist set, everyone may enter (subject to the other rules).
- **Minimum account age** (`minaccount`) — rejects accounts younger than *N* days. `0` disables the check.
- **Minimum server membership** (`minmember`) — rejects members who joined less than *N* days ago. `0` disables the check.

---

### Bonus Entries (Weighted Draw)

`bonus <role> <amount>` grants members of a role **additional entries** (0–100), increasing their chance of winning. This stacks for members who hold several bonus roles. Set the amount to `0` to remove the bonus for that role.

---

### Manager Role

By default, only members with the **Manage Server** permission can run the manager commands (`/gcreate`, `/gend`, …). Setting a `manager` role lets you delegate giveaway control to that role **without** granting them *Manage Server*. Both *Manage Server* and the manager role always work.

---

### Notify Role & Logging

- **Notify role** — pinged once when a new giveaway is created. The bot restricts its pings to this role only (no `@everyone`). The role must be mentionable by the bot.
- **Log channel** — when set, the bot posts an audit entry for every giveaway event (created, ended, rerolled, cancelled, …) to this channel.
