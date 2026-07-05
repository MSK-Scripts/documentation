---
title: Integrations
sidebar_position: 2
---

# Integrations

:::info
This guide shows examples on how to integrate `msk_vehiclekeys` into vehicle shops, garages
and engine-toggle scripts using the [export API](../exports/client.md).
:::

:::tip
`msk_vehiclekeys` is already integrated in
[MSK EngineToggle](https://forum.cfx.re/t/msk-enginetoggle-toggle-engine-on-off/4793840) and
[MSK Garage](https://forum.cfx.re/t/esx-msk-garage-and-impound/5122014).
:::

:::warning[Client exports vs server exports]
The **client** primary and secondary key exports (`AddKey`, `AddPrimaryKey`,
`AddSecondaryKey`) are protected against exploiting: the player can only add or share such
a key for a vehicle they **own** or **already hold a key for** (this includes whitelist and
job vehicles). This is exactly what you want for a personal garage, where the player takes
out their own car.

**Temporary keys** (`AddTempKey`) are not restricted on the client. They are RAM-only and
removed on the next (re)connect, so a test drive can hand out a temporary key client-side
for any vehicle.

To give a **persistent** (primary or secondary) key for a vehicle the player does **not**
own yet, for example a shop purchase before the vehicle is saved, add the key from a
**server** script with the [server export](../exports/server.md#addkey). The
`dealerships_creator` server example below shows this pattern.
:::

## EngineToggle Scripts

To check whether a player may start the engine, use the `HasPlayerKeyOrIsVehicleOwner` export:

- Clientside: [`HasPlayerKeyOrIsVehicleOwner`](../exports/client.md#hasplayerkeyorisvehicleowner)
- Serverside: [`HasPlayerKeyOrIsVehicleOwner`](../exports/server.md#hasplayerkeyorisvehicleowner)

## okokVehicleShop

Edit the following events in `okokVehicleshop/cl_utils.lua`:

```lua
RegisterNetEvent(Config.EventPrefix..":giveKeys")
AddEventHandler(Config.EventPrefix..":giveKeys", function(vehicle)
    Wait(2000)
    exports.msk_vehiclekeys:AddPrimaryKey(vehicle)
end)

RegisterNetEvent(Config.EventPrefix..":giveKeysTestDrive")
AddEventHandler(Config.EventPrefix..":giveKeysTestDrive", function(vehicle)
    Wait(2000)
    exports.msk_vehiclekeys:AddTempKey(vehicle)
end)

RegisterNetEvent(Config.EventPrefix..":onFinishTestDrive")
AddEventHandler(Config.EventPrefix..":onFinishTestDrive", function(vehicle)
    exports.msk_vehiclekeys:RemoveTempKey(vehicle)
end)

RegisterNetEvent(Config.EventPrefix..":deleteVehicle")
AddEventHandler(Config.EventPrefix..":deleteVehicle", function()
    if sellingVehicle ~= nil then
        exports.msk_vehiclekeys:RemovePrimaryKey(sellingVehicle)
        DeleteEntity(sellingVehicle)
        sellingVehicle = nil
    end
end)
```

## dealerships_creator

In `dealerships_creator/integrations/cl_integrations.lua`:

```lua
AddEventHandler("dealerships_creator:testDrive:vehicleSpawned", function(vehicle, vehicleNetId)
    exports.msk_vehiclekeys:AddTempKey(vehicle)
end)
```

In `dealerships_creator/integrations/sv_integrations.lua`:

```lua
AddEventHandler("dealerships_creator:giveVehicleToPlayerId", function(playerId, vehicleName, plate)
    Wait(2000)
    exports.msk_vehiclekeys:AddPrimaryKey({source = playerId}, {plate = plate})
end)
```

## jobs_creator

In `jobs_creator/integrations/cl_integrations.lua`:

```lua
AddEventHandler("jobs_creator:permanent_garage:vehicleSpawned", function(vehicle, vehicleName, vehiclePlate)
    Wait(2000)
    exports.msk_vehiclekeys:AddPrimaryKey(vehicle)
end)

AddEventHandler("jobs_creator:permanent_garage:vehicleParked", function(vehicleModel, vehiclePlate)
    exports.msk_vehiclekeys:RemovePrimaryKey({plate = vehiclePlate, model = vehicleModel})
end)

AddEventHandler("jobs_creator:temporary_garage:vehicleSpawned", function(vehicle, vehicleName, vehiclePlate)
    Wait(2000)
    exports.msk_vehiclekeys:AddTempKey(vehicle)
end)

AddEventHandler("jobs_creator:temporary_garage:vehicleParked", function(vehicleModel, vehiclePlate)
    exports.msk_vehiclekeys:RemoveTempKey({plate = vehiclePlate, model = vehicleModel})
end)
```

## qs-advancedgarages

In `qs-advancedgarages/config/config.lua` at line ~186:

```lua
local mskvehiclekeys = GetResourceState('msk_vehiclekeys') == 'started'
```

At line ~208:

```lua
elseif mskvehiclekeys then
    return 'msk_vehiclekeys'
else
```

Create `qs-advancedgarages/client/custom/vehiclekeys/msk_vehiclekeys.lua`:

```lua
if Config.Vehiclekeys ~= 'msk_vehiclekeys' then return end

function AddVehiclekeys(vehicle, plate, item)
    exports.msk_vehiclekeys:AddPrimaryKey(vehicle)
end

function RemoveVehiclekeys(vehicle, plate)
    exports.msk_vehiclekeys:RemovePrimaryKey(vehicle)
end
```
