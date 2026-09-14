---
title: Input
sidebar_position: 1
---

# Input

The Input module opens a dialog with one or more fields and waits until the player submits or cancels it. Every field is validated in the NUI while the player types, and the submitted values are checked once more in Lua with the same rules before they reach your script.

The old single field input (`MSK.Input.Open`) still works, but is deprecated. See [below](#mskinputopen).

## MSK.Input.Dialog

Opens an input dialog and waits for the result. A second dialog replaces an open one, whoever was waiting on the first one gets `nil`.

**Parameters**  
**header** - `string` - Header text  
**rows** - `table` - List of fields. A plain string is a text input with that label  
**options** - `table` - Optional - Dialog options

**Returns**  
**values** - `table/nil` - `nil` when the dialog was cancelled or closed. Otherwise the values by row number, and additionally by `id` where a row has one

### Options

| Field | Type | Description |
|---|---|---|
| `allowCancel` | `boolean` | `false` hides the cancel button and ignores `ESC`. Default `true` |
| `size` | `string` | `sm`, `md` (default) or `lg` |
| `labels` | `table` | `{ confirm = '...', cancel = '...' }`. Default `Confirm` and `Cancel` |

### Row fields

| Field | Type | Description |
|---|---|---|
| `type` | `string` | Field type, see the table below. Default `input` |
| `label` | `string` | Label above the field. Supports FiveM color codes such as `~g~` |
| `id` | `string` | The value is additionally returned under this key |
| `description` | `string` | Small help text below the field |
| `placeholder` | `string` | Placeholder text |
| `icon` | `string` | FontAwesome icon next to the label. Short name (`car`) or full class (`fas fa-car`) |
| `required` | `boolean` | The field has to be filled. A required `checkbox` has to be ticked |
| `disabled` | `boolean` | The field cannot be changed and always returns its `default` |
| `default` | `any` | Preset value, in the format the type returns |
| `min` / `max` | `number/string` | Range for `number` and `slider`, earliest and latest date (`'YYYY-MM-DD'`) for `date` and `date-range` |
| `step` | `number` | Step for `number` and `slider` |
| `maxLength` | `number` | Maximum number of characters for `input` and `textarea` |
| `password` | `boolean` | Hides the typed text of an `input` |
| `options` | `table` | Options for `select` and `multi-select`. A list of `{ value = ..., label = ... }` or of plain values |

### Field types

| Type | Returns |
|---|---|
| `input` | `string` |
| `textarea` | `string` |
| `number` | `number` |
| `slider` | `number`. `min` defaults to `0`, `max` to `100`, `step` to `1` |
| `checkbox` | `boolean` |
| `select` | The `value` of the chosen option |
| `multi-select` | A list of the chosen option values |
| `color` | `'#rrggbb'` or `'#rrggbbaa'`, lower case |
| `date` | `'YYYY-MM-DD'` |
| `date-range` | `{ 'YYYY-MM-DD', 'YYYY-MM-DD' }` |
| `time` | `'HH:MM'` |

Empty optional fields return `nil`. That leaves gaps in the list, so read the values by index or by id and do not rely on `#values`.

```lua
MSK.Input.Dialog(header, rows, options)

-- Example
local values = MSK.Input.Dialog('Register vehicle', {
    { type = 'input', label = 'Plate', required = true, maxLength = 8, icon = 'id-card' },
    { type = 'number', label = 'Price', min = 1, max = 100000, default = 5000 },
    { type = 'select', label = 'Garage', options = { { value = 'pillbox', label = 'Pillbox' }, 'Sandy' } },
    { type = 'checkbox', label = 'Insured', id = 'insured' },
    'Note', -- shorthand for { type = 'input', label = 'Note' }
}, {
    size = 'md',
    labels = { confirm = 'Register' },
})

if not values then return end -- cancelled

print(values[1], values[2], values[3], values.insured, values[5])

-- As an Export:
local values = exports.msk_core:InputDialog(header, rows, options)
```

| Key | Action |
|---|---|
| Enter | Submit (inside a `textarea` it adds a new line instead) |
| ESC | Cancel (unless `allowCancel = false`) |

## MSK.Input.CloseDialog

Closes the open dialog. Whoever is waiting on it gets `nil`.

```lua
MSK.Input.CloseDialog()

-- As an Export:
exports.msk_core:CloseInputDialog()
```

## MSK.Input.DialogActive

Checks if a dialog is currently open.

**Returns**  
**isActive** - `boolean` - Whether a dialog is open

```lua
local isActive = MSK.Input.DialogActive()

-- As an Export:
local isActive = exports.msk_core:InputDialogActive()
```

## MSK.Input.Open

Opens the old single field input window.

:::warning[Deprecated]
`MSK.Input.Open`, `MSK.OpenInput`, `MSK.Input(...)` and the exports `Input` / `OpenInput` are deprecated and will be removed in a future version. The first call from a resource logs a warning, once per resource. Use [`MSK.Input.Dialog`](#mskinputdialog) instead:

```lua
local values = MSK.Input.Dialog('This is a Header', {
    { type = 'input', label = 'Name', placeholder = 'This is a Placeholder' }, -- or type = 'textarea' for the big input
})
local input = values and values[1]
```
:::

The input is normalized: an empty string is returned as `nil`, and a value that looks like a number is converted to a `number`.

**Parameters**  
**header** - `string` - Header text  
**placeholder** - `string` - Placeholder text  
**field** - `boolean` - Optional - Default: `false` - `true` opens the big input  
**cb** - `function` - Optional - Callback receiving the input

**Returns**  
**input** - `string/number/nil` - The entered value (only without a callback)

```lua
MSK.Input.Open(header, placeholder, field, cb)

-- Example
local input = MSK.Input.Open('This is a Header', 'This is a Placeholder')

MSK.Input.Open('This is a Header', 'This is a Placeholder', true, function(input)
    if not input then return end
    print(input)
end)

-- As an Export:
local input = exports.msk_core:Input(header, placeholder, field)
```

## MSK.Input.Close

Closes the old input window. A call that is still waiting on it returns `nil`.

```lua
MSK.Input.Close()

-- As an Export:
exports.msk_core:CloseInput()
```

## MSK.Input.Active

Checks if the old input window is currently open.

**Returns**  
**isActive** - `boolean` - Whether the input window is active

```lua
local isActive = MSK.Input.Active()

-- As an Export:
local isActive = exports.msk_core:InputActive()
```
