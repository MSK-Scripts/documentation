---
title: Context Menu
sidebar_position: 5
---

# Context Menu

The Context module opens a mouse driven menu with clickable options, sub menus and a back navigation. It is the MSK equivalent of a classic context menu.

A context menu is registered once under an `id` and can then be opened as often as you like. Options can navigate into other registered menus, run a callback, trigger a client or a server event, show a progress bar or carry metadata that is revealed on hover.

:::info[Mouse focus]
While a context menu is open the NUI takes mouse and keyboard focus (`SetNuiFocus(true, true)`), so the player **cannot move**. That is intended, the mouse is needed to click the options. If you need a menu the player can use while walking or driving, use the [Menu](./menu.md) module instead.
:::

:::note[Naming]
The namespaced form `MSK.Context.*` is the recommended one. The flat names `MSK.RegisterContext`, `MSK.ShowContext`, `MSK.UpdateContext`, `MSK.HideContext` and `MSK.GetOpenContext` point at the exact same functions and stay supported.

The exports are always flat: `exports.msk_core:RegisterContext(...)`.
:::

## MSK.Context.Register

Registers (or overwrites) a context menu under an id.

**Parameters**  
**id** - `string` - Unique id of the menu  
**data** - `table` - The menu definition

### Menu fields

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Header text |
| `menu` | `string` | Id of the parent menu. Shows a back arrow that navigates there |
| `canClose` | `boolean` | `false` prevents closing with `ESC` or the close button. Default `true` |
| `position` | `string` | `center` (default), `left`, `right`, `top`, `bottom`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `onExit` | `function` | Called when the menu is closed |
| `onBack` | `function` | Called when the player navigates back to the parent menu |
| `options` | `table` | Array of options (see below) |

### Option fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable id of the option. Required if you want to use [`MSK.Context.Update`](#mskcontextupdate) on it |
| `title` | `string` | Label. Supports FiveM color codes such as `~g~` |
| `description` | `string` | Smaller text below the label |
| `icon` | `string` | FontAwesome icon. Short name (`car`) or full class (`fas fa-car`) |
| `iconColor` | `string` | Overrides the icon color. Default is the MSK accent |
| `image` | `string` | Image url shown instead of the icon |
| `arrow` | `boolean` | Shows a chevron on the right. Automatically `true` when `menu` is set |
| `menu` | `string` | Id of another registered context menu. Selecting the option navigates into it |
| `onSelect` | `function` | Called with `args` when the option is selected |
| `event` | `string` | Client event triggered with `args` on select |
| `serverEvent` | `string` | Server event triggered with `args` on select |
| `args` | `any` | Passed to `onSelect`, `event` and `serverEvent` |
| `disabled` | `boolean` | Greyed out, not clickable |
| `readOnly` | `boolean` | Visible and not clickable, but not greyed out. Useful for pure information rows |
| `progress` | `number` | `0` to `100`. Renders a progress bar inside the row |
| `colorScheme` | `string` | Color of the progress bar. Default is the MSK accent |
| `metadata` | `table` | `{ { label = 'Plate', value = 'MSK 123' } }` or a key/value table. Shown as a tooltip on hover |

```lua
MSK.Context.Register('vehicle_menu', {
    title = 'Vehicle',
    position = 'center',
    onExit = function() print('menu closed') end,
    options = {
        { id = 'info', title = 'Vehicle ~g~Info~s~', description = 'Open sub menu', icon = 'circle-info', menu = 'vehicle_info' },
        { id = 'repair', title = 'Repair', description = 'Restore condition', icon = 'wrench', progress = 45,
          onSelect = function() MSK.Notification('MSK', 'Vehicle repaired', 'success', 4000) end },
        { id = 'engine', title = 'Start engine', icon = 'key', event = 'myscript:engine', args = { plate = 'MSK 123' } },
        { id = 'locked', title = 'Locked', description = 'No access', icon = 'lock', disabled = true },
        { id = 'plate', title = 'Plate', icon = 'id-card', readOnly = true,
          metadata = { { label = 'Plate', value = 'MSK 123' }, { label = 'Model', value = 'Sultan' } } },
    }
})

-- Sub menu. `menu` points back to the parent, which renders the back arrow.
MSK.Context.Register('vehicle_info', {
    title = 'Vehicle Info',
    menu = 'vehicle_menu',
    options = {
        { title = 'Mileage', description = '123.456 km', icon = 'gauge', readOnly = true },
    }
})

-- Backwards compatible alias:
MSK.RegisterContext('vehicle_menu', data)

-- As an Export:
exports.msk_core:RegisterContext('vehicle_menu', data)
```

## MSK.Context.Show

Opens a context menu. Accepts either the `id` of a registered menu or an inline table, which is registered automatically.

**Parameters**  
**idOrData** - `string/table` - Id of a registered menu, or an inline menu definition

```lua
MSK.Context.Show('vehicle_menu')

-- Inline, without registering first:
MSK.Context.Show({
    id = 'quick_menu',
    title = 'Quick Actions',
    position = 'top-right',
    options = {
        { title = 'Hello', icon = 'hand', onSelect = function() print('hi') end },
    }
})

-- The module table itself is callable and forwards to Show:
MSK.Context('vehicle_menu')

-- Backwards compatible alias:
MSK.ShowContext('vehicle_menu')

-- As an Export:
exports.msk_core:ShowContext('vehicle_menu')
```

## MSK.Context.Update

Updates a **single option** of a registered menu. The option is addressed through its `id` and the given fields are **merged** into it, so you only pass what actually changes. If exactly this menu is currently open, the UI is refreshed live.

**Parameters**  
**contextId** - `string` - Id of the menu  
**dataId** - `string` - Id of the option inside that menu  
**updatedData** - `table` - The fields to merge into the option

```lua
-- Only progress and description change, everything else stays as registered
MSK.Context.Update('vehicle_menu', 'repair', {
    progress = 100,
    description = 'Fully repaired',
    disabled = true,
})

-- Backwards compatible alias:
MSK.UpdateContext('vehicle_menu', 'repair', { progress = 100 })

-- As an Export:
exports.msk_core:UpdateContext('vehicle_menu', 'repair', { progress = 100 })
```

## MSK.Context.Hide

Closes the currently open context menu.

**Parameters**  
**fireExit** - `boolean` - (optional) `true` also runs the menu's `onExit` callback

```lua
MSK.Context.Hide()

-- Backwards compatible alias:
MSK.HideContext()

-- As an Export:
exports.msk_core:HideContext()
```

## MSK.Context.GetOpen

Returns the id of the currently open context menu.

**Returns**  
**id** - `string/nil` - Id of the open menu, or `nil` if none is open

```lua
local id = MSK.Context.GetOpen()

-- Backwards compatible alias:
local id = MSK.GetOpenContext()

-- As an Export:
local id = exports.msk_core:GetOpenContext()
```

## Controls

| Key | Action |
|---|---|
| Mouse | Hover and click an option |
| Arrow Up / Down | Move the highlight |
| Enter / Arrow Right | Select the highlighted option |
| Backspace | Back to the parent menu (if `menu` is set) |
| ESC | Close (unless `canClose = false`) |
