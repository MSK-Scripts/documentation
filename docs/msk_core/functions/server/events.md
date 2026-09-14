---
title: Events
sidebar_position: 20
---

# Events

Helpers to send the same client event to many players at once. New in v4.1.0.

`TriggerClientEvent` serializes its arguments again for every single call. When you loop over a list of players, the same data is packed once per player. These functions pack the arguments **once** and hand the same payload to every target.

All functions are **server-side** only. They run inside your own resource, so there are no exports for them.

## MSK.Events.TriggerClients

Sends an event to one player, a list of players or everyone.

**Parameters**  
**eventName** - `string` - The client event name  
**targets** - `number` or `table` - A server id, `-1` for every player, or a list of server ids  
**...** - `any` - Optional - The arguments of the event  

```lua
MSK.Events.TriggerClients(eventName, targets, ...)

-- Example: send the same data to three players
MSK.Events.TriggerClients('my_script:update', { 1, 4, 9 }, data)

-- Example: everyone on the job
local targets = {}

for _, player in ipairs(MSK.GetPlayers('job', 'police')) do
    targets[#targets + 1] = player.source
end

MSK.Events.TriggerClients('my_script:dispatch', targets, callData)
```

## MSK.Events.GetPlayersInRange

Returns the server ids of every player whose ped is within `radius` of `coords`. The position is read on the server, players without a ped are skipped.

**Parameters**  
**coords** - `vector3` - The center point  
**radius** - `number` - The radius in meters  

**Returns**  
**players** - `table` - List of server ids  

```lua
local players = MSK.Events.GetPlayersInRange(coords, radius)

-- Example
local players = MSK.Events.GetPlayersInRange(vector3(215.5, -810.2, 30.7), 50.0)
print(('%s players nearby'):format(#players))
```

## MSK.Events.TriggerClientsInRange

Sends an event to every player within `radius` of `coords`. When nobody is in range, nothing is sent.

**Parameters**  
**eventName** - `string` - The client event name  
**coords** - `vector3` - The center point  
**radius** - `number` - The radius in meters  
**...** - `any` - Optional - The arguments of the event  

**Returns**  
**targets** - `table` - The server ids of the players that received the event  

```lua
local targets = MSK.Events.TriggerClientsInRange(eventName, coords, radius, ...)

-- Example: play an explosion effect only for players close enough to see it
local targets = MSK.Events.TriggerClientsInRange('my_script:explosion', coords, 150.0, coords)
```
