---
title: Server
sidebar_position: 1
---

# Server Functions

Functions available on the **server** side. Import the core in your resource's `fxmanifest.lua` and call them through the global `MSK` table (or via `exports.msk_core:*`):

```lua
shared_script '@msk_core/import.lua'
```

## Overview

| Page | Description |
|---|---|
| [Player](./player.md) | Player getters (`GetPlayer`, `GetPlayers`, …) and the mirrored table |
| [Inventory](./inventory.md) | `MSK.HasItem`, `MSK.RegisterItem` and the inventory bridge |
| [Entities](./entities.md) | Closest entity/player helpers |
| [Vehicle](./vehicle.md) | Server-side vehicle queries |
| [Coords](./coords.md) | Show / copy coordinates for a player |
| [World](./world.md) | Spawn-point checks, closest players, `MSK.AddWebhook` |
| [Notify](./notify.md) | Send notifications to a player by server id |
| [Scaleform](./scaleform.md) | Trigger scaleforms on a player |
| [Ace Permission](./ace-permission.md) | Ace checks, `AddAce` / `AddPrincipal` |
| [Commands](./commands.md) | `MSK.RegisterCommand` with ace restriction |
| [Society](./society.md) | Company / society account money |
| [Offline](./offline.md) | Offline player bank money |
| [Ban System](./ban-system.md) | Identifier/token bans and ban commands |
| [Cron](./cron.md) | Schedule recurring jobs |
| [Disconnect Logger](./disconnect-logger.md) | Log player disconnects |
| [Version Checker](./version-checker.md) | `MSK.Check` version & dependency checks |
| [UI](./ui/input.md) | Server-side Input, Numpad, Progressbar, TextUI, Context Menu, Menu |

See also the [Shared](../shared/index.md) functions (callbacks, math, string, table, timeout, vector) which work on both sides.
