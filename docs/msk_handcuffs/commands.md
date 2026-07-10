---
title: Commands
sidebar_position: 7
description: Player and admin chat commands for msk_handcuffs - cuff, hardcuff, uncuff, ankletracker, headbag, tape and the admin variants.
keywords:
  - msk_handcuffs commands
  - cuff command
  - adcuff
  - admin handcuff command
---

# Commands

## Player commands

These act on the **closest player** and respect items, job restrictions and distance.
They are configured under `Config.Commands`, `Config.AnkleTracker.command`,
`Config.HeadBag.command` and `Config.Tape.command`.

| Command | Description |
|---|---|
| `/cuff` | Cuff the closest player |
| `/hardcuff` | Hardcuff the closest player |
| `/uncuff` | Uncuff the closest player |
| `/ankletracker` | Toggle the ankletracker on the closest cuffed player |
| `/headbag` | Toggle the headbag on the closest player |
| `/tape` | Toggle the tape on the closest player |

:::note
Set a command to `false` (e.g. `Config.HeadBag.command = false`) to disable it.
:::

## Admin commands

Restricted to the ACE groups in `Config.AdminGroups` (default `superadmin`, `admin`).
They bypass item and distance checks and can be run from the server console.

| Command | Description |
|---|---|
| `/adcuff <playerID>` | Cuff the player with the given ID |
| `/adhardcuff <playerID>` | Hardcuff the player with the given ID |
| `/aduncuff <playerID>` | Uncuff the player with the given ID |
| `/adankletracker <playerID>` | Toggle the ankletracker for the given ID |
| `/adheadbag <playerID>` | Toggle the headbag for the given ID |
| `/adtape <playerID>` | Toggle the tape for the given ID |

Command names and toggles are configured under `Config.AdminCommands`.

## Dashboard command

| Command | Description |
|---|---|
| `/handcuffadmin` | Open the [in-game admin dashboard](./dashboard.md) |

The name comes from `Config.adminCommand` and can be changed in the dashboard itself.
Access is **not** handled by ACE-restricting the command: `group.admin` always gets in,
`group.user` never does, and every other group needs to be in `Config.dashboardGroups`
with at least one right. See [Admin Dashboard](./dashboard.md#who-can-open-it).
