---
title: Settings & Clipboard
sidebar_position: 10
---

# Settings & Clipboard

## Settings

msk_core gives every player a small settings menu for the language, the notification position and the notification sound. The settings are stored on the player's own machine (resource KVP), so they survive reconnects and server restarts. Scripts can read them and react when they change.

### Configuration

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

With `enable = true` the players open the menu with `/mskSettings` (or whatever you set as `command`). With `enable = false` no command is registered, but scripts can still open it with [`MSK.Settings.Open`](#msksettingsopen).

### Available settings

| Key | Type | Default | Description |
|---|---|---|---|
| `locale` | `string` | `''` | `''` follows the server language, otherwise a language code such as `'de'`. Used by `MSK.Locale` |
| `notifyPosition` | `string` | `''` | `''` is "Automatic", otherwise `top-left`, `top`, `top-right`, `center-left`, `center-right`, `bottom-left`, `bottom`, `bottom-right` |
| `notifySound` | `boolean` | `true` | Plays the notification sound |

:::info[The player's position wins]
A notification position the player picked here always wins over the `position` a script passes to [`MSK.Notification`](../notify.md#msknotification). The script's position is only used while the player's setting is "Automatic", and without either one notifications appear top left.

With `notifySound = false` notifications stay silent, including notifications that play a GTA sound.
:::

## MSK.Settings.Get

Returns one setting, or a copy of all settings when called without a key.

**Parameters**  
**key** - `string` - Optional - `locale`, `notifyPosition` or `notifySound`

**Returns**  
**value** - `any` - The value of the setting, or a table with all settings

```lua
MSK.Settings.Get(key)

-- Example
local locale = MSK.Settings.Get('locale')
local all = MSK.Settings.Get()

-- As an Export:
local locale = exports.msk_core:GetSetting('locale')
```

## MSK.Settings.GetAll

Returns a copy of all settings.

**Returns**  
**settings** - `table` - `{ locale = ..., notifyPosition = ..., notifySound = ... }`

```lua
local settings = MSK.Settings.GetAll()

-- As an Export:
local settings = exports.msk_core:GetSettings()
```

## MSK.Settings.Set

Changes a setting for the local player and saves it. An unknown key raises an error.

**Parameters**  
**key** - `string` - `locale`, `notifyPosition` or `notifySound`  
**value** - `any` - The new value

**Returns**  
**changed** - `boolean` - `false` when the value is not valid for this setting

```lua
MSK.Settings.Set(key, value)

-- Example
MSK.Settings.Set('notifyPosition', 'top-right')
MSK.Settings.Set('notifySound', false)

-- As an Export:
exports.msk_core:SetSetting('notifyPosition', 'top-right')
```

## MSK.Settings.Open

Opens the settings menu for the local player.

```lua
MSK.Settings.Open()

-- As an Export:
exports.msk_core:OpenSettings()
```

### msk_core:settingChanged

A local client event that fires whenever a setting changes.

```lua
AddEventHandler('msk_core:settingChanged', function(key, value)
    if key == 'locale' then
        print('The player switched the language to ' .. value)
    end
end)
```

## MSK.Clipboard.Set

Copies text to the player's clipboard.

**Parameters**  
**text** - `string/number` - The text to copy

```lua
MSK.Clipboard.Set(text)

-- Example
local coords = GetEntityCoords(PlayerPedId())
MSK.Clipboard.Set(('vec3(%.2f, %.2f, %.2f)'):format(coords.x, coords.y, coords.z))

-- As an Export:
exports.msk_core:SetClipboard(text)
```

There is no server function for it, but the server can trigger the net event directly:

```lua
TriggerClientEvent('msk_core:setClipboard', playerId, 'Text to copy')
```
