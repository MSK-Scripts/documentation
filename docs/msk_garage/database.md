---
title: Database
sidebar_position: 5
---

# Database

`msk_garage` stores vehicles in the standard ESX **`owned_vehicles`** table and,
since v5.0.0, keeps its **garage/impound/settings/permission** data in four of
its own tables. It does **not** ship an `.sql` file — every column and table it
needs is created automatically on the first start.

## Auto-migration

On `onResourceStart` the script runs an **idempotent** migration
(`ADD COLUMN IF NOT EXISTS`), so it is safe to run repeatedly and never touches
existing data:

```sql
ALTER TABLE owned_vehicles
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
You do not need to import any SQL by hand. Just make sure the base ESX
`owned_vehicles` table exists (it ships with ESX Legacy).
:::

## Columns used by msk_garage

| Column | Type | Set by | Purpose |
|---|---|---|---|
| `owner` | `varchar` | ESX | Player identifier (or `society_<job>` for shared job vehicles). |
| `plate` | `varchar` | ESX | License plate. Stored padded **or** trimmed — the script matches both. |
| `vehicle` | `longtext` | ESX / garage | Vehicle properties JSON (mods, colors **and** engine/body/tank health, dirt). |
| `type` | `varchar` | ESX / garage | Vehicle category (`car`, `truck`, `boat`, `helicopter`, `aircraft`, …). |
| `job` | `varchar` | ESX | Job that owns the vehicle (empty / `civ` for civilian cars). |
| `stored` | `tinyint` | garage | `1` = safely parked (shown in garage), `0` = out in the world (shown in impound). |
| `garage` | `varchar(60)` | garage | Which garage the vehicle was parked in (used when `Config.Parking = 'specific'`). |
| `fuel` | `smallint` | garage | Fuel level at park-in (liters when msk_fuel is active). |
| `name` | `varchar(60)` | garage | Custom nickname set by the player. |
| `isFav` | `tinyint` | garage | `1` if the player marked the vehicle as a favourite. |
| `deformations` | `longtext` | garage | Visual body deformation JSON (see [VehicleDeformation](./guides/integrations.md#vehicledeformation)). |

:::note[Column name mapping]
`type`, `job`, `stored` and the civilian marker (`civ`) are read through
`Config.MySQL`, so you can adapt them if your `owned_vehicles` schema uses
different column names:

```lua
Config.MySQL = {
    type   = 'type',
    job    = 'job',
    stored = 'stored',
    civ    = 'civ',
}
```
:::

## Vehicle type and category matching

The synonym table (`TYPE_SYNONYMS` in `shared/classes.lua`) decides which stored
vehicles show up in a garage or impound.

A garage (or impound) is configured with one or more **categories** in its `type`
array, for example `{ 'helicopter', 'aircraft' }`. At runtime the script compares
those categories against the raw **`owned_vehicles.type`** value that the vehicle
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
    helicopter = { 'helicopter', 'heli' },
    aircraft   = { 'aircraft', 'plane', 'airplane' },
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
stored `type` is any of `helicopter`, `heli`, `aircraft`, `plane` or `airplane`.
List queries additionally **dedupe by plate**, so overlapping synonyms (e.g. a
garage that lists both `car` and `truck`, both of which include `automobile`)
never produce duplicate entries.

:::tip[If a garage stays empty]
Check the actual value of the `type` column in `owned_vehicles` for one of the
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
the dashboard — see [Config](./config.md) and [Admin Dashboard](./dashboard.md).
:::

:::note[Complex fields are JSON]
Garage/impound definitions are stored as JSON in the `data` column. `vector4`
coordinates are saved as plain `{ x, y, z, w }` tables so they survive JSON
encode/decode; the runtime reads coordinates via `.x/.y/.z/.w` either way.
:::
