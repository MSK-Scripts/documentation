---
title: VS Code Extension
sidebar_position: 4.5
---

# VS Code Extension

**MSK Core (FiveM) IntelliSense** adds autocompletion, signatures, hover documentation and type checking for the whole `MSK.*` API to Visual Studio Code and compatible editors.

The definitions cover msk_core **v4.1.0**: the `MSK` handle, every module namespace, the flat functions, the backwards compatibility aliases and the common export proxies.

## Installation

| Editor | Where to get it |
|---|---|
| Visual Studio Code | [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=musiker15.msk-core-lua), or search for **MSK Core** in the Extensions view |
| Cursor, VSCodium, Windsurf | [Open VSX](https://open-vsx.org/extension/musiker15/msk-core-lua), or search for **MSK Core** in the Extensions view |

You can also install it from the command palette (`Ctrl+P`):

```
ext install musiker15.msk-core-lua
```

The [Lua Language Server](https://marketplace.visualstudio.com/items?itemName=sumneko.lua) (`sumneko.lua`) is installed automatically as a dependency.

:::tip[FiveM natives]
The extension only covers `MSK.*`. For the FiveM natives install [`communityox.cfxlua-vscode-cox`](https://marketplace.visualstudio.com/items?itemName=communityox.cfxlua-vscode-cox) or the [fivem-lls-addon](https://github.com/overextended/fivem-lls-addon) as well. Both work side by side with this extension.
:::

## Setup

There is nothing to configure. The extension adds its definitions to `Lua.workspace.library` in your user settings, so they work in every project.

Your resource only needs the usual import in its `fxmanifest.lua`:

```lua
lua54 'yes'

shared_script '@msk_core/import.lua'
```

For workspaces that contain a `fxmanifest.lua`, the extension also sets `Lua.runtime.version` to `Lua 5.4`, but only if no runtime is configured there yet. Other Lua projects are not touched.

## Settings

| Setting | Default | Effect |
|---|---|---|
| `mskCore.enableLibrary` | `true` | Adds the definitions to `Lua.workspace.library`. |
| `mskCore.setRuntime` | `true` | Sets `Lua 5.4` for workspaces with a `fxmanifest.lua` that have no runtime set yet. |

Commands in the command palette:

- `MSK Core: Reload definitions`
- `MSK Core: Show definitions path`

When you uninstall the extension, it removes its library entries from your settings again.

## Client and server

Where the signatures differ, the client variant is the main signature and the server variant is shown as an overload. On the server almost every UI function takes the target player ID as its first argument:

```lua
MSK.Notification({ title = 'Title', message = 'Text', type = 'success' })         -- Client
MSK.Notification(source, { title = 'Title', message = 'Text', type = 'success' }) -- Server
```

Old parameter forms that are still supported but deprecated are shown struck through in the suggestion list.

## Unknown fields

`import.lua` forwards every name that is neither a module nor an alias to `exports.msk_core:<Name>`. The common exports are typed, but not every possible one, so a rarely used export can be reported as `undefined-field` even though it works at runtime.

If that happens, please [open an issue](https://github.com/MSK-Scripts/msk_core-vscode/issues) so the export gets added. You can also turn the check off in your settings:

```json
"Lua.diagnostics.disable": ["undefined-field"]
```

## Source

The extension is open source: [MSK-Scripts/msk_core-vscode](https://github.com/MSK-Scripts/msk_core-vscode). Issues and pull requests are welcome.
