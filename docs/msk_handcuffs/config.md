---
title: Config
sidebar_position: 4
description: Full config reference for msk_handcuffs v3 - the config/settings.lua and config/static.lua split, DB-managed settings, items, restrictions, commands, ankletracker, headbag, tape, props, target system, voice and luxu_admin.
keywords:
  - msk_handcuffs config
  - config/settings.lua
  - config/static.lua
  - RestrictItems
  - MaxDistance
  - Config.Target
  - Config.LuxuAdmin
---

# Config

Since v3.0.0 the config is split into **two files**:

| File | Contents | Managed by |
|---|---|---|
| `config/settings.lua` | Everything that can be serialised: locale, items, restrictions, commands, timers, theme, … | **Seeded once, then the [dashboard](./dashboard.md)** |
| `config/static.lua` | Code hooks that can't live in a database: Lua functions, prop hashes, the control blacklist, luxu_admin | **The file, always** |

:::warning[The database wins]
On the first start, every key from `config/settings.lua` is imported into the
`msk_handcuffs_settings` table **once**. After that the database is the source of
truth. Editing the file later has **no effect** — change the value in the
[dashboard](./dashboard.md) instead.

`config/static.lua` is never touched by the dashboard and is always read from the file.
:::

## `config/settings.lua`

### Key reference

| Key | Type | Description |
|---|---|---|
| `Config.Locale` | string | Language key (`'de'`, `'en'`, `'hu'`) from `translation.lua` |
| `Config.Debug` | boolean | Verbose logging. **Keep `false` on live servers** |
| `Config.VersionChecker` | boolean | Check for updates on start |
| `Config.MaxDistance` | number | **Server-validated** max distance (meters) between officer and target for any action |
| `Config.DiscordLog` | boolean | Enable Discord webhook logs |
| `Config.DiscordWebhook` | string | The webhook URL (editable in the dashboard) |
| `Config.botColor` / `botName` / `botAvatar` | string | Appearance of the Discord log embeds |
| `Config.Target` | table | Target integration — `system` is `'auto'`, `'ox_target'` or `'qb-target'` |
| `Config.cuffItems` / `hardcuffItems` / `uncuffItems` | table | Item names that trigger the respective action |
| `Config.ItemSettings` | table | Maps a cuff item to the uncuff item(s) allowed to open it |
| `Config.GiveCuffItemBack` | table | Whether the cuff item is returned on uncuff |
| `Config.consumeUncuffItem` | boolean | Consume the uncuff item (`cuff_keys` / `scissors`) on use. Default `false` |
| `Config.RestrictItems` | table | Default + per-job item/option restrictions (server-enforced) |
| `Config.Commands` | table | Player commands (`/cuff`, `/hardcuff`, `/uncuff`) |
| `Config.AnkleTracker` / `HeadBag` / `Tape` | table | Item, removeItem, command and options per feature |
| `Config.UncuffOnPlayerDied` | boolean | Auto-uncuff on death |
| `Config.checkOnPlayerLoaded` | table | Which statuses are re-applied on (re)spawn |
| `Config.playSound` | table | Sounds per action (files in `web/public/sounds`) |
| `Config.Timer` | table | Server-driven auto-uncuff timer (minutes) |
| `Config.EnableProps` | boolean | Master switch for the attached props |
| `Config.Voice` | table | Disable radio while cuffed / mute via Tape (`'pma'` or `'salty'`) |
| `Config.AdminGroups` / `Config.AdminCommands` | table | Admin **chat command** groups & names |
| `Config.adminCommand` | string | Command that opens the [admin dashboard](./dashboard.md) |
| `Config.dashboardGroups` | table | Groups (besides `admin`) that may open the dashboard |
| `Config.BrandTag` | string | Badge next to the dashboard title. Empty = hidden |
| `Config.Theme` | table | UI colours: `accent`, `bg`, `panel`, `textPrimary`, `textSecondary` |

### Full default

```lua title="config/settings.lua"
Config = {}
Config.Locale = 'de'
Config.Debug = false
Config.VersionChecker = true

-- Server-validated max distance (meters) for any officer -> target action.
Config.MaxDistance = 3.0

Config.DiscordLog = true
Config.DiscordWebhook = "" -- or set it in the dashboard
Config.botColor = "6205745"
Config.botName = "MSK Scripts"
Config.botAvatar = "https://i.imgur.com/PizJGsh.png"

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

-- false = the uncuff item stays in the inventory (reusable)
Config.consumeUncuffItem = false

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
    consumeRemoveItem = false,       -- true = the key is used up
    command = 'ankletracker',
    blip = {id = 1, color = 15, scale = 0.8, prefix = 'Track'},
    jobs = {'police', 'fib', 'sheriff', 'doj'},
}

Config.HeadBag = {
    enable = true,
    item = 'headbag',
    removeItem = 'headbag_key',
    needItemToRemove = false,  -- false = no item needed to take the bag off
    consumeRemoveItem = false, -- true = the key is used up
    command = 'headbag',
}

Config.Tape = {
    enable = true,
    item = 'tape',
    removeItem = 'tape_key',
    needItemToRemove = false,
    consumeRemoveItem = false,
    command = 'tape',
}

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

Config.Voice = {enable = false, voice = 'pma'} -- 'pma' | 'salty'

-- Admin chat commands (the in-game dashboard is separate)
Config.AdminGroups = {'superadmin', 'admin'}
Config.AdminCommands = {
    cuff = {enable = true, command = 'adcuff', playAnimation = false},
    hardcuff = {enable = true, command = 'adhardcuff'},
    uncuff = {enable = true, command = 'aduncuff'},
    ankleTracker = {enable = true, command = 'adankletracker'},
    headbag = {enable = true, command = 'adheadbag'},
    tape = {enable = true, command = 'adtape'},
}

-- In-Game Admin Dashboard
Config.adminCommand = 'handcuffadmin'
Config.dashboardGroups = { 'mod' }
Config.BrandTag = 'MSK'
Config.Theme = {
    accent = '#00E676',
    bg = '#0a0b0d',
    panel = '#131317',
    textPrimary = '#f0ede8',
    textSecondary = '#b0adb8',
}
```

