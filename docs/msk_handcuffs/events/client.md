---
title: Client
sidebar_position: 1
description: Client-triggered server events for msk_handcuffs v3 - requestDrag, requestPutInCar, requestOutOfCar. All server-validated.
keywords:
  - msk_handcuffs client events
  - requestDrag
  - requestPutInCar
  - requestOutOfCar
---

# Client Events

These are triggered from the **client** and validated on the **server** (distance, target
status). For most integrations the [client exports](../exports/client.md)
(`dragPlayer`, `putPlayerInCar`, `putPlayerOutOfCar`) are the cleaner choice.

:::info
`targetId` is always the **server id** of the target player.
:::

## Drag / Escort

Toggle dragging the target (the target must be cuffed).

```lua
TriggerServerEvent('msk_handcuffs:requestDrag', targetId)

-- Example
TriggerServerEvent('msk_handcuffs:requestDrag', GetPlayerServerId(closestPlayer))

-- Recommended export equivalent:
exports.msk_handcuffs:dragPlayer(closestPlayer)
```

## Put player in a car

The target must be cuffed.

```lua
TriggerServerEvent('msk_handcuffs:requestPutInCar', targetId)

-- Recommended export equivalent:
exports.msk_handcuffs:putPlayerInCar(closestPlayer)
```

## Put player out of a car

```lua
TriggerServerEvent('msk_handcuffs:requestOutOfCar', targetId)

-- Recommended export equivalent:
exports.msk_handcuffs:putPlayerOutOfCar(closestPlayer)
```

## Restore status (relog / multichar)

Ask the server to (re)send and re-apply the player's stored status. Normally fired
automatically; only needed manually on multichar scripts that don't emit a standard
playerLoaded event. See the [Multichar guide](../guides/multichar.md).

```lua
TriggerServerEvent('msk_handcuffs:requestRestore')
```
