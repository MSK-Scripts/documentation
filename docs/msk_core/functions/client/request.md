---
title: Request
sidebar_position: 8
---

# Request

Helpers to request (stream in) game assets and wait until they are loaded, plus raycast helpers. The functions live under the `MSK.Request` namespace. Most of them also have an `exports.msk_core` export, the ones without one say so.

The `Request` table is also callable directly, `MSK.Request(...)` forwards to `MSK.Request.Streaming(...)`.

:::info[Timeouts]
Every loader accepts a `timeout` in milliseconds as its last parameter. The default is `30000` (30 seconds). Large addon models and texture dictionaries on a busy client easily need more than the 5 seconds that were used before.

When an asset is not loaded within the timeout, the loader **raises an error**. Wrap the call in `pcall` if your script has to continue anyway.
:::

## MSK.Request.Streaming

Generic streaming request. Calls `request(asset, ...)` and waits until `hasLoaded(asset)` returns true. If the asset is already loaded it is returned right away. Most of the helpers below are built on top of this.

**Parameters**  
**request** - `function` - The native that requests the asset, e.g. `RequestModel`  
**hasLoaded** - `function` - The native that checks if the asset is loaded, e.g. `HasModelLoaded`  
**assetType** - `string` - A label used in log and error messages  
**asset** - `any` - The asset to load, e.g. a model hash or a dictionary name  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds  
**...** - `any` - Optional - Extra arguments forwarded to `request`

**Returns**  
**asset** - `any` - The loaded asset

```lua
local asset = MSK.Request.Streaming(request, hasLoaded, assetType, asset, timeout, ...)

-- Example
local model = MSK.Request.Streaming(RequestModel, HasModelLoaded, 'model', joaat('adder'))

-- As an Export:
local asset = exports.msk_core:RequestStreaming(request, hasLoaded, assetType, asset, timeout, ...)
```

## MSK.Request.ScaleformMovie

Requests a scaleform movie and waits until it has loaded.

**Parameters**  
**scaleformName** - `string` - The scaleform movie name  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**scaleform** - `number` - The loaded scaleform movie handle

```lua
local scaleform = MSK.Request.ScaleformMovie(scaleformName, timeout)

-- Example
local scaleform = MSK.Request.ScaleformMovie('MP_BIG_MESSAGE_FREEMODE')

-- As an Export:
local scaleform = exports.msk_core:RequestScaleformMovie(scaleformName, timeout)
```

## MSK.Request.AnimDict

Requests an animation dictionary and waits until it has loaded. Raises an error if the dictionary does not exist. Also reachable through the alias `MSK.LoadAnimDict`.

**Parameters**  
**animDict** - `string` - The animation dictionary  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**animDict** - `string` - The loaded animation dictionary

```lua
local animDict = MSK.Request.AnimDict(animDict, timeout)

-- Example (alias)
local animDict = MSK.LoadAnimDict('amb@world_human_hang_out_street@male_a@idle_a')

-- As an Export:
local animDict = exports.msk_core:RequestAnimDict(animDict, timeout)
```

## MSK.Request.Model

Requests a model and waits until it has loaded. Accepts a model hash or a model name, a name is converted with `joaat`. Raises an error if the model is not valid. Also reachable through the alias `MSK.LoadModel`.

**Parameters**  
**model** - `number | string` - The model hash or name  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**model** - `number` - The loaded model hash

```lua
local model = MSK.Request.Model(model, timeout)

-- Example (alias)
local model = MSK.LoadModel('adder')

-- As an Export:
local model = exports.msk_core:RequestModel(model, timeout)
```

## MSK.Request.AnimSet

Requests an animation set (clip set) and waits until it has loaded.

**Parameters**  
**animSet** - `string` - The animation set name  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**animSet** - `string` - The loaded animation set

```lua
local animSet = MSK.Request.AnimSet(animSet, timeout)

-- Example
local animSet = MSK.Request.AnimSet('move_m@drunk@verydrunk')

-- As an Export:
local animSet = exports.msk_core:RequestAnimSet(animSet, timeout)
```

## MSK.Request.PtfxAsset

