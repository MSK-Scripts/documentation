---
title: Installation
sidebar_position: 2
---

# Self-Hosting MSKanban

This guide walks you through installing MSKanban on your own Debian or Ubuntu server. MSKanban is **only** meant to be self-hosted — there is no managed SaaS instance, and the demo at `demo.mskanban.app` wipes its database nightly.

Two shapes are supported:

1. **Docker on a single host**, behind a TLS-terminating reverse proxy (recommended).
2. **Bare-metal Node.js on Debian**, behind Apache2 (mirrors the maintainer's reference environment).

Both shapes share the same minimum dependencies.

---

## Requirements

| Component | Minimum Version |
|---|---|
| OS | Debian 11+ / Ubuntu 22.04+ |
| Node.js | 22.x LTS (bare-metal only — container ships its own) |
| MariaDB | 10.11+ (MySQL 8 compatible) |
| Redis | 7+ |
| Apache | 2.4+ (`mod_proxy`, `mod_proxy_http`, `mod_proxy_wstunnel`, `mod_headers`, `mod_ssl`, `mod_rewrite`, `mod_http2`) |
| Domain | A subdomain pointing to your server (e.g. `kanban.example.com`) |
| SSL | Let's Encrypt via certbot |

:::tip
Why **Redis** as a hard requirement? It backs rate limiting, session storage (for the WebSocket relay's connection tickets), and the BullMQ webhook delivery queue. MSKanban will not start without it.
:::

---

## Pre-flight checklist

- [ ] DNS A/AAAA record for the chosen hostname points to the server.
- [ ] Apache modules listed above are enabled.
- [ ] `AUTH_SECRET` and `SERVER_ENCRYPTION_KEY` generated with `openssl rand -base64 32` (independent values).
- [ ] Dedicated unprivileged MariaDB user (no `GRANT` permission).
- [ ] Backup target reachable (gpg-encrypted offsite recommended).
- [ ] Firewall: only `:443` (and `:80` for ACME) open to the internet.

---

## Option 1: Docker (recommended)

### 1.1 Clone the repo and prepare secrets

```bash
sudo git clone https://github.com/MSK-Scripts/mskanban.git /opt/mskanban
cd /opt/mskanban

# Copy the example env and edit
sudo cp .env.example .env
sudo chmod 600 .env
sudo nano .env
```

Fill the env file (see [Environment variables](#environment-variables) below).

### 1.2 Bring the stack up

```bash
cd /opt/mskanban
sudo docker compose -f docker/docker-compose.prod.yml up -d
```

The compose file binds the app to `127.0.0.1:3000` and the WebSocket relay to `127.0.0.1:3001` — both **localhost-only**. A reverse proxy on the host terminates TLS and proxies to those ports.

### 1.3 Configure Apache as the TLS-terminating reverse proxy

```bash
sudo cp apache/mskanban.conf.example /etc/apache2/sites-available/mskanban.conf
sudo sed -i 's/kanban\.example\.com/kanban.your-domain.com/g' \
  /etc/apache2/sites-available/mskanban.conf

sudo a2enmod ssl headers proxy proxy_http proxy_wstunnel rewrite http2 deflate
sudo a2ensite mskanban
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 1.4 Issue an SSL certificate

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d kanban.your-domain.com
```

### 1.5 Verify

```bash
# Health endpoint
curl https://kanban.your-domain.com/api/health
# → {"ok":true,...}

# Container status
sudo docker compose -f docker/docker-compose.prod.yml ps
```

---

## Option 2: Bare-metal on Debian + Apache

### 2.1 Install runtime dependencies

```bash
# Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm
sudo corepack enable
sudo corepack prepare pnpm@latest --activate

# MariaDB + Redis
sudo apt install -y mariadb-server redis-server
sudo mysql_secure_installation
```

### 2.2 Database setup

```sql
CREATE DATABASE mskanban CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'mskanban'@'localhost' IDENTIFIED BY 'change_me_strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE, INDEX, ALTER, CREATE, REFERENCES
  ON mskanban.* TO 'mskanban'@'localhost';
-- No GRANT permission, no DROP — the migration tool needs CREATE/ALTER but
-- not the ability to escalate privileges.
FLUSH PRIVILEGES;
```

### 2.3 Application user, directories, env

```bash
sudo useradd --system --create-home --shell /usr/sbin/nologin mskanban
sudo install -d -o mskanban -g mskanban -m 0750 /opt/mskanban /var/lib/mskanban /etc/mskanban

sudo git clone https://github.com/MSK-Scripts/mskanban.git /opt/mskanban
sudo chown -R mskanban:mskanban /opt/mskanban

sudo install -o root -g mskanban -m 0640 /dev/null /etc/mskanban/env
sudo nano /etc/mskanban/env
```

Fill `/etc/mskanban/env` with the values from the [Environment variables](#environment-variables) section.

### 2.4 Install, migrate, build

```bash
cd /opt/mskanban
sudo -u mskanban pnpm install --frozen-lockfile --prod
sudo -u mskanban pnpm prisma migrate deploy
sudo -u mskanban pnpm build
```

### 2.5 systemd unit

```bash
sudo cp docs/deployment/mskanban.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now mskanban
sudo systemctl status mskanban
```

The unit ships hardened: `NoNewPrivileges`, `ProtectSystem=strict`, capability set empty, syscall filter, network restricted to localhost.

### 2.6 Apache vhost + TLS

```bash
sudo cp apache/mskanban.conf.example /etc/apache2/sites-available/mskanban.conf
sudo sed -i 's/kanban\.example\.com/kanban.your-domain.com/g' \
  /etc/apache2/sites-available/mskanban.conf
sudo a2enmod ssl headers proxy proxy_http proxy_wstunnel rewrite http2 deflate
sudo a2ensite mskanban
sudo systemctl reload apache2

sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d kanban.your-domain.com
```

---

## Environment variables

```bash
# ─── App ─────────────────────────────────────────────────────────────
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://kanban.your-domain.com

# ─── Database (MariaDB) ──────────────────────────────────────────────
DATABASE_URL=mysql://mskanban:change_me_strong_password@127.0.0.1:3306/mskanban

# ─── Redis ───────────────────────────────────────────────────────────
REDIS_URL=redis://127.0.0.1:6379

# ─── Auth + Crypto ───────────────────────────────────────────────────
# Generate each with:  openssl rand -base64 32
AUTH_SECRET=change_me_with_openssl_rand_base64_32
SERVER_ENCRYPTION_KEY=change_me_with_openssl_rand_base64_32

# ─── WebAuthn / Passkeys ─────────────────────────────────────────────
WEBAUTHN_RP_ID=kanban.your-domain.com
WEBAUTHN_RP_NAME=MSKanban
WEBAUTHN_RP_ORIGIN=https://kanban.your-domain.com

# ─── Mail (optional, used for login notifications) ───────────────────
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=no-reply@your-domain.com

# ─── Attachments ─────────────────────────────────────────────────────
STORAGE_DRIVER=local
STORAGE_LOCAL_PATH=/var/lib/mskanban/storage
ATTACHMENT_MAX_BYTES=26214400         # 25 MB

# ─── Logging ─────────────────────────────────────────────────────────
LOG_LEVEL=info
```

:::warning
- `AUTH_SECRET` and `SERVER_ENCRYPTION_KEY` are **independent** values. Reusing one for the other defeats the purpose of having both.
- The `WEBAUTHN_RP_ID` **must** exactly match your hostname (no scheme, no port). Mismatch breaks Passkey registration silently.
- **Never** commit `.env` or `/etc/mskanban/env` to git. Both have restrictive permissions baked into the setup steps above.
:::

---

## Updating

### Docker

```bash
cd /opt/mskanban
sudo docker compose -f docker/docker-compose.prod.yml pull
sudo docker compose -f docker/docker-compose.prod.yml up -d
```

### Bare-metal

```bash
sudo -u mskanban git -C /opt/mskanban fetch --tags
sudo -u mskanban git -C /opt/mskanban checkout v<x.y.z>
sudo -u mskanban pnpm install --frozen-lockfile --prod
sudo -u mskanban pnpm prisma migrate deploy
sudo -u mskanban pnpm build
sudo systemctl restart mskanban
```

:::tip
Read the [release notes](https://github.com/MSK-Scripts/mskanban/releases) before upgrading across a minor boundary. Pre-1.0 means breaking schema changes are possible — `pnpm prisma migrate deploy` will refuse to apply a migration that drops a column you still depend on.
:::

---

## Verifying the installation

```bash
# Health endpoint
curl https://kanban.your-domain.com/api/health

# Service status (bare-metal)
sudo systemctl status mskanban
sudo journalctl -u mskanban -f --since "5 minutes ago"

# Container status (Docker)
sudo docker compose -f /opt/mskanban/docker/docker-compose.prod.yml ps
sudo docker compose -f /opt/mskanban/docker/docker-compose.prod.yml logs -f app
```

You should see `{"ok":true,"db":"up","redis":"up"}` from the health endpoint.

---

## Backups

A daily MariaDB dump is the bare minimum. The crypto envelope means even a stolen backup is useless without the user's password, but you still want it for disaster recovery:

```bash
sudo crontab -e
```

```cron
# Daily DB dump at 03:00, retained for 14 days, gpg-encrypted offsite
0 3 * * * /opt/mskanban/scripts/backup.sh
```

For attachments, sync `/var/lib/mskanban/storage` to your offsite target as well — attachment ciphertext is on disk, not in the DB.

---

## Troubleshooting

See the [FAQ](faq.md) for common issues such as `502 Bad Gateway`, WebSocket relay drops, Passkey registration failures, and recovery-key loss.
