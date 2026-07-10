---
title: Menu
sidebar_position: 6
---

# Menu

The server-side Menu module opens a keyboard navigated menu for a target player identified by their server id. The first parameter is always the player's server id. The call is forwarded to the client through the MSK callback system.

See the [client-side documentation](../../client/ui/menu.md) for the full list of menu and item fields, and for the controls.

:::warning[Callbacks do not cross the network]
Everything you send from the server is serialized. Lua **functions do not survive** that, so `onSelect`, `onSelected`, `onSideScroll`, `onCheck` and `onClose` are lost when you pass an inline menu from the server.

You have two clean options:

1. **Register the menu client-side** (with all its callbacks) and open it from the server by its `id`. This is the recommended way, and the only way to receive `onSideScroll` or `onCheck`.
2. **Use `event` / `serverEvent` + `args`** on the items instead of `onSelect`.
:::

## MSK.ShowMenu

Opens a menu for a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id  
**idOrData** - `string/table` - Id of a menu registered on the client, or an inline menu definition

```lua
-- Recommended: the menu (including its callbacks) is registered on the client,
-- the server only opens it.
MSK.ShowMenu(playerId, 'tuning_menu')

-- Inline from the server. Note: no callbacks, use serverEvent instead.
MSK.ShowMenu(playerId, {
    id = 'quick_menu',
    title = 'Quick Actions',
    items = {
        { label = 'Repair', icon = 'wrench', serverEvent = 'myscript:repair', args = { target = playerId } },
    }
})

-- As an Export:
exports.msk_core:ShowMenu(playerId, 'tuning_menu')
```

## MSK.HideMenu

Closes the menu of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.HideMenu(playerId)

-- As an Export:
exports.msk_core:HideMenu(playerId)
```
