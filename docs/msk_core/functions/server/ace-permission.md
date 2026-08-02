---
title: Ace Permission
sidebar_position: 10
---

# Ace Permission

Ace permissions work standalone and do not depend on a framework. The server-side helpers wrap the native Ace natives (`IsPlayerAceAllowed`, `IsPrincipalAceAllowed`) and the `add_ace` / `remove_ace` / `add_principal` / `remove_principal` commands, with convenient normalization of principals and Ace strings.

:::warning[server.cfg requirement]
For `MSK.AddAce`, `MSK.RemoveAce`, `MSK.AddRawAce`, `MSK.RemoveRawAce`, `MSK.AddPrincipal` and `MSK.RemovePrincipal` to work, msk_core must be allowed to manage Aces. Add the following to your `server.cfg`:

```cfg
add_ace resource.msk_core command.add_ace allow
add_ace resource.msk_core command.remove_ace allow
add_ace resource.msk_core command.add_principal allow
add_ace resource.msk_core command.remove_principal allow
```
:::

## Principal normalization

The `principal` / `child` arguments accept a flexible format. If the value does not already start with `player.`, `group.` or `identifier.`, it is normalized automatically:

- A number becomes `player.<id>`
- A string containing a `:` (e.g. `steam:110000...`) becomes `identifier.<value>`
- Any other string becomes `group.<value>`

`AddPrincipal` / `RemovePrincipal` additionally prefix the `parent` group with `group.` if missing, and `AddAce` / `RemoveAce` prefix the `ace` with `command.` if missing.

## MSK.IsAceAllowed

Checks whether a player has Ace permission for a command. The command is automatically prefixed with `command.` if needed.

**Parameters**  
**playerId** - `number` - The player's server id.  
**command** - `string` - Command name to check (the `command.` prefix is added automatically).

**Returns**  
**hasAcePerm** - `boolean` - Whether the player has Ace permission for the given command.

```lua
local hasAcePerm = MSK.IsAceAllowed(playerId, command)

-- Example
local hasAcePerm = MSK.IsAceAllowed(1, 'your_command')

-- As an Export:
local hasAcePerm = exports.msk_core:IsAceAllowed(playerId, command)
```

## MSK.IsPrincipalAceAllowed

Checks whether a principal has a specific Ace permission. The principal is normalized (see above).

**Parameters**  
**principal** - `string` or `number` - The principal (e.g. `group.admin`, `1`, a license/steam identifier).  
**ace** - `string` - The Ace permission to check.

**Returns**  
**isAllowed** - `boolean` - Whether the principal has the given Ace permission.

```lua
local isAllowed = MSK.IsPrincipalAceAllowed(principal, ace)

-- Example
local isAllowed = MSK.IsPrincipalAceAllowed('group.admin', 'command.your_command')

-- As an Export:
local isAllowed = exports.msk_core:IsPrincipalAceAllowed(principal, ace)
```

## MSK.AddAce

Grants an Ace permission to a principal. The principal is normalized and the ace is prefixed with `command.` if needed.

**Parameters**  
**principal** - `number` or `string` - The principal to grant the permission to.  
**ace** - `string` - The Ace permission to add.  
**allow** - `boolean` - Pass `false` to add a `deny` rule instead of `allow`. Optional, default: `true` (allow).

```lua
MSK.AddAce(principal, ace, allow)

-- Example 1: Adds command permission for group admin
MSK.AddAce('admin', 'command.your_command')

-- Example 2: Adds command permission for playerId 1
MSK.AddAce(1, 'command.your_command')

-- As an Export:
exports.msk_core:AddAce(principal, ace, allow)
```

## MSK.RemoveAce

Removes an Ace permission from a principal. The principal is normalized and the ace is prefixed with `command.` if needed.

**Parameters**  
**principal** - `number` or `string` - The principal to remove the permission from.  
**ace** - `string` - The Ace permission to remove.  
**allow** - `boolean` - Pass `false` to remove a `deny` rule instead of `allow`. Optional, default: `true` (allow).

```lua
MSK.RemoveAce(principal, ace, allow)

-- Example 1: Removes command permission for group admin
MSK.RemoveAce('admin', 'command.your_command')

-- Example 2: Removes command permission for playerId 1
MSK.RemoveAce(1, 'command.your_command')

-- As an Export:
exports.msk_core:RemoveAce(principal, ace, allow)
```

## MSK.CanAddAce

