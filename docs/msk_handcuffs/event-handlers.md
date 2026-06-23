---
title: Event Handlers
sidebar_position: 7
description: The msk_handcuffs:handler integration event, fired on every cuff, uncuff, ankletracker, headbag and tape action - server and client signatures.
keywords:
  - msk_handcuffs handler
  - msk_handcuffs event
  - integration hook
---

# Event Handlers

## `msk_handcuffs:handler`

Fired every time an action happens. Use it to integrate with your own scripts (logging,
MDT, jail, …).

- **Server:** a regular event — `AddEventHandler('msk_handcuffs:handler', ...)`.
  Clients cannot trigger it.
- **Client:** a net event — `RegisterNetEvent('msk_handcuffs:handler', ...)`, sent to the
  affected target.

**Signature**
`function(officerId, targetId, action, item)`

| Param | Type | Description |
|---|---|---|
| `officerId` | number | Server id of the player performing the action |
| `targetId` | number | Server id of the target player |
| `action` | string | See the action list below |
| `item` | string \| nil | Item used (cuff/hardcuff/uncuff only) |

**Actions:** `cuff`, `hardcuff`, `uncuff`, `ankletrackerOn`, `ankletrackerOff`,
`headbagOn`, `headbagOff`, `tapeOn`, `tapeOff`.

```lua
AddEventHandler('msk_handcuffs:handler', function(officerId, targetId, action, item)
    if action == 'cuff' then
        print(('ID %s was cuffed by ID %s with item %s'):format(targetId, officerId, item or 'none'))
    elseif action == 'uncuff' then
        print(('ID %s was uncuffed by ID %s'):format(targetId, officerId))
    elseif action == 'ankletrackerOn' then
        print(('ID %s got an ankletracker from ID %s'):format(targetId, officerId))
    elseif action == 'headbagOn' then
        print(('ID %s got a headbag from ID %s'):format(targetId, officerId))
    elseif action == 'tapeOn' then
        print(('ID %s got taped by ID %s'):format(targetId, officerId))
    end
end)
```
