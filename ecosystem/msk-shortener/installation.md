---
title: Installation
sidebar_position: 2
---

# Self-Hosting MSK Shortener

This guide walks you through installing MSK Shortener on your own Debian or Ubuntu server. If you just want a short link, head to [s.msk-scripts.de](https://s.msk-scripts.de) — no setup required.

---

## Requirements

| Component | Minimum Version |
|---|---|
| OS | Debian 11+ / Ubuntu 22.04+ |
| Node.js | 20.x or 22.x LTS |
| MariaDB | 10.6+ |
| Apache | 2.4+ (with `mod_proxy`, `mod_proxy_http`, `mod_headers`, `mod_ssl`) |
| Domain | A short subdomain pointing to your server (e.g. `s.example.com`) |
| SSL | Let's Encrypt (handled by the install script) |

:::tip
MSK Shortener runs as a single Node process on port `3011` and stores everything in MariaDB. No Redis, no extra services.
:::

---

## Automated installation (recommended)

The repository ships with an interactive `install.sh` script that handles Node.js setup, database creation, `.env` generation, Apache vhost, SSL certificate, and the systemd service.

```bash
# Run as root — the script clones into /opt/msk-shortener and configures everything
curl -fsSL https://raw.githubusercontent.com/MSK-Scripts/msk-shortener/main/deployment/scripts/install.sh \
  | sudo bash
```

The script will ask you for:

- Your domain (e.g. `s.example.com`)
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
CREATE DATABASE msk_shortener CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'msk_shortener'@'localhost' IDENTIFIED BY 'change_me_strong_password';
GRANT ALL PRIVILEGES ON msk_shortener.* TO 'msk_shortener'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Clone and configure

```bash
sudo git clone https://github.com/MSK-Scripts/msk-shortener.git /opt/msk-shortener
cd /opt/msk-shortener
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
sudo cp msk-shortener.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now msk-shortener
sudo systemctl status msk-shortener
```

### 7. Configure Apache

```bash
sudo cp deployment/apache/msk-shortener.conf /etc/apache2/sites-available/
# Edit the file to match your domain
sudo nano /etc/apache2/sites-available/msk-shortener.conf

sudo a2enmod proxy proxy_http headers ssl rewrite
sudo a2ensite msk-shortener
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 8. Issue an SSL certificate

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d s.example.com
```

---

## Environment variables

```bash
# ─── App ──────────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3011
NEXT_PUBLIC_BASE_URL=https://s.example.com

# ─── Database (MariaDB) ──────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=msk_shortener
DB_PASSWORD=change_me_strong_password
DB_NAME=msk_shortener

# ─── Security ────────────────────────────────────────────────────────
# Generate with:  openssl rand -hex 32
IP_HASH_SECRET=change_me_with_openssl_rand_hex_32

# ─── Rate limit ──────────────────────────────────────────────────────
RATE_LIMIT_CREATE_PER_HOUR=20

# ─── Short-code settings ─────────────────────────────────────────────
SHORTCODE_LENGTH=7
SHORTCODE_MIN_CUSTOM=3
SHORTCODE_MAX_CUSTOM=20
```

:::warning
The `IP_HASH_SECRET` must be at least 32 hex characters. Generate it with `openssl rand -hex 32`. **Never commit it to git** — without it, your click statistics lose their anonymization property.
:::

---

## Scheduled tasks

Two cron jobs keep your instance healthy:

```bash
sudo crontab -e
```

```cron
# Daily backup at 03:00 (retains 14 days)
0 3 * * * /opt/msk-shortener/deployment/scripts/backup.sh

# Cleanup expired links at 03:30
30 3 * * * cd /opt/msk-shortener && /usr/bin/npx tsx scripts/cleanup.ts
```

---

## Updating

The repository includes an `update.sh` script for manual updates:

```bash
sudo bash /opt/msk-shortener/deployment/scripts/update.sh
```

This pulls the latest commit, installs dependencies, runs migrations, rebuilds, and restarts the service.

If you have configured GitHub Actions deployment, pushing to `main` does this automatically.

---

## Verifying the installation

```bash
# Service status
sudo systemctl status msk-shortener

# Live logs
sudo journalctl -u msk-shortener -f

# Check it responds locally
curl -I http://localhost:3011

# Check it responds publicly over HTTPS
curl -I https://s.example.com
```

You should see `HTTP/2 200` (or `HTTP/1.1 200 OK` locally).

---

## Troubleshooting

See the [FAQ](faq.md) for common issues such as `502 Bad Gateway`, port conflicts, and Let's Encrypt rate limits.
