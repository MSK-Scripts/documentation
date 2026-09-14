---
title: TextUI
sidebar_position: 4
---

# TextUI

The TextUI module shows a small help text with a key hint. `Show` keeps it visible until `Hide` is called, `ShowThread` hides it on its own shortly after it stops being called, which makes it the right choice inside a loop.

Calling `Show` again while the TextUI is open updates it in place. Calling it with exactly the same data does nothing, so it is safe to call it repeatedly.

The TextUI belongs to the resource that showed it. When that resource stops, the TextUI is hidden, so a restarted script no longer leaves a hint stuck on screen.

## MSK.TextUI.Show

Shows the TextUI and keeps it visible until it is hidden.

**Parameters**  
**data** - `table` - TextUI data

**Description**  
- **key** - `string/false` - Optional - Default: `'E'` - The key shown in the key box. `false` hides the key box  
- **text** - `string` - Text. Supports FiveM color codes such as `~g~`  
- **color** - `string` - Optional - Default: `Config.TextUIColor` - Color of the key box as hex  
- **icon** - `string` - Optional - FontAwesome icon. Short name (`car`) or full class (`fas fa-car`)  
- **iconColor** - `string` - Optional - Default: `color` - Color of the icon  
- **iconAnimation** - `string` - Optional - `spin`, `spinPulse`, `spinReverse`, `beat`, `beatFade`, `bounce`, `fade`, `flip`, `shake`  
- **position** - `string` - Optional - Default: `'bottom-center'` - `bottom-center`, `top-center`, `left-center`, `right-center`

```lua
MSK.TextUI.Show(data)

-- Example
MSK.TextUI.Show({
    key = 'E',
    text = 'Open ~g~garage~s~',
    icon = 'warehouse',
    iconAnimation = 'bounce',
    position = 'right-center',
})

-- Update the open TextUI, for example after something changed
MSK.TextUI.Show({ key = 'E', text = 'Garage ~r~full~s~', icon = 'warehouse' })

-- The module table is callable and forwards to Show:
MSK.TextUI({ key = 'E', text = 'Open garage' })

-- As an Export:
exports.msk_core:ShowTextUI(data)
```

:::warning[Deprecated]
The old form `MSK.TextUI.Show(key, text, color)` still works, but is deprecated and logs a warning once per resource. Use the table form instead:

```lua
MSK.TextUI.Show({ key = 'E', text = 'Press ~g~E~s~ to interact', color = '#5eb131' })
```
:::

## MSK.TextUI.ShowThread

Shows the TextUI and hides it about 100 ms after the last call. Designed to be called every frame while the player is in range.

**Parameters**  
**data** - `table` - TextUI data, same fields as [`MSK.TextUI.Show`](#msktextuishow)

```lua
MSK.TextUI.ShowThread(data)

-- Example
CreateThread(function()
    while true do
        local sleep = 250
        local distance = #(MSK.Player.coords - vector3(572.04, 2724.34, 42.05))

        if distance <= 2.5 then
            sleep = 0
            MSK.TextUI.ShowThread({ key = 'E', text = 'Press ~g~E~s~ to interact' })
        end

        Wait(sleep)
    end
end)

-- As an Export:
exports.msk_core:ShowTextUIThread(data)
```

:::warning[Deprecated]
The old form `MSK.TextUI.ShowThread(key, text, color)` still works, but is deprecated and logs a warning once per resource. Pass a table instead.
:::

## MSK.TextUI.Hide

Hides the TextUI.

```lua
MSK.TextUI.Hide()

-- As an Export:
exports.msk_core:HideTextUI()
```

## MSK.TextUI.Active

Checks if the TextUI is currently shown and returns its data.

**Returns**  
**isActive** - `boolean` - Whether the TextUI is shown  
**data** - `table/nil` - A copy of the shown data (`key`, `text`, `color`, `icon`, `iconColor`, `iconAnimation`, `position`)

```lua
local isActive, data = MSK.TextUI.Active()

-- As an Export:
local isActive, data = exports.msk_core:TextUIActive()
```
