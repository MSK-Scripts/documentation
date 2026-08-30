---
title: Server
sidebar_position: 2
---

# Server Exports

:::info[Server-authoritative custom locations]
Custom garages and impounds are **registered server-side** so a modified client
can no longer forge park-out coordinates, vehicle types, or (for impounds) a
`fee = 0`.

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

:::note[Field names]
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

```lua title="server"
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

```lua title="client"
RegisterNetEvent('myscript:openTestGarage', function()
    exports.msk_garage:openGarage({
        label = 'Garage Test', garageId = 'test',
        parkInCoords = vector3(237.89, -858.35, 29.67),
        parkOutCoords = { vector4(237.89, -858.35, 29.67, 249.16) },
        distance = 20.0, warp = false, type = { 'car', 'truck' },
    })
end)
```

---

## Private garages

Seven exports for connecting a housing script. The whole topic, including the
adapters for scripts you cannot patch, is on its own page:
[Private garages](../guides/private-garages.md).

Every export accepts either the **garage id** or the **house reference**
(`house_ref`) as its first argument, so you can use whichever you have at hand.

### CreatePrivateGarage

Creates a private garage, or updates it if it already exists. You supply
coordinates and an owner, everything cosmetic comes from
`Config.PrivateGarageTemplate`.

**Parameters**
**def** - `table` - `houseRef`, `owner`, `location`, optional `parkOut`, `label`, `type`, `id`

**Returns**
**ok** - `boolean`
**id** - `string` - the garage id that was used (derived from `houseRef` when you did not pass one)

```lua
local ok, garageId = exports.msk_garage:CreatePrivateGarage({
    houseRef = 'H17',
    owner    = xPlayer.identifier,
    location = vector4(213.98, -808.45, 31.01, 156.59),
    parkOut  = { vector4(232.98, -790.30, 30.60, 161.46) },
    label    = 'Haus 17',
})
```

:::note[Calling it again is safe]
Housing scripts call this on every start, or again after a resale. If the owner
changed, the vehicles of the previous tenants are moved out **before** the row is
overwritten, so nobody loses a car.
:::

### SetPrivateGarageOwner

Hands the garage to a different player, or makes it public again with `nil`.

**Parameters**
**idOrRef** - `string`
**identifier** - `string | nil` - `nil` turns the garage back into a public one

```lua
exports.msk_garage:SetPrivateGarageOwner('H17', newOwner.identifier)
exports.msk_garage:SetPrivateGarageOwner('H17', nil) -- public again
```

### DeletePrivateGarage

Removes the garage and its access list. Vehicles parked inside are moved to the
default garage of their category first.

```lua
exports.msk_garage:DeletePrivateGarage('H17')
```

### GrantPrivateGarageAccess

**Parameters**
**idOrRef** - `string`
**identifier** - `string` - the player who may use it
**grantedBy** - `string` - optional, stored for reference

**Returns**
**ok** - `boolean`
**err** - `string` - `not_found`, `bad_identifier`, `not_private` or `limit_reached`

```lua
exports.msk_garage:GrantPrivateGarageAccess('H17', roommate.identifier, owner.identifier)
```

### RevokePrivateGarageAccess

Takes the access away. The vehicles that player has parked there are moved to
the default garage of their category first.

```lua
exports.msk_garage:RevokePrivateGarageAccess('H17', roommate.identifier)
```

### GetPrivateGarageAccess

**Returns** a list of `{ identifier, name }`, sorted by name.

```lua
for _, row in ipairs(exports.msk_garage:GetPrivateGarageAccess('H17')) do
    print(row.name, row.identifier)
end
```

### PlayerHasGarageAccess

Answers the same question msk_garage asks itself when a player tries to park.
Consults the housing bridge, so it reflects a house sale immediately.

**Returns** `boolean`

```lua
if exports.msk_garage:PlayerHasGarageAccess(xPlayer.identifier, 'H17') then
    -- ...
end
```
