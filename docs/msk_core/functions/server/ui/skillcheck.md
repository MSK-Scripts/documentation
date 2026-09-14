---
title: Skillcheck
sidebar_position: 8
---

# Skillcheck

The server-side Skillcheck module runs a skillcheck on a target player identified by their server id and **waits for the result**. There is no time limit, and the wait ends with `false` when the player leaves.

See the [client-side documentation](../../client/ui/skillcheck.md) for the difficulty presets and the custom difficulty table.

:::info[No export]
The server side has no export. Use `MSK.Skillcheck` through `@msk_core/import.lua` in your resource.
:::

:::warning[The result comes from the client]
Fine for gameplay, but do not let it alone decide over money or items. Add a plausibility check on the server (distance, item, cooldown).
:::

## MSK.Skillcheck.Start

Runs a skillcheck for a specific player and returns the result to the server.

**Parameters**  
**playerId** - `number` - The target player's server id  
**difficulty** - `string/table` - Optional - Default: `'easy'` - A preset, a custom table, or a list of those for several rounds  
**inputs** - `table` - Optional - Default: `{ 'e' }` - Keys to pick from

**Returns**  
**passed** - `boolean` - `true` when every round was passed

```lua
MSK.Skillcheck.Start(playerId, difficulty, inputs)

-- Example
if MSK.Skillcheck.Start(playerId, 'hard') then
    -- lockpick succeeded
end

local passed = MSK.Skillcheck.Start(playerId, { 'easy', 'medium' }, { 'e', 'q' })

-- The module table is callable as well:
local passed = MSK.Skillcheck(playerId, 'medium')
```
