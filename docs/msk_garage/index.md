---
title: MSK Garage
sidebar_position: 1
---

# MSK Garage & Impound

[**CFX Post**](https://forum.cfx.re/t/esx-msk-garage-and-impound/5122014)

An advanced, server-authoritative garage & impound system for **ESX Legacy**,
built on top of [msk_core](https://github.com/MSK-Scripts/msk_core). Park cars,
boats and aircraft, recover lost vehicles from the impound, share job vehicles
across a society — all with a modern, fully offline React UI.

:::tip[v5.1.0 — Job-garage policies, theming & vehicle images]
A new **[Job Garages tab](./dashboard.md#job-garages)** lets each job use public
garages via a **whitelist/blacklist**, the UI is now fully **[recolourable + rebrandable](./dashboard.md#colors--branding)**, 
and you can show **[real per-model vehicle images](./dashboard.md#vehicle-images)**.
:::

:::tip[v5.0.0 — In-Game Admin Dashboard]
Garages, impounds and settings are now stored in the **database** and managed
from an in-game **[admin dashboard](./dashboard.md)** (`/garageadmin`) — create,
edit and delete locations, change every setting and manage a **group/permission
system**, all applied **live without a restart**. Your config files are imported
once and then act only as the default template.
:::

:::tip[v4.0.0 — Full Rewrite]
The UI was rebuilt in **React + Vite + TypeScript** (no more jQuery / external
CDNs — everything is bundled and works offline) and the backend was moved to a
strict **server-authority** model: every park-in / park-out is validated
server-side, custom garages are [registered server-side](./exports/server.md),
and the impound fee is always charged on the server (and refunded on failure).
:::

## Features

### ✨ Highlights

- **In-Game Admin Dashboard** — create, edit and delete garages & impounds,
  change every setting and manage permissions from `/garageadmin`, applied live
  without a restart. See [Admin Dashboard](./dashboard.md).
- **Group & permission system** — fine-grained rights
  (view/create/edit/delete for garages & impounds, plus settings & permission
  management) bound to your existing `server.cfg` ACE groups.
- **Unlimited garages & impounds** — define as many locations as you want, each
  with its own ped, blip, 3D text, marker and park-out spot(s).
- **Cars, boats & aircraft** — separate vehicle categories (`car`, `truck`,
  `boat`, `helicopter`, `aircraft`, …) so the right vehicles show up at the
  right place.
- **Job & society garages** — restrict access by job and minimum grade; job
  vehicles can be owned per-player or shared across the whole society.
- **Public-garage access per job** — let a job park its vehicles at public
  garages too, controlled with a per-job **whitelist/blacklist** from the
  [Job Garages tab](./dashboard.md#job-garages).
- **Impound system** — recover lost vehicles (after a crash, death or server
  restart) for a configurable fee, with an in-UI **track waypoint** to locate
  the car.
- **Condition persistence** — engine, body & tank health, dirt level and the
  visual body **deformation (dents)** are saved on park-in and restored on
  park-out — for garages *and* impounds. _(Dents require the optional
  [VehicleDeformation](./guides/integrations.md#vehicledeformation) resource.)_
- **Vehicle keys support** — key holders can park in and out too. Works with
  `msk_vehiclekeys`, `VehicleKeyChain` and `vehicles_keys` out of the box.
- **Favourites & custom names** — players can mark vehicles as favourites and
  rename them.

### 🎨 Modern UI (rebuilt in v4.0.0)

- Brand-new interface built with **React + Vite + TypeScript** in the clean MSK
  dark/green design.
- **100% offline** — all fonts and icons are bundled. No jQuery, no Google
  Fonts, no FontAwesome CDN, zero external requests at runtime.
- Live search, fuel bars, vehicle-class icons and a fast, responsive layout.
- **Customisable colours & brand tag** (v5.1.0) — recolour the whole UI from
  Settings → Colors with a live preview. See [Colors & branding](./dashboard.md#colors--branding).
- **Real vehicle images** (v5.1.0, optional) — drop per-model pictures into
  `vehicle_images/` to replace the class icons. See [Vehicle images](./dashboard.md#vehicle-images).

### 🔒 Security-first backend

- **Server authority on everything** — every park-in / park-out is validated
  server-side. The client can never inject a garage definition, plate, or fee.
- **Anti-dupe protection** — per-plate spawn locks plus a spawn claim/rollback
  flow keep the world and database consistent, even on connection hiccups.
- **Safe custom garages** — third-party scripts register custom garages/impounds
  server-side, so park-out coordinates and fees can't be forged.
- **Guaranteed refunds** — if an impound park-out fails for any reason after
  charging, the fee is automatically refunded.
- **XSS-proof UI** — React escapes all rendered text; the v3 nickname exploit is
  structurally impossible.

### ⚙️ Configuration & integrations

- Park-out **anywhere** or only at the **specific** garage the vehicle was
  stored in.
- Bring your own **fuel** system (default: state-bag based, e.g. `ox_fuel`).
- Built-in **TextUI** or plug in your own (e.g. `okokTextUI`), or use
  **`ox_target`**.
- **Auto-detected AdvancedParking** support (persistent vehicles) — enabled
  automatically when the resource runs, with impound deletion handled through
  AdvancedParking so removed cars never respawn.
- Custom license plates, configurable blips, and locales for **EN, DE, HU, FR, ES, PT, PL**.
- Developer-friendly client & server **exports** and park-in / park-out
  **events** for easy integration.

## 📋 Requirements

| | Resource |
|---|---|
| **Required** | [ESX Legacy](https://github.com/esx-framework/esx_core) · [msk_core](https://github.com/MSK-Scripts/msk_core) · [oxmysql](https://github.com/overextended/oxmysql) |
| **Optional** | [AdvancedParking](https://forum.cfx.re/t/advancedparking-v4-11-1-persistent-vehicles-esx-qb-qbox-ox-standalone/2099582) · [VehicleDeformation](https://docs.kiminaze.de/free-scripts/vehicledeformation/) · [MSK VehicleKeys](https://forum.cfx.re/t/esx-qbcore-msk-vehiclekeys-unique-items/5264475) · [VehicleKeyChain](https://forum.cfx.re/t/release-vehicle-key-chain/3319563) · [Jaksam Vehicle Keys](https://forum.cfx.re/t/esx-qbcore-vehicles-keys-vehicles-lock-remote-control-ui-and-much-more/4857274) |

:::info[Vehicle key scripts]
You can add your own vehicle-key adapter in `server/keys/`, but support is only
provided for the scripts listed above. See
[Integrations → Vehicle Keys](./guides/integrations.md#vehicle-keys).
:::

## Next steps

- [Installation](./guides/installation.md) — drag & drop, `server.cfg`, database
- [Admin Dashboard](./dashboard.md) — manage garages, impounds, settings & permissions in-game
- [Configuration](./config.md) — the config files (seed) explained
- [Integrations](./guides/integrations.md) — AdvancedParking, deformation, keys, fuel, target
- [Database](./database.md) — the `owned_vehicles` table, the dashboard tables & auto-migration
- [Events](./events.md) & [Exports](./exports/client.md) — for developers
