---
title: Anim
sidebar_position: 19
---

# Anim

Plays animations and scenarios without the usual load, play and release boilerplate.

Wherever a function takes a `ped`, you can pass `nil` to use the player's own ped.

## MSK.Anim.Play

Loads the animation dictionary, plays the clip and releases the dictionary again (the running task keeps its own reference). `MSK.Anim(...)` is a shortcut for `MSK.Anim.Play(...)`.

The dictionary is loaded with [`MSK.Request.AnimDict`](./request.md#mskrequestanimdict), so an invalid dictionary or a load that takes longer than 30 seconds raises an error.

**Parameters**  
**ped** - `number` - Optional - Default: the player's ped - The ped that plays the animation  
**dict** - `string` - The animation dictionary  
**clip** - `string` - The animation clip  
**options** - `table` - Optional - Playback options  
- **blendIn** - `number` - Optional - Default: `8.0`  
- **blendOut** - `number` - Optional - Default: `-8.0`  
- **duration** - `number` - Optional - Default: `-1` - Duration in milliseconds, `-1` plays the full clip  
- **flag** - `number` - Optional - Default: `0` - The animation flags, e.g. `1` to loop or `49` to loop on the upper body while the player can move  
- **rate** - `number` - Optional - Default: `0.0` - Passed to `TaskPlayAnim` as its playback rate argument  
- **lockX** / **lockY** / **lockZ** - `boolean` - Optional - Default: `false`  
- **wait** - `boolean` - Optional - Default: `false` - Blocks the calling thread until the animation has ended

```lua
MSK.Anim.Play(ped, dict, clip, options)

-- Example
MSK.Anim.Play(nil, 'mp_common', 'givetake1_a', { duration = 2000, flag = 49 })

-- Example: wait until it is done
MSK.Anim.Play(nil, 'amb@world_human_clipboard@male@idle_a', 'idle_c', { wait = true })
print('animation finished')
```

### How `wait` behaves

- First it waits up to one second for the ped to actually report the animation, `TaskPlayAnim` needs a moment for that.
- Then it waits until the ped stops playing the clip.
- With a `duration`, it gives up at the latest 500 ms after that duration, even if the clip is still reported as playing.
- A **looping** animation (flag contains `1`) **without a duration** never ends on its own. In that case `wait` is ignored: the animation still plays, the function returns right away and a warning is logged. Pass a `duration` if you want to wait for a looping animation.

```lua
-- Blocks for about 5 seconds, then continues
MSK.Anim.Play(nil, 'amb@world_human_hang_out_street@male_a@idle_a', 'idle_a', { flag = 1, duration = 5000, wait = true })
```

## MSK.Anim.Stop

Stops a running animation.

**Parameters**  
**ped** - `number` - Optional - Default: the player's ped  
**dict** - `string` - The animation dictionary  
**clip** - `string` - The animation clip  
**blendOut** - `number` - Optional - Default: `1.0`

```lua
MSK.Anim.Stop(ped, dict, clip, blendOut)

-- Example
MSK.Anim.Stop(nil, 'mp_common', 'givetake1_a')
```

## MSK.Anim.IsPlaying

Checks if a ped plays a certain animation.

**Parameters**  
**ped** - `number` - Optional - Default: the player's ped  
**dict** - `string` - The animation dictionary  
**clip** - `string` - The animation clip

**Returns**  
**isPlaying** - `boolean` - `true` while the animation plays

```lua
local isPlaying = MSK.Anim.IsPlaying(ped, dict, clip)

-- Example
if MSK.Anim.IsPlaying(nil, 'mp_common', 'givetake1_a') then
    print('still handing over')
end
```

## MSK.Anim.Scenario

Starts a scenario in place, e.g. `'WORLD_HUMAN_SMOKING'`.

**Parameters**  
**ped** - `number` - Optional - Default: the player's ped  
**scenario** - `string` - The scenario name  
**playEnter** - `boolean` - Optional - Default: `true` - Plays the enter animation of the scenario

```lua
MSK.Anim.Scenario(ped, scenario, playEnter)

-- Example
MSK.Anim.Scenario(nil, 'WORLD_HUMAN_CLIPBOARD')
```

## MSK.Anim.Clear

Ends whatever the ped is doing, animations and scenarios included.

**Parameters**  
**ped** - `number` - Optional - Default: the player's ped  
**immediately** - `boolean` - Optional - Default: `false` - `true` uses `ClearPedTasksImmediately`, which skips the exit animation

```lua
MSK.Anim.Clear(ped, immediately)

-- Example
MSK.Anim.Clear()
```
