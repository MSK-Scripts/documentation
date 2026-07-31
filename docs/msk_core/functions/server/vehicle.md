---
title: Vehicle
sidebar_position: 5
---

# Vehicle

Server-side vehicle helpers built on top of the Entities module. Every function is also available as an `exports.msk_core` export.

## MSK.GetClosestVehicle

Returns the closest vehicle to the given coordinates. You may pass a pre-built `vehicles` table to search within.

**Parameters**  
**coords** - `vector3` - Coordinates to measure from  
**vehicles** - `table` - Pre-built table of vehicles to search within (optional)

**Returns**  
**vehicle** - `number` - The closest vehicle handle, or `-1` if none found  
**distance** - `number` - Distance to the closest vehicle

```lua
local vehicle, distance = MSK.GetClosestVehicle(coords, vehicles)

-- Example
local vehicle, distance = MSK.GetClosestVehicle(vector3(100.0, 200.0, 30.0))

-- As an Export:
local vehicle, distance = exports.msk_core:GetClosestVehicle(coords, vehicles)
```

## MSK.GetClosestVehicles

Returns all vehicles within `distance` of the given coordinates.

**Parameters**  
**coords** - `vector3` - Coordinates to measure from  
**distance** - `number` - Maximum distance to include  
**vehicles** - `table` - Pre-built table of vehicles to search within (optional)

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

Searches vehicles within `distance` of `coords` and returns the one whose number plate matches `plate`.

**Parameters**  
**plate** - `string` - The number plate to look for (trimmed before comparison)  
**coords** - `vector3` - Coordinates to measure from  
**distance** - `number` - Maximum distance to include  
**vehicles** - `table` - Pre-built table of vehicles to search within (optional)

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

Supported on ESX (`vehicle` column in `owned_vehicles`) and QBCore (`vehicle` and `hash` columns in `player_vehicles`). Every other framework returns `nil`.

If the plate is not found with an indexed lookup, a second query compares the trimmed plate, for setups that store their plates space padded.

:::warning[Blocking]
This runs a database query with `.await`, so it has to be called from inside a thread (`CreateThread`, an event handler, a callback).
:::

**Parameters**  
**plate** - `string` - The number plate to look for

**Returns**  
**model** - `number | nil` - The model hash as it is stored, or `nil` when nothing was found  
**name** - `string | nil` - The spawn name, only when the framework stores one (QBCore)

```lua
local model, name = MSK.GetModelFromPlate(plate)

-- Example
CreateThread(function()
    local model, name = MSK.GetModelFromPlate('ABC123')

    if model then
        local vehicle = CreateVehicle(model, coords, heading, true, true)
        SetVehicleNumberPlateText(vehicle, 'ABC123')
    end
end)

-- As an Export:
local model, name = exports.msk_core:GetModelFromPlate(plate)
```

## MSK.GetPedVehicleSeat

Returns the seat index a ped is sitting in within a vehicle.

**Parameters**  
**ped** - `number` - The ped to check  
**vehicle** - `number` - The vehicle to check. Defaults to the vehicle the ped is in (optional)

**Returns**  
**seat** - `number` - The seat index (`-1` = driver), or `-1` if the ped is not in the vehicle

```lua
local seat = MSK.GetPedVehicleSeat(ped, vehicle)

-- Example
local seat = MSK.GetPedVehicleSeat(GetPlayerPed(source))

-- As an Export:
local seat = exports.msk_core:GetPedVehicleSeat(ped, vehicle)
```
