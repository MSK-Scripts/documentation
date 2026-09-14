---
title: Entities
sidebar_position: 4
---

# Entities

Helper functions to find entities around a set of coordinates, plus the built-in player death detection event.

There are two families. `MSK.GetClosestEntity` and `MSK.GetClosestEntities` search players or vehicles and are available on the `MSK` table only, without an export. The `MSK.GetNearby*` functions and `MSK.GetClosestPed` / `MSK.GetClosestObject` search the game pools for peds, objects, vehicles and players, return the results sorted from near to far and also have an `exports.msk_core` export.

Wherever `coords` is optional, it accepts a `vector3` or a table with `x`, `y` and `z`, and defaults to the local player's position.

## MSK.GetClosestEntity

Returns the closest entity to the given coordinates. When `isPlayerEntity` is `true`, it searches active player peds (excluding your own ped) and returns the **player index**. When `false`, it searches the `CVehicle` game pool and returns the **vehicle entity handle**.

**Parameters**  
**isPlayerEntity** - `boolean` - `true` to search player peds, `false` to search vehicles  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**maxDistance** - `number` - Optional - Only entities within this range count. Without it, every entity counts no matter how far away

**Returns**  
**closestEntity** - `number` - The closest player index or vehicle handle, or `-1` if none was found  
**closestDistance** - `number` - Distance to the closest entity, or `-1` if none was found

```lua
local entity, distance = MSK.GetClosestEntity(isPlayerEntity, coords, maxDistance)

-- Example: closest vehicle to the player
local vehicle, distance = MSK.GetClosestEntity(false)

-- Example: closest player within 5 units of given coords
local player, distance = MSK.GetClosestEntity(true, vector3(100.0, 200.0, 30.0), 5.0)

if player ~= -1 then
    print('found player', GetPlayerServerId(player), distance)
end
```

## MSK.GetClosestEntities

Returns a list of all entities within `distance` of the given coordinates. When `isPlayerEntity` is `true`, the list contains player indices, when `false` it contains vehicle entity handles. The list is not sorted.

**Parameters**  
**isPlayerEntity** - `boolean` - `true` to search player peds, `false` to search vehicles  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**distance** - `number` - Optional - Maximum distance to include. Without it, every entity is included

**Returns**  
**closestEntities** - `table` - Array of player indices (player search) or vehicle handles (vehicle search)

```lua
local entities = MSK.GetClosestEntities(isPlayerEntity, coords, distance)

-- Example: all vehicles within 10.0 units of the player
local vehicles = MSK.GetClosestEntities(false, nil, 10.0)
```

## MSK.GetNearbyPeds

Returns all peds within `maxDistance`, nearest first. Your own ped is always left out, other player peds are left out unless `includePlayers` is `true`.

**Parameters**  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**maxDistance** - `number` - Optional - Default: `2.0` - The search radius  
**includePlayers** - `boolean` - Optional - Default: `false` - Also include the peds of other players

**Returns**  
**peds** - `table[]` - A sorted list of `{ entity = number, coords = vector3, distance = number }`

```lua
local peds = MSK.GetNearbyPeds(coords, maxDistance, includePlayers)

-- Example
for _, entry in ipairs(MSK.GetNearbyPeds(nil, 10.0)) do
    print(entry.entity, entry.distance)
end

-- As an Export:
local peds = exports.msk_core:GetNearbyPeds(coords, maxDistance, includePlayers)
```

## MSK.GetNearbyObjects

Returns all objects within `maxDistance`, nearest first.

**Parameters**  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**maxDistance** - `number` - Optional - Default: `2.0` - The search radius

**Returns**  
**objects** - `table[]` - A sorted list of `{ entity = number, coords = vector3, distance = number }`

```lua
local objects = MSK.GetNearbyObjects(coords, maxDistance)

-- Example
local objects = MSK.GetNearbyObjects(nil, 5.0)

for _, entry in ipairs(objects) do
    if GetEntityModel(entry.entity) == `prop_atm_01` then
        print('ATM nearby')
    end
end

-- As an Export:
local objects = exports.msk_core:GetNearbyObjects(coords, maxDistance)
```

## MSK.GetNearbyVehicles

Returns all vehicles within `maxDistance`, nearest first. The vehicle you sit in is left out unless `includeOwn` is `true`.

