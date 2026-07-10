---
title: Context Menu
sidebar_position: 5
---

# Context Menu

The server-side Context module opens a context menu for a target player identified by their server id. The first parameter is always the player's server id. The call is forwarded to the client through the MSK callback system.

See the [client-side documentation](../../client/ui/context.md) for the full list of menu and option fields.

:::warning[Callbacks do not cross the network]
Everything you send from the server is serialized. Lua **functions do not survive** that, so `onSelect`, `onExit` and `onBack` are lost when you pass an inline menu from the server.

You have two clean options:

1. **Register the menu client-side** (with all its callbacks) and open it from the server by its `id`. This is the recommended way.
2. **Use `event` / `serverEvent` + `args`** on the options instead of `onSelect`. Those are plain strings and travel fine.
:::

## MSK.ShowContext

Opens a context menu for a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id  
**idOrData** - `string/table` - Id of a menu registered on the client, or an inline menu definition

```lua
-- Recommended: the menu (including its callbacks) is registered on the client,
-- the server only opens it.
MSK.ShowContext(playerId, 'vehicle_menu')

-- Inline from the server. Note: no onSelect, use serverEvent instead.
MSK.ShowContext(playerId, {
    id = 'admin_actions',
    title = 'Admin Actions',
    options = {
        { title = 'Heal', icon = 'heart', serverEvent = 'myscript:heal', args = { target = playerId } },
        { title = 'Revive', icon = 'kit-medical', serverEvent = 'myscript:revive', args = { target = playerId } },
    }
})

-- As an Export:
exports.msk_core:ShowContext(playerId, 'vehicle_menu')
```

## MSK.HideContext

Closes the context menu of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.HideContext(playerId)

-- As an Export:
exports.msk_core:HideContext(playerId)
```
