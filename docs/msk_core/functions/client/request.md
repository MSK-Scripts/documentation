---
title: Request
sidebar_position: 8
---

# Request

Helpers to request (stream in) game assets and wait until they are loaded, plus a raycast helper. The functions live under the `MSK.Request` namespace and each has a matching `exports.msk_core` export.

The `Request` table is also callable directly — `MSK.Request(...)` forwards to `MSK.Request.Streaming(...)`.

## MSK.Request.Streaming

Generic streaming request: calls `request(asset, ...)` and waits (via `MSK.Timeout.Await`) until `hasLoaded(asset)` returns true. Most of the helpers below are built on top of this.

**Parameters**  
**request** - `function` - The native that requests the asset (e.g. `RequestModel`)  
**hasLoaded** - `function` - The native that checks if the asset is loaded (e.g. `HasModelLoaded`)  
**assetType** - `string` - A label used in log/error messages  
**asset** - `any` - The asset to load (model hash, dict name, …)  
**timeout** - `number` - Timeout in ms. Defaults to `5000` (optional)  
**...** - `any` - Extra args forwarded to `request`

**Returns**  
**asset** - `any` - The loaded asset

```lua
local asset = MSK.Request.Streaming(request, hasLoaded, assetType, asset, timeout)

-- Example
local model = MSK.Request.Streaming(RequestModel, HasModelLoaded, 'model', joaat('adder'))

-- As an Export:
local asset = exports.msk_core:RequestStreaming(request, hasLoaded, assetType, asset, timeout)
```

## MSK.Request.ScaleformMovie

Requests a scaleform movie and waits until it has loaded.

**Parameters**  
**scaleformName** - `string` - The scaleform movie name  
**timeout** - `number` - Timeout in ms. Defaults to `5000` (optional)

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

Requests an animation dictionary and waits until it has loaded. Also reachable through the alias `MSK.LoadAnimDict`.

**Parameters**  
**animDict** - `string` - The animation dictionary (must exist)

**Returns**  
**animDict** - `string` - The loaded animation dictionary

```lua
local animDict = MSK.Request.AnimDict(animDict)

-- Example (alias)
local animDict = MSK.LoadAnimDict('amb@world_human_hang_out_street@male_a@idle_a')

-- As an Export:
local animDict = exports.msk_core:RequestAnimDict(animDict)
```

## MSK.Request.Model

Requests a model and waits until it has loaded. Accepts either a model hash or a model name (a name is converted via `joaat`). Also reachable through the alias `MSK.LoadModel`.

**Parameters**  
**model** - `number | string` - The model hash or name (must be valid)

**Returns**  
**model** - `number` - The loaded model hash

```lua
local model = MSK.Request.Model(model)

-- Example (alias)
local model = MSK.LoadModel('adder')

-- As an Export:
local model = exports.msk_core:RequestModel(model)
```

## MSK.Request.AnimSet

Requests an animation set (clip set) and waits until it has loaded.

**Parameters**  
**animSet** - `string` - The animation set name

**Returns**  
**animSet** - `string` - The loaded animation set

```lua
local animSet = MSK.Request.AnimSet(animSet)

-- Example
local animSet = MSK.Request.AnimSet('move_m@drunk@verydrunk')

-- As an Export:
local animSet = exports.msk_core:RequestAnimSet(animSet)
```

## MSK.Request.PtfxAsset

Requests a named particle effect (ptfx) asset and waits until it has loaded.

**Parameters**  
**ptFxName** - `string` - The particle effect asset name

**Returns**  
**ptFxName** - `string` - The loaded particle effect asset

```lua
local ptFxName = MSK.Request.PtfxAsset(ptFxName)

-- Example
local ptFxName = MSK.Request.PtfxAsset('core')

-- As an Export:
local ptFxName = exports.msk_core:RequestPtfxAsset(ptFxName)
```

## MSK.Request.TextureDict

Requests a streamed texture dictionary and waits until it has loaded.

**Parameters**  
**textureDict** - `string` - The texture dictionary name

**Returns**  
**textureDict** - `string` - The loaded texture dictionary

```lua
local textureDict = MSK.Request.TextureDict(textureDict)

-- Example
local textureDict = MSK.Request.TextureDict('commonmenu')

-- As an Export:
local textureDict = exports.msk_core:RequestTextureDict(textureDict)
```

## MSK.Request.Raycast

Performs a shape-test (raycast) straight ahead of the player and returns the first entity hit. The `flag` selects which kinds of intersections count.

**Parameters**  
**distance** - `number` - The raycast distance. Defaults to `5.0` (optional)  
**flag** - `number | string` - Intersection flag. Accepts a number or one of the named keys: `none`, `all`, `world`, `vehicle`, `ped`, `object`, `water`, `glass`, `river`, `foliage`. Defaults to `all` / `-1` (optional)

**Returns**  
**entityHit** - `number | boolean` - The entity that was hit, or `false` if nothing was hit

```lua
local entity = MSK.Request.Raycast(distance, flag)

-- Example
local entity = MSK.Request.Raycast(5.0, 'vehicle')

-- As an Export:
local entity = exports.msk_core:RequestRaycast(distance, flag)
```
