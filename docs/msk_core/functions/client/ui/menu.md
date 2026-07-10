---
title: Menu
sidebar_position: 6
---

# Menu

The Menu module opens a keyboard navigated list menu in the style of a classic NativeUI menu. It supports a highlighted row, side scroll values, checkboxes and progress bars.

:::tip[The player keeps full control]
A menu deliberately does **not** take NUI focus. The arrow keys are read through the game controls, and only those navigation controls are disabled while the menu is open. Everything else keeps working, so the player can **walk, drive and do anything else** with the menu on screen. If you need mouse interaction instead, use the [Context Menu](./context.md).
:::

The whole menu state (selected row, current values, checkbox states) lives in Lua. The NUI is only a render layer, which means your callbacks always receive the authoritative state.

## MSK.RegisterMenu

Registers (or overwrites) a menu under an id.

**Parameters**  
**id** - `string` - Unique id of the menu  
**data** - `table` - The menu definition

### Menu fields

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Header text |
| `position` | `string` | `top-left` (default), `center`, `left`, `right`, `top`, `bottom`, `top-right`, `bottom-left`, `bottom-right` |
| `canClose` | `boolean` | `false` prevents closing with the back key. Default `true` |
| `disableInput` | `boolean` | `true` freezes the navigation completely |
| `startIndex` | `number` | Row that is selected when the menu opens. Default `1` |
| `onSelected` | `function` | `(selected, item, args)` - fires whenever the highlight moves |
| `onSideScroll` | `function` | `(selected, index, args)` - fires when a value is scrolled left/right |
| `onCheck` | `function` | `(selected, checked, args)` - fires when a checkbox is toggled |
| `onClose` | `function` | `(key)` - fires when the menu closes. `key` is `select`, `cancel`, `replace` or `forced` |
| `items` | `table` | Array of items (see below) |

### Item fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable id of the item. Required if you want to use [`MSK.UpdateMenu`](#mskupdatemenu) on it |
| `label` | `string` | Label. Supports FiveM color codes such as `~g~` |
| `description` | `string` | Smaller text below the label |
| `icon` | `string` | FontAwesome icon. Short name (`car`) or full class (`fas fa-car`) |
| `iconColor` | `string` | Overrides the icon color |
| `values` | `table` | Turns the row into a side scroll selector. Array of strings, or of `{ label = '...', description = '...' }` |
| `defaultIndex` | `number` | Preselected entry of `values`. Default `1` |
| `checked` | `boolean` | Turns the row into a checkbox. `Enter` toggles it and fires `onCheck` |
| `progress` | `number` | `0` to `100`. Renders a progress bar inside the row |
| `colorScheme` | `string` | Color of the progress bar |
| `close` | `boolean` | `false` keeps the menu open after selecting. Default `true` |
| `onSelect` | `function` | Called with `args` when the item is selected with `Enter` |
| `event` | `string` | Client event triggered with `args` on select |
| `serverEvent` | `string` | Server event triggered with `args` on select |
| `args` | `any` | Passed to `onSelect`, `event`, `serverEvent` and the menu callbacks |
| `disabled` | `boolean` | Greyed out and skipped while navigating |

```lua
MSK.RegisterMenu('tuning_menu', {
    title = 'Options',
    position = 'top-left',
    onSideScroll = function(selected, index, args)
        print(('row %s switched to value %s'):format(selected, index))
    end,
    onCheck = function(selected, checked, args)
        MSK.Notification('Neon: ' .. (checked and 'ON' or 'OFF'))
    end,
    onClose = function(key)
        print('menu closed via ' .. key)
    end,
    items = {
        { id = 'engine', label = 'Engine', description = 'Condition', icon = 'gauge-high', progress = 82 },
        { id = 'color', label = 'Color', icon = 'palette', values = { 'Black', 'White', 'MSK Green' }, defaultIndex = 1 },
        { id = 'neon', label = 'Neon', icon = 'lightbulb', checked = false },
        { id = 'apply', label = 'Apply', icon = 'check', onSelect = function() MSK.Notification('Applied') end },
        { id = 'locked', label = 'Disabled', icon = 'ban', disabled = true },
    }
})

-- As an Export:
exports.msk_core:RegisterMenu('tuning_menu', data)
```

## MSK.ShowMenu

Opens a menu. Accepts either the `id` of a registered menu or an inline table, which is registered automatically. Opening a menu while another one is open closes the old one first (its `onClose` fires with `replace`).

**Parameters**  
**idOrData** - `string/table` - Id of a registered menu, or an inline menu definition

```lua
MSK.ShowMenu('tuning_menu')

-- As an Export:
exports.msk_core:ShowMenu('tuning_menu')
```

## MSK.UpdateMenu

Updates a **single item** of a registered menu. The item is addressed through its `id` and the given fields are **merged** into it. If exactly this menu is currently open, the UI is refreshed live.

**Parameters**  
**menuId** - `string` - Id of the menu  
**dataId** - `string` - Id of the item inside that menu  
**updatedData** - `table` - The fields to merge into the item

```lua
MSK.UpdateMenu('tuning_menu', 'engine', {
    progress = 100,
    description = 'Fully repaired',
})

-- Also works for checkbox and value state while the menu is open
MSK.UpdateMenu('tuning_menu', 'neon', { checked = true })
MSK.UpdateMenu('tuning_menu', 'color', { defaultIndex = 3 })

-- As an Export:
exports.msk_core:UpdateMenu('tuning_menu', 'engine', { progress = 100 })
```

## MSK.HideMenu

Closes the currently open menu.

**Parameters**  
**key** - `string` - (optional) Value handed to `onClose`. Default `forced`

```lua
MSK.HideMenu()

-- As an Export:
exports.msk_core:HideMenu()
```

## MSK.GetOpenMenu

Returns the id of the currently open menu.

**Returns**  
**id** - `string/nil` - Id of the open menu, or `nil` if none is open

```lua
local id = MSK.GetOpenMenu()

-- As an Export:
local id = exports.msk_core:GetOpenMenu()
```

## Controls

| Key | Action |
|---|---|
| Arrow Up / Down | Move the highlight (disabled rows are skipped) |
| Arrow Left / Right | Change the value of a side scroll row |
| Enter | Select the row, or toggle its checkbox |
| Backspace | Close the menu (unless `canClose = false`) |

All other controls stay untouched, so the player can keep moving and driving.