**Parameters**  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**maxDistance** - `number` - Optional - Default: `2.0` - The search radius  
**includeOwn** - `boolean` - Optional - Default: `false` - Also include the vehicle you are sitting in

**Returns**  
**vehicles** - `table[]` - A sorted list of `{ entity = number, coords = vector3, distance = number }`

```lua
local vehicles = MSK.GetNearbyVehicles(coords, maxDistance, includeOwn)

-- Example
local vehicles = MSK.GetNearbyVehicles(nil, 15.0)

-- As an Export:
local vehicles = exports.msk_core:GetNearbyVehicles(coords, maxDistance, includeOwn)
```

## MSK.GetNearbyPlayers

Returns all other players within `maxDistance`, nearest first. Your own player is left out unless `includeSelf` is `true`.

**Parameters**  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**maxDistance** - `number` - Optional - Default: `2.0` - The search radius  
**includeSelf** - `boolean` - Optional - Default: `false` - Also include your own player

**Returns**  
**players** - `table[]` - A sorted list of `{ playerId = number, serverId = number, ped = number, coords = vector3, distance = number }`. `playerId` is the player index, `serverId` the server id

```lua
local players = MSK.GetNearbyPlayers(coords, maxDistance, includeSelf)

-- Example
for _, player in ipairs(MSK.GetNearbyPlayers(nil, 3.0)) do
    print(player.serverId, player.distance)
end

-- As an Export:
local players = exports.msk_core:GetNearbyPlayers(coords, maxDistance, includeSelf)
```

## MSK.GetClosestPed

Returns the nearest ped within `maxDistance` and its coordinates. Uses the same rules as `MSK.GetNearbyPeds`.

**Parameters**  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**maxDistance** - `number` - Optional - Default: `2.0` - The search radius  
**includePlayers** - `boolean` - Optional - Default: `false` - Also include the peds of other players

**Returns**  
**ped** - `number | nil` - The nearest ped, or `nil` if none was found  
**coords** - `vector3 | nil` - The coordinates of that ped

```lua
local ped, pedCoords = MSK.GetClosestPed(coords, maxDistance, includePlayers)

-- Example
local ped = MSK.GetClosestPed(nil, 3.0)
if ped then
    TaskTurnPedToFaceEntity(ped, MSK.Player.ped, 2000)
end

-- As an Export:
local ped, pedCoords = exports.msk_core:GetClosestPed(coords, maxDistance, includePlayers)
```

:::note
Unlike `MSK.GetClosestEntity`, which returns `-1, -1` when nothing is found, `MSK.GetClosestPed` and `MSK.GetClosestObject` return `nil`.
:::

## MSK.GetClosestObject

Returns the nearest object within `maxDistance` and its coordinates.

**Parameters**  
**coords** - `vector3` - Optional - Default: the player's coords - Coordinates to measure from  
**maxDistance** - `number` - Optional - Default: `2.0` - The search radius

**Returns**  
**object** - `number | nil` - The nearest object, or `nil` if none was found  
**coords** - `vector3 | nil` - The coordinates of that object

```lua
local object, objectCoords = MSK.GetClosestObject(coords, maxDistance)

-- Example
local object = MSK.GetClosestObject(nil, 2.5)

-- As an Export:
local object, objectCoords = exports.msk_core:GetClosestObject(coords, maxDistance)
```

## Event: msk_core:onPlayerDeath

msk_core runs a single death detection handler in the core (using the `gameEventTriggered` / `CEventNetworkEntityDamage` game event). When the local player dies, both a client event and a server event named `msk_core:onPlayerDeath` are triggered with a `data` table.

The `data` table contains:

**killedByPlayer** - `boolean` - Whether the player was killed by another player  
**victim** - `number` - The victim ped handle  
**victimCoords** - `vector3` - Coordinates of the victim  
**victimServerId** - `number` - Server id of the victim  
**killer** - `number` - The killer ped handle (only if `killedByPlayer`)  
**killerCoords** - `vector3` - Coordinates of the killer (only if `killedByPlayer`)  
**killerServerId** - `number` - Server id of the killer (only if `killedByPlayer`)  
**distance** - `number` - Distance between victim and killer, rounded to 2 decimals (only if `killedByPlayer`)

```lua
AddEventHandler('msk_core:onPlayerDeath', function(data)
    if data.killedByPlayer then
        print(('Killed by %s at %s units'):format(data.killerServerId, data.distance))
    else
        print('Player died')
    end
end)
```
