---
title: Shared
sidebar_position: 1
---

# Shared

The shared utilities are pure helper modules (Math, String, Table, Timeout, Vector, …) with no side effects. They are available on both the client and the server, and because they don't depend on any framework, they also work in **standalone** resources.

Consumers receive the global `MSK` table by adding the import to their `fxmanifest.lua`:

```lua
shared_script '@msk_core/import.lua'
```

Every public function is also available as an export via `exports.msk_core:ExportName(...)`. Note that the export name often differs from the `MSK.*` path.

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

## MSK.Call

Calls `fn` in a protected context (`pcall`) and waits (polling) until it returns a result, up to `timeout` milliseconds. Internally this is `Timeout.Await` wrapped around a `pcall`. This is also exposed as its own module (`modules/Call`), which calls `MSK.Timeout.Await` directly.

**Parameters**  
**fn** - `function` - The function to call protected  
**timeout** - `number` - Optional - Default: `1000` - Maximum time to wait in milliseconds

**Returns**  
**value** - `any` - The value returned by `fn`

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

The remaining shared utilities are split into the following sub-pages:

- [Math](./math) — random numbers, rounding, thousands separators
- [String](./string) — random strings, prefix checks, trimming, splitting
- [Table](./table) — contains, dump, size, index/find, reverse, clone, sort
- [Timeout](./timeout) — set/clear timeouts and await
- [Vector](./vector) — coordinate/vector conversion helpers
- [Callback](./callback) — server/client callbacks
