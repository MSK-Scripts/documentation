---
title: Entities
sidebar_position: 4
---

# Entities

Server-side helper functions to find the closest entities (players or vehicles) around a set of coordinates.

These functions are available on the global `MSK` table (provided through `shared_script '@msk_core/import.lua'`). They are core functions and are **not** exposed as standalone `exports.msk_core` functions on the server (the Vehicle module wraps them with its own exports).

## MSK.GetClosestEntity

Returns the closest entity to the given coordinates. When `isPlayerEntity` is a player server id, it searches all player peds and returns the **player id**. When `false`, it searches all vehicles and returns the **vehicle entity handle**. You may pass a pre-built `entities` table to search within.

**Parameters**  
**isPlayerEntity** - `number | boolean` - A player server id to search player peds, or `false` to search vehicles  
**coords** - `vector3` - Coordinates to measure from. Defaults to the coords of `GetPlayerPed(isPlayerEntity)` (optional)  
**entities** - `table` - Pre-built table of entities to search within (optional)

**Returns**  
**closestEntity** - `number` - The closest player id (player search) or vehicle handle (vehicle search), or `-1` if none found  
**closestDistance** - `number` - Distance to the closest entity, or `-1` if none found

```lua
local entity, distance = MSK.GetClosestEntity(isPlayerEntity, coords, entities)

-- Example: closest vehicle to given coords
local vehicle, distance = MSK.GetClosestEntity(false, vector3(100.0, 200.0, 30.0))
```

## MSK.GetClosestEntities

Returns a list of all entities within `distance` of the given coordinates. When `isPlayerEntity` is a player server id, the list contains player ids; when `false`, it contains vehicle entity handles.

**Parameters**  
**isPlayerEntity** - `number | boolean` - A player server id to search player peds, or `false` to search vehicles  
**coords** - `vector3` - Coordinates to measure from. Defaults to the coords of `GetPlayerPed(isPlayerEntity)` (optional)  
**distance** - `number` - Maximum distance to include  
**entities** - `table` - Pre-built table of entities to search within (optional)

**Returns**  
**closestEntities** - `table` - Array of player ids (player search) or vehicle handles (vehicle search)

```lua
local entities = MSK.GetClosestEntities(isPlayerEntity, coords, distance, entities)

-- Example: all vehicles within 10.0 units of given coords
local vehicles = MSK.GetClosestEntities(false, vector3(100.0, 200.0, 30.0), 10.0)
```
