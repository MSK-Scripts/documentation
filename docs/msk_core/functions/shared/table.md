---
title: Table
sidebar_position: 5
---

# Table

## MSK.Table.Contains

Check if a value exists in a table.

**Parameters**  
**tbl** - `table` - The Table to check  
**value** - `string/table` - The Value(s) to check

**Returns**  
**contains** - `boolean` - Whether the value exists in the table

```lua
local tbl = {'value_1', 'value_2'}

-- Checks if the value contains in the table
local contains = MSK.Table.Contains(tbl, 'value_1')

-- Checks if one of the values contains in the table
local contains = MSK.Table.Contains(tbl, {'value_1', 'value_5'})

-- As an Export:
local contains = exports.msk_core:TableContains(tbl, value)
```

:::tip
`MSK.Table_Contains` is an alias for `MSK.Table.Contains`.
:::

## MSK.Table.Dump

Dumps the given table to a readable string with a tree structure.

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

Get the size of the table.

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
```

## MSK.Table.Find

Find a specific value in an indexed table.

**Parameters**  
**tbl** - `table` - The Table that should be checked  
**value** - `any` - The value to search for

**Returns**  
**index** - `number?` - The index of the given value  
**value** - `number/string/table` - The value found

```lua
local index, value = MSK.Table.Find(tbl, value)

local tbl = {
  [1] = {'123'},
  [2] = {456},
}

local index, value = MSK.Table.Find(tbl, '123')       -- Output: 1, '123'
local index, value = MSK.Table.Find(tbl, 456)         -- Output: 2, 456
local index, value = MSK.Table.Find(tbl, 'Hello World') -- Output: nil, 'Hello World'
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
