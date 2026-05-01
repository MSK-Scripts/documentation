---
title: Installation
description: Installation
sidebar_position: 2
---

## 🚀 Installation

### Requirements
- **Python 3.9+**
- **pip**
- Optional: `mysqldump` for `/backup_database`

### 1. Ordner anlegen & Dateien kopieren

```bash
sudo mkdir -p /opt/discord_multibot
sudo chown $USER:$USER /opt/discord_multibot
cd /opt/discord_multibot
# Copy project folder to /opt
```

### 2. Virtuelle Umgebung & Abhängigkeiten

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
nano .env    # Insert Tokens and IDs 
```

> **Hinweis:** Jeder Bot benötigt eine eigene Bot-Application im
> [Discord Developer Portal](https://discord.com/developers/applications).
> Bots ohne Token werden beim Start automatisch übersprungen.

### 4. Manueller Test

```bash
source venv/bin/activate
python main.py
```

---

## systemd-Service

### Systembenutzer erstellen (empfohlen)

```bash
# Create a dedicated system user (recommended — never run as root)
sudo useradd --system --no-create-home --shell /sbin/nologin discord

# Set permissions
sudo chown -R discord:discord /opt/discord_multibot
```

### Service installieren & aktivieren

```bash
sudo cp multibot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now multibot.service
```

### Nützliche Befehle

```bash
# Show current status
sudo systemctl status multibot.service

# Live-Logs (journald)
sudo journalctl -u multibot.service -f

# Datei-Log
tail -f /opt/discord_multibot/multibot.log

# Restart (z. B. nach .env-Änderung)
sudo systemctl restart multibot.service

# Stop
sudo systemctl stop multibot.service

# Service deactivate
sudo systemctl disable multibot.service
```

---

## Security

- `.env` niemals committen – in `.gitignore` eintragen
- `/backup_database` nutzt `os.system` – nur auf vertrauenswürdigen Servern einsetzen
- Der systemd-Service läuft unter einem eingeschränkten `discord`-Benutzer ohne Root-Rechte
- Berechtigungsänderungen an Rollen werden im Log-Channel **rot** hervorgehoben