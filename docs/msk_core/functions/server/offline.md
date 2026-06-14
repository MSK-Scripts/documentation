---
title: Offline
sidebar_position: 13
---

# Offline

Read and modify the **bank balance of offline players** directly in the database. Requires a framework (**ESX** or **QBCore**).

The `identifier` parameter depends on the framework:

- **ESX** — the player `identifier` (e.g. `license:xxxxxxxx`) → reads/writes `users.accounts`
- **QBCore** — the player `citizenid` → reads/writes `players.money`

:::info
All functions are **server-side** only and run synchronous database queries (via oxmysql). On **OXCore** and **STANDALONE** there is no mapping, so every function returns `nil` / `false`.
:::

:::warning
These functions write directly to the database. Use them only for offline players — for online players use the framework's own money functions so the client stays in sync.
:::

## MSK.Offline.GetBank

Get the bank balance of an offline player.

**Parameters**  
**identifier** - `string` - The player identifier (ESX) or citizenid (QBCore)

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
**identifier** - `string` - The player identifier (ESX) or citizenid (QBCore)  
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

Remove money from an offline player's bank balance. The deduction is **atomic** — the SQL `WHERE` guard ensures it only succeeds if the player has sufficient funds.

**Parameters**  
**identifier** - `string` - The player identifier (ESX) or citizenid (QBCore)  
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
