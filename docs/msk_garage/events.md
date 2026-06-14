---
title: Events
sidebar_position: 5
---

# Events

The script emits these events on **both** the client and the server so other
resources can react to park-in / park-out. They are plain `TriggerEvent` calls,
so use `AddEventHandler` (not `RegisterNetEvent`).

:::tip
Empty handler stubs already exist in `client/handler.lua` and
`server/handler.lua` — both files are escrow-open, so you can add your own logic
there directly if you prefer not to create a separate resource.
:::

## Client events

```lua
-- Fired locally after the player parked a vehicle in
AddEventHandler('msk_garage:vehicleParkedIn', function(vehicle, props, plate, fuel, garage)
end)

-- Fired locally after the player parked a vehicle out of a garage
AddEventHandler('msk_garage:vehicleParkedOut', function(vehicle, plate, fuel, props, garage)
end)

-- Fired locally after the player parked a vehicle out of an impound
AddEventHandler('msk_garage:vehicleParkedOutImpound', function(vehicle, plate, fuel, props, impound)
end)
```

| Argument | Type | Description |
|---|---|---|
| `vehicle` | `number` | The local vehicle entity handle |
| `props` | `table` | ESX vehicle properties |
| `plate` | `string` | The vehicle plate |
| `fuel` | `number` | Fuel level |
| `garage` / `impound` | `table` | The resolved garage / impound definition |

:::note[Argument order]
Note the order differs slightly between `vehicleParkedIn`
(`vehicle, props, plate, fuel, …`) and the two park-out events
(`vehicle, plate, fuel, props, …`).
:::

## Server events

```lua
-- Fired after a vehicle was parked in
AddEventHandler('msk_garage:vehicleParkedIn', function(netId, plate, fuel, props, garage)
end)

-- Fired after a vehicle was parked out of a garage
AddEventHandler('msk_garage:vehicleParkedOut', function(netId, plate, fuel, props, garage)
end)

-- Fired after a vehicle was parked out of an impound
AddEventHandler('msk_garage:vehicleParkedOutImpound', function(netId, plate, fuel, props, impound)
end)
```

| Argument | Type | Description |
|---|---|---|
| `netId` | `number` | The network id of the affected vehicle |
| `plate` | `string` | The vehicle plate |
| `fuel` | `number` | Fuel level |
| `props` | `table` | Vehicle properties |
| `garage` / `impound` | `table` | The resolved garage / impound definition |
