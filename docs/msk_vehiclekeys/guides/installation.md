---
title: Installation
sidebar_position: 1
---

# Installation

1. Drag & Drop the folder `msk_vehiclekeys` into your resource folder
2. Add `ensure msk_vehiclekeys` to your `server.cfg`
3. Configure the `config.lua`
4. Set your Framework at `Config.Framework`
5. Set the Hotkeys you want _(Users can change them in FiveM keybind settings)_
6. Add the **itemName** from `Config.Settings` to your inventory or database
7. Activate or deactivate `uniqueItems` if you use one of the supported inventories

Vehicle keys are stored in a MariaDB table (`msk_vehiclekeys_keys`). The table is created automatically on first start — **no manual SQL import is required**.

:::info[Migration from older versions]
If you are updating from a version that used `vehiclekeys.json`, the keys are imported into the database **automatically and only once** on the first start. The old `vehiclekeys.json` file is no longer used afterwards and can be deleted.
:::

## Items

Add these items to your inventory or database (names can be changed in `config.lua`):

- `keys` — The Vehicle Key Item
- `keyring` — Opens your Keyring _(ox_inventory and jaksam_inventory only)_
- `contract` — Sell your vehicle to another player

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

Add to `ox_inventory/modules/items/containers.lua`:

```lua title="/modules/items/containers.lua"
setContainerProperties('keyring', {
    slots = 500,
    maxWeight = 100000,
    whitelist = { 'keys' }
})
```

## jaksam_inventory

Add the `keys`, `contract` and `keyring` items to your jaksam_inventory items list.
The items must be set as **unique / metadata** items (the script writes the plate into
the item's metadata). Mark `keys` and `contract` as usable so they can trigger the
`toggleLock` / `openDialog` exports.

:::warning
Only `ox_inventory` and `jaksam_inventory` are supported. Support for `qs-inventory`
and `core_inventory` was removed in v2.0.0.
:::
