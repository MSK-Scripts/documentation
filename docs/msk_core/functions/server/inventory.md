---
title: Inventory
sidebar_position: 3
---

# Inventory

msk_core abstracts the inventory away behind a configurable bridge. The bridge is selected via `Config.Inventory` (default `'AUTO'`):

- **AUTO** — auto-detects in order: `ox_inventory` > `core_inventory` > `jaksam_inventory` > `default`.
- **ox_inventory** — fully maintained bridge (`AddItem`, `RemoveItem`, `HasItem`, `CanCarryItem`, `SetMaxWeight`, weapons, OXCore money accounts).
- **jaksam_inventory** — fully maintained bridge.
- **core_inventory** — secondary bridge (ported).
- **default** — ESX default / Chezza inventory (no `FunctionOverride`, uses the framework's own item functions).
- **custom** — your own implementation in `inventories/server/custom.lua`.

Each bridge attaches inventory functions onto the framework player object (`Player.AddItem`, `Player.RemoveItem`, `Player.HasItem`, `Player.GetInventory`, `Player.CanCarryItem`, `Player.SetMaxWeight`, weapon helpers, …). The functions below are the convenience exports the core provides on top of that.

:::info
`MSK.HasItem` requires a framework (**ESX** / **QBCore** / **OXCore**). In `STANDALONE` mode it logs an error and returns `false`.
:::

## MSK.HasItem

Checks whether a player has a given item using the active inventory bridge. A single item name or a list of item names may be passed — when a list is given the first matching item is returned.

**Parameters**  
**playerId** - `number` - The server id of the player  
**item** - `string` \| `table` - The item name, or a list of item names to check  
**metadata** - `table` - Optional metadata to match against the item

**Returns**  
**item** - `table` \| `false` - The item entry resolved by the bridge, or `false` if not found / on error

```lua
local item = MSK.HasItem(playerId, item)

-- Example: single item
local water = MSK.HasItem(source, 'water')

-- Example: any of several items
local tool = MSK.HasItem(source, { 'lockpick', 'advancedlockpick' })

-- As an Export:
local item = exports.msk_core:HasItem(playerId, item)
```

## MSK.RegisterItem

Registers a usable item. The callback is passed through to the active framework's usable-item registration (`ESX.RegisterUsableItem` / `QBCore.Functions.CreateUseableItem`). The registered items are also tracked internally (see `MSK.GetRegisteredItems`).

:::info
The callback signature depends on the framework:
- **ESX** — `function(source)`
- **QBCore** — `function(source, item)`
:::

**Parameters**  
**item** - `string` - The item name to register  
**cb** - `function` - The callback invoked when the item is used

```lua
MSK.RegisterItem(item, function(...)
    -- use logic
end)

-- Example (ESX)
MSK.RegisterItem('bandage', function(source)
    -- heal the player
end)

-- Example (QBCore)
MSK.RegisterItem('bandage', function(source, item)
    -- heal the player
end)

-- As an Export:
exports.msk_core:RegisterItem(item, cb)
```

## MSK.GetRegisteredItems

Returns the table of all items registered through `MSK.RegisterItem`, keyed by item name.

**Returns**  
**items** - `table` - All registered items (`itemName = callback`)

```lua
local items = MSK.GetRegisteredItems()

-- As an Export:
local items = exports.msk_core:GetRegisteredItems()
```

## MSK.GetRegisteredItem

Returns the callback registered for a single item, or `false` if the item was not registered.

**Parameters**  
**itemName** - `string` - The item name to look up

**Returns**  
**callback** - `function` \| `false` - The registered callback, or `false`

```lua
local callback = MSK.GetRegisteredItem(itemName)

-- Example
local cb = MSK.GetRegisteredItem('bandage')

-- As an Export:
local callback = exports.msk_core:GetRegisteredItem(itemName)
```
