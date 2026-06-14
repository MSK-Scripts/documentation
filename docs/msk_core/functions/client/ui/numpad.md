---
title: Numpad
sidebar_position: 2
---

# Numpad

The Numpad module opens a NUI PIN/code pad. The player has to enter the given code; the call resolves once the correct code is submitted. It supports both an asynchronous (callback) and a synchronous (return value) usage.

## MSK.Numpad.Open

Opens a Numpad Window that the player must solve by entering the given PIN.

**Parameters**  
**pin** - `string/number` - The code the player has to enter  
**showPin** - `boolean` - Show the numbers or `****`  
**cb** - `function` - (optional) Callback that receives `true` when the correct code was entered

**Returns**  
**isCorrect** - `boolean` - `true` when the correct code was entered (only when called synchronously)

#### Asynchronous

```lua
MSK.Numpad.Open('1234', true, function(isCorrect)
    print('Correct:', isCorrect)
end)

-- As an Export:
exports.msk_core:Numpad(pin, showPin, function(isCorrect)
    print('Correct:', isCorrect)
end)
```

#### Synchronous

```lua
local isCorrect = MSK.Numpad.Open('1234', true)

-- As an Export:
local isCorrect = exports.msk_core:Numpad(pin, showPin)
```

## MSK.Numpad.Close

Closes the current Numpad Window.

```lua
MSK.Numpad.Close()

-- As an Export:
exports.msk_core:CloseNumpad()
```

## MSK.Numpad.Active

Checks if the Numpad Window is currently open.

**Returns**  
**isActive** - `boolean` - Whether the Numpad Window is active

```lua
local isActive = MSK.Numpad.Active()

-- As an Export:
local isActive = exports.msk_core:NumpadActive()
```
