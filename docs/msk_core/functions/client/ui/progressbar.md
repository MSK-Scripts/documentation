---
title: Progressbar
sidebar_position: 3
---

# Progressbar

The Progress module displays a timed progress bar in the NUI. It can either be called with a simple duration/text/color signature, or with a full data table that additionally handles animations, control disabling, interrupt conditions and cancelling. The default color is taken from `Config.ProgressColor` (`#00e676`, MSK green).

## MSK.Progress.Start

Shows a progressbar. `color` is optional and defaults to `Config.ProgressColor`.

**Parameters**  
**duration** - `number <milliseconds>` - The time in milliseconds  
**text** - `string` - Text  
**color** - `string` - Color as hex - Optional

```lua
MSK.Progress.Start(duration, text, color)

-- Example 1
MSK.Progress.Start(5000, 'Progressing...') -- default color from config.lua
Wait(5000)

-- Example 2
MSK.Progress.Start(5000, 'Progressing...', "#5eb131") -- custom color
Wait(5000)

-- As an Export:
exports.msk_core:Progressbar(duration, text, color)
```

### Progressbar with specific data

When called with a data table the call is blocking and only returns once the progress has finished or has been stopped.

**Parameters**  
**data** - `table` - Data for the Progressbar

**Returns**  
**progressEnd** - `boolean` - If the progress has ended or was stopped

**Description**  
- **duration** - `number <milliseconds>` - The time in milliseconds  
- **text** - `string` - Text  
- **color** - `string` - Color as hex - Optional  
- **forceOverride** - `boolean` - Restart even if a progress is already active - Optional  
- **canCancel** - `boolean` - If the player can cancel the Progressbar with the `X` key  
- **useWhileDead** - `boolean` - Keep running while the ped is dead  
- **useWhileRagdoll** - `boolean` - Keep running while the ped is ragdolling  
- **useWhileCuffed** - `boolean` - Keep running while the ped is cuffed  
- **useWhileFalling** - `boolean` - Keep running while the ped is falling  
- **useWhileSwimming** - `boolean` - Keep running while the ped is swimming  
- **animation** - `table` - Animation data (`dict` + `anim`, or `scenario`) - Optional  
- **disable** - `table` - Disable specific actions: `mouse`, `move`, `sprint`, `vehicle`, `combat` - Optional

```lua
MSK.Progress.Start(data)

-- Example
local finished = MSK.Progress.Start({
    duration = 5000,
    text = 'Progressing...',
    color = "#5eb131", -- Optional
    forceOverride = false,
    canCancel = true,
    useWhileDead = false,
    useWhileCuffed = false,
    animation = {
        dict = 'timetable@gardener@filling_can',
        anim = 'gar_ig_5_filling_can',
        flag = 49, -- Optional
    },
    disable = {
        move = true,
        vehicle = true,
        combat = true,
    }
})
print('Progressbar ended or canceled')

-- As an Export:
exports.msk_core:Progressbar(data)
```

## MSK.Progress.Stop

Stops the current ProgressBar.

```lua
MSK.Progress.Stop()

-- As an Export:
exports.msk_core:ProgressStop()
```

## MSK.Progress.Active

Checks if a progressbar is currently active and returns its data.

**Returns**  
**isActive** - `boolean` - Whether the Progressbar is active  
**data** - `table/false` - The active progress data, or `false` when none is active

```lua
local isActive, data = MSK.Progress.Active()

-- As an Export:
local isActive, data = exports.msk_core:ProgressActive()
```
