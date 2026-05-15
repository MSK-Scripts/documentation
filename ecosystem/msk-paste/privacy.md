---
title: Privacy & Security
sidebar_position: 5
---

# Privacy & Security

MSK Paste is built privacy-first. This page explains exactly what is — and isn't — stored when you create or view a paste.

---

## What is stored

For every paste created, the database row contains:

| Column | Purpose |
|---|---|
| `paste_id` | The public short ID (e.g. `X7q9bA2k`) |
| `title` | Optional title (only if you provided one) |
| `content` | The paste text |
| `language` | The chosen language for syntax highlighting |
| `password_hash` | bcrypt hash (cost 12) — only if a password was set |
| `expires_at` | Timestamp after which the paste is unreachable and deleted |
| `burn_after_read` | Boolean flag |
| `view_count` | Anonymous counter, never linked to viewers |
| `delete_token` | Random 64-char token, shown only to the creator |
| `size_bytes` | Size of `content` in bytes |
| `created_at` | Creation timestamp |
| `created_ip_hash` | **HMAC-SHA-256** of the creator's IP — used only for rate limiting |

That's it. There is no `views` table, no user table, no session table, no IP-address column in plain text.

---

## What is NOT stored

- **No plain-text IP addresses.** IPs are hashed with HMAC-SHA-256 using a server-side secret (`IP_HASH_SECRET`). Without the secret, the hashes cannot be reversed.
- **No GeoIP / country lookups.** The application never queries any geolocation service.
- **No analytics.** No Google Analytics, no Plausible, no Fathom, no Matomo — nothing.
- **No tracking cookies.** The only cookie set by MSK Paste is `MSK_PASTE_LOCALE`, which stores your language preference (`de` or `en`).
- **No third-party scripts.** All assets are served from the same origin. Shiki and fonts are bundled at build time.
- **No referer logging at the app level.** Apache may write standard access logs (configurable by the host).
- **No view history.** The view counter increments, but the application has no way to know *who* viewed a paste.

---

## How rate limiting works without IPs

Rate limiting needs to identify "the same client" without storing identifiable information. The flow is:

1. Take the requesting IP from `X-Forwarded-For` (set by Apache) or the socket address.
2. Compute `HMAC-SHA-256(ip, IP_HASH_SECRET)`.
3. Store the hash in an **in-memory** sliding window of recent requests.

Because the secret is generated per-installation (`openssl rand -hex 32`), even an attacker with full database access cannot reverse hashes back to IP addresses — there is no rainbow table they can compute without the secret.

The in-memory bucket resets on every restart, so even the rate-limit state is short-lived.

---

## Password protection

Passwords are hashed with **bcrypt at cost 12** before storage. The plain-text password is never persisted. Verification compares the supplied password against the hash — wrong attempts do **not** count toward the view counter and do **not** trigger burn-after-read.

:::info
The paste **content itself is not encrypted at rest**. The password gates access, but a database administrator could technically read the content directly. For truly sensitive secrets, treat MSK Paste as untrusted and encrypt the payload yourself (e.g. with `age` or `gpg`) before pasting.
:::

---

## Burn-after-read

When you enable burn-after-read, the first successful view triggers an **atomic SQL `DELETE`** in the same round-trip as the read. This means:

- Two concurrent viewers cannot both see the content — only one wins the race; the other gets the "burned" view.
- After deletion, the row is gone. No soft-delete, no recovery.
- Even the operator (you, if self-hosting) cannot retrieve the content after consumption.

---

## Expiration & cleanup

All pastes have an `expires_at` timestamp. The view route checks this on every request and returns the expired view if the paste has passed its expiry.

A nightly cron job (`scripts/cleanup.ts`) runs `DELETE FROM pastes WHERE expires_at < NOW()` to physically remove expired rows. The default schedule is 03:30 server time.

If you want immediate deletion at expiry instead of nightly cleanup, simply run the cleanup script more frequently (e.g. hourly).

---

## Database backups

The included `backup.sh` script creates a daily SQL dump (default: 03:00) with **14-day retention**. Backups contain everything in the database, including hashed IPs and password hashes — but not plain text IPs or passwords.

You are responsible for storing backups securely. Consider:

- Encrypting the dump at rest (`gpg --symmetric`)
- Sending it off-site (rsync, S3 with SSE, restic to Backblaze, …)
- Restricting filesystem permissions on the backup directory

---

## CSP and security headers

MSK Paste ships with strict Content Security Policy and other headers via `next.config.ts`:

```
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

The Apache vhost also enforces HTTPS, OCSP stapling, and modern TLS ciphers.

---

## Reporting a vulnerability

Found a security issue? Please report it via:

- **GitHub Security Advisories:** [Submit privately](https://github.com/MSK-Scripts/msk-paste/security/advisories/new)
- **Email:** `info@msk-scripts.de`

Please **do not** open public GitHub issues for security problems — give us a chance to fix and disclose responsibly.

---

## Open source

MSK Paste is licensed under [AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0). You can read every line of the source on [GitHub](https://github.com/MSK-Scripts/msk-paste) and verify these claims yourself. If you modify the code and run a modified version as a network service, the AGPL requires you to publish your changes.
