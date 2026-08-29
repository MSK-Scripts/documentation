---
title: Benachrichtigungen ändern
sidebar_position: 1
---

# Benachrichtigungen ändern

## MSK Core

Willst du die Benachrichtigungen für **ALLE** Scripts umstellen, öffne
`msk_core/config.lua` und ändere Folgendes:

```lua
Config.Notification = 'custom'

Config.customNotification = function(title, message, typ, duration)
    -- Add your own clientside Notification here
end
```

## Einzelnes Script

Willst du die Benachrichtigungen nur für ein einziges Script umstellen, öffne die
`config.lua` genau dieses Scripts und ändere Folgendes:

```lua
Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then
        -- Add your serverside notification here
    else
        -- Add your clientside notification here
    end
end
```

## ESX

Willst du die Benachrichtigung von ESX durch unsere ersetzen, öffne
`es_extended/client/functions.lua` und suche nach `function ESX.ShowNotification`.

Ersetze diese Funktion durch die folgende:

```lua
function ESX.ShowNotification(message, notifyType, length)
    if GetResourceState("msk_core") ~= "missing" then
        return exports["msk_core"]:Notification('Information', message, notifyType, length)
    end

    print("[^1ERROR^7] ^5MSK Notify^7 is Missing!")
end
```
