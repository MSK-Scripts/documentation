---
title: Client
sidebar_position: 1
---

# Client Functions

Functions available on the **client** side. Import the core in your resource's `fxmanifest.lua` and call them through the global `MSK` table (or via `exports.msk_core:*`):

```lua
shared_script '@msk_core/import.lua'
```

## Overview

| Page | Description |
|---|---|
| [Player](./player.md) | The mirrored `MSK.Player` table and client player helpers |
| [Inventory](./inventory.md) | `MSK.HasItem` on the client |
| [Entities](./entities.md) | Closest entity/player helpers and death detection |
| [Vehicle](./vehicle.md) | Vehicle queries, seats, plates, doors |
| [Coords](./coords.md) | Show / copy coordinates and admin commands |
| [Points](./points.md) | Spatial point registration & closest-point queries |
| [Request](./request.md) | Stream models, anims, textures, scaleforms, raycasts |
| [World](./world.md) | Spawn-point checks, ped mugshots, closest players |
| [Notify](./notify.md) | Notifications, help text, HUD text, subtitles, spinners |
| [Scaleform](./scaleform.md) | Freemode messages, popups, breaking news |
| [Ace Permission](./ace-permission.md) | Client-side ace checks |
| [Commands](./commands.md) | `MSK.RegisterCommand` with ace support |
| [UI](./ui/input.md) | Input, Numpad, Progressbar, TextUI, Context Menu, Menu |

See also the [Shared](../shared/index.md) functions (callbacks, math, string, table, timeout, vector) which work on both sides.
