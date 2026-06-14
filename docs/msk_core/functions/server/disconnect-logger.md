---
title: Disconnect Logger
sidebar_position: 16
---

# Disconnect Logger

When enabled, the Disconnect Logger reacts to the `playerDropped` event and logs every player who leaves the server. It can write to the **server console**, send a **Discord webhook**, and draws a **3D text marker** at the world position where the player disconnected for every online client.

This is a passive feature with **no public `MSK.*` functions** — it is controlled entirely through `Config.DisconnectLogger`.

## Config

```lua
Config.DisconnectLogger = {
    enable = false, -- Set to true if you want to use this Feature

    console = {
        enable = false,
        text = "The player ^3%s^0 with the ^3ID %s^0 has left the server.\n^4Time:^0 %s\n^4Reason:^0 %s\n^4Identifier:^0\n    %s\n    %s\n    %s\n^4Coordinates:^0 %s"
    },

    discord = {
        enable = false, -- Set true to enable DiscordLogs // Add Webhook Link in modules/DisconnectLogger/server.lua
        color = "6205745",
        botName = "MSK Scripts",
        botAvatar = "https://i.imgur.com/PizJGsh.png",
        title = "Player Disconnected",
        text = "The player **%s** with the **ID %s** has left the server."
    }
}
```

| Key | Description |
|---|---|
| `enable` | Master switch for the whole feature |
| `console.enable` | Print a formatted message to the server console |
| `console.text` | The console format string (`%s` placeholders: name, id, time, reason, steam, license, discord, coords) |
| `discord.enable` | Send a Discord webhook embed on disconnect |
| `discord.color` | Embed color (decimal) |
| `discord.botName` / `discord.botAvatar` | Webhook bot identity |
| `discord.title` / `discord.text` | Embed title and description (`text` placeholders: name, id) |

## Discord Webhook

The webhook URL is **not** in the config. Enable `discord.enable` and insert your webhook link at the top of the `playerDropped` handler in `modules/DisconnectLogger/server.lua`:

```lua
AddEventHandler('playerDropped', function(reason)
    -- Insert the Webhook Link here
    local discordWebhookLink = ""
    ...
```

The embed is sent via `MSK.AddWebhook` and includes the disconnect reason, coordinates and the player's steam / license / discord identifiers.

## 3D Disconnect Marker

On every disconnect the server broadcasts `msk_core:discLogger` to all clients. Each client then draws, for **60 seconds**, a green marker plus a 3D text label (player name, id and reason) at the exact coordinates where the player disconnected. The label and marker are only rendered when the local player is within `20.0` units of the disconnect position. This is handled entirely client-side in `modules/DisconnectLogger/client.lua` and requires no configuration beyond `Config.DisconnectLogger.enable`.

:::info
All three outputs (console, Discord, 3D marker) are gated by the master `Config.DisconnectLogger.enable` switch; console and Discord additionally require their own `enable` flag.
:::