## `config/static.lua`

These are Lua functions, prop hashes and the control blacklist. They can't be stored
in a database, so they stay in the file and are loaded on every start.

| Key | Description |
|---|---|
| `Config.LuxuAdmin` | luxu_admin v2 integration for the dashboard access |
| `Config.Notification` | Notification hook. Runs **clientside and serverside** |
| `Config.SetRadioChannel` | Called when someone gets cuffed (clientside) |
| `Config.MutePlayer` | Mute hook for the Tape. Runs **clientside and serverside** |
| `Config.Method` | `'blacklist'` or `'whitelist'` control scheme while cuffed |
| `Config.Handcuffed` | Runs every frame while the player is cuffed |
| `Config.Props` | Attached prop model per item. Use backticks, not quotes |

```lua title="config/static.lua"
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
```

### `Config.LuxuAdmin`

luxu_admin v2 keeps its staff groups internally instead of registering them as FiveM
ACE principals, so a plain `IsPlayerAceAllowed('group.x')` check does not see them.
When enabled, the dashboard resolves the player's group through luxu_admin's
`getPlayerStaffGroup` export.

```lua title="config/static.lua"
Config.LuxuAdmin = {
    enable = 'auto',          -- 'auto' (on when the resource is started), true, or false
    resource = 'luxu_admin',  -- change if you renamed the resource
    requireDuty = false,      -- true = the staff member must be ON DUTY to be recognized

    -- Optional: map luxu_admin staff group names to your dashboard groups.
    -- Unmapped groups are matched by their own (lowercased) name.
    groupMap = {
        -- ['owner'] = 'admin',
    },
}
```

## Notes on key options

### `Config.MaxDistance`
Every officer→target action is re-validated on the **server** using OneSync coordinates.
The client also does a `2.0`m pre-check for responsiveness; the server uses
`Config.MaxDistance` (slightly higher to absorb latency).

### `Config.RestrictItems`
When `enable = true`, the **server** ignores any item the client claims and only accepts
an item the player is actually allowed to use. The **defaultItems always apply**,
regardless of the job — a job entry only adds its own items and options on top.

### `Config.ItemSettings`
Uncuffing only works with the item that matches how the person was cuffed. Cable ties
open with scissors, handcuffs with the cuff keys, nothing else. If the officer doesn't
carry the right one, the notification names the item's **in-game label**.

### `Config.HeadBag` / `Config.Tape`
`needItemToRemove = false` (the default) means anyone can take the bag or the tape off
again without an item. Set it to `true` to require the `removeItem`. `consumeRemoveItem`
decides whether that item is used up — it is `false` by default, so keys stay reusable.
The ankletracker has the same `consumeRemoveItem` toggle.

### `Config.Target`

:::tip[New in v3.0.0]
v2 had no target options at all — `Config.Target` only registered the undrag hotkey.
v3 ships a full target integration. **[ox_target](https://github.com/overextended/ox_target)
is the recommended system**; [qb-target](https://github.com/qbcore-framework/qb-target)
is supported as well.
:::

| Field | Description |
|---|---|
| `enable` | Master switch. `false` removes every option |
| `system` | `'auto'` (default), `'ox_target'` or `'qb-target'` |
| `undragHotkey` | Default key to release an escorted player |
| `options` | Switch each entry on or off individually |

`'auto'` picks **ox_target** when it is running and falls back to **qb-target**. Set the
value explicitly to force one. If neither resource is started, an error is logged and the
target menu stays empty — items, commands and exports keep working.

These options are registered on the player:

| Option | Shown when |
|---|---|
| `cuff` | The target is not cuffed |
| `hardcuff` | The target is cuffed but not hardcuffed |
| `uncuff` | The target is cuffed |
| `ankletracker` | The target is cuffed (label toggles on/off) |
| `headbag` | Always (label toggles on/off) |
| `tape` | Always (label toggles on/off) |
| `drag` | The target is cuffed |
| `putInCar` | The target is cuffed |
| `putOutOfCar` | Always |

The labels are translated to `Config.Locale` and follow the target's state, so the same
entry reads "Put on headbag" or "Remove headbag" depending on the situation. Changing the
language in the [dashboard](./dashboard.md) re-registers everything live, no restart.

### `Config.Target.undragHotkey`
The default key to release a person you are escorting. It is registered as a normal
FiveM keybind, so players can rebind it in the game settings — the on-screen hint then
shows **their** key, not the config default.
