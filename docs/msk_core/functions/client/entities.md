---
title: Entities
sidebar_position: 4
---

# Entities

Helper functions to find the closest entities (players or vehicles) around a set of coordinates, plus the built-in player death detection event.

These functions are available on the global `MSK` table (provided through `shared_script '@msk_core/import.lua'`). They are core singletons and are **not** exposed as standalone `exports.msk_core` functions on the client.

## MSK.GetClosestEntity

Returns the closest entity to the given coordinates. When `isPlayerEntity` is `true`, it searches active player peds (excluding your own ped) and returns the **player index**. When `false`, it searches the `CVehicle` game pool and returns the **vehicle entity handle**.

**Parameters**  
**isPlayerEntity** - `boolean` - `true` to search player peds, `false` to search vehicles  
**coords** - `vector3` - Coordinates to measure from. Defaults to the local player's coords (optional)

**Returns**  
**closestEntity** - `number` - The closest player index (player search) or vehicle handle (vehicle search), or `-1` if none found  
**closestDistance** - `number` - Distance to the closest entity, or `-1` if none found

```lua
local entity, distance = MSK.GetClosestEntity(isPlayerEntity, coords)

-- Example: closest vehicle to the player
local vehicle, distance = MSK.GetClosestEntity(false)

-- Example: closest player to given coords
local player, distance = MSK.GetClosestEntity(true, vector3(100.0, 200.0, 30.0))
```

## MSK.GetClosestEntities

Returns a list of all entities within `distance` of the given coordinates. When `isPlayerEntity` is `true`, the list contains player indices; when `false`, it contains vehicle entity handles.

**Parameters**  
**isPlayerEntity** - `boolean` - `true` to search player peds, `false` to search vehicles  
**coords** - `vector3` - Coordinates to measure from. Defaults to the local player's coords (optional)  
**distance** - `number` - Maximum distance to include

**Returns**  
**closestEntities** - `table` - Array of player indices (player search) or vehicle handles (vehicle search)

```lua
local entities = MSK.GetClosestEntities(isPlayerEntity, coords, distance)

-- Example: all vehicles within 10.0 units of the player
local vehicles = MSK.GetClosestEntities(false, nil, 10.0)
```

## Event: msk_core:onPlayerDeath

msk_core runs a single death-detection thread in the core (using the `gameEventTriggered` / `CEventNetworkEntityDamage` game event). When the local player dies, both a client event and a server event named `msk_core:onPlayerDeath` are triggered with a `data` table.

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
