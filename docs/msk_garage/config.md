---
title: Config
sidebar_position: 2
---

# Config

:::info[v4.0.0]
Since the full rewrite the configuration is **split across three files** inside
the `config/` folder. All of them are escrow-open (`escrow_ignore`), so you can
edit them freely:

| File | Contains |
|---|---|
| `config/settings.lua` | General settings (`Config.*`) |
| `config/garages.lua` | `Config.Garages` (uses a `garage()` template helper) |
| `config/impounds.lua` | `Config.Impounds` (uses an `impound()` template helper) |
:::

## `config/settings.lua`

```lua
Config = Config or {}

Config.Locale = 'de' -- 'de', 'en'
Config.Debug = true
Config.VersionChecker = true

-- Notification (client- AND serverside)
Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then
        MSK.Notification(source, 'MSK Garage', message, typ)
    else
        MSK.Notification('MSK Garage', message, typ)
    end
end

-- Interaction
Config.Hotkey = 38 -- E (see translation for the visible key)

-- "Speech bubble" the ped plays when you enter/leave its range
Config.npcVoice = {
    enable = true,
    inRange = 5.0,
    outRange = 5.0,
}

Config.TargetSystem = {
    enable = true,
    -- Supported: ox_target. Add your own in client/target.lua
    script = 'ox_target',
}

-- true  -> uses the built-in msk_core HelpNotification
-- false -> uses your Config.openTextUI / Config.closeTextUI below
Config.defaultTextUI = true

Config.openTextUI = function(coloredText, uncoloredText)
    exports['okokTextUI']:Open(uncoloredText, 'darkblue', 'left')
end

Config.closeTextUI = function()
    exports['okokTextUI']:Close()
end

-- Database column mapping
Config.MySQL = {
    type = 'type',
    job = 'job',
    stored = 'stored',
    civ = 'civ',
}

Config.Parking = 'specific' -- 'all' | 'specific'
Config.DefaultGarage = 'A'

-- Vehicle Keys (second-key support so key holders can park out too)
Config.VehicleKeys = {
    enable = true,
    script = 'msk_vehiclekeys', -- msk_vehiclekeys | VehicleKeyChain | vehicles_keys
}

Config.AdvancedParking = true

-- Fuel adapter (clientside ONLY)
Config.SetFuel = function(vehicle, fuel)
    Entity(vehicle).state.fuel = fuel
end

Config.GetFuel = function(vehicle)
    return Entity(vehicle).state.fuel
end

-- Impound settings
Config.enableImpound = true
Config.parkoutWithKey = true
Config.needEnoughMoney = true

-- Job vehicles via society identifier
-- If true, job vehicles are owned by the society (e.g. 'society_police')
-- instead of the player, so they can be shared across the whole job.
Config.useSocietyName = false
```

### Notes

- **`Config.defaultTextUI`** — `true` uses the built-in `msk_core`
  HelpNotification. Set it to `false` to route prompts through your own
  `Config.openTextUI` / `Config.closeTextUI` (the example wires `okokTextUI`).
- **`Config.TargetSystem`** — when enabled the interaction runs through the
  target script (default `ox_target`) instead of the hotkey + TextUI flow. Add
  your own target adapter in `client/target.lua`.
- **`Config.VehicleKeys.script`** — supported out of the box: `msk_vehiclekeys`,
  `VehicleKeyChain`, `vehicles_keys` (bridges live in `server/keys/`).

## `config/garages.lua`

Garages are no longer written out as full tables. A `garage()` helper builds the
entry from shared defaults, so you only pass the parts that differ. Any field can
still be overridden via the `opts` table (last argument).

