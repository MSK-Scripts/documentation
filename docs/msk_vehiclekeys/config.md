---
title: Config
sidebar_position: 2
---

# Config

```lua
Config = {}
Config.Locale = 'de'
Config.Debug = true
Config.VersionChecker = true

-- Supported Frameworks: AUTO, ESX, QBCore
-- AUTO will look for the correct framework you are using.
Config.Framework = 'AUTO'

-- !!! This function is clientside AND serverside !!!
Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then -- serverside
        MSK.Notification(source, 'Vehicle Keys', message, typ, 5000)
    else -- clientside
        MSK.Notification('Vehicle Keys', message, typ, 5000)
    end
end

Config.Commands = {
    lock = {enable = true, command = 'lock'},
    keyMenu = {enable = true, command = 'keyMenu'},
    -- Command for Players to refresh the Owned Vehicles (adds missing permanent keys)
    refreshKeys = {enable = true, command = 'refreshKeys'}
}

Config.VehicleTarget = {
    enable = true, -- (Un)lock a vehicle with a target system
    selectSeat = true, -- Select the seat you want to sit in

    -- Supported Target: ox_target
    -- You can add your own target in client/target.lua
    script = 'ox_target'
}

Config.Hotkeys = {
    lock = {enable = true, key = 'L'},
    keyMenu = {enable = true, key = 'U'},
}

-- Works with Ace Permissions (add_ace group.? command.? allow)
Config.AdminCommand = {
    enable = true, -- (Un)locks the vehicle if you don't have a key
    command = 'adlock',
    groups = {'superadmin', 'admin'}
}

-- Gives the key item to the player on load/refresh if missing.
-- For realism it is recommended to keep these false.
Config.OnRefreshKeys = {
    OnPlayerLoaded = {
        primaryKeys = false,
        secondaryKeys = false,
    },
    OnRefreshKeys = {
        primaryKeys = false,
        secondaryKeys = false,
    },
}

-- Giving the primary key to another player
-- !!! ox_inventory and jaksam_inventory ONLY !!!
Config.GivePrimaryKey = {
    -- Do NOT use all 4 options together!
    giveSecondaryKey = true, -- other player gets a secondary key
    givePrimaryKey = false, -- other player gets the primary key
    removePrimaryKey = false, -- the giver's primary key is removed
    transferOwnership = false, -- other player becomes the owner (primary key always removed from giver)
}

-- Keyring System to save all keys in a second inventory
-- !!! ox_inventory and jaksam_inventory ONLY !!!
Config.KeyRingSystem = {
    enable = true,
    addItem = true, -- Add the keyring item to the player on join if missing
    item = 'keyring',
}

Config.Settings = {
    lockDistance = 8.0,
    exchangeLocksPrice = 5000,
    transferVehicle = true,

    lockVehiclesFromNPCs = {
        enable = true,
        probability = 25 -- Set to 0 then npc vehicles are always locked
    },

    menu = {
        showSecondaryKeys = true,
        showTempKeys = true,
        showExchangeLocks = true,
        showTransferVehicle = true,
        refreshPlayerKeys = true,
        -- Supported Menus: ox_context, ox_menu
        keysMenu = 'ox_context'
    },

    key = {
        needItem = true,
        canUseItem = true,
        itemName = 'keys',
        -- Metadata-based inventories only: ox_inventory, jaksam_inventory
        -- (uniqueItems is always treated as true for these inventories)
        uniqueItems = true,
        inventory = 'ox_inventory',
        itemLabel = 'Vehicle Key',
        plateLabel = 'Plate: %s',
        toggleWithKey = true,
    },

    transfer = {
        needItem = true,
        canUseItem = true,
        itemName = 'contract',
    },

    animation = {
        dict = "anim@mp_player_intmenu@key_fob@",
        anim = "fob_click_fp",
        prop = `lr_prop_carkey_fob`,
    },
}

-- TextUI functions (used when Config.Locksmith.defaultTextUI = false)
Config.openTextUI = function(coloredText, uncoloredText)
    exports['okokTextUI']:Open(uncoloredText, 'darkblue', 'left')
end

Config.closeTextUI = function()
    exports['okokTextUI']:Close()
end

-- Locksmith service for exchanging the vehicle locks
Config.Locksmith = {
    enable = true,
    defaultTextUI = true,
    menu = 'ox_context', -- ox_context, ox_menu

    targetSystem = {
        enable = true,
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
        -- ['lsc'] and ['benny'] locations also available, see config.lua
    }
}

Config.Whitelist = {
    models = {`caddy`, `caddy2`, `caddy3`, `airtug`, `docktug`, `forklift`, `mower`, `tractor2`},
    plates = {"TEST"}
}

Config.Blacklist = {
    models = {`bmx`, `cruiser`, `fixter`, `scorcher`, `tribike`, `tribike2`, `tribike3`},
    plates = {"TEST2"}
}

-- Only groups configured in Config.AdminCommand may (un)lock these vehicles
Config.AdminVehicles = {
    models = {},
    plates = {"ADMINCAR"}
}

-- Players with specific jobs can (un)lock matching vehicles. Optional per-rank overrides via `ranks`.
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
