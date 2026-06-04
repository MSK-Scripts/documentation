---
title: Config
sidebar_position: 2
---

# Config

## Config: General

```lua
Config = {}
Config.Locale = 'de'
Config.Debug = true
Config.VersionChecker = true

Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then
        MSK.Notification(source, 'Fuel Station', message, typ, 5000)
    else
        MSK.Notification('Fuel Station', message, typ, 5000)
    end
end

Config.Commands = {
    allowedGroups = {'superadmin', 'admin'},
    setVehicleFuel = 'setFuel',   -- /setFuel 50 (must be in a vehicle)
    repairVehicle = 'repairVehicle',
}

Config.FuelStationBlips = {
    enable = true,
    id = 361,
    color = 6,
    scale = 0.8,
    label = Translate('fuel_station_blip'),
}

-- GLOBAL fuel consumption rate multiplier for all vehicles operated by a player
Config.FuelConsumptionRateMultiplier = 2.0

-- Per-vehicle handling consumption rate (fPetrolConsumptionRate) applied while the engine is running
Config.PetrolConsumptionRate = 2.0

-- Max distance (units) a player may be away from a vehicle to fuel it (serverside anti-exploit check)
Config.MaxFuelingDistance = 100.0

Config.Refill = {
    tick = 250,   -- ms
    value = 0.50, -- % per tick
    price = 5,    -- $ per tick
}

Config.Petrolcan = {
    enable = true,
    price = 1000,
    refillPrice = 800,
    refillDuration = 5, -- seconds
    durabilityTick = 1.3,
}

Config.DefaultFuelType = 'gas'

Config.WrongFuel = {
    allow = true,
    liter = 15,
}
```

## Config: Fuel Types

```lua
Config.Vehicles = {
    ['gas'] = {
        `dinghy`, `dinghy2`, `dinghy3`, `dinghy4`,
    },
    ['diesel'] = {
        `benson`, `biff`, `cerberus`, `hauler`, `mule`,
    },
    ['kerosin'] = {
        -- Planes
        `alphaz1`, `avenger`, `besra`, `blimp`,
        -- Helicopters
        `polmav`, `akula`, `buzzard`,
    },
    ['electric'] = {
        `imorgon`, `neon`, `raiden`, `cyclone`, `voltic`,
        `airtug`, `caddy`, `surge`,
    },
}
```
