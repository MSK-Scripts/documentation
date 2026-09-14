---
title: Points
sidebar_position: 7
---

# Points

A lightweight point system. A point is a coordinate with a trigger radius that fires `onEnter` and `onExit` callbacks as the player moves in and out of range. The module runs a single tracking thread and keeps track of the closest point.

All points are measured every 250 ms. Points with a `nearby` callback are measured again every frame while the player is inside, and their callback runs every frame, so you can draw markers or text right from it.

The functions live under the `MSK.Points` namespace and each has a matching `exports.msk_core` export.

:::info
Callbacks run protected. An error in `onEnter`, `onExit`, `nearby` or `onRemove` no longer stops the thread and with it every other point. The error is logged **once** per point and callback, so a broken `nearby` does not flood the console every frame.
:::

## MSK.Points.Add

Registers a new point. The table you pass in becomes the point, so your own fields stay on it and can be read in the callbacks.

**Parameters**  
**properties** - `table` - The point definition  
- **coords** - `vector3 | vector4 | table` - The position of the point  
- **distance** - `number` - The trigger radius  
- **onEnter** - `function(point)` - Optional - Called once when the player enters the radius  
- **onExit** - `function(point)` - Optional - Called once when the player leaves the radius, and also when the point is removed while the player is inside  
- **nearby** - `function(point)` - Optional - Called every frame while the player is inside the radius. `point.currentDistance` is updated every frame as well  
- **onRemove** - `function(point)` - Optional - Called when the point is removed

**Returns**  
**point** - `table` - The point object

The point object carries these fields:

- **id** - `number` - The id of the point
- **coords** - `vector3` - The normalized coordinates
- **inside** - `boolean` - `true` while the player is inside the radius
- **currentDistance** - `number | nil` - The distance to the player while inside, otherwise `nil`
- **isClosest** - `boolean | nil` - `true` on the point that is currently the closest one
- **Remove** - `function` - Removes the point. Both `point:Remove()` and `point.Remove()` work

```lua
local point = MSK.Points.Add(properties)

-- Example
local point = MSK.Points.Add({
    coords = vector3(100.0, 200.0, 30.0),
    distance = 5.0,
    label = 'Garage',
    onEnter = function(self) print('entered', self.label) end,
    onExit = function(self) print('left', self.label) end,
    nearby = function(self)
        DrawMarker(1, self.coords.x, self.coords.y, self.coords.z - 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.5, 1.5, 0.5, 0, 230, 118, 150, false, false, 2, false, nil, nil, false)
    end,
})

-- As an Export:
local point = exports.msk_core:AddPoint(properties)
```

:::note
A point added through the `AddPoint` export belongs to the resource that called it. When that resource stops, its points are removed. Their callbacks are **not** called in that case, because they would call into a resource that is already gone.
:::

## MSK.Points.Remove

Removes a registered point by its id. If the player is inside the point at that moment, `onExit` runs first, so a TextUI opened in `onEnter` does not stay on screen. `onRemove` runs afterwards.

**Parameters**  
**pointId** - `number` - The id of the point to remove

**Returns**  
**success** - `boolean` - `true` if the point existed and was removed, otherwise `false`

```lua
local success = MSK.Points.Remove(pointId)

-- Example
MSK.Points.Remove(point.id)

-- Example: the same through the point itself
point:Remove()

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

Returns the point the player is currently closest to while inside its radius, or `nil` if there is none.

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

## MSK.Points.GetNearbyPoints

Returns all points the player is inside of, sorted from closest to farthest.

**Returns**  
**points** - `table[]` - A sorted list of points, empty when the player is not inside any point

```lua
local points = MSK.Points.GetNearbyPoints()

-- Example
for _, point in ipairs(MSK.Points.GetNearbyPoints()) do
    print(point.id, point.currentDistance)
end

-- As an Export:
local points = exports.msk_core:GetNearbyPoints()
```
