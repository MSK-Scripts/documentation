---
title: Config
sidebar_position: 2
---

# Config

Everything is configured in `config.lua`. Below is the full file followed by an
explanation of each section.

## General

```lua
Config.Locale = 'de'          -- Language key, see translation.lua ('de', 'en')
Config.Debug = true           -- Enables debug prints
Config.VersionChecker = true  -- Checks for a new version on start

-- Supported Frameworks: AUTO, ESX, QBCore
-- AUTO detects the framework you are using automatically.
Config.Framework = 'AUTO'
```

### Notification

`Config.Notification` runs **both client- and serverside**. By default it forwards to
`MSK.Notification`. Adjust it here if you want to use your own notification system.

```lua
Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then -- serverside
        MSK.Notification(source, 'Vehicle Keys', message, typ, 5000)
    else -- clientside
        MSK.Notification('Vehicle Keys', message, typ, 5000)
    end
end
```

## Commands & Hotkeys

```lua
Config.Commands = {
    -- If a command is set to enable = false, the matching hotkey won't work either!
    lock = {enable = true, command = 'lock'},
    keyMenu = {enable = true, command = 'keyMenu'},

    -- Command for players to refresh their owned vehicles (adds missing permanent keys)
    refreshKeys = {enable = true, command = 'refreshKeys'}
}

Config.Hotkeys = {
    lock = {enable = true, key = 'L'},
    keyMenu = {enable = true, key = 'U'},
}
```

| Option | Description |
|---|---|
| `lock` | (Un)lock the closest vehicle |
| `keyMenu` | Open the keys menu |
| `refreshKeys` | Re-add missing permanent keys for owned vehicles |

:::warning
The hotkey of a command only works while the corresponding command is `enable = true`.
Players can rebind the hotkeys in the FiveM keybind settings.
:::

See **[Commands & Keybinds](commands.md)** for the full list.

## Vehicle Target

```lua
Config.VehicleTarget = {
    enable = true,    -- (Un)lock a vehicle using a target system
    selectSeat = true, -- Allow the player to choose which seat to enter

    -- Supported Target: ox_target
    -- You can add your own target in client/target.lua
    script = 'ox_target'
}
```

## Admin Command

Works with **Ace Permissions** (`add_ace group.? command.? allow`). Admins in one of the
configured groups can (un)lock any vehicle without owning a key.

```lua
Config.AdminCommand = {
    enable = true,
    command = 'adlock',
    groups = {'superadmin', 'admin'}
}
```

## OnRefreshKeys

Controls whether the **key item** is given to the player when keys are refreshed. The keys
themselves are always refreshed internally — these options only decide if the *physical
item* is handed out.

```lua
Config.OnRefreshKeys = {
    OnPlayerLoaded = {
        primaryKeys = false,   -- Recommended true if givePrimaryKey/transferOwnership is false
        secondaryKeys = false, -- For realism, recommended false
    },
    OnRefreshKeys = {
        primaryKeys = false,   -- For realism, recommended false
        secondaryKeys = false, -- For realism, recommended false
    },
}
```

:::tip
For realism, keep all options on `false`. Keys are refreshed internally either way; the
player just won't receive a fresh item.
:::

## Give Primary Key

Defines what happens when a player gives their **primary key** to another player.
**`ox_inventory` and `jaksam_inventory` only.**

```lua
Config.GivePrimaryKey = {
    -- Do NOT use all 4 options together!
    -- If giveSecondaryKey = true the last 3 options are ignored.

    giveSecondaryKey = true,  -- The other player receives a secondary key
    givePrimaryKey = false,   -- The other player receives the primary key
    removePrimaryKey = false, -- The giver's primary key is removed
    transferOwnership = false, -- The other player becomes the owner of the vehicle
}
```

:::warning
If `transferOwnership = true`, the primary key is **always** removed from the giver.
Pick **one** strategy — either `giveSecondaryKey`, or a combination of the lower three.
:::

## Keyring System

