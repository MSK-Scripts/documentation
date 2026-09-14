---
title: Radial Menu
sidebar_position: 8
---

# Radial Menu

The Radial module is a round menu that every script can fill with its own entries. The player opens it with a key, hovers over an entry and clicks it. Entries can run a callback or open a sub menu.

While the radial menu is open the camera and attacking are disabled, but **movement keeps working**, so the player can walk while choosing. It only opens when there is at least one entry, and not while the pause menu or another NUI window has focus. With more than 8 entries the menu is split into pages, the last slice switches to the next page.

Items and sub menus belong to the resource that added them and disappear when that resource stops.

## Configuration

The key and its behaviour are set in `config.lua`:

```lua
Config.Radial = {
    enable = true,
    key = 'Z', -- Default key
    hold = true, -- true = open while the key is held, false = press to open and close
}
```

`key` is only the default. Players can change it in the FiveM key bindings under **Open radial menu**. With `enable = false` no key is registered, but scripts can still open the menu with [`MSK.Radial.Show`](#mskradialshow).

## MSK.Radial.Add

Adds one item or a list of items to the first level. An item with an id that already exists replaces it.

**Parameters**  
**items** - `table` - One item, or a list of items

**Description**  
- **id** - `string` - Unique id of the item  
- **label** - `string` - Label  
- **icon** - `string` - Optional - FontAwesome icon. Short name (`car`) or full class (`fas fa-car`)  
- **iconColor** - `string` - Optional - Color of the icon  
- **menu** - `string` - Optional - Id of a sub menu registered with [`MSK.Radial.Register`](#mskradialregister)  
- **onSelect** - `function` - Optional - `(menuId, index)`, runs when the item is clicked. `menuId` is `nil` on the first level  
- **keepOpen** - `boolean` - Optional - Default: `false` - Keep the menu open after the click

```lua
MSK.Radial.Add(items)

-- Example
MSK.Radial.Add({
    id = 'vehicle_menu',
    label = 'Vehicle',
    icon = 'car',
    menu = 'vehicle',
})

MSK.Radial.Add({
    { id = 'emote', label = 'Emotes', icon = 'face-smile', onSelect = function() ExecuteCommand('emotes') end },
    { id = 'id_card', label = 'ID Card', icon = 'id-card', onSelect = function() print('show id') end },
})

-- As an Export:
exports.msk_core:AddRadialItem(items)
```

## MSK.Radial.Remove

Removes a first-level item by its id.

**Parameters**  
**id** - `string` - Id of the item

**Returns**  
**removed** - `boolean` - `true` when the item existed

```lua
local removed = MSK.Radial.Remove('vehicle_menu')

-- As an Export:
local removed = exports.msk_core:RemoveRadialItem('vehicle_menu')
```

## MSK.Radial.Clear

Removes every first-level item the calling resource added. Items of other resources stay.

```lua
MSK.Radial.Clear()

-- As an Export:
exports.msk_core:ClearRadialItems()
```

## MSK.Radial.Register

Registers a sub menu that items can open through their `menu` field. Registering it again while it is open refreshes it.

**Parameters**  
**menu** - `table` - The sub menu

**Description**  
- **id** - `string` - Unique id of the sub menu  
- **title** - `string` - Optional - Shown in the middle of the menu  
- **items** - `table` - List of items, same fields as for [`MSK.Radial.Add`](#mskradialadd)

```lua
MSK.Radial.Register(menu)

-- Example
MSK.Radial.Register({
    id = 'vehicle',
    title = 'Vehicle',
    items = {
        { id = 'engine', label = 'Engine', icon = 'power-off', onSelect = function(menuId, index)
            local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
            SetVehicleEngineOn(vehicle, not GetIsVehicleEngineRunning(vehicle), false, true)
        end },
        { id = 'doors', label = 'Doors', icon = 'door-open', keepOpen = true, onSelect = function() print('toggle doors') end },
    },
})

-- As an Export:
exports.msk_core:RegisterRadial(menu)
```

## MSK.Radial.Unregister

Removes a sub menu. If it is open, the radial menu closes.

**Parameters**  
**id** - `string` - Id of the sub menu

```lua
MSK.Radial.Unregister('vehicle')

-- As an Export:
exports.msk_core:UnregisterRadial('vehicle')
```

## MSK.Radial.Show

Opens the radial menu on the first level.

```lua
MSK.Radial.Show()

-- As an Export:
exports.msk_core:ShowRadial()
```

## MSK.Radial.Hide

Closes the radial menu.

```lua
MSK.Radial.Hide()

-- As an Export:
exports.msk_core:HideRadial()
```

## MSK.Radial.Disable

Disables or enables the radial menu, for example while the player is dead or handcuffed. Disabling closes an open menu.

**Parameters**  
**state** - `boolean` - Optional - Default: `true` - `true` disables, `false` enables

```lua
MSK.Radial.Disable(true)
MSK.Radial.Disable(false)

-- As an Export:
exports.msk_core:DisableRadial(state)
```

## MSK.Radial.IsOpen

Checks if the radial menu is open.

**Returns**  
**isOpen** - `boolean` - Whether the radial menu is open

```lua
local isOpen = MSK.Radial.IsOpen()

-- As an Export:
local isOpen = exports.msk_core:IsRadialOpen()
```

## MSK.Radial.GetCurrentId

Returns the id of the open sub menu.

**Returns**  
**id** - `string/nil` - Id of the open sub menu, `nil` on the first level or when the menu is closed

```lua
local id = MSK.Radial.GetCurrentId()

-- As an Export:
local id = exports.msk_core:GetRadialId()
```

## Controls

| Key | Action |
|---|---|
| Mouse | Hover and click an entry |
| Click the center | Back, or close on the first level |
| Right click / Backspace | Back one level (closes on the first level) |
| ESC | Close |
