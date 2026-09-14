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
-- Supported: AUTO, ESX, QBCore, Qbox, STANDALONE
-- AUTO searches for your framework (qbx_core > es_extended > qb-core)
Config.Framework = 'AUTO'
```

See [Frameworks](./frameworks.md) for how detection works and what STANDALONE means.

:::danger[`OXCore` is gone since v4.0.0]
The ox_core branch was removed. `Config.Framework = 'OXCore'` stops the resource on start with an explicit message. Set it to `AUTO` or to a supported framework.
:::

## Inventory

```lua
-- Supported: AUTO, default, custom, ox_inventory, jaksam_inventory, core_inventory
-- AUTO order: ox_inventory > core_inventory > jaksam_inventory > default
-- 'default' = the inventory built into the running framework
-- 'custom'  = your own implementation in inventories/server/custom.lua
Config.Inventory = 'AUTO'
```

Framework and inventory are independent since v4.0.0, every combination that exists on a server is allowed. The one exception is Qbox with `default`: Qbox has no inventory of its own, so msk_core warns on start and the item functions stay unavailable until `ox_inventory` runs.

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

## Radial menu

Scripts add their entries with [`MSK.Radial`](./functions/client/ui/radial.md). Players can change the key in the FiveM key bindings (Settings, Key Bindings, FiveM).

```lua
Config.Radial = {
    enable = true,
    key = 'Z',   -- Default key
    hold = true, -- true = open while the key is held, false = press to open and close
}
```

## Player settings

A menu where every player picks their language, the notification position and whether notifications play a sound. The choice is stored on the player's client.

```lua
Config.Settings = {
    enable = true,
    command = 'mskSettings',

    -- Languages a player can choose. The empty value follows the server language (convar msk:locale)
    locales = {
        {value = '', label = 'Server language'},
        {value = 'en', label = 'English'},
        {value = 'de', label = 'Deutsch'},
    },
}
```

:::info
The player's notification position wins over a `position` a script passes. Only while a player keeps the setting on automatic does the script decide.
:::

## Zone creator

`/zoneCreator box`, `/zoneCreator sphere` or `/zoneCreator poly` lets you draw a zone in game and copies the finished [`MSK.Zones`](./functions/client/zones.md) code to the clipboard.

```lua
Config.ZoneCreator = {
    enable = true,
    command = 'zoneCreator',
    groups = {'superadmin', 'god', 'admin'}
}
```

## txAdmin

Shows txAdmin messages as MSK notifications. txAdmin still shows its own message as well, see `modules/TxAdmin/server.lua` if you want to hide it.

```lua
Config.TxAdmin = {
    announcements = false,
    directMessages = false,
    restartWarnings = false,
    duration = 15000,
}
```

## Convars

Everything that contains a key or a password is set through convars in your `server.cfg`, never in `config.lua`.

```ini
# Callback timeout in milliseconds (default 5000)
set msk:callbackTimeout 5000

# Server language used by MSK.Locale
setr msk:locale "en"

# Logger, see the Logger page for every service
set msk:logger "loki"   # loki | datadog | fivemanage
```

:::danger[Use `set`, not `setr`, for the logger]
`setr` replicates a convar to every client. An API key set that way can be read by any player.
:::

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
