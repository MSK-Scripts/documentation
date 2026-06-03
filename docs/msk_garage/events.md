---
title: Events
sidebar_position: 4
---

# Events

The script emits these events on **both** the client and the server so other
resources can react to park-in / park-out. They are plain `TriggerEvent` calls,
so use `AddEventHandler` (not `RegisterNetEvent`).

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
