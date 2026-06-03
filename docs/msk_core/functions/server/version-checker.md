---
title: Version Checker
sidebar_position: 9
---

# Version Checker

Check your resource against the latest GitHub release and validate dependency versions. Both functions are **server-side** only.

## MSK.Check.Version

Compares the `version` from your resource's `fxmanifest.lua` against the latest **GitHub release** and prints the result to the server console. The current version is read from the **invoking** resource automatically.

**Parameters**  
**repo** - `table` - The repository information

| Key | Type | Description |
|---|---|---|
| `author` | `string` | GitHub owner/organization (**required**) |
| `name` | `string` | GitHub repository name (**required**) |
| `download` | `string?` | Custom download link printed when an update is available (default: the release page) |
| `print` | `boolean?` | Also print a message when the resource is already up to date |
| `checkName` | `boolean / table?` | Warn if the resource folder was renamed. Pass `{ notify = true }` to repeat the warning every 5s |

```lua
-- MSK.Check.Version can also be called directly as MSK.Check(repo)
MSK.Check.Version({
    author = 'MSK-Scripts',
    name = 'msk_garage',
    print = true,
    download = 'https://msk-scripts.tebex.io/',
})

-- As an Export:
exports.msk_core:CheckVersion({ author = 'MSK-Scripts', name = 'msk_garage' })
```

:::tip
The `version` in your `fxmanifest.lua` and the GitHub release tag must follow the `x.x.x` format (e.g. `1.0.0`).
:::

## MSK.Check.Dependency

Checks whether another started resource meets a minimum version requirement.

**Parameters**  
**resource** - `string` - The resource name to check  
**minimumVersion** - `string` - The minimum required version (`x.x.x`)  
**showMessage** - `boolean?` - Print an error to the console if the requirement is not met

**Returns**  
**success** - `boolean` - Whether the dependency meets the minimum version  
**errorMessage** - `string?` - The error message when the requirement is not met

```lua
local success, errorMessage = MSK.Check.Dependency(resource, minimumVersion, showMessage)

-- Example
local success = MSK.Check.Dependency('msk_core', '3.0.0', true)

if not success then
    -- msk_core is older than 3.0.0
    return
end

-- As an Export:
local success, errorMessage = exports.msk_core:CheckDependency(resource, minimumVersion, showMessage)
```
