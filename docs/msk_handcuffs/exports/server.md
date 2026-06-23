---
title: Server
sidebar_position: 2
description: Server exports for msk_handcuffs v3 - status getters by source, identifier or player object, with statebag alternatives.
keywords:
  - msk_handcuffs server exports
  - getIsPlayerHandcuffed
  - gethasPlayerAnkleTracker
---

# Server Exports

All status getters accept a `player` table identifying the player:

```lua
{source = playerId}            -- server id
{identifier = playerIdentifier} -- ESX license / QBCore citizenid
{player = xPlayer}             -- a framework player object
```

## getIsPlayerHandcuffed

**Returns** `boolean | string` — `false`, the `cuffItem` string, or `'isAdminCuffed'`.

```lua
local state = exports.msk_handcuffs:getIsPlayerHandcuffed({source = playerId})
local state = exports.msk_handcuffs:getIsPlayerHandcuffed({identifier = playerIdentifier})

-- Alternative (statebag):
local isCuffed = Player(playerId).state.isHandcuffed
```

## getIsPlayerHardcuffed

```lua
local state = exports.msk_handcuffs:getIsPlayerHardcuffed({source = playerId})
-- Alternative:
local isHardcuffed = Player(playerId).state.isHardcuffed
```

## gethasPlayerAnkleTracker

```lua
local hasAnkletracker = exports.msk_handcuffs:gethasPlayerAnkleTracker({source = playerId})
-- Alternative:
local hasAnkletracker = Player(playerId).state.hasAnkleTracker
```

## gethasPlayerHeadbag

```lua
local hasHeadbag = exports.msk_handcuffs:gethasPlayerHeadbag({source = playerId})
-- Alternative:
local hasHeadbag = Player(playerId).state.hasHeadbag
```

## gethasPlayerTape

```lua
local hasTape = exports.msk_handcuffs:gethasPlayerTape({source = playerId})
-- Alternative:
local hasTape = Player(playerId).state.hasTape
```

:::note[Removed in v3]
`getDatabase`, `getPlayerFromDatabase` and the admin exports (`cuffAdmin`, `uncuffAdmin`, …)
were removed. Use [statebags](../statebags.md), the getters above, or the
[admin commands](../commands.md). See [Migration](../migration.md).
:::
