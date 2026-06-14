---
title: Player
sidebar_position: 2
---

# Player

The client `MSK.Player` table is a live mirror of the local player. In the `msk_core` runtime a single core thread refreshes the standard keys roughly every 100ms and replicates changes to the server (and other resources) via the `msk_core:onPlayer` event. Consumer resources that import the library through `shared_script '@msk_core/import.lua'` receive a read-only view backed by the same data, so reading `MSK.Player.coords` always returns up-to-date values.

## MSK.Player

The mirrored player table for the local player. Properties are resolved lazily: computed keys like `coords`, `heading` and `state` are evaluated on access, while the thread-updated keys (`ped`, `vehicle`, `seat`, `weapon`, `isDead`, …) reflect the last refresh.

**Properties**  
**clientId** - `number` - Player Index — equal to `PlayerId()`  
**serverId** - `number` - Player Server Id — equal to `GetPlayerServerId(PlayerId())`  
**playerId** - `number` - Alias of `serverId`  
**ped** - `number` - Player Ped — equal to `PlayerPedId()`  
**playerPed** - `number` - Alias of `ped`  
**coords** - `vector3` - Player Coords — equal to `GetEntityCoords(ped)`  
**heading** - `float` - Player Heading — equal to `GetEntityHeading(ped)`  
**state** - `table` - The player's state bag — equal to `Player(serverId).state`  
**vehicle** - `number` \| `false` - The vehicle handle the player is in, or `false`  
**seat** - `number` \| `false` - Seat index the player is in, or `false`  
**weapon** - `number` \| `false` - Hash of the player's current weapon, or `false`  
**isDead** - `boolean` - Whether the player is dead (also detects `visn_are` / `osp_ambulance` downed states when those resources are running)  
**Notify** - `function` - Shorthand for `MSK.Notification(title, message, type, duration)`

```lua
local clientId = MSK.Player.clientId
local serverId = MSK.Player.serverId
local playerPed = MSK.Player.ped

local playerCoords = MSK.Player.coords
local playerHeading = MSK.Player.heading

local vehicle = MSK.Player.vehicle
local seat = MSK.Player.seat

local currentWeapon = MSK.Player.weapon
local isDead = MSK.Player.isDead

-- Notification
MSK.Player.Notify(title, message, type, duration)
```

## MSK.Player.Get

Gets the value of a key from another player. This is a callback to the server which returns the requested key from the mirrored `MSK.Player[playerId]` table held by the core.

**Parameters**  
**playerId** - `number` - The server id of the target player  
**key** - `string` - The key you want the value of (optional — omit to get the whole player table)

**Returns**  
**value** - `any` - The value of the key, or the full player table if no key was passed (`false` if the player does not exist)

```lua
local value = MSK.Player.Get(playerId, key)

-- Example
local coords = MSK.Player.Get(playerId, 'coords')

-- As an Export:
local value = exports.msk_core:Trigger('msk_core:player', playerId, key)
```

## Set your own values

`MSK.Player` can be called as a function to store custom keys on the local player. Passing `replicated = true` propagates the key to the core (and from there to the server mirror) so other resources and the server can read it.

**Parameters**  
**key** - `string` - The key you want to set  
**value** - `any` - The value to set for the key  
**replicated** - `boolean` - Whether the value should be replicated (optional)

```lua
MSK.Player(key, value, replicated)

-- Example: only available in the resource that set it
MSK.Player('test', 'this is a test')

-- Example: replicated to the core / server
MSK.Player('test', 'this is a test', true)

-- Read it back
print(MSK.Player.test) -- 'this is a test'
```

## Event Handler

The core fires `msk_core:onPlayer` locally whenever a mirrored key changes.

**Returns**  
**key** - `string` - The key that changed  
**value** - `any` - The new value of the changed key  
**oldValue** - `any` - The previous value of the changed key

```lua
AddEventHandler('msk_core:onPlayer', function(key, value, oldValue)
    print(key, value, oldValue)
end)
```
