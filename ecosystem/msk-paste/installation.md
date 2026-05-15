---
title: Installation
sidebar_position: 2
---

# Self-Hosting MSK Paste

This guide walks you through installing MSK Paste on your own Debian or Ubuntu server. If you just want to use the hosted instance, head to [paste.msk-scripts.de](https://paste.msk-scripts.de) — no setup required.

---

## Requirements

| Component | Minimum Version |
|---|---|
| OS | Debian 11+ / Ubuntu 22.04+ |
| Node.js | 20.x or 22.x LTS |
| MariaDB | 10.6+ |
| Apache | 2.4+ (with `mod_proxy`, `mod_proxy_http`, `mod_headers`, `mod_ssl`) |
| Domain | A subdomain pointing to your server (e.g. `paste.example.com`) |
| SSL | Let's Encrypt (handled by the install script) |

:::tip
MSK Paste runs in a single Node process on port `3012` and uses MariaDB for storage. No Redis, no extra services.
:::

---

## Automated installation (recommended)

The repository ships with an interactive `install.sh` script that handles everything — Node.js setup, database creation, `.env` generation, Apache vhost, SSL certificate, and the systemd service.

```bash
# 1. Clone the repository
sudo git clone https://github.com/MSK-Scripts/msk-paste.git /opt/msk-paste
cd /opt/msk-paste

# 2. Run the install script as root
sudo bash deployment/scripts/install.sh
```

The script will ask you for:

- Your domain (e.g. `paste.example.com`)
- A strong database password
- An email address for Let's Encrypt
- An IP hash secret (generated automatically with `openssl rand -hex 32`)

When it finishes, the service is live at your domain over HTTPS.

---

## Manual installation

If you prefer to do it step by step:

### 1. Install Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Install MariaDB

```bash
sudo apt install -y mariadb-server
sudo mysql_secure_installation
```

### 3. Create database and user

```sql
CREATE DATABASE msk_paste CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'msk_paste'@'localhost' IDENTIFIED BY 'change_me_strong_password';
GRANT ALL PRIVILEGES ON msk_paste.* TO 'msk_paste'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Clone and configure

```bash
sudo git clone https://github.com/MSK-Scripts/msk-paste.git /opt/msk-paste
cd /opt/msk-paste
sudo cp .env.example .env
sudo chmod 600 .env
sudo nano .env
```

Fill in the variables (see [Environment variables](#environment-variables) below).

### 5. Install dependencies and build

```bash
sudo npm ci
sudo npm run migrate
sudo npm run build
```

### 6. Install the systemd unit

```bash
sudo cp msk-paste.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now msk-paste
sudo systemctl status msk-paste
```

### 7. Configure Apache

```bash
sudo cp deployment/apache/msk-paste.conf /etc/apache2/sites-available/
# Edit the file to match your domain
sudo nano /etc/apache2/sites-available/msk-paste.conf

sudo a2enmod proxy proxy_http headers ssl rewrite
sudo a2ensite msk-paste
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 8. Issue an SSL certificate

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d paste.example.com
```

---

## Environment variables

```bash
# ─── App ─────────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3012
NEXT_PUBLIC_BASE_URL=https://paste.example.com

# ─── Database (MariaDB) ─────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=msk_paste
DB_PASSWORD=change_me_strong_password
DB_NAME=msk_paste

# ─── Security ────────────────────────────────────────────────────────
# Generate with:  openssl rand -hex 32
IP_HASH_SECRET=change_me_with_openssl_rand_hex_32

# ─── Limits ──────────────────────────────────────────────────────────
RATE_LIMIT_CREATE_PER_HOUR=10
MAX_PASTE_SIZE_BYTES=1048576           # 1 MB
PASTE_ID_LENGTH=8
PASTE_ID_MIN_CUSTOM=4
PASTE_ID_MAX_CUSTOM=32
```

:::warning
The `IP_HASH_SECRET` must be at least 32 hex characters. Generate it with `openssl rand -hex 32`. **Never commit it to git.**
:::

---

## Scheduled tasks

Two cron jobs keep your instance healthy:

```bash
sudo crontab -e
```

```cron
# Daily backup at 03:00 (retains 14 days)
0 3 * * * /opt/msk-paste/deployment/scripts/backup.sh

# Cleanup expired pastes at 03:30
30 3 * * * cd /opt/msk-paste && /usr/bin/npx tsx scripts/cleanup.ts
```

---

## Updating

The repository includes an `update.sh` script for manual updates:

```bash
sudo bash /opt/msk-paste/deployment/scripts/update.sh
```

This pulls the latest commit, installs dependencies, runs migrations, rebuilds, and restarts the service.

If you have configured GitHub Actions deployment, pushing to `main` does this automatically.

---

## Verifying the installation

```bash
# Service status
sudo systemctl status msk-paste

# Live logs
sudo journalctl -u msk-paste -f

# Check it responds locally
curl -I http://localhost:3012

# Check it responds publicly over HTTPS
curl -I https://paste.example.com
```

You should see `HTTP/2 200` (or `HTTP/1.1 200 OK` locally).

---

## Troubleshooting

See the [FAQ](faq.md) for common issues such as `502 Bad Gateway`, port conflicts, and Let's Encrypt rate limits.
