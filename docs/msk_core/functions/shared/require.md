---
title: Require
sidebar_position: 15
---

# Require

Loads Lua and JSON files at runtime, from your own resource or from another one.

:::info[New in v4.1.0]
`MSK.Require` has no exports. The cache belongs to the resource that uses it.
:::

## Paths

- Without `@` the file belongs to your own resource: `'shared.utils'`
- With `@` it belongs to another resource: `'@my_lib/client/helpers.lua'` or `'@my_lib.client.helpers'`
- For `Load` and `Json` the extension is optional. As long as the path contains no slash, dots separate folders, so `shared.utils` becomes `shared/utils.lua`.

On the client, a file can only be read when the resource that owns it lists it in its `fxmanifest.lua` under `files { ... }`.

## MSK.Require.Load

Runs a Lua file once and returns its return value, just like `require`. The result is cached, the next call with the same path returns the cached value without running the file again. A file that returns nothing is cached as `true`. The module is callable, so `MSK.Require(path)` does the same.

A file that requires itself, directly or through other files, raises an error instead of looping forever. Compile and runtime errors are raised with the file name.

**Parameters**  
**path** - `string` - Path of the Lua file

**Returns**  
**value** - `any` - The return value of the file

```lua
local value = MSK.Require.Load(path)

-- Example
local Utils = MSK.Require.Load('shared.utils')            -- shared/utils.lua
local Helpers = MSK.Require.Load('@my_lib/client/helpers.lua')

-- Shorthand (callable module):
local Utils = MSK.Require('shared.utils')
```

## MSK.Require.Json

Reads and decodes a JSON file. The result is not cached, so edits to the file show up on the next call.

**Parameters**  
**path** - `string` - Path of the JSON file

**Returns**  
**data** - `any` - The decoded data

```lua
local data = MSK.Require.Json(path)

-- Example
local vehicles = MSK.Require.Json('data.vehicles') -- data/vehicles.json
```

## MSK.Require.File

Returns the raw contents of a file. The path is taken exactly as it is, no extension is added and dots are not turned into folders.

**Parameters**  
**path** - `string` - Path of the file

**Returns**  
**content** - `string` - The file contents

```lua
local content = MSK.Require.File(path)

-- Example
local html = MSK.Require.File('web/template.html')
```

## MSK.Require.Unload

Drops a cached Lua module, so the next `Load` runs the file again.

**Parameters**  
**path** - `string` - Path of the Lua file

**Returns**  
**dropped** - `boolean` - Whether the module was cached

```lua
local dropped = MSK.Require.Unload(path)
```
