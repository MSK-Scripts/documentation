---
title: Ace Permission
sidebar_position: 12
---

# Ace Permission

Ace permissions work standalone and do not depend on a framework. On the client these functions are thin wrappers that ask the server (via a callback) whether the current player is allowed, since Ace evaluation always happens server-side.

## MSK.IsAceAllowed

Checks whether the local player has Ace permission for a command. The given name is automatically prefixed with `command.`, so pass only the bare command name. Internally this triggers the server callback `msk_core:isAceAllowed`.

**Parameters**  
**command** - `string` - Command name to check (without the `command.` prefix).

**Returns**  
**hasAcePerm** - `boolean` - Whether the player has Ace permission for the given command.

```lua
local hasAcePerm = MSK.IsAceAllowed(command)

-- Example
local hasAcePerm = MSK.IsAceAllowed('your_command')

-- As an Export:
local hasAcePerm = exports.msk_core:IsAceAllowed(command)
```

## MSK.IsPrincipalAceAllowed

Checks whether a principal has a specific Ace permission. Triggers the server callback `msk_core:isPrincipalAceAllowed`.

**Parameters**  
**principal** - `string` - The principal (e.g. `group.admin`).  
**ace** - `string` - The Ace permission to check (e.g. `command.your_command`).

**Returns**  
**isAllowed** - `boolean` - Whether the principal has the given Ace permission.

```lua
local isAllowed = MSK.IsPrincipalAceAllowed(principal, ace)

-- Example
local isAllowed = MSK.IsPrincipalAceAllowed('group.admin', 'command.your_command')

-- As an Export:
local isAllowed = exports.msk_core:IsPrincipalAceAllowed(principal, ace)
```
