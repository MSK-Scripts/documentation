---
title: MSK Core
sidebar_position: 1
---

![MSK Core](/img/msk_core_banner.png)

# MSK Core

**MSK Core** is the shared library that powers every MSK Scripts resource. It gives you a clean framework abstraction (ESX, QBCore, ox_core — or fully **STANDALONE**), a modern React-based NUI and a large set of battle-tested helper functions, all exposed through a single global `MSK` table that any resource can import in one line.

:::info[Version]
This documentation covers **msk_core `v3.0.0`**. With v3 the whole core was rebuilt around a lazy-loading module system and the NUI was migrated to React + Vite + TypeScript. The public API (`MSK.*` and `exports.msk_core:*`) stays backwards-compatible — legacy names keep working through the alias and export layer.
:::

## Highlights

- **Framework bridge** — write your script once and run it on ESX, QBCore, ox_core or STANDALONE. Detection is automatic (`Config.Framework = 'AUTO'`).
- **Inventory bridge** — `ox_inventory`, `core_inventory`, `jaksam_inventory`, the ESX/Chezza default, or your own `custom` implementation.
- **Lazy-loaded modules** — modules are compiled into your resource only when you first touch them, so there is no overhead for what you don't use.
- **Modern NUI** — Notify, Input, Numpad, Progressbar, TextUI, Context Menu and Menu in the MSK design language (React, fully offline/bundled).
- **Everything twice** — every function is reachable both as `MSK.Function(...)` and as `exports.msk_core:Function(...)`.
- **Utilities** — callbacks, cron jobs, ace permissions, commands, webhooks, math/string/table/vector helpers, version & dependency checking and more.

## Requirements

* [oxmysql](https://github.com/overextended/oxmysql)

### Optional Requirements

* [ESX 1.9.2 and above](https://github.com/esx-framework/esx_core) or [QBCore](https://github.com/qbcore-framework/qb-core) — only required for **framework-based** functions *(see [Frameworks](./frameworks.md))*
* [ox_inventory](https://github.com/overextended/ox_inventory) / [core_inventory](https://forum.cfx.re/t/core_inventory/) / [jaksam_inventory](https://forum.cfx.re/t/jaksams-inventory-create-items-in-game/5388694) — only required for **inventory-based** functions

## Quick Start

Add the import to **your** resource's `fxmanifest.lua` (make sure `lua54 'yes'` is set):

```lua
lua54 'yes'

shared_script '@msk_core/import.lua'
```

You now have the global `MSK` table everywhere in that resource:

```lua
MSK.Notification('MSK Scripts', 'Welcome to my server!', 'success', 5000)

local players = MSK.GetPlayers()
print(('There are %s players online'):format(#players))
```

See [Installation](./installation.md) for the full setup, [Configuration](./configuration.md) for `config.lua`, [Frameworks](./frameworks.md) for the bridge, and **Functions** for the complete API reference.

## UI Preview

### MSK.Notification
![Notify](/img/notify.png)

### MSK.TextUI
![TextUI](/img/textui.png)

### MSK.Progressbar
![Progressbar](/img/progressbar.png)

### MSK.Input
![Input Large](/img/input_large.png)
![Input Small](/img/input_small.png)

### MSK.Numpad
![Numpad](/img/numpad.png)
![Numpad Incorrect](/img/numpad_incorrect.png)

![Numpad Numbers](/img/numpad_numbers.png)
![Numpad Masked](/img/numpad_masked.png)

## License

msk_core is licensed under the **GNU Lesser General Public License v3.0 or later** ([LGPL-3.0-or-later](https://www.gnu.org/licenses/lgpl-3.0.html)).

The core itself is open and must stay open, but **any** resource — free or paid — may use msk_core as a dependency without being forced to adopt the same license.

:::info
The names, logos, and brands **"MSK Scripts"** and **"Musiker15"** are trademarks of the Licensor and are not covered by the LGPL.
:::
