---
title: String
sidebar_position: 4
---

# String

String helper functions: random strings, prefix checks, trimming, and splitting.

## MSK.String.Random

Generates a random letter string (characters `A`–`Z` and `a`–`z`) of the given length.

**Parameters**  
**length** - `number` - Length of the generated string

**Returns**  
**text** - `string` - The random string

```lua
local text = MSK.String.Random(length)

-- Example
local text = MSK.String.Random(3)               -- e.g. 'aBc'
local text = string.upper(MSK.String.Random(3)) -- e.g. 'ABC'

-- As an Export:
local text = exports.msk_core:GetRandomString(length)
```

## MSK.String.StartsWith

Checks whether `str` begins with `startStr`.

**Parameters**  
**str** - `string` - The string to check  
**startStr** - `string` - The prefix to search for

**Returns**  
**startsWith** - `boolean` - Whether `str` starts with `startStr`

```lua
local startsWith = MSK.String.StartsWith(str, startStr)

-- Example
local text = 'Hello'
local startsWith = MSK.String.StartsWith(text, 'H') -- true
local startsWith = MSK.String.StartsWith(text, 'e') -- false

-- As an Export:
local startsWith = exports.msk_core:StartsWith(str, startStr)
```

## MSK.String.Trim

Trims a string. Without `bool` it removes only leading/trailing whitespace; with `bool = true` it removes **all** whitespace.

**Parameters**  
**str** - `string` - The string to trim  
**bool** - `boolean` - Optional - `true` removes all whitespace

**Returns**  
**trimmed** - `string` - The trimmed string

```lua
local trimmed = MSK.String.Trim(str, bool)

-- Example
local text = ' Hello World '
MSK.String.Trim(text)       -- 'Hello World' (leading/trailing only)
MSK.String.Trim(text, true) -- 'HelloWorld'  (all whitespace)

-- As an Export:
local trimmed = exports.msk_core:Trim(str, bool)
```

:::caution
`MSK.Trim` and `MSK.String.Trim` behave **differently**. The top-level alias `MSK.Trim` resolves to `String.TrimLegacy`, which has the **inverted** boolean semantic from v2:

- `MSK.Trim(str)` removes **all** whitespace (equivalent to `MSK.String.Trim(str, true)`).
- `MSK.Trim(str, true)` removes only leading/trailing whitespace (equivalent to `MSK.String.Trim(str)`).

The export `exports.msk_core:Trim` is the non-legacy `String.Trim`, so it matches `MSK.String.Trim` — not `MSK.Trim`.
:::

## MSK.String.Split

Splits `str` at every occurrence of `delimiter` into a list of substrings.

**Parameters**  
**str** - `string` - The string to split  
**delimiter** - `string` - The delimiter to split on

**Returns**  
**result** - `string[]` - The list of substrings

```lua
local result = MSK.String.Split(str, delimiter)

-- Example
local text = 'license:12345678'
local result = MSK.String.Split(text, ':')
print(result[1], result[2]) -- Output: license  12345678

-- As an Export:
local result = exports.msk_core:Split(str, delimiter)
```
