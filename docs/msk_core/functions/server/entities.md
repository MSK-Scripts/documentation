---
title: Entities
sidebar_position: 4
---

# Entities

Server-side helper functions to find the closest players or vehicles around a player or a set of coordinates.

These two functions are **not** exported. From another resource use the wrappers that are: [`MSK.GetClosestPlayer`](./world.md#mskgetclosestplayer), [`MSK.GetClosestPlayers`](./world.md#mskgetclosestplayers), [`MSK.GetClosestVehicle`](./vehicle.md#mskgetclosestvehicle) and [`MSK.GetClosestVehicles`](./vehicle.md#mskgetclosestvehicles).

:::info
`MSK.GetNearbyPeds`, `MSK.GetNearbyObjects`, `MSK.GetNearbyVehicles` and `MSK.GetNearbyPlayers` exist on the **client** only. See the [client Entities docs](../client/entities.md).
:::

## The origin

Both functions take `isPlayerEntity` and `coords`, and together they decide where the search starts:

- **`isPlayerEntity` is a server id**: players are searched. Without `coords` the search starts at that player's ped. The player himself is **never** returned.
- **`isPlayerEntity` is `true`**: players are searched, starting at `coords`. Nobody is left out.
- **`isPlayerEntity` is `false`**: vehicles are searched, starting at `coords`.

On the server there is no local player, so `coords` are required unless a server id is given. Without both, an error is raised.

## MSK.GetClosestEntity

Returns the closest player or vehicle. For a player search the **server id** is returned, for a vehicle search the **vehicle entity handle**.

**Parameters**  
**isPlayerEntity** - `number` or `boolean` - A server id or `true` to search players, `false` to search vehicles  
**coords** - `vector3` - Optional - Where to measure from. Required unless `isPlayerEntity` is a server id  
**entities** - `table` - Optional - Default: every player or every vehicle - A pre-built table to search within  
**maxDistance** - `number` - Optional - Only entities within this distance count  

**Returns**  
**closestEntity** - `number` - The closest server id or vehicle handle, `-1` if none was found  
**closestDistance** - `number` - The distance to it, `-1` if none was found  

```lua
local entity, distance = MSK.GetClosestEntity(isPlayerEntity, coords, entities, maxDistance)

-- Example: closest player to the player who ran a command
local targetId, distance = MSK.GetClosestEntity(source)

-- Example: closest player within 3 meters
local targetId, distance = MSK.GetClosestEntity(source, nil, nil, 3.0)

-- Example: closest vehicle to given coords
local vehicle, distance = MSK.GetClosestEntity(false, vector3(100.0, 200.0, 30.0))
```

## MSK.GetClosestEntities

Returns every player or vehicle within `distance`. The list contains server ids for a player search and vehicle handles for a vehicle search.

**Parameters**  
**isPlayerEntity** - `number` or `boolean` - A server id or `true` to search players, `false` to search vehicles  
**coords** - `vector3` - Optional - Where to measure from. Required unless `isPlayerEntity` is a server id  
**distance** - `number` - Optional - Default: no limit - Maximum distance to include  
**entities** - `table` - Optional - Default: every player or every vehicle - A pre-built table to search within  

**Returns**  
**closestEntities** - `table` - List of server ids or vehicle handles  

```lua
local entities = MSK.GetClosestEntities(isPlayerEntity, coords, distance, entities)

-- Example: all players within 10 meters of the player, without the player himself
local players = MSK.GetClosestEntities(source, nil, 10.0)

-- Example: all vehicles within 10 meters of given coords
local vehicles = MSK.GetClosestEntities(false, vector3(100.0, 200.0, 30.0), 10.0)
```
