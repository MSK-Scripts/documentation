---
title: Database
sidebar_position: 5
---

# Database

`msk_garage` stores vehicles in the owned-vehicle table of the running framework
and, since v5.0.0, keeps its **garage/impound/settings/permission** data in four
of its own tables. It does **not** ship an `.sql` file. Every column and table it
needs is created automatically on the first start.

## Which table

Since **v5.6.0** the table and its column names come from msk_core, which knows
the layout of the running framework:

| | ESX | QBCore and Qbox |
|---|---|---|
| Table | `owned_vehicles` | `player_vehicles` |
| Owner | `owner` | `citizenid` |
| Properties | `vehicle` | `mods` |
| `vehicle` column | the properties | the **spawn name** |
| Model hash | inside the properties | own column `hash` |
| Parked flag | `stored`, 0 or 1 | `state` |

Everything in the resource reads these names from `Config.MySQL`, which is filled
from `MSK.VehicleStore.GetSchema()` on start. The values written into
`config/static.lua` are only the fallback for a server where msk_core cannot
answer, and they match ESX.

## Auto-migration

On `onResourceStart` the script runs an **idempotent** migration
(`ADD COLUMN IF NOT EXISTS`) against that table, so it is safe to run repeatedly
and never touches existing data:

```sql
ALTER TABLE <the framework's vehicle table>
    ADD COLUMN IF NOT EXISTS `garage`       varchar(60) NOT NULL DEFAULT 'A',
    ADD COLUMN IF NOT EXISTS `fuel`         SMALLINT NULL DEFAULT 100,
    ADD COLUMN IF NOT EXISTS `name`         varchar(60) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS `isFav`        TINYINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS `deformations` longtext DEFAULT NULL;
```

The `garage` column default is set from `Config.DefaultGarage` (the land-category
default, shown as `'A'` above). The `fuel` column was migrated from `TINYINT` to
`SMALLINT` (auto, idempotent) so msk_fuel tanks larger than 100 L are stored
without being capped.

:::info[No manual import]
You do not need to import any SQL by hand. Just make sure the framework's own
vehicle table exists: `owned_vehicles` ships with ESX Legacy, `player_vehicles`
with QBCore and Qbox.
:::

## Columns used by msk_garage

