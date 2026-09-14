---
title: Alert
sidebar_position: 7
---

# Alert

The Alert module shows a modal dialog with a header, a text and a confirm and cancel button, and waits for the player's answer. Use it for questions like "Do you really want to sell your vehicle?".

Opening a second alert replaces the first one, whoever was waiting on the first gets `nil`. The module table is callable, `MSK.Alert(data)` is the same as `MSK.Alert.Show(data)`.

## MSK.Alert.Show

Shows an alert dialog and waits for the answer.

**Parameters**  
**data** - `table` - Alert data

**Description**  
- **header** - `string` - Optional - Header text. Either `header` or `content` is required  
- **content** - `string` - Optional - The text. Line breaks (`\n`) and FiveM color codes such as `~g~` work  
- **size** - `string` - Optional - Default: `'md'` - `sm`, `md` or `lg`  
- **centered** - `boolean` - Optional - Default: `false` - Center the text  
- **cancel** - `boolean` - Optional - Default: `true` - `false` hides the cancel button  
- **labels** - `table` - Optional - `{ confirm = '...', cancel = '...' }`. Default `Confirm` and `Cancel`  
- **timeout** - `number <milliseconds>` - Optional - Closes the dialog after this time and returns `'timeout'`

**Returns**  
**answer** - `string/nil` - `'confirm'`, `'cancel'`, `'timeout'` when `timeout` ran out, or `nil` when the dialog was closed from code

```lua
MSK.Alert.Show(data)

-- Example
local answer = MSK.Alert.Show({
    header = 'Sell vehicle',
    content = 'Do you really want to sell your ~g~Sultan~s~ for $12.000?\nThis cannot be undone.',
    labels = { confirm = 'Sell', cancel = 'Keep' },
    timeout = 15000,
})

if answer == 'confirm' then
    print('sold')
elseif answer == 'timeout' then
    print('the player did not answer in time')
end

-- As an Export:
local answer = exports.msk_core:AlertDialog(data)
```

| Key | Action |
|---|---|
| Enter | Confirm |
| ESC | Cancel. Without a cancel button (`cancel = false`) it confirms |

## MSK.Alert.Close

Closes the open alert. A waiting `Show` returns `nil`.

```lua
MSK.Alert.Close()

-- As an Export:
exports.msk_core:CloseAlertDialog()
```

## MSK.Alert.Active

Checks if an alert is currently open.

**Returns**  
**isActive** - `boolean` - Whether an alert is open

```lua
local isActive = MSK.Alert.Active()

-- As an Export:
local isActive = exports.msk_core:AlertActive()
```
