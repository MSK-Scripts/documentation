---
title: Installation
description: Installation
sidebar_position: 2
---

## 🚀 Installation

### Requirements
- **Node.js >= 18** (built-in `fetch` required for the Trivia API)
- **npm**
- Optional: `mysqldump` for `/backup_database`

### 1. Clone the repository

```bash
git clone https://github.com/MSK-Scripts/discord-multibot-js.git
cd discord-multibot-js
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
# → Fill in your tokens, IDs and database credentials
```

> Each bot requires its own bot application in the
> [Discord Developer Portal](https://discord.com/developers/applications).
> Bots without a token are automatically skipped on startup.

### 4. Manual test run

```bash
node main.js
```

---

## systemd Service

A ready-to-use systemd unit file is included at `multibot-js.service`.

### 1. Adjust paths and user if necessary

Default values in the service file: user `deploy`, path `/home/deploy/discord_multibot_js`.

### 2. Copy the service file

```bash
sudo cp multibot-js.service /etc/systemd/system/
```

### 3. Enable and start the service

```bash
sudo systemctl daemon-reload
sudo systemctl enable multibot-js
sudo systemctl start multibot-js
```

> **Note:** The service reads the `.env` file via `EnvironmentFile=`. Make sure the file exists at the configured path and is readable by the service user.

### Useful Commands

```bash
# Show status
sudo systemctl status multibot-js

# Live logs
journalctl -u multibot-js -f

# Restart (e.g. after .env changes or updates)
sudo systemctl restart multibot-js

# Stop
sudo systemctl stop multibot-js

# Disable autostart
sudo systemctl disable multibot-js
```

---

## Security Notes

- Never commit `.env` — it is listed in `.gitignore`
- `/backup_database` uses `execFile` (no shell injection risk) — only use on trusted servers
- The service user (`deploy`) should have no root privileges
- Permission changes on roles are highlighted in **red** in the log channel
