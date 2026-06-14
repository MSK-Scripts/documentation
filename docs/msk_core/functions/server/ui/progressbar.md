---
title: Progressbar
sidebar_position: 3
---

# Progressbar

The server-side Progress module triggers a progress bar on a target player identified by their server id. The first parameter is always the player's server id. These functions are thin wrappers that fire a client event on the target player; they do **not** return a value to the server. The `data` parameter may be a duration in milliseconds or a full data table (see the [client Progressbar documentation](../../client/ui/progressbar) for all table fields).

## MSK.Progress.Start

Shows a progressbar for a specific player. `color` is optional and defaults to `Config.ProgressColor`.

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `number/table` - Duration in milliseconds, or a data table  
**text** - `string` - Text (when `data` is a number)  
**color** - `string` - Color as hex - Optional (when `data` is a number)

```lua
MSK.Progress.Start(playerId, duration, text, color)

-- Example 1
MSK.Progress.Start(playerId, 5000, 'Progressing...')

-- Example 2
MSK.Progress.Start(playerId, 5000, 'Progressing...', "#5eb131")

-- Example 3: with a data table
MSK.Progress.Start(playerId, {
    duration = 5000,
    text = 'Progressing...',
    canCancel = true,
    disable = { move = true, combat = true },
})

-- As an Export:
exports.msk_core:Progressbar(playerId, data, text, color)
```

## MSK.Progress.Stop

Stops the current ProgressBar of a specific player.

**Parameters**  
**playerId** - `number` - The target player's server id

```lua
MSK.Progress.Stop(playerId)

-- As an Export:
exports.msk_core:ProgressStop(playerId)
```
