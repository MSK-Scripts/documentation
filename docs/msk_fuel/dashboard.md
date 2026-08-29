---
title: Dashboards
sidebar_position: 3
---

# Dashboards

msk_fuel ships two in-game panels, both built with React + Vite + Tailwind and
served from the committed `html/` build. The server needs no npm.

They share one `ui_page`: the Lua side decides which one opens.

## Admin dashboard

Opened with `/fueladmin` (the command name is configurable in the Settings tab).

### Access

Two things have to line up before the dashboard opens:

1. The player is in a group listed in `Config.dashboardGroups`, and
2. that group holds at least one permission.

`group.admin` always may and always holds every right. `group.user` never may,
no matter what is configured.

:::warning[add_ace]
FiveM keeps principals and ACE objects apart: `add_principal … group.admin` makes
a player a *member* of that group but does not grant the ACE object of the same
name. msk_fuel registers its own ACE objects through msk_core, which needs one
line in your `server.cfg`:

```cfg
add_ace resource.msk_core command.add_ace allow
```

Without it, group access falls back to your framework group (the ESX `users`
table, QBCore's permission list) and the script says so on start.
:::

### Tabs

| Tab               | Contents                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| Stations          | Create, edit and delete stations; stock and price per fuel type; remove an owner                   |
| Prices & market   | Base prices, price limits, market parameters, default tank sizes                                   |
| Unowned stations  | Public delivery jobs and automatic restocking, per station without an owner                        |
| Settings          | Language, debug, version checker, command name, colours, economy defaults, unowned-station income  |
| Permissions       | Which groups may open the dashboard, and the permission matrix per group                           |

### Permissions

Nine rights, granted per group:

| Right                | Allows                                     |
| -------------------- | ------------------------------------------ |
| `station.view`       | see the station list                       |
| `station.create`     | create stations                            |
| `station.edit`       | edit stations and unowned-station settings |
| `station.delete`     | delete stations                            |
| `station.owner`      | take a station away from its owner         |
| `stock.manage`       | set stock and capacity                     |
| `market.manage`      | prices, limits and market parameters       |
| `settings.manage`    | general settings                           |
| `permissions.manage` | groups and the permission matrix           |

Every action is checked again on the server. Hiding a tab is a convenience, not
the security boundary.

## Owner dashboard

Opened at the pump of a station the player owns or works at, through the
**manage this fuel station** target option.

Which tabs appear depends on what the player's rank allows. An employee who may
only order fuel sees the overview, the stock and the supply tab, and nothing
else.

| Tab       | Needs        | Contents                                                             |
| --------- | ------------ | -------------------------------------------------------------------- |
| Overview  | –            | 24-hour and 7-day figures, rename the station, sell it (owner only)  |
| Finance   | deposit or withdraw | balance, deposit, withdraw, transaction history               |
| Prices    | `set_prices` | price mode and price per fuel type, with base price and limits shown |
| Stock     | –            | tank levels and current prices                                       |
| Supply    | `order_fuel` | NPC driver, instant restocking, delivery runs                        |
| Pumps     | `repair`     | pump condition, repair, mechanic                                     |
| Staff     | `hire`       | hire, let go, change rank, per-employee statistics                   |
| Ranks     | `hire`       | create, edit and delete ranks                                        |

:::info[Standing at the station]
Every owner action carries the pump coordinates, and the server verifies the
player is really there. A dashboard cannot be driven from across the map, and a
station id in a payload proves nothing on its own.
:::

## Colours

The Settings tab of the admin dashboard sets five colours (accent, background,
panel, primary and secondary text). Every other shade is derived from them, and
the change previews live before it is saved. Both dashboards use the same
palette.
