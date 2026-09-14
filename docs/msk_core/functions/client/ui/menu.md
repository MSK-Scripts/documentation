---
title: Menu
sidebar_position: 6
---

# Menu

The Menu module opens a keyboard navigated list menu in the style of a classic NativeUI menu. It supports a highlighted row, side scroll values, checkboxes and progress bars.

:::tip[The player keeps full control]
A menu deliberately does **not** take NUI focus. The arrow keys are read through the game controls, and only those navigation controls are disabled while the menu is open. Everything else keeps working, so the player can **walk, drive and do anything else** with the menu on screen. If you need mouse interaction instead, use the [Context Menu](./context.md).
:::

:::note[Naming]
The namespaced form `MSK.Menu.*` is the recommended one. The flat names `MSK.RegisterMenu`, `MSK.ShowMenu`, `MSK.UpdateMenu`, `MSK.SetMenuOptions`, `MSK.HideMenu` and `MSK.GetOpenMenu` point at the exact same functions and stay supported. `MSK.Menu.Close` is an alias of `MSK.Menu.Hide`.

The exports are always flat: `exports.msk_core:RegisterMenu(...)`.
:::

The whole menu state (selected row, current values, checkbox states) lives in Lua. The NUI is only a render layer, which means your callbacks always receive the authoritative state.

A menu belongs to the resource that registered it. When that resource stops, its menus are removed, and the menu is closed if it is open at that moment. An error inside one of the callbacks is logged with the menu id and no longer freezes the menu.

## MSK.Menu.Register

Registers (or overwrites) a menu under an id. Registering the menu that is currently open shows the new version right away.

**Parameters**  
**id** - `string` - Unique id of the menu  
**data** - `table` - The menu definition  
**cb** - `function` - Optional - `(selected, scrollIndex, args, checked)`, runs when an item is chosen with `Enter`

The callback receives the index of the chosen item, the current value index of a side scroll row (`nil` for other rows), the item's `args` and its checkbox state. Instead of the third parameter you can also set `onSelect` on the menu itself.

### Menu fields

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Header text |
| `position` | `string` | `top-left` (default), `center`, `left`, `right`, `top`, `bottom`, `top-right`, `bottom-left`, `bottom-right` |
| `canClose` | `boolean` | `false` prevents closing with the back key. Default `true` |
| `disableInput` | `boolean` | `true` freezes the navigation completely |
| `startIndex` | `number` | Row that is selected when the menu opens. Default `1` |
| `onSelect` | `function` | Menu callback, same as the `cb` parameter |
| `onSelected` | `function` | `(selected, item, args)` - fires whenever the highlight moves |
| `onSideScroll` | `function` | `(selected, index, args)` - fires when a value is scrolled left/right |
| `onCheck` | `function` | `(selected, checked, args)` - fires when a checkbox is toggled |
| `onClose` | `function` | `(key)` - fires when the menu closes. `key` is `select`, `cancel`, `replace`, `forced` or the value you passed to `Hide` |
| `items` | `table` | Array of items (see below) |

### Item fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable id of the item. Required if you want to use [`MSK.Menu.Update`](#mskmenuupdate) on it |
| `label` | `string` | Label. Supports FiveM color codes such as `~g~` |
| `description` | `string` | Smaller text below the label |
| `icon` | `string` | FontAwesome icon. Short name (`car`) or full class (`fas fa-car`) |
| `iconColor` | `string` | Overrides the icon color |
| `iconAnimation` | `string` | `spin`, `spinPulse`, `spinReverse`, `beat`, `beatFade`, `bounce`, `fade`, `flip`, `shake` |
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

Choosing an item closes the menu first (unless `close = false`) and runs the callbacks afterwards. That way a callback can open the next menu without it being closed again right away.

```lua
MSK.Menu.Register(id, data, cb)

-- Example
MSK.Menu.Register('tuning_menu', {
    title = 'Options',
    position = 'top-left',
    onSideScroll = function(selected, index, args)
        print(('row %s switched to value %s'):format(selected, index))
    end,
    onCheck = function(selected, checked, args)
        MSK.Notification({ title = 'MSK', message = 'Neon: ' .. (checked and 'ON' or 'OFF'), type = 'info' })
    end,
    onClose = function(key)
        print('menu closed via ' .. key)
    end,
    items = {
        { id = 'engine', label = 'Engine', description = 'Condition', icon = 'gear', iconAnimation = 'spin', progress = 82, close = false },
        { id = 'color', label = 'Color', icon = 'palette', values = { 'Black', 'White', 'MSK Green' }, defaultIndex = 1, args = { mod = 'color' } },
        { id = 'neon', label = 'Neon', icon = 'lightbulb', checked = false },
        { id = 'apply', label = 'Apply', icon = 'check' },
        { id = 'locked', label = 'Disabled', icon = 'ban', disabled = true },
    }
}, function(selected, scrollIndex, args, checked)
    print(('item %s chosen, value %s'):format(selected, tostring(scrollIndex)))
end)

-- Backwards compatible alias:
MSK.RegisterMenu('tuning_menu', data, cb)

-- As an Export:
exports.msk_core:RegisterMenu('tuning_menu', data, cb)
```

