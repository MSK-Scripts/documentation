---
title: TextUI
sidebar_position: 4
---

# TextUI

The server-side TextUI module triggers a help text on a target player identified by their server id. The first parameter is always the player's server id. These functions are thin wrappers that fire a client event on the target player; they do **not** return a value to the server. The default color is taken from `Config.TextUIColor` (`#00e676`, MSK green).

## MSK.TextUI.Show

Show the TextUI for a specific player and keep it visible until it is hidden.

**Parameters**  
**playerId** - `number` - The target player's server id  
**key** - `string` - The key that needs to be pressed (defaults to `E`)  
**text** - `string` - Text  
**color** - `string` - Color as hex - Optional, defaults to `Config.TextUIColor`

```lua
MSK.TextUI.Show(playerId, key, text, color)

-- Example 1: default color
MSK.TextUI.Show(playerId, 'E', 'Press ~g~E~s~ to interact')

-- Example 2: specific color
MSK.TextUI.Show(playerId, 'E', 'Press ~g~E~s~ to interact', '#5eb131')

-- As an Export:
exports.msk_core:ShowTextUI(playerId, key, text, color)
```

## MSK.TextUI.ShowThread

Show the TextUI for a specific player in thread mode. On the client the text is automatically hidden shortly after it stops being triggered, so this is intended to be called repeatedly while the player should see the hint.

**Parameters**  
**playerId** - `number` - The target player's server id  
**key** - `string` - The key that needs to be pressed (defaults to `E`)  
**text** - `string` - Text  
**color** - `string` - Color as hex - Optional, defaults to `Config.TextUIColor`

```lua
MSK.TextUI.ShowThread(playerId, key, text, color)

-- As an Export:
exports.msk_core:ShowTextUIThread(playerId, key, text, color)
```

## MSK.TextUI.Hide

Hide the TextUI for a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.TextUI.Hide(playerId)

-- As an Export:
exports.msk_core:HideTextUI(playerId)
```
