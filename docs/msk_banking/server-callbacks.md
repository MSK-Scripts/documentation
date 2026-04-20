---
title: Server Callbacks
sidebar_position: 5
---

# Server Callbacks

## hasBankcard

**Returns**  
**hasBankcard** - `boolean` - If the Player has a Bankcard or not

```lua
local hasBankcard = MSK.Trigger('msk_banking:hasBankcard')
```

## getMainAccount

**Returns**  
**mainAccount** - `table <identifier, cash, bank, iban>`

```lua
local mainAccount = MSK.Trigger('msk_banking:getMainAccount')
```

## getSecondAccount

**Returns**  
**secondAccount** - `table <identifier, bank, iban>`

```lua
local secondAccount = MSK.Trigger('msk_banking:getSecondAccount')
```

## getSocietyAccounts

**Parameters**  
**jobname** - `string` - The job you want the data from

**Returns**  
**societyAccount** - `table <identifier, bank, iban, name, label>`

```lua
local societyAccount = MSK.Trigger('msk_banking:getSocietyAccounts', 'police')

--[[
societyAccount.identifier -- 'police'
societyAccount.bank       -- 5035
societyAccount.iban       -- 'SALSPD'
societyAccount.name       -- 'society_police'
societyAccount.label      -- 'LSPD'
]]
```

## getPIN

**Returns**  
**pin** - `string` - PIN

```lua
local pin = MSK.Trigger('msk_banking:getPIN')
```

## getInvestment

**Returns**  
**invest** - `number` - The current Investment Amount

```lua
local invest = MSK.Trigger('msk_banking:getInvestment')
```
