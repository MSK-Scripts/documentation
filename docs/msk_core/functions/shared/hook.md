---
title: Hook
sidebar_position: 16
---

# Hook

Lets other resources hook into what a script is about to do, and refuse it. The script that owns the action triggers the hook, any other resource can register a handler.

:::info[New in v4.1.0]
Hooks are available on the client and on the server. A hook triggered on one side only reaches handlers registered on the same side.
:::

- A handler refuses by returning exactly `false`. Any other return value, including `nil`, lets the action through.
- Handlers run by priority, higher first. Handlers with the same priority run in the order they were registered.
- A handler that raises an error is logged and skipped, it does not block the action.
- The registry lives inside msk_core, one per side (client and server). Handlers of a resource are removed when that resource stops.

```lua
-- In the script that owns the action (e.g. msk_garage, server)
if not MSK.Hook.Trigger('garage:parkVehicle', { source = source, plate = plate }) then
    return -- a hook refused
end

-- In any other resource (server)
MSK.Hook.Register('garage:parkVehicle', function(payload)
    if payload.plate == 'ADMIN' then
        return false
    end
end)
```

## MSK.Hook.Register

Registers a handler for `event`. The handler belongs to the calling resource.

**Parameters**  
**event** - `string` - Name of the hook  
**cb** - `function` - `cb(payload)`, return `false` to refuse  
**options** - `table` - Optional - `{ priority = number }`, Default priority: `0`

**Returns**  
**id** - `number` - Id of the handler, needed for `MSK.Hook.Remove`

```lua
local id = MSK.Hook.Register(event, cb, options)

-- Example
local id = MSK.Hook.Register('garage:parkVehicle', function(payload)
    return payload.plate ~= 'ADMIN'
end, { priority = 10 })

-- As an Export:
local id = exports.msk_core:RegisterHook(event, cb, options)
```

:::note
The payload is passed through an export, so the handler receives a copy. Changing it inside a handler does not change the data of the script that triggered the hook.
:::

## MSK.Hook.Remove

Removes a handler. Only the resource that registered it can remove it.

**Parameters**  
**id** - `number` - The id returned by `MSK.Hook.Register`

**Returns**  
**removed** - `boolean` - Whether the handler was removed

```lua
local removed = MSK.Hook.Remove(id)

-- As an Export:
local removed = exports.msk_core:RemoveHook(id)
```

## MSK.Hook.Trigger

Runs every handler of `event`. As soon as one handler returns `false`, the remaining ones are skipped and `false` is returned together with the name of the refusing resource.

**Parameters**  
**event** - `string` - Name of the hook  
**payload** - `any` - Optional - Data passed to every handler

**Returns**  
**allowed** - `boolean` - `false` if a handler refused, otherwise `true`  
**refusedBy** - `string?` - Name of the resource that refused

```lua
local allowed, refusedBy = MSK.Hook.Trigger(event, payload)

-- Example
local allowed, refusedBy = MSK.Hook.Trigger('garage:parkVehicle', { source = source, plate = plate })

if not allowed then
    print(('Parking refused by %s'):format(refusedBy))
    return
end

-- As an Export:
local allowed, refusedBy = exports.msk_core:TriggerHook(event, payload)
```

## MSK.Hook.Has

Checks whether at least one handler is registered for `event`.

**Parameters**  
**event** - `string` - Name of the hook

**Returns**  
**has** - `boolean` - Whether a handler exists

```lua
local has = MSK.Hook.Has(event)

-- As an Export:
local has = exports.msk_core:HasHook(event)
```
