---
title: Frameworks & Bridge
sidebar_position: 4
---

# Frameworks & Bridge

`msk_core` ships a **bridge** that hides the differences between frameworks and inventories. You write your script against the `MSK.*` API, and the bridge maps it onto whatever the server is running.

Since **v4.0.0** framework and inventory are two independent axes. No framework branch carries item code, and no inventory adapter carries framework code.

## Supported frameworks

| Framework | Resource | Support |
|---|---|---|
| **Qbox** | `qbx_core` | ✅ Fully maintained |
| **ESX** (1.9.2+) | `es_extended` | ✅ Fully maintained |
| **QBCore** | `qb-core` | ✅ Fully maintained |
| **STANDALONE** | none | ✅ No framework required |

Set the framework in [`config.lua`](./configuration.md):

```lua
Config.Framework = 'AUTO' -- AUTO, ESX, QBCore, Qbox, STANDALONE
```

:::danger[ox_core was removed in v4.0.0]
The `ox_core` branch never carried a guarantee and was never finished, its `GetPlayerData` was an empty function. `Config.Framework = 'OXCore'` now stops the resource with an explicit message instead of failing somewhere later. Change it to `AUTO` or to a supported framework.
:::

### AUTO detection

With `AUTO` the bridge asks for each framework under **its own resource name**, and it asks for Qbox first:

1. `qbx_core` → **Qbox**
2. `es_extended` → **ESX**
3. `qb-core` → **QBCore**
4. otherwise → **STANDALONE**

The detected framework is printed to the console on start.

:::info[Why Qbox is checked first]
`qbx_core/fxmanifest.lua` declares `provide 'qb-core'`, so `GetResourceState('qb-core')` does not report `missing` on a Qbox server. Asking for `qb-core` first therefore pushed **every** Qbox server into the QBCore branch and through its compatibility layer, which cannot represent Qbox multijob (`PlayerData.jobs`) at all.

A `provide` hit is a fallback, never a detection. FiveM changed how provided names answer resource-state lookups twice during 2026, and for two weeks `GetResourceState` returned `missing` for a provided name without a single line of script code having changed.
:::

:::warning[Start order]
Your framework resource must start **before** `msk_core`. If ESX or QBCore is detected but its shared/core object cannot be loaded, `msk_core` stops on boot with an error that says exactly that.
:::

### STANDALONE mode

In STANDALONE no framework bridge is loaded. The generic utilities (math, string, table, vector, timeout, callbacks, cron, ace, commands, UI, webhooks, world and entity helpers, …) all work. Functions that depend on a framework by nature (player getters, jobs, society and offline bank money, item checks, the vehicle store) are **not** available. Each affected function notes this on its page.

## Inventory bridge

```lua
Config.Inventory = 'AUTO'
```

With `AUTO` the inventory is detected in this order:

1. `ox_inventory`
2. `core_inventory`
3. `jaksam_inventory`
4. `default`

| Value | Notes |
|---|---|
| `ox_inventory` | ✅ Fully maintained |
| `jaksam_inventory` | ✅ Fully maintained |
| `core_inventory` | ⚠️ Secondary |
| `default` | The inventory built into the running framework (ESX default / Chezza, QBCore, Qbox) |
| `custom` | Your own functions in `inventories/server/custom.lua` |

`default` is a real adapter since v4.0.0, with a branch per framework, and no longer a set of functions glued onto the player object afterwards.

:::warning[Qbox has no `default` inventory]
Qbox ships `ox_inventory`. If the framework is Qbox and the inventory resolves to `default`, msk_core says so on start, and the item functions stay unavailable until `ox_inventory` runs.
:::

See [Inventory](./functions/server/inventory.md) for the item functions.

## Accessing bridge data

`MSK.Bridge` is a **real table in your resource** since v4.0.0. It used to fall through to the generic export proxy and become a function, so the widely copied line `if MSK.Bridge and MSK.Bridge.Framework and MSK.Bridge.Framework.Type then` passed its first check and then raised `attempt to index a function value`.

```lua
MSK.Bridge.Framework.Type   -- 'ESX' | 'QBCore' | 'Qbox' | 'STANDALONE'
MSK.Bridge.Framework.Events -- the event names, see below
MSK.Bridge.Inventory        -- resolved inventory name

-- Client only, resolved on access, never a snapshot from resource start
MSK.Bridge.PlayerData       -- the unified player table
MSK.Bridge.isPlayerLoaded   -- boolean

-- Server only, inside msk_core
MSK.LoadedPlayers           -- playerId -> player table
```

:::note[`MSK.Bridge.Framework.Core` only exists inside msk_core]
The raw framework object (`ESX`, `QBCore`, `exports.qbx_core`) is not handed across the export boundary. If you need the framework directly, fetch it yourself in your resource. Everything the bridge covers is reachable through `MSK.*` without it.
:::

## Framework events

The bridge normalises the login, logout, job, gang and duty events of every framework into resource-independent names, so your scripts need no framework-specific listeners:

```lua
MSK.Bridge.Framework.Events = {
    setPlayerData = 'msk_core:setPlayerData',
    playerLoaded  = 'msk_core:playerLoaded',
    playerLogout  = 'msk_core:playerLogout',
    setJob        = 'msk_core:setJob',
    setGang       = 'msk_core:setGang',   -- new in 4.0.0
    setDuty       = 'msk_core:setDuty',   -- new in 4.0.0
}
```

The names are API and stay the same. Their **arguments changed in 4.0.0**: every payload is the unified player or job shape now, never the raw framework object.

**Server**

```lua
AddEventHandler('msk_core:playerLoaded', function(playerId, player) end)
AddEventHandler('msk_core:playerLogout', function(playerId) end)
AddEventHandler('msk_core:setJob', function(playerId, job, lastJob) end)
AddEventHandler('msk_core:setGang', function(playerId, gang, lastGang) end)
AddEventHandler('msk_core:setDuty', function(playerId, onDuty, job) end)
```

**Client**

```lua
AddEventHandler('msk_core:playerLoaded', function(player) end)
AddEventHandler('msk_core:playerLogout', function() end)
AddEventHandler('msk_core:setJob', function(job, lastJob) end)
AddEventHandler('msk_core:setGang', function(gang, lastGang) end)
AddEventHandler('msk_core:setDuty', function(onDuty, job) end)
AddEventHandler('msk_core:setPlayerData', function(player) end)
```

:::danger[These events did not fire before v4.0.0]
The handlers existed on both sides, but nothing in msk_core ever triggered them and no framework event was ever bound to them. `MSK.LoadedPlayers` stayed empty on every framework, and anything waiting for `msk_core:playerLoaded` waited forever.
:::

For the player access helpers built on top of the bridge, see [Player](./functions/server/player.md).
