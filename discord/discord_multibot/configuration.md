---
title: Configuration
description: Configuration
sidebar_position: 3
---

## 🛠️ Configuration Reference

### ENV File

All configuration is done via a `.env` file in the root directory. Copy `.env.example` and fill in your values.

#### Required

```env
COMMANDS_BOT_TOKEN=your_commands_bot_token
EVENTS_BOT_TOKEN=your_events_bot_token
MINIGAMES_BOT_TOKEN=your_minigames_bot_token
GUILD_ID=your_guild_id
```

#### Optional (fall back to hardcoded MSK Scripts defaults)

```env
# Logging & Channels
LOG_CHANNEL_ID=
FEEDBACK_CHANNEL_ID=
MEMBER_COUNT_CHANNEL_ID=

# Role IDs
MEMBER_ROLE_ID=
TEAM_ROLE_ID=
GIVEAWAY_NOTIFY_ROLE_ID=
GARAGE_ROLE_ID=
HANDCUFFS_ROLE_ID=
STORAGE_ROLE_ID=
VEHICLEKEYS_ROLE_ID=

# Database (for /backup_database)
DB_HOST=localhost
DB_USER=
DB_PASS=
DB_NAME=es_extended
```

---

### Disable a Bot

Leave the token empty in `.env` — the bot will be automatically skipped on startup:

```env
# Example: disable the Minigames Bot
MINIGAMES_BOT_TOKEN=
```

---

### Configure the Points System

All point values and reward thresholds are defined in `bots/minigames/points_config.json`.

To enable automatic role assignment when a reward threshold is reached, add the Discord role ID to the respective reward entry:

```json
{ "points": 1500, "description": "🥈 Silver Player", "role_id": 123456789 }
```

> Restart the bot after any changes to `points_config.json`.

---

### Dependencies

| Package | Version |
|---|---|
| [discord.js](https://discord.js.org) | `^14.26.4` |
| [dotenv](https://github.com/motdotla/dotenv) | `^16.6.1` |

Dependency updates are monitored automatically via Dependabot (weekly, grouped).
