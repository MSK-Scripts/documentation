---
title: Commands
description: Slash command reference
sidebar_position: 2
---

## 💬 Commands

All commands are Discord **slash commands**. They split into two groups by who may use them:

- **Everyone** — informational commands any member can run
- **Manager** — `Manage Server` permission **or** the configured [`manager` role](./configuration.md#manager-role)
- **Manage Server** — server settings, gated behind the native *Manage Server* permission

:::tip[Prefer a browser?]
Every manager command below can also be performed from the [**Web Dashboard**](./getting-started.md#-web-dashboard) at [msk-scripts.de/giveaway/dashboard](https://www.msk-scripts.de/giveaway/dashboard) — log in with Discord and manage your giveaways visually.
:::

### Manager Commands

| Command | Description |
|---|---|
| `/gcreate [mode]` | Opens a modal to create a giveaway in the **current channel**. `mode` chooses how multiple prizes are handed out |
| `/gedit <id> [title] [description] [winners] [prizes] [mode]` | Edit a running giveaway |
| `/gextend <id> <duration>` | Extend the end time of a running giveaway |
| `/gend <id>` | Ends a giveaway immediately and draws the winners |
| `/greroll <id> [winner]` | Draws new winners for an **ended** giveaway. With `winner`, replaces only that single winner |
| `/gcancel <id>` | Cancels an active giveaway **without** drawing a winner |
| `/gpause <id>` | Pauses a giveaway and freezes its timer |
| `/gresume <id>` | Resumes a paused giveaway |
| `/gtemplate save \| from \| list \| delete \| use` | Manage reusable giveaway templates |

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
| `/gsettings set …` | Sets or adds a setting — see [Configuration](./configuration.md) |
| `/gsettings remove …` | Removes or clears a setting — see [Configuration](./configuration.md) |

> **The giveaway ID** (`<id>`) is the short public code shown in the footer of every giveaway embed (e.g. `A1B2C3`). Use `/glist` or `/ginfo` to look it up.

---

## 🎉 Creating a Giveaway — `/gcreate`

`/gcreate` opens a modal with five fields:

| Field | Type | Limits |
|---|---|---|
| **Title** | Short text | up to 256 characters |
| **Description** | Paragraph | up to 2000 characters |
| **Duration** | Short text | format like `1d2h30m`, `45m`, `90s` — **min 10s, max 1 year** |
| **Winners** | Number | 1–100 (hidden when `mode` is *one prize per winner*, see below) |
| **Prizes** *(optional)* | Paragraph | **one prize per line**, up to 20 prizes, 256 characters each |

### Multiple prizes

Put one prize per line in the **Prizes** field. The `mode` option on `/gcreate` decides who gets what:

| `mode` | Behaviour |
|---|---|
| *Everyone gets all prizes* (default) | Every winner receives the full list. Two winners and two prizes means both get both. |
| *One prize per winner* | Winner 1 gets prize 1, winner 2 gets prize 2, and so on. |

With *one prize per winner* the number of winners is no longer a separate setting: it is the length of the prize list. The modal therefore drops the **Winners** field and asks for the prizes instead, and `/gedit` refuses a `winners` value that does not match the list.

The order matters twice: it is the order shown in the embed, and it is the order the winners are drawn in. If a single winner is replaced with `/greroll <id> <winner>`, the replacement inherits **that winner's** prize — the other winners keep theirs.

:::info Looking for the Tebex coupon?
Discord caps a modal at five fields, which `/gcreate` already uses. The winner coupon is therefore configured in the [web dashboard](./getting-started.md#-web-dashboard) instead, when you create or edit a giveaway. See [Tebex Winner Coupons](./configuration.md#tebex-winner-coupons). In *one prize per winner* mode the dashboard also lets you pick the discounted packages **per prize**, so the winner of a script gets their discount on that script. The discount percentage and the validity period always apply to the whole giveaway.
:::

:::tip Editing prizes later
`/gedit <id> prizes:"Nitro | Steam key" mode:"One prize per winner"` — slash options cannot contain line breaks, so separate the prizes with `|` there. In the [web dashboard](./getting-started.md#-web-dashboard) it is a normal multi-line field.
:::

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
- **Reroll** (`/greroll`) picks new winners for an already-ended giveaway. Blacklisted roles are excluded from the new draw. If the giveaway hands out [Tebex coupons](./configuration.md#tebex-winner-coupons), the replaced winner's code is revoked in your store before the new winner receives theirs. Rerolling a single winner leaves the other winners' codes untouched.

---

## 🗂️ Templates — `/gtemplate`

A template is a prepared giveaway without a channel and without an end date: title, description, duration, number of winners, the [prize list](#multiple-prizes) with its distribution mode and, if you want, its own [entry conditions](./configuration.md#per-giveaway-blacklist--whitelist--bonus). Ideal for anything you run every week.

| Subcommand | Description |
|---|---|
| `/gtemplate save <name> <title> <description> <duration> [winners] [prizes] [mode]` | Saves a template under a name, overwriting one of the same name |
| `/gtemplate from <giveaway_id> [name]` | Saves an existing giveaway as a template |
| `/gtemplate list` | Lists all saved templates for the server |
| `/gtemplate use <name>` | Creates a giveaway from a template, in the current channel |
| `/gtemplate delete <name>` | Removes a template |

`prizes` takes several prizes separated by `|`, for example `Script A | Script B`. Slash command options cannot contain line breaks, which is why it is not one per line as it is in the create modal. With `mode` set to "one prize per winner" the number of winners follows the prize list and the `winners` option is rejected if it says something else.

A server can hold up to 50 templates.

### Saving a giveaway as a template

`/gtemplate from` builds the template out of a giveaway you already ran, which beats typing all of it a second time. In the dashboard, every giveaway card has a **Save as template** button that does the same.

- Taken over: title, description, prizes, distribution mode, number of winners and the entry conditions.
- The **duration** is the span between creation and planned end (a giveaway stores a point in time, a template a duration).
- Without a `name` the template is named after the giveaway's title, and an existing name is overwritten rather than refused.
- Works for running giveaways too, not just ended ones.

### Templates in the dashboard

The [web dashboard](./getting-started.md#-web-dashboard) has a **Templates** tab that does the same thing with a form: create, edit, delete. When creating a giveaway there, a **Use template** selector sits above the form. Picking one fills in every field, and all of them stay editable, so a template is a starting point rather than a fixed form.

Entry conditions sit behind an **Own entry conditions** switch that is off by default. Off means a giveaway made from the template uses the server settings, later changes to them included — which is usually what you want from a template you keep for months.

Two things a template deliberately does not carry:

- **The channel and the end date.** Those are decided when the giveaway is created, which is what makes one template usable for every run.
- **The coupon configuration.** Tebex packages are stored as IDs of one specific store. A template kept for months would quietly carry IDs of packages that no longer exist, and the giveaway created from it would hand out a discount on nothing.
