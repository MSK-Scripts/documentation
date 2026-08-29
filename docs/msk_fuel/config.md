---
title: Config
sidebar_position: 4
---

# Config

:::info[Which file does what]
Since v1.2.0 the configuration is split across several files:

| File                  | Holds                                                              | DB-managed |
| --------------------- | ------------------------------------------------------------------ | ---------- |
| `config.lua`          | Fuel types, pump models, blips, commands, consumption               | no         |
| `config.stations.lua` | Station seed: zones, fuel types sold, purchase prices, fuel depots  | **yes**    |
| `config.business.lua` | Economy seed: prices, market, supply, payroll, maintenance          | **yes**    |
| `config.vehicles.lua` | Vehicle model to fuel type mapping                                  | no         |
| `config.tankvolume.lua` | Per-model tank volume overrides                                   | no         |

**DB-managed** means: the file is a seed. It is imported once on the first start,
and from then on the database is the source of truth. Change those values in the
[admin dashboard](./dashboard.md), not in the file — see [Database](./database.md).
:::

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

## Config: Stations

`config.stations.lua` defines the fuel stations. Only `coords` is required;
everything else has a default.

```lua
Config.Stations = {
    ['ls_01'] = { label = 'Tankstelle Los Santos 1', coords = vector3(-71.28, -1761.16, 29.48) },

    -- A station that also sells electricity, with its own zone size
    ['bc_10'] = {
        label = 'Tankstelle Grand Senora Desert',
        coords = vector3(1785.58, 3330.47, 41.38),
        radius = 60.0,
        fuelTypes = { 'gas', 'diesel', 'kerosin', 'electric' },
    },

    -- An airport tank: kerosene only, and not for sale
    ['lsia'] = {
        label = 'LS International Airport',
        coords = vector3(-995.06, -3398.36, 13.84),
        radius = 70.0,
        fuelTypes = { 'kerosin' },
        purchasable = false,
    },
}
```

| Field           | Type    | Default              | Meaning                                     |
| --------------- | ------- | -------------------- | ------------------------------------------- |
| `label`         | string  | the id               | Name on the blip and in the dashboard       |
| `coords`        | vector3 | –                    | Zone center                                 |
| `radius`        | number  | `60.0`               | Zone radius in units                        |
| `blip`          | boolean | `true`               | Show a blip for this station                |
| `fuelTypes`     | table   | gas, diesel, kerosin | What can be fueled here                     |
| `capacity`      | table   | `Config.DefaultCapacity` | Tank size per fuel type                 |
| `purchasable`   | boolean | `true`               | May players buy this station                |
| `purchasePrice` | number  | `Config.DefaultPurchasePrice` | Price to buy it                    |

Fuel depots for delivery runs live in the same file:

```lua
Config.FuelDepots = {
    { label = 'Raffinerie Elysian Island', coords = vector4(2739.61, 1516.55, 24.5, 15.0) },
    { label = 'Raffinerie Port of LS',     coords = vector4(1204.94, -2967.09, 5.9, 87.0) },
}
```

## Config: Business

`config.business.lua` holds the economy. The most important knobs:

```lua
-- Server-wide starting price per liter. Every dynamic station price is derived
-- from these, so this is what moves the whole map at once.
Config.BasePrices = { gas = 1.70, diesel = 1.50, kerosin = 1.90, electric = 0.50 }

-- Hard bounds. No station price can leave these, not even a fixed one.
Config.PriceLimits = {
    gas = { min = 0.80, max = 4.00 },
    -- ...
}

-- What a station pays per liter when it restocks. The margin between this and
-- the pump price is what a station actually earns, so tune the two together.
Config.Wholesale = { gas = 1.05, diesel = 0.90, kerosin = 1.20, electric = 0.30 }

-- Ordering through the NPC driver skips the drive, so it costs 35 % more.
Config.NpcSurcharge = 1.35
Config.NpcUnlockPrice = 50000

Config.DefaultPurchasePrice = 250000
Config.SellRefundRatio = 0.6   -- share of the purchase price paid back on sale

Config.Payroll = { enable = true, intervalMinutes = 60, onlineOnly = true }

Config.Maintenance = {
    enable = true,
    wearChance = 0.03,   -- chance per refuel that the pump takes damage
    slowThreshold = 50,  -- below this the pump fuels slower
    failThreshold = 15,  -- below this it stops working
}
```

:::tip[Balancing]
`Config.Wholesale` against `Config.BasePrices` decides how much a station earns
per liter, and `Config.Market` decides how far the price swings. Both are worth
a pass on your own server once you see how much your players actually drive.
:::

## Config: Dashboard access

Which groups may open the admin dashboard, and what colours it uses:

```lua
Config.adminCommand = 'fueladmin'
Config.dashboardGroups = { 'admin', 'mod' }

Config.Theme = {
    accent = '#00E676',
    bg = '#0a0b0d',
    panel = '#131317',
    textPrimary = '#f0ede8',
    textSecondary = '#b0adb8',
}
```

`group.admin` always has access and every right. `group.user` never does. See
[Dashboards](./dashboard.md) for the permission matrix.
