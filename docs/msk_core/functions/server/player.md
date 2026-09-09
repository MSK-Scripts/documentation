---
title: Player
sidebar_position: 2
---

# Player

Everything about a player goes through one shape. `MSK.GetPlayer(id)` returns the **same fields on ESX, QBCore and Qbox**, so a script does not have to know which framework it is running on.

:::info[Requires a framework]
The functions on this page are **not registered in `STANDALONE` mode**. The one exception is the mirrored table `MSK.Player[source]` further down, which needs no framework.
:::

:::danger[Breaking in v4.0.0]
`MSK.GetPlayer()` no longer returns the raw framework object. Field names changed: `grade_name` is `gradeName`, `grade_label` is `gradeLabel`, `grade_salary` is `salary`, `dateofbirth` is `dob`. Money is `player.money.cash` and `player.money.bank`. See the [v4.0.0 changelog](../../changelog/v4.0.0.md).
:::

## The player table

```lua
{
    source     = 1,                     -- server id, nil when the player is offline
    identifier = 'license:abc123',      -- ESX identifier / citizenid
    license    = 'license:abc123',
    name       = 'John Doe',
    firstName  = 'John',
    lastName   = 'Doe',
    dob        = '1990-01-01',
    sex        = 'male',                -- 'male' or 'female', identical everywhere
    phone      = '0123456789',          -- nil on ESX
    group      = 'admin',
    job        = {},                    -- see below
    jobs       = {police = 3},          -- name -> grade
    gang       = nil,                   -- nil when the framework has no gangs
    gangs      = {},
    money      = {cash = 500, bank = 12000, black = 0},
    metadata   = {},
    position   = vector3(0.0, 0.0, 0.0),
}
```

`jobs` and `gangs` are filled on **every** framework. On Qbox that is the real multijob map, on ESX and QBCore it holds the single job the player has, so consumer code can read `player.jobs` without asking which framework it is on.

### Job and gang

`job` and `gang` always look the same:

```lua
{
    name       = 'police',
    label      = 'Police Department',
    grade      = 3,
    gradeName  = 'sergeant',
    gradeLabel = 'Sergeant',
    salary     = 120,
    isBoss     = false,
    onDuty     = true,
}
```

## MSK.GetPlayer

Returns the player object: the table above plus its methods.

**Parameters**
**id** - `number` | `string` | `table` - A server id, an identifier or citizenid, or a table: `{source = }`, `{identifier = }`, `{citizenid = }`, `{phone = }`, `{userId = }`

**Returns**
**player** - `table` | `nil` - The player object, `nil` when nobody matches

```lua
local player = MSK.GetPlayer(source)
local player = MSK.GetPlayer('license:abc123')
local player = MSK.GetPlayer({citizenid = 'ABCD1234'})

if player then
    print(player.name, player.job.label, player.money.bank)
end
```

:::warning[Methods only exist inside your resource]
Functions do not survive an export. The methods are built by `modules/Player`, which `import.lua` compiles into your resource, so `MSK.GetPlayer(...)` gives you a full object. `exports.msk_core:GetPlayerData(id)` gives you the **data only**. Before v4.0.0 every method arrived as `nil`.
:::

## Player methods

**Job and gang**

```lua
player.SetJob(name, grade)              -- boolean
player.SetGang(name, grade)             -- boolean, false on ESX
player.SetDuty(onDuty)                  -- boolean
player.AddJob(name, grade)              -- boolean, replaces the job on ESX and QBCore
player.RemoveJob(name)                  -- boolean
player.AddGang(name, grade)             -- boolean
player.RemoveGang(name)                 -- boolean
player.HasJob(name, minGrade)           -- boolean
player.HasGang(name, minGrade)          -- boolean
player.IsBoss()                         -- boolean
player.IsOnDuty()                       -- boolean
```

**Money**

```lua
player.GetMoney(account)                    -- number, account: 'cash', 'bank' or 'black'
player.AddMoney(account, amount, reason)    -- boolean
player.RemoveMoney(account, amount, reason) -- boolean
player.SetMoney(account, amount, reason)    -- boolean
```

**Metadata**

```lua
player.GetMeta(key)                     -- any
player.SetMeta(key, value)              -- boolean
```

**Inventory**

```lua
player.GetInventory()                          -- table
player.GetItem(name, metadata)                 -- table or nil
player.HasItem(name, count, metadata)          -- boolean
player.AddItem(name, count, metadata, slot)    -- boolean
player.RemoveItem(name, count, metadata, slot) -- boolean
player.AddWeapon(name, count, metadata, slot)
player.RemoveWeapon(name, count, metadata, slot)
player.GetWeapon(name, metadata)
player.CanCarryItem(name, count, metadata)     -- boolean or nil
player.CanSwapItem(a, aCount, b, bCount)       -- boolean or nil
player.SetMaxWeight(kilograms)                 -- boolean or nil
player.ClearInventory()                        -- boolean or nil
```

:::warning[nil is not false]
`CanCarryItem`, `CanSwapItem`, `SetMaxWeight` and `ClearInventory` answer `nil` when the running inventory cannot do it. That is not the same as `false`. Until v4.0.0 `CanCarryItem` answered `true` without checking on QBCore and Qbox, and an item handed out on that promise ends up on the floor.
:::

**Actions**

```lua
player.Notify(title, message, type, duration)
player.Kick(reason)
player.Save()
player.Refresh()                        -- re-reads the framework data
player.IsOnline()                       -- boolean
player.GetCoords()                      -- vector3 or nil
player.SetCoords(coords)                -- boolean
player.GetPed()                         -- number or nil
```

## MSK.GetPlayers

