---
title: Society
sidebar_position: 13
---

# Society

Manage society and company bank accounts.

Since **v4.0.0** these follow the **banking resource, not the framework**. Before that the code branched on the framework, so a Qbox server got a hard `0` back no matter what was installed.

The first of these that is started wins:

1. `Renewed-Banking`
2. `qb-banking`
3. `qb-management`
4. `esx_addonaccount` (ESX only, shared account `society_<name>`)

:::info
All functions are **server-side** only. When none of the four resources runs, every function returns `0` or `false`.
:::

## MSK.Society.GetProvider

Which banking resource was picked. Useful in a startup check, and the fastest way to find out why a society balance stays at zero. New in v4.0.0.

**Returns**
**name** - `string` | `nil` - The resource name, `nil` when none was found

```lua
local provider = MSK.Society.GetProvider()

if not provider then
    print('No banking resource found, society accounts stay at 0')
end

-- As an Export:
local provider = exports.msk_core:SocietyGetProvider()
```

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
