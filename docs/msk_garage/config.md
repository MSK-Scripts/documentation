---
title: Config
sidebar_position: 4
---

# Config

:::tip[Config is the seed — the database is authoritative (v5.0.0)]
Since v5.0.0 garages, impounds and the managed settings are stored in the
**database** and edited from the [Admin Dashboard](./dashboard.md). The config
files below are imported **once** on the first start and afterwards only act as
the **default template** for a fresh install. To change things on a running
server, use `/garageadmin` — not these files.
:::

The configuration lives in the `config/` folder. All files are escrow-open
(`escrow_ignore`), so you can edit them freely:

| File | Contains | Managed by |
|---|---|---|
| `config/settings.lua` | Dashboard-managed settings (`Config.*`) — **seed defaults** | DB / Dashboard |
| `config/static.lua` | Code hooks, adapters & column mapping | **File only** (never touched by the DB) |
| `config/garages.lua` | `Config.Garages` seed (uses a `garage()` template helper) | DB / Dashboard |
| `config/impounds.lua` | `Config.Impounds` seed (uses an `impound()` template helper) | DB / Dashboard |

:::info[settings.lua vs static.lua]
The split is deliberate: **`settings.lua`** holds only values that the dashboard
writes back to the database (so editing them on a seeded server has no effect —
use the dashboard). **`static.lua`** holds the code-level hooks (notification,
TextUI, fuel, lock and column mapping) that the dashboard never manages — edit
those directly in the file.
:::

## `config/settings.lua` (dashboard-managed seed)

```lua
Config = Config or {}

Config.Locale = 'de' -- de | en | hu | fr | es | pt | pl
Config.Debug = true
Config.VersionChecker = true

-- Interaction
Config.Hotkey = 38 -- E (see translation for the visible key)

Config.TargetSystem = {
    enable = true,
    -- Selectable in the dashboard. Adapters live in client/target.lua.
    script = 'ox_target',
}

Config.defaultTextUI = true

Config.Parking = 'specific' -- 'all' | 'specific'

-- Default garages per vehicle category (land / sea / air)
Config.DefaultGarages = {
    land = 'A',      -- car / truck / bike / bicycle / trailer / train
    sea  = 'boat_A', -- boat / submarine
    air  = 'heli_A', -- helicopter / aircraft / plane
}
Config.DefaultGarage = Config.DefaultGarages.land -- legacy, derived

-- Vehicle Keys (second-key support so key holders can park out too)
Config.VehicleKeys = {
    enable = true,
    -- Selectable in the dashboard. Adapters live in server/keys/.
    script = 'msk_vehiclekeys',
}

-- Fallback tank volume (L) for the max-fuel denominator of stored vehicles
Config.FuelTankDefaultVolume = 65.0

-- Impound settings
Config.enableImpound = true
Config.parkoutWithKey = true
Config.needEnoughMoney = true

-- Own job vehicles via society identifier (shared across the job)
Config.useSocietyName = false

-- In-Game Admin Dashboard
Config.adminCommand = 'garageadmin' -- command that opens the dashboard
Config.dashboardGroups = { 'mod' }  -- groups (besides 'admin') allowed to open it; 'user' is always denied
Config.BrandTag = 'MSK'             -- badge next to the dashboard title (empty = hidden)

-- Per-model vehicle images (vehicle_images/<spawnname>.<ext>). Falls back to the
-- vehicle-class icon when an image is missing.
Config.VehicleImages = { enable = false, ext = 'png' } -- ext: 'png' | 'jpg' | 'webp'

-- UI colours (hex) — applied live to dashboard, garage & impound. Derived shades
-- are computed in the UI; only these 5 brand colours are configurable.
Config.Theme = {
    accent = '#00E676', bg = '#0a0b0d', panel = '#131317',
    textPrimary = '#f0ede8', textSecondary = '#b0adb8',
}

-- Per-job public-garage access (managed from the Job Garages dashboard tab).
-- job -> { mode = 'whitelist'|'blacklist', garages = { '<publicGarageId>', ... } }
Config.JobGaragePolicy = {}
```

### Settings reference

