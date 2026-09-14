---
title: Table
sidebar_position: 5
---

# Table

## MSK.Table.Contains

Check if a value exists in a table. If `value` is itself a table, the function returns `true` as soon as **any** of its values exists in `tbl`. `false` is a valid value to look for, only `nil` is refused.

**Parameters**  
**tbl** - `table` - The Table to check  
**value** - `any` - The Value, or a table of values, to check

**Returns**  
**contains** - `boolean` - Whether the value exists in the table

```lua
local tbl = {'value_1', 'value_2'}

-- Checks if the value is in the table
local contains = MSK.Table.Contains(tbl, 'value_1') -- true

-- Checks if one of the values is in the table
local contains = MSK.Table.Contains(tbl, {'value_1', 'value_5'}) -- true

-- false can be searched for
local contains = MSK.Table.Contains({ true, false }, false) -- true

-- As an Export:
local contains = exports.msk_core:TableContains(tbl, value)
```

:::note[Difference to ox_lib]
With a table as `value`, `lib.table.contains` from ox_lib only returns `true` when **all** values are contained. `MSK.Table.Contains` returns `true` when **one** of them is. Keep that in mind when you port code.
:::

:::tip
`MSK.Table_Contains` is an alias for `MSK.Table.Contains`.
:::

## MSK.Table.Dump

Dumps the given table to an indented JSON string. Any other value is returned through `tostring`.

**Parameters**  
**tbl** - `table` - The Table that should be dumped

**Returns**  
**text** - `string` - The formatted text of the given table

```lua
local tbl = {
  ['test'] = {name = 'test', action = '123'},
  test2 = {name = 'test2', action = 456},
}

print(MSK.Table.Dump(tbl))

-- As an Export:
local text = exports.msk_core:TableDump(tbl)
```

:::tip
`MSK.DumpTable` is an alias for `MSK.Table.Dump`.
:::

## MSK.Table.Size

Get the number of entries in the table, including keys that are not numbers.

**Parameters**  
**tbl** - `table` - The Table that should be checked

**Returns**  
**size** - `number` - The size of the table

```lua
local tbl = {
  ['test'] = {name = 'test', action = '123'},
  test2 = {name = 'test2', action = 456},
}

local size = MSK.Table.Size(tbl) -- Output: 2

-- As an Export:
local size = exports.msk_core:TableSize(tbl)
```

## MSK.Table.Find

Find a specific value in an indexed table.

**Parameters**  
**tbl** - `table` - The Table that should be checked  
**value** - `any` - The value to search for

**Returns**  
**index** - `number?` - The index of the given value  
**value** - `any` - The value searched for

```lua
local index, value = MSK.Table.Find(tbl, value)

local tbl = { '123', 456 }

local index, value = MSK.Table.Find(tbl, '123')         -- Output: 1, '123'
local index, value = MSK.Table.Find(tbl, 456)           -- Output: 2, 456
local index, value = MSK.Table.Find(tbl, 'Hello World') -- Output: nil, 'Hello World'

-- As an Export:
local index, value = exports.msk_core:TableFind(tbl, value)
```

## MSK.Table.DumpString

Dumps the given table to a Lua-source-like string (recursive).

**Parameters**  
**tbl** - `any` - The Table that should be dumped

**Returns**  
**text** - `string` - The formatted text of the given table

```lua
print(MSK.Table.DumpString(tbl))

-- As an Export:
local text = exports.msk_core:TableDumpString(tbl)
```

## MSK.Table.Index

Get the **first** index of a value in an indexed table.

**Parameters**  
**tbl** - `table` - The Table that should be checked  
**value** - `any` - The value to search for

**Returns**  
**index** - `number` - The first index of the value, or `-1` if not found

```lua
local index = MSK.Table.Index(tbl, value)

-- As an Export:
local index = exports.msk_core:TableIndex(tbl, value)
```

## MSK.Table.LastIndex

Get the **last** index of a value in an indexed table.

**Parameters**  
**tbl** - `table` - The Table that should be checked  
**value** - `any` - The value to search for

**Returns**  
**index** - `number` - The last index of the value, or `-1` if not found

```lua
local index = MSK.Table.LastIndex(tbl, value)

-- As an Export:
local index = exports.msk_core:TableLastIndex(tbl, value)
```

## MSK.Table.Reverse

Returns a new table with the order of an indexed table reversed.

**Parameters**  
**tbl** - `table` - The Table that should be reversed

**Returns**  
**tbl** - `table` - The reversed table

```lua
local reversed = MSK.Table.Reverse(tbl)

-- As an Export:
local reversed = exports.msk_core:TableReverse(tbl)
```

## MSK.Table.Clone

Creates a **deep copy** of a table (including its metatable).

**Parameters**  
**tbl** - `table` - The Table that should be cloned

**Returns**  
**tbl** - `table` - The cloned table

```lua
local clone = MSK.Table.Clone(tbl)

-- As an Export:
local clone = exports.msk_core:TableClone(tbl)
```

## MSK.Table.Sort

Returns a **sorted iterator** over the table. An optional `order` function `order(tbl, a, b)` can be passed for custom sorting (sorts by key otherwise).

