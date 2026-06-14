---
title: Installation
sidebar_position: 1
---

# Installation

## Steps

1. Drag & drop the `msk_vehiclekeys` folder into your resources directory.
2. Add `ensure msk_vehiclekeys` to your `server.cfg`.
3. Make sure all [dependencies](../index.md#requirements) start **before** `msk_vehiclekeys`.
4. Configure `config.lua`.
5. Set your framework at `Config.Framework` (or leave it on `AUTO`).
6. Set the hotkeys you want — players can rebind them in the FiveM keybind settings.
7. Add the **items** (`keys`, `keyring`, `contract`) to your inventory.
8. Enable or disable `uniqueItems` depending on your inventory.

:::info[Load order]
`oxmysql`, `ox_lib` and `msk_core` must be started before `msk_vehiclekeys`.
:::

## Database

Vehicle keys are stored in a MariaDB table (`msk_vehiclekeys_keys`). **The table is created
automatically on first start — no manual SQL import is required.**

:::info[Migration from older versions]
If you are updating from a version that used `vehiclekeys.json`, the keys are imported into
the database **automatically and only once** on the first start. The old `vehiclekeys.json`
file is no longer used afterwards and can be deleted.
:::

## Items

Add these items to your inventory (names can be changed in `config.lua`):

| Item | Config option | Purpose |
|---|---|---|
| `keys` | `Config.Settings.key.itemName` | The vehicle key item |
| `keyring` | `Config.KeyRingSystem.item` | Opens your keyring *(ox_inventory & jaksam_inventory only)* |
| `contract` | `Config.Settings.transfer.itemName` | Sell / transfer your vehicle to another player |

## ox_inventory

Add to `ox_inventory/data/items.lua`:

```lua title="/data/items.lua"
["keys"] = {
    label = "Vehicle Key",
    description = "Key for a Vehicle",
    weight = 35,
    stack = false,
    close = true,
    client = {
        export = 'msk_vehiclekeys.toggleLock'
    },
},
["contract"] = {
    label = "Contract",
    description = "Contract to sell your vehicle",
    weight = 10,
    stack = true,
    close = true,
    client = {
        export = 'msk_vehiclekeys.openDialog'
    },
},
["keyring"] = {
    label = "Vehicle Keyring",
    description = "Keyring for your Vehicle Keys",
    weight = 10,
    stack = false,
    close = false,
    consume = 0,
},
```

For the **Keyring System**, add to `ox_inventory/modules/items/containers.lua`:

```lua title="/modules/items/containers.lua"
setContainerProperties('keyring', {
    slots = 500,
    maxWeight = 100000,
    whitelist = { 'keys' }
})
```

## jaksam_inventory

Add the `keys`, `contract` and `keyring` items to your jaksam_inventory items list.

- The items **must** be set as **unique / metadata** items (the script writes the plate into
  the item's metadata).
- Mark `keys` and `contract` as **usable** so they can trigger the `toggleLock` / `openDialog`
  exports.

## Inventory Note

:::warning
Vehicle keys are **metadata-based unique items**. Only `ox_inventory` and `jaksam_inventory`
are supported. Support for `qs-inventory` and `core_inventory` was removed in **v2.0.0**.
:::
</content>
