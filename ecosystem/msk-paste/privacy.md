---
title: Privacy & Security
sidebar_position: 5
---

# Privacy & Security

MSK Paste is built privacy-first. This page explains exactly what is, and isn't, stored when you create or view a paste.

---

## What is stored

For every paste created, the database row contains:

| Column | Purpose |
|---|---|
| `paste_id` | The public short ID (e.g. `X7q9bA2k`) |
| `title` | Optional title (only if you provided one) |
| `content` | The paste text |
| `language` | The chosen language for syntax highlighting |
| `password_hash` | bcrypt hash (cost 12), only if a password was set |
| `expires_at` | Timestamp after which the paste is unreachable and deleted |
| `burn_after_read` | Boolean flag |
| `view_count` | Anonymous counter, never linked to viewers |
| `delete_token` | Random 64-char token, shown only to the creator |
| `size_bytes` | Size of `content` in bytes |
| `created_at` | Creation timestamp |
| `created_ip_hash` | **HMAC-SHA-256** of the creator's IP, used only for rate limiting, including the daily limit of the web form. Deleted together with the paste |

That's it. There is no `views` table, no user table, no session table, no IP-address column in plain text.

API keys for the REST API live in a table of their own, `api_keys`. It holds only the SHA-256 hash of each key, a short prefix, a label, and when the key was created, last used and revoked. The key itself is never stored.

---

## What is NOT stored

- **No plain-text IP addresses.** IPs are hashed with HMAC-SHA-256 using a server-side secret (`IP_HASH_SECRET`). Without the secret, the hashes cannot be reversed.
- **No GeoIP / country lookups.** The application never queries any geolocation service.
- **No analytics.** No Google Analytics, no Plausible, no Fathom, no Matomo, nothing.
- **No tracking cookies.** The only cookie set by MSK Paste is `NEXT_LOCALE`, which stores your language preference (`de` or `en`).
- **One third-party script, and only on the create page.** The page with the create form loads Cloudflare Turnstile as spam protection, see [below](#spam-protection-cloudflare-turnstile). Pages that display a paste load nothing from third parties. Everything else is served from the same origin, Shiki and fonts are bundled at build time.
- **No referer logging at the app level.** Apache may write standard access logs (configurable by the host).
- **No view history.** The view counter increments, but the application has no way to know *who* viewed a paste.

---

## How rate limiting works without IPs

Rate limiting needs to identify "the same client" without storing identifiable information. The flow is:

1. Take the client IP from `X-Real-IP`, which Apache sets from the connection and which replaces whatever a client sent. If it is missing, take the last entry of `X-Forwarded-For`, the one Apache appended. `CF-Connecting-IP` and the first `X-Forwarded-For` entry are never used, because the client writes them itself and could pick a new address for every request.
2. Compute `HMAC-SHA-256(ip, IP_HASH_SECRET)`.
3. Store the hash in an **in-memory** sliding window of recent requests. That is the hourly limit.

The daily limit of the web form (20 pastes and 5 MB per 24 hours) counts the pastes stored with the same `created_ip_hash`. The hash is deleted together with the paste.

Because the secret is generated per-installation (`openssl rand -hex 32`), even an attacker with full database access cannot reverse hashes back to IP addresses, there is no rainbow table they can compute without the secret.

The in-memory bucket of the hourly limit resets on every restart, so that part of the rate-limit state is short-lived. Requests with an API key are counted per key, not per IP address.

---

## Spam protection (Cloudflare Turnstile)

The page with the create form loads Cloudflare Turnstile from `challenges.cloudflare.com`. Turnstile checks whether a person is sending the form. It is the only third-party script of MSK Paste, and it is not loaded on pages that display a paste.

When the create page loads, your browser connects to Cloudflare, which receives your IP address and information about your browser. When you send the form, MSK Paste passes the Turnstile token and your IP address to Cloudflare to confirm the check.

- **Provider:** Cloudflare, Inc., USA
- **Legal basis:** Art. 6 (1) (f) GDPR, the legitimate interest in keeping the service free of spam and abuse
- **Transfer to the USA:** Cloudflare is certified under the EU-US Data Privacy Framework. Standard Contractual Clauses apply in addition.

---

## Password protection

Passwords are hashed with **bcrypt at cost 12** before storage. The plain-text password is never persisted. Verification compares the supplied password against the hash, wrong attempts do **not** count toward the view counter and do **not** trigger burn-after-read.

:::info
The paste **content itself is not encrypted at rest**. The password gates access, but a database administrator could technically read the content directly. For truly sensitive secrets, treat MSK Paste as untrusted and encrypt the payload yourself (e.g. with `age` or `gpg`) before pasting.
:::

---

## Burn-after-read

When you enable burn-after-read, the first successful view triggers an **atomic SQL `DELETE`** in the same round-trip as the read. This means:

- Two concurrent viewers cannot both see the content, only one wins the race; the other gets the "burned" view.
- After deletion, the row is gone. No soft-delete, no recovery.
- Even the operator (you, if self-hosting) cannot retrieve the content after consumption.

---

## Expiration & cleanup

All pastes have an `expires_at` timestamp. The view route checks this on every request and returns the expired view if the paste has passed its expiry.

A nightly cron job (`scripts/cleanup.ts`) runs `DELETE FROM pastes WHERE expires_at < NOW()` to physically remove expired rows. The default schedule is 03:30 server time.

If you want immediate deletion at expiry instead of nightly cleanup, simply run the cleanup script more frequently (e.g. hourly).

---

## Database backups

The included `backup.sh` script creates a daily SQL dump (default: 03:00) with **14-day retention**. Backups contain everything in the database, including hashed IPs and password hashes, but not plain text IPs or passwords.

You are responsible for storing backups securely. Consider:

- Encrypting the dump at rest (`gpg --symmetric`)
- Sending it off-site (rsync, S3 with SSE, restic to Backblaze, …)
- Restricting filesystem permissions on the backup directory

---

## CSP and security headers

MSK Paste sets a strict Content Security Policy and other headers on every response, in `proxy.ts`:

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

- **GitHub Security Advisories:** [Submit privately](https://github.com/MSK-Scripts/msk-paste/security/advisories/new)
- **Email:** `info@msk-scripts.de`

Please **do not** open public GitHub issues for security problems, give us a chance to fix and disclose responsibly.

---

## Open source

MSK Paste is licensed under [AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0). You can read every line of the source on [GitHub](https://github.com/MSK-Scripts/msk-paste) and verify these claims yourself. If you modify the code and run a modified version as a network service, the AGPL requires you to publish your changes.
