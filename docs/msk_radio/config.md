---
title: Config
description: 'Configuration reference for MSK Radio: every option in config.lua, from framework selection to the Discord log.'
sidebar_position: 2
---

# Config

```lua
Config = {}
Config.Locale = 'de'
Config.Debug = true
Config.VersionChecker = true

Config.Framework = 'ESX' -- 'ESX' or 'QBCore'
Config.VoiceSystem = 'pma' -- 'saltychat', 'pma' or 'tokovoip'

Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then
        MSK.Notification(source, 'MSK Radio', message, typ, 5000)
    else
        MSK.Notification('MSK Radio', message, typ, 5000)
    end
end

Config.showMemberListButton = true
Config.showSpeakerButton = true  -- Only for saltychat
Config.RadioAnimation = true
Config.RadioAnimationTalking = true
Config.DisconnectOnItemRemove = true

Config.Command = {
    enable = true,
    command = 'radio',
    checkItem = true
}

Config.Hotkey = {
    enable = false,
    hotkey = 'J'
}

Config.Item = {
    enable = true,
    item = 'radio'
}

Config.EncryptedChannels = {
    [1] = {'police'},
    [1.1] = {'police'},
    [2] = {'fib'},
    [2.1] = {'fib'},
    [3] = {'ambulance'},
    [4] = {'doj'},
}
```
