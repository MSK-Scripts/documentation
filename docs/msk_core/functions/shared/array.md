---
title: Array
sidebar_position: 9
---

# Array

Functional helpers for sequences, meaning tables with the keys `1..n`. Every function takes a plain table and returns a plain table. Nothing is wrapped in a metatable, so the results can also be passed through exports.

Callbacks receive `(value, index)`. None of the functions change the input list.

:::info[New in v4.1.0]
`MSK.Array` has no exports. Use it through the import in your own resource.
:::

## MSK.Array.Map

Returns a new list with `fn(value, index)` applied to every element.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)` returning the new value

**Returns**  
**result** - `table` - The new list

```lua
local result = MSK.Array.Map(list, fn)

-- Example
local prices = MSK.Array.Map({ 10, 20, 30 }, function(value)
    return value * 2
end) -- Output: { 20, 40, 60 }
```

## MSK.Array.Filter

Returns a new list with every element for which `fn` returns a truthy value.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)` returning `true` to keep the element

**Returns**  
**result** - `table` - The filtered list

```lua
local result = MSK.Array.Filter(list, fn)

-- Example
local expensive = MSK.Array.Filter({ 5, 50, 500 }, function(value)
    return value >= 50
end) -- Output: { 50, 500 }
```

## MSK.Array.Reduce

Folds the list into a single value. Without `initial`, the first element is the starting value and the fold begins at the second element.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(accumulator, value, index)` returning the new accumulator  
**initial** - `any` - Optional - Starting value

**Returns**  
**value** - `any` - The folded value

```lua
local value = MSK.Array.Reduce(list, fn, initial)

-- Example
local total = MSK.Array.Reduce({ 10, 20, 30 }, function(sum, value)
    return sum + value
end, 0) -- Output: 60
```

## MSK.Array.Find

Returns the first element for which `fn` is truthy, together with its index.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)`

**Returns**  
**value** - `any` - The element found, or `nil`  
**index** - `number?` - The index of the element, or `nil`

```lua
local value, index = MSK.Array.Find(list, fn)

-- Example
local vehicles = { { plate = 'ABC' }, { plate = 'XYZ' } }
local vehicle, index = MSK.Array.Find(vehicles, function(v)
    return v.plate == 'XYZ'
end) -- Output: { plate = 'XYZ' }, 2
```

## MSK.Array.FindIndex

Returns the index of the first element for which `fn` is truthy.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)`

**Returns**  
**index** - `number?` - The index, or `nil` if nothing matched

```lua
local index = MSK.Array.FindIndex(list, fn)
```

## MSK.Array.Some

Checks whether `fn` is truthy for at least one element.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)`

**Returns**  
**some** - `boolean` - Whether at least one element matched

```lua
local some = MSK.Array.Some(list, fn)
```

## MSK.Array.Every

Checks whether `fn` is truthy for every element. An empty list returns `true`.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)`

**Returns**  
**every** - `boolean` - Whether all elements matched

```lua
local every = MSK.Array.Every(list, fn)
```

## MSK.Array.ForEach

Calls `fn` for every element. Returning `false` from `fn` stops the loop.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)`, return `false` to stop

```lua
MSK.Array.ForEach(list, fn)

-- Example
MSK.Array.ForEach({ 'a', 'b', 'c' }, function(value, index)
    print(index, value)
    if value == 'b' then return false end
end) -- prints a and b, then stops
```

## MSK.Array.Includes

Checks whether `value` is an element of the list, using plain equality.

**Parameters**  
**list** - `table` - The list  
**value** - `any` - The value to look for

**Returns**  
**includes** - `boolean` - Whether the value is in the list

```lua
local includes = MSK.Array.Includes(list, value)
```

## MSK.Array.Concat

Joins any number of lists into a new one.

**Parameters**  
**...** - `table` - The lists to join

**Returns**  
**result** - `table` - The joined list

```lua
local result = MSK.Array.Concat(...)

-- Example
local result = MSK.Array.Concat({ 1, 2 }, { 3 }, { 4, 5 }) -- Output: { 1, 2, 3, 4, 5 }
```

