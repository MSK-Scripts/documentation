---
title: World
sidebar_position: 7
---

# World

Server-side world and entity helper functions, plus the Discord webhook helper.

## MSK.IsSpawnPointClear

Checks whether there are no vehicles within `maxDistance` of the given coordinates. Returns `nil` if no `coords` are provided.

**Parameters**  
**coords** - `vector3` / `table` - The coordinates to check around  
**maxDistance** - `number` - Optional - Default: `5.0` - The maximum distance (in meters) to search for nearby vehicles

**Returns**  
**isClear** - `boolean` - `true` if no vehicles were found within `maxDistance`

```lua
MSK.IsSpawnPointClear(coords, maxDistance)

-- Example
if MSK.IsSpawnPointClear(vector3(215.5, -810.2, 30.7), 3.0) then
    -- the spawn point is clear
end

-- As an Export:
exports.msk_core:IsSpawnPointClear(coords, maxDistance)
```

## MSK.GetClosestPlayer

Returns the closest player to the given coordinates, excluding the provided `playerId`. Convenience wrapper around `MSK.GetClosestEntity` (Entities module).

**Parameters**  
**playerId** - `number` - The player server id to exclude from the search  
**coords** - `vector3` / `table` - The coordinates to search around

**Returns**  
**player** - `number` - The closest player  
**distance** - `number` - The distance to that player

```lua
MSK.GetClosestPlayer(playerId, coords)

-- Example
local player, distance = MSK.GetClosestPlayer(source, coords)

-- As an Export:
exports.msk_core:GetClosestPlayer(playerId, coords)
```

## MSK.GetClosestPlayers

Returns all players within `distance` of the given coordinates, excluding the provided `playerId`. Convenience wrapper around `MSK.GetClosestEntities` (Entities module).

**Parameters**  
**playerId** - `number` - The player server id to exclude from the search  
**coords** - `vector3` / `table` - The coordinates to search around  
**distance** - `number` - The maximum search distance

**Returns**  
**players** - `table` - A list of players within range

```lua
MSK.GetClosestPlayers(playerId, coords, distance)

-- Example
local players = MSK.GetClosestPlayers(source, coords, 10.0)

-- As an Export:
exports.msk_core:GetClosestPlayers(playerId, coords, distance)
```

## MSK.AddWebhook

Sends a Discord embed message to a webhook using `PerformHttpRequest`. The embed is built from the given title, description, color, optional fields and an optional footer.

**Parameters**  
**webhook** - `string` - The Discord webhook URL  
**color** - `number` / `string` - The decimal color code of the embed (e.g. `6205745`)  
**botName** - `string` - The username the message is posted under  
**botAvatar** - `string` - The avatar URL of the bot  
**title** - `string` - The embed title  
**description** - `string` - The embed description  
**fields** - `table` - Optional - A list of Discord embed field objects (`{name, value, inline}`). If omitted, the embed has no fields  
**footer** - `table` / `boolean` - Optional - A footer table `{text, link}` (`link` becomes the footer icon). Set to `false` to disable the footer entirely  
**time** - `string` - Optional - An `os.date` format string; when provided, the formatted timestamp is appended to the footer text

```lua
MSK.AddWebhook(webhook, color, botName, botAvatar, title, description, fields, footer, time)

-- Example
MSK.AddWebhook(
    'https://discord.com/api/webhooks/xxxxx/yyyyy', -- webhook
    6205745,                                         -- color (decimal)
    'MSK Scripts',                                   -- botName
    'https://i.imgur.com/PizJGsh.png',               -- botAvatar
    'Player Joined',                                 -- title
    'A new player has connected to the server.',     -- description
    {                                                -- fields
        { name = 'Player', value = 'Musiker15', inline = true },
        { name = 'Server ID', value = '1', inline = true },
    },
    {                                                -- footer
        text = 'MSK Scripts',
        link = 'https://i.imgur.com/PizJGsh.png'
    },
    '%d.%m.%Y %H:%M:%S'                              -- time (os.date format)
)

-- Without a footer (set footer = false to disable it):
MSK.AddWebhook(webhook, 6205745, 'MSK Scripts', avatar, 'Title', 'Description', nil, false)

-- As an Export:
exports.msk_core:AddWebhook(webhook, color, botName, botAvatar, title, description, fields, footer, time)
```
