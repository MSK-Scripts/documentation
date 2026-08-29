---
title: Dashboard unter Linux einrichten
description: Schritt für Schritt zum Web-Dashboard des Ticket Bots auf einem Linux-Server, mit Apache und systemd, erreichbar über HTTPS.
sidebar_position: 2
---

# Dashboard unter Linux einrichten

Schritt für Schritt zum optionalen Web-Dashboard auf einem Linux-Server (Apache und
systemd), erreichbar über HTTPS.

:::note[Zwei getrennte Ebenen]
Damit das läuft, braucht es zwei voneinander unabhängige Dinge: einen **Reverse Proxy**
(Apache), der HTTPS beendet und an das Dashboard weiterreicht, und eine
**Dienstverwaltung** (systemd), die den Node-Prozess am Leben hält. Der Reverse Proxy
startet den Bot nicht, und systemd kümmert sich nicht um HTTPS. Du brauchst beides.
:::

## Voraussetzungen

- Node.js ab Version 24 und Git installiert.
- Der Bot ist bereits eingerichtet und läuft, mit gültiger `.env` (`TOKEN`, `CLIENT_ID`, `GUILD_ID`).
- Eine Subdomain für das Dashboard, etwa `tickets.example.com`, mit einem **A-Record** im DNS auf diesen Server.
- Apache mit den Modulen `proxy`, `proxy_http`, `headers`, `rewrite` und `ssl`, dazu `certbot` für das Zertifikat.

## Firewall

Das Dashboard lauscht nur auf `127.0.0.1`, sein Port (standardmäßig `3010`) ist von außen
also **nicht** erreichbar und braucht **keine** Firewall-Regel. Lass ihn zu. Nur Apache muss
aus dem Internet erreichbar sein:

| Richtung | Regel | Wofür |
|---|---|---|
| Eingehend | **TCP 80** | Ausstellung und Erneuerung des Let's-Encrypt-Zertifikats (ACME) sowie die Weiterleitung von HTTP auf HTTPS |
| Eingehend | **TCP 443** | HTTPS, der eigentliche Verkehr des Dashboards |
| Ausgehend | TCP 443 | Discord, Let's Encrypt, Updates (meist ohnehin erlaubt) |

Mit UFW:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Öffne Port 3010 **nicht**. UDP wird nicht gebraucht.

## 1. Die geführte Einrichtung starten

Im Ordner des Bots:

```bash
npm run dashboard:setup
```

- Wähle **b** (öffentlich, hinter einem Reverse Proxy mit HTTPS).
- Port: `3010` beibehalten (oder einen freien nehmen und ihn dir merken).
- Trage deine Domain ein, etwa `tickets.example.com`.
- Hinterlege die angezeigte **Redirect-URI** im [Discord Developer Portal](https://discord.com/developers/applications) unter **OAuth2 → Redirects**, sie lautet `https://tickets.example.com/auth/callback`.
- Füge auf Nachfrage dein **Client Secret** ein (OAuth2 → Client Secret).

Das schreibt die richtige `.env`. Das Dashboard lauscht auf `127.0.0.1`, der Port liegt
also nie offen. Der Assistent gibt außerdem den Apache-Abschnitt von unten aus.

## 2. Reverse Proxy (Apache)

Speichere die Datei als `/etc/apache2/sites-available/ticketbot-dashboard.conf` und passe
Domain sowie, falls geändert, den Port an:

```apache
<VirtualHost *:80>
    ServerName tickets.example.com
    RewriteEngine On
    RewriteRule ^/?(.*) https://tickets.example.com/$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName tickets.example.com

    SSLEngine on
    # Die Pfade zum Zertifikat trägt certbot für dich ein

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:3010/
    ProxyPassReverse / http://127.0.0.1:3010/

    # Das Dashboard nimmt die Client-IP aus dem RECHTESTEN Eintrag von
    # X-Forwarded-For. Apache hängt den echten Client dort an.
    RequestHeader set X-Forwarded-Proto "https"
</VirtualHost>
```

Danach alles aktivieren und das Zertifikat ausstellen:

```bash
sudo a2enmod proxy proxy_http headers rewrite ssl
sudo a2ensite ticketbot-dashboard
sudo certbot --apache -d tickets.example.com
sudo systemctl reload apache2
```

`certbot` trägt die Zertifikatspfade ein und richtet die automatische Erneuerung ein.

## 3. Den Bot als Dienst laufen lassen (systemd)

Nimm `dashboard.js` als Einstiegspunkt, nicht `index.js`, dann beaufsichtigt es den Bot
gleich mit. Lege `/etc/systemd/system/ticketbot.service` an:

:::note
Das ersetzt den Dienst für den reinen Bot aus der [Installation](../installation.md).
`dashboard.js` startet den Bot selbst, du betreibst also nie beides gleichzeitig. Hast du
schon eine `ticketbot.service`, die auf `index.js` zeigt, überschreibt diese sie einfach.
Stoppe sie vorher mit `sudo systemctl stop ticketbot`.
:::

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

Dann:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ticketbot
sudo journalctl -u ticketbot -f --output=cat
```

:::tip
Für einen ersten Test reicht `npm run dashboard` in einer Konsole, um zu sehen, ob alles
läuft. Danach beenden und den Dienst starten. Betreibe niemals beides gleichzeitig, sie
würden sich um den Port streiten.
:::

## 4. Aufrufen

Öffne `https://tickets.example.com` und melde dich mit Discord an. Als Serverinhaber bist
du automatisch Administrator. Allen anderen gibst du unter **Berechtigungen** Zugriff.

## Fehlersuche

- **Die Anmeldung leitet mit einem Fehler zurück**: Die Redirect-URI im Discord-Portal muss **exakt** `DASHBOARD_PUBLIC_URL` plus `/auth/callback` entsprechen, einschließlich `https`.
- **502 oder 503 von Apache**: Der Bot-Prozess läuft nicht. Prüfe `systemctl status ticketbot` und ob er auf dem eingestellten Port lauscht.
- **Das Dashboard verweigert den Start und nennt die Konfiguration unsicher**: Du hast es ohne HTTPS an eine öffentliche Schnittstelle gebunden. Lass `DASHBOARD_HOST=127.0.0.1` stehen und geh über Apache.