## MSK.Array.Slice

Returns the part of the list from `from` to `to`, both inclusive. Negative numbers count from the end, `-1` is the last element.

**Parameters**  
**list** - `table` - The list  
**from** - `number` - Optional - Default: `1` - Start index  
**to** - `number` - Optional - Default: `#list` - End index

**Returns**  
**result** - `table` - The sliced list

```lua
local result = MSK.Array.Slice(list, from, to)

-- Example
local list = { 'a', 'b', 'c', 'd' }
MSK.Array.Slice(list, 2, 3)  -- Output: { 'b', 'c' }
MSK.Array.Slice(list, -2)    -- Output: { 'c', 'd' }
```

## MSK.Array.Unique

Returns the list without duplicates, keeping the first occurrence. `keyFn` decides what counts as the same element, by default the value itself.

**Parameters**  
**list** - `table` - The list  
**keyFn** - `function` - Optional - `keyFn(value)` returning the key to compare

**Returns**  
**result** - `table` - The list without duplicates

```lua
local result = MSK.Array.Unique(list, keyFn)

-- Example
MSK.Array.Unique({ 1, 2, 2, 3, 1 }) -- Output: { 1, 2, 3 }

local players = MSK.Array.Unique(entries, function(entry)
    return entry.identifier
end)
```

## MSK.Array.Flatten

Flattens nested lists by `depth` levels. Only nested tables that are lists (have a first element) are flattened.

**Parameters**  
**list** - `table` - The list  
**depth** - `number` - Optional - Default: `1` - How many levels to flatten, `math.huge` for all

**Returns**  
**result** - `table` - The flattened list

```lua
local result = MSK.Array.Flatten(list, depth)

-- Example
MSK.Array.Flatten({ 1, { 2, { 3 } } })          -- Output: { 1, 2, { 3 } }
MSK.Array.Flatten({ 1, { 2, { 3 } } }, math.huge) -- Output: { 1, 2, 3 }
```

## MSK.Array.GroupBy

Groups the elements by the key that `fn` returns. Elements for which `fn` returns `nil` are left out.

**Parameters**  
**list** - `table` - The list  
**fn** - `function` - `fn(value, index)` returning the group key

**Returns**  
**groups** - `table` - `{ [key] = { elements } }`

```lua
local groups = MSK.Array.GroupBy(list, fn)

-- Example
local byJob = MSK.Array.GroupBy(players, function(player)
    return player.job
end)
-- Output: { police = { ... }, ambulance = { ... } }
```

## MSK.Array.Shuffle

Returns a new list in random order.

**Parameters**  
**list** - `table` - The list

**Returns**  
**result** - `table` - The shuffled list

```lua
local result = MSK.Array.Shuffle(list)
```

## MSK.Array.Chunk

Splits the list into lists of `size` elements. The last one may be shorter.

**Parameters**  
**list** - `table` - The list  
**size** - `number` - Elements per chunk, at least `1`

**Returns**  
**result** - `table` - The list of chunks

```lua
local result = MSK.Array.Chunk(list, size)

-- Example
MSK.Array.Chunk({ 1, 2, 3, 4, 5 }, 2) -- Output: { { 1, 2 }, { 3, 4 }, { 5 } }
```

## MSK.Array.Range

Returns a list of numbers from `from` to `to`. Without `step`, it counts up or down depending on which of the two is bigger.

**Parameters**  
**from** - `number` - First number  
**to** - `number` - Last number  
**step** - `number` - Optional - Default: `1` or `-1` - Step size, must not be `0`

**Returns**  
**result** - `table` - The list of numbers

```lua
local result = MSK.Array.Range(from, to, step)

-- Example
MSK.Array.Range(1, 5)     -- Output: { 1, 2, 3, 4, 5 }
MSK.Array.Range(0, 10, 5) -- Output: { 0, 5, 10 }
MSK.Array.Range(3, 1)     -- Output: { 3, 2, 1 }
```
