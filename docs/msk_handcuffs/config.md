---
title: Config
sidebar_position: 3
description: Full config.lua reference for msk_handcuffs v3 - items, restrictions, commands, ankletracker, headbag, tape, props, target system, voice and the server-validated max distance.
keywords:
  - msk_handcuffs config
  - config.lua
  - RestrictItems
  - MaxDistance
  - Config.Target
---

# Config

The `config.lua` keys are backwards compatible with v2. New in v3 are
`Config.MaxDistance` and `Config.Target.system`.

## Key reference

| Key | Type | Description |
|---|---|---|
| `Config.Locale` | string | Language key (`'de'`, `'en'`) from `translation.lua` |
| `Config.Debug` | boolean | Verbose logging. **Keep `false` on live servers** |
| `Config.VersionChecker` | boolean | Check GitHub for updates on start |
| `Config.MaxDistance` | number | **Server-validated** max distance (meters) between officer and target for any action |
| `Config.DiscordLog` | boolean | Enable Discord webhook logs |
| `Config.Target` | table | Target integration — `system` is `'auto'`, `'ox_target'` or `'qb-target'` |
| `Config.cuffItems` / `hardcuffItems` / `uncuffItems` | table | Item names that trigger the respective action |
| `Config.ItemSettings` | table | Maps a cuff item to the uncuff item(s) allowed to open it |
| `Config.GiveCuffItemBack` | table | Whether the cuff item is returned on uncuff |
| `Config.RestrictItems` | table | Per-job item/option restrictions (server-enforced) |
| `Config.Commands` | table | Player commands (`/cuff`, `/hardcuff`, `/uncuff`) |
| `Config.AnkleTracker` / `HeadBag` / `Tape` | table | Item, removeItem, command and options per feature |
| `Config.UncuffOnPlayerDied` | boolean | Auto-uncuff on death |
| `Config.checkOnPlayerLoaded` | table | Which statuses are re-applied on (re)spawn |
| `Config.playSound` | table | Sounds per action (files in `html/sounds`) |
| `Config.Timer` | table | Server-driven auto-uncuff timer (minutes) |
| `Config.EnableProps` / `Config.Props` | boolean / table | Attached prop models per item |
| `Config.AdminGroups` / `Config.AdminCommands` | table | Admin command groups & names |
| `Config.Voice` | table | Disable radio while cuffed / mute via Tape (`'pma'` or `'salty'`) |
| `Config.Method` | string | `'blacklist'` or `'whitelist'` control scheme while cuffed |

## Full default config

