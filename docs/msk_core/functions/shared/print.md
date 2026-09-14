---
title: Print
sidebar_position: 13
---

# Print

Console output with levels that can be switched per resource at runtime, without touching any code.

:::info[New in v4.1.0]
`MSK.Print` has no exports. It runs inside your own resource, which is what makes the per-resource level possible.
:::

The levels, from quiet to loud, are `error`, `warn`, `info` (default), `verbose` and `debug`. A message is printed when its level is at or below the active one. The active level comes from these convars:

```cfg
# every resource
setr msk:printlevel "warn"

# one resource, wins over the line above
setr msk:printlevel:my_script "debug"
```

`setr` replicates the convar to clients, so the same line controls the server and the client. A change is picked up within about two seconds, the level is cached in between so printing inside hot loops stays cheap.

Every line is prefixed with the resource name and the level. Tables are printed as indented JSON, several values are separated by tabs.

## MSK.Print.Error / Warn / Info / Verbose / Debug

Print a message at the given level. The module is callable, `MSK.Print(...)` is the same as `MSK.Print.Info(...)`.

**Parameters**  
**...** - `any` - The values to print

```lua
MSK.Print.Error(...)
MSK.Print.Warn(...)
MSK.Print.Info(...)
MSK.Print.Verbose(...)
MSK.Print.Debug(...)

-- Example
MSK.Print.Info('Garage loaded with', 12, 'vehicles')
MSK.Print.Debug('Vehicle data', { plate = 'ABC 123', fuel = 75 })
MSK.Print.Error('Could not find garage', garageId)

-- Shorthand (callable module), prints at level info:
MSK.Print('Hello World')
```

## MSK.Print.SetLevel

Overrides the level for this resource until the next restart. `nil` goes back to the convars.

**Parameters**  
**level** - `string` - Optional - `'error'`, `'warn'`, `'info'`, `'verbose'` or `'debug'`

```lua
MSK.Print.SetLevel(level)

-- Example
MSK.Print.SetLevel('debug')
MSK.Print.SetLevel(nil) -- back to msk:printlevel
```

## MSK.Print.GetLevel

Returns the name of the level that is currently active for this resource.

**Returns**  
**level** - `string` - The active level

```lua
local level = MSK.Print.GetLevel()
```

## MSK.Print.IsEnabled

Checks whether a message of `level` would be printed. Useful to skip building an expensive debug string that nobody would see.

**Parameters**  
**level** - `string` - The level to check

**Returns**  
**enabled** - `boolean` - Whether the level is printed

```lua
local enabled = MSK.Print.IsEnabled(level)

-- Example
if MSK.Print.IsEnabled('debug') then
    MSK.Print.Debug(MSK.Table.DumpString(hugeTable))
end
```
