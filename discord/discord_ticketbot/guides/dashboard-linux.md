---
title: Dashboard Setup on Linux
description: Step-by-step guide to run the ticket bot web dashboard on a Linux server with Apache and systemd, reachable over HTTPS.
sidebar_position: 2
---

# Dashboard Setup on Linux

A step-by-step guide to run the optional web dashboard on a Linux server (Apache +
systemd) and reach it over HTTPS.

:::note[Two separate layers]
Getting this working means two independent things: a **reverse proxy** (Apache)
that terminates HTTPS and forwards to the dashboard, and a **service manager**
(systemd) that keeps the Node process alive. The reverse proxy does not run the
bot, and systemd does not handle HTTPS. You need both.
:::

## Prerequisites

- Node.js 22+ and Git installed.
- The bot already set up and running, with a valid `.env` (`TOKEN`, `CLIENT_ID`, `GUILD_ID`).
- A subdomain for the dashboard, e.g. `tickets.example.com`, with a DNS **A record** pointing to this server.
- Apache with the `proxy`, `proxy_http`, `headers`, `rewrite` and `ssl` modules, and `certbot` for the certificate.

## Firewall

The dashboard binds to `127.0.0.1` only, so its port (default `3010`) is **not**
reachable from outside and needs **no** firewall rule. Leave it closed. Only
Apache must be reachable from the internet:

| Direction | Rule | Why |
|---|---|---|
| Inbound | **TCP 80** | Let's Encrypt certificate issuance/renewal (ACME) and HTTP → HTTPS redirect |
| Inbound | **TCP 443** | HTTPS, the actual dashboard traffic |
| Outbound | TCP 443 | Discord, Let's Encrypt, updates (usually already allowed) |

With UFW:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Do **not** open port 3010. No UDP is required.

## 1. Run the guided setup

In the bot folder:

```bash
npm run dashboard:setup
```

- Choose **b** (public, behind a reverse proxy with HTTPS).
- Port: keep `3010` (or pick a free one and remember it).
- Enter your domain, e.g. `tickets.example.com`.
- Add the shown **Redirect URI** in the [Discord Developer Portal](https://discord.com/developers/applications) under **OAuth2 → Redirects** (it will be `https://tickets.example.com/auth/callback`).
- Paste your **Client Secret** (OAuth2 → Client Secret) when asked.

This writes the correct `.env`. The dashboard binds to `127.0.0.1`, so the port is
never exposed directly. The wizard also prints the Apache snippet below.

## 2. Reverse proxy (Apache)

Save as `/etc/apache2/sites-available/ticketbot-dashboard.conf` (replace the
domain and, if you changed it, the port):

```apache
<VirtualHost *:80>
    ServerName tickets.example.com
    RewriteEngine On
    RewriteRule ^/?(.*) https://tickets.example.com/$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName tickets.example.com

    SSLEngine on
    # certbot fills in the certificate paths for you

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3010/
    ProxyPassReverse / http://127.0.0.1:3010/

    # The dashboard derives the client IP from the RIGHTMOST X-Forwarded-For
    # entry. Apache appends the real client here.
    RequestHeader set X-Forwarded-Proto "https"
</VirtualHost>
```

Then enable everything and issue the certificate:

```bash
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo a2ensite ticketbot-dashboard
sudo certbot --apache -d tickets.example.com
sudo systemctl reload apache2
```

`certbot` fills in the certificate paths and sets up automatic renewal.

## 3. Keep the bot running as a service (systemd)

Use `dashboard.js` (not `index.js`) as the entry point so it also supervises the
bot. Create `/etc/systemd/system/ticketbot.service`:

```ini
[Unit]
Description=Discord Ticket Bot (with dashboard)
After=network.target

[Service]
Type=simple
User=discord
WorkingDirectory=/opt/discord_ticketbot
ExecStart=/usr/bin/node /opt/discord_ticketbot/dashboard.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ticketbot
sudo journalctl -u ticketbot -f --output=cat
```

:::tip
For a first test, just run `npm run dashboard` in a terminal to confirm
everything works, then stop it and start the service. Do not run both at once —
they would fight over the port.
:::

## 4. Open it

Go to `https://tickets.example.com` and log in with Discord. As the server owner
you are automatically admin. Grant everyone else access under **Permissions**.

## Troubleshooting

- **Login redirects back with an error** — the redirect URI in the Discord portal must match `DASHBOARD_PUBLIC_URL` + `/auth/callback` **exactly**, including `https`.
- **502 / 503 from Apache** — the bot process is not running. Check `systemctl status ticketbot` and that it listens on the configured port.
- **The dashboard refuses to start, saying the configuration is not safe** — you bound it to a public interface without HTTPS. Keep `DASHBOARD_HOST=127.0.0.1` and reach it through Apache.
