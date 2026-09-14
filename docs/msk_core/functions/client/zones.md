---
title: Zones
sidebar_position: 14
---

# Zones

Areas in the world that react when the player walks in or out. There are three shapes: a sphere, a rotated box and a polygon with a floor and a ceiling.

Zones live in the resource that created them. Four times a second the player's position is checked, but only against the zones in the same grid cell (250 units), so the cost does not grow with the total number of zones on the map. The `inside` callback runs every frame while the player is inside.

The table you pass in becomes the zone. Your own fields stay on it, so you can keep data like a label or a job name right on the zone and read it back inside the callbacks. The module adds `id`, `shape` and a few internal fields to it.

Every shape accepts these optional fields:

- **onEnter** - `function(zone)` - Called once when the player enters the zone
- **onExit** - `function(zone)` - Called once when the player leaves the zone
- **inside** - `function(zone)` - Called every frame while the player is inside
- **onRemove** - `function(zone)` - Called when the zone is removed
- **debug** - `boolean` - Draws the zone in the world, green while you are inside, red otherwise

Errors in a callback are caught and printed to the console, they do not stop the other zones.

:::tip
You do not have to type coordinates by hand. The in-game [Zone Creator](#zone-creator) builds a zone for you and copies the finished code to your clipboard.
:::

## MSK.Zones.Sphere

Creates a spherical zone around a point.

**Parameters**  
**data** - `table` - The zone definition, plus the common fields listed above  
- **coords** - `vector3 | vector4 | table` - The center of the sphere  
- **radius** - `number` - The radius, has to be greater than `0`

**Returns**  
**zone** - `table` - The zone object

```lua
local zone = MSK.Zones.Sphere(data)

-- Example
local zone = MSK.Zones.Sphere({
    coords = vec3(215.5, -810.2, 30.7),
    radius = 3.0,
    debug = true,
    onEnter = function(self)
        print('entered zone', self.id)
    end,
    onExit = function(self)
        print('left zone', self.id)
    end,
})
```

## MSK.Zones.Box

Creates a box shaped zone. The box can be turned around its vertical axis.

**Parameters**  
**data** - `table` - The zone definition, plus the common fields listed above  
- **coords** - `vector3 | vector4 | table` - The center of the box  
- **size** - `vector3` - Optional - Default: `vec3(2.0, 2.0, 2.0)` - Width (x), length (y) and height (z)  
- **rotation** - `number` - Optional - Default: `0.0` - The heading of the box in degrees

**Returns**  
**zone** - `table` - The zone object

```lua
local zone = MSK.Zones.Box(data)

-- Example
local zone = MSK.Zones.Box({
    coords = vec3(441.2, -981.9, 30.7),
    size = vec3(4.0, 6.0, 3.0),
    rotation = 90.0,
    job = 'police',
    inside = function(self)
        DrawMarker(1, self.coords.x, self.coords.y, self.coords.z - 1.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.5, 0, 230, 118, 150, false, false, 2, false, nil, nil, false)
    end,
})
```

:::note
The box keeps its own `radius` field for the grid lookup, it is set to half the diagonal of the base. A `radius` you put on a box yourself is overwritten.
:::

## MSK.Zones.Poly

Creates a zone from a polygon of at least three points. By default the zone reaches `thickness / 2` above and below the average height of the points. Set `minZ` and `maxZ` to control floor and ceiling directly.

**Parameters**  
**data** - `table` - The zone definition, plus the common fields listed above  
- **points** - `vector3[]` - At least three corner points, in order around the area  
- **thickness** - `number` - Optional - Default: `4.0` - Total height of the zone  
- **minZ** - `number` - Optional - The floor of the zone, overrides the value derived from `thickness`  
- **maxZ** - `number` - Optional - The ceiling of the zone, overrides the value derived from `thickness`

**Returns**  
**zone** - `table` - The zone object

```lua
local zone = MSK.Zones.Poly(data)

-- Example
local zone = MSK.Zones.Poly({
    points = {
        vec3(100.0, 200.0, 30.0),
        vec3(120.0, 200.0, 30.0),
        vec3(125.0, 220.0, 30.0),
        vec3(100.0, 225.0, 30.0),
    },
    thickness = 6.0,
    onEnter = function(self) print('entered the parking lot') end,
})
```

## MSK.Zones.GetAll

Returns every zone of the calling resource, keyed by id.

**Returns**  
**zones** - `table<number, table>` - All zones of this resource

```lua
local zones = MSK.Zones.GetAll()

-- Example
for id, zone in pairs(MSK.Zones.GetAll()) do
    print(id, zone.shape)
end
```

## MSK.Zones.GetInside

Returns the zones the player is inside right now.

**Returns**  
**zones** - `table[]` - A list of zones

```lua
local zones = MSK.Zones.GetInside()

-- Example
for _, zone in ipairs(MSK.Zones.GetInside()) do
    print('inside', zone.id)
end
```

## MSK.Zones.Remove

Removes a zone by its id. Same as calling `zone:Remove()`.

**Parameters**  
**id** - `number` - The id of the zone

**Returns**  
**removed** - `boolean` - `true` if the zone existed and was removed

```lua
local removed = MSK.Zones.Remove(id)

-- Example
MSK.Zones.Remove(zone.id)
```

## Zone methods

Every zone returned by `Sphere`, `Box` or `Poly` has these methods.

**zone:Contains(coords)** - Returns `true` when the given coordinates lie inside the zone  
**zone:IsInside()** - Returns `true` while the player is inside the zone  
**zone:SetDebug(state)** - Turns the debug drawing on or off  
**zone:Remove()** - Deletes the zone. When the player is inside at that moment, `onExit` still runs first, so a TextUI opened in `onEnter` does not stay on screen. `onRemove` runs afterwards

```lua
-- Example
if zone:Contains(GetEntityCoords(vehicle)) then
    print('the vehicle is inside the zone')
end

zone:SetDebug(true)
zone:Remove()
```

## Zone Creator

msk_core ships an in-game tool that builds a zone for you. You aim with the camera, place the zone, adjust it and press Enter. The finished `MSK.Zones` code is copied to your clipboard and also printed to the F8 console.

The command is set up in `config.lua`:

```lua
Config.ZoneCreator = {
    enable = true,
    command = 'zoneCreator',
    groups = {'superadmin', 'god', 'admin'}
}
```

The permission is checked on the server, the client part only starts when the server allows it. The command cannot be run from the server console.

```
/zoneCreator box
/zoneCreator sphere
/zoneCreator poly
```

Without a shape, or with an unknown one, it starts with a box. A small green marker shows where the camera points at (up to 50 meters, it hits the world and objects). While the creator is open, attacking, weapon selection and the keys below are blocked for normal gameplay.

| Key | Action |
|---|---|
| `E` | Place the zone (box, sphere) or add a point (poly) |
| `Mouse wheel` | Radius (sphere), width (box), thickness (poly) |
| `Shift` + `Mouse wheel` | Length (box) |
| `Ctrl` + `Mouse wheel` | Height (box) |
| `Arrow left` / `Arrow right` | Rotate the box in 5 degree steps |
| `Backspace` | Remove the last point (poly) |
| `Enter` | Finish and copy the code |
| `X` | Cancel |

Each wheel step changes the value by `0.25`. A new box starts at `4.0 x 4.0 x 3.0`, a sphere with a radius of `3.0` and a poly with a thickness of `4.0`. A poly needs at least three points before you can finish it.

The copied code looks like this and can be pasted straight into your script:

```lua
MSK.Zones.Box({
    coords = vec3(215.50, -810.20, 30.70),
    size = vec3(4.00, 6.00, 3.00),
    rotation = 90.00,
})
```
