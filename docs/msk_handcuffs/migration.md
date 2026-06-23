---
title: Migration from v2
sidebar_position: 10
description: What changed between msk_handcuffs v2 and v3 - renamed and removed exports, events and callbacks, plus drop-in replacements for integrators.
keywords:
  - msk_handcuffs migration
  - v2 to v3
  - removed exports
  - renamed events
  - breaking changes
---

# Migration from v2

v3 keeps the **commonly used exports** identical. Some internals changed because the
architecture moved to server-authoritative logic, MySQL and statebags.

## ✅ Unchanged (drop-in)

**Client exports:** `getIsHandcuffed`, `getIsHardcuffed`, `getHasAnkletracker`,
`getHasHeadbag`, `getHasTape`, `cuffPlayer(item, player)`, `hardcuffPlayer(item, player)`,
`uncuffPlayer(item, player)`, `ankleTrackerPlayer(player)`, `headbagPlayer(player)`,
`tapePlayer(player)`, `dragPlayer(player)`, `escortPlayer(player)`,
`putPlayerInCar(player)`, `putPlayerOutOfCar(player)`

**Server exports:** `getIsPlayerHandcuffed`, `getIsPlayerHardcuffed`,
`gethasPlayerAnkleTracker`, `gethasPlayerHeadbag`, `gethasPlayerTape`

**Event handler:** `msk_handcuffs:handler` (same signature)

## ♻️ Renamed events

| v2 | v3 | Notes |
|---|---|---|
| `TriggerClientEvent('msk_handcuffs:cuff', src, item, player)` | `TriggerClientEvent('msk_handcuffs:useItem', src, 'cuff', item)` | server → client trigger |
| `…:hardcuff` / `:uncuff` | `:useItem` with `'hardcuff'` / `'uncuff'` | |
| `…:setAnkletracker` / `:setHeadbag` / `:setTape` | `:useItem` with `'ankletracker'` / `'headbag'` / `'tape'` | |
| `TriggerServerEvent('msk_handcuffs:setDrag', targetId)` | `TriggerServerEvent('msk_handcuffs:requestDrag', targetId)` | now distance-validated |
| `…:putInCar` | `…:requestPutInCar` | |
| `…:outOfCar` | `…:requestOutOfCar` | |
| `msk_handcuffs:setCuffStatus` (relog restore) | `msk_handcuffs:requestRestore` (client → server) | see [Multichar guide](./guides/multichar.md) |

:::tip
The cleanest integration is via the **[exports](./exports/client.md)** (`dragPlayer`,
`putPlayerInCar`, …). Prefer them over the raw events.
:::

## ❌ Removed

| Removed | Reason / replacement |
|---|---|
| Server exports `cuffAdmin`, `hardcuffAdmin`, `uncuffAdmin`, `ankleTrackAdmin`, `headbagAdmin`, `tapeAdmin` | Admin actions are server-authoritative; use the [admin commands](./commands.md) |
| Client exports `cuffPlayerAdmin`, `hardcuffPlayerAdmin`, `uncuffPlayerAdmin`, `ankleTrackerAdmin` | same as above |
| Client exports/events `Cuff`, `Hardcuff`, `Uncuff` (self) | These were the unvalidated self-uncuff exploit path |
| Server exports `getDatabase`, `getPlayerFromDatabase` | No flat file anymore — read [statebags](./statebags.md) or the status exports |
| Client export `getObjectState` | Props are managed internally |
| Aliases `gethasAnkletracker`, `gethasHeadbag` | Use `getHasAnkletracker` / `getHasHeadbag` |
| Server callbacks `MSK.Register('msk_handcuffs:getIsHandcuffed' / … / 'canUncuff')` | Status is now readable directly via [statebags](./statebags.md) |

## Status reads — old vs new

```lua
-- v2 (callback)
local isCuffed = MSK.Trigger('msk_handcuffs:getIsHandcuffed', {source = targetId})

-- v3 (statebag — no callback needed)
local isCuffed = Player(targetId).state.isHandcuffed
-- or the export
local isCuffed = exports.msk_handcuffs:getIsPlayerHandcuffed({source = targetId})
```

:::note[Need the old names back?]
If other resources depend on a removed export/event, a thin compatibility layer can map the
old names onto the new logic. Open an issue / ask in the MSK Scripts Discord.
:::