Requests a named particle effect (ptfx) asset and waits until it has loaded.

**Parameters**  
**ptFxName** - `string` - The particle effect asset name  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**ptFxName** - `string` - The loaded particle effect asset

```lua
local ptFxName = MSK.Request.PtfxAsset(ptFxName, timeout)

-- Example
local ptFxName = MSK.Request.PtfxAsset('core')

-- As an Export:
local ptFxName = exports.msk_core:RequestPtfxAsset(ptFxName, timeout)
```

## MSK.Request.TextureDict

Requests a streamed texture dictionary and waits until it has loaded.

**Parameters**  
**textureDict** - `string` - The texture dictionary name  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**textureDict** - `string` - The loaded texture dictionary

```lua
local textureDict = MSK.Request.TextureDict(textureDict, timeout)

-- Example
local textureDict = MSK.Request.TextureDict('commonmenu')

-- As an Export:
local textureDict = exports.msk_core:RequestTextureDict(textureDict, timeout)
```

## MSK.Request.AudioBank

Loads a script audio bank. `RequestScriptAudioBank` has to be called repeatedly until it reports success, so this keeps asking until then or until the timeout runs out. There is no export for this function.

**Parameters**  
**audioBank** - `string` - The audio bank name  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**audioBank** - `string` - The loaded audio bank

```lua
local audioBank = MSK.Request.AudioBank(audioBank, timeout)

-- Example
MSK.Request.AudioBank('DLC_HEIST_FLEECA_SOUNDSET')
```

## MSK.Request.WeaponAsset

Loads the assets of a weapon (model and animations), for example before you give a ped a weapon it never had. Accepts a weapon hash or a weapon name. There is no export for this function.

**Parameters**  
**weapon** - `number | string` - The weapon hash or name  
**flags** - `number` - Optional - Default: `31` - Which parts to load, `31` loads everything  
**extraComponents** - `number` - Optional - Default: `0`  
**timeout** - `number` - Optional - Default: `30000` - Timeout in milliseconds

**Returns**  
**weaponHash** - `number` - The weapon hash

```lua
local weaponHash = MSK.Request.WeaponAsset(weapon, flags, extraComponents, timeout)

-- Example
local weaponHash = MSK.Request.WeaponAsset('WEAPON_PISTOL')
GiveWeaponToPed(ped, weaponHash, 12, false, true)
```

## MSK.Request.Raycast

Casts a line of sight probe straight ahead of the player and returns the entity that was hit. The `flag` selects which kinds of intersections count.

The ray is a thin line from the player to a point `distance` in front of the player's ped, and your own ped is ignored. It waits at most one second for the result.

**Parameters**  
**distance** - `number` - Optional - Default: `5.0` - The length of the ray  
**flag** - `number | string` - Optional - Default: `-1` - Intersection flag. Accepts a number or one of the named keys `none`, `all`, `world`, `vehicle`, `ped`, `object`, `water`, `glass`, `river`, `foliage`. An unknown name counts as `all`

**Returns**  
**entityHit** - `number | false` - The entity that was hit, or `false` when nothing (or only the world) was hit

```lua
local entity = MSK.Request.Raycast(distance, flag)

-- Example
local entity = MSK.Request.Raycast(5.0, 'vehicle')

if entity then
    print('looking at vehicle', entity)
end

-- As an Export:
local entity = exports.msk_core:RequestRaycast(distance, flag)
```

:::caution[Changed behaviour]
`MSK.Request.Raycast` used to be a capsule test that used the distance as its radius, so it hit things far off to the side. It also raised an error when the ray hit nothing. Now it is a line and a miss simply returns `false`.
:::

## MSK.Request.RaycastFromCoords

Casts a ray between two points and waits for the result, at most one second.

**Parameters**  
**from** - `vector3` - The start of the ray  
**to** - `vector3` - The end of the ray  
**flags** - `number` - Optional - Default: `511` - Shape test flags, `511` hits everything  
**ignore** - `number` - Optional - Default: `4` - Shape test options  
**ignoreEntity** - `number` - Optional - Default: the player's ped - An entity the ray passes through

