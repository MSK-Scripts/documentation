---
title: MSK VehicleKeys
sidebar_position: 1
---

![MSK VehicleKeys](/img/msk_vehiclekeys_banner.png)

[**CFX Post**](https://forum.cfx.re/t/esx-qbcore-msk-vehiclekeys-unique-items/5264475)

# MSK VehicleKeys

A complete vehicle key system for **ESX** and **QBCore**. Lock and unlock vehicles
with a command, a hotkey or a target — manage primary, secondary and temporary keys,
hand keys to other players, exchange locks at a locksmith and even transfer ownership
of a vehicle to another player.

Vehicle keys are stored **metadata-based as unique items** (every vehicle gets its own
unique key item) and persisted in a MariaDB table that is created automatically on first
start.

## Features

- **In-game admin dashboard** *(new in v3.0.0)* — manage player keys, look up plates, run a locksmith, edit the access lists, change every setting and control dashboard access, all live from a React NUI with a group/permission system *(see [Admin Dashboard](admin.md))*
- **(Un)lock vehicles** via command, hotkey or target *(ox_target)*
- **Seat selection** — choose which seat to enter when using the target *(ox_target)*
- **Keys menu** opened by command or hotkey
- **Three key types** — Primary, Secondary and Temporary keys
- **Unique key items** — every vehicle has its own metadata-based key item
- **Give keys** to other players *(secondary key, primary key or full ownership transfer)*
- **Transfer vehicle** — sell/hand a vehicle including ownership to another player
- **Exchange vehicle locks** at a locksmith *(removes every other player's key for that vehicle)*
- **Keyring system** — store all keys in a second inventory *(ox_inventory & jaksam_inventory)*
- **Job vehicles** — players with a specific job (and optionally rank) can (un)lock matching vehicles
- **Whitelist / Blacklist** for models and plates
- **Admin vehicles** — only configured admin groups can (un)lock them
- **Admin command** to (un)lock any vehicle without a key
- **Owner item enforcement** *(new)* — optionally require even the vehicle owner to carry the key item *(`ownerNeedsItem`)*
- **NPC vehicle locking** with configurable carjacking probability
- **Version checker** and a full **export API** (client & server)

## Inventory Support

| Inventory | Keyring | Notes |
|---|---|---|
| [ox_inventory](https://github.com/overextended/ox_inventory) | ✅ | **Recommended** |
| [jaksam_inventory](https://fivem.jaksam-scripts.com/package/7091785) | ✅ | Items must be metadata / unique |

:::info
Vehicle keys are **metadata-based unique items**. Only `ox_inventory` and `jaksam_inventory`
are supported. Support for `qs-inventory` and `core_inventory` was removed in **v2.0.0**.
:::

## Requirements

- [ESX 1.9.2+](https://github.com/esx-framework/esx_core) or [QBCore](https://github.com/qbcore-framework/qb-core)
- [msk_core](https://github.com/MSK-Scripts/msk_core)
- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql)

## Optional Requirements

- [ox_target](https://github.com/overextended/ox_target) — target-based (un)locking & seat selection
- [msk_enginetoggle](https://forum.cfx.re/t/msk-enginetoggle-toggle-engine-on-off/4793840) — engine toggle integration

## Documentation Overview

- **[Installation](guides/installation.md)** — install the resource and set up the items
- **[Config](config.md)** — every option in `config/settings.lua` & `config/static.lua` explained
- **[Admin Dashboard](admin.md)** — the in-game dashboard, its tabs and the permission system
- **[Commands & Keybinds](commands.md)** — player and admin commands and their hotkeys
- **[Integrations](guides/integrations.md)** — wire `msk_vehiclekeys` into vehicle shops & garages
- **[Client Exports](exports/client.md)** / **[Server Exports](exports/server.md)** — the full export API
