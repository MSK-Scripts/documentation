---
title: Admin Dashboard
sidebar_position: 3
---

# In-Game Admin Dashboard

:::tip[New in v5.0.0]
Garages, impounds and settings are no longer edited by hand in the config files.
They live in the **database** and are managed from an in-game **admin dashboard**
— create, edit and delete garages & impounds, change every setting and manage a
**group/permission system**, all applied **live without a server restart**.
:::

## How it works

On the **first start**, the script imports your existing `config/*` (garages,
impounds and the managed settings) **once** into new database tables. From then
on the **database is authoritative** — the config files only act as the default
template for a fresh install.

```text
config/garages.lua  ─┐
config/impounds.lua  ├─ seeded once ─► database ◄─ managed live by the dashboard
config/settings.lua ─┘
```

See [Database](./database.md) for the tables that are created.

## Opening the dashboard

Use the command (default `garageadmin`):

```text
/garageadmin
```

The command name itself is configurable from the dashboard (Settings tab) and
also via [`Config.adminCommand`](./config.md) for a fresh install.

## Who can open it

Access is **not** tied to the command being ACE-restricted — it is decided in
code, so it always respects the rules below:

- **`group.admin`** can always open it and always has **every** right. This role
  cannot be edited or removed.
- **`group.user`** can **never** open the dashboard (hard blacklist).
- Any other group must be added to the **Command access** list (Permissions tab,
  stored as [`Config.dashboardGroups`](./config.md)) **and** have at least one
  right assigned.

:::info[Groups come from your server.cfg]
FiveM cannot enumerate ACE groups, so groups are **added by name** in the
dashboard and checked at runtime with `IsPlayerAceAllowed('group.<name>')`. The
group must therefore exist as a principal in your `server.cfg`, e.g.:

```cfg title="server.cfg"
add_ace group.admin command allow
add_principal identifier.license:xxxxxxxx group.admin

add_ace group.mod command allow
add_principal identifier.license:yyyyyyyy group.mod
```

The "Check" button next to a group is a best-effort validation (it reports
whether any online player is currently in that group); you can still save a group
that has no one online.
:::

## Permissions

There are **10 rights**. `group.admin` always has all of them.

| Right | Allows |
|---|---|
| `garage.view` | See the garages tab |
| `garage.create` | Add new garages |
| `garage.edit` | Edit existing garages |
| `garage.delete` | Delete garages |
| `impound.view` | See the impounds tab |
| `impound.create` | Add new impounds |
| `impound.edit` | Edit existing impounds |
| `impound.delete` | Delete impounds |
| `settings.manage` | Edit the global settings |
| `permissions.manage` | Manage groups, rights and command access |

Every action is **validated server-side** against the caller's effective rights
(the union of all their groups). The UI only hides what a user can't do — the
server is the source of truth, so the buttons can't be bypassed.

## Tabs

### Garages / Impounds

List, create, edit and delete entries. The list can be filtered by **search**
(id/label) and by **vehicle type**. While adding or editing you can:

- Capture coordinates in-game with the **"Current position"** button (no need to
  copy/paste from a separate tool).
- Manage multiple **locations** (entrances) and **park-out points** as lists.
- Configure vehicle types, blip, ped, 3D text, marker, job restriction (garages)
  and the fee (impounds).
- **Job restriction** (garages): pick the job from a dropdown of all server jobs,
  then tick the **exact ranks** that may use the garage in the rank popup (see
  [Config → Jobs block](./config.md#jobs-block)).
- **NPC vs. marker/3D-text**: when the **NPC (ped)** is enabled, the **Marker**
  and **3D-Text** sections are greyed out and disabled — those are only shown
  in-world when no ped is used.

Changes are pushed to all players instantly — blips and interaction points are
rebuilt without a restart.

### Settings

Edit every dashboard-managed setting (locale, hotkey, parking mode, impound
options, …). Two fields are **dropdowns** populated from the adapters available
in code:

- **Target script** — see [`AdminPerms.TARGET_SCRIPTS`](./guides/integrations.md#target--textui)
- **Vehicle key script** — see [Vehicle Keys](./guides/integrations.md#vehicle-keys)

The **default garages** are set per category here (see below).

### Permissions

- Add/remove groups and toggle their rights in a matrix (`group.admin` is shown
  locked with all rights on).
- Manage the **Command access** list — which groups may open the dashboard.

## Default garages per category

Default garages are configured **per vehicle category** — **land**, **sea** and
**air**:

| Category | Vehicle types |
|---|---|
| `land` | car, truck, bike, bicycle, trailer, train |
| `sea` | boat, submarine |
| `air` | helicopter, aircraft, plane |

When a garage is **deleted**, the vehicles stored there are reassigned to the
default garage of the **matching category**.

:::warning[Default garages are protected]
A garage that is currently set as a default (land/sea/air) **cannot be deleted**.
Pick a different default in the Settings tab first, then delete it.
:::
