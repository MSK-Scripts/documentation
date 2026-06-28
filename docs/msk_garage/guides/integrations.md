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

:::info[Auto-detected — no config flag (v5.0.0)]
There is no `Config.AdvancedParking` setting anymore. The integration is enabled
**automatically** whenever the `AdvancedParking` resource is running
(`Config.UsesAdvancedParking()` in `config/static.lua`). Just `ensure` it before
`msk_garage` and you're done.
:::

When AdvancedParking is running:

- **Park-in** removes the stored vehicle through AdvancedParking
  (`DeleteVehicleUsingData`) instead of a plain `DeleteEntity`, so it is taken
  out of AdvancedParking's table and **does not respawn**.
- **Impound park-out** purges the old world copy from AdvancedParking's table
  (`keepInWorld = false`) before the fresh vehicle spawns. Without this step
  AdvancedParking would simply respawn the old car, leaving two vehicles.

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

Supported out of the box (bridges live in `server/keys/`). The script is a
**dropdown** in the [Admin Dashboard](../dashboard.md) (Settings tab), populated
from `AdminPerms.VEHICLEKEY_SCRIPTS`:

| `Config.VehicleKeys.script` | Resource |
|---|---|
| `msk_vehiclekeys` | [MSK VehicleKeys](https://forum.cfx.re/t/esx-qbcore-msk-vehiclekeys-unique-items/5264475) |
| `VehicleKeyChain` | [Vehicle Key Chain](https://forum.cfx.re/t/release-vehicle-key-chain/3319563) |
| `vehicles_keys` | [Jaksam Vehicle Keys](https://forum.cfx.re/t/esx-qbcore-vehicles-keys-vehicles-lock-remote-control-ui-and-much-more/4857274) |

:::info[Adding your own]
Drop a new adapter file into `server/keys/` that returns the keys for a player,
add its name to `AdminPerms.VEHICLEKEY_SCRIPTS` in `shared/admin_perms.lua` (so it
shows up in the dropdown), then select it in the dashboard. Only the three
adapters above are officially supported.
:::

## Fuel

Fuel is read/written through adapter functions in **`config/static.lua`**, so any
fuel script works. **msk_fuel is auto-detected**: when it runs, fuel is read and
written as **exact liters** via its exports and the UI shows the real tank volume
(e.g. `50 / 65 L`); otherwise the vehicle **state bag** is used (compatible with
`ox_fuel` and similar) and the UI shows a percentage.

```lua title="config/static.lua"
Config.UsesMskFuel = function()
    return GetResourceState('msk_fuel') == 'started'
end

Config.SetFuel = function(vehicle, fuel)
    if Config.UsesMskFuel() then
        exports.msk_fuel:SetVehicleFuel(vehicle, fuel)
        return
    end
    Entity(vehicle).state.fuel = fuel
end

Config.GetFuel = function(vehicle)
    if Config.UsesMskFuel() then
        return exports.msk_fuel:GetVehicleFuel(vehicle)
    end
    return Entity(vehicle).state.fuel
end
```

Replace the non-msk_fuel branches with your fuel resource's exports if needed
(e.g. `exports.LegacyFuel:SetFuel(vehicle, fuel)`).

:::note[Stored-vehicle max volume]
For **stored** vehicles (the park-out / impound list, where no live entity
exists) the `X / Y L` denominator comes from msk_fuel's per-model override, or
falls back to [`Config.FuelTankDefaultVolume`](../config.md) (default `65.0 L`).
:::

## Target & TextUI

```lua title="config/settings.lua"
Config.TargetSystem = {
    enable = true,
    script = 'ox_target', -- selectable in the dashboard; adapters in client/target.lua
}

Config.defaultTextUI = true -- true = msk_core TextUI, false = your Config.openTextUI/closeTextUI
```

```lua title="config/static.lua"
Config.openTextUI = function(coloredText, uncoloredText)
    MSK.TextUI.Show('E', coloredText)
end
Config.closeTextUI = function()
    MSK.TextUI.Close()
end
```

- **`Config.TargetSystem`** — when enabled, interaction runs through the target
  script (default `ox_target`). The script is a **dropdown** in the
  [Admin Dashboard](../dashboard.md), populated from `AdminPerms.TARGET_SCRIPTS`
  (`shared/admin_perms.lua`). Add adapters for `qb-target`, `qtarget`, … in
  `client/target.lua` and list them there.
- **`Config.defaultTextUI`** — `true` uses the built-in `msk_core` TextUI;
  `false` routes prompts through your own `Config.openTextUI` / `Config.closeTextUI`
  in `config/static.lua`.

## Custom garages from other scripts

Other resources can open a fully custom garage/impound for a player. The
definition must be **registered server-side** first (so it can't be forged), then
the client opens the UI. See the full flow in
[Server Exports](../exports/server.md#example-full-server-side-flow).
