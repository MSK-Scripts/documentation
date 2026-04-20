---
title: MSK WeaponAmmo
sidebar_position: 14
---

# MSK WeaponAmmo

## Common Errors

### SCRIPT ERROR: bad argument #1 to 'upper' (string expected, got table)

If you use ESX 1.8.5 and get this error when adding a Weapon Component, go to `es_extended/server/classes/player.lua` and search for `function self.addWeaponComponent(weaponName, weaponComponent)`.

Replace the function with the following:

```lua
function self.addWeaponComponent(weaponName, weaponComponent)
    local loadoutNum, weapon = self.getWeapon(weaponName)

    if weapon then
        local component = ESX.GetWeaponComponent(weaponName, weaponComponent)

        if component then
            if not self.hasWeaponComponent(weaponName, weaponComponent) then
                self.loadout[loadoutNum].components[#self.loadout[loadoutNum].components + 1] = weaponComponent
                GiveWeaponComponentToPed(GetPlayerPed(self.source), joaat(weaponName), component.hash)
                self.triggerEvent('esx:addInventoryItem', component.label, false, true)
            end
        end
    end
end
```
