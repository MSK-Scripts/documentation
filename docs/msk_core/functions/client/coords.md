---
title: Coords
sidebar_position: 6
---

# Coords

Client-side helpers to show, hide and copy the local player's coordinates. The functions live under the `MSK.Coords` namespace and each one has a matching `exports.msk_core` export. The module also registers the `coords` and `copyCoords` chat commands (configured via `Config.showCoords` / `Config.copyCoords`).

## MSK.Coords.Show

Toggles the on-screen display of the local player's current coordinates (X, Y, Z, heading). Calling it again while active hides the display.

```lua
MSK.Coords.Show()

-- As an Export:
exports.msk_core:ShowCoords()
```

## MSK.Coords.Active

Returns whether the coordinate display is currently active. Also reachable through the backwards-compatibility alias `MSK.DoesShowCoords` (which maps to `Coords.Active`).

**Returns**  
**coordsActive** - `boolean` - Whether the coordinate display is active

```lua
local coordsActive = MSK.Coords.Active()

-- Example (alias)
local coordsActive = MSK.DoesShowCoords()

-- As an Export:
local coordsActive = exports.msk_core:CoordsActive()
```

## MSK.Coords.Hide

Hides the coordinate display.

```lua
MSK.Coords.Hide()

-- As an Export:
exports.msk_core:HideCoords()
```

## MSK.Coords.Copy

Copies coordinates to the clipboard (via NUI). When no coords are passed, the local player's current coords are used.

**Parameters**  
**coords** - `vector3 | vector4 | table` - Coordinates to copy. Defaults to the local player's coords (optional)

```lua
MSK.Coords.Copy(coords)

-- Example
MSK.Coords.Copy()

-- As an Export:
exports.msk_core:CopyCoords(coords)
```

## Commands

The Coords module registers two chat commands on the server side, both restricted to the configured ACE groups. Triggering them shows / copies coords on the calling player's client.

**coords** - Toggles the coordinate display. Enabled via `Config.showCoords.enable`, named via `Config.showCoords.command`, restricted to `Config.showCoords.groups` (default `{'superadmin', 'admin'}`). Optional `playerId` argument targets another player.  
**copyCoords** - Copies coords to the clipboard. Enabled via `Config.copyCoords.enable`, named via `Config.copyCoords.command`, restricted to `Config.copyCoords.groups` (default `{'superadmin', 'admin'}`). Optional `playerId` argument copies a target player's coords.

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
