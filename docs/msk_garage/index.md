---
title: MSK Garage
sidebar_position: 1
---

# MSK Garage

[**Tebex [14.99€ inkl. MwSt.]**](https://www.msk-scripts.de/category/encrypted) — _Encrypted_  
[**Tebex [29.99€ inkl. MwSt.]**](https://www.msk-scripts.de/category/source-code) — _Source Code_

[**CFX Post**](https://forum.cfx.re/t/esx-msk-garage-and-impound/5122014)

:::tip[v4.0.0 — Full Rewrite]
The UI was rebuilt in **React + Vite + TypeScript** (no more jQuery / external
CDNs — everything is bundled and works offline) and the backend was moved to a
strict **server-authority** model: every park-in / park-out is validated
server-side, custom garages are [registered server-side](./exports/server.md),
and the impound fee is always charged on the server (and refunded on failure).
:::

## Description

- Set as many Garages and Impounds as you want
- Custom License plates support (e.g. "CUSTOM")
- Park in and park out a vehicle if you have a Key _(supported KeyScript required)_
- Set waypoint to your vehicle at the Impound
- Built-in TextUI or your own (e.g. okokTextUI) — or use `ox_target`
- Set if vehicles park out where they parked in, or everywhere
- Set your own Fuel System _(default: ox_fuel)_
- Set Jobs and Grades who can access the Garage or Impound
- Car, boat or air Garage support
- Multiple parkout spots per garage
- Set the Blip or deactivate it
- Set a vehicle as Favourite and rename it
- Server-side validated spawns (anti-dupe plate lock, spawn claim/rollback)

## Requirements

- [ESX Legacy](https://github.com/esx-framework/esx_core)
- [msk_core](https://github.com/MSK-Scripts/msk_core)
- [oxmysql](https://github.com/overextended/oxmysql)

## Optional Requirements

- [AdvancedParking](https://forum.cfx.re/t/advancedparking-v3-0-major-update-esx-qb-standalone/2099582)
- [MSK VehicleKeys](https://forum.cfx.re/t/esx-qbcore-msk-vehiclekeys-unique-items/5264475)
- [VehicleKeyChain](https://forum.cfx.re/t/release-vehicle-key-chain/3319563)
- [Jaksam Vehicle Keys](https://forum.cfx.re/t/esx-qbcore-vehicles-keys-vehicles-lock-remote-control-ui-and-much-more/4857274)
