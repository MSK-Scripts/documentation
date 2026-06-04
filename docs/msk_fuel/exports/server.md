---
title: Server
sidebar_position: 2
---

# Server Exports

## GetVehicleFuel

**Parameters**  
**netId** - `number` - A vehicle network id

**Returns**  
**fuelLevel** - `number` - Vehicles fuel level (defaults to `50.0` if not set)

```lua
local fuelLevel = exports.msk_fuel:GetVehicleFuel(netId)
```

## SetVehicleFuel

Sets the vehicles fuel level serverside and syncs it to the entity owner.

**Parameters**  
**netId** - `number` - A vehicle network id  
**fuelLevel** - `number` - Vehicles new fuel level

```lua
exports.msk_fuel:SetVehicleFuel(netId, fuelLevel)
```

## IsPlayerNearVehicle

Serverside anti-exploit check that returns whether a player is close enough to a vehicle to interact with it.

**Parameters**  
**playerId** - `number` - The players server id  
**vehicle** - `number` - A vehicle entity handle  
**maxDist** - `number?` - Max distance in units (defaults to `Config.MaxFuelingDistance`)

**Returns**  
**result** - `boolean`

```lua
local isNear = exports.msk_fuel:IsPlayerNearVehicle(playerId, vehicle)
```
