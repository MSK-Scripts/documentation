---
title: Usage
sidebar_position: 3
---

# Using MSK Paste

This page walks you through the web interface: creating, viewing, and managing pastes.

---

## Creating a paste

Open [paste.msk-scripts.de](https://paste.msk-scripts.de) (or your self-hosted instance) and you'll see the creation form.

### Fields

| Field | Required | Notes |
|---|---|---|
| **Title** | optional | Max 100 characters. Used as the filename when downloading. |
| **Content** | required | The text to paste. Hard limit: **1 MB**. |
| **Language** | optional | Pick from the dropdown to enable syntax highlighting. Defaults to plain text. |
| **Expiration** | required | One of: 10 min, 1 hour, 1 day, 1 week, 1 month, 1 year. Default: **1 week**. |
| **Password** | optional | Encrypts access. The paste itself is not encrypted at rest, the password gates viewing. |
| **Burn after read** | optional | When enabled, the paste is **permanently deleted** after the first successful view. |
| **Custom ID** | optional | 4–32 characters, only `a–z`, `A–Z`, `0–9`, `_`, `-`. Reserved IDs (`raw`, `api`, `stats`, …) are rejected. |

### Spam protection

Before a paste is created, the form runs a few checks. Most of them you won't notice:

- **Cloudflare Turnstile** runs on the page. Usually it passes on its own, sometimes it asks you to tick a box.
- The request has to come from the page itself. A hidden field that people never see must stay empty, and the form has to be sent at least 2 seconds and at most 24 hours after the page was loaded. If the tab was open longer, reload it.
- Per IP address and 24 hours the form creates at most **20 pastes and 5 MB in total**, in addition to the hourly limit.

Some content is refused, from the form and from the [REST API](api.md#content-checks) alike:

- **Encoded files:** an unbroken run of 16 KB of base64 or hex characters, or a paste of 64 KB or more made almost only of wrapped base64.
- **Link spam:** 3 or more links that make up at least half of the text, or 3 or more BBCode `[url=` or HTML `<a href=` links.
- **Repeats:** the same content again within 24 hours.

### After creation

You receive:

- The **paste URL** (e.g. `https://paste.msk-scripts.de/X7q9bA2k`)
- The **raw URL** (`/raw/X7q9bA2k`)
- A **delete token**, save this if you want to be able to remove the paste later

:::warning
The delete token is shown **only once**, immediately after creation. There is no account system to recover it. If you lose it, you'll have to wait for the paste to expire.
:::

---

## Viewing a paste

Visit `/:id` to see the paste with syntax highlighting, line numbers, and a copy button.

The viewer offers:

- **Copy:** copies the raw content to your clipboard
- **Raw:** opens `/raw/:id` (`text/plain`, useful for `curl`)
- **Download:** opens `/dl/:id` and saves the paste as a file with the right extension (`.lua`, `.js`, `.py`, …)
- **Delete:** only visible if you provide the delete token via URL parameter

### Password-protected pastes

Visiting a protected paste shows a password prompt at `/:id/password`. After entering the correct password, the content is displayed inline, there is no extra round-trip. Failed attempts are **not** counted in the view counter.

### Burn-after-read

A burn-after-read paste shows a warning before the first reveal. After viewing, the paste is atomically deleted from the database in the same SQL transaction. Subsequent visits show the "burned" state.

### Expired pastes

Once a paste reaches its `expires_at` timestamp, the viewer shows an expired notice. A cleanup job removes expired rows from the database every night (default: 03:30 server time).

---

## Deleting a paste

Append your delete token to the URL:

```
https://paste.msk-scripts.de/X7q9bA2k?token=dk_a7c4f2e1b9d8...
```

A delete button appears in the viewer. Confirming the action removes the paste immediately.

Alternatively, use the REST API:

```bash
curl -X DELETE "https://paste.msk-scripts.de/api/pastes/X7q9bA2k?token=dk_a7c4f2e1b9d8..."
```

---

## Raw view and download

These two routes are designed for automation and command-line tools.

### Raw

```bash
curl https://paste.msk-scripts.de/raw/X7q9bA2k
```

Returns the content as `text/plain; charset=utf-8`. No HTML, no highlighting, no headers around it, perfect for piping into `bash`, `python`, or `jq`.

### Download

```bash
curl -OJ https://paste.msk-scripts.de/dl/X7q9bA2k
```

Sends `Content-Disposition: attachment; filename="..."`. The filename is derived from the paste's title (sanitized) and uses the language's standard extension.

---

## Language switcher

Click the language dropdown in the header to switch between **German** and **English**. The choice is saved as a cookie and applies to all future visits from the same browser. Paste URLs do not include a locale prefix, `paste.msk-scripts.de/X7q9bA2k` works identically in both languages.

---

## Statistics page

`/stats` shows anonymous aggregate numbers across the whole instance:

- Total pastes created (all-time)
- Pastes created today / this week
- Top languages used

There is **no per-paste view tracking**, no IP information, and no breakdown that could identify individual users.

---

## Limits

| Limit | Value | Notes |
|---|---|---|
| Max paste size | 1 MB | Enforced server-side via Zod + DB column. |
| Max title length | 100 characters | Truncated in UI, rejected by API. |
| Rate limit (web form) | 10 / hour per IP hash | Returns `429 Too Many Requests` with `Retry-After`. |
| Daily limit (web form) | 20 pastes and 5 MB per IP address and 24 hours | Returns `429` with `code: "daily-limit"`. |
| Rate limit (API key) | 120 / hour per key | Returns `429` with `code: "key-limit"`. |
| Max expiration | 1 year | Cannot be extended after creation. |
| Custom ID length | 4–32 characters | Reserved IDs are blocked at creation. |

---

## Next steps

- [REST API](api.md): programmatic access for scripts and CLI tools
- [Privacy & Security](privacy.md): what MSK Paste does (and doesn't) store
