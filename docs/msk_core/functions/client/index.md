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
| [Player](./player.md) | The mirrored `MSK.Player` table, `MSK.OnPlayer` and client player helpers |
| [Inventory](./inventory.md) | `MSK.HasItem` on the client |
| [Entities](./entities.md) | Closest and nearby peds, objects, vehicles and players, death detection |
| [Vehicle](./vehicle.md) | Vehicle queries, seats, plates, doors |
| [Vehicle Properties](./vehicle-properties.md) | Read and apply colors, mods and damage, also from the server |
| [Coords](./coords.md) | Show / copy coordinates and admin commands |
| [Points](./points.md) | Points with enter, exit and per-frame callbacks, closest and nearby points |
| [Request](./request.md) | Stream models, anims, textures, audio banks, weapon assets, raycasts |
| [World](./world.md) | Spawn point checks, ped mugshots, closest players |
| [Notify](./notify.md) | Notifications with icons, positions and in-place updates, help text, HUD text, subtitles, spinners |
| [Scaleform](./scaleform.md) | Freemode messages, popups, breaking news, `MSK.Scaleform.New` for any movie |
| [Zones](./zones.md) | Sphere, box and poly zones, plus the in-game Zone Creator |
| [Keybind](./keybind.md) | Key bindings players can change, with press and release handlers |
| [Controls](./controls.md) | Disable game controls without your own loop |
| [DUI](./dui.md) | Web pages rendered into game textures |
| [Marker](./marker.md) | Markers stored once and drawn with one call |
| [Anim](./anim.md) | Play, stop and wait for animations and scenarios |
| [Ace Permission](./ace-permission.md) | Client-side ace checks |
| [Commands](./commands.md) | `MSK.RegisterCommand` with ace support |
| [UI](./ui/input.md) | Input dialog, Numpad, Progressbar and circle, TextUI, Context Menu, Menu, Alert, Radial Menu, Skillcheck, player Settings and Clipboard |

See also the [Shared](../shared/index.md) functions (callbacks, math, string, table, timeout, vector) which work on both sides.
