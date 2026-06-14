---
title: Server
sidebar_position: 2
---

# Server Exports

All server exports are called via `exports.msk_vehiclekeys:<name>(...)`.

:::info Player identification
Functions that act on a player take a **playerData** table — either
`{source = playerId}` (ServerId) **or** `{identifier = '<identifier>'}`. Using the
identifier lets you target offline players.
:::

:::info Vehicle data
Key functions take a **vehicleData** table — `{plate, model}` for non-spawned vehicles
**or** `{netId}` for a spawned vehicle's network id.
:::

---

## (Un)locking

### toggleLock

**Parameters**
**playerId** - `number` - ServerId of the player
**plate** - `string?` - Plate to (un)lock (closest owned vehicle if omitted)
**model** - `number?` - Vehicle model

```lua
exports.msk_vehiclekeys:toggleLock(playerId, plate)
```

### toggleLockAdmin

(Un)locks a vehicle **without** needing a key. The player must be Ace-allowed.

```lua
exports.msk_vehiclekeys:toggleLockAdmin(playerId, plate)
```

---

## Lock State

### GetVehicleLockState

**Parameters**
**vehicle** - `int` - A vehicle handle

**Returns**
**isLocked** - `boolean`

```lua
local isLocked = exports.msk_vehiclekeys:GetVehicleLockState(vehicle)
local isLocked = Entity(vehicle).state.isLocked -- alternative
```

### GetVehicleLockStatus

**Returns**
**lockStatus** - `number` - `1` = unlocked, `2` = locked

```lua
local lockStatus = exports.msk_vehiclekeys:GetVehicleLockStatus(vehicle)
```

:::warning Internal exports
`SetVehicleLockState` and `SetVehicleLockStatus` exist but are for **internal use**.
Do not call them unless you know exactly what you are doing — they can break the script.
:::

---

## Reading Keys

### GetPlayerKeys

**Parameters**
**playerData** - `table` - `{source}` or `{identifier}`

**Returns**
**keys** - `table`

```lua
local keys = exports.msk_vehiclekeys:GetPlayerKeys({source = playerId})

for i = 1, #keys do
    print(keys[i].plate, keys[i].model, keys[i].type)
end
```

### GetPlayerPrimaryKeys / GetPlayerSecondaryKeys / GetPlayerTempKeys

Return only the keys of the given type.

```lua
local primary   = exports.msk_vehiclekeys:GetPlayerPrimaryKeys({source = playerId})
local secondary = exports.msk_vehiclekeys:GetPlayerSecondaryKeys({source = playerId})
local temporary = exports.msk_vehiclekeys:GetPlayerTempKeys({source = playerId})
```

### GetAllVehicleKeys

Returns the complete key cache of all players (keyed by identifier).

```lua
local allKeys = exports.msk_vehiclekeys:GetAllVehicleKeys()
```

### GetPlayerVehicles

Returns the player's owned vehicles (`{plate, model}`) from the database.

```lua
local vehicles = exports.msk_vehiclekeys:GetPlayerVehicles({source = playerId})

for i = 1, #vehicles do
    print(vehicles[i].plate, vehicles[i].model)
end
```

### GetPlayerKeysAndVehicles

Returns both keys and owned vehicles.

```lua
local keys, vehicles = exports.msk_vehiclekeys:GetPlayerKeysAndVehicles({source = playerId})
```

### RefreshPlayerKeys

Adds missing permanent keys from the player's owned vehicles.

**Parameters**
**playerId** - `number` - ServerId

**Returns**
**result** - `table` - `{owned_keys, added_primary_keys, added_secondary_keys}`

```lua
local result = exports.msk_vehiclekeys:RefreshPlayerKeys(playerId)
```

---

## Key Checks

### HasPlayerKey

**Parameters**
**playerData** - `table` - `{source}` or `{identifier}`
**plate** - `string`
**model** - `number`

**Returns**
**hasKey** - `boolean`

```lua
local hasKey = exports.msk_vehiclekeys:HasPlayerKey({source = playerId}, plate, model)
```

