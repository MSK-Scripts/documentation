---
title: Frameworks & Bridge
sidebar_position: 4
---

# Frameworks & Bridge

`msk_core` ships a **bridge** that abstracts the differences between frameworks and inventories. You write your script against the `MSK.*` API and the bridge maps it to whatever the server is running.

## Supported frameworks

| Framework | Support |
|---|---|
| **ESX** (1.9.2+) | ✅ Fully maintained |
| **QBCore** | ✅ Fully maintained |
| **ox_core** | ⚠️ Best effort |
| **STANDALONE** | ✅ No framework required |

Set the framework in [`config.lua`](./configuration.md):

```lua
Config.Framework = 'AUTO' -- AUTO, ESX, QBCore, STANDALONE
```

### AUTO detection

With `AUTO`, the bridge checks the resource states in this order and picks the first one found:

1. `es_extended` → **ESX**
2. `qb-core` → **QBCore**
3. `ox_core` → **OXCore**
4. otherwise → **STANDALONE**

The detected framework is printed to the console on start.

:::warning
Your framework resource must start **before** `msk_core`. If ESX/QBCore is detected but its shared/core object can't be loaded, `msk_core` throws an explanatory error on boot.
:::

### STANDALONE mode

In STANDALONE no framework bridge is loaded. The generic utilities (math, string, table, vector, timeout, callbacks, cron, ace, commands, UI, webhooks, world/entity helpers, …) all work. Functions that inherently depend on a framework — player getters, jobs, society/offline bank money, inventory item checks — are **not** available. Each affected function notes this on its page.

## Inventory bridge

```lua
Config.Inventory = 'AUTO'
```

With `AUTO`, the inventory is detected in this order:

1. `ox_inventory`
2. `core_inventory`
3. `jaksam_inventory`
4. `default` (ESX default / Chezza)

| Value | Notes |
|---|---|
| `ox_inventory` | ✅ Fully maintained |
| `jaksam_inventory` | ✅ Fully maintained |
| `core_inventory` | ⚠️ Secondary |
| `default` | ESX default / Chezza inventory |
| `custom` | Your own functions in `inventories/server/custom.lua` |

See [Inventory](./functions/server/inventory.md) for the item functions.

## Accessing bridge data

The bridge exposes some state on the `MSK.Bridge` table:

```lua
MSK.Bridge.Framework.Type   -- 'ESX' | 'QBCore' | 'OXCore' | 'STANDALONE'
MSK.Bridge.Framework.Core   -- The raw framework object (ESX / QBCore / Ox)
MSK.Bridge.Inventory        -- Resolved inventory name

-- Client only
MSK.Bridge.isPlayerLoaded   -- boolean, true once the player is fully loaded
MSK.Bridge.PlayerData       -- the framework player data table

-- Server only
MSK.LoadedPlayers           -- list of currently loaded framework players
```

## Framework events

The bridge normalizes framework login/logout/job events into resource-independent event names so your scripts don't need framework-specific listeners:

```lua
MSK.Bridge.Framework.Events = {
    setPlayerData = 'msk_core:setPlayerData',
    playerLoaded  = 'msk_core:playerLoaded',
    playerLogout  = 'msk_core:playerLogout',
    setJob        = 'msk_core:setJob',
}
```

For player access helpers built on top of the bridge, see [Player](./functions/server/player.md).
