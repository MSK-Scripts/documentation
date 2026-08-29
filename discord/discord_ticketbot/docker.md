---
title: Docker
description: Run the MSK Discord Ticket Bot in Docker, with compose, volumes and updates
sidebar_position: 3
---

## 🐳 Running the bot in Docker

Docker is the shortest path to a running bot: no Node installation, no build
tools for the native SQLite module, and the same image on a VPS, a Raspberry Pi
or a home server. Images are published for **linux/amd64** and **linux/arm64**.

```
ghcr.io/msk-scripts/discord_ticketbot:latest
```

Tags follow the releases: `latest` tracks the default branch, `2`, `2.15` and
`2.15.0` pin as tightly as you want.

---

### 1. Prepare the directories

The bot keeps two things outside the image: its database and its configuration.
Both are mounted, so an image update never touches them.

```bash
mkdir -p ticketbot/config ticketbot/data
cd ticketbot
```

:::info[The container runs as an unprivileged user]
Inside the image the bot runs as uid 1000, not as root. On Linux the two mounted
directories have to be writable by that user:

```bash
sudo chown -R 1000:1000 config data
```

Without it the container stops immediately with a message naming the directory
it cannot write to. That is deliberate: a bot that starts but cannot save
anything is worse than one that refuses to start.
:::

---

### 2. Environment

Create a `.env` next to the compose file:

```bash
TOKEN=your_discord_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_server_id

# Optional, unlocks the hosted transcript service
MSK_API_KEY=
MSK_API_URL=https://www.msk-scripts.de

# Optional. Empty means SQLite in data/tickets.db
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

`init: true` matters as soon as you run the dashboard: it forks the bot as a
child process, and without an init process that child is never reaped.

---

### 4. First start

```bash
docker compose up -d
docker compose logs -f
```

On the first start the container copies `config.jsonc` and `snippets.jsonc` into
your mounted `config/` directory and then stops, because the fresh config still
contains placeholders. The log names every field it wants:

```
[ERROR] Config validation failed:
[ERROR]   - Field "openTicketChannelId" is still the example placeholder ("CHANNEL_ID_HERE").
```

Fill those in (see [Configuration](./configuration.md)), then start again:

```bash
docker compose up -d
```

---

### 5. The web dashboard

The dashboard is off by default. To use it, add to your `.env`:

```bash
DASHBOARD_ENABLED=true
DASHBOARD_HOST=0.0.0.0
DASHBOARD_PORT=3010
DASHBOARD_PUBLIC_URL=https://tickets.example.com
CLIENT_SECRET=your_discord_oauth_secret
```

and to the compose service:

```yaml
    command: node dashboard.js
    ports:
      - "127.0.0.1:3010:3010"
```

:::caution[DASHBOARD_HOST has to be 0.0.0.0 in a container]
The default `127.0.0.1` is the container's own loopback, which no port mapping
can reach. Binding to `0.0.0.0` is safe here **because** the published port is
bound to the host's loopback (`127.0.0.1:3010:3010`); put a reverse proxy with
TLS in front of it, see [Dashboard](./dashboard.md).
:::

---

### 6. Updating

```bash
docker compose pull
docker compose up -d
```

Your database and config are in the mounts and survive it.

:::note[The update button does not work in Docker]
The dashboard's update button runs `git pull` and `npm install`. There is no
checkout inside the container, so in Docker you update by pulling a new image.
Everything else in the dashboard works normally.
:::

---

### 7. Using MariaDB or PostgreSQL instead of SQLite

SQLite is the default and needs nothing. For an external database, add a service
and point `DATABASE_URL` at it:

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

The host name is the service name from the compose file, not `localhost`. See
[Database](./database.md) for migrating an existing SQLite file.

---

### Building the image yourself

The repository ships the `Dockerfile`, so a local build works without the
registry:

```bash
git clone https://github.com/MSK-Scripts/discord_ticketbot.git
cd discord_ticketbot
docker build -t ticketbot .
```
