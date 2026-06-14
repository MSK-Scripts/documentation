---
title: Integrations
sidebar_position: 2
---

# Integrations

`msk_garage` is built to slot into an existing server. Every integration below is
**optional** and auto-detected (the script checks `GetResourceState`), so you
only enable what you actually run.

## AdvancedParking

[AdvancedParking](https://forum.cfx.re/t/advancedparking-v4-11-1-persistent-vehicles-esx-qb-qbox-ox-standalone/2099582)
makes spawned vehicles persistent — it saves any vehicle a player interacts with
and **respawns it when a player gets close**.

```lua title="config/settings.lua"
Config.AdvancedParking = true
```

When enabled:

- **Park-in** removes the stored vehicle through AdvancedParking
  (`DeleteVehicleUsingData`) instead of a plain `DeleteEntity`, so it is taken
  out of AdvancedParking's table and **does not respawn**.
- **Impound park-out** purges the old world copy from AdvancedParking's table
  (`keepInWorld = false`) before the fresh vehicle spawns. Without this step
  AdvancedParking would simply respawn the old car, leaving two vehicles.

:::tip
If you spot a vehicle "coming back" after it should have been removed, the cause
is almost always an AdvancedParking integration that was disabled while the
resource is still running. Keep `Config.AdvancedParking` in sync with whether
`AdvancedParking` is actually started.
:::

## VehicleDeformation

Visual body damage (the actual **dents**, not just the health value) is not part
of standard vehicle properties. To persist it, install
[VehicleDeformation](https://docs.kiminaze.de/free-scripts/vehicledeformation/).

- On **park-in** the script reads the deformation
  (`GetVehicleDeformation`) and stores it in the `deformations` column.
- On **park-out** it reapplies it (`SetVehicleDeformation`) once the client owns
  the entity.

No configuration is needed — the integration activates automatically when the
`VehicleDeformation` resource is started. Without it, mechanical condition
(engine/body/tank health, dirt) is still preserved through the vehicle
properties; only the visual dents are skipped.

:::note[Why it "just works"]
The deformation offsets are `vector3` values that don't survive JSON storage
intact, so the script flattens them to plain numbers on save and rebuilds real
`vector3`s on load. This is handled internally — you don't have to do anything.
:::

## Vehicle Keys

Key holders (players who own a key but not the vehicle itself) can park the
vehicle in and out.

```lua title="config/settings.lua"
Config.VehicleKeys = {
    enable = true,
    script = 'msk_vehiclekeys', -- msk_vehiclekeys | VehicleKeyChain | vehicles_keys
}
Config.parkoutWithKey = true     -- key holders may also retrieve from the impound
```

Supported out of the box (bridges live in `server/keys/`):

| `Config.VehicleKeys.script` | Resource |
|---|---|
| `msk_vehiclekeys` | [MSK VehicleKeys](https://forum.cfx.re/t/esx-qbcore-msk-vehiclekeys-unique-items/5264475) |
| `VehicleKeyChain` | [Vehicle Key Chain](https://forum.cfx.re/t/release-vehicle-key-chain/3319563) |
| `vehicles_keys` | [Jaksam Vehicle Keys](https://forum.cfx.re/t/esx-qbcore-vehicles-keys-vehicles-lock-remote-control-ui-and-much-more/4857274) |

:::info[Adding your own]
Drop a new adapter file into `server/keys/` that returns the keys for a player,
then set `Config.VehicleKeys.script` to its name. Only the three adapters above
are officially supported.
:::

## Fuel

Fuel is read/written through two adapter functions, so any fuel script works.
The default uses the vehicle state bag (compatible with `ox_fuel` and similar):

```lua title="config/settings.lua"
Config.SetFuel = function(vehicle, fuel)
    Entity(vehicle).state.fuel = fuel
end

Config.GetFuel = function(vehicle)
    return Entity(vehicle).state.fuel
end
```

Replace the bodies with your fuel resource's exports if needed (e.g.
`exports.LegacyFuel:SetFuel(vehicle, fuel)`).

## Target & TextUI

```lua title="config/settings.lua"
Config.TargetSystem = {
    enable = true,
    script = 'ox_target', -- adapter in client/target.lua
}

Config.defaultTextUI = true          -- built-in msk_core HelpNotification
Config.openTextUI = function(coloredText, uncoloredText)
    exports['okokTextUI']:Open(uncoloredText, 'darkblue', 'left')
end
Config.closeTextUI = function()
    exports['okokTextUI']:Close()
end
```

- **`Config.TargetSystem`** — when enabled, interaction runs through the target
  script (default `ox_target`). Add adapters for `qb-target`, `qtarget`, … in
  `client/target.lua`.
- **`Config.defaultTextUI`** — `true` uses the built-in `msk_core`
  HelpNotification; `false` routes prompts through your own
  `Config.openTextUI` / `Config.closeTextUI`.

## Custom garages from other scripts

Other resources can open a fully custom garage/impound for a player. The
definition must be **registered server-side** first (so it can't be forged), then
the client opens the UI. See the full flow in
[Server Exports](../exports/server.md#example-full-server-side-flow).
