---
title: Callbacks
sidebar_position: 2
---

# Callbacks

msk_core ships with a lightweight, framework-agnostic callback system that works in both directions:

- **Client → Server** – the client triggers a callback that is registered on the server and waits for its return value.
- **Server → Client** – the server triggers a callback that is registered on a specific client and waits for its return value.

The system is loaded eagerly into the core on both sides, so the underlying net-event handlers exist from the moment the resource starts. Consumers use the local view via `shared_script '@msk_core/import.lua'` and access it through the global `MSK` table, or through the matching exports.

All triggers are **blocking**: they internally use a `promise` and wait (with a 5 second timeout) until the response arrives, then return the result directly. There is no separate asynchronous callback parameter on the trigger side.

:::info
The registered callback always receives the player as its first argument (`source`), regardless of the direction. On the client, `source` is the player id passed in by the server-side trigger.
:::

## MSK.Register

Registers a callback under a given name. Available on **both sides**.

- On the **server**, the callback is `function(source, ...)` and is triggerable from the client.
- On the **client**, the callback is `function(source, ...)` (where `source` is the player id provided by the server) and is triggerable from the server.

The server additionally supports a **cb method**: if the callback is triggered with `MSK.TriggerCallback` (client side), the registered server callback receives a `cb` function as its second argument which you call to return the result, e.g. `function(source, cb, ...) cb(result) end`. When triggered with the return method, you simply `return` the result instead.

**Parameters**  
**eventName** - `string` - Unique name of the callback.  
**cb** - `function` - The handler. Receives `source` first, followed by any arguments passed to the trigger.

```lua
MSK.Register(eventName, cb)

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

Triggers a registered callback and waits (blocking) for its return value. The signature differs per side.

- **Client → Server:** `MSK.Trigger(eventName, ...)` — triggers the server callback `eventName` and returns its result.
- **Server → Client:** `MSK.Trigger(eventName, playerId, ...)` — triggers the client callback `eventName` on `playerId` and returns its result.

If no response arrives within 5 seconds, the request times out and rejects.

**Parameters (Client → Server)**  
**eventName** - `string` - Name of the registered server callback.  
**...** - `any` - Optional arguments forwarded to the callback.

**Parameters (Server → Client)**  
**eventName** - `string` - Name of the registered client callback.  
**playerId** - `number` - The target player id.  
**...** - `any` - Optional arguments forwarded to the callback.

**Returns**  
**...** - `any` - The values returned by the callback.

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

## MSK.TriggerCallback

**Client only.** Triggers a server callback using the **cb method**. This is functionally equivalent to `MSK.Trigger` for the consumer — it blocks and returns the result — but on the server the callback is invoked with a `cb` function it must call to return its result (see `MSK.Register`). Use this when the registered server callback resolves its value through `cb(...)` rather than `return`.

**Parameters**  
**eventName** - `string` - Name of the registered server callback.  
**...** - `any` - Optional arguments forwarded to the callback.

**Returns**  
**...** - `any` - The values passed to the `cb` function on the server.

```lua
MSK.TriggerCallback(eventName, ...)

-- Example (Client)
local money = MSK.TriggerCallback('myscript:getMoney', 'bank')
print(money)

-- As an Export:
exports.msk_core:TriggerCallback(eventName, ...)
```
