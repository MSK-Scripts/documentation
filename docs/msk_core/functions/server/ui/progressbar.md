---
title: Progressbar
sidebar_position: 3
---

# Progressbar

The server-side Progress module shows a progress bar or circle on a target player identified by their server id. The first parameter is always the player's server id. The table form **waits until the progress has ended on the client** and returns the result to the server. There is no time limit, and the wait ends with `false` when the player leaves.

See the [client-side documentation](../../client/ui/progressbar.md) for all fields (animation, props, disabled controls, interrupt conditions).

:::warning[The result comes from the client]
Good enough for gameplay, but check on the server whether the action was plausible (distance, item, cooldown) before you hand out money or items for it.
:::

## MSK.Progress.Start

Shows a progress bar for a specific player and waits until it ends.

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `table` - Data for the progress

**Returns**  
**finished** - `boolean` - `true` when the progress ran out, `false` otherwise

```lua
MSK.Progress.Start(playerId, data)

-- Example
local finished = MSK.Progress.Start(playerId, {
    duration = 5000,
    text = 'Repairing...',
    canCancel = true,
    disable = { move = true, combat = true },
})

if finished then
    -- repair the vehicle
end

-- As an Export:
local finished = exports.msk_core:Progressbar(playerId, data)
```

:::warning[Deprecated]
The old form `MSK.Progress.Start(playerId, duration, text, color)` still works, but is deprecated and logs a warning once per resource. It does **not** wait and returns nothing. Use the table form instead:

```lua
local finished = MSK.Progress.Start(playerId, { duration = 5000, text = 'Progressing...' })
```
:::

## MSK.Progress.Circle

Same as [`MSK.Progress.Start`](#mskprogressstart), shown as a circle.

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `table` - Data for the progress

**Returns**  
**finished** - `boolean` - `true` when the progress ran out, `false` otherwise

```lua
MSK.Progress.Circle(playerId, data)

-- Example
local finished = MSK.Progress.Circle(playerId, { duration = 3000, text = 'Eating...' })

-- As an Export:
local finished = exports.msk_core:ProgressCircle(playerId, data)
```

## MSK.Progress.Stop

Stops the current progress of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Progress.Stop(playerId)

-- As an Export:
exports.msk_core:ProgressStop(playerId)
```