**Parameters**  
**tbl** - `table` - The Table that should be iterated  
**order** - `function?` - Optional comparator `order(tbl, a, b)`

**Returns**  
**iterator** - `function` - A sorted iterator returning `key, value`

```lua
-- Sort by key (default)
for key, value in MSK.Table.Sort(tbl) do
    print(key, value)
end

-- Sort by value descending
for key, value in MSK.Table.Sort(tbl, function(t, a, b)
    return t[a] > t[b]
end) do
    print(key, value)
end

-- As an Export:
local iterator = exports.msk_core:TableSort(tbl, order)
```

## MSK.Table.Freeze

Returns a read-only view of `tbl`. Writing to the view raises an error. Reading, `pairs`, `ipairs` and `#` work as usual. With `deep`, nested tables come back frozen as well. The original table stays writable, and the view always shows its current content.

**Parameters**  
**tbl** - `table` - The Table that should be frozen  
**deep** - `boolean` - Optional - Default: `false` - Freeze nested tables too

**Returns**  
**frozen** - `table` - The read-only view

```lua
local frozen = MSK.Table.Freeze(tbl, deep)

-- Example
local Config = MSK.Table.Freeze({
    maxSlots = 10,
    jobs = { 'police', 'ambulance' },
}, true)

print(Config.maxSlots) -- Output: 10
Config.maxSlots = 20   -- error: attempt to modify a frozen table (key "maxSlots")
Config.jobs[1] = 'mechanic' -- error, because deep is true
```

:::caution
The view is an empty proxy table. `pairs` works, but `next(frozen)` and `rawget` see nothing, and a JSON encoder that does not use `pairs` may encode it as empty. Pass the original table when you need the raw data.
:::

## MSK.Table.IsFrozen

Checks whether a table is a view returned by `MSK.Table.Freeze`.

**Parameters**  
**tbl** - `any` - The value to check

**Returns**  
**isFrozen** - `boolean` - Whether it is a frozen view

```lua
local isFrozen = MSK.Table.IsFrozen(tbl)
```

## MSK.Table.Merge

Returns a new table with the entries of `base`, overwritten by those of `override`. With `deep`, nested tables that exist on both sides are merged too instead of being replaced. Neither input table is changed.

**Parameters**  
**base** - `table` - The base table  
**override** - `table` - The table whose values win  
**deep** - `boolean` - Optional - Default: `false` - Merge nested tables

**Returns**  
**result** - `table` - The merged table

```lua
local result = MSK.Table.Merge(base, override, deep)

-- Example
local defaults = { slots = 10, blip = { sprite = 357, color = 3 } }
local custom = { slots = 20, blip = { color = 5 } }

MSK.Table.Merge(defaults, custom)
-- Output: { slots = 20, blip = { color = 5 } }

MSK.Table.Merge(defaults, custom, true)
-- Output: { slots = 20, blip = { sprite = 357, color = 5 } }
```

:::note[Difference to ox_lib]
`lib.table.merge` from ox_lib writes into its first table and, by default, adds numbers that exist on both sides. `MSK.Table.Merge` never changes its inputs and always lets the value from `override` win.
:::

## MSK.Table.Matches

Deep equality check: both tables have the same keys, and every value is equal. Nested tables are compared by content, not by identity. Non-table values are compared with `==`.

**Parameters**  
**a** - `any` - First value  
**b** - `any` - Second value

**Returns**  
**matches** - `boolean` - Whether both are equal

```lua
local matches = MSK.Table.Matches(a, b)

-- Example
MSK.Table.Matches({ a = 1, b = { 2, 3 } }, { a = 1, b = { 2, 3 } }) -- true
MSK.Table.Matches({ 1, 2 }, { 1, 2, 3 })                           -- false
```

## MSK.Table.Keys

Returns a list of all keys of the table. The order is not defined.

**Parameters**  
**tbl** - `table` - The Table

**Returns**  
**keys** - `table` - List of keys

```lua
local keys = MSK.Table.Keys(tbl)

-- Example
MSK.Table.Keys({ police = true, ambulance = true }) -- Output: { 'police', 'ambulance' }
```

## MSK.Table.Values

Returns a list of all values of the table. The order is not defined.

**Parameters**  
**tbl** - `table` - The Table

**Returns**  
**values** - `table` - List of values

```lua
local values = MSK.Table.Values(tbl)
```

## MSK.Table.Wipe

Removes every entry from `tbl` in place and returns it. Unlike assigning a new table, every other reference to it sees the empty table.

**Parameters**  
**tbl** - `table` - The Table that should be emptied

**Returns**  
**tbl** - `table` - The same, now empty table

```lua
local tbl = MSK.Table.Wipe(tbl)

-- Example
local cache = {}
local ref = cache

MSK.Table.Wipe(cache)
print(next(ref)) -- Output: nil
```

:::info[New in v4.1.0]
`Freeze`, `IsFrozen`, `Merge`, `Matches`, `Keys`, `Values` and `Wipe` have no exports. Use them through `MSK.Table` in your own resource.
:::
