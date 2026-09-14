---
title: Locale
sidebar_position: 14
---

# Locale

Translations from JSON files inside the resource that uses them.

:::info[New in v4.1.0]
`MSK.Locale` has no exports. It runs inside your own resource and reads that resource's `locales` folder.
:::

## Locale files

Put one JSON file per language into a `locales` folder of your resource. Nested objects become dotted keys.

```json title="my_script/locales/en.json"
{
    "shop": {
        "bought": "You bought ${item} for $%s",
        "closed": "The ${shop.name} is closed",
        "name": "general store"
    }
}
```

```json title="my_script/locales/de.json"
{
    "shop": {
        "bought": "Du hast ${item} für $%s gekauft"
    }
}
```

Keys that are missing in the chosen language fall back to `en.json`.

On the client, the JSON files have to be listed in the `fxmanifest.lua` of the resource, otherwise they cannot be read:

```lua title="fxmanifest.lua"
files {
    'locales/*.json',
}
```

## Language

The language is chosen in this order:

1. `MSK.Locale.SetLanguage(...)` inside the resource itself
2. The player's own choice in the msk_core settings (client only)
3. The convar `msk:locale`, e.g. `setr msk:locale "de"`
4. `'en'`

When a player changes the language in the msk_core settings, the translations are reloaded automatically, unless the resource forced a language with `SetLanguage`.

## Placeholders

- `${name}` is filled from a table passed as the only extra argument.
- If that table has no such field, `${other.key}` pulls in another translation, so repeated words live in one place.
- Any other arguments are passed to `string.format`, so `%s`, `%d` and so on work as usual.
- A placeholder that cannot be resolved stays in the text as it is, which makes a typo easy to spot.

## MSK.Locale.T

Returns the translation for `key`. The module is callable, so `MSK.Locale(key, ...)` does the same. A missing key returns the key itself and prints a warning once.

**Parameters**  
**key** - `string` - The dotted translation key  
**...** - `any` - Optional - A table for `${name}` placeholders, or arguments for `string.format`

**Returns**  
**text** - `string` - The translated text

```lua
local text = MSK.Locale.T(key, ...)

-- Example
MSK.Locale.T('shop.bought', 25)           -- 'You bought ${item} for $25'
MSK.Locale('shop.bought', { item = 'Bread' }) -- 'You bought Bread for $%s'
MSK.Locale('shop.closed')                  -- 'The general store is closed'
```

:::tip
Named placeholders and `string.format` arguments are not combined in one call. A single table argument fills `${name}` placeholders, anything else goes to `string.format`.
:::

## MSK.Locale.GetFrom

Returns a translation from the `locales` folder of **another** resource, for scripts that show texts of another one. It takes the same arguments as `MSK.Locale.T`. The language is the one resolved in your own resource. The files of the other resource are read directly and cached per resource and language. A missing key returns the key itself.

On the client, the other resource has to list its locale files in its own `fxmanifest.lua`, which it needs anyway for its own translations.

**Parameters**  
**resource** - `string` - Name of the other resource  
**key** - `string` - The dotted translation key  
**...** - `any` - Optional - A table for `${name}` placeholders, or arguments for `string.format`

**Returns**  
**text** - `string` - The translated text

```lua
local text = MSK.Locale.GetFrom(resource, key, ...)

-- Example
local label = MSK.Locale.GetFrom('msk_garage', 'garage.title')
local text = MSK.Locale.GetFrom('msk_garage', 'garage.parked', { plate = 'ABC 123' })
```

## MSK.Locale.SetLanguage

Forces a language for this resource and reloads the translations. `nil` returns to the automatic resolution.

**Parameters**  
**lang** - `string` - Optional - Language code, e.g. `'de'`

```lua
MSK.Locale.SetLanguage(lang)

-- Example
MSK.Locale.SetLanguage('de')
MSK.Locale.SetLanguage(nil) -- back to automatic
```

## MSK.Locale.GetLanguage

Returns the active language. If no file exists for the resolved language, this is `'en'`.

**Returns**  
**lang** - `string` - The active language

```lua
local lang = MSK.Locale.GetLanguage()
```

## MSK.Locale.Has

Checks whether a translation exists for `key` in the active language (including the `en` fallback).

**Parameters**  
**key** - `string` - The dotted translation key

**Returns**  
**has** - `boolean` - Whether the key exists

```lua
local has = MSK.Locale.Has(key)
```

## MSK.Locale.GetAll

Returns a copy of all translations of the active language, keyed by their dotted path. Handy to send all texts to a NUI at once.

**Returns**  
**strings** - `table` - `{ ['shop.bought'] = '...', ... }`

```lua
local strings = MSK.Locale.GetAll()

-- Example
SendNUIMessage({ action = 'locales', data = MSK.Locale.GetAll() })
```

## MSK.Locale.Load

(Re)loads the translations. Without `lang` the language is resolved again. You normally do not need this, translations load on first use.

**Parameters**  
**lang** - `string` - Optional - Language code to load

**Returns**  
**found** - `boolean` - Whether a file for the language exists

```lua
local found = MSK.Locale.Load(lang)
```
