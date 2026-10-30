---
title: Installation
sidebar_position: 2
---

# MSK Paste selbst hosten

Diese Anleitung führt dich durch die Installation von MSK Paste auf deinem eigenen Debian-
oder Ubuntu-Server. Willst du einfach die gehostete Instanz nutzen, geh direkt zu
[paste.msk-scripts.de](https://paste.msk-scripts.de), dort ist nichts einzurichten.

---

## Voraussetzungen

| Komponente | Mindestversion |
|---|---|
| Betriebssystem | Debian 11+ / Ubuntu 22.04+ |
| Node.js | 24 LTS oder neuer |
| MariaDB | 10.6+ |
| Apache | 2.4+ (mit `mod_proxy`, `mod_proxy_http`, `mod_headers`, `mod_ssl`) |
| Domain | Eine Subdomain, die auf deinen Server zeigt, etwa `paste.example.com` |
| SSL | Let's Encrypt, das übernimmt das Installationsskript |

:::tip
MSK Paste läuft in einem einzigen Node-Prozess auf Port `3012` und legt seine Daten in
MariaDB ab. Kein Redis, keine weiteren Dienste.
:::

---

## Automatische Installation (empfohlen)

Im Repository liegt ein interaktives Skript `install.sh`, das alles erledigt: Node.js
einrichten, Datenbank anlegen, `.env` erzeugen, Apache-vHost, SSL-Zertifikat und den
systemd-Dienst.

```bash
# 1. Repository klonen
sudo git clone https://github.com/MSK-Scripts/msk-paste.git /opt/msk-paste
cd /opt/msk-paste

# 2. Installationsskript als root ausführen
sudo bash deployment/scripts/install.sh
```

Das Skript fragt dich nach:

- deiner Domain, etwa `paste.example.com`
- einem starken Datenbankpasswort
- einer E-Mail-Adresse für Let's Encrypt
- einem Geheimnis für den IP-Hash (wird automatisch mit `openssl rand -hex 32` erzeugt)

Ist es durch, läuft der Dienst unter deiner Domain über HTTPS.

---

## Installation von Hand

Wenn du lieber Schritt für Schritt vorgehst:

### 1. Node.js 24 installieren

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. MariaDB installieren

```bash
sudo apt install -y mariadb-server
sudo mysql_secure_installation
```

### 3. Datenbank und Nutzer anlegen

```sql
CREATE DATABASE msk_paste CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'msk_paste'@'localhost' IDENTIFIED BY 'change_me_strong_password';
GRANT ALL PRIVILEGES ON msk_paste.* TO 'msk_paste'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Klonen und konfigurieren

```bash
sudo git clone https://github.com/MSK-Scripts/msk-paste.git /opt/msk-paste
cd /opt/msk-paste
sudo cp .env.example .env
sudo chmod 600 .env
sudo nano .env
```

Trage die Variablen ein, siehe [Umgebungsvariablen](#umgebungsvariablen) weiter unten.

### 5. Abhängigkeiten installieren und bauen

```bash
sudo npm ci
sudo npm run migrate
sudo npm run build
```

### 6. systemd-Unit installieren

```bash
sudo cp msk-paste.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now msk-paste
sudo systemctl status msk-paste
```

### 7. Apache einrichten

```bash
sudo cp deployment/apache/msk-paste.conf /etc/apache2/sites-available/
# Datei an deine Domain anpassen
sudo nano /etc/apache2/sites-available/msk-paste.conf

sudo a2enmod proxy proxy_http headers ssl rewrite
sudo a2ensite msk-paste
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 8. SSL-Zertifikat ausstellen

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d paste.example.com
```

---

## Umgebungsvariablen

```bash
# ─── Anwendung ───────────────────────────────────────────────────────
NODE_ENV=production
PORT=3012
NEXT_PUBLIC_BASE_URL=https://paste.example.com

# ─── Datenbank (MariaDB) ─────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=3306
DB_USER=msk_paste
DB_PASSWORD=change_me_strong_password
DB_NAME=msk_paste

# ─── Sicherheit ──────────────────────────────────────────────────────
# Erzeugen mit:  openssl rand -hex 32
IP_HASH_SECRET=change_me_with_openssl_rand_hex_32

# ─── Spamschutz ──────────────────────────────────────────────────────
# Cloudflare Turnstile für das Formular, in Produktion Pflicht
CAPTCHA_SITE_KEY=
CAPTCHA_SECRET_KEY=
# Pastes und Bytes, die eine IP-Adresse über das Formular in 24 Stunden anlegen darf
DAILY_PASTES_PER_IP=20
DAILY_BYTES_PER_IP=5242880
# Pastes, die ein API-Key pro Stunde anlegen darf
API_KEY_CREATE_PER_HOUR=120

# ─── Grenzen ─────────────────────────────────────────────────────────
RATE_LIMIT_CREATE_PER_HOUR=10
# 1 MB
MAX_PASTE_SIZE_BYTES=1048576
PASTE_ID_LENGTH=8
PASTE_ID_MIN_CUSTOM=4
PASTE_ID_MAX_CUSTOM=32
```

:::warning
Das `IP_HASH_SECRET` muss mindestens 32 Hex-Zeichen lang sein. Erzeuge es mit
`openssl rand -hex 32` und **committe es niemals nach Git.**
:::

:::info
Das Formular zum Anlegen braucht ein Turnstile-Widget von Cloudflare. Lege es im
Cloudflare-Dashboard unter **Turnstile** für den Hostnamen deiner Instanz an, etwa
`paste.example.com`, und trag Site-Key und Secret-Key in `CAPTCHA_SITE_KEY` und
`CAPTCHA_SECRET_KEY` ein. In Produktion sind beide Pflicht, ohne sie legt das Formular
keine Pastes an. Die Testschlüssel von Cloudflare (Site-Key `1x00000000000000000000AA`,
Secret `1x0000000000000000000000000000000AA`) bestehen immer, aber nur außerhalb der
Produktion.
:::

---

## Geplante Aufgaben

Zwei Cronjobs halten deine Instanz in Schuss:

```bash
sudo crontab -e
```

```cron
# Tägliches Backup um 03:00 Uhr (14 Tage Aufbewahrung)
0 3 * * * /opt/msk-paste/deployment/scripts/backup.sh

# Abgelaufene Pastes um 03:30 Uhr aufräumen
30 3 * * * cd /opt/msk-paste && /usr/bin/npx tsx scripts/cleanup.ts
```

---

## API-Keys

Wer über die [REST-API](api.md#authentifizierung) Pastes anlegen will, braucht einen
API-Key. Selbstbedienung gibt es nicht, du stellst Keys auf dem Server mit dem Key-Skript
aus. Es muss `/opt/msk-paste/.env` lesen können, führe es also als root oder als
Dienstnutzer aus:

```bash
sudo bash /opt/msk-paste/scripts/api-key.sh help
```

Die Befehle:

- `list`: alle Keys mit ID, Präfix, Bezeichnung, Anlagezeitpunkt, letzter Nutzung und Zustand
- `create ["<label>"]`: stellt einen neuen Key aus, der mit `mskp_` beginnt. Er wird **nur einmal** angezeigt, sichere ihn sofort
- `revoke <key|prefix|id>`: sperrt einen Key sofort. Seine Zeile bleibt mit dem Zeitpunkt der Sperre stehen
- `delete <key|prefix|id>`: entfernt einen Key ganz
- `help`: zeigt diese Übersicht

Zum Beispiel:

```bash
sudo bash /opt/msk-paste/scripts/api-key.sh create "CI-Pipeline"
sudo bash /opt/msk-paste/scripts/api-key.sh revoke 3
```

Gespeichert wird nur ein scrypt-Hash eines Keys, in der Tabelle `api_keys`, die die
Migration `003_api_keys.sql` anlegt, dazu ein kurzes Präfix, damit du die Keys in `list`
auseinanderhalten kannst. Ein verlorener Key lässt sich nicht erneut anzeigen: sperre ihn
und stell einen neuen aus. Jeder Key darf 120 Pastes pro Stunde anlegen
(`API_KEY_CREATE_PER_HOUR`).

---

## Aktualisieren

Im Repository liegt ein Skript `update.sh` für Updates von Hand:

```bash
sudo bash /opt/msk-paste/deployment/scripts/update.sh
```

Es holt den neuesten Commit, installiert die Abhängigkeiten, führt die Migrationen aus,
baut neu und startet den Dienst neu.

Hast du den Deploy über GitHub Actions eingerichtet, passiert das bei jedem Push auf `main`
automatisch.

:::warning
Kommst du von einer Fassung ohne Spamschutz? Installiere zuerst Node.js 24 und ergänze die
neuen Variablen in der `.env`, siehe [Umgebungsvariablen](#umgebungsvariablen). Ohne
`CAPTCHA_SITE_KEY` und `CAPTCHA_SECRET_KEY` legt das Formular in Produktion keine Pastes
mehr an, und Skripte, die über die API Pastes anlegen, brauchen ab dann einen
[API-Key](#api-keys).
:::

---

## Die Installation prüfen

```bash
# Status des Dienstes
sudo systemctl status msk-paste

# Logs live mitlesen
sudo journalctl -u msk-paste -f

# Antwortet er lokal?
curl -I http://localhost:3012

# Antwortet er öffentlich über HTTPS?
curl -I https://paste.example.com
```

Du solltest `HTTP/2 200` sehen, lokal `HTTP/1.1 200 OK`.

---

## Fehlersuche

Häufige Probleme wie `502 Bad Gateway`, belegte Ports und die Ratenbegrenzung von
Let's Encrypt stehen in der [FAQ](faq.md).
