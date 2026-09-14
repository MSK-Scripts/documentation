---
title: Vehicle
sidebar_position: 5
---

# Vehicle

Server-side vehicle helpers built on top of the Entities module. Every function is also available as an `exports.msk_core` export.

## MSK.SpawnVehicle

Creates a networked vehicle on the server with `CreateVehicleServerSetter`. New in v4.1.0.

**Parameters**  
**model** - `string` or `number` - The model name or hash  
**coords** - `vector3`, `vector4` or `table` - Where to spawn the vehicle. A `vector4` or a table with `heading` also sets the heading  
**options** - `table` - Optional - See below  

**`options` fields**  
**heading** - `number` - Optional - Default: `coords.w`, then `coords.heading`, then `0.0` - The heading  
**type** - `string` - Optional - The vehicle type: `automobile`, `bike`, `boat`, `heli`, `plane`, `submarine`, `trailer` or `train`  
**plate** - `string` - Optional - The plate text  
**props** - `table` - Optional - Vehicle properties, applied by the client that owns the vehicle  
**bucket** - `number` - Optional - The routing bucket  
**warp** - `number` - Optional - Server id of a player who is put into the driver seat  
**playerId** - `number` - Optional - The player who is asked for the vehicle type, see below  

**Returns**  
**vehicle** - `number` or `nil` - The vehicle entity handle, `nil` when the vehicle could not be created  
**netId** - `number` or `nil` - The network id of the vehicle  

```lua
local vehicle, netId = MSK.SpawnVehicle(model, coords, options)

-- Example
CreateThread(function()
    local vehicle, netId = MSK.SpawnVehicle('sultan', vector4(215.5, -810.2, 30.7, 90.0), {
        plate = 'MSK 123',
        props = savedProps,
        warp = source,
    })

    if not vehicle then return end
    print('Spawned vehicle with netId', netId)
end)

-- Example: a trailer always needs the type
local trailer = MSK.SpawnVehicle('trailers2', coords, { type = 'trailer' })

-- As an Export:
local vehicle, netId = exports.msk_core:SpawnVehicle(model, coords, options)
```

:::info[Vehicle type]
`CreateVehicleServerSetter` needs the vehicle type, and the server cannot read it from a model. When `type` is not given, one client is asked **once per model** and the answer is remembered until msk_core restarts. The client asked is `playerId`, or any connected player when `playerId` is missing or offline. With nobody online, the vehicle is not created and you have to pass `type`.

A **trailer** cannot be told apart from a normal car by its model and comes back as `automobile`. Always pass `type = 'trailer'` for trailers.
:::

:::warning[Blocking]
The function may wait for a client to answer, waits up to 5 seconds for the entity to exist and, with `warp`, up to 5 more seconds until the player sits in the vehicle. Call it from inside a thread (`CreateThread`, an event handler, a callback).
:::

## MSK.GetClosestVehicle

Returns the closest vehicle to the given coordinates. You may pass a pre-built `vehicles` table to search within.

**Parameters**  
**coords** - `vector3` - Coordinates to measure from  
**vehicles** - `table` - Optional - Default: every vehicle on the server - Pre-built table of vehicles to search within  
**maxDistance** - `number` - Optional - Only vehicles within this distance count  

**Returns**  
**vehicle** - `number` - The closest vehicle handle, or `-1` if none found  
**distance** - `number` - Distance to the closest vehicle, or `-1` if none found  

```lua
local vehicle, distance = MSK.GetClosestVehicle(coords, vehicles, maxDistance)

-- Example
local vehicle, distance = MSK.GetClosestVehicle(vector3(100.0, 200.0, 30.0))

-- Example: only within 5 meters
local vehicle = MSK.GetClosestVehicle(GetEntityCoords(GetPlayerPed(source)), nil, 5.0)

-- As an Export:
local vehicle, distance = exports.msk_core:GetClosestVehicle(coords, vehicles, maxDistance)
```

## MSK.GetClosestVehicles

Returns all vehicles within `distance` of the given coordinates.

**Parameters**  
**coords** - `vector3` - Coordinates to measure from  
**distance** - `number` - Optional - Default: no limit - Maximum distance to include  
**vehicles** - `table` - Optional - Default: every vehicle on the server - Pre-built table of vehicles to search within  

**Returns**  
**vehicles** - `table` - Array of vehicle handles  

```lua
local vehicles = MSK.GetClosestVehicles(coords, distance, vehicles)

-- Example
local vehicles = MSK.GetClosestVehicles(vector3(100.0, 200.0, 30.0), 10.0)

-- As an Export:
local vehicles = exports.msk_core:GetClosestVehicles(coords, distance, vehicles)
```

## MSK.GetClosestVehicleWithPlate

Searches vehicles within `distance` of `coords` and returns the first one whose number plate matches `plate`.

