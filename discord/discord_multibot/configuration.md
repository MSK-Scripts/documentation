---
title: Configuration
description: Configuration
sidebar_position: 3
---

## 🛠️ Configuration Reference

### ENV File

```bash
# ─── Bot Tokens ──────────────────────────────────────────────────────────────
# Each bot requires its own bot application in the Discord Developer Portal.
# Copy this file to .env and enter your tokens.

COMMANDS_BOT_TOKEN='your_commands_bot_token_here'
EVENTS_BOT_TOKEN='your_events_bot_token_here'
MINIGAMES_BOT_TOKEN='your_minigames_bot_token_here'

# ─── Guild & Channel IDs ─────────────────────────────────────────────────────
GUILD_ID=your_guild_id_here
LOG_CHANNEL_ID=your_log_channel_id_here
MEMBER_COUNT_CHANNEL_ID=your_member_count_channel_id_here
FEEDBACK_CHANNEL_ID=your_feedback_channel_id_here

# ─── Role IDs ────────────────────────────────────────────────────────────────
MEMBER_ROLE_ID=your_member_role_id_here
UPDATE_NOTIFY_ROLE_ID=your_update_notify_role_id_here
GIVEAWAY_NOTIFY_ROLE_ID=your_giveaway_notify_role_id_here
TEAM_ROLE_ID=your_team_role_id_here

# ─── Datenbank (für /backup_database) ────────────────────────────────────────
DB_HOST=your_db_host_here
DB_USER=your_db_user_here
DB_PASS='your_db_pass_here'
DB_NAME=your_db_name_here
```

### Einzelnen Bot deaktivieren

Token in `.env` leer lassen – der Bot wird beim Start automatisch übersprungen:

```bash
# Beispiel: Minigames Bot deaktivieren
MINIGAMES_BOT_TOKEN=
```

---

### Punktesystem konfigurieren

Alle Punktwerte und Belohnungen befinden sich in `bots/minigames/points_config.json`.
Rollen-IDs für automatische Rollenvergabe dort eintragen:

```json
{ "points": 1500, "description": "🥈 Silver Player", "role_id": 123456789 }
```