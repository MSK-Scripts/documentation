---
title: String
sidebar_position: 4
---

# String

String helper functions: random strings, prefix checks, trimming, and splitting.

## MSK.String.Random

Generates a random letter string (characters `A` to `Z` and `a` to `z`) of the given length.

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

The export `exports.msk_core:Trim` is the non-legacy `String.Trim`, so it matches `MSK.String.Trim`, not `MSK.Trim`.
:::

## MSK.String.Split

Splits `str` at every occurrence of `delimiter` into a list of substrings. The whole delimiter is searched as plain text, so separators with several characters like `', '` or `'::'` work, and characters such as `%` or `]` need no escaping. Empty pieces are left out.

**Parameters**  
**str** - `string` - The string to split  
**delimiter** - `string` - The delimiter to split on, must not be empty

**Returns**  
**result** - `string[]` - The list of substrings

```lua
local result = MSK.String.Split(str, delimiter)

-- Example
local text = 'license:12345678'
local result = MSK.String.Split(text, ':')
print(result[1], result[2]) -- Output: license  12345678

MSK.String.Split('police, ambulance, mechanic', ', ') -- Output: { 'police', 'ambulance', 'mechanic' }
MSK.String.Split('a::b', '::')                        -- Output: { 'a', 'b' }
MSK.String.Split('a,,b,', ',')                        -- Output: { 'a', 'b' }

-- As an Export:
local result = exports.msk_core:Split(str, delimiter)
```

:::info[Changed in v4.1.0]
The delimiter used to be treated as a set of single characters. `Split('a, b', ', ')` split on every comma **and** every space, and `'::'` split on each single `:`.
:::

## MSK.String.RandomPattern

Generates a random string that follows a pattern, for example for plates or phone numbers.

| Character | Becomes |
|---|---|
| `1` | a digit |
| `A` | an uppercase letter |
| `a` | a lowercase letter |
| `.` | a letter or digit |
| `^` | keeps the next character as it is, so `^1` produces a real `1` |

Every other character is kept as it is. With `length` the result has exactly that many characters: a shorter pattern is repeated, a longer result is cut.

**Parameters**  
**pattern** - `string` - The pattern  
**length** - `number` - Optional - Exact length of the result

**Returns**  
**text** - `string` - The generated string

```lua
local text = MSK.String.RandomPattern(pattern, length)

-- Example
MSK.String.RandomPattern('11AAA111')    -- e.g. '42KQZ907'
MSK.String.RandomPattern('AA-1111')     -- e.g. 'KD-4821'
MSK.String.RandomPattern('^1^1-1111')   -- e.g. '11-7302'
MSK.String.RandomPattern('1', 6)        -- e.g. '804215'
MSK.String.RandomPattern('A1', 5)       -- e.g. 'K3M8Q'
```
