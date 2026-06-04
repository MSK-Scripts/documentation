---
title: Commands
sidebar_position: 4
---

# Commands

Both commands are **admin only**. The allowed permission groups and the command names can be changed in the config:

```lua
Config.Commands = {
    allowedGroups = {'superadmin', 'admin'},
    setVehicleFuel = 'setFuel',       -- /setFuel 50
    repairVehicle = 'repairVehicle',  -- /repairVehicle
}
```

> You have to be sitting in the vehicle for both commands to work.

## /setFuel

Sets the fuel level of the vehicle you are currently sitting in.

**Usage**  
`/setFuel [amount]`

**Arguments**  
**amount** - `number?` - The new fuel level (optional, defaults to `100`)

```
/setFuel 50
```

## /repairVehicle

Repairs the engine of the vehicle you are currently sitting in. Use this to fix a vehicle whose engine failed because it was refueled with the wrong fuel type.

**Usage**  
`/repairVehicle`

```
/repairVehicle
```
