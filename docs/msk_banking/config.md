---
title: Config
description: 'Configuration reference for MSK Banking: every option in config.lua, from locale and debug to the Discord log.'
sidebar_position: 3
---

# Config

```lua
Config = {}
Config.Locale = 'de'
Config.Debug = true
Config.VersionChecker = true

Config.DiscordLog = true
Config.botColor = "6205745"
Config.botName = "MSK Scripts"
Config.botAvatar = "https://i.imgur.com/PizJGsh.png"

Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then
        MSK.Notification(source, 'MSK Banking', message, typ, 5000)
    else
        MSK.Notification('MSK Banking', message, typ, 5000)
    end
end

Config.Hotkey = 38 -- default: 38 = E

Config.MSKNumpad = {
    enable = true,
    showPIN = false
}

Config.Investment = {
    enable = true,
    atATM = false,
    time = 3, -- in hours
    dynamic = {
        enable = true,
        chance = 60
    },
    percentage = {
        min = 1,
        max = 3
    },
    notification = true
}

Config.Bills = {
    enable = true,
    atATM = false,
}

Config.Transactions = true

Config.PIN = {
    enable = true,
    price = 50,
    length = 4
}

Config.IBAN = {
    enable = true,
    delete = true,
    prefix = 'SA',
    length = 6,
    design = false,
    price = 500
}

Config.Bankcard = {
    enable = true,
    item = 'bankcard',
    price = 100
}

Config.Society = {
    enable = true,
    addon_account = true,
    addon_account_sync_money = true,
    atATM = true,
    jobs = {
        ['police'] = {label = 'LSPD', iban = 'LSPD', grade_name = {'boss', 'boss2'}},
        ['ambulance'] = {label = 'LSMC', iban = 'LSMC', grade_name = {'boss', 'boss2'}},
        ['mechanic'] = {label = 'LSC', iban = 'LSC', grade_name = {'boss', 'boss2'}},
    }
}

Config.ATMs = {
    models = {-870868698, -1126237515, -1364697528, 506770882},
    robbery = {
        enable = true,
        hotkey = 47,
        timeout = 5,
        neededItem = {enable = true, item = 'lockpick'},
        money = {
            method = 'money',
            maxTimes = 5,
            interval = 10,
            minAmount = 1000,
            maxAmount = 5000
        },
        jobs = {
            neededCops = 1,
            notifyJobs = {'police', 'fib'},
            blacklistJobs = {'police', 'fib', 'ambulance'}
        },
    }
}
```
