---
title: Installation
sidebar_position: 2
---

# Installation

## Download

Grab the latest release from the [GitHub Releases](https://github.com/MSK-Scripts/msk_core/releases) page and drop `msk_core` into your `resources` folder.

## Start order

`msk_core` must start **before** any resource that imports it, and **after** your framework and inventory. A typical order in `server.cfg`:

```ini
ensure oxmysql
ensure es_extended   # or qb-core / ox_core (optional)
ensure ox_inventory  # or another inventory (optional)
ensure msk_core
# ... your resources that use msk_core
```

:::warning
`msk_core` requires **Lua 5.4**. Every consuming resource that imports it must set `lua54 'yes'` in its own `fxmanifest.lua`, otherwise the import will throw an error.
:::

## Import

:::tip
The import is already integrated in all MSK Scripts resources — if you use one of our scripts you don't need to add anything.
:::

Add the following line to the `fxmanifest.lua` of **your** resource to get the global `MSK` table:

```lua
shared_script '@msk_core/import.lua'
```

After that you can use every function directly:

```lua
MSK.Notification('Title', 'This is a Notification', 'general', 5000)
```

## Eager loading (optional)

Modules are loaded lazily on first use. If you want a module to be compiled into your resource up front (for example to register events as early as possible), list it in your `fxmanifest.lua` with the `msk_core` key:

```lua
shared_script '@msk_core/import.lua'

msk_core 'callback'
msk_core 'player'
```

The value is the module folder name (case-insensitive lookup). Unknown names produce a console warning.

## Exports

Every function is also available as an export, so you can use `msk_core` without the `@import` in resources where you prefer exports:

```lua
exports.msk_core:Notification('Title', 'This is a Notification', 'general', 5000)
```

Note that some export names differ from the `MSK.*` path (for example `MSK.String.Random` ↔ `exports.msk_core:GetRandomString`). The correct export name is listed on each function's documentation page.

## Ace Permission

For the functions `MSK.AddAce`, `MSK.RemoveAce`, `MSK.AddPrincipal` and `MSK.RemovePrincipal` add the following to your `server.cfg`:

```ini
add_ace resource.msk_core command.add_ace allow
add_ace resource.msk_core command.remove_ace allow
add_ace resource.msk_core command.add_principal allow
add_ace resource.msk_core command.remove_principal allow
```

See [Ace Permission](./functions/server/ace-permission.md) for details.
