---
title: Installation
sidebar_position: 2
description: How to install msk_handcuffs for ESX or QBCore, including dependencies, start order and the automatic database.json to MySQL migration.
keywords:
  - msk_handcuffs installation
  - fivem resource install
  - oxmysql
  - start order
---

# Installation

## 1. Dependencies

Make sure the following resources are installed and **start before** `msk_handcuffs`:

| Resource | Required | Notes |
|---|---|---|
| [oxmysql](https://github.com/overextended/oxmysql) | ✅ | Database access |
| [msk_core](https://github.com/MSK-Scripts/msk_core) `3.0.0+` | ✅ | Framework bridge & utilities |
| ESX **or** QBCore | ✅ | Auto-detected by msk_core |
| [ox_target](https://github.com/overextended/ox_target) **or** qb-target | optional | Target menu. **ox_target is recommended** |
| pma-voice **or** saltychat | optional | Tape mute feature |

## 2. Start order

```bash
ensure oxmysql
ensure es_extended      # or qb-core
ensure msk_core
ensure ox_target        # optional, recommended (or qb-target)
ensure msk_handcuffs
```

:::tip[Target menu]
New in v3: `msk_handcuffs` registers its own target options on every player. **ox_target
is the recommended system** and is picked automatically when it is running
(`Config.Target.system = 'auto'`). See [Config → `Config.Target`](./config.md#configtarget).
:::

## 3. Database

You do **not** need to import any `.sql` file. On first start `msk_handcuffs` creates its
tables automatically, migrates a legacy `database.json` once into MySQL and imports
`config/settings.lua` into the settings table.

See **[Database & Migration](./database.md)** for details.

## 4. Items

Add the items to your inventory. For ox_inventory see the
[ox_inventory guide](./guides/ox-inventory.md). The default item names are:

```
cuffs, cable_ties, hardcuff, cuff_keys, scissors, ankletracker, headbag, tape
```

If you use the `removeItem` options for AnkleTracker / Headbag / Tape, also add those
items (e.g. `ankletracker_key`, `headbag_key`, `tape_key`).

## 5. Configure

Open [`config/settings.lua`](./config.md) and set your `Config.Locale`, jobs and items
**before the first start** — the file is imported into the database exactly once.
Code hooks like the notification, the mute function and the props live in
`config/static.lua` and can be changed at any time.

## 6. Manage it in-game

Everything else happens in the [admin dashboard](./dashboard.md):

```text
/handcuffadmin
```

Add your team's groups to `Config.dashboardGroups` (or later in the Permissions tab),
paste your Discord webhook into the Settings tab, and adjust items and job restrictions
without touching a file or restarting the server.

:::tip
Set `Config.Debug = false` on your live server (it is the default).
:::
