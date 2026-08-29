---
title: Server
sidebar_position: 2
---

# Server Exports

## getDatabase

**Returns**  
**database** - `table` - Content of database.json (`channel = password`)

```lua
local database = exports.msk_radio:getDatabase()
```

## getChannelMembers

**Parameters**  
**channel** - `number` - The Channel ID  
**playerId** - `number` - Player ID, only for tokovoip

**Returns**  
**channelMembers** - `table` - All Players in this channel

```lua
local channelMembers = exports.msk_radio:getChannelMembers(1)

for k, v in pairs(channelMembers) do
    print(v.playerId, v.name)
end
```

## hasChannelPassword

**Parameters**  
**channel** - `number` - The Channel ID

**Returns**  
**hasChannelPassword** - `boolean`

```lua
local hasChannelPassword = exports.msk_radio:hasChannelPassword(5)
```

## checkChannelPassword

**Parameters**  
**channel** - `number` - The Channel ID  
**password** - `string` - The Password

**Returns**  
**isPasswordCorrect** - `boolean`

```lua
local isPasswordCorrect = exports.msk_radio:checkChannelPassword(5, '1234')
```
