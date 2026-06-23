---
title: Jaksam Job Creator
sidebar_position: 3
---

# Jaksam Job Creator

Edit `jobs_creator/client/actions/actions.lua`.

:::danger
Do **NOT** forget to add the LocalizedText to the `jobs_creator/locals` files!
:::

```lua
-- English
['actions_put_handcuffs'] = "Cuff",
['actions_put_hardcuffs'] = "Hardcuff",
['actions_take_handcuffs'] = "Uncuff",
['actions_ankletracker'] = "AnkleTracker",
['actions_headbag'] = "Headbag",
['actions_tape'] = "Tape",

-- German
['actions_put_handcuffs'] = "Handfesseln anlegen",
['actions_put_hardcuffs'] = "Fußfesseln anlegen",
['actions_take_handcuffs'] = "Handfesseln ablegen",
['actions_ankletracker'] = "Fußfessel",
['actions_headbag'] = "Kopfsack",
['actions_tape'] = "Klebeband",
```

## v7.11 and lower

### Edit Menu Options

```lua title="client/actions/actions.lua"
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_put_handcuffs'), value = 'cuff', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_put_hardcuffs'), value = 'hardcuff', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_take_handcuffs'), value = 'uncuff', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_headbag'), value = 'headbag', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_tape'), value = 'tape', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_ankletracker'), value = 'ankletracker', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_start_dragging'), value = 'drag', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_put_in_car'), value = 'putInCar', type = 'player'},
{condition = JobsCreator.activeActions.canHandcuff, label = getLocalizedText('actions_take_from_car'), value = 'takeFromCar', type = 'vehicle'},
```

### Replace isHandcuffed check

```lua
if (exports['msk_handcuffs']:getIsHandcuffed()) then
    notifyClient(getLocalizedText("you_cant_while_handcuffed"))
    return
end
```

### Edit Menu Actions

```lua title="client/actions/actions.lua"
local function openActionsMenu()
    if not canDoAnyAction or not actionsMenuEnabled or IsPedDeadOrDying(PlayerPedId()) then return end
    if (exports['msk_handcuffs']:getIsHandcuffed()) then
        notifyClient(getLocalizedText("you_cant_while_handcuffed"))
        return
    end

    Framework.menu().CloseAll()
    Framework.menu().Open('default', GetCurrentResourceName(), 'actions_menu', {
        title = getLocalizedText('actions_menu'),
        align = config.menuPosition,
        elements = menuElements
    },
    function(data, menu)
        local action = data.current.value
        local playerJob = ESX.GetPlayerData().job.name or 'unemployed'

        local defaultItems = {cuffItem = 'cable_ties', hardcuffItem = 'hardcuff', uncuffItem = 'scissors', enableAnkletracker = false, enableHeadbag = true, enableTape = true}
        local jobs = {
            ['police'] = {cuffItem = 'cuffs', hardcuffItem = 'hardcuff', uncuffItem = 'cuff_keys', enableAnkletracker = true, enableHeadbag = true, enableTape = true},
        }

        if action == 'cuff' then
            exports.msk_handcuffs:cuffPlayer(jobs[playerJob] and jobs[playerJob].cuffItem or defaultItems.cuffItem)
        elseif action == 'hardcuff' then
            exports.msk_handcuffs:hardcuffPlayer(jobs[playerJob] and jobs[playerJob].hardcuffItem or defaultItems.hardcuffItem)
        elseif action == 'uncuff' then
            exports.msk_handcuffs:uncuffPlayer(jobs[playerJob] and jobs[playerJob].uncuffItem or defaultItems.uncuffItem)
        elseif action == 'ankletracker' then
            if jobs[playerJob] and jobs[playerJob].enableAnkletracker or defaultItems.enableAnkletracker then
                exports.msk_handcuffs:ankleTrackerPlayer()
            end
        elseif action == 'headbag' then
            if jobs[playerJob] and jobs[playerJob].enableHeadbag or defaultItems.enableHeadbag then
                exports.msk_handcuffs:headbagPlayer()
            end
        elseif action == 'tape' then
            if jobs[playerJob] and jobs[playerJob].enableTape or defaultItems.enableTape then
                exports.msk_handcuffs:tapePlayer()
            end
        elseif action == 'drag' then
            local player, distance = ESX.Game.GetClosestPlayer()
            if player ~= -1 and distance <= 2.5 then
                exports.msk_handcuffs:dragPlayer(player)
            end
        elseif action == 'putInCar' then
            local player, distance = ESX.Game.GetClosestPlayer()
            if player ~= -1 and distance <= 2.5 then
                exports.msk_handcuffs:putPlayerInCar(player)
            end
        elseif action == 'takeFromCar' then
            local player, distance = ESX.Game.GetClosestPlayer()
            if player ~= -1 and distance <= 2.5 then
                exports.msk_handcuffs:putPlayerOutOfCar(player)
            end
        else
            TriggerEvent(Utils.eventsPrefix .. ':actions:' .. action, data.current.extraData)
        end
    end,
    function(data, menu)
        menu.close()
    end)
end
```

