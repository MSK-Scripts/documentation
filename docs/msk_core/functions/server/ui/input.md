---
title: Input
sidebar_position: 1
---

# Input

The server-side Input module opens an input dialog for a target player identified by their server id. The first parameter is always the player's server id. The call **blocks until the player submits or cancels the dialog**. There is no time limit, but the wait ends with `nil` when the player leaves the server.

See the [client-side documentation](../../client/ui/input.md) for all row fields, field types and options.

:::tip[Validated on the server]
The values the client sends back are validated again on the server against the same rows. A modified client cannot skip required fields, go past `min` / `max` or send a value that is not one of the `options`. If the values do not match, the function returns `nil` and logs a warning.
:::

## MSK.Input.Dialog

Opens an input dialog for a specific player and returns the values to the server.

**Parameters**  
**playerId** - `number` - The target player's server id  
**header** - `string` - Header text  
**rows** - `table` - List of fields  
**options** - `table` - Optional - Dialog options

**Returns**  
**values** - `table/nil` - The values by row number and by `id`, or `nil` when cancelled, closed, invalid or the player left

```lua
MSK.Input.Dialog(playerId, header, rows, options)

-- Example
local values = MSK.Input.Dialog(playerId, 'Fine', {
    { type = 'number', label = 'Amount', required = true, min = 1, max = 50000 },
    { type = 'textarea', label = 'Reason', id = 'reason', maxLength = 200 },
})

if values then
    print(values[1], values.reason)
end

-- As an Export:
local values = exports.msk_core:InputDialog(playerId, header, rows, options)
```

## MSK.Input.CloseDialog

Closes the input dialog of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Input.CloseDialog(playerId)

-- As an Export:
exports.msk_core:CloseInputDialog(playerId)
```

## MSK.Input.Open

Opens the old single field input window for a specific player.

:::warning[Deprecated]
`MSK.Input.Open(playerId, ...)` and the exports `Input` / `OpenInput` are deprecated and will be removed in a future version. The first call from a resource logs a warning, once per resource. Use [`MSK.Input.Dialog`](#mskinputdialog) instead:

```lua
local values = MSK.Input.Dialog(playerId, 'This is a Header', {
    { type = 'input', label = 'Name', placeholder = 'This is a Placeholder' },
})
local input = values and values[1]
```
:::

**Parameters**  
**playerId** - `number` - The target player's server id  
**header** - `string` - Header text  
**placeholder** - `string` - Placeholder text  
**field** - `boolean` - Optional - Default: `false` - `true` opens the big input

**Returns**  
**input** - `string/number/nil` - The value entered by the player

```lua
MSK.Input.Open(playerId, header, placeholder, field)

-- Example
local input = MSK.Input.Open(playerId, 'This is a Header', 'This is a Placeholder')

-- As an Export:
local input = exports.msk_core:Input(playerId, header, placeholder, field)
```

## MSK.Input.Close

Closes the old input window of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Input.Close(playerId)

-- As an Export:
exports.msk_core:CloseInput(playerId)
```
