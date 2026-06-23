---
title: General Edits for Jobs
sidebar_position: 2
---

# General Edits for Jobs

:::warning
Do **NOT** use this if you use `jobs_creator`!  
Use the [Jaksam Job Creator](./jaksam-job-creator.md) guide instead.
:::

To let msk_handcuffs work with e.g. `esx_policejob` or other job scripts, go to `esx_policejob/client/main.lua` and add the following menu elements:

```lua
{icon = "fas fa-handcuffs", title = 'Handcuff', value = 'handcuff'},
{icon = "fas fa-handcuffs", title = 'Hardcuff', value = 'hardcuff'},
{icon = "fas fa-handcuffs", title = 'Uncuff', value = 'uncuff'},
{icon = "fas fa-head-side", title = 'Headbag', value = 'headbag'},
{icon = "fas fa-tape", title = 'Tape', value = 'tape'},
{icon = "fas fa-location-dot", title = 'Ankletracker', value = 'ankletracker'},
{icon = "fas fa-person-walking", title = 'Drag/Escort', value = 'drag'},
{icon = "fas fa-car-side", title = TranslateCap('put_in_vehicle'), value = 'put_in_vehicle'},
{icon = "fas fa-car-side", title = TranslateCap('out_the_vehicle'), value = 'out_the_vehicle'},
```

Then add the corresponding actions in the context menu handler:

```lua
ESX.OpenContext("right", elements2, function(menu2, element2)
    local closestPlayer, closestDistance = ESX.Game.GetClosestPlayer()
    if closestPlayer ~= -1 and closestDistance <= 3.0 then
        local action = element2.value

        if action == 'handcuff' then
            exports.msk_handcuffs:cuffPlayer('cuffs', closestPlayer)
        elseif action == 'hardcuff' then
            exports.msk_handcuffs:hardcuffPlayer('hardcuff', closestPlayer)
        elseif action == 'uncuff' then
            exports.msk_handcuffs:uncuffPlayer('cuff_keys', closestPlayer)
        elseif action == 'headbag' then
            exports.msk_handcuffs:headbagPlayer(closestPlayer)
        elseif action == 'tape' then
            exports.msk_handcuffs:tapePlayer(closestPlayer)
        elseif action == 'ankletracker' then
            exports.msk_handcuffs:ankleTrackerPlayer(closestPlayer)
        elseif action == 'drag' then
            exports.msk_handcuffs:dragPlayer(closestPlayer)
        elseif action == 'put_in_vehicle' then
            exports.msk_handcuffs:putPlayerInCar(closestPlayer)
        elseif action == 'out_the_vehicle' then
            exports.msk_handcuffs:putPlayerOutOfCar(closestPlayer)
        end
    else
        ESX.ShowNotification(TranslateCap('no_players_nearby'))
    end
end)
```
