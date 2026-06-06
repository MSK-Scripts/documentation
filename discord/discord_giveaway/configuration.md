---
title: Configuration
description: Per-server settings
sidebar_position: 3
---

## 🛠️ Configuration

Every server configures the bot **independently** — there are no config files to edit. All settings are managed in Discord with `/gsettings`, gated behind the native **Manage Server** permission.

- `/gsettings show` — display the current configuration
- `/gsettings set <option> …` — set or add a value
- `/gsettings remove <option> …` — remove or clear a value

Settings take effect immediately and apply to all future giveaways on that server.

> **set vs. remove:** `set` adds a role to a list (blacklist/whitelist) or sets a single value (manager/notify/bonus); `remove` takes it back out. The `log` channel is the exception — `set log` toggles it (running it again with the same channel clears it).

:::tip Configure in the browser
All of these settings can also be edited from the [**Web Dashboard**](./getting-started#-web-dashboard) (Discord login) — handy for picking roles and channels from a list instead of typing IDs.
:::

---

## ⚙️ Options

### `/gsettings set …`

| Option | Value | Default | Description |
|---|---|---|---|
| `lang <value>` | `en` · `de` · `fr` · `es` | `en` | UI language of the bot for this server |
| `color <value>` | `#RRGGBB` | `#00e676` | Embed accent colour |
| `emoji <value>` | any emoji | 🎉 | Emoji on the entry button |
| `button <value>` | `PRIMARY` · `SECONDARY` · `SUCCESS` · `DANGER` | `PRIMARY` | Entry button style |
| `blacklist <role> [giveaway_id]` | role (+ optional ID) | — | Members with this role **cannot** enter |
| `whitelist <role> [giveaway_id]` | role (+ optional ID) | — | If any whitelist role is set, members need **at least one** to enter |
| `bonus <role> <amount> [giveaway_id]` | role + `1`–`100` (+ optional ID) | — | Extra entries granted to a role for a weighted draw |
| `minaccount <days>` | `0`–`3650` | `0` (off) | Minimum Discord **account age** in days to enter |
| `minmember <days>` | `0`–`3650` | `0` (off) | Minimum **server membership** in days to enter |
| `manager <role>` | role | — | Role allowed to manage giveaways without *Manage Server* |
| `notify <role>` | role | — | Role pinged when a giveaway is created |
| `log <channel>` | channel | — | Channel that receives giveaway audit logs (toggle) |
| `reminder <minutes>` | `0`–`1440` | `0` (off) | Post an "ending soon" reminder *N* minutes before a giveaway ends |
| `claim <text>` | text | — | Instructions added to the winner DM (e.g. how to claim the prize) |

### `/gsettings remove …`

| Option | Value | Description |
|---|---|---|
| `blacklist <role> [giveaway_id]` | role (+ optional ID) | Remove a role from the blacklist |
| `whitelist <role> [giveaway_id]` | role (+ optional ID) | Remove a role from the whitelist |
| `bonus <role> [giveaway_id]` | role (+ optional ID) | Remove the bonus entries for a role |
| `manager <role>` | role | Clear the manager role |
| `notify <role>` | role | Clear the notify role |
| `claim` | — | Clear the winner-DM claim instructions |

---

### Per-giveaway blacklist / whitelist / bonus

`blacklist`, `whitelist` and `bonus` (both `set` and `remove`) accept an **optional `giveaway_id`**:

- **Without** `giveaway_id` → applies to the **server-wide** setting (all giveaways).
- **With** `giveaway_id` → applies **only to that one giveaway**, *in addition* to the server-wide values.

Blacklist/whitelist eligibility uses the **union** of the server-wide and per-giveaway roles. Per-giveaway **bonus** entries are **added on top** of any server-wide bonus for the same role.

```text
/gsettings set blacklist role:@Muted                          → blocked on every giveaway
/gsettings set whitelist role:@VIP giveaway_id:A1B2C3         → only giveaway A1B2C3 requires @VIP
/gsettings set bonus role:@Booster amount:3 giveaway_id:A1B2C3 → +3 entries, only for A1B2C3
/gsettings remove bonus role:@Booster giveaway_id:A1B2C3
```

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

- **Blacklist** — members holding a blacklisted role can never enter (server-wide and/or per-giveaway roles).
- **Whitelist** — if one or more whitelist roles are configured, a member must hold **at least one** of them. With no whitelist set, everyone may enter (subject to the other rules).
- **Minimum account age** (`minaccount`) — rejects accounts younger than *N* days. `0` disables the check.
- **Minimum server membership** (`minmember`) — rejects members who joined less than *N* days ago. `0` disables the check.

All rules are checked both when a member presses the entry button **and** again when winners are drawn.

---

### Bonus Entries (Weighted Draw)

`set bonus <role> <amount>` grants members of a role **additional entries** (1–100), increasing their chance of winning. This stacks for members who hold several bonus roles. Use `remove bonus <role>` to take it away again.

Add an optional `giveaway_id` to scope a bonus to **one giveaway only** — it is **added on top** of any server-wide bonus for that role.

---

### Manager Role

By default, only members with the **Manage Server** permission can run the manager commands (`/gcreate`, `/gend`, …). Setting a `manager` role lets you delegate giveaway control to that role **without** granting them *Manage Server*. Both *Manage Server* and the manager role always work. Use `remove manager <role>` to clear it.

---

### Notify Role & Logging

- **Notify role** — pinged once when a new giveaway is created. The bot restricts its pings to this role only (no `@everyone`). The role must be mentionable by the bot. Clear it with `remove notify <role>`.
- **Log channel** — when set, the bot posts an audit entry for every giveaway event (created, ended, rerolled, cancelled, …) to this channel.

---

### Winner DMs & Reminders

- **Winner DMs** — when a giveaway ends (or a winner is rerolled), each winner automatically receives a direct message with the prize, the configured **claim instructions** (`set claim <text>`) and a link to the giveaway. If a winner has DMs disabled, it is silently skipped.
- **"Ending soon" reminder** — `set reminder <minutes>` makes the bot post a reminder in the giveaway channel that many minutes before the end (pinging the notify role if configured). `0` disables it. The reminder also re-schedules itself when you extend a giveaway with `/gextend`.

---

### Eligibility requirements in the embed

Whenever a giveaway has eligibility rules (required/blocked roles, minimum account age or membership), they are listed in a **Requirements** field on the giveaway embed, so members can see at a glance whether they qualify.
