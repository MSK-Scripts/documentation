---
title: Commands
sidebar_position: 11
---

# Commands

Register server-side commands with typed argument parsing, chat suggestions, console restrictions and Ace-based group restrictions. `MSK.RegisterCommand` wraps the native `RegisterCommand` and adds these features.

## MSK.RegisterCommand

Registers a server command. The handler runs as `callback(source, args, raw)`. Passing a `table` of command names registers the same handler for each of them.

If `restricted` is set in `properties`, the command is registered as restricted and the matching `command.<commandName>` Ace is granted to the given group(s) automatically (via `MSK.AddAce`) unless already allowed.

**Parameters**  
**commandName** - `string` or `table` - The command name, or a list of names sharing one handler.  
**callback** - `function` - Handler executed as `callback(source, args, raw)` (or `callback(Player, args, raw)` when `returnPlayer` is set).  
**properties** - `table` - Additional command properties (see below). Optional.

**Returns**  
**command** - `table` - The internal command entry that was registered.

**Description — `properties`**

- **allowConsole** - `boolean` - Allow execution from the server console (`source == 0`). Optional, default: `true`
- **showSuggestion** - `boolean` - Show / hide the chat suggestion. Optional, default: `true`
- **restricted** - `boolean` or `string` or `table` - Restrict the command to one or more groups via Ace. When a string or table is given, the corresponding `command.<commandName>` Ace is added for those groups.
- **returnPlayer** - `boolean` - Pass the resolved Player object as the first handler argument instead of `source` (ESX / QBCore only).
- **help** - `string` - Chat suggestion description
- **params** - `table` - Typed argument definitions (see below)

**Description — `params`**

- **name** - `string` - Name of the argument (becomes the key in `args`)
- **type** - `string` - One of `number`, `string`, `playerId`, `player`, `any`
- **help** - `string` - Chat suggestion of the argument
- **optional** - `boolean` - Mark the argument optional (must be the last one). Optional, default: `false`

:::info
For `type = 'player'`, the argument is resolved to the full Player object (ESX / QBCore). For `type = 'playerId'`, only the numeric server id is returned. In both cases `me` resolves to the executing player.
:::

```lua
MSK.RegisterCommand(commandName, callback, properties)

-- Example 1
MSK.RegisterCommand('testCommand', function(source, args, raw)
    local targetId, time, reason = args.playerId, args.time, args.reason

    if not reason then
        reason = 'Unknown reason'
    end

    print(('Player %s was banned by %s for %s until %s'):format(targetId, source, reason, time))
end, {
    allowConsole = true,
    showSuggestion = true,
    restricted = {'superadmin', 'admin'},
    help = 'This is a Test Command',
    params = {
        {name = 'playerId', type = 'playerId', help = 'Target players server id'},
        {name = 'time', type = 'string', help = 'Ban Time'},
        {name = 'reason', type = 'string', help = 'Ban Reason', optional = true},
    }
})

-- Example 2 -> Framework based (Only ESX and QBCore)
MSK.RegisterCommand('testCommand', function(Player, args, raw)
    local Target = args.player

    -- ESX
    print(Player.source)       -- PlayerId of the Executer
    print(Target.source)       -- PlayerId of the Arguments playerId

    -- QBCore
    print(Player.PlayerData.source)
    print(Target.PlayerData.source)
end, {
    allowConsole = true,
    showSuggestion = true,
    returnPlayer = true,
    restricted = {'superadmin', 'admin'},
    help = 'This is a Test Command',
    params = {
        {name = 'player', type = 'player', help = 'random argument'},
    }
})

-- As an Export:
exports.msk_core:RegisterCommand(commandName, callback, properties)
```
