---
title: Docker
description: Den MSK Discord Ticket Bot in Docker betreiben, mit Compose, Volumes und Updates
sidebar_position: 3
---

## 🐳 Den Bot in Docker betreiben

Docker ist der kürzeste Weg zu einem laufenden Bot: keine Node-Installation, keine
Build-Werkzeuge für das native SQLite-Modul, und dasselbe Image auf einem VPS, einem
Raspberry Pi oder einem Heimserver. Die Images gibt es für **linux/amd64** und
**linux/arm64**.

```
ghcr.io/msk-scripts/discord_ticketbot:latest
```

Die Tags folgen den Releases: `latest` zeigt auf den Standard-Branch, mit `2`, `2.15`
und `2.15.0` legst du dich so genau fest, wie du möchtest.

---

### 1. Verzeichnisse vorbereiten

Zwei Dinge hält der Bot außerhalb des Images: seine Datenbank und seine Konfiguration.
Beide werden eingehängt, ein Image-Update fasst sie deshalb nie an.

```bash
mkdir -p ticketbot/config ticketbot/data
cd ticketbot
```

:::info[Der Container läuft unter einem unprivilegierten Nutzer]
Im Image läuft der Bot als uid 1000, nicht als root. Unter Linux müssen die beiden
eingehängten Verzeichnisse für diesen Nutzer beschreibbar sein:

```bash
sudo chown -R 1000:1000 config data
```

Ohne das stoppt der Container sofort und nennt im Log das Verzeichnis, in das er nicht
schreiben kann. Das ist Absicht: ein Bot, der startet, aber nichts speichern kann, ist
schlimmer als einer, der den Start verweigert.
:::

---

### 2. Umgebungsvariablen

Lege eine `.env` neben der Compose-Datei an:

```bash
TOKEN=dein_discord_bot_token
CLIENT_ID=deine_application_id
GUILD_ID=deine_server_id

# Optional, schaltet den gehosteten Transkript-Dienst frei
MSK_API_KEY=
MSK_API_URL=https://www.msk-scripts.de

# Optional. Leer bedeutet SQLite in data/tickets.db
DATABASE_URL=
```

---

### 3. docker-compose.yml

```yaml
services:
  ticketbot:
    image: ghcr.io/msk-scripts/discord_ticketbot:latest
    container_name: ticketbot
    restart: unless-stopped
    init: true
    env_file:
      - .env
    volumes:
      - ./data:/app/data
      - ./config:/app/config
```

`init: true` wird wichtig, sobald du das Dashboard nutzt: es startet den Bot als
Kindprozess, und ohne einen Init-Prozess wird dieses Kind nie aufgeräumt.

---

### 4. Erster Start

```bash
docker compose up -d
docker compose logs -f
```

Beim ersten Start kopiert der Container `config.jsonc` und `snippets.jsonc` in dein
eingehängtes `config/`-Verzeichnis und stoppt dann, weil die frische Konfiguration noch
Platzhalter enthält. Das Log nennt jedes Feld, um das es geht:

```
[ERROR] Config validation failed:
[ERROR]   - Field "openTicketChannelId" is still the example placeholder ("CHANNEL_ID_HERE").
```

Trage die Werte ein (siehe [Konfiguration](./configuration.md)) und starte erneut:

```bash
docker compose up -d
```

---

### 5. Das Web-Dashboard

Das Dashboard ist standardmäßig aus. Um es zu nutzen, ergänzt du die `.env`:

```bash
DASHBOARD_ENABLED=true
DASHBOARD_HOST=0.0.0.0
DASHBOARD_PORT=3010
DASHBOARD_PUBLIC_URL=https://tickets.example.com
CLIENT_SECRET=dein_discord_oauth_secret
```

und den Compose-Dienst:

```yaml
    command: node dashboard.js
    ports:
      - "127.0.0.1:3010:3010"
```

:::caution[DASHBOARD_HOST muss im Container 0.0.0.0 sein]
Der Standard `127.0.0.1` ist das Loopback des Containers selbst, das erreicht kein
Port-Mapping. Auf `0.0.0.0` zu lauschen ist hier unbedenklich, **weil** der
veröffentlichte Port an das Loopback des Hosts gebunden ist
(`127.0.0.1:3010:3010`). Setze einen Reverse Proxy mit TLS davor, siehe
[Dashboard](./dashboard.md).
:::

---

### 6. Aktualisieren

```bash
docker compose pull
docker compose up -d
```

Datenbank und Konfiguration liegen in den Mounts und überstehen das.

:::note[Der Update-Button funktioniert unter Docker nicht]
Der Update-Button im Dashboard führt `git pull` und `npm install` aus. Im Container gibt
es aber kein Checkout, unter Docker aktualisierst du deshalb über ein neues Image. Alles
andere im Dashboard arbeitet ganz normal.
:::

---

### 7. MariaDB oder PostgreSQL statt SQLite

SQLite ist der Standard und braucht nichts. Für eine externe Datenbank ergänzt du einen
Dienst und richtest `DATABASE_URL` darauf aus:

```yaml
  mariadb:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MARIADB_DATABASE: ticketbot
      MARIADB_USER: ticketbot
      MARIADB_PASSWORD: changeme
      MARIADB_RANDOM_ROOT_PASSWORD: "yes"
    volumes:
      - ./data/mariadb:/var/lib/mysql
```

```bash
DATABASE_URL=mysql://ticketbot:changeme@mariadb:3306/ticketbot
```

Der Hostname ist der Dienstname aus der Compose-Datei, nicht `localhost`. Wie du eine
bestehende SQLite-Datei umziehst, steht unter [Datenbank](./database.md).

---

### Das Image selbst bauen

Im Repository liegt das `Dockerfile` bei, ein lokaler Build kommt also ohne die
Registry aus:

```bash
git clone https://github.com/MSK-Scripts/discord_ticketbot.git
cd discord_ticketbot
docker build -t ticketbot .
```
