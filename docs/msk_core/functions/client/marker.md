---
title: Marker
sidebar_position: 18
---

# Marker

A marker with its settings stored once, so drawing it is a single call per frame instead of a `DrawMarker` call with 24 arguments.

You can find the marker types in the [FiveM marker reference](https://docs.fivem.net/docs/game-references/markers/).

## MSK.Marker.New

Creates a marker object. Nothing is drawn yet, call `marker:Draw()` every frame for that.

**Parameters**  
**data** - `table` - The marker definition  
- **coords** - `vector3 | table` - The position of the marker  
- **type** - `number` - Optional - Default: `1` - The marker type  
- **width** - `number` - Optional - Default: `1.0` - Scale on the x and y axis  
- **height** - `number` - Optional - Default: `1.0` - Scale on the z axis  
- **color** - `table` - Optional - Default: `{ r = 0, g = 230, b = 118, a = 150 }` - Either `{ r, g, b, a }` with keys or a list like `{ 255, 0, 0, 200 }`. A missing color part becomes `255`, a missing alpha `150`  
- **direction** - `vector3` - Optional - Default: `vec3(0.0, 0.0, 0.0)` - The direction vector  
- **rotation** - `vector3` - Optional - Default: `vec3(0.0, 0.0, 0.0)` - The rotation  
- **bobUpAndDown** - `boolean` - Optional - Default: `false` - Moves the marker up and down  
- **faceCamera** - `boolean` - Optional - Default: `false` - Turns the marker towards the camera  
- **rotate** - `boolean` - Optional - Default: `false` - Spins the marker  
- **textureDict** - `string` - Optional - A texture dictionary for the marker  
- **textureName** - `string` - Optional - A texture name for the marker

**Returns**  
**marker** - `table` - The marker object

```lua
local marker = MSK.Marker.New(data)

-- Example
local marker = MSK.Marker.New({
    type = 1,
    coords = vec3(215.5, -810.2, 29.7),
    width = 1.5,
    height = 0.5,
})

CreateThread(function()
    while true do
        local sleep = 500

        if marker:GetDistance() < 20.0 then
            sleep = 0
            marker:Draw()
        end

        Wait(sleep)
    end
end)
```

## MSK.Marker.Draw

Draws a marker for the current frame only, without keeping an object. Takes the same fields as `MSK.Marker.New`. Has to be called every frame.

**Parameters**  
**data** - `table` - The marker definition

```lua
MSK.Marker.Draw(data)

-- Example
CreateThread(function()
    while true do
        MSK.Marker.Draw({ type = 2, coords = vec3(215.5, -810.2, 30.7), color = { 244, 63, 94 }, rotate = true })
        Wait(0)
    end
end)
```

## Marker methods

**marker:Draw()** - Draws the marker for this frame  
**marker:SetCoords(coords)** - Moves the marker  
**marker:SetColor(color)** - Changes the color, same format as the `color` field  
**marker:GetDistance(coords)** - Returns the distance from the marker to `coords`, by default to the player

```lua
-- Example
marker:SetCoords(GetEntityCoords(vehicle))
marker:SetColor({ r = 244, g = 63, b = 94, a = 200 })

local distance = marker:GetDistance()
```
