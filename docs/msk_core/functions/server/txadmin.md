---
title: txAdmin
sidebar_position: 22
---

# txAdmin

Shows txAdmin announcements, direct messages and scheduled restart warnings as MSK notifications. New in v4.1.0.

This is a passive feature with **no public `MSK.*` functions**. It is controlled through `Config.TxAdmin` in `config.lua` and runs only inside msk_core. Every message type is switched off by default.

## Config

```lua
Config.TxAdmin = {
    announcements = false,
    directMessages = false,
    restartWarnings = false,
    duration = 15000,
}
```

| Key | Description |
|---|---|
| `announcements` | Shows an announcement from the txAdmin panel to every player, titled `Announcement by <author>` |
| `directMessages` | Shows a direct message from the txAdmin panel to the player it was sent to, titled `Message from <author>` |
| `restartWarnings` | Shows the scheduled restart warning to every player, e.g. `The server restarts in 5 minute(s).` |
| `duration` | How long the notification stays visible in ms. Default: `15000` |

The config is read when msk_core starts, so restart msk_core after changing it.

Every restart warning uses the same notification id. A new warning therefore updates the one that is still on screen instead of stacking a second one below it.

## Hiding the txAdmin message

txAdmin keeps showing its own message as well, so players see both. To only show the MSK notification, hide the txAdmin default in your `server.cfg` for each type you switched on:

```cfg
setr txAdmin-hideDefaultAnnouncement true
setr txAdmin-hideDefaultDirectMessage true
setr txAdmin-hideDefaultScheduledRestartWarning true
```
