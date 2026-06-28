---
title: Client
sidebar_position: 1
---

# Client Exports

:::warning[Custom garages/impounds need a server-side registration]
For security, the server does **not** trust a garage/impound definition that
comes from the client. The client exports below **open the UI**, but the vehicle
list, park-in and park-out only work if the **same definition was registered
server-side** for that player via
[`RegisterCustomGarage` / `RegisterCustomImpound`](./server.md).

Typical flow: your server script registers the session, then triggers a client
event that calls `openGarage` / `openImpound`.
:::

## openGarage

Opens a custom garage UI for the player.

**Parameters**  
**label** - `string` - The label of the garage  
**garageId** - `string` - The id of the garage (must match the server-registered id)  
**parkInCoords** - `vector3` - The park-in coords  
**parkOutCoords** - `table<vector4>` - The park-out coords  
**distance** - `float` - The park-in radius  
**warp** - `boolean` - Teleport into the vehicle  
**type** - `table` - Vehicle categories

```lua
exports.msk_garage:openGarage({
    label = 'Garage Test',
    garageId = 'test',
    parkInCoords = vector3(237.89, -858.35, 29.67),
    parkOutCoords = {
        vector4(237.89, -858.35, 29.67, 249.16),
    },
    distance = 20.0,
    warp = false,
    type = {'car', 'truck'}
})
```

## openImpound

Opens a custom impound UI for the player.

**Parameters**  
**label** - `string` - The label of the impound  
**parkOutCoords** - `table<vector4>` - The park-out coords  
**warp** - `boolean` - Teleport into the vehicle  
**type** - `table` - Vehicle categories  
**fee** - `number` - The impound fee

```lua
exports.msk_garage:openImpound({
    label = 'Impound Test',
    parkOutCoords = {
        vector4(237.89, -858.35, 29.67, 249.16),
    },
    warp = false,
    type = {'car', 'truck'},
    fee = 150
})
```

## GetVehicleGarage

Get which garage a given vehicle is stored in.

**Parameters**  
**plate** - `string` - Plate of the vehicle

**Returns**  
**garage** - `string` - The garage id  
**coords** - `vector3` - The coords of the garage

```lua
local garage, coords = exports.msk_garage:GetVehicleGarage(plate)
```

:::info[Fallback]
If the plate isn't found or its garage no longer exists in the config, this
returns `Config.DefaultGarage` and that garage's first location.
:::
