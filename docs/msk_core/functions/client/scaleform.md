---
title: Scaleform
sidebar_position: 11
---

# Scaleform

Helpers to render GTA's built-in fullscreen scaleform movies (wasted-style messages, popup warnings, breaking news, traffic cam). The functions live under the `MSK.Scaleform` namespace and each has a matching `exports.msk_core` export. The core also registers the matching `msk_core:*` net events so the server can trigger these on a client.

## MSK.Scaleform.FreemodeMessage

Shows a "big message" / shard (wasted-style) message in the center of the screen.

**Parameters**  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**duration** - `number` - How long to display in ms. Defaults to `5000` (optional)

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
**duration** - `number` - How long to display in ms. Defaults to `5000` (optional)

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
**duration** - `number` - How long to display in ms. Defaults to `5000` (optional)

```lua
MSK.Scaleform.BreakingNews(title, text, footer, duration)

-- Example
MSK.Scaleform.BreakingNews('BREAKING NEWS', 'Something happened', 'Los Santos', 5000)

-- As an Export:
exports.msk_core:BreakingNews(title, text, footer, duration)
```

## MSK.Scaleform.TrafficMovie

Plays the traffic-cam scaleform movie.

**Parameters**  
**duration** - `number` - How long to display in ms. Defaults to `5000` (optional)

```lua
MSK.Scaleform.TrafficMovie(duration)

-- Example
MSK.Scaleform.TrafficMovie(5000)

-- As an Export:
exports.msk_core:TrafficMovie(duration)
```

## MSK.Scaleform.ScaleformAnnounce

:::warning Deprecated
`MSK.ScaleformAnnounce` is deprecated. Use `MSK.Scaleform.FreemodeMessage` (type `1`) or `MSK.Scaleform.PopupWarning` (type `2`) instead.
:::

Legacy wrapper that dispatches to `FreemodeMessage` (`typ == 1`) or `PopupWarning` (`typ == 2`).

**Parameters**  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**typ** - `number` - `1` = freemode message, `2` = popup warning  
**duration** - `number` - How long to display in ms. Defaults to `5000` (optional)

```lua
MSK.Scaleform.ScaleformAnnounce(title, text, typ, duration)

-- Example
MSK.Scaleform.ScaleformAnnounce('WASTED', 'You died', 1, 5000)

-- As an Export:
exports.msk_core:ScaleformAnnounce(title, text, typ, duration)
```
