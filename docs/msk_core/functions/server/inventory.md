---
title: Inventory
sidebar_position: 3
---

# Inventory

msk_core abstracts the inventory away behind a configurable bridge, selected via `Config.Inventory` (default `'AUTO'`):

- **AUTO**: detects in this order: `ox_inventory` > `core_inventory` > `jaksam_inventory` > `default`
- **ox_inventory**: fully maintained
- **jaksam_inventory**: fully maintained
- **core_inventory**: secondary, ported
- **default**: the inventory built into the running framework (ESX default and Chezza, QBCore, Qbox)
- **custom**: your own implementation in `inventories/server/custom.lua`

:::info[Framework and inventory are separate since v4.0.0]
No framework branch carries item code, and no inventory adapter carries framework code. All item handling lives in `inventories/server/*.lua`, including the new `default.lua`. `FunctionOverride`, which glued item functions onto the framework player object after the fact, is gone.

Every adapter function takes the **server id first**, never a framework player object. The item methods on the player object (see [Player](./player.md)) route through the same adapter.
:::

:::warning[`nil` is not `false`]
`CanCarryItem`, `CanSwapItem`, `SetMaxWeight` and `ClearInventory` answer `nil` when the running inventory cannot check or do that. Until v4.0.0 `CanCarryItem` answered `true` without checking on QBCore and Qbox, and an item handed out on that promise ends up on the floor. Treat `nil` as "unknown", not as "no".
:::

:::info
`MSK.HasItem` requires a framework. In `STANDALONE` mode it logs an error and returns `false`.
:::

## MSK.HasItem

Checks whether a player has a given item using the active inventory bridge. A single item name or a list of item names may be passed. When a list is given the first matching item is returned.

**Parameters**
**playerId** - `number` - The server id of the player
**item** - `string` \| `table` - The item name, or a list of item names to check
**count** - `number` - Optional minimum count the player has to carry
**metadata** - `table` - Optional metadata to match against the item

**Returns**  
**item** - `table` \| `false` - The item entry resolved by the bridge, or `false` if not found / on error

```lua
local item = MSK.HasItem(playerId, item)

-- Example: single item
local water = MSK.HasItem(source, 'water')

-- Example: any of several items
local tool = MSK.HasItem(source, {'lockpick', 'advancedlockpick'})

-- Example: at least five of them
local enough = MSK.HasItem(source, 'water', 5)

-- As an Export:
local item = exports.msk_core:HasItem(playerId, item, count, metadata)
```

Passing the metadata as the third argument still works, the count is optional and is detected by its type.

## MSK.RegisterItem

Registers a usable item. The callback is passed through to the active framework's usable-item registration (`ESX.RegisterUsableItem`, `QBCore.Functions.CreateUseableItem`, `exports.qbx_core:CreateUseableItem`). The registered items are also tracked internally (see `MSK.GetRegisteredItems`).

:::info
The callback signature depends on the framework:
- **ESX**: `function(source)`
- **QBCore** and **Qbox**: `function(source, item)`
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

-- Example (QBCore and Qbox)
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
