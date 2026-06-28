---
title: Installation
sidebar_position: 1
---

# Installation

1. Drag & drop the `msk_garage` folder into your resources folder.
2. Make sure the [dependencies](../index.md#-requirements) start **before**
   `msk_garage` (`es_extended`, `msk_core`, `oxmysql`).
3. Add `ensure msk_garage` to your `server.cfg`.
4. (Optional) Adjust the default seed in the [`config/`](../config.md) folder
   (`settings.lua`, `static.lua`, `garages.lua`, `impounds.lua`). These are
   imported into the database **once** on first start — afterwards manage
   everything from the [Admin Dashboard](../dashboard.md).
5. Start your server, then run `/garageadmin` as an admin to manage garages,
   impounds, settings and permissions in-game.

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
it needs (`garage`, `fuel`, `name`, `isFav`, `deformations`) **and** the four
dashboard tables (`msk_garage_garages`, `_impounds`, `_settings`,
`_permissions`) are created **automatically** on first start — **no manual SQL
import is required**.

If you want to know exactly what is stored and why, see the
[Database](../database.md) page.

:::warning[OneSync is required]
`msk_garage` spawns vehicles with `CreateVehicleServerSetter`, which only works
with **OneSync enabled** (`set onesync on` or `set onesync infinity`). The script
prints a loud warning on start if OneSync is off.
:::

## First steps after install

1. Make sure your admin is in `group.admin` in `server.cfg`, then run
   `/garageadmin` and open the [Admin Dashboard](../dashboard.md).
2. In **Permissions**, add the groups (e.g. `mod`) that may open the dashboard
   and assign their rights. `group.admin` always has everything; `group.user`
   can never open it.
3. In **Settings**, set the locale, parking mode, default garages (land/sea/air),
   target & vehicle-key scripts and (if needed) the dashboard command name.
4. In **Garages / Impounds**, add or edit locations — use the **"Current
   position"** button to capture coordinates in-game.
5. *(Optional, v5.1.0)* For **real vehicle images**, drop pictures into the
   `vehicle_images/<spawnname>.<ext>` folder (e.g. `vehicle_images/sultanrs.png`),
   then enable them under **Settings → Vehicle Images**. Missing images fall back
   to the class icon. See [Vehicle images](../dashboard.md#vehicle-images).
6. If you use AdvancedParking, vehicle keys, a custom fuel script or visual
   deformation, read the [Integrations](./integrations.md) guide.

:::note[Prefer to edit files?]
You can still pre-fill the defaults in `config/garages.lua`,
`config/impounds.lua` and `config/settings.lua` **before the first start** — they
are seeded into the database once. After that, use the dashboard.
:::

## Updating

Replace the resource folder and restart. `config/` and `locales/` are
escrow-open, so back up your changes before overwriting and re-apply them
afterwards. If you added **vehicle images**, back up your `vehicle_images/` folder
too and copy it back after updating.

:::info[Your garages survive updates]
On an already-seeded server, garages, impounds and the managed settings live in
the **database**, so overwriting `config/garages.lua` / `impounds.lua` /
`settings.lua` does **not** affect them — they are only the first-start seed.
Edits to `config/static.lua` (code hooks) and `locales/` still take effect on
restart as usual.
:::

:::info[Vehicles parked before the condition-persistence update]
Visual deformation (dents) and the hardened condition restore were added in a
later 4.0.x release. Vehicles parked **before** updating may have empty or
legacy deformation data — this normalises automatically the next time they are
parked in.
:::
