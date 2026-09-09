---
title: Vehicle Store
sidebar_position: 6
---

# Vehicle Store

One shape over the **owned-vehicle table** of the running framework. New in v4.0.0.

Every garage, every vehicle shop and every admin tool used to carry its own copy of this, usually written for ESX only. `MSK.VehicleStore` reads and writes that table on ESX, QBCore and Qbox behind one API.

:::info
Server-side only, and it needs a framework. In `STANDALONE` every function returns `nil`, `false` or an empty result.
:::

## Why a name mapping is not enough

The tables differ by more than the column names:

| | ESX | QBCore and Qbox |
|---|---|---|
| Table | `owned_vehicles` | `player_vehicles` |
| Owner | `owner` | `citizenid` |
| `vehicle` column | all properties as JSON | the **spawn name** |
| Properties | in `vehicle` | in `mods` |
| Model hash | inside the properties JSON | own column `hash` |
| Parked flag | `stored`, 0 or 1 | `state` |
| `type`, `job` | present | **missing** |

Three different kinds of difference sit in that table: a pure rename (`owner` and `citizenid`), the same column name meaning something else (`vehicle`), and a column that is not there at all.

### The two missing columns

`job` and `type` are added on start with `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`. That is additive, leaves existing rows untouched, and the framework ignores columns it does not know. It is the same approach `msk_enginetoggle` has always used for its `alarmStage` column.

:::warning[Vehicle properties are not unified]
Properties come back and go in **exactly the format the running framework wrote them in**. ESX has its own format, QBCore and Qbox use the one from `ox_lib`, and every other garage on the server reads the same column. Unifying them would mean the next garage spawns the vehicle without its tuning.

Read them with the framework's own helper (`ESX.Game.GetVehicleProperties` or `lib.getVehicleProperties`) and hand them straight to `MSK.VehicleStore`.
:::

## The vehicle table

Every read returns this shape:

```lua
{
    plate  = 'ABC 123',
    owner  = 'license:abc123',   -- identifier or citizenid
    model  = 'sultan',           -- spawn name, or a hash on ESX
    props  = {},                 -- framework format, see the warning above
    stored = true,               -- true when it sits in a garage
    garage = 'legion',
    type   = 'car',
    job    = nil,
    raw    = {},                 -- the untouched database row
}
```

## MSK.VehicleStore.GetSchema

The table and column names of the running framework. Use this when you need to write your own query.

**Returns**
**schema** - `table` | `nil` - A copy, so changing it does not affect anyone else

```lua
local schema = MSK.VehicleStore.GetSchema()

-- ESX             -> table = 'owned_vehicles',  owner = 'owner',     stored = 'stored'
-- QBCore and Qbox -> table = 'player_vehicles', owner = 'citizenid', stored = 'state'

if schema then
    local rows = MySQL.query.await(
        ('SELECT * FROM `%s` WHERE `%s` = ?'):format(schema.table, schema.owner),
        {identifier}
    )
end

-- As an Export:
local schema = exports.msk_core:VehicleGetSchema()
```

`storedIn` and `storedOut` hold the values that mean "in the garage" and "out", so a query does not have to hardcode them.

:::warning[Resolve the schema outside of a thread]
Read it where your config is built, not inside a `CreateThread`. The first query can run before a thread would have gotten around to it, and it would then work on whatever fallback you left in place. `msk_core` starts before your resource, so the export answers right away.
:::

## MSK.VehicleStore.GetByPlate

**Parameters**
**plate** - `string` - The plate, trimmed and matched against padded plates too

**Returns**
**vehicle** - `table` | `nil` - The unified shape above, `nil` when the plate is unknown

```lua
local vehicle = MSK.VehicleStore.GetByPlate('ABC 123')

if vehicle and vehicle.stored then
    print(vehicle.model, vehicle.garage)
end

-- As an Export:
local vehicle = exports.msk_core:VehicleGetByPlate(plate)
```

## MSK.VehicleStore.CountByPlate

How many rows carry a plate. Useful before handing out a generated plate.

```lua
if MSK.VehicleStore.CountByPlate(plate) == 0 then
    -- plate is free
end

-- As an Export:
local count = exports.msk_core:VehicleCountByPlate(plate)
```

## MSK.VehicleStore.Insert

**Parameters**
**data** - `table` - `owner` and `plate` are required, everything else is optional

```lua
local ok = MSK.VehicleStore.Insert({
    owner   = player.identifier,
    plate   = plate,
    model   = 'sultan',        -- spawn name or hash
    props   = props,           -- framework format
    stored  = true,            -- default true
    garage  = 'legion',
    type    = 'car',
    job     = nil,
    license = player.license,  -- QBCore and Qbox only, ignored on ESX
})

-- As an Export:
local ok = exports.msk_core:VehicleInsert(data)
```

On ESX the model is written into the properties JSON, which is where ESX looks for it. On QBCore and Qbox the spawn name goes into its own column and the hash beside it, because without the hash their garages cannot spawn the vehicle.

## MSK.VehicleStore.Update

Updates single fields. The keys are the **unified** names, not the column names of whichever framework is running.

**Parameters**
**plate** - `string`
**fields** - `table` - Any of `owner`, `garage`, `type`, `job`, `stored`, `props`

**Returns**
**success** - `boolean` - Whether a row was changed

```lua
MSK.VehicleStore.Update(plate, {stored = false})
MSK.VehicleStore.Update(plate, {stored = true, garage = 'legion', props = props})

-- As an Export:
local ok = exports.msk_core:VehicleUpdate(plate, fields)
```

## MSK.VehicleStore.ClearJob

Writes a real `NULL` into the job column. `Update` skips `nil` values, because a `nil` in a parameter list collapses it, so clearing a column needs its own call.

```lua
MSK.VehicleStore.ClearJob(plate)

-- As an Export:
local ok = exports.msk_core:VehicleClearJob(plate)
```

## MSK.VehicleStore.Delete

```lua
local removed = MSK.VehicleStore.Delete(plate)

-- As an Export:
local removed = exports.msk_core:VehicleDelete(plate)
```

Returns `true` only when a row was actually removed.

## MSK.VehicleStore.Browse

Paginated and filtered **in SQL**, so it stays usable on a table with thousands of rows. Built for admin lists.

**Parameters**
**opts** - `table` - `page`, `perPage` (max 100, default 25), `query`, `garage`, `type`, `model`, `job`, `owner`

**Returns**
**result** - `table` - `{total = integer, page = integer, perPage = integer, vehicles = table[]}`

```lua
local result = MSK.VehicleStore.Browse({
    page    = 1,
    perPage = 25,
    query   = 'Doe',     -- matches plate, owner and character name
    garage  = 'legion',
})

print(result.total)

for _, vehicle in ipairs(result.vehicles) do
    print(vehicle.plate, vehicle.ownerName, vehicle.model)
end

-- As an Export:
local result = exports.msk_core:VehicleBrowse(opts)
```

The name search joins the character table, which is `users` on ESX and `players` on QBCore and Qbox, where the name sits in a JSON column. If that join fails on a server whose tables were renamed, the query is retried without it rather than returning nothing. `ownerName` is then `nil`.

Searching by `model` compares against the hash column on QBCore and Qbox, and against the properties JSON on ESX, where the hash may be stored signed or unsigned depending on the version.
