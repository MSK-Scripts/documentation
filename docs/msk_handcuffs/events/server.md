---
title: Server
sidebar_position: 2
description: Server-to-client trigger events for msk_handcuffs v3 - the unified msk_handcuffs:useItem event to start an action on a player's client.
keywords:
  - msk_handcuffs server events
  - useItem
  - trigger cuff from server
---

# Server Events

To start an action on a player from a **server** script, trigger `useItem` on their client.
The client then runs the interaction UX (closest player, animation) and sends a
server-validated request.

## `msk_handcuffs:useItem`

**Signature**
`TriggerClientEvent('msk_handcuffs:useItem', source, action, payload)`

| Param | Type | Description |
|---|---|---|
| `source` | number | Server id of the **officer** (the acting player) |
| `action` | string | `'cuff'`, `'hardcuff'`, `'uncuff'`, `'ankletracker'`, `'headbag'`, `'tape'` |
| `payload` | string \| boolean | For cuff actions: the item. For ankletracker/headbag/tape: `true` to force removal |

```lua
-- Cuff the closest player (auto item from job/restrictions)
TriggerClientEvent('msk_handcuffs:useItem', source, 'cuff')

-- Cuff with a specific item
TriggerClientEvent('msk_handcuffs:useItem', source, 'cuff', 'cuffs')

-- Uncuff
TriggerClientEvent('msk_handcuffs:useItem', source, 'uncuff', 'cuff_keys')

-- Toggle ankletracker / headbag / tape
TriggerClientEvent('msk_handcuffs:useItem', source, 'ankletracker')
TriggerClientEvent('msk_handcuffs:useItem', source, 'headbag')
TriggerClientEvent('msk_handcuffs:useItem', source, 'tape')
```

:::tip
`useItem` always acts on the **closest player** to `source`. To target a specific player
from the client, use the [client exports](../exports/client.md) with a player argument.
:::

:::note[Migrating from v2]
This single event replaces the old `msk_handcuffs:cuff` / `:hardcuff` / `:uncuff` /
`:setAnkletracker` / `:setHeadbag` / `:setTape` events. See [Migration](../migration.md).
:::
