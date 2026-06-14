---
title: Cron
sidebar_position: 15
---

# Cron

A lightweight cron / scheduler. Register a callback that fires once after an interval, or repeatedly at a fixed clock time (every minute / hour / day, optionally on a specific weekday). The scheduler ticks once per minute, so the smallest resolution is one minute. All functions are **server-side** only.

There are two scheduling modes, chosen automatically by the keys you pass:

- **Interval mode** (`w`, `d`, `h`, `m`) — fires once after the given offset from now, then re-schedules itself by the same offset.
- **At mode** (`atD`, `atH`, `atM`) — fires at a fixed wall-clock time and repeats every day (or only on the given weekday).

## MSK.Cron.Create

Creates a cron job and returns nothing — keep the `uniqueId` passed to your callback if you want to delete it later.

**Parameters**  
**date** - `table` - The schedule definition (see fields below)  
**data** - `any` - Optional - Arbitrary data passed back to your callback  
**cb** - `function` - The callback, called as `cb(uniqueId, data, time)` where `time = { timestamp, d, h, m }`

**`date` fields**  
**w** - `number` - Interval: weeks from now  
**d** - `number` - Interval: days from now  
**h** - `number` - Interval: hours from now  
**m** - `number` - Interval: minutes from now  
**atD** - `number` - At: weekday to run on (`1` = Monday … `7` = Sunday). Omit to run every day  
**atH** - `number` - At: hour of day (`0`–`23`)  
**atM** - `number` - At: minute of hour (`0`–`59`)

```lua
MSK.Cron.Create(date, data, cb)

-- Every minute
MSK.Cron.Create({ m = 1 }, nil, function(uniqueId, data, time)
    print('Runs every minute', uniqueId)
end)

-- Every hour
MSK.Cron.Create({ h = 1 }, nil, function(uniqueId, data, time)
    print('Runs every hour')
end)

-- Every day (24h interval from now)
MSK.Cron.Create({ d = 1 }, nil, function(uniqueId, data, time)
    print('Runs every 24 hours')
end)

-- Every day at 04:30 (clock time)
MSK.Cron.Create({ atH = 4, atM = 30 }, nil, function(uniqueId, data, time)
    print('Runs daily at 04:30')
end)

-- Every Monday at 18:00 (atD: 1 = Monday … 7 = Sunday)
MSK.Cron.Create({ atD = 1, atH = 18, atM = 0 }, { task = 'weekly' }, function(uniqueId, data, time)
    print('Runs every Monday at 18:00', data.task)
end)

-- As an Export:
exports.msk_core:CreateCron(date, data, cb)
```

:::tip
`MSK.CreateCron` is an alias for `MSK.Cron.Create`. The export is `exports.msk_core:CreateCron`. A net event `msk_core:createCron` is also registered.
:::

:::warning
In **At mode** `atH` must not be greater than `23` and `atM` not greater than `59` — otherwise the job is rejected with a console error.
:::

## MSK.Cron.Delete

Deletes a previously created cron job by its `uniqueId` (the first argument your callback receives).

**Parameters**  
**uniqueId** - `number` - The unique id of the cron job to delete

**Returns**  
**found** - `boolean` - `true` if a matching job was found and removed

```lua
local found = MSK.Cron.Delete(uniqueId)

-- Example: self-deleting job after first run
MSK.Cron.Create({ m = 1 }, nil, function(uniqueId, data, time)
    print('Running once, then deleting myself')
    MSK.Cron.Delete(uniqueId)
end)

-- As an Export:
local found = exports.msk_core:DeleteCron(uniqueId)
```

:::tip
`MSK.DeleteCron` is an alias for `MSK.Cron.Delete`. The export is `exports.msk_core:DeleteCron`.
:::
