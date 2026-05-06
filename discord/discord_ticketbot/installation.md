---
title: Installation
description: Installation
sidebar_position: 2
---

## 🚀 Installation

### Requirements

- **Node.js** v18 or newer
- A Discord bot token — [discord.com/developers/applications](https://discord.com/developers/applications)

### 1. Install dependencies

```bash
cd discord_ticketbot
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```bash
# Required
TOKEN="your_bot_token"
CLIENT_ID="your_application_id"
GUILD_ID="your_server_id"

# Optional — MSK Transcript Service (get your key at www.msk-scripts.de/verify)
MSK_API_KEY="your_msk_api_key"
MSK_API_URL="https://www.msk-scripts.de"
```

### 3. Set up the configuration

```bash
cp config/config.example.jsonc config/config.jsonc
```

Edit `config/config.jsonc` as needed — all fields are commented.

### 4. (Optional) Set up canned responses

```bash
cp config/snippets.example.jsonc config/snippets.jsonc
```

Edit `config/snippets.jsonc` to define your team's canned responses. If the file does not exist, `/snippet` commands will show a setup hint.

### 5. Start the bot

```bash
npm start
```

On first start the bot will automatically:
- Create the SQLite database at `data/tickets.db`
- Register all slash commands on your server

### 5. Set up the panel

Run `/setup` on your Discord server (Administrator permission required). The bot will send the ticket panel to the channel configured in `openTicketChannelId`.

---

## 🖥️ Autostart with systemd (Linux Server)

The included `ticketbot.service` file lets the bot start automatically after a server reboot.

### 1. Copy the bot files to the server

```bash
sudo cp -r discord_ticketbot /opt/discord_ticketbot
sudo useradd -r -s /bin/false discord
sudo chown -R discord:discord /opt/discord_ticketbot
```

### 2. Set up .env on the server

```bash
sudo nano /opt/discord_ticketbot/.env
```

### 3. Verify the Node.js path

```bash
which node
# e.g.: /usr/bin/node
```

If the path differs, adjust `ExecStart` in `ticketbot.service` accordingly.

### 4. Install the systemd unit

```bash
sudo cp /opt/discord_ticketbot/ticketbot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now ticketbot.service
```

### 5. Check the status

```bash
sudo systemctl status ticketbot.service
sudo journalctl -u ticketbot.service -f
```

### Useful commands

| Command                                    | Description       |
| ------------------------------------------ | ----------------- |
| `sudo systemctl start ticketbot.service`   | Start the bot     |
| `sudo systemctl stop ticketbot.service`    | Stop the bot      |
| `sudo systemctl restart ticketbot.service` | Restart the bot   |
| `sudo systemctl enable ticketbot.service`  | Enable autostart  |
| `sudo systemctl disable ticketbot.service` | Disable autostart |
| `sudo journalctl -u ticketbot.service -f`  | Follow live logs with colors |