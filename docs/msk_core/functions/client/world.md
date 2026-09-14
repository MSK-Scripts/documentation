---
title: World
sidebar_position: 9
---

# World

Client-side world and entity helper functions.

## MSK.IsSpawnPointClear

Checks whether there are no vehicles within `maxDistance` of the given coordinates. If `coords` is omitted, the player's current coordinates are used.

**Parameters**  
**coords** - `vector3` / `table` - Optional - Default: the player's position - The coordinates to check around  
**maxDistance** - `number` - Optional - Default: `5.0` - The radius in meters to search for vehicles, the same default as on the server

**Returns**  
**isClear** - `boolean` - `true` if no vehicles were found within `maxDistance`

```lua
local isClear = MSK.IsSpawnPointClear(coords, maxDistance)

-- Example
if MSK.IsSpawnPointClear(vector3(215.5, -810.2, 30.7), 3.0) then
    -- spawn the vehicle here
end

-- As an Export:
local isClear = exports.msk_core:IsSpawnPointClear(coords, maxDistance)
```

## MSK.GetPedMugshot

Registers a ped headshot (mugshot) and waits until it is ready, then returns the headshot handle and its texture dictionary string. Raises an error if the ped does not exist.

The wait is limited. If the headshot does not get ready in time (for example because too many headshots are registered, or the ped is deleted in the meantime), the headshot is unregistered again, an error is logged and the function returns `nil`.

**Parameters**  
**ped** - `number` - The ped entity handle  
**transparent** - `boolean` - Optional - Default: `false` - Registers a transparent headshot  
**timeout** - `number` - Optional - Default: `5000` - How long to wait for the headshot in milliseconds

**Returns**  
**mugshot** - `number | nil` - The registered headshot handle, or `nil` when it did not get ready  
**txdString** - `string | nil` - The texture dictionary string of the headshot

```lua
local mugshot, txd = MSK.GetPedMugshot(ped, transparent, timeout)

-- Example
local mugshot, txd = MSK.GetPedMugshot(MSK.Player.ped, true)

if mugshot then
    -- use txd, e.g. as the icon of an advanced notification
    UnregisterPedheadshot(mugshot)
end

-- As an Export:
local mugshot, txd = exports.msk_core:GetPedMugshot(ped, transparent, timeout)
```

## MSK.GetClosestPlayer

Returns the closest other player to the given coordinates. This is a wrapper around [`MSK.GetClosestEntity`](./entities.md#mskgetclosestentity) with `isPlayerEntity = true`.

**Parameters**  
**coords** - `vector3` / `table` - Optional - Default: the player's position - The coordinates to search around  
**maxDistance** - `number` - Optional - Only players within this range count

**Returns**  
**player** - `number` - The player index of the closest player, or `-1` if none was found  
**distance** - `number` - The distance to that player, or `-1` if none was found

```lua
local player, distance = MSK.GetClosestPlayer(coords, maxDistance)

-- Example
local player, distance = MSK.GetClosestPlayer(nil, 3.0)

if player ~= -1 then
    TriggerServerEvent('my_script:givePhoneNumber', GetPlayerServerId(player))
end

-- As an Export:
local player, distance = exports.msk_core:GetClosestPlayer(coords, maxDistance)
```

## MSK.GetClosestPlayers

Returns all other players within `distance` of the given coordinates. This is a wrapper around [`MSK.GetClosestEntities`](./entities.md#mskgetclosestentities).

**Parameters**  
**coords** - `vector3` / `table` - Optional - Default: the player's position - The coordinates to search around  
**distance** - `number` - Optional - The maximum search distance. Without it, every player is included

**Returns**  
**players** - `table` - A list of player indices within range

```lua
local players = MSK.GetClosestPlayers(coords, distance)

-- Example
local players = MSK.GetClosestPlayers(MSK.Player.coords, 10.0)

-- As an Export:
local players = exports.msk_core:GetClosestPlayers(coords, distance)
```
