---
title: Grid
sidebar_position: 12
---

# Grid

A spatial hash over the X/Y plane. Entries are sorted into square cells, so asking "what is near this position" only looks at a handful of entries instead of all of them. `MSK.Zones` uses it internally to keep large numbers of zones cheap.

An entry is any table with either

- `coords` (vector) and `radius` (number), or
- `min` (vector) and `max` (vector) as an axis-aligned bounding box.

The height (Z) is ignored. The grid does not check real distances, it only narrows down the candidates. Do your own distance or shape check on the entries it returns.

:::info[New in v4.1.0]
`MSK.Grid` has no exports. Use it through the import in your own resource.
:::

## MSK.Grid.New

Creates a grid with cells of `cellSize` units.

**Parameters**  
**cellSize** - `number` - Optional - Default: `250.0` - Size of one cell in game units

**Returns**  
**grid** - `table` - The grid

```lua
local grid = MSK.Grid.New(cellSize)

-- Example
local grid = MSK.Grid.New(100.0)
```

:::tip
Choose a cell size somewhat larger than your typical entry. Tiny cells make large entries span many cells, huge cells put too many entries into each one.
:::

## grid:Add

Adds an entry. If the entry is already in the grid, it is sorted in again, which is how you update an entry after changing its position or size.

**Parameters**  
**entry** - `table` - The entry (`coords` + `radius` or `min` + `max`)

**Returns**  
**entry** - `table` - The same entry

```lua
local entry = grid:Add(entry)

-- Example
local shop = grid:Add({ name = 'shop', coords = vector3(25.7, -1347.3, 29.5), radius = 15.0 })
local area = grid:Add({ name = 'area', min = vector3(0.0, 0.0, 0.0), max = vector3(300.0, 300.0, 50.0) })

-- Moved? Add it again
shop.coords = vector3(30.0, -1340.0, 29.5)
grid:Add(shop)
```

## grid:Remove

Removes an entry from the grid.

**Parameters**  
**entry** - `table` - The entry

**Returns**  
**removed** - `boolean` - Whether the entry was in the grid

```lua
local removed = grid:Remove(entry)
```

## grid:GetNearby

Returns the entries that share the cell containing `coords`. This is the cheapest lookup, useful for "is the player inside any zone" checks.

**Parameters**  
**coords** - `vector3/vector2/table` - The position

**Returns**  
**entries** - `table` - List of entries in that cell

```lua
local entries = grid:GetNearby(coords)

-- Example
local coords = GetEntityCoords(PlayerPedId())

for _, entry in ipairs(grid:GetNearby(coords)) do
    if #(coords - entry.coords) <= entry.radius then
        print('Inside', entry.name)
    end
end
```

## grid:GetInRange

Returns the entries in every cell touched by the square around `coords` with the given `radius`. No entry appears twice.

**Parameters**  
**coords** - `vector3/vector2/table` - The position  
**radius** - `number` - Half the side length of the search square

**Returns**  
**entries** - `table` - List of candidate entries

```lua
local entries = grid:GetInRange(coords, radius)

-- Example
local candidates = grid:GetInRange(GetEntityCoords(PlayerPedId()), 500.0)
```

## grid:Has

Checks whether an entry is in the grid.

**Parameters**  
**entry** - `table` - The entry

**Returns**  
**has** - `boolean` - Whether the entry is in the grid

```lua
local has = grid:Has(entry)
```

## grid:Clear

Removes every entry from the grid.

```lua
grid:Clear()
```
