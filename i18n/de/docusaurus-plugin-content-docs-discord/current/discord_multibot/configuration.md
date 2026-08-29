---
title: Konfiguration
description: Alle Einstellungen des Discord Multi-Bots, von der .env über das Abschalten einzelner Bots bis zum Punktesystem.
sidebar_position: 3
---

## 🛠️ Konfiguration im Überblick

### Die ENV-Datei

Die gesamte Konfiguration läuft über eine `.env` im Stammverzeichnis. Kopiere
`.env.example` und trage deine Werte ein.

#### Pflicht

```env
COMMANDS_BOT_TOKEN=token_des_commands_bots
EVENTS_BOT_TOKEN=token_des_events_bots
MINIGAMES_BOT_TOKEN=token_des_minigames_bots
GUILD_ID=deine_guild_id
```

#### Optional (sonst greifen die fest hinterlegten MSK-Scripts-Werte)

```env
# Logging und Kanäle
LOG_CHANNEL_ID=
FEEDBACK_CHANNEL_ID=
MEMBER_COUNT_CHANNEL_ID=

# Rollen-IDs
MEMBER_ROLE_ID=
TEAM_ROLE_ID=
GIVEAWAY_NOTIFY_ROLE_ID=
GARAGE_ROLE_ID=
HANDCUFFS_ROLE_ID=
STORAGE_ROLE_ID=
VEHICLEKEYS_ROLE_ID=

# Datenbank (für /backup_database)
DB_HOST=localhost
DB_USER=
DB_PASS=
DB_NAME=es_extended
```

---

### Einen Bot abschalten

Lass den Token in der `.env` leer, dann überspringt der Start diesen Bot automatisch:

```env
# Beispiel: den Minispiele-Bot abschalten
MINIGAMES_BOT_TOKEN=
```

---

### Das Punktesystem einstellen

Alle Punktwerte und Belohnungsschwellen stehen in
`bots/minigames/points_config.json`.

Damit die Rolle beim Erreichen einer Schwelle automatisch vergeben wird, trägst du die
Discord-Rollen-ID beim jeweiligen Eintrag ein:

```json
{ "points": 1500, "description": "🥈 Silver Player", "role_id": 123456789 }
```

> Starte den Bot nach jeder Änderung an der `points_config.json` neu.

---

### Abhängigkeiten

| Paket | Version |
|---|---|
| [discord.js](https://discord.js.org) | `^14.26.4` |
| [dotenv](https://github.com/motdotla/dotenv) | `^16.6.1` |

Updates der Abhängigkeiten überwacht Dependabot automatisch, wöchentlich und gebündelt.
