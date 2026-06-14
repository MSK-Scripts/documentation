---
title: Timeout
sidebar_position: 6
---

# Timeout

Asynchronous timeout helpers: schedule, cancel, and poll-until-ready.

:::info
The module is callable directly: `MSK.Timeout(ms, cb, data)` is a shortcut for `MSK.Timeout.Set(ms, cb, data)`.
:::

## MSK.Timeout.Set

Schedules `cb(data)` to run after `ms` milliseconds. Returns a `requestId` that can be passed to `MSK.Timeout.Clear` to cancel it.

**Parameters**  
**ms** - `number` - Time to wait in milliseconds  
**cb** - `function` - Callback `cb(data)` executed when the timeout fires  
**data** - `any` - Optional - Value passed to the callback

**Returns**  
**requestId** - `number` - The id of the scheduled timeout

```lua
local requestId = MSK.Timeout.Set(ms, cb, data)

-- Example
local requestId = MSK.Timeout.Set(1000, function(data)
    print(data) -- Output: 'Hello World'
end, 'Hello World')

-- Shorthand (callable module):
local requestId = MSK.Timeout(1000, function(data)
    print(data)
end, 'Hello World')

-- As an Export:
local requestId = exports.msk_core:SetTimeout(ms, cb, data)
```

:::tip
`MSK.AddTimeout` is an alias for `MSK.Timeout.Set`.
:::

## MSK.Timeout.Clear

Cancels a scheduled timeout by its `requestId`.

**Parameters**  
**requestId** - `number` - The id returned by `MSK.Timeout.Set`

```lua
MSK.Timeout.Clear(requestId)

-- As an Export:
exports.msk_core:ClearTimeout(requestId)
```

:::tip
`MSK.DelTimeout` is an alias for `MSK.Timeout.Clear`.
:::

## MSK.Timeout.Await

Calls `cb` repeatedly (polling) until it returns a non-nil value, then returns that value. Time-limit semantics: a `number` sets the limit in milliseconds; `nil` or any other truthy value defaults to `1000` ms; an explicit `false` disables the limit (waits forever). When the limit is exceeded, an error is raised.

Thanks to [ox_lib](https://overextended.dev/ox_lib/Modules/WaitFor/Shared) for the inspiration behind this function.

**Parameters**  
**timeout** - `number|boolean` - Optional - Default: `1000` - Time limit in ms, or `false` for no limit  
**cb** - `function` - Callback that returns a value once ready  
**errMessage** - `string` - Optional - Message used in the timeout error

**Returns**  
**value** - `any` - The first non-nil value returned by `cb`

```lua
local value = MSK.Timeout.Await(timeout, cb, errMessage)

-- Example
local value = MSK.Timeout.Await(5000, function()
    if math.random(0, 1) == 1 then
        return 'abc'
    end
end, 'This is an error message')

print(value) -- Output: 'abc'

-- As an Export:
local value = exports.msk_core:AwaitTimeout(timeout, cb, errMessage)
```
