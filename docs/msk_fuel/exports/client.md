---
title: Client
sidebar_position: 1
---

# Client Exports

## GetVehicleFuel

**Parameters**  
**vehicle** - `number` - A vehicle handle

**Returns**  
**fuelLevel** - `number` - Vehicles fuel level

```lua
local fuelLevel = exports.msk_fuel:GetVehicleFuel(vehicle)

-- You can also use
local fuelLevel = Entity(vehicle).state.fuel
```

## SetVehicleFuel

**Parameters**  
**vehicle** - `number` - A vehicle handle  
**fuelLevel** - `number` - Vehicles new fuel level

```lua
exports.msk_fuel:SetVehicleFuel(vehicle, fuelLevel)

-- You can also use
Entity(vehicle).state.fuel = fuelLevel
```

## GetVehicleFuelType

**Parameters**  
**vehicle** - `number` - A vehicle handle

**Returns**  
**fuelType** - `string` - Vehicles fuel type

```lua
local fuelType = exports.msk_fuel:GetVehicleFuelType(vehicle)

-- You can also use
local fuelType = Entity(vehicle).state.fuelType
```

## SetVehicleFuelType

Sets the fuel type of the vehicle. If `fuelType` is omitted, it is calculated automatically from `Config.Vehicles`.

**Parameters**  
**vehicle** - `number` - A vehicle handle  
**fuelType** - `string?` - `'gas'`, `'diesel'`, `'kerosin'` or `'electric'` (optional)

```lua
exports.msk_fuel:SetVehicleFuelType(vehicle, 'diesel')
```

## IsVehicleGas / IsVehicleDiesel / IsVehicleKerosin / IsVehicleElectric

Returns whether the vehicle uses the given fuel type (based on its cached state or `Config.Vehicles`).

**Parameters**  
**vehicle** - `number` - A vehicle handle

**Returns**  
**result** - `boolean`

```lua
local isGas = exports.msk_fuel:IsVehicleGas(vehicle)
local isDiesel = exports.msk_fuel:IsVehicleDiesel(vehicle)
local isKerosin = exports.msk_fuel:IsVehicleKerosin(vehicle)
local isElectric = exports.msk_fuel:IsVehicleElectric(vehicle)
```

## GetVehicleMaxFuel

**Parameters**  
**vehicle** - `number` - A vehicle handle

**Returns**  
**maxFuel** - `number` - Vehicles max fuel level

```lua
local maxFuel = exports.msk_fuel:GetVehicleMaxFuel(vehicle)

-- You can also use
local maxFuel = Entity(vehicle).state.maxFuel
```

## SetVehicleMaxFuel

**Parameters**  
**vehicle** - `number` - A vehicle handle  
**maxFuel** - `number` - Vehicles new max fuel level

```lua
exports.msk_fuel:SetVehicleMaxFuel(vehicle, maxFuel)

-- You can also use
Entity(vehicle).state.maxFuel = maxFuel
```

## SetEngineFailure

Triggers a progressive engine failure on the vehicle (used internally when too much wrong fuel was added).

**Parameters**  
**vehicle** - `number` - A vehicle handle

```lua
exports.msk_fuel:SetEngineFailure(vehicle)
```

## SetEngineRepaired

Repairs the Engine if the player refueled with the wrong fuel type.

**Parameters**  
**vehicle** - `number` - A vehicle handle

```lua
exports.msk_fuel:SetEngineRepaired(vehicle)
```

## IsFuelTypeAtFuelStation

Returns whether the given fuel station entity (pump/prop) offers the given fuel type.

**Parameters**  
**entity** - `number` - A fuel station entity handle  
**fuelType** - `string` - `'gas'`, `'diesel'`, `'kerosin'` or `'electric'`

**Returns**  
**result** - `boolean`

```lua
local hasGas = exports.msk_fuel:IsFuelTypeAtFuelStation(entity, 'gas')
```

## GetFuelTypesFromModel

Returns the list of fuel types a fuel station entity offers, or `false` if the model is not configured.

**Parameters**  
**entity** - `number` - A fuel station entity handle

**Returns**  
**fuelTypes** - `table | false`

```lua
local fuelTypes = exports.msk_fuel:GetFuelTypesFromModel(entity)
```

## GetVehicleFuelTankBoneIndex

Returns the bone index and a position offset of the vehicles fuel tank (used to attach the nozzle).

**Parameters**  
**vehicle** - `number` - A vehicle handle

**Returns**  
**boneIndex** - `number`  
**position** - `table` - `{x, y, z}` offset

```lua
local boneIndex, position = exports.msk_fuel:GetVehicleFuelTankBoneIndex(vehicle)
```
