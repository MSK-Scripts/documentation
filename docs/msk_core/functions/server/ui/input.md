---
title: Input
sidebar_position: 1
---

# Input

The server-side Input module sends an Input Window to a target player identified by their server id. The first parameter is always the player's server id. The call is forwarded to the client through the MSK callback system and **blocks until the player submits or closes the window**, returning the entered value back to the server.

The returned value is normalized on the client: an empty string becomes `nil`, and a numeric-looking value is converted to a `number`.

## MSK.Input.Open

Opens an Input Window for a specific player and returns the entered value to the server.

**Parameters**  
**playerId** - `number` - The target player's server id  
**header** - `string` - Header text  
**placeholder** - `string` - Placeholder text  
**field** - `boolean` - `false`/omitted = small input, `true` = big input

**Returns**  
**input** - `string/number/nil` - The value entered by the player

```lua
-- Small Input Window
local input = MSK.Input.Open(playerId, 'This is a Header', 'This is a Placeholder')
print(input)

-- Big Input Window
local input = MSK.Input.Open(playerId, 'This is a Header', 'This is a Placeholder', true)
print(input)

-- As an Export:
local input = exports.msk_core:Input(playerId, header, placeholder, field)
```

## MSK.Input.Close

Closes the Input Window of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Input.Close(playerId)

-- As an Export:
exports.msk_core:CloseInput(playerId)
```
