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
