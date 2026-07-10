---
title: Statebags
sidebar_position: 6
description: msk_handcuffs v3 replicates handcuff status through player statebags - the canonical, server-set source of truth readable by any resource on client and server.
keywords:
  - msk_handcuffs statebags
  - statebag
  - isHandcuffed
  - cuffed ox_inventory
  - fivem state bag
---

# Statebags

In v3 the handcuff status is replicated through **player statebags**. The server is the
only writer; clients and other resources only read them. This is the recommended way to
check status — no export call or callback needed.

## Keys

| Statebag key | Type | Meaning |
|---|---|---|
| `isHandcuffed` | boolean | Player is cuffed |
| `isHardcuffed` | boolean | Player is hardcuffed (can't move) |
| `cuffItem` | string \| false | The item the player was cuffed with |
| `hasAnkleTracker` | boolean | Player wears an ankletracker |
| `hasHeadbag` | boolean | Player has a headbag (blackscreen) |
| `hasTape` | boolean | Player is taped (muted) |
| `cuffed` | boolean | Mirror of `isHandcuffed` — read by **ox_inventory** to block the inventory |

## Reading on the client

```lua
-- Local player
local isCuffed = LocalPlayer.state.isHandcuffed

-- Any player by server id
local isCuffed = Player(targetServerId).state.isHandcuffed

-- Via msk_core mirror
local isCuffed = MSK.Player[targetServerId].state.isHandcuffed
```

## Reading on the server

```lua
local isCuffed = Player(playerServerId).state.isHandcuffed
local cuffItem = Player(playerServerId).state.cuffItem
```

## Reacting to changes

Because the keys are real statebags you can subscribe with a change handler:

```lua
AddStateBagChangeHandler('isHandcuffed', nil, function(bagName, key, value)
    local ply = GetPlayerFromStateBagName(bagName)
    if ply == 0 then return end
    -- value is true/false
end)
```

:::info[Security note]
Statebags are the **transport / read layer**. Security-relevant decisions (can this player
be hardcuffed? is the target really cuffed?) are made by the server against its own
authoritative state, not against a client-written statebag.
:::
