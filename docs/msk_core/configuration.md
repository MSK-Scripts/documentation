---
title: Configuration
sidebar_position: 3
---

# Configuration

All settings live in `msk_core/config.lua`. This page walks through every option.

## General

```lua
Config.Debug = false          -- Enables verbose debug logging
Config.VersionChecker = true  -- Self version check of msk_core on start
```

## Framework

```lua
-- Supported: AUTO, ESX, QBCore, STANDALONE
-- AUTO detects your framework automatically
Config.Framework = 'AUTO'
```

See [Frameworks](./frameworks.md) for how detection works and what STANDALONE means.

## Inventory

```lua
-- Supported: AUTO, default, custom, ox_inventory, jaksam_inventory, core_inventory
-- AUTO order: ox_inventory > core_inventory > jaksam_inventory > default
-- 'default' = ESX default inventory / Chezza inventory
-- 'custom'  = your own implementation in inventories/server/custom.lua
Config.Inventory = 'AUTO'
```

## Coords commands

Admin helpers to print / copy your current coordinates (see [Coords](./functions/client/coords.md)).

```lua
Config.showCoords = {
    enable = true,
    command = 'coords',
    groups = {'superadmin', 'admin'}
}

Config.copyCoords = {
    enable = true,
    command = 'copyCoords',
    groups = {'superadmin', 'admin'}
}
```

## Notifications

```lua
-- 'msk'      -> MSK UI Notification
-- 'native'   -> FiveM Native Notification
-- 'custom'   -> Config.customNotification()
-- 'okok'     -> OKOK Notification
-- 'qb-core'  -> QBCore Notification
-- 'bulletin' -> bulletin notification
Config.Notification = 'msk'
```

`Config.NotifyTypes` defines the icon and color per notification type used by the MSK UI (`general`, `info`, `success`, `warning`, `error`). Icons use [FontAwesome](https://fontawesome.com/icons), colors use the MSK palette.

```lua
Config.NotifyTypes = {
    ['general'] = {icon = 'fa-solid fa-circle-info', color = '#f0ede8'},
    ['info']    = {icon = 'fa-solid fa-circle-info', color = '#75d6ff'},
    ['success'] = {icon = 'fa-solid fa-shield-check', color = '#00e676'},
    ['warning'] = {icon = 'fa-solid fa-triangle-exclamation', color = '#facc15'},
    ['error']   = {icon = 'fa-solid fa-circle-exclamation', color = '#f43f5e'},
}

Config.customNotification = function(title, message, typ, duration)
    -- Used when Config.Notification = 'custom'
end
```

### Advanced & Help notifications

```lua
-- 'native' / 'custom' / 'bulletin'
Config.AdvancedNotification = 'native'
Config.customAdvancedNotification = function(text, title, subtitle, icon, flash, icontype) end

-- 'msk' / 'native' / 'custom'
Config.HelpNotification = 'msk'
Config.customHelpNotification = function(text) end  -- called every frame
```

See [Notify](./functions/client/notify.md) for the matching functions.

## Colors

```lua
Config.ProgressColor = "#00e676"  -- Default Progressbar color (MSK green)
Config.TextUIColor   = "#00e676"  -- Default TextUI color (MSK green)
```

## Logging

```lua
Config.LoggingTypes = {
    ['debug'] = '[^3DEBUG^0]',
    ['info']  = '[^4Info^0]',
    ['warn']  = '[^3Warning^0]^3',
    ['error'] = '[^1ERROR^0]^1',
}
```

Used by [`MSK.Logging`](./functions/shared/index.md).

## Disconnect Logger

```lua
Config.DisconnectLogger = {
    enable = false,
    console = { enable = false, text = "..." },
    discord = {
        enable = false,
        color = "6205745",
        botName = "MSK Scripts",
        botAvatar = "https://i.imgur.com/PizJGsh.png",
        title = "Player Disconnected",
        text = "The player **%s** with the **ID %s** has left the server."
    }
}
```

See [Disconnect Logger](./functions/server/disconnect-logger.md).

## Ban System

```lua
Config.BanSystem = {
    enable = true,
    discordLog = false,
    botColor = "6205745",
    botName = "MSK Scripts",
    botAvatar = "https://i.imgur.com/PizJGsh.png",
    commands = {
        enable = true,
        groups = {'superadmin', 'admin', 'god'},
        ban = 'banPlayer',
        unban = 'unbanPlayer'
    }
}
```

See [Ban System](./functions/server/ban-system.md).
