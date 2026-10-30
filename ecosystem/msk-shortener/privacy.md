---
title: Privacy & Security
sidebar_position: 5
---

# Privacy & Security

MSK Shortener is built privacy-first. This page explains exactly what is, and isn't, stored when you create a link or click one.

---

## What is stored per link

For every short link created, the `links` row contains:

| Column | Purpose |
|---|---|
| `short_code` | The public short ID (e.g. `msk`) |
| `original_url` | The destination URL |
| `password_hash` | bcrypt hash (cost 12), only if a password was set |
| `expires_at` | Timestamp after which the link returns "expired" |
| `delete_token` | Random 48-char token, shown only to the creator |
| `click_count` | Anonymous counter, never linked to specific clicks |
| `created_at` | Creation timestamp |
| `created_ip_hash` | **HMAC-SHA-256** of the creator's IP, used only for rate limiting, including the daily limit of the web form |

---

## What is stored per click

Each click on a short link adds an anonymized row to the `clicks` table:

| Column | Example value |
|---|---|
| `link_id` | foreign key to the link |
| `clicked_at` | timestamp |
| `ip_hash` | `HMAC-SHA-256(IP, IP_HASH_SECRET)`, never reversed |
| `referrer` | host only, e.g. `github.com` (no path, no query) |
| `browser` | family name from UA, e.g. `Chrome` |
| `os` | family name from UA, e.g. `Linux` |
| `device_type` | `desktop`, `mobile`, or `tablet` |

That's it. No full user agent, no full referrer URL, no plain-text IP, no cookies, no fingerprinting.

Click rows are tied to a `link_id` via `ON DELETE CASCADE`, when a link is deleted, all its clicks vanish too.

---

## What is NOT stored

- **No plain-text IP addresses.** IPs are hashed with HMAC-SHA-256 using a server-side secret (`IP_HASH_SECRET`). Without the secret, the hashes cannot be reversed.
- **No GeoIP / country lookups.** The application never queries any geolocation service.
- **No analytics.** No Google Analytics, no Plausible, no Fathom, no Matomo, nothing.
- **No tracking cookies.** The only cookie set by MSK Shortener is `NEXT_LOCALE`, which stores your language preference (`de` or `en`).
- **One third-party script, and only on the create page.** The page with the create form loads Cloudflare Turnstile as spam protection, see [below](#spam-protection-cloudflare-turnstile). Opening a short link loads nothing from third parties. Everything else is served from the same origin.
- **No referer logging at the app level beyond the host.** The query string and full path are stripped before storage.
- **No user accounts / sessions.** There is no `users` table, no `sessions` table, no JWT, nothing to leak. API keys for the REST API are stored only as scrypt hashes in the table `api_keys`, with a short prefix, a label and their timestamps.

---

## How rate limiting works without IPs

Rate limiting needs to identify "the same client" without storing identifiable information. The flow is:

1. Take the client IP from `X-Real-IP`, which Apache sets from the connection and which replaces whatever a client sent. If it is missing, take the last entry of `X-Forwarded-For`, the one Apache appended. `CF-Connecting-IP` and the first `X-Forwarded-For` entry are never used, because the client writes them itself and could pick a new address for every request.
2. Compute `HMAC-SHA-256(ip, IP_HASH_SECRET)`.
3. Store the hash in an **in-memory** sliding window of recent requests. That is the hourly limit.

The daily limit of the web form (20 links per 24 hours) counts the links stored with the same `created_ip_hash`. The hash is deleted together with the link.

Because the secret is generated per-installation (`openssl rand -hex 32`), even an attacker with full database access cannot reverse hashes back to IP addresses.

The in-memory bucket of the hourly limit resets on every restart, so that part of the rate-limit state is short-lived. Requests with an API key are counted per key, not per IP address.

---

## Spam protection (Cloudflare Turnstile)

The page with the create form loads Cloudflare Turnstile from `challenges.cloudflare.com`. Turnstile checks whether a person is sending the form. It is the only third-party script of MSK Shortener, and it is not loaded when a short link is opened.

When the create page loads, your browser connects to Cloudflare, which receives your IP address and information about your browser. When you send the form, MSK Shortener passes the Turnstile token and your IP address to Cloudflare to confirm the check.

- **Provider:** Cloudflare, Inc., USA
- **Legal basis:** Art. 6 (1) (f) GDPR, the legitimate interest in keeping the service free of spam and abuse
- **Transfer to the USA:** Cloudflare is certified under the EU-US Data Privacy Framework. Standard Contractual Clauses apply in addition.

---

## SSRF protection

URLs that point at private or loopback addresses are rejected at creation time. This prevents your shortener from being abused as a bounce point into internal networks. Blocked ranges:

- `127.0.0.0/8` (loopback)
- `0.0.0.0`, `::1`, `localhost`
- `10.0.0.0/8` (RFC 1918)
- `172.16.0.0/12` (RFC 1918)
- `192.168.0.0/16` (RFC 1918)
- `169.254.0.0/16` (link-local / cloud metadata)

Only `http://` and `https://` schemes are accepted, no `file://`, `gopher://`, `ftp://`, etc.

On top of that, links to bare IP addresses are refused, public ones included, and so are links to other URL shorteners and to hostnames built like phishing pages. See [Usage](usage.md#what-gets-blocked).

---

## Password protection

Passwords are hashed with **bcrypt at cost 12** before storage. The plain-text password is never persisted.

Verification has two safeguards:

1. **Generic error messages.** The API returns the same `401` for wrong password and non-existent link, preventing enumeration of which short codes are protected.
2. **Brute-force throttling.** Verify attempts are rate-limited to **10 per 5 minutes** per IP hash.

---

## Expiration & cleanup

All links can have an `expires_at` timestamp. The redirect route checks this on every request and shows the expired view if it has passed.

A nightly cron job (`scripts/cleanup.ts`) runs `DELETE FROM links WHERE expires_at < NOW()` to physically remove expired rows. The default schedule is 03:30 server time. The `ON DELETE CASCADE` on the `clicks` table ensures associated click data is also removed.

---

## Database backups

The included `backup.sh` script creates a daily SQL dump (default: 03:00) with **14-day retention**. Backups contain everything in the database, including hashed IPs and password hashes, but not plain text IPs or passwords.

You are responsible for storing backups securely. Consider:

- Encrypting the dump at rest (`gpg --symmetric`)
- Sending it off-site (rsync, S3 with SSE, restic to Backblaze, …)
- Restricting filesystem permissions on the backup directory

---

## CSP and security headers

MSK Shortener sets a strict Content Security Policy and other headers on every response, in `proxy.ts`:

```
Content-Security-Policy: default-src 'none'; script-src 'self' 'nonce-...' 'strict-dynamic' https://challenges.cloudflare.com; ...
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

The only outside source the policy allows is `https://challenges.cloudflare.com`, for the Turnstile script, its frame and its requests.

The Apache vhost also enforces HTTPS, OCSP stapling, and modern TLS ciphers.

---

## Reporting a vulnerability

Found a security issue? Please report it via:

- **GitHub Security Advisories:** [Submit privately](https://github.com/MSK-Scripts/msk-shortener/security/advisories/new)
- **Email:** `info@msk-scripts.de`

Please **do not** open public GitHub issues for security problems, give us a chance to fix and disclose responsibly.

---

## Open source

MSK Shortener is licensed under [AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0). You can read every line of the source on [GitHub](https://github.com/MSK-Scripts/msk-shortener) and verify these claims yourself. If you modify the code and run a modified version as a network service, the AGPL requires you to publish your changes.
