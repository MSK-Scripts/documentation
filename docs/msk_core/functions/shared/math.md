---
title: Math
sidebar_position: 3
---

# Math

## MSK.Math.Random

Generates a random number (as a string of digits) of the given length.

**Parameters**  
**length** - `number` - The Length of the number

**Returns**  
**number** - `string` - The number of the given length

```lua
local number = MSK.Math.Random(length)

-- Example
local number = MSK.Math.Random(3) -- Output: "123" or "475" or "285" or ...

-- As an Export:
local number = exports.msk_core:GetRandomNumber(length)
```

:::tip
`MSK.Math.Number` is kept as a backwards-compatible alias for `MSK.Math.Random`.
:::

## MSK.Math.Round

Rounds a number.

**Parameters**  
**number** - `number` - The Number that should be rounded  
**decimal** - `number` - The Length of the decimal digits

**Returns**  
**num** - `number` - The rounded number

```lua
local num = MSK.Math.Round(number, decimal)

-- Example
local num = MSK.Math.Round(25.8385)    -- Output: 26
local num = MSK.Math.Round(25.8385, 1) -- Output: 25.8
local num = MSK.Math.Round(25.8385, 2) -- Output: 25.84

-- As an Export:
local num = exports.msk_core:Round(number, decimal)
```

## MSK.Math.Comma

Format a number with separators, e.g. `1.000` for UIs.

**Parameters**  
**number** - `number` - The Number that should be separated  
**tag** - `string` - Optional

**Returns**  
**text** - `string` - The separated text

```lua
local text = MSK.Math.Comma(number, tag) -- tag is optional

-- Example
local text = MSK.Math.Comma(1000)      -- Output: 1.000
local text = MSK.Math.Comma(1000, ',') -- Output: 1,000

-- As an Export:
local text = exports.msk_core:Comma(number, tag)
```