Stores all of a player's keys in a second inventory. **`ox_inventory` and
`jaksam_inventory` only.** See the [Installation guide](guides/installation.md#ox_inventory)
for the required item & container setup.

```lua
Config.KeyRingSystem = {
    enable = true,
    addItem = true,    -- Give the keyring item on join if the player doesn't have it yet
    item = 'keyring',  -- Must match the item name in ox_inventory/data/items.lua
}
```

## Settings

```lua
Config.Settings = {
    lockDistance = 8.0,          -- Max distance to (un)lock a vehicle
    exchangeLocksPrice = 5000,   -- Price for exchanging the vehicle locks
    transferVehicle = true,      -- Allow transferring a vehicle to another player

    lockVehiclesFromNPCs = {
        enable = true,   -- true = NPC vehicles are locked
        probability = 25 -- Chance (%) a vehicle is open. 0 = always locked
    },
    ...
}
```

| Option | Description |
|---|---|
| `lockDistance` | Maximum distance (in meters) to (un)lock a vehicle |
| `exchangeLocksPrice` | Price charged when exchanging the vehicle locks |
| `transferVehicle` | Allow transferring a vehicle (and ownership) to another player |
| `lockVehiclesFromNPCs.enable` | Lock NPC-spawned vehicles |
| `lockVehiclesFromNPCs.probability` | Probability (%) an NPC vehicle is unlocked — `0` = always locked |

### menu

```lua
menu = {
    showSecondaryKeys = true,   -- Show secondary keys in the keys menu
    showTempKeys = true,        -- Show temporary keys in the keys menu
    showExchangeLocks = true,   -- Show "Exchange Vehicle Locks" in the menu
    showTransferVehicle = true, -- Show "Transfer Vehicle" in the menu
    refreshPlayerKeys = true,   -- Refresh keys when opening the keys menu

    -- Supported Menus: ox_context, ox_menu
    -- You can add your own menu in client/menu.lua
    keysMenu = 'ox_context'
},
```

### key

```lua
key = {
    needItem = true,    -- Require the key item to (un)lock (always true with uniqueItems)
    canUseItem = true,  -- Register the item as usable
    itemName = 'keys',

    -- Metadata-based inventories only (ox_inventory, jaksam_inventory)
    -- uniqueItems is always treated as true for these inventories
    uniqueItems = true,
    inventory = 'ox_inventory',
    itemLabel = 'Vehicle Key',
    plateLabel = 'Plate: %s',

    -- uniqueItems ONLY:
    -- Allows a player holding a key item to (un)lock the vehicle even without an internal key.
    -- Example: Player A steals Player B's key -> Player A can (un)lock the vehicle.
    toggleWithKey = true,
},
```

### transfer

```lua
transfer = {
    -- When using the item, the target player and the vehicle must be next to you!
    needItem = true,   -- Require an item to transfer the vehicle
    canUseItem = true, -- Register the item as usable
    itemName = 'contract',
},
```

### animation

```lua
animation = {
    dict = "anim@mp_player_intmenu@key_fob@",
    anim = "fob_click_fp",
    prop = `lr_prop_carkey_fob`, -- Use backticks `` and NOT '' or ""
},
```

## TextUI

Used when `Config.Locksmith.defaultTextUI = false`. Replace with your own TextUI resource.

```lua
Config.openTextUI = function(coloredText, uncoloredText)
    exports['okokTextUI']:Open(uncoloredText, 'darkblue', 'left')
end

Config.closeTextUI = function()
    exports['okokTextUI']:Close()
end
```

## Locksmith

The locksmith service is used to **exchange vehicle locks**. Even if disabled, the
`ExchangeVehicleLocks` export still works.

```lua
Config.Locksmith = {
    enable = true,         -- Set false to disable the locksmith peds/blips
    defaultTextUI = true,  -- false = use the Config.openTextUI function instead

    -- Supported Menus: ox_context, ox_menu
    menu = 'ox_context',

    targetSystem = {
        enable = true,     -- true = open via target (no HelpNotify / TextUI)
        script = 'ox_target'
    },

    npcVoice = {
        enable = true,
        inRange = 5.0,
        outRange = 5.0
    },

    locations = {
        ['locksmith'] = {
            label = 'Locksmith Service',
            pedmodel = `s_m_m_autoshop_01`,
            blip = {enable = true, label = 'Locksmith Service', id = 134, scale = 1.0, color = 0},
            coords = {
                vector4(170.02, -1799.55, 29.32, 318.5),
            }
        },
        -- ['lsc'] and ['benny'] locations are also included by default
    }
}
```

## Whitelist & Blacklist

Plates can be either an **exact plate** or just a **substring** that should be contained in
the plate — e.g. `"ESX"` also matches `"12ESX34"`.

```lua
-- No key needed to (un)lock these models / plates
Config.Whitelist = {
    models = {`caddy`, `caddy2`, `caddy3`, `airtug`, `docktug`, `forklift`, `mower`, `tractor2`},
    plates = {"TEST"}
}

-- These models / plates can NEVER be (un)locked
Config.Blacklist = {
    models = {`bmx`, `cruiser`, `fixter`, `scorcher`, `tribike`, `tribike2`, `tribike3`},
    plates = {"TEST2"}
}
```

## Admin Vehicles

Only groups configured in `Config.AdminCommand` may (un)lock these vehicles.

```lua
Config.AdminVehicles = {
    models = {},
    plates = {"ADMINCAR"}
}
```

## Job Vehicles

Players with a specific job can (un)lock matching vehicles. You can optionally narrow it
down per **rank** using the `ranks` table — a rank entry overrides the job-wide
`models` / `plates` for that rank.

```lua
Config.JobVehicles = {
    ['police'] = {
        models = {`police`, `police2`, `police3`, `police4`, `policeb`, `polmav`},
        plates = {"LSPD", "POL"},
        ranks = {
            ['officer'] = {
                models = {`police`},
                plates = {""}
            },
        }
    },
    ['ambulance'] = {
        models = {`ambulance`},
        plates = {"LSMD", "AMB"},
    },
}
```

:::tip
- Use backticks `` `model` `` for vehicle models — **not** `''` or `""`.
- Plates match by substring, so a short string like `"POL"` matches every plate containing it.
:::
