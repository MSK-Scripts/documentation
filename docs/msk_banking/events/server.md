---
title: Server
sidebar_position: 1
---

# Server Events

## Add / Remove / Set Money

**Parameters**  
**iban** - `string` - The IBAN of a Player

**Returns**  
**account** - `table <iban, money, account>`: `account` can be `'main'`, `'1'` or `'society'`

```lua
TriggerEvent('msk_banking:getSharedAccount', iban, function(account)
    print(account.iban, account.money, account.account)
end)
```

#### Add Money

```lua
TriggerEvent('msk_banking:getSharedAccount', iban, function(account)
    account.addMoney(amount)
end)
```

#### Remove Money

```lua
TriggerEvent('msk_banking:getSharedAccount', iban, function(account)
    account.removeMoney(amount)
end)
```

#### Set Money

```lua
TriggerEvent('msk_banking:getSharedAccount', iban, function(account)
    account.setMoney(amount)
end)
```

## setSharedAccountMoney

This EventHandler is triggered whenever an account is saved.

**Returns**  
**data** - `table <iban, money, account>`

```lua
AddEventHandler('msk_banking:setSharedAccountMoney', function(data)
    print(data.iban, data.money, data.account)
end)
```
