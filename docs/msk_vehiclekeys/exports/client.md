---
title: Client
sidebar_position: 1
---

# Client Exports

All client exports are called via `exports.msk_vehiclekeys:<name>(...)`.

:::info
Many functions accept a **vehicle handle** (`int`) directly, while the key functions also
accept a `{plate, model}` table so you can act on vehicles that are not currently spawned.
:::

---

## (Un)locking

### toggleLock

(Un)locks a vehicle. When used as the inventory item export, the vehicle data is read from
the item's metadata.

**Parameters**
**data** - `any` - Reserved (pass `nil`)
**slot** - `table` - `{metadata = {plate, model}}` or `{metadata = {vehicle}}`

```lua
-- From a vehicle handle
local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
exports.msk_vehiclekeys:toggleLock(nil, {metadata = {plate = GetVehicleNumberPlateText(vehicle), model = GetEntityModel(vehicle)}})

-- Directly with a vehicle entity
exports.msk_vehiclekeys:toggleLock(nil, {metadata = {vehicle = vehicle}})
```

### toggleLockAdmin

(Un)locks a vehicle **without** needing a key. The caller must be allowed by
`Config.AdminCommand`.

**Parameters**
**data** - `table` - `{vehicle}` or `{plate, model}`

```lua
exports.msk_vehiclekeys:toggleLockAdmin({vehicle = vehicle})
exports.msk_vehiclekeys:toggleLockAdmin({plate = 'LS 1234', model = `adder`})
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

**Parameters**
**vehicle** - `int` - A vehicle handle

**Returns**
**lockStatus** - `number` - `1` = unlocked, `2` = locked

```lua
local lockStatus = exports.msk_vehiclekeys:GetVehicleLockStatus(vehicle)
local lockStatus = Entity(vehicle).state.lockState -- alternative
```

:::warning Internal exports
`SetVehicleLockState` and `SetVehicleLockStatus` also exist but are for **internal use**.
Do **not** call them unless you know exactly what you are doing — they can break the script.
:::

---

## Menus

### openKeysMenu

Opens the keys menu.

```lua
exports.msk_vehiclekeys:openKeysMenu()
```

### openLocksmithMenu

Opens the locksmith menu (exchange vehicle locks).

```lua
exports.msk_vehiclekeys:openLocksmithMenu()
```

### openDialog

Opens the transfer/sell dialog (used by the `contract` item).

```lua
exports.msk_vehiclekeys:openDialog()
```

---

## Reading Keys

### RefreshPlayerKeys

Adds missing permanent keys from the player's owned vehicles.

**Parameters**
**rtn** - `boolean?` - Await and return the result instead of firing async

```lua
exports.msk_vehiclekeys:RefreshPlayerKeys()
```

### GetPlayerKeys

**Parameters**
**playerId** - `number?` - ServerId (self if omitted)

**Returns**
**keys** - `table`

```lua
local keys = exports.msk_vehiclekeys:GetPlayerKeys()

for i = 1, #keys do
    print(keys[i].plate, keys[i].model, keys[i].type)
end
```

### GetPlayerPrimaryKeys / GetPlayerSecondaryKeys / GetPlayerTempKeys

Return only the keys of the given type.

```lua
local primary   = exports.msk_vehiclekeys:GetPlayerPrimaryKeys()
local secondary = exports.msk_vehiclekeys:GetPlayerSecondaryKeys()
local temporary = exports.msk_vehiclekeys:GetPlayerTempKeys()
```

### GetAllVehicleKeys

Returns the complete key cache of all players.

```lua
local allKeys = exports.msk_vehiclekeys:GetAllVehicleKeys()
```

### GetPlayerVehicles

Returns the player's owned vehicles (`{plate, model}`).

**Parameters**
**playerId** - `number?` - ServerId (self if omitted)

```lua
local vehicles = exports.msk_vehiclekeys:GetPlayerVehicles()

for i = 1, #vehicles do
    print(vehicles[i].plate, vehicles[i].model)
