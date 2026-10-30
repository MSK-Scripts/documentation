---
title: FAQ & Troubleshooting
sidebar_position: 6
---

# FAQ & Troubleshooting

## General

### Is MSK Shortener free to use?

Yes. The hosted instance at [s.msk-scripts.de](https://s.msk-scripts.de) is free for everyone. The source code is published under AGPL-3.0 so you can also self-host it on your own domain.

### Do I need an account?

No. MSK Shortener has no user system by design. The delete token you receive after creating a link is what allows you to remove it later. Creating links through the API needs an API key, though, see below.

### Can I edit a short link to point at a different URL?

No. Links are immutable. To change the destination, delete the old link (with the delete token) and create a new one with the same custom code.

### How long can a link live?

As long as you want. The `expiresAt` field is optional, a link without an expiration stays active until you delete it. If you set one, it must be a valid ISO 8601 timestamp in the future.

### Can I recover a deleted or expired link?

No. Deletion (manual or expiration) is permanent. Associated click statistics are also removed.

### Can I see who clicked my links?

No, and that's the point. Statistics show aggregated browser, OS, device and referrer counts, never any individual visitor's identity. IPs are hashed with a secret, full user agents are never stored.

### Will short links break if the destination changes?

Yes. MSK Shortener stores the URL you submitted verbatim. If the destination disappears, the short link will lead to a broken page. There is no link-health checker built in.

---

## Using the API

### Where's my API key?

You get it from the operator. Creating links through the API needs a key starting with `msks_`, and keys are only issued on the server, there is no sign-up or self-service. The hosted instance at s.msk-scripts.de does not issue keys to others; shorten links there through the website. If you host MSK Shortener yourself, create one with `sudo bash /opt/msk-shortener/scripts/api-key.sh create "<label>"`, see [Installation](installation.md#api-keys). Looking up links, verifying passwords and deleting with the delete token still work without a key.

### Why am I getting `429 Too Many Requests`?

You've hit a limit. The `code` field in the response says which one, and the `Retry-After` header, where present, says how many seconds to wait. These limits exist:

- **Create with an API key:** 120 per hour per key (`key-limit`)
- **Create from the web form:** 20 per hour per IP hash (`rate-limit`) and 20 per IP address and 24 hours (`daily-limit`)
- **Verify (password):** 10 per 5 minutes per IP hash (brute-force protection)

If you're self-hosting and need higher create limits, change `API_KEY_CREATE_PER_HOUR`, `RATE_LIMIT_CREATE_PER_HOUR` or `DAILY_LINKS_PER_IP` in `.env`.

### How do I delete a link via the API?

Send a `DELETE /api/links/:code` with the delete token as a Bearer header:

```bash
curl -X DELETE https://s.msk-scripts.de/api/links/msk \
  -H "Authorization: Bearer dk_a7c4f2..."
```

### Why does the API reject my URL with "Interne / private Adressen sind nicht erlaubt"?

You tried to shorten a URL pointing at a private IP range or localhost. This is **SSRF protection**, see [Privacy & Security](privacy.md#ssrf-protection). The shortener is only meant for public destinations.

### Why does the API refuse my link with `422`?

The target failed a target check. Links to the shortener itself, to other URL shorteners, to bare IP addresses and to hostnames built like phishing pages are refused, from the form and from API keys alike. The `code` field says which check it was: `own-link`, `shortener`, `ip-host` or `phishing`. Details in [Usage](usage.md#what-gets-blocked).

### Can I get a list of all links I've created?

No. There is no per-user history, the database doesn't know which links belong to "you". Save the delete tokens client-side if you want a personal history.

---

## Self-hosting

### `502 Bad Gateway` from Apache

Apache can't reach the Node process. Check:

```bash
sudo systemctl status msk-shortener
sudo journalctl -u msk-shortener -n 100
sudo ss -tlnp | grep 3011
```

If the service is failing to start, look at the journal for errors. The most common causes are:

- Missing or wrong `.env` values (especially `DB_*` and `IP_HASH_SECRET`)
- Database connection refused
- Port `3011` already in use by another process

### Port 3011 is already in use

Either stop the conflicting process or change the port in both `.env` (`PORT=3014`), `package.json` (`next start -p 3014`), and the Apache vhost (`ProxyPass http://localhost:3014/`). Then restart both services.

### "Cannot find module" after deployment

This usually means `npm ci` failed or `node_modules/` is missing. From the project root:

```bash
sudo rm -rf node_modules
sudo npm ci
sudo npm run build
sudo systemctl restart msk-shortener
```

### Database errors at boot

```
Error: Access denied for user 'msk_shortener'@'localhost'
```

The credentials in `.env` don't match what's in MariaDB. Verify by trying to log in manually:

```bash
mysql -u msk_shortener -p msk_shortener
```

If that fails, recreate the user (see [Installation](installation.md)).

### `IP_HASH_SECRET is required` on startup

You missed setting the secret in `.env`. Generate one:

```bash
openssl rand -hex 32
```

Paste it into `.env`, then restart the service.

:::warning
If you change `IP_HASH_SECRET` after the fact, all existing rate-limit hashes and click hashes become "different visitors", but you don't lose any data, just continuity in the rate-limit window.
:::

### The form refuses to shorten links

In production the form needs Cloudflare Turnstile. Without `CAPTCHA_SITE_KEY` and `CAPTCHA_SECRET_KEY` in `.env` it shortens nothing and answers `503` with `code: "captcha-unavailable"`. Create a Turnstile widget for your instance's hostname in the Cloudflare dashboard, put both keys into `.env` and restart the service. Cloudflare's test keys only work outside production. See [Installation](installation.md#environment-variables).

### Let's Encrypt rate limit hit

If you've been experimenting with certbot and hit a rate limit, use the **staging** environment for testing:

```bash
sudo certbot --apache --staging -d s.example.com
```

Once you're sure the setup works, run it without `--staging` to get the real certificate.

### Migrations failed in the middle

The migration runner is idempotent, files that successfully ran are recorded in the `_migrations` table. Fix the failing SQL file, then run `npm run migrate` again. Already-applied migrations are skipped.

### How do I back up before an update?

The included script:

```bash
sudo bash /opt/msk-shortener/deployment/scripts/backup.sh
```

Creates a SQL dump in `/opt/msk-shortener/backups/` with a date-stamped filename. Keeps 14 days of dumps by default.

### Can I run MSK Shortener and MSK Paste on the same server?

Yes, that's the typical setup. They use different ports (`3011` and `3012`), separate databases, and separate Apache vhosts. The install scripts are designed to coexist.

---

## Features

### Why don't you support arbitrary protocols (`ftp://`, `magnet:`)?

Only `http://` and `https://` are accepted because they are the safest defaults for a public shortener. Allowing other schemes would let users redirect victims to file shares, deep links into apps, etc. If you genuinely need this for a private deployment, the validation lives in `src/lib/validation.ts` and can be relaxed.

### Why no link previews / OG-tag scraping?

To stay privacy-friendly and lightweight. Previews would require the shortener to fetch the destination URL on every short link, which (a) leaks click metadata to the destination server and (b) opens an SSRF surface despite the input filter.

### Will you add custom domains?

Not in the current design. The shortener assumes a single base URL per instance (`NEXT_PUBLIC_BASE_URL`). If you want a different short domain for a different audience, run a second instance.

### Can I bulk-import or bulk-export links?

Not via the UI, but the REST API can be scripted for both directions. Bulk-creating needs an API key, and one key shortens up to 120 links per hour:

```bash
# Bulk-create
while read url; do
  curl -sS -X POST https://s.msk-scripts.de/api/links \
    -H "Authorization: Bearer $MSK_SHORTENER_KEY" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg u "$url" '{url: $u}')" \
    | jq -r '"\(.shortUrl) \(.deleteToken)"'
done < urls.txt
```

For self-hosted instances, direct SQL is the easiest export path:

```sql
SELECT short_code, original_url, expires_at, click_count FROM links;
```

### Is there a CLI tool?

Not officially yet. The [REST API page](api.md) includes a small Bash function (`mskshort()`) you can drop into your `~/.bashrc`. A proper CLI tool is on the roadmap.

---

## Still stuck?

- Open an issue on [GitHub](https://github.com/MSK-Scripts/msk-shortener/issues)
- Join the [MSK Scripts Discord](https://discord.gg/5hHSBRHvJE)
- For security issues, see the [Privacy & Security](privacy.md#reporting-a-vulnerability) page
