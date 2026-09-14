---
title: Skillcheck
sidebar_position: 9
---

# Skillcheck

The Skillcheck module runs a timing check. A marker runs around a circle and the player has to press the shown key while the marker is inside the highlighted area. Pressing too early, pressing the wrong key or letting the marker pass the area fails the round.

Several rounds can be chained. Every round has to be passed, the first failed round ends the check. The module table is callable, `MSK.Skillcheck(...)` is the same as `MSK.Skillcheck.Start(...)`.

:::warning
The result comes from the client. Fine for gameplay, but do not use it as the only check for anything valuable. The [server form](../../server/ui/skillcheck.md) waits for the same result, it is still reported by the client.
:::

## MSK.Skillcheck.Start

Starts a skillcheck and waits for the result.

**Parameters**  
**difficulty** - `string/table` - Optional - Default: `'easy'` - A preset, a custom table, or a list of those for several rounds  
**inputs** - `table` - Optional - Default: `{ 'e' }` - Keys to pick from. Every round picks one of them at random

**Returns**  
**passed** - `boolean` - `true` when every round was passed. `false` otherwise, or right away when a skillcheck is already running

**Difficulty**  

| Preset | `areaSize` | `speedMultiplier` |
|---|---|---|
| `easy` | `50` | `1.0` |
| `medium` | `40` | `1.5` |
| `hard` | `25` | `1.75` |

A custom difficulty is a table with **areaSize** (size of the area in degrees, `5` to `180`, default `40`) and **speedMultiplier** (`0.1` to `10`, default `1.0`).

```lua
MSK.Skillcheck.Start(difficulty, inputs)

-- Example
if MSK.Skillcheck.Start('medium') then
    print('passed')
end

-- Three rounds with random WASD keys
local passed = MSK.Skillcheck.Start({ 'easy', 'easy', 'hard' }, { 'w', 'a', 's', 'd' })

-- Custom difficulty
local passed = MSK.Skillcheck.Start({ areaSize = 30, speedMultiplier = 2 })

-- As an Export:
local passed = exports.msk_core:Skillcheck(difficulty, inputs)
```

## MSK.Skillcheck.Cancel

Ends a running skillcheck as failed. A waiting `Start` returns `false`.

```lua
MSK.Skillcheck.Cancel()

-- As an Export:
exports.msk_core:CancelSkillcheck()
```

## MSK.Skillcheck.Active

Checks if a skillcheck is currently running.

**Returns**  
**isActive** - `boolean` - Whether a skillcheck is running

```lua
local isActive = MSK.Skillcheck.Active()

-- As an Export:
local isActive = exports.msk_core:SkillcheckActive()
```
