---
title: World
sidebar_position: 9
---

# World

Client-side world and entity helper functions.

## MSK.IsSpawnPointClear

Checks whether there are no vehicles within `maxDistance` of the given coordinates. If `coords` is omitted, the player's current coordinates are used.

**Parameters**  
**coords** - `vector3` / `table` - Optional - The coordinates to check around. Defaults to the player's current position  
**maxDistance** - `number` - The maximum distance (in meters) to search for nearby vehicles

**Returns**  
**isClear** - `boolean` - `true` if no vehicles were found within `maxDistance`

```lua
MSK.IsSpawnPointClear(coords, maxDistance)

-- Example
if MSK.IsSpawnPointClear(vector3(215.5, -810.2, 30.7), 3.0) then
    -- spawn the vehicle here
end

-- As an Export:
exports.msk_core:IsSpawnPointClear(coords, maxDistance)
```

## MSK.GetPedMugshot

Registers and waits for a ped headshot (mugshot), returning the headshot handle and its texture dictionary string. Throws if the ped does not exist.

**Parameters**  
**ped** - `number` - The ped entity handle  
**transparent** - `boolean` - Optional - If `true`, registers a transparent headshot

**Returns**  
**mugshot** - `number` - The registered headshot handle  
**txdString** - `string` - The texture dictionary string of the headshot

```lua
MSK.GetPedMugshot(ped, transparent)

-- Example
local mugshot, txd = MSK.GetPedMugshot(PlayerPedId(), true)

-- As an Export:
exports.msk_core:GetPedMugshot(ped, transparent)
```

## MSK.GetClosestPlayer

Returns the closest player entity to the given coordinates. This is a convenience wrapper around `MSK.GetClosestEntity` (Entities module).

**Parameters**  
**coords** - `vector3` / `table` - Optional - The coordinates to search around

**Returns**  
**player** - `number` - The closest player entity  
**distance** - `number` - The distance to that player

```lua
MSK.GetClosestPlayer(coords)

-- Example
local player, distance = MSK.GetClosestPlayer()

-- As an Export:
exports.msk_core:GetClosestPlayer(coords)
```

## MSK.GetClosestPlayers

Returns all player entities within `distance` of the given coordinates. This is a convenience wrapper around `MSK.GetClosestEntities` (Entities module).

**Parameters**  
**coords** - `vector3` / `table` - Optional - The coordinates to search around  
**distance** - `number` - The maximum search distance

**Returns**  
**players** - `table` - A list of player entities within range

```lua
MSK.GetClosestPlayers(coords, distance)

-- Example
local players = MSK.GetClosestPlayers(MSK.Player.coords, 10.0)

-- As an Export:
exports.msk_core:GetClosestPlayers(coords, distance)
```
