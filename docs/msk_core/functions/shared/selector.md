---
title: Selector
sidebar_position: 10
---

# Selector

Random selection from lists, with or without weights.

:::info[New in v4.1.0]
`MSK.Selector` has no exports. Use it through the import in your own resource.
:::

## Weighted entries

The weighted functions take a list of entries. Each entry can be written in two ways:

```lua
-- Short form: { value, weight }
local loot = {
    { 'common', 70 },
    { 'rare', 25 },
    { 'legendary', 5 },
}

-- Named form: { value = x, weight = n }
local loot = {
    { value = 'common', weight = 70 },
    { value = 'rare', weight = 25 },
    { value = 'legendary', weight = 5 },
}
```

The chance of an entry is its share of the total weight. In the example above `'rare'` is picked in 25 out of 100 draws on average. The weights do not have to add up to 100. Entries with a weight of `0` or less, or without a weight, are never picked. The value can be anything, including a table.

## MSK.Selector.Pick

Returns a random element of the list, together with its index.

**Parameters**  
**list** - `table` - The list

**Returns**  
**value** - `any` - The picked element, or `nil` for an empty list  
**index** - `number?` - The index of the element

```lua
local value, index = MSK.Selector.Pick(list)

-- Example
local spawn = MSK.Selector.Pick({
    vector3(100.0, 200.0, 30.0),
    vector3(150.0, 250.0, 30.0),
})
```

## MSK.Selector.PickMany

Returns `amount` random elements. With `unique` (the default) no element is taken twice, so the result is at most as long as the list.

**Parameters**  
**list** - `table` - The list  
**amount** - `number` - How many elements to pick  
**unique** - `boolean` - Optional - Default: `true` - `false` allows the same element more than once

**Returns**  
**result** - `table` - The picked elements

```lua
local result = MSK.Selector.PickMany(list, amount, unique)

-- Example
local winners = MSK.Selector.PickMany(players, 3)
local rolls = MSK.Selector.PickMany({ 1, 2, 3, 4, 5, 6 }, 10, false)
```

## MSK.Selector.Weighted

Returns a random value where each entry's chance is its share of the total weight. See [Weighted entries](#weighted-entries).

**Parameters**  
**entries** - `table` - List of `{ value, weight }` or `{ value = x, weight = n }` entries

**Returns**  
**value** - `any` - The picked value, or `nil` when no entry has a weight above `0`  
**index** - `number?` - The index of the picked entry

```lua
local value, index = MSK.Selector.Weighted(entries)

-- Example
local rarity = MSK.Selector.Weighted({
    { 'common', 70 },
    { 'rare', 25 },
    { 'legendary', 5 },
})
```

## MSK.Selector.WeightedMany

Makes `amount` weighted picks. With `unique` (the default) an entry leaves the pool once it was picked. The loop stops early when nothing with a weight is left.

**Parameters**  
**entries** - `table` - List of weighted entries  
**amount** - `number` - How many picks to make  
**unique** - `boolean` - Optional - Default: `true` - `false` keeps picked entries in the pool

**Returns**  
**result** - `table` - The picked values

```lua
local result = MSK.Selector.WeightedMany(entries, amount, unique)

-- Example
local rewards = MSK.Selector.WeightedMany({
    { value = { item = 'bread', count = 2 }, weight = 60 },
    { value = { item = 'water', count = 1 }, weight = 30 },
    { value = { item = 'lockpick', count = 1 }, weight = 10 },
}, 2)
```

## MSK.Selector.New

Creates a pool of named sets, for scripts that draw from the same lists again and again (loot tables, spawn points, and so on). The pool can be prefilled with `{ [name] = entries }`.

**Parameters**  
**sets** - `table` - Optional - `{ [name] = entries }`

**Returns**  
**pool** - `table` - The pool

```lua
local pool = MSK.Selector.New(sets)

-- Example
local loot = MSK.Selector.New({
    fishing = {
        { 'boot', 40 },
        { 'fish', 55 },
        { 'treasure', 5 },
    },
    spawns = { vector3(1.0, 2.0, 3.0), vector3(4.0, 5.0, 6.0) },
})

local catch = loot:Weighted('fishing')
local spawn = loot:Pick('spawns')
```

The pool offers the following methods. The pick methods take the set name as first argument and behave like the functions above. They raise an error when the set does not exist.

| Method | Description |
|---|---|
| `pool:Add(name, entries)` | Adds or replaces the set `name` and returns the entries |
| `pool:Remove(name)` | Removes the set, returns whether it existed |
| `pool:Get(name)` | Returns the entries of the set, or `nil` |
| `pool:Names()` | Returns the names of all sets, sorted |
| `pool:Pick(name)` | Same as `MSK.Selector.Pick` |
| `pool:PickMany(name, amount, unique)` | Same as `MSK.Selector.PickMany` |
| `pool:Weighted(name)` | Same as `MSK.Selector.Weighted` |
| `pool:WeightedMany(name, amount, unique)` | Same as `MSK.Selector.WeightedMany` |

:::note
A pool uses a metatable, so it cannot be passed through an export. Create it in the resource that uses it.
:::
