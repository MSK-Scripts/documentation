---
title: REST API
sidebar_position: 4
---

# REST API

MSK Paste exposes a full JSON REST API. All features available in the web UI are also available programmatically, useful for CLI uploads, scripts, CI pipelines, and editor integrations.

**Base URL:** `https://paste.msk-scripts.de/api` (or your self-hosted domain).

---

## Authentication

Creating a paste through the API needs an API key. Send it as a Bearer header:

```http
Authorization: Bearer mskp_...
```

Keys for MSK Paste start with `mskp_`. The operator issues them on the server, there is no sign-up and no self-service. The hosted instance at paste.msk-scripts.de does not issue keys to others; create pastes there through the website. On your own instance you create keys with the key script, see [Installation](installation.md#api-keys).

Without a key, `POST /api/pastes` only accepts requests from the site's own form and answers `401`:

```json
{ "error": "Creating pastes through the API requires an API key", "code": "api-key-required" }
```

A wrong or revoked key also gets `401`, with `"code": "api-key-invalid"`.

Everything else works without a key, as before: fetching a paste, unlocking it with `POST /api/pastes/:id/verify`, deleting it with its delete token, and `GET /api/stats`.

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

`code` names the reason in a fixed, machine-readable form. It comes with the refusals of `POST /api/pastes` for the API key, the limits and the content checks, so scripts should check `code` rather than the message. `details` is only present on `400 Bad Request` (validation failures).

| Status | Meaning |
|---|---|
| `400` | Validation failed, see `details` |
| `401` | Missing or invalid API key (on create), wrong password (on `/verify`) |
| `403` | Password required (on `/api/pastes/:id`) |
| `404` | Paste does not exist, has expired, or was burned |
| `409` | Custom ID is already in use, or the same content was pasted within the last 24 hours (`code: "duplicate"`) |
| `413` | Content exceeds 1 MB |
| `422` | Content refused by the [content checks](#content-checks) |
| `429` | Rate limit exceeded, see [Rate limiting](#rate-limiting) |

---

## `POST /api/pastes`: create a paste

### Request

```http
POST /api/pastes HTTP/1.1
Authorization: Bearer mskp_...
Content-Type: application/json

{
  "content":       "console.log('hello world')",
  "title":         "My snippet",
  "language":      "javascript",
  "expiresIn":     "1w",
  "password":      "optional",
  "burnAfterRead": false,
  "customId":      "my-snippet"
}
```

### Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `content` | string | yes | 1 character to 1 MB |
| `title` | string | no | Max 100 characters |
| `language` | string | no | Defaults to `"plaintext"`. Must be in the supported list. |
| `expiresIn` | string | yes | `"10min"`, `"1h"`, `"1d"`, `"1w"`, `"1mo"`, `"1y"` |
| `password` | string | no | 1–128 characters |
| `burnAfterRead` | boolean | no | Defaults to `false` |
| `customId` | string | no | 4–32 chars, `[a-zA-Z0-9_-]` |

### Response (`201 Created`)

```json
{
  "pasteId":       "X7q9bA2k",
  "url":           "https://paste.msk-scripts.de/X7q9bA2k",
  "rawUrl":        "https://paste.msk-scripts.de/raw/X7q9bA2k",
  "deleteToken":   "dk_a7c4f2e1b9d8...",
  "expiresAt":     "2026-05-20T16:00:00.000Z",
  "hasPassword":   false,
  "burnAfterRead": false
}
```

:::warning
The `deleteToken` is the **only** way to delete the paste later. Save it. It is not stored anywhere you can retrieve it.
:::

### Example

```bash
curl -X POST https://paste.msk-scripts.de/api/pastes \
  -H "Authorization: Bearer $MSK_PASTE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "print(\"hello\")",
    "language": "python",
    "expiresIn": "1d"
  }'
```

---

## Content checks

Every new paste goes through the same checks, whether it comes from the web form or from an API key. A paste is refused when it

- contains an encoded file: an unbroken run of 16 KB of base64 or hex characters, or a paste of 64 KB or more made almost only of wrapped base64 (`422`, `code: "blob"`)
- is mostly links: 3 or more links that make up at least half of the text, or 3 or more BBCode `[url=` or HTML `<a href=` links (`422`, `code: "links"`)
- repeats content that was already pasted within the last 24 hours (`409`, `code: "duplicate"`)

---

## `GET /api/pastes/:id`: fetch a paste

### Behaviour

- If the paste is password-protected, returns `403` with `{ "passwordRequired": true }`.
- If the paste has expired or been burned, returns `404`.
- Otherwise returns the content, increments `view_count`, and (for burn-after-read pastes) **deletes the paste in the same transaction**.

### Response

```json
{
  "pasteId":       "X7q9bA2k",
  "title":         "My snippet",
  "content":       "console.log('hello world')",
  "language":      "javascript",
  "createdAt":     "2026-05-13T16:00:00.000Z",
  "expiresAt":     "2026-05-20T16:00:00.000Z",
  "viewCount":     1,
  "burnAfterRead": false,
  "sizeBytes":     27
}
```

### Example

```bash
curl https://paste.msk-scripts.de/api/pastes/X7q9bA2k
```

---

## `POST /api/pastes/:id/verify`: unlock a password-protected paste

### Request

```http
POST /api/pastes/X7q9bA2k/verify HTTP/1.1
Content-Type: application/json

{ "password": "secret" }
```

### Response

`200 OK` returns the same payload as `GET /api/pastes/:id` plus a `highlightedHtml` field for direct rendering.

`401 Unauthorized` is returned on wrong password. Failed attempts do **not** count against the view counter and do **not** trigger burn-after-read.

### Example

```bash
curl -X POST https://paste.msk-scripts.de/api/pastes/X7q9bA2k/verify \
  -H "Content-Type: application/json" \
  -d '{"password":"hunter2"}'
```

---

## `DELETE /api/pastes/:id`: delete a paste

Requires a valid delete token as a query parameter.

### Request

```http
DELETE /api/pastes/X7q9bA2k?token=dk_a7c4f2e1b9d8... HTTP/1.1
```

### Response

`204 No Content` on success. `404` if the paste or token is invalid (the API does not differentiate, to avoid token probing).

### Example

```bash
curl -X DELETE "https://paste.msk-scripts.de/api/pastes/X7q9bA2k?token=dk_a7c4f2e1b9d8..."
```

---

## `GET /api/stats`: global statistics

Returns anonymous aggregate numbers shown on the [/stats](https://paste.msk-scripts.de/stats) page.

### Response

```json
{
  "totalPastes":    1234,
  "pastesToday":    42,
  "pastesThisWeek": 187,
  "topLanguages": [
    { "language": "javascript", "count": 320 },
    { "language": "lua",        "count": 211 },
    { "language": "python",     "count": 198 },
    { "language": "plaintext",  "count": 156 },
    { "language": "json",       "count": 99  }
  ]
}
```

---

## Rate limiting

Requests with an API key and requests from the web form are limited separately:

| Sent by | Limit | `code` on `429` | Setting |
|---|---|---|---|
| API key | 120 pastes per hour per key | `key-limit` | `API_KEY_CREATE_PER_HOUR` |
| Web form | 10 pastes per hour per IP hash | `rate-limit` | `RATE_LIMIT_CREATE_PER_HOUR` |
| Web form | 20 pastes and 5 MB in total per IP address and 24 hours | `daily-limit` | `DAILY_PASTES_PER_IP`, `DAILY_BYTES_PER_IP` |

Requests with a key are not held to the limits of the web form. When the hourly limit per IP hash is exceeded:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1742
Content-Type: application/json

{ "error": "Rate limit exceeded", "code": "rate-limit" }
```

`Retry-After` is in seconds. Self-hosted instances can change every limit with the settings in the table.

---

## Example: command-line uploader

A minimal Bash function to upload a file. It reads your API key from `MSK_PASTE_KEY`:

```bash
mskpaste() {
  local file="$1"
  local lang="${2:-plaintext}"
  curl -sS -X POST https://paste.msk-scripts.de/api/pastes \
    -H "Authorization: Bearer $MSK_PASTE_KEY" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg c "$(cat "$file")" \
      --arg l "$lang" \
      '{content: $c, language: $l, expiresIn: "1w"}')" \
    | jq -r '.url'
}

# Usage (the key you got from the operator, e.g. set in ~/.bashrc):
export MSK_PASTE_KEY="mskp_..."
mskpaste script.lua lua
mskpaste server.log
```

---

## Example: Node.js

```js
const res = await fetch('https://paste.msk-scripts.de/api/pastes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.MSK_PASTE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: 'console.log("hi")',
    language: 'javascript',
    expiresIn: '1d',
  }),
})
const paste = await res.json()
console.log(paste.url)
```

---

## Example: Python

```python
import os
import requests

r = requests.post(
    "https://paste.msk-scripts.de/api/pastes",
    headers={"Authorization": f"Bearer {os.environ['MSK_PASTE_KEY']}"},
    json={
        "content": "print('hi')",
        "language": "python",
        "expiresIn": "1h",
    },
)
print(r.json()["url"])
```
