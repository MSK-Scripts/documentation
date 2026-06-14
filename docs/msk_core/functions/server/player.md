---
title: Player
sidebar_position: 2
---

# Player

On the server the core keeps a mirrored player table, `MSK.Player[source]`, that is kept in sync by the `msk_core:onPlayer` net event sent from each client. In addition the Player module exposes a set of framework wrappers (`MSK.GetPlayer`, `MSK.GetPlayers`, and the convenience getters below) that return the underlying framework player / job objects.

## MSK.Player[source]

The mirrored table for a connected player, keyed by their server id. Computed keys (`coords`, `heading`, `state`) are resolved on access; all other keys are populated from the client's `msk_core:onPlayer` updates.

**Properties**  
**clientId** - `number` - Player Index on the client — equal to `PlayerId()`  
**serverId** - `number` - Player Server Id  
**playerId** - `number` - Alias of `serverId`  
**ped** - `number` - Player Ped — equal to `GetPlayerPed(source)`  
**playerPed** - `number` - Alias of `ped`  
**coords** - `vector3` - Player Coords — equal to `GetEntityCoords(ped)`  
**heading** - `float` - Player Heading — equal to `GetEntityHeading(ped)`  
**state** - `table` - The player's state bag — equal to `Player(serverId).state`  
**vehicle** - `number` - The vehicle entity the player is in (resolved from the replicated network id)  
**vehNetId** - `number` - The network id of the player's vehicle  
**seat** - `number` - Seat index the player is in  
**weapon** - `number` - Hash of the player's current weapon  
**isDead** - `boolean` - Whether the player is dead  
**Notify** - `function` - Shorthand for `MSK.Notification(source, title, message, type, duration)`

```lua
local clientId = MSK.Player[source].clientId
local playerPed = MSK.Player[source].ped

local playerCoords = MSK.Player[source].coords
local playerHeading = MSK.Player[source].heading

local vehicle = MSK.Player[source].vehicle
local seat = MSK.Player[source].seat

local currentWeapon = MSK.Player[source].weapon

-- Notification
MSK.Player[source].Notify(title, message, type, duration)
```

## MSK.GetMirroredPlayer

Returns the mirrored player table (`MSK.Player[id]`) directly. This is the export used by consumer resources to read the server mirror.

**Parameters**  
**id** - `number` - The server id of the player

**Returns**  
**player** - `table` - The mirrored player table

```lua
local player = MSK.GetMirroredPlayer(id)

-- Example
local coords = MSK.GetMirroredPlayer(source).coords

-- As an Export:
local player = exports.msk_core:GetMirroredPlayer(id)
```

:::info
The following getter wrappers require a framework (**ESX** / **QBCore** / **OXCore**) and are **not registered in `STANDALONE` mode**. They are convenience wrappers around `MSK.GetPlayer` and `MSK.GetPlayerJob`.
:::

## MSK.GetPlayerFromId

Gets the framework player object from a server id. Wrapper for `MSK.GetPlayer({source = playerId})`.

**Parameters**  
**playerId** - `number` - The server id of the player

**Returns**  
**player** - `table` - The framework player object

```lua
local xPlayer = MSK.GetPlayerFromId(playerId)

-- Example
local xPlayer = MSK.GetPlayerFromId(source)

-- As an Export:
local xPlayer = exports.msk_core:GetPlayerFromId(playerId)
```

## MSK.GetPlayerFromIdentifier

Gets the framework player object from an identifier. Wrapper for `MSK.GetPlayer({identifier = identifier})`.

**Parameters**  
**identifier** - `string` - The player identifier

**Returns**  
**player** - `table` - The framework player object

```lua
local xPlayer = MSK.GetPlayerFromIdentifier(identifier)

-- Example
local xPlayer = MSK.GetPlayerFromIdentifier('license:abc123')

-- As an Export:
local xPlayer = exports.msk_core:GetPlayerFromIdentifier(identifier)
```

## MSK.GetPlayerByCitizenId

Gets the framework player object from a citizenid (QBCore) / identifier. Wrapper for `MSK.GetPlayer({citizenid = citizenid})`.

**Parameters**  
**citizenid** - `string` - The citizenid of the player

**Returns**  
**player** - `table` - The framework player object

```lua
local xPlayer = MSK.GetPlayerByCitizenId(citizenid)

-- Example
local xPlayer = MSK.GetPlayerByCitizenId('ABCD1234')

-- As an Export:
local xPlayer = exports.msk_core:GetPlayerByCitizenId(citizenid)
```

## MSK.GetPlayerJobFromId

Gets the job of a player from a server id. Wrapper for `MSK.GetPlayerJob({source = playerId})`.

**Parameters**  
**playerId** - `number` - The server id of the player

**Returns**  
**job** - `table` - The job object

```lua
local job = MSK.GetPlayerJobFromId(playerId)

-- Example
local job = MSK.GetPlayerJobFromId(source)

-- As an Export:
local job = exports.msk_core:GetPlayerJobFromId(playerId)
```

## MSK.GetPlayerJobFromIdentifier

Gets the job of a player from an identifier. Wrapper for `MSK.GetPlayerJob({identifier = identifier})`.

**Parameters**  
**identifier** - `string` - The player identifier

**Returns**  
**job** - `table` - The job object

```lua
local job = MSK.GetPlayerJobFromIdentifier(identifier)

-- Example
local job = MSK.GetPlayerJobFromIdentifier('license:abc123')

-- As an Export:
local job = exports.msk_core:GetPlayerJobFromIdentifier(identifier)
```

## MSK.GetPlayerJobByCitizenId

Gets the job of a player from a citizenid (QBCore) / identifier. Wrapper for `MSK.GetPlayerJob({citizenid = citizenid})`.

**Parameters**  
**citizenid** - `string` - The citizenid of the player

**Returns**  
**job** - `table` - The job object

```lua
local job = MSK.GetPlayerJobByCitizenId(citizenid)

-- Example
local job = MSK.GetPlayerJobByCitizenId('ABCD1234')

-- As an Export:
local job = exports.msk_core:GetPlayerJobByCitizenId(citizenid)
```

## MSK.GetPlayers

Returns the framework's list of players, optionally filtered by a key/value pair. The behaviour and filter keys depend on the active framework:

- **ESX** — returns `ESX.GetExtendedPlayers(key, value)`.
- **QBCore** — without a `key` returns all QB players; with a `key` filters by `'job'`, `'gang'` or `'group'` (ACE-based).
- **OXCore** — returns `Ox.GetPlayers({[key] = value})` (or all players when no key is given).

**Parameters**  
**key** - `string` - The filter key (optional) — e.g. `'job'`, `'gang'`, `'group'`  
**value** - `any` - The value to filter by (optional)

**Returns**  
**players** - `table` - The list of framework player objects

```lua
local players = MSK.GetPlayers(key, value)

-- Example: all players
local players = MSK.GetPlayers()

-- Example: all police
local police = MSK.GetPlayers('job', 'police')

-- As an Export:
local players = exports.msk_core:GetPlayers(key, value)
```
