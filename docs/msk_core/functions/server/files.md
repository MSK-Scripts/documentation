---
title: Files
sidebar_position: 21
---

# Files

Lists the files inside a folder of a resource. New in v4.1.0.

`LoadResourceFile` can read a file, but it cannot tell you which files exist. Data folders with one file per job, per vehicle or per shop therefore needed an index that had to be kept up to date by hand. With `MSK.Files.List` the folder itself is the index.

All functions are **server-side** only. They run inside your own resource, so there are no exports for them.

## MSK.Files.List

Returns the names of the files directly inside a folder, sorted alphabetically. Folders are left out and subfolders are not searched.

**Parameters**  
**resource** - `string` - Optional - Default: the calling resource - The resource that contains the folder  
**path** - `string` - The folder, relative to the resource root  
**pattern** - `string` - Optional - A Lua pattern every file name has to match  

**Returns**  
**files** - `table` - List of file names, without the folder in front. Empty when the folder does not exist  

```lua
local files = MSK.Files.List(resource, path, pattern)

-- Example: load every JSON file in data/shops of your own resource
for _, name in ipairs(MSK.Files.List(nil, 'data/shops', '%.json$')) do
    local content = LoadResourceFile(GetCurrentResourceName(), 'data/shops/' .. name)
    local shop = json.decode(content)

    print(name, shop.label)
end

-- Example: files of another resource
local files = MSK.Files.List('my_other_script', 'config/zones')
```

:::warning
The folder is listed through a shell command (`dir` on Windows, `ls` on Linux). Call it when your resource starts or when you reload data, not in a loop.

For the same reason a `path` that contains `"`, `` ` ``, `$` or `..` is refused with an error. A resource that does not exist raises an error as well.
:::
