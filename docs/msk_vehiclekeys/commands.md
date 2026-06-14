---
title: Commands & Keybinds
sidebar_position: 3
---

# Commands & Keybinds

All commands and their hotkeys are defined in `config.lua`
(`Config.Commands`, `Config.Hotkeys` and `Config.AdminCommand`).

## Player Commands

| Command | Default Key | Description |
|---|---|---|
| `/lock` | `L` | (Un)lock the closest vehicle |
| `/keyMenu` | `U` | Open the keys menu |
| `/refreshKeys` | — | Re-add missing permanent keys for your owned vehicles |

```lua
Config.Commands = {
    lock = {enable = true, command = 'lock'},
    keyMenu = {enable = true, command = 'keyMenu'},
    refreshKeys = {enable = true, command = 'refreshKeys'}
}

Config.Hotkeys = {
    lock = {enable = true, key = 'L'},
    keyMenu = {enable = true, key = 'U'},
}
```

:::info
- A hotkey only works while its command is `enable = true`.
- Players can rebind the keys under **Settings → Key Bindings → FiveM** in-game.
:::

## Admin Command

| Command | Description |
|---|---|
| `/adlock` | (Un)lock the closest vehicle **without** needing a key |

```lua
Config.AdminCommand = {
    enable = true,
    command = 'adlock',
    groups = {'superadmin', 'admin'}
}
```

The admin command uses **Ace Permissions**. Add your admins to one of the configured
groups, for example:

```cfg
add_ace group.admin command.adlock allow
add_ace group.superadmin command.adlock allow
```

:::tip
Admins in `Config.AdminCommand.groups` can also use the **lock hotkey** on vehicles listed
in [`Config.AdminVehicles`](config.md#admin-vehicles) without owning a key.
:::
</content>
