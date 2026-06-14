---
title: Scaleform
sidebar_position: 9
---

# Scaleform

Server-side triggers for the fullscreen scaleform movies. Each function sends the matching `msk_core:*` net event to a target player so the scaleform is rendered on that player's client (see the [client Scaleform docs](/docs/msk_core/functions/client/scaleform)). The functions live under the `MSK.Scaleform` namespace and each has a matching `exports.msk_core` export.

All functions return early when `playerId` is missing or `0`.

## MSK.Scaleform.FreemodeMessage

Shows a "big message" / shard message on the target player's screen.

**Parameters**  
**playerId** - `number` - The target player's server id  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**duration** - `number` - How long to display in ms. Defaults to `5000` on the client (optional)

```lua
MSK.Scaleform.FreemodeMessage(playerId, title, text, duration)

-- Example
MSK.Scaleform.FreemodeMessage(source, 'WASTED', 'You died', 5000)

-- As an Export:
exports.msk_core:FreemodeMessage(playerId, title, text, duration)
```

## MSK.Scaleform.PopupWarning

Shows a popup warning on the target player's screen.

**Parameters**  
**playerId** - `number` - The target player's server id  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**footer** - `string` - The footer text  
**duration** - `number` - How long to display in ms. Defaults to `5000` on the client (optional)

```lua
MSK.Scaleform.PopupWarning(playerId, title, text, footer, duration)

-- Example
MSK.Scaleform.PopupWarning(source, 'WARNING', 'Are you sure?', 'Press to continue', 5000)

-- As an Export:
exports.msk_core:PopupWarning(playerId, title, text, footer, duration)
```

## MSK.Scaleform.BreakingNews

Shows the breaking-news scaleform on the target player's screen.

**Parameters**  
**playerId** - `number` - The target player's server id  
**title** - `string` - The scrolling ticker text  
**text** - `string` - The main text  
**footer** - `string` - The footer text  
**duration** - `number` - How long to display in ms. Defaults to `5000` on the client (optional)

```lua
MSK.Scaleform.BreakingNews(playerId, title, text, footer, duration)

-- Example
MSK.Scaleform.BreakingNews(source, 'BREAKING NEWS', 'Something happened', 'Los Santos', 5000)

-- As an Export:
exports.msk_core:BreakingNews(playerId, title, text, footer, duration)
```

## MSK.Scaleform.TrafficMovie

Plays the traffic-cam scaleform on the target player's screen.

**Parameters**  
**playerId** - `number` - The target player's server id  
**duration** - `number` - How long to display in ms. Defaults to `5000` on the client (optional)

```lua
MSK.Scaleform.TrafficMovie(playerId, duration)

-- Example
MSK.Scaleform.TrafficMovie(source, 5000)

-- As an Export:
exports.msk_core:TrafficMovie(playerId, duration)
```

## MSK.Scaleform.ScaleformAnnounce

:::warning Deprecated
`MSK.ScaleformAnnounce` is deprecated. Use `MSK.Scaleform.FreemodeMessage` (type `1`) or `MSK.Scaleform.PopupWarning` (type `2`) instead.
:::

Legacy wrapper that triggers a freemode message (`typ == 1`) or popup warning (`typ == 2`) on the target player.

**Parameters**  
**playerId** - `number` - The target player's server id  
**title** - `string` - The headline text  
**text** - `string` - The body text  
**typ** - `number` - `1` = freemode message, `2` = popup warning  
**duration** - `number` - How long to display in ms. Defaults to `5000` on the client (optional)

```lua
MSK.Scaleform.ScaleformAnnounce(playerId, title, text, typ, duration)

-- Example
MSK.Scaleform.ScaleformAnnounce(source, 'WASTED', 'You died', 1, 5000)

-- As an Export:
exports.msk_core:ScaleformAnnounce(playerId, title, text, typ, duration)
```
