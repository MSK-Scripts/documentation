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
