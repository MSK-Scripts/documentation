---
title: Cache
sidebar_position: 17
---

# Cache

Remembers the result of a function under a key, so an expensive lookup runs once instead of on every call.

The cache belongs to the resource that uses it, other resources do not see it. `ttl` is always in milliseconds. Without a `ttl` a value stays until it is cleared.

:::info[New in v4.1.0]
`MSK.Cache` has no exports.
:::

## MSK.Cache

Shorthand for `MSK.Cache.Get`. The module is callable, which makes the most common use a one-liner.

```lua
local value = MSK.Cache(key, fn, ttl)

-- Example
local jobs = MSK.Cache('jobs', function()
    return MSK.GetJobs()
end, 60000)
```

## MSK.Cache.Get

Returns the cached value of `key`. When there is none, or it expired, `fn` runs and its result is stored. `fn` may also be a plain value instead of a function. A `nil` result is not stored, so `fn` runs again on the next call.

**Parameters**  
**key** - `any` - The key, must not be `nil`  
**fn** - `function/any` - Optional - Function that produces the value, or the value itself  
**ttl** - `number` - Optional - Lifetime in milliseconds

**Returns**  
**value** - `any` - The cached or freshly produced value, or `nil`

```lua
local value = MSK.Cache.Get(key, fn, ttl)

-- Example
local garages = MSK.Cache.Get('garages', function()
    return MySQL.query.await('SELECT * FROM msk_garage_garages')
end, 300000)

-- Only read, never fill
local config = MSK.Cache.Get('config')
```

## MSK.Cache.Set

Stores `value` under `key` and replaces what was there. Setting `nil` removes the key.

**Parameters**  
**key** - `any` - The key, must not be `nil`  
**value** - `any` - The value  
**ttl** - `number` - Optional - Lifetime in milliseconds

```lua
MSK.Cache.Set(key, value, ttl)

-- Example
MSK.Cache.Set('config', data)
MSK.Cache.Set('lastRobbery', os.time(), 600000)
```

## MSK.Cache.Has

Checks whether `key` has a value that has not expired yet.

**Parameters**  
**key** - `any` - The key

**Returns**  
**has** - `boolean` - Whether a fresh value exists

```lua
local has = MSK.Cache.Has(key)
```

## MSK.Cache.Clear

Removes `key`, so the next `Get` runs its function again. Without a key the whole cache of the resource is cleared.

**Parameters**  
**key** - `any` - Optional - The key to remove

```lua
MSK.Cache.Clear(key)

-- Example
MSK.Cache.Clear('jobs') -- one key
MSK.Cache.Clear()       -- everything
```
