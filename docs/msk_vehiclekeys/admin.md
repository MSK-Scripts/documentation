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

Group membership is resolved via a **FiveM ACE principal** (`group.<name>` in your `server.cfg`)
**or** your framework group (e.g. ESX `getGroup()`), so it works with both setups.

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
