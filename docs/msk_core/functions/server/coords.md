---
title: Coords
sidebar_position: 6
---

# Coords

Server-side helpers to remotely show, hide and copy a player's coordinates. The functions live under the `MSK.Coords` namespace and each one has a matching `exports.msk_core` export. The module also registers the `coords` and `copyCoords` chat commands (configured via `Config.showCoords` / `Config.copyCoords`).

All functions take a player server id and return early when `playerId` is missing or `0`.

## MSK.Coords.Show

Triggers the coordinate display on the target player's client.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Coords.Show(playerId)

-- Example
MSK.Coords.Show(source)

-- As an Export:
exports.msk_core:ShowCoords(playerId)
```

## MSK.Coords.Active

Returns whether the coordinate display is currently active on the target player's client. Also reachable through the backwards-compatibility alias `MSK.DoesShowCoords` (which maps to `Coords.Active`).

**Parameters**  
**playerId** - `number` - The target player's server id

**Returns**  
**coordsActive** - `boolean` - Whether the coordinate display is active on that client

```lua
local coordsActive = MSK.Coords.Active(playerId)

-- Example (alias)
local coordsActive = MSK.DoesShowCoords(source)

-- As an Export:
local coordsActive = exports.msk_core:DoesShowCoords(playerId)
```

## MSK.Coords.Hide

Hides the coordinate display on the target player's client.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Coords.Hide(playerId)

-- Example
MSK.Coords.Hide(source)

-- As an Export:
exports.msk_core:HideCoords(playerId)
```

## MSK.Coords.Copy

Copies coordinates to the target player's clipboard. By default the target player's own coords are used; pass `targetId` to copy another player's coords instead.

**Parameters**  
**playerId** - `number` - The player whose clipboard the coords are copied to  
**targetId** - `number` - The player whose coords are copied (optional, defaults to `playerId`)

```lua
MSK.Coords.Copy(playerId, targetId)

-- Example
MSK.Coords.Copy(source)

-- As an Export:
exports.msk_core:CopyCoords(playerId, targetId)
```

## Commands

The Coords module registers two chat commands, both restricted to the configured ACE groups.

**coords** - Toggles the coordinate display for the caller (or an optional `playerId`). Enabled via `Config.showCoords.enable`, named via `Config.showCoords.command`, restricted to `Config.showCoords.groups` (default `{'superadmin', 'admin'}`).  
**copyCoords** - Copies coords to the caller's clipboard (optionally a target `playerId`'s coords). Enabled via `Config.copyCoords.enable`, named via `Config.copyCoords.command`, restricted to `Config.copyCoords.groups` (default `{'superadmin', 'admin'}`).

```lua
-- config.lua
Config.showCoords = {
    enable = true,
    command = 'coords',
    groups = {'superadmin', 'admin'}
}

Config.copyCoords = {
    enable = true,
    command = 'copyCoords',
    groups = {'superadmin', 'admin'}
}
```