Whether msk_core is currently allowed to run `add_ace`, i.e. whether the server.cfg
line above is present. Check this before registering aces instead of firing commands
that get refused and fill the console with `Access denied for command add_ace`.

**Returns**  
**allowed** - `boolean`

```lua
if MSK.CanAddAce() then
    MSK.AddRawAce('group.admin', 'myscript.group.admin')
end

-- As an Export:
local allowed = exports.msk_core:CanAddAce()
```

## MSK.AddRawAce

Grants an Ace permission **without any normalization**: principal and ace are used
exactly as given. Added in **v3.3.0**.

Use this instead of [`MSK.AddAce`](#mskaddace) whenever the ace is a permission
object rather than a command, and whenever the principal is not one of the three
shapes `MSK.AddAce` understands.

:::warning[Do not put permission objects under `command.`]
`MSK.AddAce` prefixes every ace with `command.`. Ace objects are inherited by their
children, and almost every `server.cfg` contains `add_ace group.admin command allow`,
so an object named `command.something` is handed to **everyone** holding `command`.
For anything you later check to decide who may do what, use `MSK.AddRawAce` with a
name of your own outside the `command.` tree.
:::

:::info[Why this runs inside msk_core]
FiveM checks `add_ace` against the resource that **runs** it, and `import.lua`
compiles the modules into your resource. An `ExecuteCommand('add_ace ...')` written
in your script therefore runs as `resource.<your script>` and is denied. Called from
your script, `MSK.AddRawAce` routes through msk_core's export, so the command runs as
`resource.msk_core` and the one server.cfg line above covers every MSK script.
:::

**Parameters**  
**principal** - `string` - The principal, verbatim (e.g. `group.admin`, `qbcore.mod`, `identifier.license:abc`).  
**ace** - `string` - The Ace object, verbatim. No `command.` prefix is added.  
**allow** - `boolean` - Pass `false` to add a `deny` rule instead of `allow`. Optional, default: `true` (allow).

**Returns**  
**ok** - `boolean` - `false` when msk_core is not allowed to run `add_ace`, nothing was executed then.

```lua
MSK.AddRawAce(principal, ace, allow)

-- Example: one permission object, reachable through both group spellings.
-- ESX and Qbox name their principals group.<name>, QBCore names them qbcore.<name>.
MSK.AddRawAce('group.mod', 'myscript.group.mod')
MSK.AddRawAce('qbcore.mod', 'myscript.group.mod')

-- Later, one check covers all frameworks:
if IsPlayerAceAllowed(playerId, 'myscript.group.mod') then ... end

-- As an Export:
exports.msk_core:AddRawAce(principal, ace, allow)
```

## MSK.RemoveRawAce

Removes an Ace permission without any normalization, the counterpart to
`MSK.AddRawAce`. Added in **v3.3.0**.

**Parameters**  
**principal** - `string` - The principal, verbatim.  
**ace** - `string` - The Ace object, verbatim.  
**allow** - `boolean` - Pass `false` to remove a `deny` rule instead of `allow`. Optional, default: `true` (allow).

**Returns**  
**ok** - `boolean` - `false` when msk_core is not allowed to run `remove_ace`.

```lua
MSK.RemoveRawAce('group.mod', 'myscript.group.mod')

-- As an Export:
exports.msk_core:RemoveRawAce(principal, ace, allow)
```

## MSK.AddPrincipal

Adds a child principal to a parent group (inheritance). A numeric child becomes `player.<id>`, and the parent group is prefixed with `group.` if missing.

**Parameters**  
**child** - `number` or `string` - The child principal (e.g. a player id or identifier).  
**parent** - `string` - The parent group (e.g. `admin` or `group.admin`).

```lua
MSK.AddPrincipal(child, parent)

-- Example: Make playerId 1 inherit the admin group
MSK.AddPrincipal(1, 'admin')

-- As an Export:
exports.msk_core:AddPrincipal(child, parent)
```

## MSK.RemovePrincipal

Removes a child principal from a parent group. A numeric child becomes `player.<id>`, and the parent group is prefixed with `group.` if missing.

**Parameters**  
**child** - `number` or `string` - The child principal.  
**parent** - `string` - The parent group.

```lua
MSK.RemovePrincipal(child, parent)

-- Example: Remove playerId 1 from the admin group
MSK.RemovePrincipal(1, 'admin')

-- As an Export:
exports.msk_core:RemovePrincipal(child, parent)
```
