---
title: Commands
sidebar_position: 13
---

# Commands

Register client-side commands with optional Ace permission checks, chat suggestions, typed argument parsing and key mappings. `MSK.RegisterCommand` behaves like the native `RegisterCommand`, but adds these features on top.

## MSK.RegisterCommand

Registers a client command. If `restricted` is `true`, the command only runs when the executing player passes the Ace check for `command.<commandName>` (resolved server-side via `MSK.IsAceAllowed`). Passing a `table` of command names registers the same handler for each of them.

**Parameters**  
**commandName** - `string` or `table` - The command name, or a list of names sharing one handler.  
**callback** - `function` - Handler executed as `callback(source, args, raw)`.  
**restricted** - `boolean` - Run an Ace permission check before executing. Optional, default: `false`.  
**properties** - `table` - Additional command properties (see below). Optional.

**Returns**  
**command** - `table` - The internal command entry that was registered.

**Description — `properties`**

- **showSuggestion** - `boolean` - Show / hide the chat suggestion. Optional, default: `true`
- **help** - `string` - Chat suggestion description
- **params** - `table` - Typed argument definitions (see below)
- **hotkey** - `table` - Register a key mapping via `RegisterKeyMapping`. Optional, default: `nil`

:::warning
A `hotkey` cannot be combined with `params`. If both are set, the hotkey is skipped and a warning is logged.
:::

**Description — `params`**

- **name** - `string` - Name of the argument (becomes the key in `args`)
- **type** - `string` - One of `number`, `string`, `playerId`, `player`, `any`
- **help** - `string` - Chat suggestion of the argument
- **optional** - `boolean` - Mark the argument optional (must be the last one). Optional, default: `false`

**Description — `hotkey`**

- **key** - `string` - The default key
- **text** - `string` - Description shown in the FiveM keybind settings
- **type** - `string` - Input mapper type. Optional, default: `'keyboard'`

```lua
MSK.RegisterCommand(commandName, callback, restricted, properties)

-- Example 1
MSK.RegisterCommand('testCommand', function(source, args, raw)
    local data, reason = args.data, args.reason

    if not reason then
        reason = 'Unknown reason'
    end

    print(('Data: %s; Reason: %s'):format(data, reason))
end, false, {
    showSuggestion = true,
    help = 'This is a Test Command',
    params = {
        {name = 'data', type = 'any', help = 'Anything'},
        {name = 'reason', type = 'string', help = 'Optional Text', optional = true},
    }
})

-- Example 2 -> With Hotkey (you can't use params)
MSK.RegisterCommand('testCommand', function(source, args, raw)
    print('Command triggered')
end, false, {
    showSuggestion = true,
    help = 'This is a Test Command',
    hotkey = {
        key = 'X',
        text = 'Test Command'
    }
})

-- As an Export:
exports.msk_core:RegisterCommand(commandName, callback, restricted, properties)
```
