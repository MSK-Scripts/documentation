---
title: Admin Dashboard
sidebar_position: 3
---

# Admin Dashboard

Since **v3.0.0** `msk_vehiclekeys` ships with a full **in-game admin dashboard** (React NUI).
It lets you manage player keys, look up plates, run a locksmith, edit the access lists, change
every setting and control who may use the dashboard — all without touching a config file or
restarting the resource.

## Opening the dashboard

Run the command (default **`/advehiclekeys`**, configurable via `Config.adminCommand`):

```
/advehiclekeys
```

The command itself is **not** ACE-restricted — access is decided entirely by the permission
system below. Press **ESC** (or the header **Close** button) to close it.

## Access & permissions

Who may open the dashboard and what they can do is controlled by an ACE-based permission system.

- **`group.admin`** always has every right and can never be edited.
- **`group.user`** may **never** open the dashboard and can never be granted rights.
- Any other group must be listed in **`Config.dashboardGroups`** (or be `admin`) **and** have at
  least one right to open the dashboard.

Group membership is resolved via a **FiveM ACE principal** (`group.<name>` in your `server.cfg`),
your **framework group** (e.g. ESX `getGroup()`) **or** a **luxu_admin** staff group (see below),
so it works with all of those setups.

### Setting up ACE groups

Adding the player to the principal in your `server.cfg` is all you need:

```cfg
add_principal identifier.license:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx group.admin
```

You do **not** have to add `add_ace group.admin group.admin allow` yourself. FiveM keeps
principals and ace objects apart, so the matching ace object is created by the script on start
(since **v3.3.2**) for `admin`, for every group in `Config.dashboardGroups` and for every group in
the permission matrix. Groups you add on the **Permissions** tab are covered right away, without a
restart.

:::tip[Someone cannot open the dashboard?]
Set `Config.Debug = true`. The server then prints why the player was turned away and what each
check answered (ace permission and framework group, per group).
:::

### luxu_admin support

`luxu_admin` v2 keeps its staff groups internally, so a normal ACE check does not see them. When
`luxu_admin` is running, the dashboard resolves a player's staff group through its
`getPlayerStaffGroup` export and matches it against your dashboard groups **by name**. So a
`luxu_admin` staff group called `admin` maps to `group.admin` (full access), and a group called
`mod` works like any other dashboard group.

Configure it in `config/static.lua`:

```lua title="config/static.lua"
Config.LuxuAdmin = {
    enable = 'auto',          -- 'auto' (on when the resource is running), true, or false
    resource = 'luxu_admin',  -- change if you renamed the resource
    requireDuty = false,      -- true = the staff member must be ON DUTY to be recognized

    -- Optional: map luxu_admin staff group names onto your dashboard groups.
    -- Unmapped groups are matched by their own name.
    groupMap = {
        -- ['owner'] = 'admin',
    },
}
```

:::tip
Make sure the `luxu_admin` staff group names match your **dashboard group names** (create them on
the **Permissions** tab), or map them with `groupMap`. A group named `admin` always gets full
access. This is auto-detected, so it stays off when `luxu_admin` is not running.
:::

### Permission keys

| Right | Grants access to |
|---|---|
| `keys.view` / `keys.manage` | View / manage player keys (Players & Keys tab) |
| `vehicles.view` / `vehicles.manage` | Look up plates / run plate actions (Vehicles tab) |
| `locksmith.view` / `create` / `edit` / `delete` | Manage locksmith locations |
| `lists.manage` | Edit the whitelist/blacklist/admin/job lists |
| `settings.manage` | Change every setting + theme |
| `permissions.manage` | Manage groups & dashboard access |

Groups and their rights are edited from the **Permissions** tab. On the first start two default
groups are seeded: `admin` (all rights) and `mod` (`keys.view` + `vehicles.view`).

## Tabs

| Tab | What you can do |
|---|---|
| **Players & Keys** | List online players or look one up by identifier. See their primary/secondary/temporary keys and owned vehicles. Add or remove keys, give/take the key item, and run **Refresh** or **Refresh FORCE** (see below). |
| **Vehicles** | Look up a plate to see the owner and every key holder. Remove all keys, **reset locks** (revoke everything except the owner's primary key) or change the plate. |
| **Locksmith** | Create, edit and delete locksmith locations (label, ped model, blip and coordinates) with a "use current position" button. Peds & blips update live. |
| **Access Lists** | Manage the whitelist, blacklist, admin vehicles and job vehicles — models (by name) and plates, including per-rank job entries. |
| **Settings** | Every DB-managed setting, plus the live theme editor. |
| **Permissions** | Group/permission matrix and the list of groups allowed to open the dashboard. |

### Refresh vs. Refresh FORCE

On the **Players & Keys** tab (online players only):

- **Refresh** — runs the normal refresh (respects `Config.OnRefreshKeys`): adds missing internal
  keys and only hands out items if the config flags allow it.
- **Refresh FORCE** — re-adds **all** missing key items to the player's inventory, regardless of
  the `Config.OnRefreshKeys` flags.

## Database

The dashboard is **database-driven**. On the first start three tables are created and seeded
from your config **once**; afterwards the database is authoritative:

| Table | Contents |
|---|---|
| `msk_vehiclekeys_settings` | All dashboard-managed settings (key–value, JSON) |
| `msk_vehiclekeys_permissions` | Per-group permission matrix |
| `msk_vehiclekeys_locksmiths` | Locksmith locations |

Changes made in the dashboard are saved to the database and **broadcast live** to all connected
players (settings, access-list matching and locksmith peds/blips update without a restart). A few
options that register **items** or **commands** still need a resource restart — the dashboard
marks those with a hint.

:::tip
If a setting ever looks incomplete after updating from an older version, open the **Settings**
tab once and press **Save** — this writes a complete, up-to-date settings record back to the
database.
:::
