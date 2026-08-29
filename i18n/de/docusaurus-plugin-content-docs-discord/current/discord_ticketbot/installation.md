---
title: Discord Ticket Bot installieren
description: Discord Ticket Bot installieren und dauerhaft betreiben. Node.js einrichten, Token hinterlegen, Panel senden und den Bot per systemd 24/7 auf dem Server laufen lassen.
keywords:
  - discord ticket bot installieren
  - discord bot auf server installieren
  - discord bot 24/7 hosten
  - discord bot systemd
  - discord ticket bot deutsch
sidebar_position: 2
---

## 🚀 Installation

Diese Seite richtet den Bot auf deinem eigenen Server ein. Was er alles kann und was der
MSK Transcript Service dazu beiträgt, steht auf der Seite
[Discord Ticket Bot zum Selbsthosten](https://www.msk-scripts.de/de/ticketbot).

### Voraussetzungen

- **Node.js** ab Version 24 (oder du überspringst das komplett und nimmst [Docker](/discord/discord_ticketbot/docker))
- Ein Discord-Bot-Token von [discord.com/developers/applications](https://discord.com/developers/applications)

### 1. Abhängigkeiten installieren

```bash
cd discord_ticketbot
npm install
```

### 2. Umgebungsvariablen anlegen

```bash
cp .env.example .env
```

Die `.env` ausfüllen:

```bash
# Pflicht
TOKEN="dein_bot_token"
CLIENT_ID="deine_application_id"
GUILD_ID="deine_server_id"

# Optional, MSK Transcript Service (Key unter www.msk-scripts.de/ticketbot/verify)
MSK_API_KEY="dein_msk_api_key"
MSK_API_URL="https://www.msk-scripts.de"

# Optional, Datenbank (leer lassen für die mitgelieferte SQLite-Datei)
# MySQL/MariaDB:  mysql://user:pass@host:3306/ticketbot
# PostgreSQL:     postgres://user:pass@host:5432/ticketbot
# DATABASE_URL=""
```

> 💾 **Die Datenbank ist optional.** Lässt du `DATABASE_URL` leer, nutzt der Bot eine
> lokale SQLite-Datei (`data/tickets.db`), ganz ohne Einrichtung. Für MySQL/MariaDB
> oder PostgreSQL setzt du `DATABASE_URL`, siehe [Datenbank](/discord/discord_ticketbot/database).

### 3. Konfiguration anlegen

```bash
cp config/config.example.jsonc config/config.jsonc
```

Passe `config/config.jsonc` nach Bedarf an, alle Felder sind kommentiert.

### 4. Textbausteine anlegen (optional)

```bash
cp config/snippets.example.jsonc config/snippets.jsonc
```

In `config/snippets.jsonc` legst du die vorformulierten Antworten deines Teams fest. Fehlt die Datei, zeigen die `/snippet`-Befehle einen Einrichtungshinweis.

### 5. Bot starten

```bash
npm start
```

Beim ersten Start erledigt der Bot automatisch:

- das Datenbankschema anlegen (standardmäßig SQLite unter `data/tickets.db`, sonst in der
  MySQL- oder PostgreSQL-Datenbank aus `DATABASE_URL`, siehe [Datenbank](/discord/discord_ticketbot/database))
- alle Slash-Befehle auf deinem Server registrieren

### 6. Panel einrichten

Führe `/setup` auf deinem Discord-Server aus, dafür brauchst du Administratorrechte. Der Bot schickt das Ticket-Panel in den Kanal, der unter `openTicketChannelId` eingetragen ist.

Wie du den Bot danach im Alltag bedienst und welche Funktionen es gibt, steht auf der Seite [Discord Ticket Bot einrichten](./getting-started.md).

---

## 🖥️ Bot 24/7 per systemd betreiben (Linux-Server)

Die mitgelieferte Datei `ticketbot.service` sorgt dafür, dass der Bot nach einem Neustart des Servers von selbst wieder hochfährt.

:::note
Du nutzt das optionale **Web-Dashboard**? Dann startest du `dashboard.js` als Einstiegspunkt statt des reinen Bots unten. Es überwacht den Bot und liefert das Dashboard in einem Prozess mit aus. Folge dafür der Anleitung **[Dashboard-Einrichtung unter Linux](/discord/discord_ticketbot/guides/dashboard-linux)** und starte niemals beide Dienste gleichzeitig.
:::

### 1. Bot-Dateien auf den Server kopieren

```bash
sudo cp -r discord_ticketbot /opt/discord_ticketbot
sudo useradd -r -s /bin/false discord
sudo chown -R discord:discord /opt/discord_ticketbot
```

### 2. .env auf dem Server anlegen

```bash
sudo nano /opt/discord_ticketbot/.env
```

### 3. Node.js-Pfad prüfen

```bash
which node
# z. B.: /usr/bin/node
```

Weicht der Pfad ab, passt du `ExecStart` in `ticketbot.service` entsprechend an.

### 4. systemd-Unit installieren

```bash
sudo cp /opt/discord_ticketbot/ticketbot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ticketbot.service
```

### 5. Status prüfen

```bash
sudo systemctl status ticketbot.service
sudo journalctl -u ticketbot.service -f
```

### Nützliche Befehle

| Befehl                                     | Beschreibung             |
| ------------------------------------------ | ------------------------ |
| `sudo systemctl start ticketbot.service`   | Bot starten              |
| `sudo systemctl stop ticketbot.service`    | Bot stoppen              |
| `sudo systemctl restart ticketbot.service` | Bot neu starten          |
| `sudo systemctl enable ticketbot.service`  | Autostart aktivieren     |
| `sudo systemctl disable ticketbot.service` | Autostart deaktivieren   |
| `sudo journalctl -u ticketbot.service -f`  | Logs live mitlesen       |