Returns the player **data** of everyone online, optionally filtered.

**Parameters**
**key** - `string` - `'job'`, `'gang'` or `'group'` (optional)
**value** - `string` - The value to filter by (optional)

**Returns**
**players** - `table[]` - List of player tables, without methods

```lua
local players = MSK.GetPlayers()
local police  = MSK.GetPlayers('job', 'police')

-- As an Export:
local players = exports.msk_core:GetPlayers(key, value)
```

:::note
`MSK.GetPlayers` deliberately returns data without methods, which is what you want for counting and filtering. Feed a `source` back into `MSK.GetPlayer` when you need to act on one of them.
:::

## Lookup shortcuts

All of these are wrappers around `MSK.GetPlayer` and return the full player object.

```lua
MSK.GetPlayerFromId(playerId)             -- by server id
MSK.GetPlayerFromIdentifier(identifier)   -- by identifier
MSK.GetPlayerByCitizenId(citizenid)       -- same as above, QBCore and Qbox wording
MSK.GetPlayerByPhone(phone)               -- nil on ESX, which has no phone on the player
MSK.GetPlayerByUserId(userId)             -- Qbox only, nil everywhere else
```

## MSK.GetPlayerJob

**Parameters**
**id** - `number` | `string` | `table` - Same forms as `MSK.GetPlayer`

**Returns**
**job** - `table` | `nil` - The job table

```lua
local job = MSK.GetPlayerJob(source)

if job and job.name == 'police' and job.onDuty then
    -- ...
end

-- Also available:
local gang = MSK.GetPlayerGang(source)   -- nil on ESX
local jobs = MSK.GetPlayerJobs(source)   -- table<string, integer>

-- Older wrapper names, unchanged:
local job = MSK.GetPlayerJobFromId(playerId)
local job = MSK.GetPlayerJobFromIdentifier(identifier)
local job = MSK.GetPlayerJobByCitizenId(citizenid)
```

## MSK.GetJobs

Every job **definition** the framework knows, not the players holding them. New in v4.0.0.

Each framework keeps this somewhere else: ESX behind `ESX.GetJobs()`, QBCore in `QBCore.Shared.Jobs`, Qbox behind its own export. A script that only wants to fill a dropdown no longer has to know all three.

**Returns**
**jobs** - `table<string, table>` - Keyed by job name

```lua
local jobs = MSK.GetJobs()

for name, job in pairs(jobs) do
    print(name, job.label, #job.grades)
end
```

```lua
-- One entry looks like this
{
    name   = 'police',
    label  = 'Police Department',
    grades = {
        {grade = 0, name = 'recruit', label = 'Recruit', salary = 50, isBoss = false},
        {grade = 1, name = 'officer', label = 'Officer', salary = 75, isBoss = false},
    },
}
```

The grades are normalised into a list sorted by grade number, no matter how the framework stored them. ESX repeats the number inside the entry, QBCore and Qbox keep it in the key, and the pay field is `salary` on one side and `payment` on the other.

## MSK.GetGangs

Same shape as `MSK.GetJobs`, for gangs. **Empty on ESX**, which has no gangs.

```lua
local gangs = MSK.GetGangs()
```

## MSK.GetPlayerIdentifier

```lua
local identifier = MSK.GetPlayerIdentifier(id)   -- alias: MSK.GetIdentifier
local playerId   = MSK.GetPlayerServerId(id)     -- alias: MSK.GetServerId
```

Both take a server id, an identifier or a table, same as `MSK.GetPlayer`.

## MSK.HasPlayerItem

```lua
local hasIt = MSK.HasPlayerItem(id, itemName, count, metadata)
```

Takes the same id forms as `MSK.GetPlayer` and routes to the inventory bridge. See [Inventory](./inventory.md).

## MSK.Player[source]

A mirrored table of what a client reports about **itself**: ped, vehicle, seat, weapon. It is fed by the `msk_core:onPlayer` net event and is independent of the framework data above, so it works in `STANDALONE` too.

Computed keys (`coords`, `heading`, `state`) are resolved on access, everything else comes from the client's updates.

**Properties**
**clientId** - `number` - Player index on the client, equal to `PlayerId()`
**serverId** - `number` - Server id
**playerId** - `number` - Alias of `serverId`
**ped** - `number` - Player ped, equal to `GetPlayerPed(source)`
**playerPed** - `number` - Alias of `ped`
**coords** - `vector3` - Equal to `GetEntityCoords(ped)`
**heading** - `float` - Equal to `GetEntityHeading(ped)`
**state** - `table` - The state bag, equal to `Player(serverId).state`
**vehicle** - `number` - The vehicle entity, resolved from the replicated network id
**vehNetId** - `number` - The network id of that vehicle
**seat** - `number` - Seat index
**weapon** - `number` - Hash of the current weapon
**isDead** - `boolean` - Whether the player is dead
**Notify** - `function` - Shorthand for `MSK.Notification(source, title, message, type, duration)`

```lua
local playerPed = MSK.Player[source].ped
local coords = MSK.Player[source].coords
local vehicle = MSK.Player[source].vehicle
local seat = MSK.Player[source].seat

MSK.Player[source].Notify(title, message, type, duration)
```

Every change also fires an event:

```lua
AddEventHandler('msk_core:OnPlayer', function(playerId, key, value, oldValue) end)
```

## MSK.GetMirroredPlayer

Returns `MSK.Player[id]` directly. This is what a consumer resource reads the mirror through.

```lua
local player = MSK.GetMirroredPlayer(id)
local coords = MSK.GetMirroredPlayer(source).coords

-- As an Export:
local player = exports.msk_core:GetMirroredPlayer(id)
```
