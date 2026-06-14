---
title: Points
sidebar_position: 7
---

# Points

A lightweight point system (inspired by ox_lib). A point is a coordinate with a trigger radius that fires `onEnter` / `onExit` callbacks as the player moves in and out of range. The module runs a single tracking thread in the core and tracks the closest point.

The functions live under the `MSK.Points` namespace and each has a matching `exports.msk_core` export.

## MSK.Points.Add

Registers a new point. A point object is returned, which also carries a `Remove` method (`point:Remove()`).

**Parameters**  
**properties** - `table` - Point definition. Must contain `coords` and `distance`. Supported fields:

- **coords** - `vector3 | vector4 | table` - The point's position (required)
- **distance** - `number` - The trigger radius (required)
- **onEnter** - `function` - Called with the point when the player enters the radius (optional)
- **onExit** - `function` - Called with the point when the player leaves the radius (optional)
- **onRemove** - `function` - Called with the point when it is removed (optional)

**Returns**  
**point** - `table` - The registered point object (with `id`, the normalized `coords`, and a `Remove` method)

```lua
local point = MSK.Points.Add(properties)

-- Example
local point = MSK.Points.Add({
    coords = vector3(100.0, 200.0, 30.0),
    distance = 5.0,
    onEnter = function(self) print('entered', self.id) end,
    onExit = function(self) print('left', self.id) end,
})

-- As an Export:
local point = exports.msk_core:AddPoint(properties)
```

## MSK.Points.Remove

Removes a registered point by its id.

**Parameters**  
**pointId** - `number` - The id of the point to remove

**Returns**  
**success** - `boolean` - `true` if the point existed and was removed, otherwise `false`

```lua
local success = MSK.Points.Remove(pointId)

-- Example
MSK.Points.Remove(point.id)

-- As an Export:
local success = exports.msk_core:RemovePoint(pointId)
```

## MSK.Points.GetAllPoints

Returns the table of all currently registered points, keyed by id.

**Returns**  
**points** - `table` - All registered points

```lua
local points = MSK.Points.GetAllPoints()

-- Example
for id, point in pairs(MSK.Points.GetAllPoints()) do
    print(id, point.coords)
end

-- As an Export:
local points = exports.msk_core:GetAllPoints()
```

## MSK.Points.GetClosestPoint

Returns the point the player is currently closest to (and inside its radius), or `nil` if none.

**Returns**  
**point** - `table | nil` - The closest point, or `nil`

```lua
local point = MSK.Points.GetClosestPoint()

-- Example
local point = MSK.Points.GetClosestPoint()
if point then print('closest', point.id, point.currentDistance) end

-- As an Export:
local point = exports.msk_core:GetClosestPoint()
```
