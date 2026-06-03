---
title: Client
sidebar_position: 1
---

# Client Exports

:::warning v4.0.0 — custom garages/impounds need a server-side registration
For security, the server no longer trusts a garage/impound definition that comes
from the client. The client exports below still **open the UI**, but park-in /
park-out / the vehicle list only work if the **same definition was registered
server-side** for that player via
[`RegisterCustomGarage` / `RegisterCustomImpound`](./server.md).

Typical flow: your server script registers the session, then triggers a client
event that calls `openGarage` / `openImpound`.
:::

## openGarage

Opens a custom garage UI for the player.

**Parameters**  
**label** - `string` - The Label of the Garage  
**garageId** - `string` - The ID of the Garage  
**parkInCoords** - `vector3` - The Park In Coords  
**parkOutCoords** - `table <vector4>` - The Park Out Coords  
**distance** - `float` - The Park In Radius  
**warp** - `boolean` - Teleport into the Vehicle  
**type** - `table` - Vehicle Categories

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
**label** - `string` - The Label of the Impound  
**parkOutCoords** - `table <vector4>` - The Park Out Coords  
**warp** - `boolean` - Teleport into the Vehicle  
**type** - `table` - Vehicle Categories  
**fee** - `number` - The Impound Fee

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

Get in which garage a given vehicle is stored.

**Parameters**  
**plate** - `string` - Plate of the Vehicle

**Returns**  
**garage** - `string` - The Garage ID  
**coords** - `vector3` - The Coords of the Garage

```lua
local garage, coords = exports.msk_garage:GetVehicleGarage(plate)
```
