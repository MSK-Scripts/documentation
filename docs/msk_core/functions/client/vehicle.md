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

## MSK.GetVehicleFromPlate

Returns the vehicle with the given plate, without needing coordinates or a radius. Use `MSK.GetVehicleWithPlate` when the hit has to be within a certain distance of a point.

The search runs on the server. The client asks over the callback API and gets the network id back, which it resolves locally. That way the answer covers every vehicle on the server and not just the ones streamed in nearby, and no client walks its own vehicle pool.

The plate is trimmed and upper cased before it is compared, so `abc123` finds `ABC123  `. Inner spaces are kept, `AB C123` does not match `ABC123`.

:::warning[Blocking]
This is a callback round trip, so it has to be called from inside a thread (`CreateThread`, a command handler, an event handler), like every other callback based function.
:::

**Parameters**  
**plate** - `string` - The number plate to look for

**Returns**  
**vehicle** - `number | boolean` - The local vehicle handle, or `false` when the vehicle is not streamed in for this client  
**netId** - `number | nil` - The network id, present whenever the vehicle exists on the server at all

```lua
local vehicle, netId = MSK.GetVehicleFromPlate(plate)

-- Example
CreateThread(function()
    local vehicle, netId = MSK.GetVehicleFromPlate('ABC123')

    if vehicle then
        print(('Vehicle handle: %s'):format(vehicle))
    elseif netId then
        -- The vehicle exists, but it is too far away to have a local handle
        print(('Found as netId %s, but it is not streamed in here'):format(netId))
    else
        print('No vehicle with that plate')
    end
end)

-- As an Export:
local vehicle, netId = exports.msk_core:GetVehicleFromPlate(plate)
```

## MSK.GetModelFromPlate

Returns the model that is stored for a plate in the framework's vehicle table. Because it reads the database instead of the world, it also answers while the vehicle is parked in a garage and does not exist as an entity at all.

Supported on ESX (`vehicle` column in `owned_vehicles`) and QBCore (`vehicle` and `hash` columns in `player_vehicles`). Every other framework returns `nil`.

:::warning[Blocking]
This is a callback round trip, so it has to be called from inside a thread.
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
        print(('Model: %s (%s)'):format(model, name or MSK.GetVehicleLabelFromModel(model)))
    end
end)

-- As an Export:
local model, name = exports.msk_core:GetModelFromPlate(plate)
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
