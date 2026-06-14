---
title: Inventory
sidebar_position: 3
---

# Inventory

Client-side inventory helper. The lookup itself runs on the server through the active inventory bridge — the client function is a callback to `msk_core:hasItem`.

:::info
`MSK.HasItem` requires a framework (**ESX** / **QBCore** / **OXCore**). In `STANDALONE` mode the function logs an error and returns `nil`.
:::

## MSK.HasItem

Checks whether the local player has a given item and returns the item entry (with name / label / count) resolved by the configured inventory bridge.

**Parameters**  
**itemName** - `string` - The name of the item to check  
**metadata** - `table` - Optional metadata to match against the item

**Returns**  
**item** - `table` \| `false` - The item entry (e.g. `name`, `label`, `count`) or `false` if the player does not have it

```lua
local item = MSK.HasItem(itemName)

-- Example
local water = MSK.HasItem('water')

if water then
    print(water.name, water.count)
end

-- As an Export:
local item = exports.msk_core:HasItem(itemName)
```
