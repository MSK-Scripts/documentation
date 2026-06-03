---
title: MSK Garage
sidebar_position: 1
---

# MSK Garage & Impound

[**CFX Post**](https://forum.cfx.re/t/esx-msk-garage-and-impound/5122014)

:::tip[v4.0.0 — Full Rewrite]
The UI was rebuilt in **React + Vite + TypeScript** (no more jQuery / external
CDNs — everything is bundled and works offline) and the backend was moved to a
strict **server-authority** model: every park-in / park-out is validated
server-side, custom garages are [registered server-side](./exports/server.md),
and the impound fee is always charged on the server (and refunded on failure).
:::

## Features

You can add your own Vehicle Key Script in `server/keys/` , but I can only give support for the Scripts that I've mentioned below at Optional Requirements ! 

### ✨ Highlights
* Unlimited garages & impounds — define as many locations as you want, each with its own ped, blip, 3D text, marker and park-out spots.
* Cars, boats & aircraft — separate vehicle categories (car, truck, boat, helicopter, aircraft) so the right vehicles show up at the right place.
* Job & society garages — restrict access by job and minimum grade; job vehicles can be owned per-player or shared across the whole society.
* Impound system — recover lost vehicles (after crash, death or server restart) for a configurable fee, with an in-UI track waypoint to locate the car.
* Vehicle keys support — key holders can park in and out too. Works with msk_vehiclekeys, VehicleKeyChain and vehicles_keys out of the box.
* Favourites & custom names — players can mark vehicles as favourites and rename them.

### 🎨 Modern UI (rebuilt in v4.0.0)
* Brand-new interface built with React + Vite + TypeScript in the clean MSK dark/green design.
* 100% offline — all fonts and icons are bundled. No jQuery, no Google Fonts, no FontAwesome CDN, zero external requests at runtime.
* Live search, fuel bars, vehicle-class icons and a fast, responsive layout.

### 🔒 Security-first backend
* Server authority on everything — every park-in / park-out is validated server-side. The client can never inject a garage definition, plate, or fee.
* Anti-dupe protection — per-plate spawn locks plus a spawn claim/rollback flow keep the world and database consistent, even on connection hiccups.
* Safe custom garages — third-party scripts register custom garages/impounds server-side, so park-out coordinates and fees can't be forged.
* Guaranteed refunds — if an impound park-out fails for any reason after charging, the fee is automatically refunded.
* XSS-proof UI — React escapes all rendered text; the v3 nickname exploit is structurally impossible.

### ⚙️ Configuration & integrations
* Park-out anywhere or only at the specific garage the vehicle was stored in.
* Bring your own fuel system (default: ox_fuel).
* Built-in TextUI or plug in your own (e.g. okokTextUI), or use ox_target.
* Optional AdvancedParking support.
* Custom license plates (e.g. "CUSTOM"), configurable blips, and full EN/DE locales.
* Developer-friendly client & server exports and park-in/park-out events for easy integration.

## 📋 Requirements
* [ESX Legacy](https://github.com/esx-framework/esx_core) · [msk_core](https://github.com/MSK-Scripts/msk_core) · [oxmysql](https://github.com/overextended/oxmysql)
* **Optional:** [AdvancedParking](https://forum.cfx.re/t/advancedparking-v4-11-1-persistent-vehicles-esx-qb-qbox-ox-standalone/2099582) · [MSK VehicleKeys](https://forum.cfx.re/t/esx-qbcore-msk-vehiclekeys-unique-items/5264475) · [VehicleKeyChain](https://forum.cfx.re/t/release-vehicle-key-chain/3319563) · [Jaksam Vehicle Keys](https://forum.cfx.re/t/esx-qbcore-vehicles-keys-vehicles-lock-remote-control-ui-and-much-more/4857274)
