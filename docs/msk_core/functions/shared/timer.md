---
title: Timer
sidebar_position: 11
---

# Timer

A countdown that can be paused, resumed, stopped and restarted. There is no polling thread: starting or resuming arms one thread that sleeps for the remaining time, and pausing or stopping simply makes that thread do nothing when it wakes up.

:::info[New in v4.1.0]
`MSK.Timer` has no exports. Use it through the import in your own resource.
:::

## MSK.Timer.New

Creates a timer over `duration` milliseconds. It starts right away unless `autoStart` is `false`. When the time is up, `onEnd(timer)` is called. An error inside `onEnd` is caught and printed.

**Parameters**  
**duration** - `number` - Duration in milliseconds, `0` or more  
**onEnd** - `function` - Optional - `onEnd(timer)` called when the time is up  
**autoStart** - `boolean` - Optional - Default: `true` - `false` creates the timer without starting it

**Returns**  
**timer** - `table` - The timer

```lua
local timer = MSK.Timer.New(duration, onEnd, autoStart)

-- Example
local timer = MSK.Timer.New(30000, function(self)
    print('Time is up')
end)

Wait(10000)
timer:Pause()
print(timer:GetTimeLeft('s')) -- Output: about 20.0
timer:Resume()
```

:::note
A timer uses a metatable, so it cannot be passed through an export. Keep it in the resource that created it.
:::

## timer:Start

Starts the timer from its full duration. Does nothing while it is already running.

**Returns**  
**started** - `boolean` - Whether the timer was started

```lua
local started = timer:Start()
```

## timer:Pause

Pauses a running timer and keeps the remaining time.

**Returns**  
**paused** - `boolean` - Whether the timer was paused

```lua
local paused = timer:Pause()
```

## timer:Resume

Resumes a paused timer with the remaining time.

**Returns**  
**resumed** - `boolean` - Whether the timer was resumed

```lua
local resumed = timer:Resume()
```

## timer:Stop

Stops a running or paused timer. With `runOnEnd` the end callback runs as if the time was up, and the timer counts as finished.

**Parameters**  
**runOnEnd** - `boolean` - Optional - Default: `false` - Run `onEnd` right away

**Returns**  
**stopped** - `boolean` - Whether the timer was stopped

```lua
local stopped = timer:Stop(runOnEnd)

-- Example
timer:Stop()     -- cancel silently
timer:Stop(true) -- finish now and run onEnd
```

## timer:Restart

Starts the timer again from the beginning, whatever state it is in. A new duration can be passed.

**Parameters**  
**duration** - `number` - Optional - New duration in milliseconds

```lua
timer:Restart(duration)

-- Example
timer:Restart()      -- same duration again
timer:Restart(60000) -- now one minute
```

## timer:GetTimeLeft

Returns the remaining time in the given unit. Milliseconds are returned as a whole number, every other unit is rounded to two decimals.

**Parameters**  
**unit** - `string` - Optional - Default: `'ms'` - `'ms'`, `'s'`, `'m'` or `'h'`

**Returns**  
**timeLeft** - `number` - The remaining time

```lua
local timeLeft = timer:GetTimeLeft(unit)

-- Example
timer:GetTimeLeft()    -- Output: 21370
timer:GetTimeLeft('s') -- Output: 21.37
timer:GetTimeLeft('m') -- Output: 0.36
```

## timer:IsRunning / IsPaused / IsFinished

Check the current state of the timer. A timer that was stopped without `runOnEnd` is neither running, paused nor finished.

**Returns**  
**state** - `boolean` - Whether the timer is in that state

```lua
local running = timer:IsRunning()
local paused = timer:IsPaused()
local finished = timer:IsFinished()
```

## timer:SetOnEnd

Replaces the end callback. `nil` removes it.

**Parameters**  
**onEnd** - `function` - Optional - `onEnd(timer)`

```lua
timer:SetOnEnd(onEnd)
```
