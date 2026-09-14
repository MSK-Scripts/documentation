---
title: Logger
sidebar_position: 19
---

# Logger

Sends log entries from your scripts to an external log service. Supported are **Grafana Loki**, **Datadog** and **Fivemanage**. New in v4.1.0.

Entries are collected and sent in batches, once per second or as soon as 50 entries are waiting. Anything still queued is sent when msk_core stops. As long as no service is configured, nothing is queued and nothing is sent, so the module costs nothing when you do not use it.

All functions are **server-side** only.

## Configuration

The Logger is configured **only through convars** in your `server.cfg`. There is no entry in `config.lua`, so API keys never end up inside a script.

:::danger[Use `set`, never `setr`]
`setr` replicates a convar to every connected client, and with it your API key. Every Logger convar has to be written with `set`.
:::

```cfg
# Which service to use: loki, datadog or fivemanage
set msk:logger "loki"

# Optional: service name attached to every entry. Default: fivem
set msk:logger:service "my-server"

# Optional: host name attached to every entry. Default: sv_projectName without color codes
set msk:logger:hostname "server-1"
```

The service is picked once when msk_core starts. After changing `msk:logger` you have to restart msk_core.

### Grafana Loki

```cfg
set msk:logger "loki"
set msk:loki:endpoint "https://loki.example.com"
set msk:loki:user "user"          # optional, basic auth
set msk:loki:password "secret"    # optional, basic auth
set msk:loki:tenant "tenant-id"   # optional, sent as X-Scope-OrgID
```

`msk:loki:endpoint` is required. If it has no `http://` or `https://` in front, `https://` is added. The entries are pushed to `<endpoint>/loki/api/v1/push`.

Each stream is labeled with `service`, `server`, `resource` and `event`. Everything else (message, player, identifiers, tags, extra) goes into the log line as JSON, so your own tags do not create new label combinations in Loki.

### Datadog

```cfg
set msk:logger "datadog"
set msk:datadog:key "api-key"
set msk:datadog:site "datadoghq.eu"   # optional, default: datadoghq.com
```

`msk:datadog:key` is required. Entries are sent with `ddsource` set to `fivem`, and `resource`, `event`, the player's license and your own tags are added to `ddtags`.

### Fivemanage

```cfg
set msk:logger "fivemanage"
set msk:fivemanage:key "api-key"
set msk:fivemanage:dataset "my-dataset"   # optional
```

`msk:fivemanage:key` is required. Your tags are added to the metadata of the entry, but they never overwrite the built-in fields (`hostname`, `service`, `event`, `source`, `player`, `identifiers`, `extra`).

:::info
An unknown service name, or a service without its endpoint or key, prints a warning to the server console on start. The Logger stays switched off then, and `MSK.Logger.Log` returns `false`.
:::

## MSK.Logger.Log

Queues a log entry. The entry is sent with the next batch.

When `source` is a player, the player's name, the license and every identifier **except the IP address** are added to the entry. They are read once per player and forgotten when the player leaves. The name of the resource that called the function is added as well.

Color codes like `~r~`, `^1` and `^#ff0000` are removed from the message and the player name before sending.

**Parameters**  
**source** - `number` - Optional - The player's server id. Pass `0` or `nil` for entries that do not belong to a player  
**event** - `string` - A short machine readable name, e.g. `'shop:purchase'`  
**message** - `string` - The log message  
**extra** - `table` - Optional - Any additional data. It has to be JSON serializable  
**tags** - `string` or `table` - Optional - `key:value` pairs as a string `'a:1,b:2'`, a list `{'a:1', 'b:2'}` or a table `{a = 1, b = 2}`  

**Returns**  
**queued** - `boolean` - `false` when no log service is configured  

```lua
local queued = MSK.Logger.Log(source, event, message, extra, tags)

-- Example
MSK.Logger.Log(source, 'shop:purchase', 'Bought a pistol', { price = 2500 })

-- With tags
MSK.Logger.Log(source, 'shop:purchase', 'Bought a pistol', nil, 'shop:ammunation,item:pistol')

-- Not tied to a player
MSK.Logger.Log(0, 'economy:payday', 'Paychecks were paid out', { players = 42 })

-- As an Export:
local queued = exports.msk_core:LoggerLog(source, event, message, extra, tags)
```

:::warning
An entry whose `extra` cannot be encoded as JSON (a function or userdata inside it) is skipped with a warning in the console. The other entries of the same batch are still sent.
:::

## MSK.Logger.IsEnabled

Whether a log service is configured and entries are being sent. Useful to skip building expensive log data when nobody receives it.

**Returns**  
**enabled** - `boolean`  

```lua
local enabled = MSK.Logger.IsEnabled()

-- Example
if MSK.Logger.IsEnabled() then
    MSK.Logger.Log(source, 'inventory:snapshot', 'Inventory on logout', player.GetInventory())
end

-- As an Export:
local enabled = exports.msk_core:LoggerEnabled()
```
