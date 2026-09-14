---
title: TextUI
sidebar_position: 4
---

# TextUI

The server-side TextUI module shows a help text on a target player identified by their server id. The first parameter is always the player's server id. These functions fire a client event on the target player and do **not** return a value to the server.

See the [client-side documentation](../../client/ui/textui.md) for all fields (key, icon, icon animation, position).

## MSK.TextUI.Show

Shows the TextUI for a specific player and keeps it visible until it is hidden. Calling it again while it is open updates it.

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `table` - TextUI data

```lua
MSK.TextUI.Show(playerId, data)

-- Example
MSK.TextUI.Show(playerId, {
    key = 'E',
    text = 'Open ~g~garage~s~',
    icon = 'warehouse',
    position = 'bottom-center',
})

-- As an Export:
exports.msk_core:ShowTextUI(playerId, data)
```

:::warning[Deprecated]
The old form `MSK.TextUI.Show(playerId, key, text, color)` still works, but is deprecated and logs a warning once per resource. Use the table form instead:

```lua
MSK.TextUI.Show(playerId, { key = 'E', text = 'Press ~g~E~s~ to interact' })
```
:::

## MSK.TextUI.ShowThread

Shows the TextUI for a specific player in thread mode. The client hides it about 100 ms after the last trigger, so it is meant to be called repeatedly while the player should see the hint.

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `table` - TextUI data

```lua
MSK.TextUI.ShowThread(playerId, data)

-- As an Export:
exports.msk_core:ShowTextUIThread(playerId, data)
```

:::warning[Deprecated]
The old form `MSK.TextUI.ShowThread(playerId, key, text, color)` still works, but is deprecated and logs a warning once per resource. Pass a table instead.
:::

## MSK.TextUI.Hide

Hides the TextUI for a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.TextUI.Hide(playerId)

-- As an Export:
exports.msk_core:HideTextUI(playerId)
```
