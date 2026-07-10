---
title: MSK Handcuffs
sidebar_position: 1
description: Realistic handcuffs for FiveM (ESX & QBCore). Server-authoritative, oxmysql persistence with automatic database.json migration, replicated statebags, ox_target & qb-target support.
keywords:
  - msk_handcuffs
  - fivem handcuffs
  - esx handcuffs
  - qbcore handcuffs
  - cuff uncuff
  - ankletracker
  - headbag
  - tape
  - oxmysql
  - statebags
---

# MSK Handcuffs

![MSK Handcuffs](/img/msk_handcuffs_banner.png)

[**YouTube Preview**](https://www.youtube.com/watch?v=K1PrV9T7yZA) | [**CFX Post**](https://forum.cfx.re/t/esx-msk-handcuffs-realistic-handcuffs/4885324)

## Description

- Cuff and uncuff players with animations and props
- Hardcuff a player _(player can't move)_
- Drag and undrag / escort a player
- Put a player in/out of a vehicle
- **AnkleTracker** — a specific job can track a player's position (live blips)
- **Headbag** — the player gets a blackscreen and a bag on their head
- **Tape** — the player gets tape on their mouth and can't talk

---

- Trigger actions via **items**, **commands**, **exports** or the **target menu** — new in v3, for [ox_target](https://github.com/overextended/ox_target) (**recommended**) and [qb-target](https://github.com/qbcore-framework/qb-target)
- Server-side **timer** for automatic uncuff
- **Admin commands** and an **in-game admin dashboard**
- **Discord logs**
- Status (cuffed, ankletracker, …) is **persisted in MySQL** and restored after relog

## What's new in v3.0.0

| Area | v2.x | v3.0.0 |
|---|---|---|
| **Framework** | ESX only | **ESX & QBCore** (auto-detected via msk_core) |
| **Configuration** | `config.lua`, restart required | **[In-game admin dashboard](./dashboard.md)** — settings live in the database and apply instantly |
| **Persistence** | flat `database.json` | **oxmysql** (`msk_handcuffs` table) with **automatic one-time migration** from `database.json` |
| **Trust model** | client-driven | **server-authoritative** — the server validates distance, item possession and job for every action |
| **Status** | events + callbacks | **replicated statebags** (single source of truth, readable by any resource) |
| **Targeting** | none (`Config.Target` only bound the undrag key) | **ox_target** (recommended) **& qb-target** — auto-detected, translated and state-aware labels |
| **Auto-uncuff timer / death** | client-side (exploitable) | **server-driven** |

The dashboard opens with `/handcuffadmin` and gives you live player actions, the item
config, the job restriction matrix, every setting (including the Discord webhook and the
UI colours) and a **permission system with 10 separate rights**.

See **[Migration from v2](./migration.md)** for renamed/removed exports & events, and the
**[changelog](./changelog/v3.0.0.md)** for the full list.

## Requirements

- [msk_core](https://github.com/MSK-Scripts/msk_core) **3.0.0+**
- [oxmysql](https://github.com/overextended/oxmysql)
- A framework: [ESX Legacy](https://github.com/esx-framework/esx_core) **or** [QBCore](https://github.com/qbcore-framework/qb-core)

## Optional Requirements

- [ox_target](https://github.com/overextended/ox_target) (**recommended**) or [qb-target](https://github.com/qbcore-framework/qb-target) — for the target menu. Without one of them, only items, commands and exports are available.
- [pma-voice](https://github.com/AvarianKnight/pma-voice) or [saltychat](https://github.com/v10networkscom/saltychat-fivem) — for the Tape mute feature

## Pages

- [Installation](./installation.md)
- [Admin Dashboard](./dashboard.md)
- [Config](./config.md)
- [Database & Migration](./database.md)
- [Statebags](./statebags.md)
- [Commands](./commands.md)
- [Exports](./exports/client.md) · [Events](./events/client.md) · [Event Handlers](./event-handlers.md)
- [Migration from v2](./migration.md)
- [Job-script integration guides](./guides/general-edits-for-jobs.md)
- [Changelog](./changelog/v3.0.0.md)
