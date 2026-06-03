---
title: Request
sidebar_position: 7
---

# Request

:::info
The `Request` functions are available through the `MSK.Request` namespace only (they are not registered as standalone exports). Each loader waits until the asset is ready (default timeout: 5 seconds) and returns it.
:::

## MSK.Request.AnimDict

Loads the given animation dictionary.

**Parameters**  
**animDict** - `string` - The dictionary

**Returns**  
**animDict** - `string` - The given animation dictionary

```lua
MSK.Request.AnimDict(animDict)

-- Example:
MSK.Request.AnimDict("cellphone@")
```

## MSK.Request.AnimSet

Loads the given animation set.

**Parameters**  
**animSet** - `string` - The animation set

**Returns**  
**animSet** - `string` - The given animation set

```lua
MSK.Request.AnimSet(animSet)
```

## MSK.Request.Model

Loads the given model.

**Parameters**  
**model** - `number/string` - The model (hash or name)

**Returns**  
**model** - `number` - The loaded model hash

```lua
MSK.Request.Model(model)

-- Example 1
MSK.Request.Model(`prop_cs_hand_radio`)

-- Example 2
MSK.Request.Model("prop_cs_hand_radio")
```

## MSK.Request.PtfxAsset

Loads the given particle effect asset.

**Parameters**  
**ptFxName** - `string` - The ptFxName Asset

**Returns**  
**ptFxName** - `string` - The given ptFxName Asset

```lua
MSK.Request.PtfxAsset(ptFxName)
```

## MSK.Request.TextureDict

Loads the given texture dictionary.

**Parameters**  
**textureDict** - `string` - The Texture Dictionary

**Returns**  
**textureDict** - `string` - The given Texture Dictionary

```lua
MSK.Request.TextureDict(textureDict)
```

## MSK.Request.ScaleformMovie

Loads the given scaleform movie.

**Parameters**  
**scaleformName** - `string` - The scaleform movie name  
**timeout** - `number?` - Optional timeout in ms (default: `5000`)

**Returns**  
**scaleform** - `number` - The loaded scaleform handle

```lua
local scaleform = MSK.Request.ScaleformMovie(scaleformName)

-- Example
local scaleform = MSK.Request.ScaleformMovie("mp_big_message_freemode")
```

## MSK.Request.Raycast

Performs a shape-test (capsule) raycast in front of the player and returns the hit entity.

**Parameters**  
**distance** - `number` - The raycast distance (default: `5.0`)  
**flag** - `number/string` - The trace flag — number, or one of: `none`, `all`, `world`, `vehicle`, `ped`, `object`, `water`, `glass`, `river`, `foliage` (default: `all`)

**Returns**  
**entity** - `number or false` - The hit entity, or `false` if nothing was hit

```lua
local entity = MSK.Request.Raycast(distance, flag)

-- Example: raycast 10.0 units for vehicles only
local entity = MSK.Request.Raycast(10.0, 'vehicle')

if entity and DoesEntityExist(entity) then
    -- Do something with the entity
end
```
