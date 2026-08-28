---
title: Public API
sidebar_position: 2
description: The public JSON endpoints on msk-scripts.de, including the image catalog behind cdn.msk-scripts.de.
---

# Public API

`msk-scripts.de` exposes a handful of read-only JSON endpoints that need no
account, no token and no registration. They power the pages on the site itself,
and they are stable enough to build against.

**Base URL:** `https://www.msk-scripts.de`

Everything on this page answers to a plain `GET`. There is no authentication,
no sign-up and no key to request. Anything not listed here is internal to the
site and may change or disappear without notice.

---

## Conventions

**Responses** are JSON with `Content-Type: application/json`.

**Errors** carry an `error` field and a matching status code:

```json
{ "error": "unknown category" }
```

| Status | Meaning |
|---|---|
| `200` | Success |
| `404` | The category or image does not exist |
| `429` | Rate limit exceeded, wait a minute |
| `503` | An upstream service is unavailable (see the note on each endpoint) |

**Cross-origin access** is the one place where the endpoints differ, so check
the table before you call one from a browser or a FiveM NUI:

| Endpoint group | `Access-Control-Allow-Origin` | Usable from a browser or NUI |
|---|---|---|
| [Images](#images) | `*` | Yes |
| [Statistics](#statistics) | not set | Server-side only |
| [Discord](#discord) | not set | Server-side only |
| [Shop catalog](#shop-catalog) | not set | Server-side only |

The image endpoints are deliberately open because that is where third-party
consumers sit: a FiveM NUI sends a `nui://` origin and would otherwise be unable
to ask whether a picture exists. The rest is served for the site's own pages. A
Lua resource calling `PerformHttpRequest` is not a browser and is unaffected by
this either way.

**Rate limiting** applies per IP address. Only the image endpoints carry an
explicit limit, 300 requests per minute. The others have no fixed cap, but their
values change slowly, so cache them rather than polling. Exceeding a limit
returns `429`.

---

## Images

The inventory behind [cdn.msk-scripts.de](https://cdn.msk-scripts.de): vehicle,
ped, weapon and item renders, trimmed, padded and served in three sizes.

:::tip[You may not need the API at all]
Image URLs are flat and predictable. If you already know the category and the
spawn name, build the address directly and skip the lookup:

```
https://cdn.msk-scripts.de/vehicles/zentorno.png        original PNG
https://cdn.msk-scripts.de/vehicles/zentorno.webp       400 px WebP
https://cdn.msk-scripts.de/vehicles/zentorno_thumb.webp 160 px WebP
```

The CDN sends `Access-Control-Allow-Origin: *` and caches for a year, so it is
safe to reference from anywhere. Use the API when you need to know **whether** an
image exists, what it is called, or what dimensions it has.
:::

### `GET /api/images`: list and search

| Parameter | Type | Default | Description |
|---|---|---|---|
| `category` | string | all | `vehicles`, `peds`, `weapons`, `items`, `props`, `brand` |
| `q` | string | none | Full-text search across name, label and tags |
| `tag` | string | none | Exact tag match, for example `super` or `pistol` |
| `page` | number | `1` | Page number, 1-based |
| `per` | number | `60` | Results per page, capped server-side |

```bash
curl "https://www.msk-scripts.de/api/images?category=weapons&q=pistol&per=2"
```

```json
{
  "total": 20,
  "page": 1,
  "per": 2,
  "items": [
    {
      "category": "weapons",
      "name": "weapon_appistol",
      "label": "AP Pistol",
      "ext": "png",
      "width": 99,
      "height": 104,
      "bytes": 4513,
      "version": 1,
      "tags": ["pistol"],
      "url": "https://cdn.msk-scripts.de/weapons/weapon_appistol.png",
      "card": "https://cdn.msk-scripts.de/weapons/weapon_appistol.webp",
      "thumb": "https://cdn.msk-scripts.de/weapons/weapon_appistol_thumb.webp"
    }
  ]
}
```

An unknown `category` returns `404` with `{ "error": "unknown category" }`.

### `GET /api/images/{category}/{name}`: one image

The lookup a script wants before it renders something: does a picture for this
model name exist, and how large is it?

```bash
curl "https://www.msk-scripts.de/api/images/vehicles/zentorno"
```

```json
{
  "category": "vehicles",
  "name": "zentorno",
  "label": "Pegassi Zentorno",
  "ext": "png",
  "width": 1024,
  "height": 463,
  "bytes": 99444,
  "version": 2,
  "tags": ["pegassi", "super"],
  "url": "https://cdn.msk-scripts.de/vehicles/zentorno.png?v=2",
  "card": "https://cdn.msk-scripts.de/vehicles/zentorno.webp?v=2",
  "thumb": "https://cdn.msk-scripts.de/vehicles/zentorno_thumb.webp?v=2"
}
```

`name` is case-insensitive. A miss returns `404` with `{ "error": "not found" }`,
and that response carries the CORS header as well, so a browser can read it.

:::note[About `version`]
Files are cached for a year as `immutable`. When an image is replaced, `version`
increases and the URLs gain a `?v=` suffix. Store the URLs the API gives you
rather than building them yourself if you want replacements to reach your users.
:::

### `GET /api/images/categories`: categories with counts

| Parameter | Type | Default | Description |
|---|---|---|---|
| `lang` | `en` \| `de` | `en` | Language of `name` and `description` |

```bash
curl "https://www.msk-scripts.de/api/images/categories?lang=de"
```

```json
[
  { "slug": "vehicles", "name": "Fahrzeuge", "description": null, "icon": "Car", "count": 916 },
  { "slug": "peds",     "name": "Peds",      "description": null, "icon": "User", "count": 1030 }
]
```

`icon` is the name of a [Lucide](https://lucide.dev) icon, usable directly if
your UI ships that set. Categories with a count of `0` are listed too.

### Example: FiveM resource

```lua
-- Server side. Checks whether an image exists before handing a URL to the NUI.
local function getVehicleImage(model, cb)
    PerformHttpRequest(
        ('https://www.msk-scripts.de/api/images/vehicles/%s'):format(model:lower()),
        function(status, body)
            if status ~= 200 then return cb(nil) end
            local data = json.decode(body)
            cb(data and data.card or nil)
        end,
        'GET'
    )
end
```

For a NUI that only displays pictures, skip the request entirely and build the
CDN URL from the model name.

---

## Statistics

The numbers behind the public statistics pages. All three recompute on every
request and are not cached, so treat them as slow-moving and cache them on your
side.

### `GET /api/stats`: ticket bot

Aggregate figures across all registered ticket bot guilds. No guild, user or
transcript is identifiable in the response.

```json
{
  "transcripts": 114,
  "apiKeys": 36,
  "tiers": { "basic": 30, "premium": 4, "premium_plus": 2 },
  "avgTranscriptBytes": 244226,
  "attachments": 250,
  "avgAttachmentBytes": 659478,
  "subscriptions": 0,
  "subscriptionTiers": { "basic": 0, "premium": 0, "premium_plus": 0 },
  "customDomains": 3,
  "hostedBots": 1,
  "newGuilds30d": 4,
  "totalStorageBytes": 192711350,
  "transcripts30d": 31,
  "transcriptsWithAttachments": 48,
  "maxTranscriptBytes": 6007524
}
```

Returns `503` with `{ "error": "Database unavailable" }` if the database cannot
be reached. Rendered at [/ticketbot/stats](https://www.msk-scripts.de/ticketbot/stats).

### `GET /api/giveaway-stats`: giveaway bot

```json
{
  "available": true,
  "servers": 28,
  "giveaways": 97,
  "activeGiveaways": 3,
  "entries": 544,
  "winners": 121,
  "templates": 2,
  "avgEntries": 6,
  "maxEntries": 29,
  "langs": { "en": 22, "de": 4, "fr": 2, "es": 0, "hu": 0, "pl": 0, "pt": 0 },
  "status": { "ACTIVE": 3, "PAUSED": 1, "ENDED": 91, "CANCELLED": 2 }
}
```

`langs` counts guilds by configured bot language, `status` counts giveaways by
state. Returns `503` when the giveaway database is unavailable. Rendered at
[/giveaway/stats](https://www.msk-scripts.de/giveaway/stats).

### `GET /api/resource-stats`: FiveM resource reach

Live server counts for the MSK FiveM resources, sourced from
[fivestats.io](https://fivestats.io) and served without exposing the upstream
key.

```json
{
  "available": true,
  "periodHours": 168,
  "game": "gta5",
  "resources": [
    {
      "resourceName": "msk_core",
      "displayName": "MSK Core",
      "tier": "free",
      "available": true,
      "serverCount": 313,
      "rank": 2014,
      "serverCountChange": 13,
      "rankChange": 86,
      "updatedAt": "2026-08-28 20:15:00",
      "links": [
        { "label": "GitHub", "href": "https://github.com/MSK-Scripts/msk_core", "external": true, "variant": "secondary" }
      ],
      "history": [
        { "t": 1787344200, "serverCount": 300, "rank": 2100 }
      ]
    }
  ]
}
```

`t` in `history` is a Unix timestamp in seconds, covering the last
`periodHours`. A resource with no upstream data yet has `available: false` and
no counts, while the rest of the list still resolves. The whole response is
`503` only if fivestats itself is unreachable. Rendered at
[/resources](https://www.msk-scripts.de/resources).

---

## Discord

### `GET /api/discord`: community size

Member counts of the MSK Discord, read from the invite API and cached for 60
seconds.

```json
{ "online": 133, "total": 622 }
```

This endpoint never fails loudly. If Discord is unreachable it answers `200`
with `{ "online": 0, "total": 0 }`, because a broken counter should not break
the page that shows it. Treat two zeroes as "unknown", not as "nobody online".

### `GET /api/discord/health`: Discord platform status

A one-field summary of [discordstatus.com](https://discordstatus.com), useful
for telling "our bot is down" apart from "Discord is down".

```json
{ "indicator": "none" }
```

`indicator` is one of `none`, `minor`, `major`, `critical`, or `unknown` when
the upstream check itself failed.

---

## Shop catalog

### `GET /api/packages`: Tebex packages

A thin proxy in front of the Tebex Headless API, returning the store catalog in
Tebex's own response shape. It exists for the storefront and carries the public
Tebex token, which is public by design.

```bash
curl "https://www.msk-scripts.de/api/packages"
```

If you are building against the catalog rather than against this site, query
[Tebex Headless](https://docs.tebex.io/developers/headless-api/overview)
directly. It is the same data from the authoritative source, with a documented
contract that will not change when this site changes.

---

## Terms of use

The endpoints are free to use and need no registration. Two requests:

- **Cache what you fetch.** Values here change slowly, and none of these
  endpoints is worth polling every second.
- **The images are game assets.** Rights to the underlying GTA V models rest
  with Rockstar Games and Take-Two Interactive. What is served here are renders
  provided for use in FiveM projects. Community submissions carry a rights
  declaration by the submitter. If you republish a collection wholesale rather
  than using individual pictures in a project, ask first.

Questions or a use case that needs more than this offers: reach out on
[Discord](https://discord.gg/5hHSBRHvJE).
