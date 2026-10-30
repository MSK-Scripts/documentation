---
title: Installation
sidebar_position: 2
---

# Self-Hosting MSK Shortener

This guide walks you through installing MSK Shortener on your own Debian or Ubuntu server. If you just want a short link, head to [s.msk-scripts.de](https://s.msk-scripts.de), no setup required.

---

## Requirements

| Component | Minimum Version |
|---|---|
| OS | Debian 11+ / Ubuntu 22.04+ |
| Node.js | 24 LTS or newer |
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
# Run as root. The script clones into /opt/msk-shortener and configures everything
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

### 1. Install Node.js 24

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
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

# ─── Spam protection ─────────────────────────────────────────────────
# Cloudflare Turnstile for the create form, required in production
CAPTCHA_SITE_KEY=
CAPTCHA_SECRET_KEY=
# Links one IP address may shorten through the form per 24 hours
DAILY_LINKS_PER_IP=20
# Links one API key may shorten per hour
API_KEY_CREATE_PER_HOUR=120

# ─── Short-code settings ─────────────────────────────────────────────
SHORTCODE_LENGTH=7
SHORTCODE_MIN_CUSTOM=3
SHORTCODE_MAX_CUSTOM=20
```

:::warning
The `IP_HASH_SECRET` must be at least 32 hex characters. Generate it with `openssl rand -hex 32`. **Never commit it to git**, without it, your click statistics lose their anonymization property.
:::

:::info
The create form needs a Cloudflare Turnstile widget. Create one in the Cloudflare dashboard under **Turnstile** for the hostname of your instance (e.g. `s.example.com`) and put its site key and secret key into `CAPTCHA_SITE_KEY` and `CAPTCHA_SECRET_KEY`. Both are required in production: without them the form refuses to shorten links. Cloudflare's test keys (site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`) always pass, but only outside production.
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

## API keys

Creating links through the [REST API](api.md#authentication) needs an API key. There is no self-service, you issue keys on the server with the key script. It needs read access to `/opt/msk-shortener/.env`, so run it as root or as the service user:

```bash
sudo bash /opt/msk-shortener/scripts/api-key.sh help
```

The commands:

- `list`: all keys with id, prefix, label, creation time, last use and state
- `create ["<label>"]`: issues a new key starting with `msks_`. It is shown **once**, store it right away
- `revoke <key|prefix|id>`: blocks a key at once. Its row stays, with the time it was revoked
- `delete <key|prefix|id>`: removes a key entirely
- `help`: shows this overview

For example:

```bash
sudo bash /opt/msk-shortener/scripts/api-key.sh create "Discord bot"
sudo bash /opt/msk-shortener/scripts/api-key.sh revoke 3
```

Only a scrypt hash of a key is stored, in the table `api_keys` that migration `005_api_keys.sql` adds, together with a short prefix so you can tell keys apart in `list`. A lost key cannot be shown again: revoke it and issue a new one. Each key may shorten 120 links per hour (`API_KEY_CREATE_PER_HOUR`).

---

## Updating

The repository includes an `update.sh` script for manual updates:

```bash
sudo bash /opt/msk-shortener/deployment/scripts/update.sh
```

This pulls the latest commit, installs dependencies, runs migrations, rebuilds, and restarts the service.

If you have configured GitHub Actions deployment, pushing to `main` does this automatically.

:::warning
Coming from a version without spam protection? Install Node.js 24 first and add the new variables to `.env` (see [Environment variables](#environment-variables)). Without `CAPTCHA_SITE_KEY` and `CAPTCHA_SECRET_KEY` the form stops shortening links in production, and scripts that create links through the API need an [API key](#api-keys) from then on.
:::

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