## MSK.Menu.Show

Opens a menu. Accepts either the `id` of a registered menu or an inline table, which is registered automatically. Opening a menu while another one is open closes the old one first (its `onClose` fires with `replace`). An unknown id prints a warning and leaves the open menu alone.

**Parameters**  
**idOrData** - `string/table` - Id of a registered menu, or an inline menu definition  
**startIndex** - `number` - Optional - Default: the menu's `startIndex` or `1` - Row the selection starts on

```lua
MSK.Menu.Show(idOrData, startIndex)

-- Example
MSK.Menu.Show('tuning_menu')

-- Start on the third item
MSK.Menu.Show('tuning_menu', 3)

-- The module table itself is callable and forwards to Show:
MSK.Menu('tuning_menu')

-- Backwards compatible alias:
MSK.ShowMenu('tuning_menu')

-- As an Export:
exports.msk_core:ShowMenu('tuning_menu', 3)
```

## MSK.Menu.Update

Updates a **single item** of a registered menu. The item is addressed through its `id` and the given fields are **merged** into it. If exactly this menu is currently open, the UI is refreshed live.

**Parameters**  
**menuId** - `string` - Id of the menu  
**dataId** - `string` - Id of the item inside that menu  
**updatedData** - `table` - The fields to merge into the item

```lua
MSK.Menu.Update('tuning_menu', 'engine', {
    progress = 100,
    description = 'Fully repaired',
})

-- Also works for checkbox and value state while the menu is open
MSK.Menu.Update('tuning_menu', 'neon', { checked = true })
MSK.Menu.Update('tuning_menu', 'color', { defaultIndex = 3 })

-- Backwards compatible alias:
MSK.UpdateMenu('tuning_menu', 'engine', { progress = 100 })

-- As an Export:
exports.msk_core:UpdateMenu('tuning_menu', 'engine', { progress = 100 })
```

## MSK.Menu.SetOptions

Replaces all items of a registered menu, or with `index` only one of them. An open menu updates right away and keeps its selection where possible.

**Parameters**  
**menuId** - `string` - Id of the menu  
**options** - `table` - A list of items, or a single item when `index` is given  
**index** - `number` - Optional - Position of the item to replace. `#items + 1` appends a new item

```lua
MSK.Menu.SetOptions(menuId, options, index)

-- Example: replace the fourth item
MSK.Menu.SetOptions('tuning_menu', { id = 'apply', label = 'Apply ~g~now~s~', icon = 'check' }, 4)

-- Replace all items
MSK.Menu.SetOptions('tuning_menu', {
    { label = 'Engine', progress = 100 },
    { label = 'Brakes', progress = 60 },
})

-- Backwards compatible alias:
MSK.SetMenuOptions('tuning_menu', options, index)

-- As an Export:
exports.msk_core:SetMenuOptions('tuning_menu', options, index)
```

## MSK.Menu.Hide

Closes the currently open menu. `MSK.Menu.Close` is an alias of this function.

**Parameters**  
**key** - `string/false` - Optional - Default: `'forced'` - Value handed to `onClose`. `false` closes the menu without calling `onClose` at all

```lua
MSK.Menu.Hide(key)

-- Example
MSK.Menu.Hide()

-- Close without onClose
MSK.Menu.Hide(false)

-- Alias:
MSK.Menu.Close()

-- Backwards compatible alias:
MSK.HideMenu()

-- As an Export:
exports.msk_core:HideMenu(key)
```

## MSK.Menu.GetOpen

Returns the id of the currently open menu.

**Returns**  
**id** - `string/nil` - Id of the open menu, or `nil` if none is open

```lua
local id = MSK.Menu.GetOpen()

-- Backwards compatible alias:
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
| Backspace / ESC | Close the menu (unless `canClose = false`). The pause menu does not open on top |

All other controls stay untouched, so the player can keep moving and driving.
