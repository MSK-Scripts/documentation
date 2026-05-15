---
title: Usage
sidebar_position: 3
---

# Using MSK Shortener

This page walks you through the web interface — shortening URLs, viewing click statistics, downloading QR codes, and managing your links.

---

## Shortening a URL

Open [s.msk-scripts.de](https://s.msk-scripts.de) (or your self-hosted instance) and you'll see the creation form.

### Fields

| Field | Required | Notes |
|---|---|---|
| **URL** | required | The long URL to shorten. Must be `http://` or `https://`. Max 2048 characters. |
| **Custom code** | optional | 3–20 characters, only `a–z`, `A–Z`, `0–9`, `_`, `-`. If omitted, a 7-character ID is generated. |
| **Password** | optional | 4–100 characters. Visitors must enter it before being redirected. |
| **Expiration** | optional | Any future ISO 8601 timestamp. The link returns "expired" after this date. |

### What gets blocked

For security, MSK Shortener refuses URLs that point at:

- `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`
- `10.0.0.0/8` (private)
- `172.16.0.0/12` (private)
- `192.168.0.0/16` (private)
- `169.254.0.0/16` (link-local)

This is **SSRF protection** — preventing your shortener from being used to bounce traffic to internal services.

### After creation

You receive:

- The **short URL** (e.g. `https://s.msk-scripts.de/msk`)
- A **delete token** — save this if you want to be able to remove the link later

:::warning
The delete token is shown **only once**, immediately after creation. There is no account system to recover it. If you lose it, you'll have to wait for the link to expire.
:::

---

## Visiting a short link

When someone visits `s.example.com/:code`:

1. The link is looked up.
2. If it has expired → "expired" page is shown.
3. If it has a password → visitor is asked to enter it (with brute-force throttling).
4. Otherwise → 302 redirect to the target URL.
5. An anonymized click row is recorded for statistics.

### Password-protected links

Visiting a protected short link shows a password prompt. After entering the correct password, the visitor is redirected to the target URL. Failed attempts are throttled at **10 attempts per 5 minutes per IP hash** to prevent brute force.

### Expired links

Once a link reaches its `expires_at` timestamp, the redirect route shows an expired notice. A cleanup job removes expired rows from the database every night (default: 03:30 server time).

---

## Click statistics

Every short link has its own statistics page at `s.example.com/:code/stats`. You can see:

- **Total clicks** (all-time)
- **Timeline chart** — clicks per day for the last 30 days (configurable up to 365)
- **Browsers** — Chrome, Firefox, Safari, etc.
- **Operating systems** — Linux, Windows, macOS, Android, iOS
- **Device types** — desktop / mobile / tablet
- **Top referrers** — which domains sent traffic to your link

There is **no visitor identity** in any of this. Each click row contains a hashed IP (which is never reversed), a referrer host, and a UA family string. That's all.

---

## QR codes

Every short link can be downloaded as a QR code in two formats:

- **PNG** — `s.example.com/api/links/:code/qr?format=png` (default, 512×512, MSK colors)
- **SVG** — `s.example.com/api/links/:code/qr?format=svg` (scalable, vector)

The QR code encodes the **short URL** (not the long one), so you can reprint a label and still update the destination via the delete-and-recreate flow if needed.

```bash
# Save a PNG
curl -o msk.png 'https://s.msk-scripts.de/api/links/msk/qr?format=png'

# Save an SVG
curl -o msk.svg 'https://s.msk-scripts.de/api/links/msk/qr?format=svg'
```

---

## Deleting a link

Send a `DELETE` request with your token as a Bearer header:

```bash
curl -X DELETE https://s.msk-scripts.de/api/links/msk \
  -H "Authorization: Bearer dk_a7c4f2e1b9d8..."
```

The web UI also accepts the token via a delete page if you have the short code and the token.

---

## Language switcher

Click the language dropdown in the header to switch between **German** and **English**. The choice is saved as a cookie and applies to all future visits from the same browser. Short URLs do not include a locale prefix — `s.msk-scripts.de/msk` works identically in both languages.

---

## Global statistics page

`/stats` shows anonymous aggregate numbers across the whole instance:

- Total links created
- Links created today / this week
- Total clicks
- Most-used browsers / operating systems / devices

There is **no per-link drill-down** here (those live on the per-link stats page) and no IP information.

---

## Limits

| Limit | Value | Notes |
|---|---|---|
| Max URL length | 2048 characters | Enforced server-side via Zod. |
| Custom code length | 3–20 characters | Reserved codes (e.g. `api`, `stats`, `privacy`) are blocked. |
| Password length | 4–100 characters | bcrypt cost 12. |
| Rate limit (create) | 20 / hour per IP hash | Returns `429 Too Many Requests` with `Retry-After`. |
| Rate limit (verify password) | 10 / 5 minutes per IP hash | Brute-force protection. |
| Max expiration | Any future ISO timestamp | No hard cap, but DB cleanup runs nightly. |

---

## Next steps

- [REST API](api.md) — Programmatic access for scripts and CLI tools
- [Privacy & Security](privacy.md) — What MSK Shortener does (and doesn't) store
