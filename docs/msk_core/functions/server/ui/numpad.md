---
title: Numpad
sidebar_position: 2
---

# Numpad

The server-side Numpad module sends a Numpad Window to a target player identified by their server id. The first parameter is always the player's server id. The call is forwarded to the client through the MSK callback system and **blocks until the player solves or closes the window**, returning the result back to the server.

## MSK.Numpad.Open

Opens a Numpad Window for a specific player and returns the result to the server.

**Parameters**  
**playerId** - `number` - The target player's server id  
**pin** - `string/number` - The correct Pin  
**showPin** - `boolean` - Show the numbers or `****`

**Returns**  
**isCorrect** - `boolean` - If the inserted pin is correct or not

```lua
local isCorrect = MSK.Numpad.Open(playerId, '1234', true)
print('Correct:', isCorrect)

-- As an Export:
local isCorrect = exports.msk_core:Numpad(playerId, pin, showPin)
```

## MSK.Numpad.Close

Closes the Numpad Window of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Numpad.Close(playerId)

-- As an Export:
exports.msk_core:CloseNumpad(playerId)
```
