---
title: Private garages
sidebar_position: 4
---

# Private garages

A garage is **private as soon as it has an owner**. Only that owner and the
people they let in can park there. A garage without an owner is a normal public
garage and behaves exactly as it always has.

This is what makes a house garage work: the owner of the house is the only one
who can use it, and they decide who else may.

:::info[Nothing changes until you use it]
If you never set an owner on any garage, this whole page is irrelevant to your
server. Nothing about your existing garages changes.
:::

## The quick way, without a housing script

No configuration needed.

**An admin hands a garage to a player** (needs the `garage.edit` right, or the
server console):

```
/garageowner haus_17 12       -- garage haus_17 now belongs to server id 12
/garageowner haus_17 clear    -- haus_17 is a public garage again
```

**The owner shares it from the garage menu.** A private garage they own shows an
**Access** button in the header of the garage UI. It opens a dialog that lists
who may currently park there, takes a server id to let somebody in, and removes
people again with one click. Both sides get a notification. The button only
exists for the owner.

If the garage is out of reach, the same works as a command:

```
/garagezugriff                       -- which private garages do I own?
/garagezugriff haus_17               -- who may use it?
/garagezugriff haus_17 add 34        -- let server id 34 in
/garagezugriff haus_17 remove 34     -- take them out again
```

Both command names can be changed in `config/static.lua`
(`Config.privateAccessCommand`, `Config.privateOwnerCommand`).

:::note[Server id in, identifier stored]
You type the server id you see in the scoreboard, but what gets stored is always
the player's identifier. A server id belongs to a session and is handed to
somebody else after a reconnect. The command form of `remove` also accepts an
identifier directly, because the person you want to remove is usually offline.
:::

:::info[Only the owner, and it is checked twice]
Someone you let in cannot pass the garage on. The UI hides the button for
everyone but the owner, and the server checks ownership again on every single
call, so hiding it is comfort rather than security.
:::

### What a guest can and cannot do

Someone you let in may **park their own vehicles** there and take them out
again. They do **not** see your vehicles: msk_garage always filters the list by
the owner of the vehicle, so everyone only ever sees their own cars plus the
ones they hold a key for. And they cannot pass the garage on, only the owner
hands out access.

## Connecting a housing script

Doing all of this by hand does not scale past a handful of houses. With two
hundred houses you want the housing script to do it.

msk_garage does **not** know any housing script by name. It offers an interface,
and there are two directions to choose from.

### Push: your housing script tells msk_garage

This is the better way whenever you can add a few lines to your housing script,
or hook its events from a small resource of your own. No configuration, no
polling, and a house sale takes effect immediately.

```lua
-- when a house is bought
exports.msk_garage:CreatePrivateGarage({
    houseRef = houseId,                       -- the id YOUR script uses
    owner    = xPlayer.identifier,
    location = vector4(x, y, z, heading),     -- where the garage marker sits
    parkOut  = { vector4(x, y, z, heading) }, -- where the car comes out
    label    = 'Haus 17',                     -- optional
})

-- when it is sold on
exports.msk_garage:SetPrivateGarageOwner(houseId, newOwner.identifier)

-- when the house is removed
exports.msk_garage:DeletePrivateGarage(houseId)
```

You only pass coordinates and an owner. The ped, blip, marker, vehicle types and
distances all come from `Config.PrivateGarageTemplate` in `config/static.lua`, so
your housing script never has to build a full garage definition.

All seven exports are documented under
[Server exports](../exports/server.md#private-garages).

### Pull: msk_garage asks your housing script

For housing scripts you cannot patch. Configure **one** adapter in
`config/static.lua`.

#### `db`: read the housing table

The adapter that works with **every** housing script, including escrow protected
ones: their table stays readable even when their code is not.

Open the housing table once in HeidiSQL or phpMyAdmin and read off two column
names, the one holding the house id and the one holding the player identifier.

```lua
Config.Housing = {
    enable = true,
    script = 'db',
    db = {
        table       = 'owned_properties',
        houseColumn = 'name',
        ownerColumn = 'owner',
    },
}
```

The values above are the layout of **esx_property**. Other scripts ship their own
SQL file, look there or at the table itself. `Config.HousingPresets` in
`config/static.lua` collects the mappings that have been verified.

:::warning[Verify against your own database]
A preset is a starting point, not a guarantee. Servers migrate and rename
things. A wrong column name that looks official is worse than no entry at all,
which is why msk_garage does not ship guessed mappings for scripts whose schema
is not public.
:::

#### `export`: call an export

For housing scripts that expose some form of "who owns this house" export. You
supply the names, so this keeps working when the script changes its API.

```lua
Config.Housing = {
    enable   = true,
    script   = 'export',
    resource = 'your-housing',
    export = {
        getOwner   = 'GetHouseOwner',  -- (houseRef) -> identifier or table
        ownerField = nil,              -- set when it returns a table
    },
}
```

A wrong export name is reported once in the console and then the adapter stays
quiet, it will not spam on every park-in.

#### `custom`: write it yourself

```lua
Config.Housing = { enable = true, script = 'custom' }

Config.HousingHooks = {
    GetOwner = function(houseRef)
        return exports['your-housing']:whatever(houseRef)
    end,
}
```

### Linking a garage to a house

The pull adapters need to know which house a garage belongs to. That link is the
`house_ref` column on `msk_garage_garages`. `CreatePrivateGarage` sets it for
you; for a garage you created by hand, set it once directly in the database.

The garage id and the house id do **not** have to match, which matters because
housing scripts use UUIDs and names with spaces while a garage id is limited to
60 characters of `A-Z a-z 0-9 _ -`.

### Keeping both in sync

In a pull setup msk_garage mirrors the housing owner into its own column every
`Config.HousingSyncMinutes` minutes (0 disables it). That is needed because
deciding **who sees which blip** is answered from memory: asking the housing
script once per private garage per player joining would mean hundreds of queries
on a server with hundreds of houses. The access check itself always asks the
housing script, so a house sale takes effect immediately either way.

In a push setup there is nothing to sync, the column is already current.

:::note[A stopped housing script does not lock anybody out]
If the housing resource is not running, or the adapter returns nothing,
msk_garage falls back to the owner stored in its own column. It never treats
"no answer" as "no access".
:::

## Things worth knowing

**A car can never be locked inside a garage.** When somebody loses access, when
the garage changes hands, when a public garage becomes private, and when a
housing script re-registers a house after a resale, the affected vehicles are
moved to the default garage of their category first. Boats go to the sea
default, helicopters to the air one. Turning a private garage public again moves
nothing, because everybody may use it afterwards.

**`Config.Parking` decides how exclusive a private garage really is.** With
`'specific'` a vehicle lives in the garage it was parked in, which is what makes
a house garage feel like one. With `'all'` every player can retrieve every car
from every garage, so a private garage is only an additional access point, not
an exclusive one.

**Private garages are invisible to everyone else.** They are not part of the
definitions other players receive, so no blip, no marker, and no way to see that
the garage exists at all. The owner identifier is never sent to any client.

## Related

- [Server exports](../exports/server.md#private-garages)
- [Integrations](./integrations.md)
- [Database](../database.md)
