---
title: Installation
sidebar_position: 1
---

# Installation

1. Drag & drop the `msk_garage` folder into your resources folder.
2. Make sure the [dependencies](../index.md#-requirements) start **before**
   `msk_garage` (`es_extended`, `msk_core`, `oxmysql`).
3. Add `ensure msk_garage` to your `server.cfg`.
4. Configure the three files in the [`config/`](../config.md) folder
   (`settings.lua`, `garages.lua`, `impounds.lua`).
5. Start your server.

```cfg title="server.cfg"
ensure oxmysql
ensure es_extended
ensure msk_core
# optional
ensure AdvancedParking
ensure VehicleDeformation
ensure msk_vehiclekeys

ensure msk_garage
```

## Database

The script uses the standard ESX **`owned_vehicles`** table. The extra columns
it needs (`garage`, `fuel`, `name`, `isFav`, `deformations`) are created
**automatically** on first start via an idempotent migration — **no manual SQL
import is required**.

If you want to know exactly what is stored and why, see the
[Database](../database.md) page.

:::warning[OneSync is required]
`msk_garage` spawns vehicles with `CreateVehicleServerSetter`, which only works
with **OneSync enabled** (`set onesync on` or `set onesync infinity`). The script
prints a loud warning on start if OneSync is off.
:::

## First steps after install

1. Open `config/settings.lua` and set your **locale** (`Config.Locale`),
   **hotkey**, **target** / **TextUI** preference and **fuel** adapter.
2. Add or edit your garages in `config/garages.lua` and impounds in
   `config/impounds.lua`.
3. Decide whether vehicles park out **anywhere** or only at the **garage they
   were stored in** (`Config.Parking`).
4. If you use AdvancedParking, vehicle keys, a custom fuel script or visual
   deformation, read the [Integrations](./integrations.md) guide.

## Updating

Replace the resource folder and restart. Configuration and locales are
escrow-open, so back up your `config/` and `locales/` changes before overwriting
and re-apply them afterwards.

:::info[Vehicles parked before the condition-persistence update]
Visual deformation (dents) and the hardened condition restore were added in a
later 4.0.x release. Vehicles parked **before** updating may have empty or
legacy deformation data — this normalises automatically the next time they are
parked in.
:::
