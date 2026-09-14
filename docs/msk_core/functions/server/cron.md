---
title: Cron
sidebar_position: 16
---

# Cron

A lightweight scheduler for recurring server tasks. All functions are **server-side** only.

There are two ways to schedule something:

- **`MSK.Cron.Create`** takes a table. Either an interval (`w`, `d`, `h`, `m`) or a clock time (`atH`, `atM`, `atD`).
- **`MSK.Cron.Schedule`** takes a classic cron expression like `'*/15 * * * *'` or `'0 20 * * fri'`. New in v4.1.0.

The scheduler checks its jobs right after the start of every minute, so the smallest resolution is one minute. All times are the server's local time.

Jobs and tasks belong to the resource that created them. When that resource stops, its jobs are removed automatically.

## MSK.Cron.Create

Creates a cron job and returns its id. The mode depends on the keys you pass:

- **Interval mode** (`w`, `d`, `h`, `m`): the job runs after the given time from now and then again after every interval. If the server was busy and a run is overdue, it runs once and the missed runs are skipped.
- **At mode** (`atH`, `atM`, `atD`): the job runs every day at the given clock time, or only on the given weekday.
- **Timestamp**: pass a unix timestamp instead of a table and the job runs once at that time.

**Parameters**  
**date** - `table` or `number` - The schedule (see the fields below) or a unix timestamp  
**data** - `any` - Optional - Anything you want to get back in the callback  
**cb** - `function` - Called as `cb(uniqueId, data, time)`  

**`date` fields**  
**w** - `number` - Interval: weeks  
**d** - `number` - Interval: days  
**h** - `number` - Interval: hours  
**m** - `number` - Interval: minutes  
**atH** - `number` - At: hour of the day, `0` to `23`  
**atM** - `number` - Optional - Default: `0` - At: minute of the hour, `0` to `59`. Leave it out to run at the full hour  
**atD** - `number` - Optional - At: weekday, `1` = Sunday, `2` = Monday ... `7` = Saturday. Leave it out to run every day  

**`time` in the callback**  
**timestamp** - `number` - The unix timestamp of the run  
**d** - `number` - Interval mode: day of the month. At mode: the weekday (`1` = Sunday ... `7` = Saturday)  
**h** - `number` - The hour  
**m** - `number` - The minute  

**Returns**  
**uniqueId** - `number` or `nil` - The id of the job, `nil` when the arguments are invalid  

```lua
local uniqueId = MSK.Cron.Create(date, data, cb)

-- Every minute
MSK.Cron.Create({ m = 1 }, nil, function(uniqueId, data, time)
    print('Runs every minute', uniqueId)
end)

-- Every 6 hours
MSK.Cron.Create({ h = 6 }, nil, function(uniqueId, data, time)
    print('Runs every 6 hours')
end)

-- Every day at 04:30
MSK.Cron.Create({ atH = 4, atM = 30 }, nil, function(uniqueId, data, time)
    print('Runs daily at 04:30')
end)

-- Every Monday at 18:00 (atD: 1 = Sunday, 2 = Monday ... 7 = Saturday)
MSK.Cron.Create({ atD = 2, atH = 18, atM = 0 }, { task = 'weekly' }, function(uniqueId, data, time)
    print('Runs every Monday at 18:00', data.task)
end)

-- Keep the id to delete the job later
local jobId = MSK.Cron.Create({ m = 5 }, nil, function() end)

-- As an Export:
local uniqueId = exports.msk_core:CreateCron(date, data, cb)
```

:::warning[Weekday numbering]
`atD` follows Lua's `os.date('*t').wday`, where the week **starts on Sunday**: `1` = Sunday, `2` = Monday ... `7` = Saturday. Older versions of this page said `1` = Monday, which was wrong. Check your existing jobs.
:::

:::info[Invalid arguments]
The arguments are checked when the job is created. `nil` is returned and an error is printed when:

- `date` is neither a table nor a number, or `cb` is not a function
- the table has no interval (`w`, `d`, `h`, `m`) and no valid `atH` from `0` to `23`. A clock time job without `atH` is rejected
- `atH` is not a whole number, `atM` is outside `0` to `59`, or `atD` is outside `1` to `7`
:::

:::tip
`MSK.CreateCron` is an alias for `MSK.Cron.Create`. Server side scripts can also use `TriggerEvent('msk_core:createCron', date, data, cb)`. Since v4.1.0 this is a plain server event and can no longer be triggered by clients.
:::

## MSK.Cron.Delete

Deletes a job created with `MSK.Cron.Create`. For tasks from `MSK.Cron.Schedule` use `MSK.Cron.Unschedule`.

