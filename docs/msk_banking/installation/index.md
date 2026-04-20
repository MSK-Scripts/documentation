---
title: Installation
sidebar_position: 2
---

# Installation

1. Upload the `msk_banking` folder.
2. Add `ensure msk_banking` to your `server.cfg`.
3. Configure the `config.lua` before starting the script.
4. Add the items configured in `config.lua` to your inventory or database.
5. Restart your server.

The SQL will be created automatically.

## es_extended

Go to `es_extended/server/classes/player.lua` line `~168` and find `function self.setAccountMoney(accountName, money)`.

Add the following lines if not already present:

```lua
TriggerEvent('esx:setAccountMoney', self.source, accountName, money)
TriggerEvent('esx:addAccountMoney', self.source, accountName, money)
TriggerEvent('esx:removeAccountMoney', self.source, accountName, money)
```

## esx_addonaccount

Go to `esx_addonaccount/server/main.lua`. If you don't have a function like the following, redownload `esx_addonaccount` from ESX Github.

```lua title="addonaccount.lua"
function AddSharedAccount(society, amount)
    if type(society) ~= 'table' or not society?.name or not society?.label then return end

    local account = MySQL.insert.await('INSERT INTO `addon_account` (name, label, shared) VALUES (?, ?, ?)', {
        society.name, society.label, 1
    })
    if not account then return end

    local account_data = MySQL.insert.await('INSERT INTO `addon_account_data` (account_name, money) VALUES (?, ?)', {
        society.name, (amount or 0)
    })
    if not account_data then return end

    SharedAccounts[society.name] = CreateAddonAccount(society.name, nil, (amount or 0))
end
```

## Jobs

If you want to use Society Accounts, add all jobs to `Config.Society` so the script works as expected.

## Bankcard Prop

If you want to use a Bankcard Prop, set the following config option to `true`:

```lua
Config.Animation = {
    useBankcardProp = true
}
```

You will need this prop pack: https://forum.cfx.re/t/free-props-wallet-props-cards-and-key-car/5039912
