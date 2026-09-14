---
title: Shared
sidebar_position: 1
---

# Shared

The shared modules work on both the client and the server, and because they don't depend on any framework, they also work in **standalone** resources. Most of them are pure helpers (Math, String, Table, Array, …) that are compiled straight into your resource. Callbacks and Hooks are the exception, their registry lives inside msk_core.

Consumers receive the global `MSK` table by adding the import to their `fxmanifest.lua`:

```lua
shared_script '@msk_core/import.lua'
```

Many functions are also available as an export via `exports.msk_core:ExportName(...)`. Note that the export name often differs from the `MSK.*` path. Functions without an export are marked by the missing `-- As an Export:` line on their page.

## MSK.Logging

Prints a log line, prefixed with the invoking resource and the formatted logging type. The available types are defined in `Config.LoggingTypes` (`config.lua`); an unknown `code` falls back to the `debug` type.

**Parameters**  
**code** - `string` - The logging type key (e.g. `'info'`, `'debug'`, `'error'`)  
**...** - `any` - Optional - Values to print

```lua
MSK.Logging(code, ...)

-- Example
MSK.Logging('info', 'value1', 'value2')
MSK.Logging('debug', 'value1', 'value2')
MSK.Logging('error', 'value1', 'value2')

-- As an Export:
exports.msk_core:Logging('info', 'value1', 'value2')
```

:::info
`MSK.logging` (lowercase) is kept as a backwards-compatible alias for `MSK.Logging`, and is also exported as `exports.msk_core:logging`.
:::

:::tip
For output that can be switched on and off per resource without code changes, have a look at [Print](./print).
:::

## MSK.Call

Calls `fn` in a protected context (`pcall`) and waits (polling) until it returns a result, up to `timeout` milliseconds. An error inside `fn` counts as no result, so polling simply continues. When the time limit is reached, `nil` is returned. Inside msk_core this lives in `init/shared.lua`, in your resource it is the `Call` module, and both behave the same.

**Parameters**  
**fn** - `function` - The function to call protected  
**timeout** - `number` - Optional - Default: `1000` - Maximum time to wait in milliseconds

**Returns**  
**value** - `any` - The value returned by `fn`, or `nil` on timeout

:::info[Changed in v4.0.0]
A timeout returns `nil` now. It used to raise, which is not what its own description said and took the calling thread down with it. Since v4.1.0 the `Call` module that consumers get through the import behaves the same way, before that it still raised outside of msk_core.
:::

```lua
local value = MSK.Call(fn, timeout)

-- Example
local player = MSK.Call(function()
    return MSK.GetPlayer()
end, 5000)
```

## MSK.GetConfig

Returns the `msk_core` config table (the global `Config` from `config.lua`).

**Returns**  
**config** - `table` - The config of msk_core

```lua
local config = MSK.GetConfig()

-- As an Export:
local config = exports.msk_core:GetConfig()
-- Alias export:
local config = exports.msk_core:Config()
```

## exports.msk_core:GetLib

Returns the entire core `MSK` table. Useful when you prefer to fetch the library object once via an export instead of relying on the global import.

**Returns**  
**MSK** - `table` - The core `MSK` table

```lua
local MSK = exports.msk_core:GetLib()

-- Legacy alias (older versions):
local MSK = exports.msk_core:getCoreObject()
```

## Modules

The remaining shared modules are split into the following sub-pages:

| Page | Namespace | What it does |
|---|---|---|
| [Callbacks](./callback) | `MSK.Register`, `MSK.Trigger`, … | Server and client callbacks with timeouts |
| [Math](./math) | `MSK.Math` | Random numbers, rounding, separators, clamp, lerp, remap, colors, vectors |
| [String](./string) | `MSK.String` | Random strings and patterns, prefix checks, trimming, splitting |
| [Table](./table) | `MSK.Table` | Contains, dump, size, find, clone, sort, freeze, merge, compare, keys, values, wipe |
| [Timeout](./timeout) | `MSK.Timeout` | Set and clear timeouts, await a value |
| [Vector](./vector) | `MSK.Vector` | Coordinate conversion and relative offsets |
| [Class](./class) | `MSK.Class` | Classes with inheritance |
| [Array](./array) | `MSK.Array` | Map, filter, reduce and other list helpers |
| [Selector](./selector) | `MSK.Selector` | Random and weighted picks, pools of named sets |
| [Timer](./timer) | `MSK.Timer` | Countdowns that can be paused, resumed and restarted |
| [Grid](./grid) | `MSK.Grid` | Spatial hash for fast "what is nearby" lookups |
| [Print](./print) | `MSK.Print` | Console output with levels, switchable per resource by convar |
| [Locale](./locale) | `MSK.Locale` | Translations from JSON files, also from other resources |
| [Require](./require) | `MSK.Require` | Load Lua and JSON files at runtime |
| [Hook](./hook) | `MSK.Hook` | Let other resources veto an action |
| [Cache](./cache) | `MSK.Cache` | Remember expensive results, with optional lifetime |