Both plates are trimmed and upper cased before they are compared, so `abc 123` finds `ABC 123 `. Inner spaces are kept.

Without `coords` there is nothing to measure from, so every vehicle on the server is searched, same as [`MSK.GetVehicleFromPlate`](#mskgetvehiclefromplate).

**Parameters**  
**plate** - `string` - The number plate to look for  
**coords** - `vector3` - Optional - Coordinates to measure from. Without them every vehicle is searched  
**distance** - `number` - Optional - Default: no limit - Maximum distance to include  
**vehicles** - `table` - Optional - Default: every vehicle on the server - Pre-built table of vehicles to search within  

**Returns**  
**vehicle** - `number | boolean` - The matching vehicle handle, or `false` if none found  

```lua
local vehicle = MSK.GetClosestVehicleWithPlate(plate, coords, distance, vehicles)

-- Example
local vehicle = MSK.GetClosestVehicleWithPlate('ABC123', vector3(100.0, 200.0, 30.0), 10.0)

-- As an Export:
local vehicle = exports.msk_core:GetClosestVehicleWithPlate(plate, coords, distance, vehicles)
```

## MSK.GetVehicleFromPlate

Searches every vehicle on the server for the given plate, without needing coordinates or a radius. Use `MSK.GetClosestVehicleWithPlate` when the hit has to be within a certain distance of a point.

The plate is trimmed and upper cased before it is compared, so `abc123` finds `ABC123  `. Inner spaces are kept, `AB C123` does not match `ABC123`.

Vehicles whose sync tree has not been populated yet report an empty plate and are skipped, so a vehicle can be missed in the same tick it was created.

**Parameters**  
**plate** - `string` - The number plate to look for

**Returns**  
**vehicle** - `number | boolean` - The matching vehicle handle, or `false` if none found  
**netId** - `number | nil` - The network id of the vehicle

```lua
local vehicle, netId = MSK.GetVehicleFromPlate(plate)

-- Example
local vehicle, netId = MSK.GetVehicleFromPlate('ABC123')

if vehicle then
    DeleteEntity(vehicle)
end

-- As an Export:
local vehicle, netId = exports.msk_core:GetVehicleFromPlate(plate)
```

## MSK.GetModelFromPlate

Returns the model that is stored for a plate in the framework's vehicle table. Because it reads the database instead of the world, it also answers while the vehicle is parked in a garage and does not exist as an entity at all.

Supported on ESX (`vehicle` column in `owned_vehicles`) and on QBCore and Qbox (`vehicle` and `hash` columns in `player_vehicles`). In STANDALONE it returns `nil`.

If the plate is not found with an indexed lookup, a second query compares the trimmed plate, for setups that store their plates space padded.

:::tip
If you need more than the model, use [`MSK.VehicleStore`](./vehicle-store.md). It reads and writes the same table, returns owner, properties, garage, type and job in one shape, and knows where every framework keeps them.
:::

:::warning[Blocking]
This runs a database query with `.await`, so it has to be called from inside a thread (`CreateThread`, an event handler, a callback).
:::

**Parameters**  
**plate** - `string` - The number plate to look for

**Returns**  
**model** - `number | nil` - The model hash as it is stored, or `nil` when nothing was found  
**name** - `string | nil` - The spawn name, only when the framework stores one (QBCore and Qbox)

```lua
local model, name = MSK.GetModelFromPlate(plate)

-- Example
CreateThread(function()
    local model, name = MSK.GetModelFromPlate('ABC123')

    if model then
        local vehicle = MSK.SpawnVehicle(model, coords, { plate = 'ABC123' })
    end
end)

-- As an Export:
local model, name = exports.msk_core:GetModelFromPlate(plate)
```

## MSK.GetPedVehicleSeat

Returns the seat index a ped is sitting in within a vehicle.

**Parameters**  
**ped** - `number` - The ped to check  
**vehicle** - `number` - Optional - Default: the vehicle the ped is in - The vehicle to check  

**Returns**  
**seat** - `number` or `boolean` - The seat index (`-1` = driver), or `false` if the ped is not in the vehicle  

```lua
local seat = MSK.GetPedVehicleSeat(ped, vehicle)

-- Example
local seat = MSK.GetPedVehicleSeat(GetPlayerPed(source))

if seat == -1 then
    print('The player is driving')
elseif seat then
    print('The player sits in seat ' .. seat)
end

-- As an Export:
local seat = exports.msk_core:GetPedVehicleSeat(ped, vehicle)
```

:::warning[Changed in v4.1.0]
Until v4.1.0 the server returned `-1` when the ped was not in the vehicle, which is also the driver seat. It now returns `false`, same as the client. Check with `if seat then` instead of `if seat ~= -1 then`.
:::
