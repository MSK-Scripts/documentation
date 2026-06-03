---
title: Server
sidebar_position: 2
---

# Server Exports

:::info v4.0.0
These exports were added with the full rewrite. Custom garages and impounds are
now **registered server-side** so a modified client can no longer forge park-out
coordinates, vehicle types, or (for impounds) a `fee = 0`.

A session is bound to a player `src`, **auto-expires after 60 seconds** without a
write, and is cleared automatically on `playerDropped`.
:::

## RegisterCustomGarage

Registers a trusted custom garage definition for one player. Call this **before**
the player opens the garage UI (via the client
[`openGarage`](./client.md#opengarage) export).

**Parameters**  
**playerSrc** - `number` - The player's server id  
**def** - `table` - A garage definition (same shape as `Config.Garages` entries)

**Returns**  
**ok** - `boolean` - `true` if the session was stored

```lua
local ok = exports.msk_garage:RegisterCustomGarage(src, {
    id        = 'test',
    label     = 'Garage Test',
    type      = { 'car', 'truck' },
    distance  = 20.0,
    jobs      = { enable = false },
    park_out  = { vector4(237.89, -858.35, 29.67, 249.16) },
    park_dist = 5.0,
    warp      = false,
})
```

:::note Field names
The server reads `park_out` (the canonical field). `parkOutCoords` from the
client export is also accepted as a fallback, but prefer `park_out` here.
:::

## RegisterCustomImpound

Registers a trusted custom impound definition for one player.

**Parameters**  
**playerSrc** - `number` - The player's server id  
**def** - `table` - An impound definition (same shape as `Config.Impounds` entries)

**Returns**  
**ok** - `boolean` - `true` if the session was stored

```lua
local ok = exports.msk_garage:RegisterCustomImpound(src, {
    label     = 'Impound Test',
    type      = { 'car', 'truck' },
    park_out  = { vector4(237.89, -858.35, 29.67, 249.16) },
    park_dist = 5.0,
    warp      = false,
    fee       = { enable = true, price = 150, account = 'money' },
})
```

## ClearCustomSession

Clears any custom garage/impound session for a player (sessions also expire on
their own after 60s and on disconnect, so this is only needed if you want to
revoke access early).

**Parameters**  
**playerSrc** - `number` - The player's server id

```lua
exports.msk_garage:ClearCustomSession(src)
```

## Example: full server-side flow

```lua
RegisterCommand('opentestgarage', function(src)
    exports.msk_garage:RegisterCustomGarage(src, {
        id = 'test', label = 'Garage Test', type = { 'car', 'truck' },
        distance = 20.0, jobs = { enable = false },
        park_out = { vector4(237.89, -858.35, 29.67, 249.16) }, park_dist = 5.0,
    })
    -- Tell the client to open the UI (you provide this event)
    TriggerClientEvent('myscript:openTestGarage', src)
end)
```

```lua
-- client
RegisterNetEvent('myscript:openTestGarage', function()
    exports.msk_garage:openGarage({
        label = 'Garage Test', garageId = 'test',
        parkInCoords = vector3(237.89, -858.35, 29.67),
        parkOutCoords = { vector4(237.89, -858.35, 29.67, 249.16) },
        distance = 20.0, warp = false, type = { 'car', 'truck' },
    })
end)
```