### HasPlayerPrimaryKey / HasPlayerSecondaryKey / HasPlayerTempKey

```lua
local hasPrimary   = exports.msk_vehiclekeys:HasPlayerPrimaryKey({source = playerId}, plate, model)
local hasSecondary = exports.msk_vehiclekeys:HasPlayerSecondaryKey({source = playerId}, plate, model)
local hasTemp      = exports.msk_vehiclekeys:HasPlayerTempKey({source = playerId}, plate, model)
```

### IsVehicleOwner

**Parameters**
**playerData** - `table` - `{source}` or `{identifier}`
**plate** - `string`

**Returns**
**isOwner** - `boolean`

```lua
local isOwner = exports.msk_vehiclekeys:IsVehicleOwner({source = playerId}, plate)
```

### HasPlayerKeyOrIsVehicleOwner

Returns `true` if the player has any key for the vehicle **or** owns it. Ideal for
engine-toggle scripts.

**Returns**
**hasKeyOrIsOwner** - `boolean`

```lua
local allowed = exports.msk_vehiclekeys:HasPlayerKeyOrIsVehicleOwner({source = playerId}, plate, model)
```

---

## Adding Keys

### AddKey

**Parameters**
**playerData** - `table` - `{source}` or `{identifier}`
**vehicleData** - `table` - `{plate, model, type}` or `{netId, type}`
**ignoreInv** - `boolean?` - Skip giving the key item to the inventory

```lua
exports.msk_vehiclekeys:AddKey({source = playerId}, {plate = 'LS 1234', model = 1093792632, type = 'secondary'})
```

### AddPrimaryKey / AddSecondaryKey / AddTempKey

Convenience wrappers around `AddKey` that set the type for you.

```lua
exports.msk_vehiclekeys:AddPrimaryKey({source = playerId}, {plate = 'LS 1234', model = 1093792632})

local vehicleNetId = NetworkGetNetworkIdFromEntity(vehicle)
exports.msk_vehiclekeys:AddPrimaryKey({source = playerId}, {netId = vehicleNetId})

exports.msk_vehiclekeys:AddSecondaryKey({source = playerId}, {plate = 'LS 1234', model = 1093792632})
exports.msk_vehiclekeys:AddTempKey({source = playerId}, {plate = 'LS 1234', model = 1093792632})
```

---

## Removing Keys

### RemoveKey

**Parameters**
**playerData** - `table` - `{source}` or `{identifier}`
**vehicleData** - `table` - `{plate, type}` or `{netId, type}`
**ignoreInv** - `boolean?` - Skip removing the key item from the inventory

```lua
exports.msk_vehiclekeys:RemoveKey({source = playerId}, {plate = 'LS 1234', type = 'secondary'})
```

### RemovePrimaryKey / RemoveSecondaryKey / RemoveTempKey

```lua
exports.msk_vehiclekeys:RemovePrimaryKey({source = playerId}, {plate = 'LS 1234', model = 1093792632})
exports.msk_vehiclekeys:RemoveSecondaryKey({source = playerId}, {plate = 'LS 1234'})
exports.msk_vehiclekeys:RemoveTempKey({source = playerId}, {plate = 'LS 1234'})
```

### RemoveAllExistingKeys

Removes **every** key for a plate, from **all** players (cache, database and inventory).

**Parameters**
**plate** - `string`

```lua
exports.msk_vehiclekeys:RemoveAllExistingKeys('LS 1234')
```

---

## Locks & Transfer

### ExchangeVehicleLocks

