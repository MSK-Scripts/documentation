---
title: Numpad
sidebar_position: 2
---

# Numpad

The Numpad module opens a PIN pad. `MSK.Numpad.Open` asks for a code and tells you whether the player entered it, `MSK.Numpad.Input` just collects digits for your own check.

The code never reaches the NUI. The NUI only knows how many digits it has, sends what the player typed, and the comparison happens in Lua. A wrong code keeps the pad open and shows the `wrong` label, so the player can try again until the code is right, `maxAttempts` is reached or the pad is closed.

:::warning[Client or server?]
On the client the code still lives in the client's memory and the result is reported by the client. That is fine for game mechanics where nothing of value is at stake, like a door in a mission or a mini game.

Anything that protects real value (a vault with money, a stash, an admin action) belongs on the [server form](../../server/ui/numpad.md). There the code never leaves the server and every attempt is checked by the server itself.
:::

## MSK.Numpad.Open

Opens a numpad the player has to solve with the given code. Blocks until it ends, unless a callback is given.

**Parameters**  
**data** - `table` - Numpad data  
**cb** - `function` - Optional - Callback receiving `ok, reason`. It is called in every case, cancel included

**Description**  
- **code** - `string` - The code, digits only. Pass it as a string so leading zeros survive  
- **masked** - `boolean` - Optional - Default: `true` - Show dots instead of the digits  
- **maxAttempts** - `number` - Optional - Default: unlimited - Wrong attempts until the numpad locks  
- **title** - `string` - Optional - Title above the display  
- **labels** - `table` - Optional - `enter` (default `Enter Code`), `wrong` (default `Incorrect`), `attempts` (default `Attempts left`)  
- **cb** - `function` - Optional - Same as the second parameter

**Returns**  
**ok** - `boolean` - `true` when the correct code was entered  
**reason** - `string/nil` - Why it failed: `maxAttempts`, `cancelled` or `busy` (another numpad is already open)

```lua
MSK.Numpad.Open(data, cb)

-- Example
local ok, reason = MSK.Numpad.Open({
    code = '0420',
    masked = true,
    maxAttempts = 3,
    title = 'Door',
    labels = { enter = 'Enter code', wrong = 'Wrong code', attempts = 'Attempts left' },
})

if ok then
    print('Door opened')
elseif reason == 'maxAttempts' then
    print('Too many wrong attempts')
end

-- With a callback
MSK.Numpad.Open({ code = '1234' }, function(ok, reason)
    print(ok, reason)
end)

-- As an Export:
local ok, reason = exports.msk_core:Numpad(data, cb)
```

:::warning[Deprecated]
The old form `MSK.Numpad.Open(pin, showPin, cb)` (also `MSK.Numpad(pin, showPin, cb)` and `MSK.OpenNumpad`) still works, but is deprecated and logs a warning once per resource. Use the table form instead:

```lua
local ok = MSK.Numpad.Open({ code = '1234', masked = false })
```
:::

## MSK.Numpad.Input

Asks for digits without a code to compare against, for example to send them to the server and check them there.

**Parameters**  
**data** - `table` - Optional - Numpad data  
**cb** - `function` - Optional - Callback receiving `digits, reason`

**Description**  
- **length** - `number` - Optional - Default: `4` - Maximum number of digits  
- **minLength** - `number` - Optional - Default: `1` - Minimum number of digits  
- **masked** - `boolean` - Optional - Default: `false` - Show dots instead of the digits  
- **title** - `string` - Optional - Title above the display  
- **labels** - `table` - Optional - Same as for `MSK.Numpad.Open`  
- **cb** - `function` - Optional - Same as the second parameter

**Returns**  
**digits** - `string/nil` - The digits as a string, or `nil` when cancelled  
**reason** - `string/nil` - `cancelled` or `busy`

```lua
MSK.Numpad.Input(data, cb)

-- Example
local digits = MSK.Numpad.Input({ length = 6, minLength = 4, masked = true, title = 'PIN' })
if not digits then return end

local valid = MSK.Trigger('myscript:checkPin', digits)

-- As an Export:
local digits = exports.msk_core:NumpadInput(data, cb)
```

## MSK.Numpad.Close

Closes the current numpad. A waiting call returns with the reason `cancelled`.

```lua
MSK.Numpad.Close()

-- As an Export:
exports.msk_core:CloseNumpad()
```

## MSK.Numpad.Active

Checks if a numpad is currently open.

**Returns**  
**isActive** - `boolean` - Whether a numpad is open

```lua
local isActive = MSK.Numpad.Active()

-- As an Export:
local isActive = exports.msk_core:NumpadActive()
```

## Controls

| Key | Action |
|---|---|
| 0 to 9 | Type a digit |
| Backspace | Remove the last digit |
| Enter | Submit |
| ESC | Cancel |

A numpad opened through a resource is closed when that resource stops.
