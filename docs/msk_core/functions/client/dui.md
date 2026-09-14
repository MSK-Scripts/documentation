---
title: DUI
sidebar_position: 17
---

# DUI

A web page rendered into a game texture, for example for TV screens, billboards or a tablet in the world.

For a page inside your own resource use a `nui://` URL like `nui://my_script/html/screen.html`, and remember to add the file to `files` in your `fxmanifest.lua`. Every DUI of a resource is removed automatically when that resource stops.

## MSK.Dui.New

Creates the page and a runtime texture it renders into.

**Parameters**  
**data** - `table` - The DUI definition  
- **url** - `string` - The URL of the page  
- **width** - `number` - Optional - Default: `1280` - Width of the page in pixels  
- **height** - `number` - Optional - Default: `720` - Height of the page in pixels

**Returns**  
**dui** - `table` - The DUI object

The object carries these fields:

- **id** - `number` - Id of the DUI inside the resource
- **url** - `string` - The current URL
- **width** / **height** - `number` - The page size
- **duiObject** - `number` - The handle from `CreateDui`
- **duiHandle** - `string` - The handle from `GetDuiHandle`
- **dictName** / **textureName** - `string` - The runtime texture dictionary and texture name, e.g. for `DrawSprite`

```lua
local dui = MSK.Dui.New(data)

-- Example
local screen = MSK.Dui.New({
    url = 'nui://my_script/html/screen.html',
    width = 1280,
    height = 720,
})

screen:ReplaceTexture('prop_tv_flat_01', 'script_rt_tvscreen')
```

## DUI methods

**dui:IsAvailable()** - Returns `true` once the page has loaded far enough to receive messages  
**dui:SetUrl(url)** - Loads another URL into the same DUI  
**dui:SendMessage(data)** - Sends a table to the page. It arrives there as a `message` event on `window`, with the table as `event.data`  
**dui:ReplaceTexture(originalDict, originalTexture)** - Shows the page in place of a texture of the game. The original texture is restored in `Remove`  
**dui:MouseMove(x, y)** - Moves the mouse inside the page, in pixels of the page size  
**dui:MouseDown(button)** - Presses a mouse button, `'left'` (default), `'middle'` or `'right'`  
**dui:MouseUp(button)** - Releases a mouse button, `'left'` (default), `'middle'` or `'right'`  
**dui:MouseWheel(deltaY, deltaX)** - Scrolls the page, `deltaX` defaults to `0`  
**dui:Remove()** - Restores all replaced textures and destroys the page

```lua
-- Example
CreateThread(function()
    while not screen:IsAvailable() do
        Wait(100)
    end

    screen:SendMessage({ action = 'play', video = 'intro' })
end)

-- Example: draw the page as a sprite
CreateThread(function()
    while screen.duiObject do
        DrawSprite(screen.dictName, screen.textureName, 0.5, 0.5, 0.4, 0.4, 0.0, 255, 255, 255, 255)
        Wait(0)
    end
end)

-- Later
screen:Remove()
```

On the page itself:

```js
window.addEventListener('message', (event) => {
    if (event.data.action === 'play') {
        // ...
    }
});
```
