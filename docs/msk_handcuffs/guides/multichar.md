---
title: Multichar
sidebar_position: 4
description: Fix for multichar scripts that don't emit a standard playerLoaded event - manually trigger the msk_handcuffs restore so stored status is re-applied after character select.
keywords:
  - msk_handcuffs multichar
  - requestRestore
  - playerLoaded
  - relog status
---

# Multichar

After a character is selected, msk_handcuffs restores the stored status (cuffed,
ankletracker, …) by reacting to the framework's `playerLoaded` event and requesting its
snapshot from the server.

Some multichar scripts don't emit a standard `esx:playerLoaded` /
`QBCore:Client:OnPlayerLoaded` event. In that case the client never asks the server to
restore, and the player appears uncuffed after relog.

## Fix

Trigger the restore request **on the client** after the character was selected and the
player is fully loaded:

```lua
-- Clientside, after character selection
TriggerServerEvent('msk_handcuffs:requestRestore')
```

The server then re-applies the stored status (statebags, timer, ankletracker, mute) and
sends the authoritative snapshot back to the client.

:::note What changed from v2
v2 used `msk_handcuffs:setCuffStatus` and read from `database.json`. v3 stores status in
MySQL and uses `msk_handcuffs:requestRestore`. See [Migration](../migration.md).
:::