end
```

### GetPlayerKeysAndVehicles

Returns both keys and owned vehicles.

```lua
local keys, vehicles = exports.msk_vehiclekeys:GetPlayerKeysAndVehicles()
```

---

## Key Checks

### HasPlayerKey

**Parameters**
**vehicle** - `int` - A vehicle handle

**Returns**
**hasKey** - `boolean`

```lua
local hasKey = exports.msk_vehiclekeys:HasPlayerKey(vehicle)
```

### HasPlayerPrimaryKey / HasPlayerSecondaryKey / HasPlayerTempKey

```lua
local hasPrimary   = exports.msk_vehiclekeys:HasPlayerPrimaryKey(vehicle)
local hasSecondary = exports.msk_vehiclekeys:HasPlayerSecondaryKey(vehicle)
local hasTemp      = exports.msk_vehiclekeys:HasPlayerTempKey(vehicle)
```

### IsVehicleOwner

**Parameters**
**vehicle** - `int` - A vehicle handle

**Returns**
**isOwner** - `boolean`

```lua
local isOwner = exports.msk_vehiclekeys:IsVehicleOwner(vehicle)
```

### HasPlayerKeyOrIsVehicleOwner

Returns `true` if the player has any key for the vehicle **or** owns it. Ideal for
engine-toggle scripts.

**Parameters**
**vehicle** - `int` - A vehicle handle

**Returns**
**hasKeyOrIsOwner** - `boolean`

```lua
local allowed = exports.msk_vehiclekeys:HasPlayerKeyOrIsVehicleOwner(vehicle)
```

---

## Adding Keys

### AddKey

**Parameters**
**vehicle** - `int` or `table` - Vehicle handle or `{plate, model}`
**type** - `string` - `'primary'`, `'secondary'` or `'temporary'`
**playerId** - `number?` - ServerId (self if omitted)

```lua
exports.msk_vehiclekeys:AddKey(vehicle, 'secondary')
exports.msk_vehiclekeys:AddKey({plate = vehiclePlate, model = vehicleModel}, 'secondary')
```

### AddPrimaryKey / AddSecondaryKey / AddTempKey

Convenience wrappers around `AddKey`.

```lua
exports.msk_vehiclekeys:AddPrimaryKey(vehicle)
exports.msk_vehiclekeys:AddPrimaryKey(vehicle, playerId)
exports.msk_vehiclekeys:AddSecondaryKey({plate = vehiclePlate, model = vehicleModel})
exports.msk_vehiclekeys:AddTempKey(vehicle)
```

---

## Removing Keys

### RemoveKey

**Parameters**
**vehicle** - `int` or `table` - Vehicle handle or `{plate, model}`
**type** - `string` - `'primary'`, `'secondary'` or `'temporary'`
**playerId** - `number?` - ServerId (self if omitted)

```lua
exports.msk_vehiclekeys:RemoveKey(vehicle, 'temporary')
```

### RemovePrimaryKey / RemoveSecondaryKey / RemoveTempKey

```lua
exports.msk_vehiclekeys:RemovePrimaryKey(vehicle)
exports.msk_vehiclekeys:RemoveSecondaryKey(vehicle, playerId)
exports.msk_vehiclekeys:RemoveTempKey({plate = vehiclePlate, model = vehicleModel})
```

---

## Locks & Transfer

### ExchangeVehicleLocks

Deletes every key **other** players have for this vehicle.

**Parameters**
**vehicle** - `int` or `table` - Vehicle handle or `{plate, model}`

```lua
exports.msk_vehiclekeys:ExchangeVehicleLocks(vehicle)
exports.msk_vehiclekeys:ExchangeVehicleLocks({plate = vehiclePlate, model = vehicleModel})
```

### TransferVehicle

Transfers a vehicle (including ownership) to another player.

**Parameters**
**targetId** - `number` - ServerId of the target player
**vehicle** - `int` or `table` - Vehicle handle or `{plate, model}`
**showDialog** - `boolean` - Show the price input dialog

```lua
exports.msk_vehiclekeys:TransferVehicle(targetId, vehicle, false)
exports.msk_vehiclekeys:TransferVehicle(targetId, {plate = vehiclePlate, model = vehicleModel}, true)
```

---

## Helpers

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

### CloseVehicleDoors

Closes every open door of a vehicle.

```lua
exports.msk_vehiclekeys:CloseVehicleDoors(vehicle)
```

### playLockAnim

Plays the key-fob animation on the local player.

```lua
exports.msk_vehiclekeys:playLockAnim()
```

### playDoorLockEffects

Plays the lock/unlock sound and indicator flash.

**Parameters**
**vehicle** - `int` - A vehicle handle
**state** - `boolean` - `true` = locked effect, `false` = unlocked effect

```lua
exports.msk_vehiclekeys:playDoorLockEffects(vehicle, true)
```
</content>
