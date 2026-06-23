---
title: Items (ox_inventory / qb-inventory)
sidebar_position: 5
description: Item definitions for msk_handcuffs - ready-to-paste ox_inventory entries plus a note for qb-inventory / ESX item registration.
keywords:
  - msk_handcuffs items
  - ox_inventory items
  - qb-inventory items
  - cuffs cable_ties hardcuff
---

# Items

msk_handcuffs uses regular inventory items. Add them to whichever inventory you run.
The default item names are `cuffs`, `cable_ties`, `hardcuff`, `cuff_keys`, `scissors`,
`ankletracker`, `headbag`, `tape` (plus the optional `*_key` remove items).

## ox_inventory

Add the following items to `ox_inventory/data/items.lua`:

```lua
["cuffs"] = {
    label = "Handcuffs",
    weight = 180,
    stack = true,
    close = true,
    description = "Easily restrains a person",
},
["hardcuff"] = {
    label = "Hardcuffs",
    weight = 200,
    stack = true,
    close = true,
    description = "Strongly restrains a person",
},
["cuff_keys"] = {
    label = "Handcuffkey",
    weight = 10,
    stack = true,
    close = true,
    description = "Removes handcuffs from a person",
},
["cable_ties"] = {
    label = "Cable Ties",
    weight = 30,
    stack = true,
    close = true,
    description = "Easily restrains a person",
},
["scissors"] = {
    label = "Scissors",
    weight = 10,
    stack = true,
    close = true,
    description = "Removes cable ties from a person",
},
["ankletracker"] = {
    label = "Ankletracker",
    weight = 300,
    stack = true,
    close = true,
    description = "Places an electronic ankle tracker on a person",
},
["headbag"] = {
    label = "Headbag",
    weight = 180,
    stack = true,
    close = true,
    description = "The bag blinds a person",
},
["tape"] = {
    label = "Tape",
    weight = 10,
    stack = true,
    close = true,
    description = "The tape seals a person's mouth, silencing them",
},
```

## qb-inventory / QBCore

For QBCore add the items to `qb-core/shared/items.lua` (or your inventory's items file)
using that inventory's format, for example:

```lua
cuffs        = { name = 'cuffs',        label = 'Handcuffs',   weight = 180, type = 'item', image = 'cuffs.png',        unique = false, useable = true, shouldClose = true, description = 'Easily restrains a person' },
cable_ties   = { name = 'cable_ties',   label = 'Cable Ties',  weight = 30,  type = 'item', image = 'cable_ties.png',   unique = false, useable = true, shouldClose = true, description = 'Easily restrains a person' },
hardcuff     = { name = 'hardcuff',     label = 'Hardcuffs',   weight = 200, type = 'item', image = 'hardcuff.png',     unique = false, useable = true, shouldClose = true, description = 'Strongly restrains a person' },
cuff_keys    = { name = 'cuff_keys',    label = 'Handcuff Key',weight = 10,  type = 'item', image = 'cuff_keys.png',    unique = false, useable = true, shouldClose = true, description = 'Removes handcuffs' },
scissors     = { name = 'scissors',     label = 'Scissors',    weight = 10,  type = 'item', image = 'scissors.png',     unique = false, useable = true, shouldClose = true, description = 'Removes cable ties' },
ankletracker = { name = 'ankletracker', label = 'Ankletracker',weight = 300, type = 'item', image = 'ankletracker.png', unique = false, useable = true, shouldClose = true, description = 'Electronic ankle tracker' },
headbag      = { name = 'headbag',      label = 'Headbag',     weight = 180, type = 'item', image = 'headbag.png',      unique = false, useable = true, shouldClose = true, description = 'Blinds a person' },
tape         = { name = 'tape',         label = 'Tape',        weight = 10,  type = 'item', image = 'tape.png',         unique = false, useable = true, shouldClose = true, description = 'Silences a person' },
```

:::tip
Make sure `useable = true` so the items trigger msk_handcuffs. Item images are included in
the resource's `inventory_images` folder.
:::
