---
title: Database
sidebar_position: 5
---

# Database

Since **v1.2.0** msk_fuel needs [oxmysql](https://github.com/overextended/oxmysql).

:::tip[Nothing to import]
All tables are created on the first start with `CREATE TABLE IF NOT EXISTS`, then
seeded once from `config.stations.lua` and `config.business.lua`. There is no SQL
file to run.
:::

## Tables

| Table                     | Holds                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `msk_fuel_stations`       | One row per station: label, owner, balance, and the definition as JSON                 |
| `msk_fuel_stock`          | Stock, capacity, price mode and fixed price, per station and fuel type                  |
| `msk_fuel_pumps`          | Pump condition, per station and pump position                                           |
| `msk_fuel_ranks`          | Ranks per station: label, salary, delivery bonus, permissions                            |
| `msk_fuel_employees`      | Who works where, in which rank, with their statistics                                   |
| `msk_fuel_transactions`   | Every booking: sales, deposits, wages, orders, repairs                                  |
| `msk_fuel_settings`       | The DB-managed settings, one row per key                                                |
| `msk_fuel_permissions`    | Admin dashboard permission matrix, one row per group                                    |

### Why owner and balance are columns

`msk_fuel_stations.data` carries the station definition as JSON, but `owner` and
`balance` have their own columns. They change far more often than the definition,
they are looked up per player, and `data` is what gets shipped to clients on
every sync.

## Seeding

The seed runs **once**, marked by a `__seeded__` row in `msk_fuel_settings`.
After that, editing `config.stations.lua` or `config.business.lua` has no effect:
the database is the source of truth and the dashboards are how you change it.

Two things are checked on **every** start regardless, because they were the
obvious traps:

- **Missing stock rows.** A station added later (in the dashboard, or as a new
  entry in `config.stations.lua`) still needs its tanks.
- **Missing settings.** A setting introduced by a newer version would otherwise
  never reach a server that had already been seeded, and would silently stay on
  its config default.

## Re-seeding

To start over, drop the `__seeded__` row and restart the resource:

```sql
DELETE FROM `msk_fuel_settings` WHERE `skey` = '__seeded__';
```

That re-imports the station definitions and the settings from the config files.
It does **not** touch stock levels, owners, balances, staff or transactions.

To wipe the business layer completely, drop every `msk_fuel_*` table and restart.

## Upgrading from v1.1.x

Nothing to do by hand. On the first start with v1.2.0 the tables are created and
seeded, and every station begins unowned with a full tank, so the script behaves
exactly like it did before until somebody buys a station.

One config change to be aware of: `Config.FuelStations` (the blip coordinate
list) moved to `config.stations.lua` and `Config.FuelStationZoneDistance` was
replaced by a per-station `radius`. If you had added your own coordinates to
`Config.FuelStations`, add them as stations in the new file **before** the first
start, or create them afterwards in the admin dashboard.
