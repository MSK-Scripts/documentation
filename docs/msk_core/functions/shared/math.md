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

Rounds a number to `decimal` decimal places. Halves are rounded away from zero, so `2.5` becomes `3` and `-2.5` becomes `-3`. Negative decimal places round to tens, hundreds and so on. With `0` or negative decimal places the result is a whole number.

**Parameters**  
**number** - `number` - The Number that should be rounded  
**decimal** - `number` - Optional - Default: `0` - Decimal places, negative values round to tens, hundreds, ...

**Returns**  
**num** - `number` - The rounded number

```lua
local num = MSK.Math.Round(number, decimal)

-- Example
local num = MSK.Math.Round(25.8385)    -- Output: 26
local num = MSK.Math.Round(25.8385, 1) -- Output: 25.8
local num = MSK.Math.Round(25.8385, 2) -- Output: 25.84
local num = MSK.Math.Round(2.5)        -- Output: 3
local num = MSK.Math.Round(-2.5)       -- Output: -3
local num = MSK.Math.Round(1234, -2)   -- Output: 1200

-- As an Export:
local num = exports.msk_core:Round(number, decimal)
```

:::info[Changed in v4.1.0]
Halves used to be rounded to the nearest even number (`2.5` became `2`), and negative decimal places raised an error.
:::

## MSK.Math.Comma

Format a number with separators, e.g. `1.000` for UIs.

**Parameters**  
**number** - `number` - The Number that should be separated  
**tag** - `string` - Optional - Default: `'.'` - The separator

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

## MSK.Math.Clamp

Limits `value` to the range between `min` and `max`. If `min` is bigger than `max`, the two are swapped.

**Parameters**  
**value** - `number` - The value  
**min** - `number` - Lower limit  
**max** - `number` - Upper limit

**Returns**  
**value** - `number` - The limited value

```lua
local value = MSK.Math.Clamp(value, min, max)

-- Example
MSK.Math.Clamp(150, 0, 100) -- Output: 100
MSK.Math.Clamp(-5, 0, 100)  -- Output: 0
MSK.Math.Clamp(42, 0, 100)  -- Output: 42
```

## MSK.Math.Lerp

Linear interpolation between `from` and `to`. `t = 0` gives `from`, `t = 1` gives `to`. Works with numbers and vectors alike.

**Parameters**  
**from** - `number/vector2/vector3/vector4` - Start value  
**to** - `number/vector2/vector3/vector4` - End value, same type as `from`  
**t** - `number` - Factor, usually between `0` and `1`

**Returns**  
**value** - `number/vector` - The interpolated value

```lua
local value = MSK.Math.Lerp(from, to, t)

-- Example
MSK.Math.Lerp(0, 100, 0.25) -- Output: 25.0
MSK.Math.Lerp(vector3(0.0, 0.0, 0.0), vector3(10.0, 0.0, 0.0), 0.5) -- Output: vector3(5.0, 0.0, 0.0)
```

## MSK.Math.InverseLerp

The opposite of `Lerp`: returns where `value` sits between `from` and `to`, as a factor (`0` at `from`, `1` at `to`). Returns `0.0` when `from` and `to` are equal.

**Parameters**  
**from** - `number` - Start value  
**to** - `number` - End value  
**value** - `number` - The value to locate

**Returns**  
**t** - `number` - The factor

```lua
local t = MSK.Math.InverseLerp(from, to, value)

-- Example
MSK.Math.InverseLerp(0, 200, 50) -- Output: 0.25
```

## MSK.Math.Remap

Maps `value` from one range onto another, for example `0..100` health onto `0..1000`. With `clamp` the result stays inside the output range.

**Parameters**  
**value** - `number` - The value  
**inMin** - `number` - Start of the input range  
**inMax** - `number` - End of the input range  
**outMin** - `number` - Start of the output range  
**outMax** - `number` - End of the output range  
**clamp** - `boolean` - Optional - Default: `false` - Keep the result inside the output range

**Returns**  
**value** - `number` - The mapped value

```lua
local value = MSK.Math.Remap(value, inMin, inMax, outMin, outMax, clamp)

-- Example
MSK.Math.Remap(50, 0, 100, 0, 1000)        -- Output: 500.0
MSK.Math.Remap(120, 0, 100, 0, 1000, true) -- Output: 1000.0
```

## MSK.Math.HexToRgb

Converts a hex color into red, green and blue values from `0` to `255`. Accepts `#rgb`, `#rgba`, `#rrggbb` and `#rrggbbaa`, with or without `#`. Alpha is `nil` when the input has none. An invalid color raises an error.

**Parameters**  
**hex** - `string` - The hex color

**Returns**  
**r** - `number` - Red, `0` to `255`  
**g** - `number` - Green, `0` to `255`  
**b** - `number` - Blue, `0` to `255`  
**a** - `number?` - Alpha, `0` to `255`, or `nil`

```lua
local r, g, b, a = MSK.Math.HexToRgb(hex)

-- Example
MSK.Math.HexToRgb('#00E676')   -- Output: 0, 230, 118, nil
MSK.Math.HexToRgb('#f00')      -- Output: 255, 0, 0, nil
MSK.Math.HexToRgb('00E67680')  -- Output: 0, 230, 118, 128
```

