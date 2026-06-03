---
title: Vector
sidebar_position: 6
---

# Vector

:::tip
The legacy global names (`MSK.CoordsToString`, `MSK.VectorToVector`, `MSK.TableToVector`) still work as exports, but the namespaced form `MSK.Vector.*` is the recommended way since v3.0.0.
:::

## MSK.Vector.CoordsToString

Converts the given coords to a vector string.

**Parameters**  
**coords** - `vector3, vector4 or table` - Coordinates

**Returns**  
**vectorString** - `string` - The given coordinates as a string

```lua
local vectorString = MSK.Vector.CoordsToString(coords)

-- Example
local vectorString = MSK.Vector.CoordsToString(GetEntityCoords(PlayerPedId()))
-- Output: "vector3(0.0, 0.0, 0.0)"

-- As an Export:
local vectorString = exports.msk_core:CoordsToString(coords)
```

## MSK.Vector.VectorToVector

Converts vector4 to vector3.

**Parameters**  
**coords** - `vector4` - vector4 coordinates

**Returns**  
**coords** - `vector3` - The given vector4 coordinates as vector3

```lua
local vec3Coords = MSK.Vector.VectorToVector(vector4)

-- Example
local vec3Coords = MSK.Vector.VectorToVector(vector4(0.0, 0.0, 0.0, 0.0))

print(MSK.Vector.CoordsToString(vec3Coords)) -- Output: "vector3(0.0, 0.0, 0.0)"

-- As an Export:
local vec3Coords = exports.msk_core:VectorToVector(vector4)
```

## MSK.Vector.TableToVector

Converts a table to a vector. The target type **must** be specified via `toType`.

**Parameters**  
**coords** - `table` - Table coordinates  
**toType** - `string` - The target type: `'vector3'` or `'vector4'`

**Returns**  
**coords** - `vector3 or vector4` - The given table coordinates as vector3 or vector4

```lua
local vecCoords = MSK.Vector.TableToVector(tableCoords, toType)

-- Example 1: vector3
local vec3Coords = MSK.Vector.TableToVector({x = 0.0, y = 0.0, z = 0.0}, 'vector3')

-- Example 2: vector4 (heading is read from h, w or heading)
local vec4Coords = MSK.Vector.TableToVector({x = 0.0, y = 0.0, z = 0.0, h = 0.0}, 'vector4')

-- As an Export:
local vecCoords = exports.msk_core:TableToVector(tableCoords, toType)
```
