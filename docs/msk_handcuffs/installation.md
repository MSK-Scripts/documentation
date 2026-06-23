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
| ox_target **or** qb-target | optional | Target menu |
| pma-voice **or** saltychat | optional | Tape mute feature |

## 2. Start order

```bash
ensure oxmysql
ensure es_extended      # or qb-core
ensure msk_core
ensure ox_target        # optional (or qb-target)
ensure msk_handcuffs
```

## 3. Database

You do **not** need to import any `.sql` file. On first start `msk_handcuffs` creates its
table automatically and — if a legacy `database.json` exists — migrates it once into MySQL.

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

Open [`config.lua`](./config.md), set your `Config.Locale`, jobs and items, and add your
Discord webhook in `server/discord.lua` if you want logs.

:::tip
Set `Config.Debug = false` on your live server (it is the default).
:::
