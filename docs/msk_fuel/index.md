---
title: MSK Fuel
sidebar_position: 1
---

# MSK Fuel

Fuel System for Vehicles.

This script uses the native [Fuel consumption](https://docs.fivem.net/docs/scripting-manual/using-new-game-features/fuel-consumption/).

[GitHub Download](https://github.com/MSK-Scripts/msk_fuel)

## Description

A fully network-synced fuel system built on the native FiveM fuel-consumption feature. The complete fuel state (level, max volume, fuel type) is stored on StateBags.

- **4 fuel types** – Gas, Diesel, Kerosin (planes & helicopters) and Electric, mapped per vehicle model.
- **Realistic refueling** – grab the nozzle from a pump, attach it to the vehicle via a physical rope, and put it back when done.
- **Petrolcan** – buy, refill and refuel vehicles anywhere; durability is consumed while fueling.
- **Wrong fuel & engine damage** – filling more than a configurable amount of the wrong fuel causes a progressive engine failure (repairable via command).
- **Fuel consumption** – only while the engine runs, with extra loss on a damaged tank; per-model tank-volume overrides.
- **Fuel stations** – default map pumps, custom spawned stations, and vehicles/trailers (tankers, generators) as mobile stations.
- **Anti-exploit** – all prices and fuel amounts are validated and recalculated serverside, with a proximity check on the vehicle.
- **Multi-language** (German & English) and built-in version checker.

## Requirements

- [msk_core](https://github.com/MSK-Scripts/msk_core)
- ox_target
- ox_inventory

## Optional

- [msk_enginetoggle](https://github.com/MSK-Scripts/msk_enginetoggle) – integrates engine on/off and damage state
