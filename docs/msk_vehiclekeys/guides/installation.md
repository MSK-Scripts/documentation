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

MSK VehicleKeys doesn't need any SQL file. All vehicle keys are saved in `vehiclekeys.json`.

:::warning
Do NOT manually add or delete anything in `vehiclekeys.json`! It will be overwritten as the script saves data every 5 minutes and when the script stops.
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

## qs-inventory

Add to `qs-inventory/shared/items.lua`:

```lua
['keys'] = {
    ['name'] = 'keys',
    ['label'] = 'Vehicle Key',
    ['weight'] = 35,
    ['type'] = 'item',
    ['image'] = 'keys.png',
    ['unique'] = true,
    ['useable'] = true,
    ['shouldClose'] = true,
    ['combinable'] = nil,
    ['description'] = 'Key for a Vehicle'
},
['contract'] = {
    ['name'] = 'contract',
    ['label'] = 'Contract',
    ['weight'] = 1,
    ['type'] = 'item',
    ['image'] = 'contract.png',
    ['unique'] = false,
    ['useable'] = true,
    ['shouldClose'] = true,
    ['combinable'] = nil,
    ['description'] = 'Contract to sell your vehicle'
},
```