Deletes every key **other** players have for this vehicle (keeps the caller's key).

**Parameters**
**playerData** - `table` - `{source}` or `{identifier}`
**vehicleData** - `table` - `{plate}` or `{netId}` (a plate string is also accepted)

```lua
exports.msk_vehiclekeys:ExchangeVehicleLocks({source = playerId}, {plate = 'LS 1234'})
```

### TransferVehicle

Transfers a vehicle (including ownership) from one player to another.

**Parameters**
**ownerData** - `table` - `{source}` or `{identifier}`
**targetData** - `table` - `{source}` or `{identifier}`
**vehicleData** - `table` - `{plate, model}` or `{netId}`

```lua
exports.msk_vehiclekeys:TransferVehicle({source = playerId}, {source = targetId}, {plate = 'LS 1234', model = 1093792632})
```

### ChangeNumberPlate

Changes the plate of all existing keys. Optionally also updates the SQL `owned_vehicles`
table.

**Parameters**
**oldPlate** - `string`
**newPlate** - `string`
**changeSQL** - `boolean` - Also update the SQL table — default `false`

```lua
exports.msk_vehiclekeys:ChangeNumberPlate("ABC 123", "XYZ 789", true)
exports.msk_vehiclekeys:ChangeNumberPlate("ABC 123", "XYZ 789", false)
```

---

## Vehicle Checks & Helpers

### IsVehicleWhitelisted / IsVehicleBlacklisted

Check a plate/model against `Config.Whitelist` / `Config.Blacklist`.

**Parameters**
**plate** - `string?`
**model** - `number?`

**Returns**
**result** - `boolean`

```lua
local whitelisted = exports.msk_vehiclekeys:IsVehicleWhitelisted(plate, model)
local blacklisted = exports.msk_vehiclekeys:IsVehicleBlacklisted(plate, model)
```

### IsAdminVehicle

Returns `true` if the plate/model is configured in `Config.AdminVehicles`.

```lua
local isAdminVehicle = exports.msk_vehiclekeys:IsAdminVehicle(plate, model)
```

### IsAdminVehicleAllowed

Returns `true` if the player is Ace-allowed **and** the vehicle is an admin vehicle.

**Parameters**
**playerId** - `number` - ServerId
**plate** - `string?`
**model** - `number?`

```lua
local allowed = exports.msk_vehiclekeys:IsAdminVehicleAllowed(playerId, plate, model)
```

### IsJobVehicle

Returns `true` if a job (and optionally rank) may (un)lock the given vehicle — checks both
`society_<job>` owned vehicles and `Config.JobVehicles`.

**Parameters**
**jobName** - `string`
**jobRank** - `string`
**plate** - `string?`
**model** - `number?`

```lua
local isJobVehicle = exports.msk_vehiclekeys:IsJobVehicle('police', 'officer', plate, model)
```

### GetOwnedVehiclesInRadius

Returns all spawned vehicles in `radius` the player is allowed to (un)lock (keys, job,
whitelist or admin).

**Parameters**
**playerId** - `number` - ServerId
**playerCoords** - `vector3`
**radius** - `number`

```lua
local vehicles = exports.msk_vehiclekeys:GetOwnedVehiclesInRadius(playerId, playerCoords, 8.0)
```

### GetClosestPlayer / GetClosestVehicle / GetClosestVehicleWithPlate

```lua
local ped     = exports.msk_vehiclekeys:GetClosestPlayer(coords, players)
local vehicle = exports.msk_vehiclekeys:GetClosestVehicle(coords, vehicles)
local vehicle = exports.msk_vehiclekeys:GetClosestVehicleWithPlate(coords, distance, plate, vehicles)
```

### IsVehicleOwned / GetVehiclesInBucket

```lua
-- IsVehicleOwned checks the owned-vehicles table for a plate (source is unused)
local isOwned   = exports.msk_vehiclekeys:IsVehicleOwned(playerId, plate)
local vehicles  = exports.msk_vehiclekeys:GetVehiclesInBucket(bucketId)
```

### hasCorrectItem / AddKeyToInv / RemoveKeyFromInv

Inventory helpers for the key item (including keyring).

```lua
local hasItem = exports.msk_vehiclekeys:hasCorrectItem({source = playerId}, Config.Settings.key, plate)
exports.msk_vehiclekeys:AddKeyToInv({source = playerId}, plate, 'primary')
exports.msk_vehiclekeys:RemoveKeyFromInv({source = playerId}, plate)
```
</content>
