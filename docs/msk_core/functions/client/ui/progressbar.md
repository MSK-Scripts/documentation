---
title: Progressbar
sidebar_position: 3
---

# Progressbar

The Progress module shows a timed progress bar or a progress circle. It waits until the progress has ended and tells you whether it ran out or was cancelled. While it runs it can play an animation or a scenario, attach props, disable controls and stop itself when the player dies, ragdolls or gets cuffed.

The default color is taken from `Config.ProgressColor` (`#00e676`, MSK green). The module table is callable, `MSK.Progress(data)` is the same as `MSK.Progress.Start(data)`.

## MSK.Progress.Start

Shows a progress bar and waits until it ends.

**Parameters**  
**data** - `table` - Data for the progress

**Returns**  
**finished** - `boolean` - `true` when the progress ran out. `false` when it was cancelled, interrupted, or could not start because another progress is running

**Description**  
- **duration** - `number <milliseconds>` - Optional - Default: `1000` - The time in milliseconds  
- **text** - `string` - Optional - Text (`label` works as well)  
- **color** - `string` - Optional - Default: `Config.ProgressColor` - Color as hex  
- **position** - `string` - Optional - `bottom` or `middle`. Default `bottom` for the bar, `middle` for the circle  
- **type** - `string` - Optional - `circle` shows a circle instead of a bar  
- **canCancel** - `boolean` - Optional - Default: `false` - The player can cancel it with `X`  
- **forceOverride** - `boolean` - Optional - Default: `false` - Replace a running progress instead of returning `false`  
- **animation** - `table` - Optional - Animation data (`anim` works as well), see below  
- **prop** - `table` - Optional - One prop or a list of props, see below  
- **disable** - `table` - Optional - Disable `mouse`, `move`, `sprint`, `vehicle` (or `car`), `combat`  
- **useWhileDead** - `boolean` - Optional - Default: `false` - Keep running while the ped is dead  
- **useWhileRagdoll** - `boolean` - Optional - Default: `false` - Keep running while the ped is ragdolling  
- **useWhileCuffed** - `boolean` - Optional - Default: `false` - Keep running while the ped is cuffed  
- **useWhileFalling** - `boolean` - Optional - Default: `false` - Keep running while the ped is falling  
- **useWhileSwimming** - `boolean` - Optional - Default: `false` - Keep running while the ped is swimming

`allowRagdoll`, `allowCuffed`, `allowFalling` and `allowSwimming` are accepted as alternative names.

**Animation**  
- **dict** - `string` - Animation dictionary  
- **anim** - `string` - Animation name (`clip` works as well)  
- **flag** - `number` - Optional - Default: `49`  
- **blendIn** - `number` - Optional - Default: `3.0`  
- **blendOut** - `number` - Optional - Default: `1.0`  
- **duration** - `number` - Optional - Default: `-1`  
- **playbackRate** - `number` - Optional - Default: `0`  
- **lockX** / **lockY** / **lockZ** - `boolean` - Optional - Default: `false`  
- **scenario** - `string` - Play a scenario instead of `dict` + `anim`  
- **playEnter** - `boolean` - Optional - Default: `true` - Play the enter animation of the scenario

When the progress ends only this animation is stopped, other tasks of the ped keep running. A scenario clears the ped tasks.

**Prop**  
- **model** - `string/number` - The prop model  
- **bone** - `number` - Optional - Default: `60309` - Ped bone the prop is attached to  
- **pos** - `vector3` - Optional - Offset  
- **rot** - `vector3` - Optional - Rotation  
- **rotOrder** - `number` - Optional - Default: `0`

Props are deleted when the progress ends, and also when msk_core stops while a progress is running.

```lua
MSK.Progress.Start(data)

-- Example
local finished = MSK.Progress.Start({
    duration = 5000,
    text = 'Repairing...',
    canCancel = true,
    animation = {
        dict = 'mini@repair',
        clip = 'fixing_a_ped',
    },
    prop = {
        model = 'prop_tool_wrench',
        bone = 57005,
        pos = vec3(0.1, 0.0, 0.0),
        rot = vec3(0.0, 0.0, 90.0),
    },
    disable = {
        move = true,
        vehicle = true,
        combat = true,
    },
})

if finished then
    print('Vehicle repaired')
else
    print('Cancelled')
end

-- As an Export:
local finished = exports.msk_core:Progressbar(data)
```

:::tip[Cancel key]
`X` is only the default. Players can rebind it in the FiveM key bindings under **Cancel Progressbar**.
:::

:::warning[Deprecated]
The old form `MSK.Progress.Start(duration, text, color)` (also `MSK.Progressbar(duration, text, color)`) still works, but is deprecated and logs a warning once per resource. It does **not** wait and returns nothing. Use the table form instead, which waits and returns `true` or `false`:

```lua
local finished = MSK.Progress.Start({ duration = 5000, text = 'Progressing...' })
```
:::

## MSK.Progress.Circle

Same as [`MSK.Progress.Start`](#mskprogressstart), shown as a circle. It takes the same fields and returns the same result.

**Parameters**  
**data** - `table` - Data for the progress

**Returns**  
**finished** - `boolean` - `true` when the progress ran out

```lua
MSK.Progress.Circle(data)

-- Example
local finished = MSK.Progress.Circle({
    duration = 3000,
    text = 'Eating...',
    position = 'bottom',
    animation = { scenario = 'WORLD_HUMAN_SEAT_LEDGE_EATING' },
})

-- As an Export:
local finished = exports.msk_core:ProgressCircle(data)
```

## MSK.Progress.Stop

Stops the current progress. A waiting `Start` or `Circle` returns `false`.

```lua
MSK.Progress.Stop()

-- As an Export:
exports.msk_core:ProgressStop()
```

## MSK.Progress.Active

Checks if a progress is currently running and returns its data.

**Returns**  
**isActive** - `boolean` - Whether a progress is running  
**data** - `table/false` - The data of the running progress

```lua
local isActive, data = MSK.Progress.Active()

-- As an Export:
local isActive, data = exports.msk_core:ProgressActive()
```
