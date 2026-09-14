---
title: Vehicle Properties
sidebar_position: 20
---

# Vehicle Properties

Reads and applies the full visual and damage state of a vehicle: colors, mods, extras, neon, liveries, health values and broken windows, doors and tyres.

The field names follow the format that ox_lib and QBCore / Qbox store in `player_vehicles`. Rows written by other garages load here, and rows written here load there. The old QBCore names `modKit17`, `modKit19`, `modKit21`, `modKit47` and `modKit49` are accepted when applying.

## MSK.VehicleProperties.Get

Reads the properties of a vehicle.

**Parameters**  
**vehicle** - `number` - The vehicle entity handle

**Returns**  
**props** - `table | nil` - The properties, or `nil` when the vehicle does not exist

```lua
local props = MSK.VehicleProperties.Get(vehicle)

-- Example
local props = MSK.VehicleProperties.Get(MSK.Player.vehicle)
TriggerServerEvent('my_garage:store', props)

-- As an Export:
local props = exports.msk_core:GetVehicleProperties(vehicle)
```

## MSK.VehicleProperties.Set

Applies properties to a vehicle. Fields that are `nil` are left untouched, so you can also pass only the fields you want to change. The table you pass in is never modified.

:::warning[Owner only]
Vehicle properties only take effect on the client that owns the entity. On any other client the natives do nothing. To apply properties to a vehicle you spawned on the server, use the [server side `Set`](#server-side) instead, it routes the properties to the owner.
:::

**Parameters**  
**vehicle** - `number` - The vehicle entity handle  
**props** - `table` - The properties to apply  
**fixVehicle** - `boolean` - Optional - Default: `false` - Repairs the vehicle first and skips the stored broken windows, doors and tyres. Health values in `props` are still applied

**Returns**  
**applied** - `boolean` - `false` when the vehicle does not exist or `props` is not a table, otherwise `true`

```lua
local applied = MSK.VehicleProperties.Set(vehicle, props, fixVehicle)

-- Example
MSK.VehicleProperties.Set(vehicle, props)

-- Example: only change the colors
MSK.VehicleProperties.Set(vehicle, { color1 = { 0, 230, 118 }, color2 = 0 })

-- As an Export:
local applied = exports.msk_core:SetVehicleProperties(vehicle, props, fixVehicle)
```

## Fields

**General**  
**model** - `number` - The model hash. Only read, `Set` does not change the model  
**plate** - `string` - The plate text  
**plateIndex** - `number` - The plate style

**Health and levels** (rounded to one decimal)  
**bodyHealth** - `number`  
**engineHealth** - `number`  
**tankHealth** - `number`  
**fuelLevel** - `number`  
**oilLevel** - `number`  
**dirtLevel** - `number`

**Colors**  
**paintType1** / **paintType2** - `number` - The paint type of the primary and secondary color  
**color1** / **color2** - `number | table` - A color index, or a custom color `{ r, g, b }`  
**pearlescentColor** - `number`  
**wheelColor** - `number`  
**interiorColor** - `number`  
**dashboardColor** - `number`  
**xenonColor** - `number | table` - A xenon color index, or a custom color `{ r, g, b }`  
**neonColor** - `table` - `{ r, g, b }`  
**tyreSmokeColor** - `table` - `{ r, g, b }`

**Wheels**  
**wheels** - `number` - The wheel type. It is applied before the wheel mods, because the type decides which wheel mods exist  
**modFrontWheels** / **modBackWheels** - `number` - The wheel mods  
**modCustomTiresF** / **modCustomTiresR** - `boolean` - Custom tyres on the front and back wheels  
**wheelWidth** / **wheelSize** - `number` - Rounded to three decimals  
**bulletProofTyres** - `boolean` - See the note below  
**driftTyres** - `boolean | nil` - Drift tyres. These only exist from game build `2372` on. On older builds the field is `nil` when reading and ignored when applying

:::caution[bulletProofTyres means "tyres can burst"]
Despite its name, `bulletProofTyres` stores the raw result of `GetVehicleTyresCanBurst`. `true` means the tyres **can** burst, so a normal vehicle has `true` and a vehicle with bulletproof tyres has `false`. This is how ox_lib writes the field too, and the value has to mean the same in both so stored rows stay compatible.
:::

**Mods**  
Every mod is stored as its mod index, `-1` is stock:

`modSpoilers`, `modFrontBumper`, `modRearBumper`, `modSideSkirt`, `modExhaust`, `modFrame`, `modGrille`, `modHood`, `modFender`, `modRightFender`, `modRoof`, `modEngine`, `modBrakes`, `modTransmission`, `modHorns`, `modSuspension`, `modArmor`, `modNitrous`, `modSubwoofer`, `modHydraulics`, `modPlateHolder`, `modVanityPlate`, `modTrimA`, `modOrnaments`, `modDashboard`, `modDial`, `modDoorSpeaker`, `modSeats`, `modSteeringWheel`, `modShifterLeavers`, `modAPlate`, `modSpeakers`, `modTrunk`, `modHydrolic`, `modEngineBlock`, `modAirFilter`, `modStruts`, `modArchCover`, `modAerials`, `modTrimB`, `modTank`, `modWindows`, `modDoorR`, `modLivery`, `modLightbar`

Toggle mods are booleans (`1` is accepted as well when applying): `modTurbo`, `modSmokeEnabled`, `modXenon`

**Appearance**  
**windowTint** - `number`  
**livery** - `number` - A value below `0` is ignored when applying  
**roofLivery** - `number` - A value below `0` is ignored when applying  
**neonEnabled** - `boolean[]` - Four entries for left, right, front and back  
**extras** - `table` - Keyed by the extra id as a string. `0` means on, `1` means off. When applying, a boolean works too (`true` = on)

**Damage**  
**windows** - `number[]` - The ids of the broken windows  
**doors** - `number[]` - The ids of the broken doors  
**tyres** - `table` - Keyed by the wheel index as a string. `1` = burst, `2` = completely off, on the rim

```lua
-- Example of a stored properties table (shortened)
{
    model = 1234181537,
    plate = 'MSK 123 ',
    bodyHealth = 1000.0,
    engineHealth = 987.5,
    color1 = { 0, 230, 118 },
    color2 = 0,
    modEngine = 3,
    modTurbo = true,
    bulletProofTyres = true,   -- tyres can burst, a normal vehicle
    extras = { ['1'] = 0, ['2'] = 1 },
    windows = { 0 },
    doors = {},
    tyres = { ['0'] = 1 },
}
```

## Server side

The server can not apply vehicle properties itself, only the client that owns the entity can. The server side `Set` therefore writes the properties into a replicated state bag of the vehicle (`msk_core:vehicleProperties`). The owning client applies them, reports back, and the server clears the bag again.

This is the only function of the module on the server. There is no export for it, use it through `MSK.VehicleProperties` in a resource that imports msk_core.

**Parameters**  
**vehicle** - `number` - The server entity handle  
**props** - `table` - The properties to apply  
**fixVehicle** - `boolean` - Optional - Default: `false` - Same as on the client

**Returns**  
**queued** - `boolean` - `true` when the properties were written into the state bag, `false` when the vehicle does not exist

```lua
local queued = MSK.VehicleProperties.Set(vehicle, props, fixVehicle)

-- Example (server)
local vehicle = CreateVehicleServerSetter(model, 'automobile', coords.x, coords.y, coords.z, heading)
MSK.VehicleProperties.Set(vehicle, props)
```

How the client picks it up:

- The state bag can arrive before the entity exists on a client. Each client waits up to 10 seconds for the entity to show up.
- Right after spawning, the owner of a vehicle can still change. So instead of checking once, a client checks up to 10 times, 400 ms apart, whether it owns the vehicle, and applies the properties as soon as it does.
- Only the owner of the vehicle may clear the state bag. A report from any other client is ignored, so nobody can wipe properties that were never applied.
- When nobody owns the vehicle yet because no player is in range, the properties are applied once a client picks the vehicle up and the state bag reaches it.