```lua
-- garage(id, label, types, location, parkOut, blip, opts)
Config.Garages = {
    ['A'] = garage('A', 'Garage | Meetingpoint', {'car', 'truck'},
        vector4(213.98, -808.45, 31.01, 156.59),       -- ped / blip / marker location
        { vector4(232.98, -790.30, 30.60, 161.46) },   -- park-out spot(s)
        CAR_BLIP),

    -- Boat garage: warp the player in, bigger park-in radius
    ['boat_A'] = garage('boat_A', 'Garage | LS Docks', {'boat'},
        vector4(-724.39, -1334.67, 1.6, 49.0),
        { vector4(-731.31, -1334.57, 2.07, 228.46) },
        BOAT_BLIP, { distance = 50.0, warp = true }),

    -- Job garage: society-owned police vehicles
    ['police_mrpd_a'] = garage('police_mrpd_a', 'Garage | Police MRPD', {'car', 'truck'},
        vector4(460.10, -986.74, 25.7, 92.28),
        { vector4(455.61, -980.50, 25.7, 90.34) },
        { enable = false, id = 524, color = 29, scale = 0.8 },
        {
            distance = 20.0,
            pedmodel = { enable = true, model = 's_m_y_cop_01', distance = 20.0 },
            jobs = {
                enable = true, identifier = 'society', ownJob = true,
                jobs = { { job = 'police', grade = 0 } },
            },
        }),
}
```

The resulting table per garage looks like this (this is what custom-garage
exports must also provide — see [Server Exports](./exports/server.md)):

```lua
{
    id        = 'A',
    label     = 'Garage | Meetingpoint',
    type      = { 'car', 'truck' },          -- car | truck | boat | helicopter | aircraft | ...
    distance  = 40.0,                         -- park-in radius
    jobs      = { enable = false, identifier = 'player', ownJob = true, jobs = {} },
    pedmodel  = { enable = true, model = 'csb_trafficwarden', distance = 20.0 },
    text3d    = { enable = true, label = '~g~Open Garage', size = 0.8 },
    marker    = { enable = true, distance = 5.0, type = 27, size = {...}, color = {...} },
    blip      = { enable = true, id = 524, color = 26, scale = 0.8 },
    locations = { vector4(213.98, -808.45, 31.01, 156.59) },
    park_dist = 5.0,                          -- min spacing to consider a park-out spot free
    park_out  = { vector4(232.98, -790.30, 30.60, 161.46) },
    warp      = false,                        -- teleport the player into the vehicle
}
```

**Jobs block**

| Field | Type | Description |
|---|---|---|
| `enable` | `boolean` | Restrict the garage to job(s) |
| `identifier` | `string` | `'player'` (owned by the member) or `'society'` (shared) |
| `ownJob` | `boolean` | Only show vehicles of the player's current job |
| `jobs` | `table` | List of `{ job = 'police', grade = 0 }` (grade = minimum) |

## `config/impounds.lua`

Same pattern with the `impound()` helper.

```lua
-- impound(label, types, location, parkOut, blipId, fee, warp)
Config.Impounds = {
    ['impound_car'] = impound(
        'Impound | Car',
        { 'car', 'truck' },
        vector4(409.0, -1622.75, 29.29, 231.88),       -- ped / blip / marker location
        {                                               -- park-out spot(s)
            vector4(401.36, -1647.98, 29.29, 318.54),
            vector4(406.09, -1652.36, 29.29, 320.51),
        },
        524,    -- blip id
        150,    -- fee (0 disables the fee automatically)
        false   -- warp
    ),

    ['impound_boat'] = impound('Impound | Boat', { 'boat' },
        vector4(-788.38, -1490.3, 1.6, 289.21),
        { vector4(-797.84, -1490.21, -0.47, 301.0) },
        410, 200, true),

    ['impound_heli'] = impound('Impound | Aircrafts', { 'aircraft', 'helicopter' },
        vector4(-1070.57, -2867.78, 13.95, 152.85),
        { vector4(-1112.54, -2883.81, 13.95, 147.98) },
        569, 500, false),
}
```

The fee is built as `fee = { enable = price > 0, price = price, account = 'money' }`.
Set the fee to `0` to make the impound free. The fee is **always charged
server-side** and **fully refunded** if the park-out fails for any reason.

:::tip[How the impound decides what to show]
The impound lists the player's vehicles whose `stored` column is `0` (i.e. lost
in the world after a crash, death or restart). A garage lists vehicles with
`stored = 1` (safely parked). Retrieving a vehicle from the impound charges the
fee and sets `stored = 0 -> spawned`.
:::
