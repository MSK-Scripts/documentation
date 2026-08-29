---
title: Fuel business
sidebar_position: 2
---

# Fuel business

Since **v1.2.0** a fuel station is not a blip on the map but a business. It has a
name, a zone, a stock, a price, and once somebody buys it, an owner, staff and a
company account.

This page explains how the pieces fit together. The panels themselves are
described under [Dashboards](./dashboard.md).

## Stations and zones

A station is a **center point plus a radius**. Every pump prop standing inside
that radius belongs to that station, which is why nothing had to be re-mapped
when this was introduced and why it works on any map.

When a player fuels, the client reports the coordinates of the pump they used.
The server resolves the station from those coordinates and checks that the player
is really standing there. That one check is what makes the whole economy safe: a
station id sent by a client proves nothing.

All 30 map stations ship as seeds in `config.stations.lua`. Two of them (the
airport kerosene tanks and the Grand Senora diesel depot) are flagged
`purchasable = false`, the rest can be bought.

## Stock

Every station holds its own stock per fuel type, with a capacity per type. An
**empty tank blocks that fuel type at that station**: the pump option greys out
and the server refuses the sale.

Buying or refilling a petrolcan takes petrol out of the station tank as well, so
a can is not a free source of fuel any more.

## Prices

Three numbers decide what a liter costs at a pump.

**The base price** is server-wide, one value per fuel type. It is the starting
point every dynamic station price is derived from.

**The station price** is either dynamic or fixed:

```text
dynamic:  price = base × stockFactor × demandFactor
          stockFactor  = 1 + kStock  × (1 - stock / capacity)
          demandFactor = 1 + kDemand × (recentDemand / demandNorm)

fixed:    price = whatever the owner set
```

Both are clamped to the **admin price limits**, so no owner can price their
station at zero or at a fortune. A dynamic price therefore rises as the tank
empties and as the station sells more.

**The market** moves the base price itself. Every `Config.Market.tickMinutes` the
server adds up what the entire map bought. Above normal demand the base price
rises, at or below it eases back toward its anchor, and the demand counters
decay so the next tick measures fresh demand.

:::info[Why there is an anchor]
The anchor is whatever the base price was last set to, by the config seed or by
an admin. Without it a quiet server would drift to the price floor and stay
there. `Config.Market.anchorPull` decides how quickly it eases back.
:::

Because every station price is derived from the base price, a busy station is
felt across the whole map. That is the point of having a market rather than 30
independent stations.

## Ownership

At a purchasable station nobody owns, the pump offers **buy this fuel station**.
The money, the ownership and the station's default ranks are all handled server
side.

Selling gives back a configurable share of the purchase price
(`Config.SellRefundRatio`, default 60 percent) **plus whatever sits on the
company account**. That is the owner's money and would otherwise vanish with the
station. Selling is owner-only, whatever a rank says: a manager may run the
station, but not sell the business out from under its owner.

Money paid at a station **nobody** owns follows `Config.NeutralIncome`: it either
disappears or goes into a society account.

## Staff and ranks

Ranks and employees live in msk_fuel's own tables, deliberately **not** in the
framework's job system. A station is a side business; tying it to a job would
mean a player could only work at one, and only on a server that has that job
configured. A player can be employed at several stations at once.

A rank carries a **salary**, a **delivery bonus** and a set of seven
permissions:

| Permission    | Allows                              |
| ------------- | ----------------------------------- |
| `manage`      | rename the station                  |
| `hire`        | manage staff and ranks              |
| `set_prices`  | price mode and price per fuel type  |
| `order_fuel`  | restocking and delivery runs        |
| `withdraw`    | take money out of the account       |
| `deposit`     | pay money in                        |
| `repair`      | pump maintenance                    |

A freshly bought station starts with a **manager** (everything) and an
**employee** (order fuel, deposit, repair). Both are editable, and more ranks can
be added.

The owner always holds every permission. **Handing out permissions is
owner-only**, so a manager cannot promote themselves or a friend past what the
owner intended.

Salaries are paid every `Config.Payroll.intervalMinutes` out of the company
account, to everyone **online**. Paying absent staff would bleed a station dry
for players who are not there. A station that cannot cover its payroll skips it
and tells the owner once, instead of going into debt.

## Supply

A station that sells fuel eventually runs out of it. Two ways to fix that, and
they are meant to feel different.

### NPC driver

Unlocked once per station out of the company account
(`Config.NpcUnlockPrice`). After that, fuel can be ordered **instantly** at the
wholesale price plus `Config.NpcSurcharge` (default 35 percent on top). Automatic
restocking can also be switched on, which tops the tanks up below
`Config.AutoRestock.threshold`.

Convenient, and deliberately the expensive option.

### Delivery run

Cheaper, but somebody drives it. Pick a fuel type, an amount and a rig:

| Rig    | Capacity | Discount |
| ------ | -------- | -------- |
| Van    | 500 L    | –        |
| Truck  | 1500 L   | 5 %      |
| Tanker | 3000 L   | 10 %     |

The rig spawns at the station, the route leads to a fuel depot from
`Config.FuelDepots`, the load comes back to the station. Crash damage spills
cargo, up to `Config.Delivery.maxLeak` (30 percent). Losing the truck or the
trailer aborts the run with a partial refund, and a run nobody finishes times out
after `Config.Delivery.timeoutMinutes`.

An **employee** driving a run earns their rank's delivery bonus on top of their
salary. An owner driving their own truck does not. That would just be moving
their own money around.

### Public jobs

At a station **nobody owns**, the admin can enable public delivery jobs. Anyone
can take one at the pump, the run costs the player nothing, and the reward is
paid per delivered liter out of the system. This is a trucker-style job that also
keeps unowned stations supplied without an admin filling them by hand.

Unowned stations can additionally refill themselves automatically. They have no
account to charge, so that refill is free. It exists to keep the map supplied,
not to make anyone money.

## Pump maintenance

Pumps wear out. Each sale has a `Config.Maintenance.wearChance` (default 3
percent) chance of costing the pump some condition.

- Below `slowThreshold` (default 50) the pump **fuels slower**. That costs the
  customer time, not money.
- Below `failThreshold` (default 15) it **stops working** until it is repaired
  out of the company account.

:::info[Pumps are never mapped]
A pump enters the register the **first time somebody fuels at it**, keyed by its
position. That is why maintenance works on any map, with any set of props,
without a single coordinate having to be maintained anywhere.
:::

A **mechanic** can be hired once per station. They repair anything below
`mechanicThreshold` on their own every `mechanicIntervalMinutes` and bill the
station. A station that cannot pay simply keeps its worn pumps.
