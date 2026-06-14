---
title: Input
sidebar_position: 1
---

# Input

The Input module opens a NUI text input window. It supports both an asynchronous (callback) and a synchronous (return value) usage. When called with a callback the result is delivered through it; when called without one the call blocks and returns the entered value.

The input is automatically normalized: an empty string is returned as `nil`, and a value that looks like a number is converted to a `number`.

## MSK.Input.Open

Opens an Input Window.

**Parameters**  
**header** - `string` - Header text  
**placeholder** - `string` - Placeholder text  
**field** - `boolean` - `false`/omitted = small input, `true` = big input  
**cb** - `function` - (optional) Callback receiving the input

**Returns**  
**input** - `string/number/nil` - The entered value (only when called synchronously)

#### Asynchronous

```lua
-- Small Input Window
MSK.Input.Open('This is a Header', 'This is a Placeholder', function(input)
    if not input then return end
    print(input)
end)

-- Big Input Window
MSK.Input.Open('This is a Header', 'This is a Placeholder', true, function(input)
    if not input then return end
    print(input)
end)

-- As an Export:
exports.msk_core:Input(header, placeholder, field, function(input)
    if not input then return end
    print(input)
end)
```

#### Synchronous

```lua
-- Small Input Window
local input = MSK.Input.Open('This is a Header', 'This is a Placeholder')
print(input)

-- Big Input Window
local input = MSK.Input.Open('This is a Header', 'This is a Placeholder', true)
print(input)

-- As an Export:
local input = exports.msk_core:Input(header, placeholder, field)
```

## MSK.Input.Close

Closes the current Input Window.

```lua
MSK.Input.Close()

-- As an Export:
exports.msk_core:CloseInput()
```

## MSK.Input.Active

Checks if the Input Window is currently open.

**Returns**  
**isActive** - `boolean` - Whether the Input Window is active

```lua
local isActive = MSK.Input.Active()

-- As an Export:
local isActive = exports.msk_core:InputActive()
```
