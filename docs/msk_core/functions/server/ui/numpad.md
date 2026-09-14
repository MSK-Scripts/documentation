---
title: Numpad
sidebar_position: 2
---

# Numpad

The server-side Numpad module opens a numpad for a target player identified by their server id. The first parameter is always the player's server id. The call **blocks until the numpad ends**, and the wait also ends when the player leaves.

**The code never leaves the server.** The client only shows the pad and sends every attempt to the server, which compares it, counts the attempts and decides. Only the player the numpad was opened for can answer it, and whatever the client reports as its own result is ignored. This is the form to use whenever the code protects something of value.

See the [client-side documentation](../../client/ui/numpad.md) for the labels and the controls.

## MSK.Numpad.Open

Opens a numpad for a specific player and checks the code on the server.

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `table` - Numpad data

**Description**  
- **code** - `string` - The code, digits only. Pass it as a string so leading zeros survive  
- **masked** - `boolean` - Optional - Default: `true` - Show dots instead of the digits  
- **maxAttempts** - `number` - Optional - Default: unlimited - Wrong attempts until the numpad locks  
- **title** - `string` - Optional - Title above the display  
- **labels** - `table` - Optional - `enter`, `wrong`, `attempts`

**Returns**  
**ok** - `boolean` - `true` when the correct code was entered  
**reason** - `string/nil` - Why it failed: `maxAttempts`, `cancelled`, `busy` or `invalid` (no valid player id)

```lua
MSK.Numpad.Open(playerId, data)

-- Example
local ok, reason = MSK.Numpad.Open(playerId, {
    code = '0420',
    maxAttempts = 3,
    title = 'Vault',
})

if ok then
    -- open the vault
end

-- As an Export:
local ok, reason = exports.msk_core:Numpad(playerId, data)
```

:::warning[Deprecated]
The old form `MSK.Numpad.Open(playerId, pin, showPin)` still works (and is now checked on the server as well), but is deprecated and logs a warning once per resource. Use the table form instead:

```lua
local ok = MSK.Numpad.Open(playerId, { code = '1234', masked = false })
```
:::

## MSK.Numpad.Input

Asks a player for digits without a code to compare against.

:::info
The digits come from the client. The server only makes sure they are digits and not longer than `length`, so check them yourself before you trust them.
:::

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `table` - Optional - `length`, `minLength`, `masked`, `title`, `labels`

**Returns**  
**digits** - `string/nil` - The digits as a string, or `nil`  
**reason** - `string/nil` - `cancelled`, `busy` or `invalid`

```lua
MSK.Numpad.Input(playerId, data)

-- Example
local digits = MSK.Numpad.Input(playerId, { length = 6, masked = true })

-- As an Export:
local digits = exports.msk_core:NumpadInput(playerId, data)
```

## MSK.Numpad.Close

Closes the numpad of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Numpad.Close(playerId)

-- As an Export:
exports.msk_core:CloseNumpad(playerId)
```
