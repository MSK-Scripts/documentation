---
title: Config
description: 'Configuration reference for MSK Whitelist: every option in config.lua, from locale and debug to the Discord log.'
sidebar_position: 2
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

Config.Notification = function(source, message, typ, duration)
    if IsDuplicityVersion() then
        MSK.Notification(source, 'MSK Whitelist', message, typ, duration)
    else
        MSK.Notification('MSK Whitelist', message, typ, duration)
    end
end

Config.Locations = {
    einreise = vector3(-1042.46, -2745.62, 21.36),
    admin_inside = vector3(-1082.14, -2826.92, 27.71),
    admin_outside = 'last_position', -- 'last_position' or vector3(...)
    player_back_in = vector3(-1129.47, -2788.55, 27.71),
    bell = {enable = true, distance = 10.0, size = 0.5, location = vector3(-1084.69, -2831.37, 27.60), timeout = 10}
}

Config.NameTags = {
    enable = true,
    distance = 10.0,
    showHealth = true,
    showOwnID = true
}

Config.TPBackDistance = 150
Config.AdminGroups = {'superadmin', 'admin'}

Config.Commands = {
    einreise = 'einreise',
    admin_inside = 'rein',
    admin_outside = 'raus',
    ausreise = {
        command = 'ausreise',
        teleport = true,
        clear_inventory = true,
        clear_weapons = true,
        clear_money = true,
        banPlayer = {enable = true, time = 2}
    }
}

Config.BanPlayer = {enable = true, time = 'perma'}
```
