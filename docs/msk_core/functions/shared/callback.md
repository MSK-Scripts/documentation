---
title: Callbacks
sidebar_position: 2
---

# Callbacks

msk_core ships with a lightweight, framework-agnostic callback system that works in both directions:

- **Client → Server**: the client triggers a callback that is registered on the server and waits for its return value.
- **Server → Client**: the server triggers a callback that is registered on a specific client and waits for its return value.

The system is loaded eagerly into the core on both sides, so the underlying net-event handlers exist from the moment msk_core starts. Consumers use the local view via `shared_script '@msk_core/import.lua'` and access it through the global `MSK` table, or through the matching exports.

All triggers are **blocking**: they wait until the answer arrives and then return the result directly. There is no separate asynchronous callback parameter on the trigger side.

:::info
The registered callback always receives the player as its first argument (`source`), regardless of the direction. On the client, `source` is the server id of the local player, passed in by the server-side trigger.
:::

## How it behaves

- **Timeout.** `MSK.Trigger` and `MSK.TriggerCallback` wait up to `5000` ms by default. The limit is set per server with the convar `msk:callbackTimeout` and applies to both sides. For callbacks that need longer, use [`MSK.TriggerAwait`](#msktriggerawait).
- **Nothing throws.** On a timeout, when the callback is not registered on the other side, or when it raised an error, the trigger returns `nil` and a line explaining which callback failed is printed to the console.
- **Errors answer immediately.** Handlers run protected. If a handler raises an error, the error and its stack trace are printed on the side that ran it, and the caller gets `nil` right away instead of waiting for the timeout.
- **`nil` in the middle survives.** A handler returning `nil, 'busy'` arrives as exactly those two values.
- **Callbacks belong to the registering resource.** Another resource cannot overwrite them, the attempt is ignored and logged. When the owning resource stops, its callbacks are removed.
- **Only the addressed player can answer.** The server accepts an answer to a server → client request only from the player the request was sent to. Other clients cannot answer or cancel it.
- **Missing players.** A server → client trigger to a player that does not exist returns `nil` immediately without sending anything.

## MSK.Register

Registers a callback under a given name. Available on **both sides**.

- On the **server**, the callback is `function(source, ...)` and is triggerable from the client.
- On the **client**, the callback is `function(source, ...)` (where `source` is the player id provided by the server) and is triggerable from the server.

The server additionally supports a **cb method**: if the callback is triggered with `MSK.TriggerCallback` (client side), the registered server callback receives a `cb` function as its second argument which you call to return the result, e.g. `function(source, cb, ...) cb(result) end`. Only the first call of `cb` counts. When triggered with the return method, you simply `return` the result instead.

**Parameters**  
**eventName** - `string` - Unique name of the callback  
**cb** - `function` - The handler. Receives `source` first, followed by any arguments passed to the trigger

**Returns**  
**registered** - `boolean` - `false` if the name already belongs to another resource

```lua
local registered = MSK.Register(eventName, cb)

-- Example (Server): return method
MSK.Register('myscript:getMoney', function(source, account)
    local Player = MSK.GetPlayer({ source = source })
    return Player.getAccount(account).money
end)

-- Example (Server): cb method (used together with MSK.TriggerCallback on the client)
MSK.Register('myscript:getMoney', function(source, cb, account)
    local Player = MSK.GetPlayer({ source = source })
    cb(Player.getAccount(account).money)
end)

-- Example (Client): callback triggerable from the server
MSK.Register('myscript:getHeading', function(source)
    return GetEntityHeading(PlayerPedId())
end)

-- As an Export:
exports.msk_core:Register(eventName, cb)
```

:::tip[Backwards compatibility (server only)]
On the server, `RegisterCallback` and `RegisterServerCallback` are kept as aliases of `MSK.Register`. They behave identically and exist purely for compatibility with older scripts.

```lua
exports.msk_core:RegisterCallback(eventName, cb)
exports.msk_core:RegisterServerCallback(eventName, cb)
```
:::

## MSK.Trigger

Triggers a registered callback and waits (blocking) for its return values. The signature differs per side.

- **Client → Server:** `MSK.Trigger(eventName, ...)` triggers the server callback `eventName` and returns its result.
- **Server → Client:** `MSK.Trigger(eventName, playerId, ...)` triggers the client callback `eventName` on `playerId` and returns its result.

If no answer arrives within `msk:callbackTimeout` (default `5000` ms), `nil` is returned.

**Parameters (Client → Server)**  
**eventName** - `string` - Name of the registered server callback  
**...** - `any` - Optional - Arguments forwarded to the callback

**Parameters (Server → Client)**  
**eventName** - `string` - Name of the registered client callback  
**playerId** - `number` - The target player id  
**...** - `any` - Optional - Arguments forwarded to the callback

**Returns**  
**...** - `any` - The values returned by the callback, or `nil` on failure

```lua
MSK.Trigger(eventName, ...)

-- Example (Client → Server)
local money = MSK.Trigger('myscript:getMoney', 'bank')
print(money)

-- Example (Server → Client)
local heading = MSK.Trigger('myscript:getHeading', source)
print(heading)

-- As an Export:
exports.msk_core:Trigger(eventName, ...)
```

```cfg title="server.cfg"
# Wait up to 10 seconds instead of 5
setr msk:callbackTimeout 10000
```

## MSK.TriggerAwait

Like `MSK.Trigger`, but with its own time limit per call. Use it for callbacks that take longer than `msk:callbackTimeout`, for example database work on the server, or dialogs, alerts and skillchecks where the client waits for the player.

`timeout` is in milliseconds. `nil` or `false` waits without any limit.

- **Client → Server:** `MSK.TriggerAwait(eventName, timeout, ...)`
- **Server → Client:** `MSK.TriggerAwait(eventName, playerId, timeout, ...)`. The wait always ends when the player leaves, in that case `nil` is returned. So an unlimited wait cannot hang forever on a disconnect.

**Parameters (Client → Server)**  
**eventName** - `string` - Name of the registered server callback  
**timeout** - `number/boolean` - Optional - Time limit in ms, `nil` or `false` for no limit  
**...** - `any` - Optional - Arguments forwarded to the callback

**Parameters (Server → Client)**  
**eventName** - `string` - Name of the registered client callback  
**playerId** - `number` - The target player id  
**timeout** - `number/boolean` - Optional - Time limit in ms, `nil` or `false` for no limit  
**...** - `any` - Optional - Arguments forwarded to the callback

**Returns**  
**...** - `any` - The values returned by the callback, or `nil` on failure

```lua
MSK.TriggerAwait(eventName, timeout, ...)           -- Client
MSK.TriggerAwait(eventName, playerId, timeout, ...) -- Server

-- Example (Client → Server): allow 30 seconds
local report = MSK.TriggerAwait('myscript:buildReport', 30000, 'weekly')

-- Example (Server → Client): wait until the player answers or leaves
local confirmed = MSK.TriggerAwait('myscript:confirmDialog', source, false, 'Sell vehicle?')

-- As an Export:
exports.msk_core:TriggerAwait(eventName, timeout, ...)           -- Client
exports.msk_core:TriggerAwait(eventName, playerId, timeout, ...) -- Server
```

:::caution
Passing `nil` as `timeout` means **no limit**, not the default timeout. If you want the default, use `MSK.Trigger` instead.
:::

## MSK.TriggerCallback

**Client only.** Triggers a server callback using the **cb method**. For the caller this works exactly like `MSK.Trigger` (it blocks and returns the result), but on the server the callback is invoked with a `cb` function it must call to return its result (see `MSK.Register`). Use this when the registered server callback resolves its value through `cb(...)` rather than `return`.

**Parameters**  
**eventName** - `string` - Name of the registered server callback  
**...** - `any` - Optional - Arguments forwarded to the callback

**Returns**  
**...** - `any` - The values passed to the `cb` function on the server, or `nil` on failure

```lua
MSK.TriggerCallback(eventName, ...)

-- Example (Client)
local money = MSK.TriggerCallback('myscript:getMoney', 'bank')
print(money)

-- As an Export:
exports.msk_core:TriggerCallback(eventName, ...)
```