## MSK.Math.RgbToHex

Converts color channels from `0` to `255` into `#rrggbb`, or `#rrggbbaa` when `a` is given. Values outside the range are clamped, the letters are lowercase.

**Parameters**  
**r** - `number` - Red  
**g** - `number` - Green  
**b** - `number` - Blue  
**a** - `number` - Optional - Alpha, `0` to `255`

**Returns**  
**hex** - `string` - The hex color

```lua
local hex = MSK.Math.RgbToHex(r, g, b, a)

-- Example
MSK.Math.RgbToHex(0, 230, 118)      -- Output: '#00e676'
MSK.Math.RgbToHex(255, 0, 0, 128)   -- Output: '#ff000080'
```

## MSK.Math.ToScalars

Returns the numbers held by a vector, a table or a string. Tables can be `{ x =, y =, z =, w = }` (the fourth value is also read from `h` or `heading`) or a list like `{ 1, 2, 3 }`. Strings can be `'1.0, 2, 3'` or `'vector3(1.0, 2, 3)'`. Anything else raises an error.

**Parameters**  
**input** - `vector/table/string/number` - The input

**Returns**  
**...** - `number` - The numbers

```lua
local x, y, z, w = MSK.Math.ToScalars(input)

-- Example
MSK.Math.ToScalars(vector3(1.0, 2.0, 3.0))  -- Output: 1.0, 2.0, 3.0
MSK.Math.ToScalars({ x = 1, y = 2, z = 3 }) -- Output: 1, 2, 3
MSK.Math.ToScalars('vector3(1.0, 2, 3)')    -- Output: 1.0, 2, 3
```

## MSK.Math.ToVector

Returns a `vector2`, `vector3` or `vector4` depending on how many numbers `input` holds. Accepts everything `MSK.Math.ToScalars` accepts. A vector is returned as it is, a single number stays a number.

**Parameters**  
**input** - `vector/table/string/number` - The input

**Returns**  
**vector** - `vector2/vector3/vector4/number` - The vector

```lua
local vector = MSK.Math.ToVector(input)

-- Example
MSK.Math.ToVector('1.0, 2.0, 3.0')               -- Output: vector3(1.0, 2.0, 3.0)
MSK.Math.ToVector({ x = 1, y = 2, z = 3, h = 90 }) -- Output: vector4(1.0, 2.0, 3.0, 90.0)
MSK.Math.ToVector({ 5, 10 })                     -- Output: vector2(5.0, 10.0)
```

## MSK.Math.NormalToRotation

Returns a rotation in degrees that tilts an object's up axis onto a surface normal, for example the normal a raycast returns. The object is rotated around X (pitch) and then around Y (roll). The heading stays `0`, set it separately.

**Parameters**  
**normal** - `vector3` - The surface normal

**Returns**  
**rotation** - `vector3` - `vector3(pitch, roll, 0.0)`

```lua
local rotation = MSK.Math.NormalToRotation(normal)

-- Example
local _, hit, coords, normal = GetShapeTestResult(handle) -- handle from StartShapeTestLosProbe

if hit == 1 then
    local rotation = MSK.Math.NormalToRotation(normal)
    SetEntityRotation(object, rotation.x, rotation.y, rotation.z, 2, false)
end
```

## MSK.Math.ToHex

Converts a whole number into a hex string with `0x` prefix.

**Parameters**  
**value** - `number` - A whole number  
**upper** - `boolean` - Optional - Default: `false` - Uppercase digits

**Returns**  
**hex** - `string` - The hex string

```lua
local hex = MSK.Math.ToHex(value, upper)

-- Example
MSK.Math.ToHex(255)       -- Output: '0xff'
MSK.Math.ToHex(255, true) -- Output: '0xFF'
MSK.Math.ToHex(GetHashKey('adder'))
```

## MSK.Math.ToRgba

Converts a color into `vector4(r, g, b, a)`, with red, green and blue from `0` to `255` and alpha from `0` to `1` (default `1`). Values outside these ranges raise an error.

Accepted input:

- `'#rgb'`, `'#rrggbb'`, `'#rrggbbaa'` (the `#` may be left out for 6 and 8 digits)
- `'rgb(255, 0, 0)'`, `'rgba(255, 0, 0, 0.5)'`, `'255, 0, 0'`
- `{ r = 255, g = 0, b = 0, a = 0.5 }` or `{ 255, 0, 0 }`
- `vector3` and `vector4`

**Parameters**  
**input** - `string/table/vector3/vector4` - The color

**Returns**  
**color** - `vector4` - `vector4(r, g, b, a)`

```lua
local color = MSK.Math.ToRgba(input)

-- Example
MSK.Math.ToRgba('#00E676')             -- Output: vector4(0.0, 230.0, 118.0, 1.0)
MSK.Math.ToRgba('rgba(255, 0, 0, 0.5)') -- Output: vector4(255.0, 0.0, 0.0, 0.5)
MSK.Math.ToRgba({ r = 255, g = 255, b = 255 }) -- Output: vector4(255.0, 255.0, 255.0, 1.0)
```