## v8.4.4 and higher

### Edit Menu Options

Same menu options as v7.11 above.

### Edit Menu Actions

```lua title="client/actions/actions.lua"
local function openActionsMenu()
    if not canDoAnyAction or not actionsMenuEnabled or IsPedDeadOrDying(PlayerPedId()) then return end
    if (exports['msk_handcuffs']:getIsHandcuffed()) then
        notifyClient(getLocalizedText("you_cant_while_handcuffed"))
        return
    end

    Utils.hideInteractionMenu()
    Utils.openInteractionMenu("actions", getLocalizedText('actions_menu'), menuElements, function(selected, scrollIndex, args)
        if not ESX then ESX = exports["es_extended"]:getSharedObject() end
        local playerJob = ESX.GetPlayerData().job.name or 'unemployed'

        local defaultItems = {cuffItem = 'cable_ties', hardcuffItem = 'hardcuff', uncuffItem = 'scissors', enableAnkletracker = false, enableHeadbag = true, enableTape = true}
        local jobs = {
            ['police'] = {cuffItem = 'cuffs', hardcuffItem = 'hardcuff', uncuffItem = 'cuff_keys', enableAnkletracker = true, enableHeadbag = true, enableTape = true},
        }

        if args.value == 'cuff' then
            exports.msk_handcuffs:cuffPlayer(jobs[playerJob] and jobs[playerJob].cuffItem or defaultItems.cuffItem)
        elseif args.value == 'hardcuff' then
            exports.msk_handcuffs:hardcuffPlayer(jobs[playerJob] and jobs[playerJob].hardcuffItem or defaultItems.hardcuffItem)
        elseif args.value == 'uncuff' then
            exports.msk_handcuffs:uncuffPlayer(jobs[playerJob] and jobs[playerJob].uncuffItem or defaultItems.uncuffItem)
        elseif args.value == 'ankletracker' then
            if jobs[playerJob] and jobs[playerJob].enableAnkletracker or defaultItems.enableAnkletracker then
                exports.msk_handcuffs:ankleTrackerPlayer()
            end
        elseif args.value == 'headbag' then
            if jobs[playerJob] and jobs[playerJob].enableHeadbag or defaultItems.enableHeadbag then
                exports.msk_handcuffs:headbagPlayer()
            end
        elseif args.value == 'tape' then
            if jobs[playerJob] and jobs[playerJob].enableTape or defaultItems.enableTape then
                exports.msk_handcuffs:tapePlayer()
            end
        elseif args.value == 'drag' then
            local player, distance = ESX.Game.GetClosestPlayer()
            if player ~= -1 and distance <= 2.5 then
                exports.msk_handcuffs:dragPlayer(player)
            end
        elseif args.value == 'putInCar' then
            local player, distance = ESX.Game.GetClosestPlayer()
            if player ~= -1 and distance <= 2.5 then
                exports.msk_handcuffs:putPlayerInCar(player)
            end
        elseif args.value == 'takeFromCar' then
            local player, distance = ESX.Game.GetClosestPlayer()
            if player ~= -1 and distance <= 2.5 then
                exports.msk_handcuffs:putPlayerOutOfCar(player)
            end
        else
            TriggerEvent(Utils.eventsPrefix .. ':actions:' .. args.value, args.extraData)
        end
    end)
end
```
