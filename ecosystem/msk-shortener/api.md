---
title: REST API
sidebar_position: 4
---

# REST API

MSK Shortener exposes a full JSON REST API. Every feature in the web UI is available programmatically — useful for CLI tools, scripts, CI pipelines, and Discord-bot integrations.

**Base URL:** `https://s.msk-scripts.de/api` (or your self-hosted domain).

---

## Authentication

There is **no API key**. All endpoints are public. Write operations (create / delete) are protected by:

- **Rate limiting** (20 creates per hour per IP hash)
- **One-time delete tokens** returned at creation time (for `DELETE`)
- **Verify rate limiting** (10 password attempts per 5 minutes for protected links)

---

## Error envelope

All errors share the same shape:

```json
{
  "error": "Human-readable message",
  "details": {
    "fieldName": ["validation error 1", "validation error 2"]
  }
}
```

`details` is only present on `400 Bad Request` (validation failures).

| Status | Meaning |
|---|---|
| `400` | Validation failed — see `details` |
| `401` | Wrong password / missing delete token |
| `404` | Link does not exist or token is invalid |
| `409` | Custom short code is already in use |
| `429` | Rate limit exceeded — see `Retry-After` header |

---

## `POST /api/links` — create a link

### Request

```http
POST /api/links HTTP/1.1
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
| `url` | string | yes | `http://` or `https://` only. Max 2048 chars. Private IPs are rejected. |
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

The response also includes rate-limit headers:

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
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://msk-scripts.de",
    "customCode": "msk",
    "expiresAt": "2026-12-31T23:59:59Z"
  }'
```

---

## `GET /api/links/:code` — look up a link

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

## `POST /api/verify` — unlock a password-protected link

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

## `DELETE /api/links/:code` — delete a link

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

## `GET /api/links/:code/stats` — per-link statistics

Returns full statistics for a single short link — the same data shown on the public stats page.

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

## `GET /api/links/:code/qr` — QR code

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

## `GET /api/stats` — global statistics

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

The create endpoint is limited to **20 requests per hour per IP hash** by default. When exceeded:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1742
X-RateLimit-Limit:     20
X-RateLimit-Remaining: 0
X-RateLimit-Reset:     1764547200
Content-Type: application/json

{ "error": "Zu viele Anfragen. Bitte später erneut versuchen." }
```

`Retry-After` is in seconds. Self-hosted instances can change the limit via `RATE_LIMIT_CREATE_PER_HOUR`.

The verify endpoint has a separate **10 attempts per 5 minutes** limit per IP hash for brute-force protection.

---

## Example: command-line shortener

A minimal Bash function to shorten a URL:

```bash
mskshort() {
  curl -sS -X POST https://s.msk-scripts.de/api/links \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg u "$1" '{url: $u}')" \
    | jq -r '.shortUrl'
}

# Usage:
mskshort "https://example.com/very/long/url"
```

---

## Example: Node.js

```js
const res = await fetch('https://s.msk-scripts.de/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
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
import requests

r = requests.post(
    "https://s.msk-scripts.de/api/links",
    json={
        "url": "https://msk-scripts.de",
        "customCode": "msk",
    },
)
print(r.json()["shortUrl"])
```
