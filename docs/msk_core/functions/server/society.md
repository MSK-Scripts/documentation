---
title: Society
sidebar_position: 12
---

# Society

Manage society / company bank accounts. These functions require a framework (**ESX** or **QBCore**) and the corresponding money resource:

- **ESX** — uses `esx_addonaccount` (shared account `society_<name>`)
- **QBCore** — uses `qb-banking` or `qb-management` (whichever is started)

:::info
All functions are **server-side** only. On **OXCore** and **STANDALONE** there is no society backend, so every function returns `0` / `false`.
:::

## MSK.Society.GetMoney

Get the current balance of a society account.

**Parameters**  
**society** - `string` - The society/account name (e.g. `'police'`)

**Returns**  
**money** - `number` - The current balance (returns `0` if the account does not exist)

```lua
local money = MSK.Society.GetMoney(society)

-- Example
local money = MSK.Society.GetMoney('police')
print(money)

-- As an Export:
local money = exports.msk_core:SocietyGetMoney(society)
```

## MSK.Society.AddMoney

Add money to a society account.

**Parameters**  
**society** - `string` - The society/account name  
**amount** - `number` - The amount to add (must be greater than `0`)

**Returns**  
**success** - `boolean` - Whether the money was added

```lua
local success = MSK.Society.AddMoney(society, amount)

-- Example
MSK.Society.AddMoney('police', 5000)

-- As an Export:
local success = exports.msk_core:SocietyAddMoney(society, amount)
```

## MSK.Society.RemoveMoney

Remove money from a society account. Fails if the account has insufficient funds.

**Parameters**  
**society** - `string` - The society/account name  
**amount** - `number` - The amount to remove (must be greater than `0`)

**Returns**  
**success** - `boolean` - Whether the money was removed

```lua
local success = MSK.Society.RemoveMoney(society, amount)

-- Example
if MSK.Society.RemoveMoney('police', 1000) then
    -- Money was removed successfully
end

-- As an Export:
local success = exports.msk_core:SocietyRemoveMoney(society, amount)
```
