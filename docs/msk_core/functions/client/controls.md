---
title: Controls
sidebar_position: 16
---

# Controls

Disables game controls for as long as you need, without writing your own `Wait(0)` loop.

Disabling is counted. If two parts of your script both disable control `24`, it stays disabled until both of them enabled it again. `MSK.Controls.Clear` drops the count at once. Each resource gets one thread that only runs while something is disabled and stops by itself afterwards.

All functions accept control ids as single numbers, as lists of numbers, or mixed. You can find the ids in the [FiveM controls reference](https://docs.fivem.net/docs/game-references/controls/).

## MSK.Controls.Disable

Disables the given controls.

**Parameters**  
**...** - `number | number[]` - One or more control ids or lists of control ids

```lua
MSK.Controls.Disable(...)

-- Example: attack, aim and melee
MSK.Controls.Disable(24, 25, 140)

-- Example: with a list
local blocked = { 24, 25, 140, 141, 142 }
MSK.Controls.Disable(blocked)
```

## MSK.Controls.Enable

Undoes one `Disable` call for each of the given controls. A control disabled twice needs two `Enable` calls.

**Parameters**  
**...** - `number | number[]` - One or more control ids or lists of control ids

```lua
MSK.Controls.Enable(...)

-- Example
MSK.Controls.Enable(24, 25, 140)
```

## MSK.Controls.Clear

Enables the given controls no matter how often they were disabled. Without arguments every control of the calling resource is enabled again.

**Parameters**  
**...** - `number | number[]` - Optional - Control ids or lists of control ids

```lua
MSK.Controls.Clear(...)

-- Example: only control 24
MSK.Controls.Clear(24)

-- Example: everything
MSK.Controls.Clear()
```

## MSK.Controls.IsDisabled

Checks if the calling resource keeps a control disabled.

**Parameters**  
**control** - `number` - The control id

**Returns**  
**isDisabled** - `boolean` - `true` while the control is disabled

```lua
local isDisabled = MSK.Controls.IsDisabled(control)

-- Example
if MSK.Controls.IsDisabled(24) then
    print('attacking is blocked')
end
```

## MSK.Controls.GetDisabled

Returns all controls the calling resource keeps disabled, sorted by id.

**Returns**  
**controls** - `number[]` - A sorted list of control ids

```lua
local controls = MSK.Controls.GetDisabled()

-- Example
print(json.encode(MSK.Controls.GetDisabled()))
```
