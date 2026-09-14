---
title: Ban System
sidebar_position: 15
---

# Ban System

A built-in, identifier- **and** token-based ban system. When enabled, it creates the `msk_bansystem` database table on resource start, checks every connecting player against the stored bans, and drops banned players with the ban reason and expiry. Bans match on **all** player identifiers (steam, license, discord, …) as well as the player's **hardware tokens**, so a ban cannot be evaded by changing a single identifier.

The player name is stored with the ban for the log, but it is **never** used for matching. Before v4.1.0 anybody who used the same display name as a banned player was kicked as well.

All functions are **server-side** only.

## Config

```lua
Config.BanSystem = {
    enable = true, -- Set to true if you want to use this Feature

    discordLog = false, -- Set true to enable DiscordLogs // Add Webhook Link in modules/Ban/server.lua
    botColor = "6205745",
    botName = "MSK Scripts",
    botAvatar = "https://i.imgur.com/PizJGsh.png",

    commands = {
        enable = true,
        groups = {'superadmin', 'admin', 'god'}, -- ACE groups allowed to use the commands
        ban = 'banPlayer',
        unban = 'unbanPlayer'
    }
}
```

:::info[Discord Webhook]
The Discord webhook link is **not** in the config. Set `discordLog = true` and insert your webhook URL at the top of `modules/Ban/server.lua`:

```lua
-- Insert you Discord Webhook here
local webhookLink = "https://discord.com/api/webhooks/"
```
Both bans and unbans are logged via `MSK.AddWebhook`.
:::

## MSK.BanPlayer

This will ban a player. The ban (identifiers, tokens, time, reason) is stored in `msk_bansystem` and the target is dropped immediately.

The issuer is saved in the `bannedby` column. A ban issued with `0` (the server console) is stored as `Console`, a ban without any issuer as `System`.

**Parameters**  
**playerId** - `number` - The ServerId of the player who issues the ban - Optional (pass `0` or `nil` when calling from the server/console)  
**targetId** - `number` - The ServerId of the player who gets banned  
**time** - `string` - The time until the player gets unbanned  
**reason** - `string` - The reason why the player gets banned

**Description, `time` format:**

- `1M` = 1 Minute
- `1H` = 1 Hour
- `1D` = 1 Day
- `1W` = 1 Week
- `P` = Permanent

Any other value is refused with an error and no ban is written.

```lua
MSK.BanPlayer(playerId, targetId, time, reason)

-- Player gets banned for 2 days for cheating
MSK.BanPlayer(playerId, targetId, '2D', 'cheating')

-- Player gets permanently banned
MSK.BanPlayer(playerId, targetId, 'P', 'cheating')

-- If you execute this from the server/console
MSK.BanPlayer(0, targetId, '2D', 'cheating')

-- As an Export:
exports.msk_core:BanPlayer(playerId, targetId, time, reason)
```

## MSK.UnbanPlayer

This will unban a player by deleting the ban entry from `msk_bansystem`.

**Parameters**  
**playerId** - `number` - The ServerId of the player who issues the unban - Optional (pass `0` or `nil` when calling from the server/console)  
**banId** - `number` - The BanId (the `id` column in the `msk_bansystem` table)

```lua
MSK.UnbanPlayer(playerId, banId)

-- Example: unban BanId 5 from the server/console
MSK.UnbanPlayer(0, 5)

-- As an Export:
exports.msk_core:UnbanPlayer(playerId, banId)
```

## MSK.IsPlayerBanned

Checks whether the given player matches a stored ban (by identifier or token).

Every matching ban is checked. When a player has an expired ban **and** an active one, the active ban is returned. Before v4.1.0 the first match was used, so an old expired ban could let a player in despite a newer active ban.

A ban whose time cannot be read is treated as active.

**Parameters**  
**playerId** - `number` - The ServerId of the player

**Returns**  
**isBanned** - `boolean or table` - `false` if not banned, otherwise the ban entry (`id`, `ids`, `reason`, `time`, `from`, `tokens`)  
**isExpired** - `boolean` - `true` if the returned ban has already expired. Also `true` when the player is not banned at all, so always check `isBanned` first

```lua
local isBanned, isExpired = MSK.IsPlayerBanned(playerId)

if isBanned and not isExpired then
    -- Player is banned
    print(isBanned.id, isBanned.ids, isBanned.reason, isBanned.time, isBanned.from)
elseif isBanned and isExpired then
    -- Player was banned but the Ban is expired
    print(isBanned.id, isBanned.reason, isBanned.time)
else
    -- Player is not banned
end

-- As an Export:
local isBanned, isExpired = exports.msk_core:IsPlayerBanned(playerId)
```

## Commands

The commands are only registered when `Config.BanSystem.enable` **and** `Config.BanSystem.commands.enable` are `true`. They are restricted to the ACE groups defined in `Config.BanSystem.commands.groups` and can also be run from the server console (`allowConsole = true`).

### /banPlayer

**Parameters**  
**playerId** - `number` - The ServerId of the player who gets banned  
**time** - `string` - The time until the player gets unbanned (`1M`, `1H`, `1D`, `1W`, `P`)  
**reason** - `string` - The reason why the player gets banned. Takes the rest of the line, so no quotes are needed - Optional, default: `'Unknown reason'`

```lua
/banPlayer playerId time reason

-- Example 1: Player 1 banned for 2 days for cheating
/banPlayer 1 2D Cheating with an aimbot

-- Example 2: Player 1 permanently banned
/banPlayer 1 P Cheating
```

### /unbanPlayer

**Parameters**  
**banId** - `number` - The BanId

```lua
/unbanPlayer banId

-- Example: BanId 5 gets unbanned
/unbanPlayer 5
```
