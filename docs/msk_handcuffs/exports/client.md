---
title: Client
sidebar_position: 1
description: Client exports for msk_handcuffs v3 - status getters and action exports (cuffPlayer, uncuffPlayer, dragPlayer, ...) with full signatures.
keywords:
  - msk_handcuffs client exports
  - cuffPlayer
  - uncuffPlayer
  - dragPlayer
  - getIsHandcuffed
---

# Client Exports

The action exports run the same server-validated logic as the in-game items. Their
signatures are unchanged from v2.

`player` is an optional **local player index** (e.g. from `MSK.GetClosestPlayer()` or
`ESX.Game.GetClosestPlayer()`). When omitted, the closest player is used.

## Status getters

```lua
-- Self (or read the statebag directly)
local isHandcuffed   = exports.msk_handcuffs:getIsHandcuffed()      -- or LocalPlayer.state.isHandcuffed
local isHardcuffed   = exports.msk_handcuffs:getIsHardcuffed()      -- or LocalPlayer.state.isHardcuffed
local hasAnkletracker = exports.msk_handcuffs:getHasAnkletracker()  -- or LocalPlayer.state.hasAnkleTracker
local hasHeadbag     = exports.msk_handcuffs:getHasHeadbag()        -- or LocalPlayer.state.hasHeadbag
local hasTape        = exports.msk_handcuffs:getHasTape()           -- or LocalPlayer.state.hasTape

-- Other players (by statebag — recommended)
local isHandcuffed = Player(targetServerId).state.isHandcuffed
```

## cuffPlayer

**`cuffPlayer(item?, player?)`** — Cuff a player.
If `item` is `nil`, the script resolves it from `Config.RestrictItems` (per job) when enabled.

```lua
exports.msk_handcuffs:cuffPlayer()                       -- closest player, auto item
exports.msk_handcuffs:cuffPlayer('cuffs')                -- closest player, specific item
exports.msk_handcuffs:cuffPlayer(nil, closestPlayer)     -- specific player, auto item
exports.msk_handcuffs:cuffPlayer('cuffs', closestPlayer) -- specific player & item
```

## hardcuffPlayer

**`hardcuffPlayer(item?, player?)`** — Hardcuff a player (must be cuffed first).

```lua
exports.msk_handcuffs:hardcuffPlayer()
exports.msk_handcuffs:hardcuffPlayer('hardcuff', closestPlayer)
```

## uncuffPlayer

**`uncuffPlayer(item?, player?)`** — Uncuff a player. The uncuff item must match the cuff
item (`Config.ItemSettings`).

```lua
exports.msk_handcuffs:uncuffPlayer()
exports.msk_handcuffs:uncuffPlayer('cuff_keys', closestPlayer)
```

## ankleTrackerPlayer

**`ankleTrackerPlayer(player?, remove?)`** — Toggle an ankletracker (target must be cuffed).

```lua
exports.msk_handcuffs:ankleTrackerPlayer()
exports.msk_handcuffs:ankleTrackerPlayer(closestPlayer)
```

## headbagPlayer

**`headbagPlayer(player?, remove?)`** — Toggle a headbag.

```lua
exports.msk_handcuffs:headbagPlayer()
exports.msk_handcuffs:headbagPlayer(closestPlayer)
```

## tapePlayer

**`tapePlayer(player?, remove?)`** — Toggle tape (mute).

```lua
exports.msk_handcuffs:tapePlayer()
exports.msk_handcuffs:tapePlayer(closestPlayer)
```

## dragPlayer / escortPlayer

**`dragPlayer(player?)`** — Toggle dragging/escorting (target must be cuffed).
`escortPlayer` is an alias.

```lua
exports.msk_handcuffs:dragPlayer()
exports.msk_handcuffs:dragPlayer(closestPlayer)
```

## putPlayerInCar / putPlayerOutOfCar

```lua
exports.msk_handcuffs:putPlayerInCar()       -- closest player
exports.msk_handcuffs:putPlayerInCar(closestPlayer)
exports.msk_handcuffs:putPlayerOutOfCar(closestPlayer)
```

:::note Removed in v3
`getObjectState`, the self-cuff exports `Cuff` / `Hardcuff` / `Uncuff`, the client admin
exports and the aliases `gethasAnkletracker` / `gethasHeadbag` were removed. See
[Migration](../migration.md).
:::
