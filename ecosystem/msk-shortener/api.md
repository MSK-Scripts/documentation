---
title: REST API
sidebar_position: 4
---

# REST API

MSK Shortener exposes a full JSON REST API. Every feature in the web UI is available programmatically, useful for CLI tools, scripts, CI pipelines, and Discord-bot integrations.

**Base URL:** `https://s.msk-scripts.de/api` (or your self-hosted domain).

---

## Authentication

Creating a link through the API needs an API key. Send it as a Bearer header:

```http
Authorization: Bearer msks_...
```

Keys for MSK Shortener start with `msks_`. The operator issues them on the server, there is no sign-up and no self-service. The hosted instance at s.msk-scripts.de does not issue keys to others; shorten links there through the website. On your own instance you create keys with the key script, see [Installation](installation.md#api-keys).

Without a key, `POST /api/links` only accepts requests from the site's own form and answers `401`:

```json
{ "error": "Shortening links through the API requires an API key", "code": "api-key-required" }
```

A wrong or revoked key also gets `401`, with `"code": "api-key-invalid"`.

Everything else works without a key, as before: looking up a link, its statistics and QR code, `POST /api/verify` for password-protected links, and `DELETE` with the delete token. On `DELETE` the Bearer header carries the delete token, not the API key.

Besides the key, write operations are protected by:

- **Rate limiting**, see [Rate limiting](#rate-limiting)
- **One-time delete tokens** returned at creation time (for `DELETE`)
- **Verify rate limiting** (10 password attempts per 5 minutes for protected links)

---

## Error envelope

All errors share the same shape:

```json
{
  "error": "Human-readable message",
  "code": "api-key-required",
  "details": {
    "fieldName": ["validation error 1", "validation error 2"]
  }
}
```

`code` names the reason in a fixed, machine-readable form. It comes with the refusals of `POST /api/links` for the API key, the limits and the target checks, so scripts should check `code` rather than the message. `details` is only present on `400 Bad Request` (validation failures).

| Status | Meaning |
|---|---|
| `400` | Validation failed, see `details` |
| `401` | Missing or invalid API key (on create), wrong password / missing delete token |
| `404` | Link does not exist or token is invalid |
| `409` | Custom short code is already in use |
| `422` | Target refused by the [target checks](#target-checks) |
| `429` | Rate limit exceeded, see [Rate limiting](#rate-limiting) |

---

## `POST /api/links`: create a link

### Request

```http
POST /api/links HTTP/1.1
Authorization: Bearer msks_...
Content-Type: application/json

{
  "url":        "https://msk-scripts.de",
  "customCode": "msk",
  "password":   "optional",
  "expiresAt":  "2026-12-31T23:59:59Z"
}
```

### Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `url` | string | yes | `http://` or `https://` only. Max 2048 chars. Must pass the [target checks](#target-checks), private IPs are rejected as well. |
| `customCode` | string | no | 3–20 chars, `[a-zA-Z0-9_-]`. Auto-generated if omitted. |
| `password` | string | no | 4–100 characters. |
| `expiresAt` | string (ISO 8601) | no | Must be in the future. |

### Response (`201 Created`)

```json
{
  "shortCode":   "msk",
  "shortUrl":    "https://s.msk-scripts.de/msk",
  "deleteToken": "dk_a7c4f2e1b9d8...",
  "expiresAt":   "2026-12-31T23:59:59.000Z",
  "hasPassword": false
}
```

The response also includes rate-limit headers. They describe the hourly limit per IP hash of the web form, not the limit of your API key:

```
X-RateLimit-Limit:     20
X-RateLimit-Remaining: 19
X-RateLimit-Reset:     1764547200
```

:::warning
The `deleteToken` is the **only** way to delete the link later. Save it. It is not retrievable.
:::

### Example

```bash
curl -X POST https://s.msk-scripts.de/api/links \
  -H "Authorization: Bearer $MSK_SHORTENER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://msk-scripts.de",
    "customCode": "msk",
    "expiresAt": "2026-12-31T23:59:59Z"
  }'
```

---

## Target checks

Every new link goes through the same checks, whether it comes from the web form or from an API key. The target is refused with `422` when it points to

- this service itself, so a short link to a short link (`code: "own-link"`)
- another URL shortener such as bit.ly or tinyurl.com, including their subdomains (`code: "shortener"`)
- a bare IP address instead of a hostname (`code: "ip-host"`)
- a hostname built like a phishing page (`code: "phishing"`): two or more bait words such as `login`, `verify`, `update`, `account` or `access` in the hostname, or one of them together with a cheap TLD like `.sbs`, `.top`, `.xyz` or `.info`, two or more hyphens, or punycode (`xn--`)

Private and loopback addresses are refused as before, see [Privacy & Security](privacy.md#ssrf-protection).

---

## `GET /api/links/:code`: look up a link

### Behaviour

- Returns metadata for the link.
- If the link has a password, the `originalUrl` is **not** included in the response (use `/api/verify` instead).
- If the link has expired, the `originalUrl` is also withheld.

### Response

```json
{
  "shortCode":    "msk",
  "shortUrl":     "https://s.msk-scripts.de/msk",
  "originalUrl":  "https://msk-scripts.de",
  "hasPassword":  false,
  "expiresAt":    "2026-12-31T23:59:59.000Z",
  "clickCount":   42,
  "createdAt":    "2026-05-10T14:00:00.000Z"
}
```

### Example

```bash
curl https://s.msk-scripts.de/api/links/msk
```

---

## `POST /api/verify`: unlock a password-protected link

Use this endpoint to retrieve the destination URL of a password-protected link. On success, it also increments the click counter and stores an anonymized click row.

### Request

```http
POST /api/verify HTTP/1.1
Content-Type: application/json

{
  "shortCode": "msk",
  "password":  "secret"
}
```

### Response

`200 OK` returns the destination URL:

```json
{ "originalUrl": "https://msk-scripts.de" }
```

`401 Unauthorized` is returned on wrong password. The message is intentionally generic to avoid leaking whether the link exists.

`429 Too Many Requests` after 10 failed attempts within 5 minutes from the same IP hash.

### Example

```bash
curl -X POST https://s.msk-scripts.de/api/verify \
  -H "Content-Type: application/json" \
  -d '{"shortCode":"msk","password":"hunter2"}'
```

---

## `DELETE /api/links/:code`: delete a link

Requires the delete token as a Bearer header. Cascading delete: all click rows for the link are also removed.

### Request

```http
DELETE /api/links/msk HTTP/1.1
Authorization: Bearer dk_a7c4f2e1b9d8...
```

### Response

`200 OK` on success:

```json
{ "message": "Link erfolgreich gelöscht" }
```

`404 Not Found` if the link or token is invalid (the API does not differentiate, to avoid token probing).

### Example

```bash
curl -X DELETE https://s.msk-scripts.de/api/links/msk \
  -H "Authorization: Bearer dk_a7c4f2e1b9d8..."
```

---

## `GET /api/links/:code/stats`: per-link statistics

Returns full statistics for a single short link, the same data shown on the public stats page.

### Query parameters

| Parameter | Default | Notes |
|---|---|---|
| `days` | `30` | Timeline length. Min 1, max 365. |

### Response

```json
{
  "shortCode":   "msk",
  "totalClicks": 42,
  "createdAt":   "2026-05-10T14:00:00.000Z",
  "expiresAt":   "2026-12-31T23:59:59.000Z",
  "timeline": [
    { "date": "2026-05-10", "clicks": 5 },
    { "date": "2026-05-11", "clicks": 12 }
  ],
  "browsers":         [{ "name": "Chrome",  "count": 28 }],
  "operatingSystems": [{ "name": "Linux",   "count": 19 }],
  "devices":          [{ "name": "desktop", "count": 35 }],
  "topReferrers":     [{ "host": "github.com", "count": 8 }]
}
```

### Example

```bash
curl 'https://s.msk-scripts.de/api/links/msk/stats?days=7'
```

---

## `GET /api/links/:code/qr`: QR code

Returns a QR code that encodes the short URL.

### Query parameters

| Parameter | Default | Allowed |
|---|---|---|
| `format` | `png` | `png`, `svg` |

### Response

- **PNG:** `image/png`, 512×512, MSK colors (`#1b1b1d` on white)
- **SVG:** `image/svg+xml`, vector, scalable
- Both responses include `Content-Disposition: inline; filename="msk-<code>.<ext>"` and are cached for 24 hours.

### Example

```bash
curl -o msk.png 'https://s.msk-scripts.de/api/links/msk/qr'
curl -o msk.svg 'https://s.msk-scripts.de/api/links/msk/qr?format=svg'
```

---

## `GET /api/stats`: global statistics

Returns anonymous aggregate numbers shown on the [/stats](https://s.msk-scripts.de/stats) page. Cached for 5 minutes.

### Response

```json
{
  "totalLinks":     1234,
  "totalClicks":    98765,
  "linksToday":     42,
  "linksThisWeek":  187,
  "topBrowsers":         [{ "name": "Chrome", "count": 50321 }],
  "topOperatingSystems": [{ "name": "Linux",  "count": 22110 }],
  "topDevices":          [{ "name": "desktop", "count": 70000 }]
}
```

---

## Rate limiting

Requests with an API key and requests from the web form are limited separately:

| Sent by | Limit | `code` on `429` | Setting |
|---|---|---|---|
| API key | 120 links per hour per key | `key-limit` | `API_KEY_CREATE_PER_HOUR` |
| Web form | 20 links per hour per IP hash | `rate-limit` | `RATE_LIMIT_CREATE_PER_HOUR` |
| Web form | 20 links per IP address and 24 hours | `daily-limit` | `DAILY_LINKS_PER_IP` |

Requests with a key are not held to the limits of the web form. When the hourly limit per IP hash is exceeded:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1742
X-RateLimit-Limit:     20
X-RateLimit-Remaining: 0
X-RateLimit-Reset:     1764547200
Content-Type: application/json

{ "error": "Zu viele Anfragen. Bitte später erneut versuchen.", "code": "rate-limit" }
```

`Retry-After` is in seconds. Self-hosted instances can change every limit with the settings in the table.

The verify endpoint has a separate **10 attempts per 5 minutes** limit per IP hash for brute-force protection.

---

## Example: command-line shortener

A minimal Bash function to shorten a URL. It reads your API key from `MSK_SHORTENER_KEY`:

```bash
mskshort() {
  curl -sS -X POST https://s.msk-scripts.de/api/links \
    -H "Authorization: Bearer $MSK_SHORTENER_KEY" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg u "$1" '{url: $u}')" \
    | jq -r '.shortUrl'
}

# Usage (the key you got from the operator, e.g. set in ~/.bashrc):
export MSK_SHORTENER_KEY="msks_..."
mskshort "https://example.com/very/long/url"
```

---

## Example: Node.js

```js
const res = await fetch('https://s.msk-scripts.de/api/links', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.MSK_SHORTENER_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://msk-scripts.de',
    customCode: 'msk',
  }),
})
const link = await res.json()
console.log(link.shortUrl)
```

---

## Example: Python

```python
import os
import requests

r = requests.post(
    "https://s.msk-scripts.de/api/links",
    headers={"Authorization": f"Bearer {os.environ['MSK_SHORTENER_KEY']}"},
    json={
        "url": "https://msk-scripts.de",
        "customCode": "msk",
    },
)
print(r.json()["shortUrl"])
```
