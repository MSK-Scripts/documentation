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

### 1. Create directory and copy files

```bash
sudo mkdir -p /opt/discord_multibot
sudo chown $USER:$USER /opt/discord_multibot
cd /opt/discord_multibot
# Copy all project files here
```

### 2. Virtual environment & dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
nano .env    # Fill in your tokens and IDs
```

> **Note:** Each bot requires its own bot application in the
> [Discord Developer Portal](https://discord.com/developers/applications).
> Bots without a token are automatically skipped on startup.

### 4. Manual test run

```bash
source venv/bin/activate
python main.py
```

---

## systemd-Service

### Create a system user (recommended)

```bash
# Create a dedicated system user (recommended — never run as root)
sudo useradd --system --no-create-home --shell /sbin/nologin discord

# Set permissions
sudo chown -R discord:discord /opt/discord_multibot
```

### Install & enable the service

```bash
sudo cp multibot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now multibot.service
```

### Nützliche Befehle

```bash
# Show status
sudo systemctl status multibot.service

# Live logs (journald)
sudo journalctl -u multibot.service -f

# File log
tail -f /opt/discord_multibot/multibot.log

# Restart (e.g. after .env changes)
sudo systemctl restart multibot.service

# Stop
sudo systemctl stop multibot.service

# Disable autostart
sudo systemctl disable multibot.service
```

---

## Security Notes

- Never commit `.env` — it is listed in `.gitignore`
- `/backup_database` uses `os.system` — only use on trusted servers
- The systemd service runs under a restricted `discord` user with no root privileges
- Permission changes on roles are highlighted in **red** in the log channel