| Column | Type | Set by | Purpose |
|---|---|---|---|
| owner column | `varchar` | framework | Player identifier (or `society_<job>` for shared job vehicles). `owner` on ESX, `citizenid` on QBCore and Qbox. |
| `plate` | `varchar` | framework | License plate. Stored padded **or** trimmed. The script matches both. |
| property column | `longtext` | framework / garage | Vehicle properties JSON (mods, colors **and** engine/body/tank health, dirt). `vehicle` on ESX, `mods` on QBCore and Qbox. |
| `type` | `varchar` | framework / garage | Vehicle category (`car`, `truck`, `boat`, `helicopter`, `aircraft`, …). Added by msk_core on QBCore and Qbox, which do not have it. |
| `job` | `varchar` | framework | Job that owns the vehicle (empty / `civ` for civilian cars). Added by msk_core on QBCore and Qbox. |
| parked flag | `tinyint` | garage | `1` = safely parked (shown in garage), `0` = out in the world (shown in impound). `stored` on ESX, `state` on QBCore and Qbox. |
| `garage` | `varchar(60)` | garage | Which garage the vehicle was parked in (used when `Config.Parking = 'specific'`). |
| `fuel` | `smallint` | garage | Fuel level at park-in (liters when msk_fuel is active). |
| `name` | `varchar(60)` | garage | Custom nickname set by the player. |
| `isFav` | `tinyint` | garage | `1` if the player marked the vehicle as a favourite. |
| `deformations` | `longtext` | garage | Visual body deformation JSON (see [VehicleDeformation](./guides/integrations.md#vehicledeformation)). |

:::note[Column name mapping]
Every one of these is read through `Config.MySQL`, which msk_core fills on start.
The civilian marker `civ` is the one value msk_core does not know about, so set
that one yourself if your shop writes something else:

```lua
Config.MySQL = {
    table     = 'owned_vehicles',
    owner     = 'owner',
    props     = 'vehicle',
    type      = 'type',
    job       = 'job',
    stored    = 'stored',
    civ       = 'civ',
    storedIn  = 1,
    storedOut = 0,
}
```
:::

## Vehicle type and category matching

The synonym table (`TYPE_SYNONYMS` in `shared/classes.lua`) decides which stored
vehicles show up in a garage or impound.

A garage (or impound) is configured with one or more **categories** in its `type`
array, for example `{ 'helicopter', 'aircraft' }`. At runtime the script compares
those categories against the raw **`type`** value that the vehicle
**shop** wrote when the player bought the car. The problem: shops disagree on what
they store there.

- Some use **class-based** names: `car`, `truck`, `helicopter`, `aircraft`.
- Others use the **`GetVehicleType()`** convention: `automobile`, `heli`, `plane`.

A naive `type = 'helicopter'` query would then return nothing just because the
shop stored `'heli'`, so a heli garage would stay empty. To avoid that, every
category is expanded to a list of accepted synonyms before matching. This lives
in `shared/classes.lua` (escrow-open, so you can edit it):

```lua
local TYPE_SYNONYMS = {
    car        = { 'car', 'automobile' },
    truck      = { 'truck', 'automobile' },
    boat       = { 'boat' },
    helicopter = { 'helicopter', 'heli', 'air' },
    aircraft   = { 'aircraft', 'plane', 'airplane', 'air' },
    bike       = { 'bike', 'motorcycle', 'motorbike' },
    submarine  = { 'submarine', 'submarinecar' },
    trailer    = { 'trailer' },
    train      = { 'train' },
}
```

Two helpers use this table:

| Function | Returns | Used for |
|---|---|---|
| `Classes.TypeSynonyms(category)` | All DB `type` values that satisfy a single configured category. Falls back to `{ category }` for an unknown category. | Building the list query so a garage fills regardless of the shop's naming. |
| `Classes.TypeMatches(categories, dbType)` | `true` if the stored `type` matches **any** synonym of **any** of the garage's categories (case-insensitive). | Park-in eligibility (can this vehicle be stored in this garage?). |

So a garage configured with `{ 'helicopter', 'aircraft' }` accepts vehicles whose
stored `type` is any of `helicopter`, `heli`, `aircraft`, `plane`, `airplane` or
`air`.
List queries additionally **dedupe by plate**, so overlapping synonyms (e.g. a
garage that lists both `car` and `truck`, both of which include `automobile`)
never produce duplicate entries.

:::tip[If a garage stays empty]
Check the actual value of the `type` column in the vehicle table for one of the
affected vehicles. If your shop uses a value that is not in the list above (for
example a submarine stored as `'sub'`), add it to the matching category in
`TYPE_SYNONYMS` and restart the resource:

```lua
submarine = { 'submarine', 'submarinecar', 'sub' }, -- added 'sub'
```
:::

:::note[Keep the admin permissions in sync]
`shared/admin_perms.lua` maps the same categories onto the land / sea / air
default-garage buckets and notes that it must be kept **in sync with
`TYPE_SYNONYMS`**. If you add a brand new category (not just a synonym), add it in
both places.
:::

## What "condition" is stored where

- **Mechanical condition** (engine / body / tank health, dirt level, mods,
  colors, plate) lives inside the `vehicle` properties JSON.
- **Visual deformation** (the actual dents) lives in the separate `deformations`
  column and is only filled when the
  [VehicleDeformation](./guides/integrations.md#vehicledeformation) resource is
  running.

Both are captured on park-in and restored on park-out for garages **and**
impounds.

## Dashboard tables (v5.0.0)

The [Admin Dashboard](./dashboard.md) stores garages, impounds, settings and the
permission matrix in four tables, all created with `CREATE TABLE IF NOT EXISTS`
on start:

| Table | Purpose |
|---|---|
| `msk_garage_garages` | Garage definitions (`id`, `label`, `data` JSON, `enabled`). |
| `msk_garage_impounds` | Impound definitions (same shape, `data` includes the fee). |
| `msk_garage_settings` | Key/value store for the dashboard-managed settings (+ the one-time seed marker). |
| `msk_garage_permissions` | Per-group rights matrix (`group_name`, `perms` JSON). |

:::info[One-time seed]
On the **first** start your `config/garages.lua`, `config/impounds.lua` and the
managed settings are imported into these tables **once** (a `__seeded__` marker
prevents re-importing). After that the tables are authoritative and edited from
the dashboard, see [Config](./config.md) and [Admin Dashboard](./dashboard.md).
:::

:::note[Complex fields are JSON]
Garage/impound definitions are stored as JSON in the `data` column. `vector4`
coordinates are saved as plain `{ x, y, z, w }` tables so they survive JSON
encode/decode; the runtime reads coordinates via `.x/.y/.z/.w` either way.
:::

## Private garage tables (v5.5.0)

[Private garages](./guides/private-garages.md) add two nullable columns to
`msk_garage_garages` and one new table. Both are applied automatically on start,
there is **no SQL to run by hand**:

| Column / Table | Purpose |
|---|---|
| `msk_garage_garages.owner` | The identifier of the owner. A garage is private exactly when this is set. |
| `msk_garage_garages.house_ref` | Links the garage to the id your housing script uses. Only needed for the pull adapters. |
| `msk_garage_private_access` | Who may use which garage (`garage_id`, `identifier`, `granted_by`, `granted_at`). |

:::note[Why these are columns and not part of `data`]
`owner` and `house_ref` are looked up per player, and the `data` JSON is shipped
to clients on every sync. Keeping them as columns means they can be indexed, and
that the owner identifier never has to leave the server.
:::

:::warning[Do not point `owner` at a garage by hand without thinking]
Setting an owner takes the garage away from everyone else. msk_garage handles
that for you through `/garageowner` and the exports, moving other players
vehicles out of the garage first. An `UPDATE` straight on the table skips that
step and can leave cars in a garage their owner can no longer open.
:::
