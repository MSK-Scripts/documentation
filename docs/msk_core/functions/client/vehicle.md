---
title: Vehicle
sidebar_position: 9
---

# Vehicle

## MSK.GetClosestVehicle

**Parameters**  
**coords** - `vector3` - Coords - Optional, default: `playerCoords`

**Returns**  
**vehicle** - `number` - A vehicle handle  
**distance** - `float` - The Distance to this vehicle

```lua
local vehicle, distance = MSK.GetClosestVehicle(coords)

if DoesEntityExist(vehicle) and distance <= 2.5 then
    -- Do something with this vehicle
end

-- As an Export:
local vehicle, distance = exports.msk_core:GetClosestVehicle(coords)
```

## MSK.GetClosestVehicles

**Parameters**  
**coords** - `vector3` - Player Coords  
**maxDistance** - `float` - Max distance to check for vehicles (Max: 200.0)

```lua
local vehicles = MSK.GetClosestVehicles(GetEntityCoords(PlayerPedId()), 25.0)

-- As an Export:
local vehicles = exports.msk_core:GetClosestVehicles(coords, maxDistance)
```

## MSK.GetVehicleWithPlate

Get a vehicle with a specific number plate near the given coords.

**Parameters**  
**plate** - `string` - The number plate to search for  
**coords** - `vector3` - The coords to search around  
**distance** - `float` - Max distance to check for vehicles

**Returns**  
**vehicle** - `number or false` - A vehicle handle, or `false` if none was found

```lua
local vehicle = MSK.GetVehicleWithPlate(plate, coords, distance)

-- As an Export:
local vehicle = exports.msk_core:GetVehicleWithPlate(plate, coords, distance)
```

## MSK.GetVehicleInDirection

Get the Vehicle in front of the player. Also available as `MSK.GetVehicleInFront`.

**Parameters**  
**distance** - `number` - The raycast distance to check

**Returns**  
**vehicle** - `int` - A vehicle handle  
**coords** - `vector3` - The vehicle coords  
**distance** - `float` - The distance between the vehicle and the player

```lua
local vehicle, coords, distance = MSK.GetVehicleInDirection(distance)

-- Alias
local vehicle, coords, distance = MSK.GetVehicleInFront(distance)

-- As an Export:
local vehicle, coords, distance = exports.msk_core:GetVehicleInDirection(distance)
```

## MSK.IsVehicleEmpty

**Parameters**  
**vehicle** - `int` - A vehicle handle

**Returns**  
**isVehicleEmpty** - `boolean` - Whether the vehicle is empty or not

```lua
local vehicle, coords, distance = MSK.GetVehicleInDirection()
local isVehicleEmpty = MSK.IsVehicleEmpty(vehicle)
print(isVehicleEmpty)

-- As an Export:
local isVehicleEmpty = exports.msk_core:IsVehicleEmpty(vehicle)
```

## MSK.GetVehicleLabel

Get the display label of a vehicle. You can pass either a `vehicle` handle **or** a `model` (at least one is required).

**Parameters**  
**vehicle** - `int` - A vehicle handle - Optional  
**model** - `number/string` - A vehicle model - Optional

**Returns**  
**label** - `string` - Label of the vehicle (`'Unknown'` if it cannot be resolved)

```lua
local label = MSK.GetVehicleLabel(vehicle)

-- As an Export:
local label = exports.msk_core:GetVehicleLabel(vehicle, model)
```

## MSK.GetVehicleLabelFromModel

Get the display label directly from a vehicle model.

**Parameters**  
**model** - `number/string` - A vehicle model

**Returns**  
**label** - `string` - Label of the vehicle

```lua
local label = MSK.GetVehicleLabelFromModel(`adder`)

-- As an Export:
local label = exports.msk_core:GetVehicleLabelFromModel(model)
```

## MSK.CloseVehicleDoors

Closes all open doors of a vehicle.

**Parameters**  
**vehicle** - `int` - A vehicle handle

```lua
MSK.CloseVehicleDoors(vehicle)

-- As an Export:
exports.msk_core:CloseVehicleDoors(vehicle)
```