**Returns**  
**hit** - `boolean` - Whether something was hit  
**entityHit** - `number` - The entity that was hit, `0` for none  
**endCoords** - `vector3` - Where the ray hit  
**surfaceNormal** - `vector3` - The surface normal at the hit  
**materialHash** - `number` - The material that was hit

If no result arrives within one second it returns `false, 0, to, vector3(0.0, 0.0, 0.0), 0`.

```lua
local hit, entityHit, endCoords, surfaceNormal, materialHash = MSK.Request.RaycastFromCoords(from, to, flags, ignore, ignoreEntity)

-- Example
local from = GetEntityCoords(ped)
local to = from + vector3(0.0, 0.0, -10.0)
local hit, _, groundCoords = MSK.Request.RaycastFromCoords(from, to, 1)

-- As an Export:
local hit, entityHit, endCoords, surfaceNormal, materialHash = exports.msk_core:RequestRaycastFromCoords(from, to, flags, ignore, ignoreEntity)
```

## MSK.Request.CameraRaycast

Casts a ray from the camera in the direction it looks and waits for the result, at most one second. There is no export for this function.

**Parameters**  
**flags** - `number` - Optional - Default: `511` - Shape test flags, `511` hits everything  
**ignore** - `number` - Optional - Default: `4` - Shape test options  
**distance** - `number` - Optional - Default: `10.0` - The length of the ray

**Returns**  
**hit** - `boolean` - Whether something was hit  
**entityHit** - `number` - The entity that was hit, `0` for none  
**endCoords** - `vector3` - Where the ray hit  
**surfaceNormal** - `vector3` - The surface normal at the hit  
**materialHash** - `number` - The material that was hit

```lua
local hit, entityHit, endCoords, surfaceNormal, materialHash = MSK.Request.CameraRaycast(flags, ignore, distance)

-- Example
local hit, entity, coords = MSK.Request.CameraRaycast(511, 4, 20.0)

if hit then
    print('aiming at', coords)
end
```

## MSK.Request.StartCameraRaycast

Starts a camera raycast **without waiting** for it. Use this in code that runs every frame and must not yield, because a `Wait` inside such a loop skips input and control handling for that frame. Read the result in a later frame with `MSK.Request.ReadRaycast`. There is no export for this function.

**Parameters**  
**flags** - `number` - Optional - Default: `511` - Shape test flags  
**ignore** - `number` - Optional - Default: `4` - Shape test options  
**distance** - `number` - Optional - Default: `10.0` - The length of the ray

**Returns**  
**handle** - `number` - The shape test handle  
**destination** - `vector3` - The end point of the ray

```lua
local handle, destination = MSK.Request.StartCameraRaycast(flags, ignore, distance)
```

## MSK.Request.ReadRaycast

Reads the result of a raycast started with `MSK.Request.StartCameraRaycast`. While the test is still running it only returns `false`. There is no export for this function.

**Parameters**  
**handle** - `number` - The handle from `StartCameraRaycast`

**Returns**  
**done** - `boolean` - `false` while the test is still running  
**hit** - `boolean` - Whether something was hit  
**entityHit** - `number` - The entity that was hit, `0` for none  
**endCoords** - `vector3` - Where the ray hit  
**surfaceNormal** - `vector3` - The surface normal at the hit  
**materialHash** - `number` - The material that was hit

```lua
local done, hit, entityHit, endCoords, surfaceNormal, materialHash = MSK.Request.ReadRaycast(handle)

-- Example: a loop that never waits in the middle
CreateThread(function()
    local probe
    local hit, coords = false, nil

    while active do
        DisableControlAction(0, 24, true)

        if not probe then
            probe = MSK.Request.StartCameraRaycast(1 | 16, 4, 50.0)
        end

        local done, probeHit, _, probeCoords = MSK.Request.ReadRaycast(probe)

        if done then
            probe = nil
            hit, coords = probeHit, probeCoords
        end

        if hit then
            DrawMarker(28, coords.x, coords.y, coords.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0, 230, 118, 220, false, false, 2, false, nil, nil, false)
        end

        Wait(0)
    end
end)
```
