---
title: Offline
sidebar_position: 14
---

# Offline

Read and modify the **bank balance of a player by identifier**, no matter if the player is online or not. Requires a framework (**ESX**, **QBCore** or **Qbox**).

The `identifier` parameter depends on the framework:

- **ESX**: the player `identifier` (e.g. `license:xxxxxxxx`), reads and writes `users.accounts`
- **QBCore** and **Qbox**: the player `citizenid`, reads and writes `players.money`

:::info
All functions are **server-side** only and run synchronous database queries (via oxmysql). In **STANDALONE** there is no mapping, so every function returns `nil` or `false`.
:::

:::info[Online players]
When the player is online, the functions go through the framework (`GetMoney`, `AddMoney` and `RemoveMoney` on the `bank` account) instead of the database. Writing the database directly for an online player was overwritten by the framework's next save, so added money vanished again and removed money came back.

For an offline player the database is changed directly.
:::

## MSK.Offline.GetBank

Get the bank balance of an offline player.

**Parameters**  
**identifier** - `string` - The player identifier (ESX) or citizenid (QBCore and Qbox)

**Returns**  
**bank** - `number?` - The bank balance, or `nil` if the player was not found

```lua
local bank = MSK.Offline.GetBank(identifier)

-- Example
local bank = MSK.Offline.GetBank('license:xxxxxxxxxxxxxxxx')
print(bank)

-- As an Export:
local bank = exports.msk_core:OfflineGetBank(identifier)
```

## MSK.Offline.AddBank

Add money to an offline player's bank balance.

**Parameters**  
**identifier** - `string` - The player identifier (ESX) or citizenid (QBCore and Qbox)  
**amount** - `number` - The amount to add (must be greater than `0`)

**Returns**  
**success** - `boolean` - Whether the update affected a row

```lua
local success = MSK.Offline.AddBank(identifier, amount)

-- Example
MSK.Offline.AddBank('license:xxxxxxxxxxxxxxxx', 2500)

-- As an Export:
local success = exports.msk_core:OfflineAddBank(identifier, amount)
```

## MSK.Offline.RemoveBank

Remove money from an offline player's bank balance. The deduction is **atomic**, the SQL `WHERE` guard ensures it only succeeds if the player has sufficient funds.

**Parameters**  
**identifier** - `string` - The player identifier (ESX) or citizenid (QBCore and Qbox)  
**amount** - `number` - The amount to remove (must be greater than `0`)

**Returns**  
**success** - `boolean` - Whether the money was removed (false if funds were insufficient)

```lua
local success = MSK.Offline.RemoveBank(identifier, amount)

-- Example
if MSK.Offline.RemoveBank('license:xxxxxxxxxxxxxxxx', 500) then
    -- Money was removed successfully
end

-- As an Export:
local success = exports.msk_core:OfflineRemoveBank(identifier, amount)
```

## MSK.Offline.GetPlayerTable

Where the running framework keeps its characters, and under which key column. New in v4.0.0.

Scripts that hang their own column on the character table used to guess `users`, which is right on exactly one framework out of three.

**Returns**
**info** - `table` | `nil` - `{table = string, identifier = string}`, `nil` in STANDALONE

```lua
local info = MSK.Offline.GetPlayerTable()

-- ESX              -> {table = 'users',   identifier = 'identifier'}
-- QBCore and Qbox  -> {table = 'players', identifier = 'citizenid'}

if info then
    MySQL.query.await(('ALTER TABLE `%s` ADD COLUMN IF NOT EXISTS `myColumn` INT DEFAULT 0'):format(info.table))

    local value = MySQL.scalar.await(
        ('SELECT `myColumn` FROM `%s` WHERE `%s` = ?'):format(info.table, info.identifier),
        {identifier}
    )
end

-- As an Export:
local info = exports.msk_core:GetPlayerTable()
```
