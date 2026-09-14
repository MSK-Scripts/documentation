---
title: Alert
sidebar_position: 7
---

# Alert

The server-side Alert module shows an alert dialog on a target player identified by their server id and **waits for the answer**. There is no time limit apart from `data.timeout`, and the wait ends with `nil` when the player leaves.

See the [client-side documentation](../../client/ui/alert.md) for all fields.

:::info[No export]
The server side has no export. Use `MSK.Alert` through `@msk_core/import.lua` in your resource.
:::

## MSK.Alert.Show

Shows an alert dialog for a specific player and returns the answer to the server.

**Parameters**  
**playerId** - `number` - The target player's server id  
**data** - `table` - Alert data (`header`, `content`, `size`, `centered`, `cancel`, `labels`, `timeout`)

**Returns**  
**answer** - `string/nil` - `'confirm'`, `'cancel'`, `'timeout'` (with `data.timeout`) or `nil`

```lua
MSK.Alert.Show(playerId, data)

-- Example
local answer = MSK.Alert.Show(playerId, {
    header = 'Trade',
    content = 'Player 12 offers you $5.000 for your ~g~Sultan~s~. Accept?',
    timeout = 20000,
})

if answer == 'confirm' then
    -- do the trade
end

-- The module table is callable as well:
local answer = MSK.Alert(playerId, data)
```

:::warning
The answer comes from the client. Treat it like any other client input and check on the server that the trade is still valid before you carry it out.
:::
