---
title: Installation
description: Den Discord Multi-Bot installieren, Umgebungsvariablen setzen und als systemd-Dienst dauerhaft betreiben.
sidebar_position: 2
---

## 🚀 Installation

### Voraussetzungen

- **Node.js ab Version 18**, das eingebaute `fetch` wird für die Trivia-API gebraucht
- **npm**
- Optional `mysqldump` für `/backup_database`

### 1. Repository klonen

```bash
git clone https://github.com/MSK-Scripts/discord-multibot-js.git
cd discord-multibot-js
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen setzen

```bash
cp .env.example .env
# → Tokens, IDs und Datenbank-Zugangsdaten eintragen
```

> Jeder Bot braucht eine eigene Anwendung im
> [Discord Developer Portal](https://discord.com/developers/applications).
> Bots ohne Token überspringt der Start automatisch.

### 4. Testlauf von Hand

```bash
node main.js
```

---

## systemd-Dienst

Eine fertige systemd-Unit liegt als `multibot-js.service` bei.

### 1. Pfade und Nutzer anpassen, falls nötig

Die Standardwerte in der Service-Datei: Nutzer `deploy`, Pfad
`/home/deploy/discord_multibot_js`.

### 2. Service-Datei kopieren

```bash
sudo cp multibot-js.service /etc/systemd/system/
```

### 3. Dienst aktivieren und starten

```bash
sudo systemctl daemon-reload
sudo systemctl enable multibot-js
sudo systemctl start multibot-js
```

> **Hinweis:** Der Dienst liest die `.env` über `EnvironmentFile=`. Achte darauf, dass die
> Datei am eingestellten Pfad liegt und für den Dienstnutzer lesbar ist.

### Nützliche Befehle

```bash
# Status anzeigen
sudo systemctl status multibot-js

# Logs live mitlesen
journalctl -u multibot-js -f

# Neu starten, etwa nach Änderungen an der .env oder nach Updates
sudo systemctl restart multibot-js

# Stoppen
sudo systemctl stop multibot-js

# Autostart abschalten
sudo systemctl disable multibot-js
```

---

## Hinweise zur Sicherheit

- Die `.env` gehört nie ins Repository, sie steht in der `.gitignore`
- `/backup_database` nutzt `execFile`, es gibt also keine Shell-Injection. Setze den Befehl trotzdem nur auf Servern ein, denen du vertraust
- Der Dienstnutzer (`deploy`) sollte keine Root-Rechte haben
- Änderungen an Rollenrechten hebt der Log-Kanal **rot** hervor
