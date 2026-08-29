---
title: Job vehicles
sidebar_position: 3
---

# Job vehicles

How faction vehicles are owned, where they show up, and what happens when a player
leaves the job.

## Ownership: player vs society

A job garage decides through `jobs.identifier` who actually owns the vehicles
parked there:

| `jobs.identifier` | Owner in `owned_vehicles` | Shared across the job? | Survives leaving the job? |
|---|---|---|---|
| `player` | The player's identifier | No | Yes, but unusable for them |
| `society` | `society_<job>` (see `Config.useSocietyName`) | Yes | Yes, stays with the faction |

With `player` ownership a vehicle stays bound to whoever bought it. If that
character leaves the job, the row keeps its `job` value, the vehicle disappears
from their garage list and nobody can retrieve it any more. It just sits in the
database.

:::tip
If you want faction vehicles to belong to the **faction** rather than to a single
member, set `Config.useSocietyName = true` and use `identifier = 'society'` on the
job garage. That sidesteps the whole leftover problem below.
:::

## Faction filter in the garage

:::tip[New in v5.4.0]
:::

Wherever job vehicles and private vehicles end up in the same list, a public
garage whose [job policy](../dashboard.md#job-garages) allows that job, for
instance, the park-out list offers a **faction filter** next to the favourites
filter. Enabled, it shows only the job vehicles of that garage; disabled, the full
list comes back. It always starts **off** when the garage is opened, and the button
is hidden entirely when the list holds no job vehicles at all.

## Deleting vehicles on a job change

:::tip[New in v5.4.0]
:::

To stop orphaned faction vehicles from piling up, enable **Settings → Faction
vehicles & keys → "Delete faction vehicles on job change"**
([`Config.deleteJobVehiclesOnJobChange`](../config.md), **off by default**).

When a player leaves a job, every vehicle that

- they **personally own** (`owner` = their identifier), and
- is registered on the job they just left

is **permanently deleted** from `owned_vehicles`.

:::danger[This cannot be undone]
There is no grace period and no recycle bin. Leave the setting off unless you
really want the vehicles gone, and take a database backup before switching it on
for the first time.
:::

What does **not** trigger a deletion:

- A **grade change** inside the same job (promotion, demotion).
- **Society vehicles.** Those are owned by `society_<job>`, so the owner filter can
  never match them.
- Civilian rows (`Config.MySQL.civ`) and the `unemployed` job.

The feature hooks the serverside ESX event
[`esx:setJob`](https://docs.esx-framework.org/en/esx_core/es_extended/events/server#esxsetjob),
which is never registered as a net event and can therefore not be faked from a
client. Every deletion is printed to the server console together with the affected
plates.

### Cleaning up afterwards

Deleting the vehicle row does not touch anything **other** resources store about
that plate. Vehicle keys are handled out of the box by the hook in
`server/handler.lua`, so no key of a vehicle that no longer exists is left behind.
Remove the loop if you'd rather keep the keys, and extend the hook with whatever
else references those plates:

```lua
AddEventHandler('msk_garage:jobVehiclesDeleted', function(identifier, jobName, plates)
    for _, plate in ipairs(plates) do
        Keys.RemoveAllKeys(identifier, plate)
    end
end)
```

`Keys.RemoveAllKeys` goes through the **adapter** of whatever script is configured
in `Config.VehicleKeys` (see [Vehicle Keys](./integrations.md#vehicle-keys)), so the
same line works for every supported key script instead of being hardcoded to one.

How far the cleanup reaches depends on what the key script exposes:

| Adapter | Export used | Scope |
|---|---|---|
| `msk_vehiclekeys` | `RemoveAllExistingKeys` | All key types of **all** players |
| `VehicleKeyChain` | `RemoveAllKeysUsingPlate` | All keys of **all** players |
| `vehicles_keys` | `removeKeysFromIdentifier` | Only the keys of the **given owner** |

`vehicles_keys` offers no plate-wide remove, so second-key holders of that plate
keep their keys there. `RemoveAllKeys` is also an **optional** part of the adapter
contract: an adapter without it turns the call into a harmless no-op, which matters
if you add your own adapter in `server/keys/`. Those files are not
escrow-protected, so you can adjust the exports to whatever your build ships.

## Second-key badge

:::tip[New in v5.4.0]
:::

Vehicles that only appear in your list because you hold a key for them
(`Config.parkoutWithKey`, see [Vehicle Keys](./integrations.md#vehicle-keys)) are
badged on the vehicle card, in the garage as well as in the impound:

- **"Key from &lt;owner name&gt;"** when the owner's character name could be resolved.
- **"Second key"** when it could not, or when the name display is switched off.

The toggle lives in **Settings → Faction vehicles & keys → "Show the owner's name
on the second-key badge"** ([`Config.showKeyOwnerName`](../config.md), **on by
default**). Names are resolved by `Utils.GetOwnerName` in `shared/utils.lua`: the
online player first, then the ESX `users` table, with a fallback for older
single-`name`-column schemas. Results are cached for five minutes. Society owners
never get a name. Those aren't people.

Running a different framework or a `users` table that doesn't match? Rewrite the
body of that function, it is not escrow-protected.
