---
title: Player
sidebar_position: 5
---

# Player

## MSK.Player

**Properties**  
**clientId** - `number` - Player Index — equal to `PlayerId()`  
**ped** - `number` - Player Ped — equal to `GetPlayerPed(source)`  
**coords** - `vector3` - Player Coords — equal to `GetEntityCoords(GetPlayerPed(source))`  
**heading** - `float` - Player Heading — equal to `GetEntityHeading(GetPlayerPed(source))`  
**vehicle** - `number` - A vehicle handle  
**seat** - `number` - Seat the player is in  
**weapon** - `number` - Hash of Players current weapon

```lua
local clientId = MSK.Player[source].clientId
local playerPed = MSK.Player[source].ped

local playerCoords = MSK.Player[source].coords
local playerHeading = MSK.Player[source].heading

local vehicle = MSK.Player[source].vehicle
local seat = MSK.Player[source].seat

local currentWeapon = MSK.Player[source].weapon

-- Notification
MSK.Player[source].Notify(header, message, type, duration)
```

:::info
The following getter functions require a framework (**ESX** / **QBCore** / **ox_core**) and are not available in `STANDALONE` mode. They are convenience wrappers around [`MSK.GetPlayer`](./index.md) and `MSK.GetPlayerJob`.
:::

## MSK.GetPlayerFromId

Get the framework player object from a server id.

**Parameters**  
**playerId** - `number` - The ServerId of the player

**Returns**  
**player** - `table` - The framework player object

```lua
local xPlayer = MSK.GetPlayerFromId(playerId)

-- As an Export:
local xPlayer = exports.msk_core:GetPlayerFromId(playerId)
```

## MSK.GetPlayerFromIdentifier

Get the framework player object from an identifier.

**Parameters**  
**identifier** - `string` - The player identifier

**Returns**  
**player** - `table` - The framework player object

```lua
local xPlayer = MSK.GetPlayerFromIdentifier(identifier)

-- As an Export:
local xPlayer = exports.msk_core:GetPlayerFromIdentifier(identifier)
```

## MSK.GetPlayerByCitizenId

Get the framework player object from a citizenid (QBCore) / identifier.

**Parameters**  
**citizenid** - `string` - The citizenid of the player

**Returns**  
**player** - `table` - The framework player object

```lua
local xPlayer = MSK.GetPlayerByCitizenId(citizenid)

-- As an Export:
local xPlayer = exports.msk_core:GetPlayerByCitizenId(citizenid)
```

## MSK.GetPlayerJobFromId

Get the job of a player from a server id.

**Parameters**  
**playerId** - `number` - The ServerId of the player

**Returns**  
**job** - `table` - The job object

```lua
local job = MSK.GetPlayerJobFromId(playerId)

-- As an Export:
local job = exports.msk_core:GetPlayerJobFromId(playerId)
```

## MSK.GetPlayerJobFromIdentifier

Get the job of a player from an identifier.

**Parameters**  
**identifier** - `string` - The player identifier

**Returns**  
**job** - `table` - The job object

```lua
local job = MSK.GetPlayerJobFromIdentifier(identifier)

-- As an Export:
local job = exports.msk_core:GetPlayerJobFromIdentifier(identifier)
```

## MSK.GetPlayerJobByCitizenId

Get the job of a player from a citizenid (QBCore) / identifier.

**Parameters**  
**citizenid** - `string` - The citizenid of the player

**Returns**  
**job** - `table` - The job object

```lua
local job = MSK.GetPlayerJobByCitizenId(citizenid)

-- As an Export:
local job = exports.msk_core:GetPlayerJobByCitizenId(citizenid)
```

## MSK.GetMirroredPlayer

Get the mirrored player table (`MSK.Player[playerId]`) directly.

**Parameters**  
**playerId** - `number` - The ServerId of the player

**Returns**  
**player** - `table` - The mirrored player table

```lua
local player = MSK.GetMirroredPlayer(playerId)

-- As an Export:
local player = exports.msk_core:GetMirroredPlayer(playerId)
```
