---
title: Notify
sidebar_position: 8
---

# Notify

Server-side notification helpers. Each function forwards the call to a specific player by triggering the matching client net event, where the configured client notification backend (`Config.Notification`, `Config.AdvancedNotification`, `Config.HelpNotification`) handles the actual display.

All functions silently return if `source` is `nil` or `0`.

## MSK.Notification

Sends a notification to a player. Also available as the alias `MSK.Notify`.

**Parameters**  
**source** - `number` - The player server id to send the notification to  
**title** - `string` - The title of the notification  
**message** - `string` - The message body  
**info** - `string` - Optional - Default: `'info'` - The notify type (one of the keys defined in `Config.NotifyTypes`)  
**time** - `number` - Optional - Default: `5000` - Display duration in milliseconds

```lua
MSK.Notification(source, title, message, info, time)

-- Example
MSK.Notification(source, 'MSK Scripts', 'Welcome to the server!', 'success', 5000)

-- As an Export:
exports.msk_core:Notification(source, title, message, info, time)
```

## MSK.HelpNotification

Sends a help notification to a player. Also available as the alias `MSK.HelpNotify`.

**Parameters**  
**source** - `number` - The player server id  
**text** - `string` - The help text to display

```lua
MSK.HelpNotification(source, text)

-- Example
MSK.HelpNotification(source, 'Press ~INPUT_CONTEXT~ to open the menu')

-- As an Export:
exports.msk_core:HelpNotification(source, text)
```

## MSK.AdvancedNotification

Sends an advanced (picture/character) notification to a player. Also available as the alias `MSK.AdvancedNotify`.

**Parameters**  
**source** - `number` - The player server id  
**text** - `string` - The message body  
**title** - `string` - The title shown above the message  
**subtitle** - `string` - The subtitle shown below the title  
**icon** - `string` - Optional - Default: `'CHAR_HUMANDEFAULT'` - The character/picture texture name  
**flash** - `boolean` - Optional - Default: `true` - Whether the notification flashes  
**icontype** - `number` - Optional - Default: `1` - The icon type id

```lua
MSK.AdvancedNotification(source, text, title, subtitle, icon, flash, icontype)

-- Example
MSK.AdvancedNotification(source, 'Your bill has been paid.', 'Bank', 'Maze Bank', 'CHAR_BANK_MAZE', true, 1)

-- As an Export:
exports.msk_core:AdvancedNotification(source, text, title, subtitle, icon, flash, icontype)
```

## MSK.Subtitle

Prints a subtitle on a player's screen.

**Parameters**  
**source** - `number` - The player server id  
**message** - `string` - The subtitle text  
**duration** - `number` - Optional - Default: `8000` - Display duration in milliseconds

```lua
MSK.Subtitle(source, message, duration)

-- Example
MSK.Subtitle(source, '~y~Mission failed.', 5000)

-- As an Export:
exports.msk_core:Subtitle(source, message, duration)
```

## MSK.Spinner

Shows a loading busy spinner on a player's screen.

**Parameters**  
**source** - `number` - The player server id  
**text** - `string` - The text shown next to the spinner  
**typ** - `number` - Optional - Default: `4` - Spinner type (`4` = orange, `5` = white)  
**duration** - `number` - Optional - Default: `5000` - How long the spinner is shown in milliseconds

```lua
MSK.Spinner(source, text, typ, duration)

-- Example
MSK.Spinner(source, 'Saving...', 4, 3000)

-- As an Export:
exports.msk_core:Spinner(source, text, typ, duration)
```

## MSK.Draw3DText

Draws text in the 3D world on a player's screen at the given coordinates. The client renders it for one frame, so for persistent text call it from a server-side loop.

**Parameters**  
**source** - `number` - The player server id  
**coords** - `vector3` / `table` - The world coordinates to draw the text at  
**text** - `string` - The text to draw  
**size** - `number` - Optional - Default: `1` - The base scale of the text  
**font** - `number` - Optional - Default: `0` - The font id

```lua
MSK.Draw3DText(source, coords, text, size, font)

-- Example
MSK.Draw3DText(source, vector3(215.5, -810.2, 30.7), 'Press ~g~E~s~ to interact', 1, 0)

-- As an Export:
exports.msk_core:Draw3DText(source, coords, text, size, font)
```

## MSK.DrawGenericText

Draws 2D text on a player's screen. The client renders it for one frame, so for persistent text call it from a server-side loop.

**Parameters**  
**source** - `number` - The player server id  
**text** - `string` - The text to draw  
**outline** - `boolean` - Optional - Whether to draw a text outline  
**font** - `number` - Optional - Default: `0` - The font id  
**size** - `number` - Optional - Default: `0.34` - The text scale  
**color** - `table` - Optional - Default: `{r = 255, g = 255, b = 255, a = 255}` - The text color  
**position** - `table` - Optional - Default: `{width = 0.50, height = 0.90}` - The screen position

```lua
MSK.DrawGenericText(source, text, outline, font, size, color, position)

-- Example
MSK.DrawGenericText(source, 'Welcome to the City', true, 0, 0.4, {r = 0, g = 230, b = 118, a = 255}, {width = 0.5, height = 0.85})

-- As an Export:
exports.msk_core:DrawGenericText(source, text, outline, font, size, color, position)
```
