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

:::tip[New in v5.1.0]
The dashboard gained a **[Job Garages](#job-garages) tab** (per-job whitelist /
blacklist of public garages), **[UI colour theming + an editable brand
tag](#colors--branding)**, and support for **[per-model vehicle
images](#vehicle-images)**.
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

:::note[Framework groups and luxu_admin are recognised too]
Group membership is not limited to `server.cfg` ACE principals. A player counts as
being in a group if **any** of these match: the FiveM ACE principal
(`group.<name>`), the **framework group** (e.g. an ESX/QBCore group stored in the
`users` table, even without a matching `add_principal`), or, when enabled, the
player's **luxu_admin v2** staff group.

luxu_admin keeps its staff groups internally (not as ACE principals), so it is
resolved via its `getPlayerStaffGroup` export. Enable and tune it in
`config/static.lua` through [`Config.LuxuAdmin`](./config.md) (`enable`,
`resource`, `requireDuty`, and an optional `groupMap` to map luxu_admin group
names onto your dashboard groups).
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

### Job Garages

:::tip[New in v5.1.0]
Requires the `settings.manage` right.
:::

By default a **job vehicle can only be parked at its own job garage**. This tab
lets you grant a job access to **public (civilian) garages** as well — and control
exactly which ones. For each job you choose a **mode** and pick the public garages:

| Mode | Meaning |
|---|---|
| **Whitelist** | The job may use **only** the selected public garages. |
| **Blacklist** | The job may use **all** public garages **except** the selected ones. |

- A job with **no entry** has **no** public-garage access (the default).
- A **whitelist with nothing selected** = no access; a **blacklist with nothing
  selected** = all public garages.
- **Select all / Deselect all** buttons and a job search make bulk edits quick.

The policy is enforced **server-side** on the vehicle list, park-in, park-out and
the park-in pre-check, so it can't be bypassed from the client. Only **public**
garages (those without a job restriction) are selectable; job garages keep working
as before.

### Settings

Edit every dashboard-managed setting (locale, hotkey, parking mode, impound
options, …). Two fields are **dropdowns** populated from the adapters available
in code:

- **Target script** — see [`AdminPerms.TARGET_SCRIPTS`](./guides/integrations.md#target--textui)
- **Vehicle key script** — see [Vehicle Keys](./guides/integrations.md#vehicle-keys)

The **default garages** are set per category here (see below).

#### Vehicle images

:::tip[New in v5.1.0]
:::

Show a **real picture per vehicle** in the garage / impound UI instead of the
generic vehicle-class icon.

1. Drop image files into the resource folder **`vehicle_images/<spawnname>.<ext>`**
   — named after the vehicle's spawn name in lowercase, e.g.
   `vehicle_images/sultanrs.png`.
2. In **Settings → Vehicle Images** enable the feature and pick the file
   extension you used (**PNG / JPG / WEBP**).

If a model has no image the UI **falls back to the class icon**, so a partial set
is fine. Images are served locally over `nui://` (no internet required), and the
folder lives **outside** `html/` so rebuilding the NUI never deletes them.

#### Colors & branding

:::tip[New in v5.1.0]
:::

Under **Settings → Colors** you can recolour the whole UI and rename the title
badge:

- **5 brand colours** — accent, background, panel, primary & secondary text — with
  a **live preview** and a **"Reset to default"** button. The theme applies to the
  **dashboard, garage and impound** UI; the remaining shades are derived
  automatically.
- **Brand tag** — the small badge next to the dashboard title (default `MSK`,
  [`Config.BrandTag`](./config.md)). Leave it empty to hide the badge.

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
