---
title: Scaleform
sidebar_position: 11
---

# Scaleform

Helpers to render GTA's built-in scaleform movies. There are two parts:

- **Ready-made messages** like wasted-style messages, popup warnings, breaking news and the traffic cam. Each has a matching `exports.msk_core` export, and the core also registers the matching `msk_core:*` net events so the server can trigger them on a client. These block the calling thread while they are shown.
- **`MSK.Scaleform.New`** gives you a handle on any scaleform movie. You call its methods, draw it fullscreen, in an area of the screen or on a screen in the world. It has no export, the movie lives in the resource that created it.

## MSK.Scaleform.FreemodeMessage

Shows a "big message" / shard (wasted-style) message in the center of the screen.

**Parameters**  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**duration** - `number` - Optional - Default: `5000` - How long to display in ms

```lua
MSK.Scaleform.FreemodeMessage(title, text, duration)

-- Example
MSK.Scaleform.FreemodeMessage('WASTED', 'You died', 5000)

-- As an Export:
exports.msk_core:FreemodeMessage(title, text, duration)
```

## MSK.Scaleform.PopupWarning

Shows a popup warning dialog with a title, body and footer.

**Parameters**  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**footer** - `string` - The footer text  
**duration** - `number` - Optional - Default: `5000` - How long to display in ms

```lua
MSK.Scaleform.PopupWarning(title, text, footer, duration)

-- Example
MSK.Scaleform.PopupWarning('WARNING', 'Are you sure?', 'Press to continue', 5000)

-- As an Export:
exports.msk_core:PopupWarning(title, text, footer, duration)
```

## MSK.Scaleform.BreakingNews

Shows the "breaking news" scaleform with a scrolling ticker.

**Parameters**  
**title** - `string` - The scrolling ticker text  
**text** - `string` - The main text  
**footer** - `string` - The footer text  
**duration** - `number` - Optional - Default: `5000` - How long to display in ms

```lua
MSK.Scaleform.BreakingNews(title, text, footer, duration)

-- Example
MSK.Scaleform.BreakingNews('BREAKING NEWS', 'Something happened', 'Los Santos', 5000)

-- As an Export:
exports.msk_core:BreakingNews(title, text, footer, duration)
```

## MSK.Scaleform.TrafficMovie

Plays the traffic cam scaleform movie.

**Parameters**  
**duration** - `number` - Optional - Default: `5000` - How long to display in ms

```lua
MSK.Scaleform.TrafficMovie(duration)

-- Example
MSK.Scaleform.TrafficMovie(5000)

-- As an Export:
exports.msk_core:TrafficMovie(duration)
```

## MSK.Scaleform.ScaleformAnnounce

:::warning[Deprecated]
`MSK.ScaleformAnnounce` is deprecated and will be removed in a future version. Use `MSK.Scaleform.FreemodeMessage` (type `1`) or `MSK.Scaleform.PopupWarning` (type `2`) instead. A resource that still calls it gets a warning in the console, **once per resource** and not on every call.
:::

Legacy wrapper that dispatches to `FreemodeMessage` (`typ == 1`) or `PopupWarning` (`typ == 2`, with an empty footer).

**Parameters**  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**typ** - `number` - `1` = freemode message, `2` = popup warning  
**duration** - `number` - Optional - Default: `5000` - How long to display in ms

```lua
MSK.Scaleform.ScaleformAnnounce(title, text, typ, duration)

-- Example
MSK.Scaleform.ScaleformAnnounce('WASTED', 'You died', 1, 5000)

-- As an Export:
exports.msk_core:ScaleformAnnounce(title, text, typ, duration)
```

## MSK.Scaleform.New