| Key | Type | Description |
|---|---|---|
| `Config.Locale` | `string` | Active locale (`de`, `en`, `hu`, `fr`, `es`, `pt`, `pl`), see `locales/`. |
| `Config.Debug` | `boolean` | Prints verbose debug logging via `MSK.Logging`. |
| `Config.VersionChecker` | `boolean` | Checks for new releases on start. |
| `Config.Hotkey` | `number` | Interaction key (default `38` = E). Players can rebind it in FiveM. |
| `Config.TargetSystem` | `table` | Use a target script (`ox_target`) instead of hotkey + TextUI. Script is a dropdown in the dashboard. |
| `Config.defaultTextUI` | `boolean` | `true` = msk_core HelpNotification, `false` = your TextUI (`config/static.lua`). |
| `Config.Parking` | `string` | `'specific'` = park out only at the storing garage, `'all'` = anywhere. |
| `Config.DefaultGarages` | `table` | Default garage id **per category** (`land` / `sea` / `air`). Used when reassigning vehicles from a deleted garage. |
| `Config.DefaultGarage` | `string` | Legacy single default, derived from `DefaultGarages.land`. |
| `Config.VehicleKeys` | `table` | Second-key support — script is a dropdown in the dashboard. See [Integrations](./guides/integrations.md#vehicle-keys). |
| `Config.FuelTankDefaultVolume` | `number` | Max-volume denominator (L) for **stored** vehicles without a per-model override. See [Integrations → Fuel](./guides/integrations.md#fuel). |
| `Config.enableImpound` | `boolean` | Register the impound locations from `config/impounds.lua`. |
| `Config.parkoutWithKey` | `boolean` | Key holders may also retrieve from the impound. |
| `Config.needEnoughMoney` | `boolean` | Require the player to afford the impound fee. |
| `Config.useSocietyName` | `boolean` | Own job vehicles via `society_<job>` instead of per-player. |
| `Config.adminCommand` | `string` | Command that opens the [Admin Dashboard](./dashboard.md). |
| `Config.dashboardGroups` | `table` | ACE groups (besides `admin`) allowed to open the dashboard. `user` is always denied. |
| `Config.BrandTag` | `string` | Badge shown next to the dashboard title (default `MSK`). Empty hides it. Editable in Settings → Colors. |
| `Config.VehicleImages` | `table` | Per-model vehicle images: `{ enable, ext }` (`ext` = `png`/`jpg`/`webp`). Images go in `vehicle_images/<spawnname>.<ext>`; missing ones fall back to the class icon. See [Dashboard → Vehicle images](./dashboard.md#vehicle-images). |
| `Config.Theme` | `table` | UI colours (`accent`, `bg`, `panel`, `textPrimary`, `textSecondary`) applied to dashboard/garage/impound. Editable in Settings → Colors. |
| `Config.JobGaragePolicy` | `table` | Per-job public-garage access (whitelist/blacklist), managed from the [Job Garages tab](./dashboard.md#job-garages). Empty = jobs have no public-garage access. |

:::note[AdvancedParking is auto-detected]
There is no `Config.AdvancedParking` flag anymore. The
[AdvancedParking](./guides/integrations.md#advancedparking) integration is enabled
automatically whenever the `AdvancedParking` resource is running.
:::

## `config/static.lua` (code hooks — not managed by the DB)

These are the adapters and mappings the dashboard never touches. Edit them
directly; changes take effect on resource restart.

```lua
Config = Config or {}

-- Notification (client- AND serverside)
Config.Notification = function(source, message, typ)
    if IsDuplicityVersion() then
        MSK.Notification(source, 'MSK Garage', message, typ)
    else
        MSK.Notification('MSK Garage', message, typ)
    end
end

-- Ped "greet/farewell" voice line on enter/leave
Config.npcVoice = { enable = true, inRange = 5.0, outRange = 5.0 }

-- TextUI adapter (used when Config.defaultTextUI = false)
Config.openTextUI = function(coloredText, uncoloredText)
    MSK.TextUI.Show('E', coloredText)
end
Config.closeTextUI = function()
    MSK.TextUI.Close()
end

-- Database column mapping (owned_vehicles)
Config.MySQL = { type = 'type', job = 'job', stored = 'stored', civ = 'civ' }

-- Resolves the default garage id for an owned_vehicles.type value
function Config.GetDefaultGarage(vehicleType) ... end

-- AdvancedParking auto-detect (no config flag)
Config.UsesAdvancedParking = function()
    return GetResourceState('AdvancedParking') == 'started'
end

-- Fuel adapter (auto-uses msk_fuel when running, else the state bag)
Config.UsesMskFuel = function() return GetResourceState('msk_fuel') == 'started' end
Config.GetModelMaxFuel = function(model) ... end
Config.SetFuel = function(vehicle, fuel) ... end
Config.GetFuel = function(vehicle) ... end

-- Lock adapter (uses the vehicle-keys script's lock export when present)
Config.LockVehicle = function(vehicle, locked) ... end
```

| Key | Type | Description |
|---|---|---|
| `Config.Notification` | `function` | Notification adapter (works client **and** server). |
| `Config.npcVoice` | `table` | Ped "greet/farewell" voice line on enter/leave. |
| `Config.openTextUI` / `closeTextUI` | `function` | Your TextUI adapter (default wires `MSK.TextUI`). |
| `Config.MySQL` | `table` | Column name mapping for `owned_vehicles` — see [Database](./database.md). |
| `Config.GetDefaultGarage` | `function` | Resolves the default garage id for a vehicle type via `Config.DefaultGarages`. |
| `Config.UsesAdvancedParking` | `function` | Auto-detects the AdvancedParking resource. |
| `Config.UsesMskFuel` / `GetModelMaxFuel` | `function` | [Fuel](./guides/integrations.md#fuel) detection & max-volume helper. |
| `Config.SetFuel` / `GetFuel` | `function` | [Fuel](./guides/integrations.md#fuel) adapter (clientside). |
| `Config.LockVehicle` | `function` | Lock adapter (uses the keys script's lock export when present). |

## `config/garages.lua`

Garages are not written out as full tables. A `garage()` helper builds the entry
from shared defaults, so you only pass the parts that differ. Any field can still
be overridden via the `opts` table (last argument).

:::tip
This file is the **seed** for a fresh install. On a running server, add/edit
garages from the [Admin Dashboard](./dashboard.md) instead.
:::

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

The resulting table per garage looks like this (this is also the shape a
custom-garage export must provide — see [Server Exports](./exports/server.md)):

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

:::note[Coordinates in the database]
When stored in the DB (or edited in the dashboard), `vector4` locations are kept
as plain `{ x, y, z, w }` tables — the rest of the script reads coordinates via
`.x/.y/.z/.w`, so both forms work interchangeably.
:::

:::tip[The `type` categories are synonym-tolerant]
A garage's `type` array (`{ 'car', 'truck', 'bike' }`, `{ 'helicopter', 'aircraft' }`,
…) is matched against the raw `owned_vehicles.type` value the vehicle shop wrote,
and shops use different naming conventions (`heli` vs `helicopter`, `automobile`
vs `car`). Each category is expanded to a list of accepted synonyms, so a garage
fills regardless of the shop's convention. If a garage stays empty, see
[Database → Vehicle type and category matching](./database.md#vehicle-type-and-category-matching).
:::

### Jobs block

| Field | Type | Description |
|---|---|---|
| `enable` | `boolean` | Restrict the garage to job(s). |
| `identifier` | `string` | `'player'` (owned by the member) or `'society'` (shared). |
| `ownJob` | `boolean` | Only show vehicles of the player's current job. |
| `jobs` | `table` | List of allowed jobs. Each entry is `{ job = 'police', grade = 0 }` (**minimum** grade) **or** `{ job = 'police', grades = { 0, 2, 4 } }` (only those **exact** ranks). |

:::tip[Per-rank access (v5.0.0)]
A job entry can grant access to **individual ranks** instead of "this grade and
above". Use `grades = { ... }` (a list of allowed grade numbers) for exact-rank
matching; omit it (or use `grade = N`) for the classic minimum-grade behaviour.
Both forms work, so existing configs keep working unchanged.

In the [Admin Dashboard](./dashboard.md) this is point-and-click: pick the job
from a dropdown, then tick the exact ranks in the rank popup.
:::

```lua
-- Minimum grade (grade 2 and above):
jobs = { { job = 'police', grade = 2 } }

-- Only these exact ranks (0, 2 and 4):
jobs = { { job = 'police', grades = { 0, 2, 4 } } }
```

## `config/impounds.lua`

Same pattern with the `impound()` helper. The **first argument is the impound
id** (the table key) — it must match the key so the server can resolve the
impound when listing or retrieving vehicles.

```lua
-- impound(id, label, types, location, parkOut, blipId, fee, warp)
Config.Impounds = {
    ['impound_car'] = impound(
        'impound_car',                                  -- id (must match the table key)
        'Impound | Car',
        { 'car', 'truck' },
        vector4(409.0, -1622.75, 29.29, 231.88),        -- ped / blip / marker location
        {                                               -- park-out spot(s)
            vector4(401.36, -1647.98, 29.29, 318.54),
            vector4(406.09, -1652.36, 29.29, 320.51),
        },
        524,    -- blip id
        150,    -- fee (0 disables the fee automatically)
        false   -- warp
    ),

    ['impound_boat'] = impound('impound_boat', 'Impound | Boat', { 'boat' },
        vector4(-788.38, -1490.3, 1.6, 289.21),
        { vector4(-797.84, -1490.21, -0.47, 301.0) },
        410, 200, true),

    ['impound_heli'] = impound('impound_heli', 'Impound | Aircrafts', { 'aircraft', 'helicopter' },
        vector4(-1070.57, -2867.78, 13.95, 152.85),
        { vector4(-1112.54, -2883.81, 13.95, 147.98) },
        569, 500, false),
}
```

:::warning[The id is required]
Each impound entry carries an `impoundId` field (set from the first argument). If
it is missing or doesn't match the table key, the impound's vehicle list resolves
to nothing server-side and **no vehicles are shown**. Always pass the id and keep
it identical to the table key.
:::

The fee is built as `fee = { enable = price > 0, price = price, account = 'money' }`.
Set the fee to `0` to make the impound free. The fee is **always charged
server-side** and **fully refunded** if the park-out fails for any reason.

:::tip[How the impound decides what to show]
The impound lists the player's vehicles whose `stored` column is `0` (i.e. lost
in the world after a crash, death or restart). A garage lists vehicles with
`stored = 1` (safely parked). Retrieving a vehicle from the impound charges the
fee and spawns it (`stored` stays `0` until it's parked again).
:::
