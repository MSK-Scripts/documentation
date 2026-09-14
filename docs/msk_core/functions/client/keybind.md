---
title: Keybind
sidebar_position: 15
---

# Keybind

Key bindings the player can change in the GTA settings under **Key Bindings -> FiveM**, with a handler for pressing and one for releasing the key.

Every binding registers the commands `+name` and `-name`, so the `name` has to be unique across **all** resources on the server. FiveM remembers the key a player picked per name. If you rename a binding later, every player loses their own choice and gets the default key again. The chat suggestions for both commands are removed automatically.

## MSK.Keybind.Add

Creates a key binding and returns the binding object.

**Parameters**  
**data** - `table` - The binding definition  
- **name** - `string` - Unique name without spaces  
- **description** - `string` - The text shown in the key binding settings  
- **defaultKey** - `string` - Optional - Default: `''` - The default key, e.g. `'F5'` or `'E'`  
- **defaultMapper** - `string` - Optional - Default: `'keyboard'` - The input mapper, e.g. `'keyboard'`, `'mouse_button'` or `'pad_digitalbutton'`  
- **secondaryKey** - `string` - Optional - A second default key for the same binding  
- **secondaryMapper** - `string` - Optional - Default: the value of `defaultMapper` - The mapper of the secondary key  
- **disabled** - `boolean` - Optional - Default: `false` - Starts the binding disabled  
- **allowInPauseMenu** - `boolean` - Optional - Default: `false` - Lets the binding fire while the pause menu is open. By default presses in the pause menu are ignored  
- **onPressed** - `function(self)` - Optional - Called when the key goes down  
- **onReleased** - `function(self)` - Optional - Called when the key goes up

**Returns**  
**bind** - `table` - The binding object

```lua
local bind = MSK.Keybind.Add(data)

-- Example
local bind = MSK.Keybind.Add({
    name = 'my_script_menu',
    description = 'Open the menu',
    defaultKey = 'F5',
    onPressed = function(self)
        OpenMenu()
    end,
    onReleased = function(self)
        print('released', self.name)
    end,
})
```

:::info
`onReleased` only runs for a press that actually went through. If the key went down while the binding was disabled or while the pause menu was open, the release is ignored as well. Errors inside `onPressed` and `onReleased` are caught and printed to the console.
:::

Adding a second binding with the same name in the same resource raises an error.

## MSK.Keybind.Get

Returns a binding of the calling resource by its name.

**Parameters**  
**name** - `string` - The name of the binding

**Returns**  
**bind** - `table | nil` - The binding object, or `nil` if it does not exist

```lua
local bind = MSK.Keybind.Get(name)

-- Example
local bind = MSK.Keybind.Get('my_script_menu')
```

## MSK.Keybind.GetAll

Returns all bindings of the calling resource, keyed by name.

**Returns**  
**binds** - `table<string, table>` - All bindings

```lua
local binds = MSK.Keybind.GetAll()

-- Example
for name, bind in pairs(MSK.Keybind.GetAll()) do
    print(name, bind:GetCurrentKey())
end
```

## Binding methods

**bind:Disable(state)** - Disables the binding (`true` or no argument) or enables it again (`false`). If the key is held down while you disable it, `onReleased` runs right away  
**bind:IsDisabled()** - Returns `true` while the binding is disabled  
**bind:IsPressed()** - Returns `true` while the key is held down  
**bind:GetCurrentKey()** - Returns the key that is currently bound, as shown in the settings, e.g. `'E'` or `'F5'`. This is the player's own choice if they changed it

```lua
-- Example
bind:Disable(true)

if not bind:IsDisabled() and bind:IsPressed() then
    print('holding', bind:GetCurrentKey())
end

bind:Disable(false)
```