Loads any scaleform movie and returns a handle on it. The movie is loaded with [`MSK.Request.ScaleformMovie`](./request.md#mskrequestscaleformmovie), so a load that does not finish in time raises an error.

**Parameters**  
**name** - `string` - The scaleform movie name  
**options** - `number | table` - Optional - Either the load timeout in milliseconds, or a table  
- **timeout** - `number` - Optional - Default: `30000` - The load timeout in milliseconds  
- **renderTarget** - `table` - Optional - Draws the movie onto a screen in the world instead of your screen, see `SetRenderTarget`  
  - **name** - `string` - The name of the render target, e.g. `'tvscreen'`  
  - **model** - `string | number` - Optional - The model that carries the render target, e.g. `'prop_tv_flat_01'`

**Returns**  
**movie** - `table` - The movie object

```lua
local movie = MSK.Scaleform.New(name, options)

-- Example: fullscreen for 5 seconds, then it disposes itself
local movie = MSK.Scaleform.New('MP_BIG_MESSAGE_FREEMODE')
movie:Call('SHOW_SHARD_WASTED_MP_MESSAGE', 'MISSION PASSED', 'Well done')
movie:Render(5000)

-- Example: on a TV in the world
local tv = MSK.Scaleform.New('MOVIE_PLAYER', {
    renderTarget = { name = 'tvscreen', model = 'prop_tv_flat_01' },
})
tv:Render()
```

## Movie methods

### movie:Call

Calls a method of the movie. The arguments are sent by their Lua type: an integer as int, a float as float, a boolean as bool and a string as text. Wrap a value in a table to force a type: `{ int = 5 }`, `{ float = 1 }` or `{ texture = 'CHAR_DEFAULT' }`.

**Parameters**  
**method** - `string` - The name of the scaleform method  
**...** - `any` - The arguments

```lua
movie:Call(method, ...)

-- Example
movie:Call('SET_DATA_SLOT', 0, { float = 1 }, 'Some text', true)
```

### movie:CallWithReturn

Calls a method and waits for its return value, at most one second.

**Parameters**  
**method** - `string` - The name of the scaleform method  
**returnType** - `string` - `'int'`, `'bool'` or `'string'`. Anything else is read as `'int'`  
**...** - `any` - The arguments, same rules as `Call`

**Returns**  
**value** - `integer | boolean | string | nil` - The return value, or `nil` when it did not arrive within one second

```lua
local value = movie:CallWithReturn(method, returnType, ...)

-- Example
local index = movie:CallWithReturn('GET_CURRENT_SELECTION', 'int')
```

### movie:Draw

Draws one frame. Without arguments it draws fullscreen, otherwise at the center position `x` / `y` with the size `width` / `height`, all in screen units from `0` to `1`. Has to be called every frame. When a render target is set, the frame goes onto that target.

**Parameters**  
**x** - `number` - Optional  
**y** - `number` - Optional  
**width** - `number` - Optional  
**height** - `number` - Optional

```lua
movie:Draw(x, y, width, height)

-- Example
CreateThread(function()
    while showing do
        movie:Draw(0.5, 0.5, 0.4, 0.4)
        Wait(0)
    end
end)
```

### movie:Render

Draws the movie every frame in its own thread, so you do not need a loop. With a `duration` it stops and **disposes** the movie afterwards. Without one it runs until you call `Stop` or `Dispose`. Calling `Render` again replaces the running render.

**Parameters**  
**duration** - `number` - Optional - How long to render in milliseconds  
**area** - `table` - Optional - `{ x, y, width, height }` to render in an area instead of fullscreen

```lua
movie:Render(duration, area)

-- Example
movie:Render(nil, { x = 0.8, y = 0.2, width = 0.3, height = 0.3 })
```

### movie:IsRendering

**Returns**  
**isRendering** - `boolean` - `true` while `Render` draws the movie

```lua
local isRendering = movie:IsRendering()
```

### movie:Stop

Stops `Render`. The movie stays loaded and can be rendered again.

```lua
movie:Stop()
```

### movie:SetRenderTarget

Draws the movie onto a named render target of a model in the world instead of the screen, e.g. `'tvscreen'` on `'prop_tv_flat_01'`. A render target that was set before is released first.

The render target is only registered if nobody registered it yet, and only a render target registered here is released here again. One that another script registered stays in use for that script.

**Parameters**  
**name** - `string` - The name of the render target  
**model** - `string | number` - Optional - The model that carries the render target

```lua
movie:SetRenderTarget(name, model)

-- Example
movie:SetRenderTarget('tvscreen', 'prop_tv_flat_01')
```

### movie:ReleaseRenderTarget

Stops drawing onto the render target, the movie draws on your screen again.

```lua
movie:ReleaseRenderTarget()
```

### movie:Dispose

Stops rendering, releases the render target and the movie. The movie object can not be used afterwards, calling `Call`, `Draw`, `Render` or `SetRenderTarget` on it raises a clear error.

```lua
movie:Dispose()
```
