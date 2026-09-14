---
title: Vector
sidebar_position: 7
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

## MSK.Vector.GetRelativeCoords

Returns the world position of an offset relative to a position and heading, for example a spot two metres in front of a vehicle. The offset is `(right, forward, up)`.

**Parameters**  
**coords** - `vector3, vector4 or table` - The base position  
**rotation** - `number or vector3` - A heading in degrees, or a rotation vector whose `z` is used  
**offset** - `vector3 or table` - The offset as `(right, forward, up)`, `z` is optional

**Returns**  
**coords** - `vector3` - The world position of the offset

```lua
local coords = MSK.Vector.GetRelativeCoords(coords, rotation, offset)

-- Example: two metres in front of the vehicle
local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
local front = MSK.Vector.GetRelativeCoords(GetEntityCoords(vehicle), GetEntityHeading(vehicle), vector3(0.0, 2.0, 0.0))

-- Example: one metre to the right of the player, using the rotation vector
local ped = PlayerPedId()
local right = MSK.Vector.GetRelativeCoords(GetEntityCoords(ped), GetEntityRotation(ped, 2), vector3(1.0, 0.0, 0.0))
```

:::info[New in v4.1.0]
`GetRelativeCoords` has no export. Use it through `MSK.Vector` in your own resource.
:::
