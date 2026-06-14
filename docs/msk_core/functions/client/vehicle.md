---
title: Vehicle
sidebar_position: 5
---

# Vehicle

Client-side vehicle helpers built on top of the Entities module. Every function is also available as an `exports.msk_core` export. The module also runs the core enter/exit detection thread that fires vehicle events.

## MSK.GetClosestVehicle

Returns the closest vehicle to the given coordinates.

**Parameters**  
**coords** - `vector3` - Coordinates to measure from. Defaults to the local player's coords (optional)

**Returns**  
**vehicle** - `number` - The closest vehicle handle, or `-1` if none found  
**distance** - `number` - Distance to the closest vehicle

```lua
local vehicle, distance = MSK.GetClosestVehicle(coords)

-- Example
local vehicle, distance = MSK.GetClosestVehicle()

-- As an Export:
local vehicle, distance = exports.msk_core:GetClosestVehicle(coords)
```

## MSK.GetClosestVehicles

Returns all vehicles within `distance` of the given coordinates.

**Parameters**  
**coords** - `vector3` - Coordinates to measure from. Defaults to the local player's coords (optional)  
**distance** - `number` - Maximum distance to include

**Returns**  
**vehicles** - `table` - Array of vehicle handles

```lua
local vehicles = MSK.GetClosestVehicles(coords, distance)

-- Example
local vehicles = MSK.GetClosestVehicles(nil, 10.0)

-- As an Export:
local vehicles = exports.msk_core:GetClosestVehicles(coords, distance)
```

## MSK.GetVehicleWithPlate

Searches vehicles within `distance` of `coords` and returns the one whose number plate matches `plate`.

**Parameters**  
**plate** - `string` - The number plate to look for (trimmed before comparison)  
**coords** - `vector3` - Coordinates to measure from  
**distance** - `number` - Maximum distance to include

**Returns**  
**vehicle** - `number | boolean` - The matching vehicle handle, or `false` if none found

```lua
local vehicle = MSK.GetVehicleWithPlate(plate, coords, distance)

-- Example
local vehicle = MSK.GetVehicleWithPlate('ABC123', MSK.Player.coords, 10.0)

-- As an Export:
local vehicle = exports.msk_core:GetVehicleWithPlate(plate, coords, distance)
```

## MSK.GetVehicleInDirection

Performs a raycast in front of the player and returns the vehicle that was hit. Also available under the alias `MSK.GetVehicleInFront` (and the `GetVehicleInFront` export).

**Parameters**  
**distance** - `number` - Raycast distance. Defaults to `5.0` (optional)

**Returns**  
**entity** - `number | boolean` - The vehicle handle that was hit, or `false`/`0` if nothing was hit  
**entityCoords** - `vector3` - Coordinates of the hit entity (only when an entity was hit)  
**distance** - `string` - Distance to the hit entity formatted to 2 decimals (only when an entity was hit)

```lua
local vehicle, coords, distance = MSK.GetVehicleInDirection(distance)

-- Example
local vehicle = MSK.GetVehicleInDirection(8.0)

-- As an Export:
local vehicle, coords, distance = exports.msk_core:GetVehicleInDirection(distance)
```

## MSK.GetPedVehicleSeat

Returns the seat index a ped is sitting in within a vehicle.

**Parameters**  
**playerPed** - `number` - The ped to check. Defaults to the local player's ped (optional)  
**vehicle** - `number` - The vehicle to check. Defaults to the player's current vehicle (optional)

**Returns**  
**seat** - `number | boolean` - The seat index (`-1` = driver), or `false` if the ped is not in the vehicle / the vehicle does not exist

```lua
local seat = MSK.GetPedVehicleSeat(playerPed, vehicle)

-- Example
local seat = MSK.GetPedVehicleSeat()

-- As an Export:
local seat = exports.msk_core:GetPedVehicleSeat(playerPed, vehicle)
```

## MSK.IsVehicleEmpty

Checks whether a vehicle is empty (no passengers and a free driver seat).

**Parameters**  
**vehicle** - `number` - The vehicle to check (must exist)

**Returns**  
**isEmpty** - `boolean` - Whether the vehicle is empty

```lua
local isEmpty = MSK.IsVehicleEmpty(vehicle)

-- Example
if MSK.IsVehicleEmpty(vehicle) then print('empty') end

-- As an Export:
local isEmpty = exports.msk_core:IsVehicleEmpty(vehicle)
```

## MSK.GetVehicleLabel

Returns the display label of a vehicle. You can pass either a vehicle handle or a model. Returns `'Unknown'` when no label can be resolved.

**Parameters**  
**vehicle** - `number` - The vehicle handle (optional if `model` is given)  
**model** - `number | string` - The vehicle model (optional if `vehicle` is given)

**Returns**  
**label** - `string` - The vehicle's display label, or `'Unknown'`

```lua
local label = MSK.GetVehicleLabel(vehicle, model)

-- Example
local label = MSK.GetVehicleLabel(vehicle)

-- As an Export:
local label = exports.msk_core:GetVehicleLabel(vehicle, model)
```

## MSK.GetVehicleLabelFromModel

Convenience wrapper around `MSK.GetVehicleLabel` that resolves the label from a model only.

**Parameters**  
**model** - `number | string` - The vehicle model

**Returns**  
**label** - `string` - The vehicle's display label, or `'Unknown'`

```lua
local label = MSK.GetVehicleLabelFromModel(model)

-- Example
local label = MSK.GetVehicleLabelFromModel('adder')

-- As an Export:
local label = exports.msk_core:GetVehicleLabelFromModel(model)
```

## MSK.CloseVehicleDoors

Shuts all open doors of a vehicle.

**Parameters**  
**vehicle** - `number` - The vehicle handle (must exist)

```lua
MSK.CloseVehicleDoors(vehicle)

-- Example
MSK.CloseVehicleDoors(MSK.Player.vehicle)

-- As an Export:
exports.msk_core:CloseVehicleDoors(vehicle)
```

## Vehicle Events

The Vehicle module runs a single enter/exit detection thread in the core and triggers the following events on both the client and the server.

**msk_core:enteringVehicle** - Fired when the player starts entering a vehicle. Client args: `vehicle, plate, seat, netId, isEngineOn, isDamaged`. Server args: `plate, seat, netId, isEngineOn, isDamaged`.  
**msk_core:enteringVehicleAborted** - Fired when the player aborts entering a vehicle.  
**msk_core:enteredVehicle** - Fired when the player has entered a vehicle. Same args as `enteringVehicle`.  
**msk_core:exitedVehicle** - Fired when the player has left a vehicle. Same args as `enteredVehicle`.

```lua
AddEventHandler('msk_core:enteredVehicle', function(vehicle, plate, seat, netId, isEngineOn, isDamaged)
    print(('Entered %s (seat %s)'):format(plate, seat))
end)
```
