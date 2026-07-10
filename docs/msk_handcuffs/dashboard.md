---
title: Admin Dashboard
sidebar_position: 3
description: The in-game admin dashboard of msk_handcuffs v3 - live player actions, item config, job restrictions, settings and a per-action permission system, all applied without a restart.
keywords:
  - msk_handcuffs dashboard
  - handcuffadmin
  - fivem admin panel
  - dashboardGroups
  - permissions
  - luxu_admin
---

# In-Game Admin Dashboard

:::tip[New in v3.0.0]
The settings are no longer edited by hand in `config.lua`. They live in the
**database** and are managed from an in-game **admin dashboard** — cuff and uncuff
players, configure your items, edit the job restriction matrix, change every
setting and manage a **group/permission system**, all applied **live without a
server restart**.
:::

## How it works

On the **first start** the script imports `config/settings.lua` **once** into the
database. From then on the **database is authoritative** — the config file only
acts as the default template for a fresh install.

```text
config/settings.lua ── seeded once ──► database ◄── managed live by the dashboard
config/static.lua ───► code hooks, never touched by the dashboard
```

See [Database](./database.md) for the tables that are created, and
[Config](./config.md) for what belongs in which file.

:::warning
After the first start, editing a value in `config/settings.lua` does nothing. Change
it in the dashboard instead.
:::

## Opening the dashboard

Use the command (default `handcuffadmin`):

```text
/handcuffadmin
```

The command name is configurable in the Settings tab and, for a fresh install, via
[`Config.adminCommand`](./config.md).

## Who can open it

Access is decided **in code**, not by ACE-restricting the command:

- **`group.admin`** can always open it and always has **every** right. This role
  cannot be edited or removed.
- **`group.user`** can **never** open the dashboard (hard blacklist).
- Any other group must be listed under **Command access** (Permissions tab, stored
  as [`Config.dashboardGroups`](./config.md)) **and** have at least one right
  assigned.

:::info[Groups come from your server.cfg]
FiveM cannot enumerate ACE groups, so groups are **added by name** in the dashboard
and checked at runtime with `IsPlayerAceAllowed('group.<name>')`. The group must
therefore exist as a principal in your `server.cfg`:

```cfg title="server.cfg"
add_ace group.admin command allow
add_principal identifier.license:xxxxxxxx group.admin

add_ace group.mod command allow
add_principal identifier.license:yyyyyyyy group.mod
```

The "Check" button next to a group is a best-effort validation (it reports whether
any online player is currently in that group); you can still save a group that has
no one online.
:::

:::note[Framework groups and luxu_admin are recognised too]
Group membership is not limited to `server.cfg` ACE principals. A player counts as
being in a group if **any** of these match: the FiveM ACE principal
(`group.<name>`), the **framework group** (e.g. an ESX/QBCore group stored in the
`users` table, even without a matching `add_principal`), or, when enabled, the
player's **luxu_admin v2** staff group.

luxu_admin keeps its staff groups internally (not as ACE principals), so it is
resolved via its `getPlayerStaffGroup` export. Enable and tune it in
`config/static.lua` through [`Config.LuxuAdmin`](./config.md#configluxuadmin)
(`enable`, `resource`, `requireDuty`, and an optional `groupMap` to map luxu_admin
group names onto your dashboard groups).
:::

## Permissions

There are **10 rights**. `group.admin` always has all of them.

| Right | Allows |
|---|---|
| `players.view` | See the Players tab and everyone's current status |
| `players.cuff` | Cuff and hardcuff a player from the dashboard |
| `players.uncuff` | Uncuff a player from the dashboard |
| `players.tracker` | Toggle the ankletracker |
| `players.headbag` | Toggle the headbag |
| `players.tape` | Toggle the tape |
| `items.manage` | Edit the Items tab (cuff / hardcuff / uncuff items) |
| `restrictions.manage` | Edit the job restriction matrix |
| `settings.manage` | Edit the global settings |
| `permissions.manage` | Manage groups, rights and command access |

Every action is **validated server-side** against the caller's effective rights (the
union of all their groups). The UI only hides what a user can't do — the server is
the source of truth, so the buttons can't be bypassed.

On a fresh install the seed creates two groups: `admin` with every right, and `mod`
with `players.view` only.

## Tabs

### Players

Lists every online player with their name, ID, job and current status (cuffed,
hardcuffed, ankletracker, headbag, tape). One click per action, and each button is
gated by its own right. These actions behave like the [admin commands](./commands.md):
they skip the item and distance checks.

### Items

Configure which items trigger which action:

- `cuffItems`, `hardcuffItems` and `uncuffItems`
- `ItemSettings` — which uncuff item opens which cuff item. Uncuffing only works
  with the matching item, so cable ties open with scissors and handcuffs with the
  cuff keys.
- `GiveCuffItemBack` — whether the cuff item is returned on uncuff
- `consumeUncuffItem` — whether the uncuff item is taken out of the inventory
  (default off, so keys stay reusable)

:::tip[No restart needed]
Items you add or change here are registered as usable items right away, on ESX,
QBCore, ox_inventory and jaksam_inventory. Items you **remove** stay registered
until the next restart, they just don't do anything anymore.
:::

### Restrictions

The `Config.RestrictItems` matrix. Set the **default items and options** every
player may use, and then per job which cuff/hardcuff/uncuff item it gets and whether
it may use the ankletracker, headbag and tape.

:::note
The defaults always apply, regardless of the job. A job only **adds** its own items
and options on top, it never takes the defaults away.
:::

### Settings

Every DB-managed setting, grouped by topic: language, debug, version checker, max
distance, Discord logging (including the **webhook URL**), the target system,
commands, ankletracker, headbag, tape, the auto-uncuff timer, sounds, props, voice,
the admin commands, the dashboard command name and the theme.

#### Headbag & Tape toggles

- **Need item to remove** — off by default, so anyone can take the bag or the tape
  off again. Turn it on to require the remove item.
- **Consume remove item** — off by default, so the key is not used up. The
  ankletracker has the same toggle.

#### Colors & branding

Recolour the whole UI: **accent, background, panel, primary and secondary text**,
with a live preview and a "Reset to default" button. The **brand tag** is the small
badge next to the dashboard title (default `MSK`, [`Config.BrandTag`](./config.md)).
Leave it empty to hide the badge.

### Permissions

- Add/remove groups and toggle their rights in a matrix (`group.admin` is shown
  locked with all rights on, `group.user` can never be added).
- Manage the **Command access** list — which groups may open the dashboard.

## Language

The dashboard ships in **German, English and Hungarian** (`Config.Locale`). Changing
the language in the Settings tab also re-translates the **ox_target / qb-target**
options live, no restart needed.
