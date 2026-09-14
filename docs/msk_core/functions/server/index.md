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
| [Player](./player.md) | The unified player object, job and gang definitions, the mirrored table |
| [Inventory](./inventory.md) | `MSK.HasItem`, `MSK.RegisterItem` and the inventory bridge |
| [Entities](./entities.md) | Closest entity/player helpers |
| [Vehicle](./vehicle.md) | Server-side vehicle queries and `MSK.SpawnVehicle` |
| [Vehicle Store](./vehicle-store.md) | The owned-vehicle table of every framework behind one API |
| [Coords](./coords.md) | Show / copy coordinates for a player |
| [World](./world.md) | Spawn-point checks, closest players, `MSK.AddWebhook` |
| [Notify](./notify.md) | Send notifications to a player by server id, or to everyone |
| [Scaleform](./scaleform.md) | Trigger scaleforms on a player |
| [Ace Permission](./ace-permission.md) | Ace checks, `AddAce` / `AddPrincipal` |
| [Commands](./commands.md) | `MSK.RegisterCommand` with ace restriction |
| [Society](./society.md) | Company and society account money |
| [Offline](./offline.md) | Bank money by identifier, online or offline, and the character table |
| [Ban System](./ban-system.md) | Identifier/token bans and ban commands |
| [Cron](./cron.md) | Schedule recurring jobs by interval, clock time or cron expression |
| [Disconnect Logger](./disconnect-logger.md) | Log player disconnects |
| [Version Checker](./version-checker.md) | `MSK.Check` version & dependency checks |
| [Logger](./logger.md) | Send logs to Grafana Loki, Datadog or Fivemanage |
| [Events](./events.md) | Send one client event to many players or everyone in range |
| [Files](./files.md) | List the files in a folder of a resource |
| [txAdmin](./txadmin.md) | Show txAdmin announcements, messages and restart warnings as MSK notifications |
| [UI](./ui/input.md) | Server-side Input dialog, Numpad (code checked on the server), Progressbar, TextUI, Context Menu, Menu, Alert, Skillcheck |

See also the [Shared](../shared/index.md) functions (callbacks, math, string, table, timeout, vector) which work on both sides.
