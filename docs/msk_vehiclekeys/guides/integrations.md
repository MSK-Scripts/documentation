---
title: Integrations
sidebar_position: 2
---

# Integrations

:::info
This guide shows examples on how to integrate `msk_vehiclekeys` into VehicleShops, etc.
:::

:::tip
It is already integrated in [MSK EngineToggle](https://forum.cfx.re/t/msk-enginetoggle-toggle-engine-on-off/4793840) and [MSK Garage](https://forum.cfx.re/t/esx-msk-garage-and-impound/5122014).
:::

## EngineToggle Scripts

- Use the [clientside export](../exports/client.md#hasplayerkeyorisvehicleowner) `HasPlayerKeyOrIsVehicleOwner`
- Use the [serverside export](../exports/server.md#hasplayerkeyorisvehicleowner) `HasPlayerKeyOrIsVehicleOwner`

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