```lua
Config = {}
Config.Locale = 'de'
Config.Debug = false
Config.VersionChecker = true

-- Server-validated max distance (meters) for any officer -> target action.
Config.MaxDistance = 3.0

Config.DiscordLog = true
Config.botColor = "6205745"
Config.botName = "MSK Scripts"
Config.botAvatar = "https://i.imgur.com/PizJGsh.png"

-- Runs clientside AND serverside.
Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then
        MSK.Notification(source, 'MSK Handcuffs', message, typ, 5000)
    else
        MSK.Notification('MSK Handcuffs', message, typ, 5000)
    end
end

Config.Target = {
    enable = true,
    system = 'auto', -- 'auto' | 'ox_target' | 'qb-target'
    undragHotkey = 'X',
    options = {
        cuff = true, hardcuff = true, uncuff = true,
        ankletracker = true, headbag = true, tape = true,
        drag = true, putInCar = true, putOutOfCar = true,
    }
}

Config.cuffItems     = {'cuffs', 'cable_ties'}
Config.hardcuffItems = {'hardcuff'}
Config.uncuffItems   = {'cuff_keys', 'scissors'}

Config.ItemSettings = {
    ['cuffs']      = {'cuff_keys'},
    ['cable_ties'] = {'scissors'},
}

Config.GiveCuffItemBack = {
    ['cuffs'] = true, ['cable_ties'] = false, ['hardcuff'] = true,
    ['ankletracker'] = true, ['headbag'] = true, ['tape'] = true,
}

Config.RestrictItems = {
    enable = true,
    defaultItems = {
        cuffItem = 'cable_ties', hardcuffItem = 'hardcuff', uncuffItem = 'scissors',
        enableAnkletracker = false, enableHeadbag = true, enableTape = true,
    },
    jobItems = {
        ['police'] = {
            cuffItem = 'cuffs', hardcuffItem = 'hardcuff', uncuffItem = 'cuff_keys',
            enableAnkletracker = true, enableHeadbag = true, enableTape = true,
        },
        ['doj'] = {
            cuffItem = 'cuffs', hardcuffItem = 'hardcuff', uncuffItem = 'cuff_keys',
            enableAnkletracker = true, enableHeadbag = true, enableTape = true,
        },
    }
}

Config.Commands = {
    cuff     = {enable = true, command = 'cuff',     item = 'cable_ties', jobs = {['police'] = 'cuffs', ['doj'] = 'cuffs'}},
    hardcuff = {enable = true, command = 'hardcuff', item = 'hardcuff',   jobs = {['police'] = 'hardcuff', ['doj'] = 'hardcuff'}},
    uncuff   = {enable = true, command = 'uncuff',   item = 'scissors',   jobs = {['police'] = 'cuff_keys', ['doj'] = 'cuff_keys'}},
}

Config.AnkleTracker = {
    enable = true,
    refreshTime = 5.0,
    item = 'ankletracker',
    removeItem = 'ankletracker_key', -- must differ from item
    command = 'ankletracker',
    blip = {id = 1, color = 15, scale = 0.8, prefix = 'Track'},
    jobs = {'police', 'fib', 'sheriff', 'doj'},
}

Config.HeadBag = {enable = true, item = 'headbag', removeItem = 'headbag_key', command = 'headbag'}
Config.Tape    = {enable = true, item = 'tape',    removeItem = 'tape_key',    command = 'tape'}

Config.UncuffOnPlayerDied = true

Config.checkOnPlayerLoaded = {
    cuff = true, hardcuff = false, ankleTracker = true, headbag = false, tape = false,
}

Config.playSound = {
    enable = true,
    cuff = 'cuff.ogg', hardcuff = 'cuff.ogg', uncuff = 'uncuff.ogg',
    ankleTracker = 'cuff.ogg', headBag = false, tape = false,
}

Config.Timer = {enable = true, time = 30} -- minutes, server-driven

Config.EnableProps = true
Config.Props = {
    ['cuffs'] = `p_cs_cuffs_02_s`,
    ['cable_ties'] = `p_cs_cuffs_02_s`,
    ['hardcuff'] = nil,
    ['cuff_keys'] = `prop_cuff_keys_01`,
    ['scissors'] = `prop_cuff_keys_01`,
    [Config.AnkleTracker.item] = nil,
    [Config.HeadBag.item] = `prop_money_bag_01`,
    [Config.Tape.item] = `prop_gaffertape`,
}

Config.AdminGroups = {'superadmin', 'admin'}
Config.AdminCommands = {
    cuff = {enable = true, command = 'adcuff', playAnimation = false},
    hardcuff = {enable = true, command = 'adhardcuff'},
    uncuff = {enable = true, command = 'aduncuff'},
    ankleTracker = {enable = true, command = 'adankletracker'},
    headbag = {enable = true, command = 'adheadbag'},
    tape = {enable = true, command = 'adtape'},
}

Config.Voice = {enable = false, voice = 'pma'} -- 'pma' | 'salty'
Config.Method = 'blacklist' -- 'blacklist' | 'whitelist'
```

## Notes on key options

### `Config.MaxDistance` (new)
Every officer→target action is re-validated on the **server** using OneSync coordinates.
The client also does a `2.0`m pre-check for responsiveness; the server uses
`Config.MaxDistance` (slightly higher to absorb latency).

### `Config.RestrictItems`
When `enable = true`, the **server** ignores any item the client claims and uses the
job-specific item instead. This prevents a manipulated client from cuffing with another
job's item.

### `Config.Target.system`
- `'auto'` — uses ox_target if running, otherwise qb-target.
- `'ox_target'` / `'qb-target'` — force a specific system.