**Parameters**  
**uniqueId** - `number` - The id returned by `MSK.Cron.Create`, or the first argument of the callback  

**Returns**  
**found** - `boolean` or `nil` - `true` when the job was removed, `nil` when the id is unknown  

```lua
local found = MSK.Cron.Delete(uniqueId)

-- Example: a job that removes itself after the first run
MSK.Cron.Create({ m = 1 }, nil, function(uniqueId, data, time)
    print('Running once, then deleting myself')
    MSK.Cron.Delete(uniqueId)
end)

-- As an Export:
local found = exports.msk_core:DeleteCron(uniqueId)
```

:::tip
`MSK.DeleteCron` is an alias for `MSK.Cron.Delete`.
:::

## MSK.Cron.Schedule

Runs a callback whenever a cron expression matches. New in v4.1.0.

An expression has five fields, separated by spaces:

| Field | Values |
|---|---|
| Minute | `0` to `59` |
| Hour | `0` to `23` |
| Day of month | `1` to `31` |
| Month | `1` to `12` or `jan` to `dec` |
| Day of week | `0` to `7` or `sun` to `sat`. `0` and `7` are both Sunday, `1` is Monday |

Every field accepts `*`, a single value (`5`), a range (`1-5`), a list (`1,15,30`) and a step (`*/10`, `8-18/2`). A value with a step like `5/15` means "starting at 5, every 15".

When **both** day of month and day of week are restricted, a day matches if either one matches. This is the same as in classic cron.

These shortcuts work as well:

| Shortcut | Same as |
|---|---|
| `@yearly`, `@annually` | `0 0 1 1 *` |
| `@monthly` | `0 0 1 * *` |
| `@weekly` | `0 0 * * 0` |
| `@daily`, `@midnight` | `0 0 * * *` |
| `@hourly` | `0 * * * *` |

**Parameters**  
**expression** - `string` - The cron expression  
**cb** - `function` - Called as `cb(id, info)` with `info = { timestamp, runs }`. Return `false` to remove the task  

**Returns**  
**id** - `number` - The id of the task  

```lua
local id = MSK.Cron.Schedule(expression, cb)

-- Every 15 minutes
MSK.Cron.Schedule('*/15 * * * *', function(id, info)
    print('Run number', info.runs)
end)

-- Every Friday at 20:00
MSK.Cron.Schedule('0 20 * * fri', function(id, info)
    print('Weekend starts')
end)

-- Every day at midnight
MSK.Cron.Schedule('@daily', function(id, info)
    print('New day')
end)

-- Stop after three runs
MSK.Cron.Schedule('0 * * * *', function(id, info)
    return info.runs < 3
end)

-- As an Export:
local id = exports.msk_core:ScheduleCron(expression, cb)
```

:::warning
An invalid expression raises an error. Check expressions from a config with [`MSK.Cron.IsValid`](#mskcronisvalid) first.
:::

## MSK.Cron.Unschedule

Removes a task created with `MSK.Cron.Schedule`.

**Parameters**  
**id** - `number` - The id returned by `MSK.Cron.Schedule`  

**Returns**  
**removed** - `boolean` - `false` when there is no task with that id  

```lua
local removed = MSK.Cron.Unschedule(id)

-- As an Export:
local removed = exports.msk_core:UnscheduleCron(id)
```

## MSK.Cron.GetNextRun

Returns when a task runs next. Also accepts an expression, which is handy to show the next date in a config check.

**Parameters**  
**idOrExpression** - `number` or `string` - The id of a task from `MSK.Cron.Schedule`, or a cron expression  

**Returns**  
**timestamp** - `number` or `nil` - The unix timestamp of the next run, `nil` for an unknown id or an invalid expression  

```lua
local timestamp = MSK.Cron.GetNextRun(idOrExpression)

-- Example
local nextRun = MSK.Cron.GetNextRun('0 4 * * *')
print('Next backup at ' .. os.date('%d.%m.%Y %H:%M', nextRun))

-- As an Export:
local timestamp = exports.msk_core:CronNextRun(idOrExpression)
```

## MSK.Cron.IsValid

Checks a cron expression without scheduling anything.

**Parameters**  
**expression** - `string` - The cron expression  

**Returns**  
**valid** - `boolean` - Whether the expression can be used  
**reason** - `string` or `nil` - Why it is invalid  

```lua
local valid, reason = MSK.Cron.IsValid(expression)

-- Example
local valid, reason = MSK.Cron.IsValid(Config.BackupSchedule)

if not valid then
    print(('Config.BackupSchedule is invalid: %s'):format(reason))
end

-- As an Export:
local valid, reason = exports.msk_core:IsCronValid(expression)
```
