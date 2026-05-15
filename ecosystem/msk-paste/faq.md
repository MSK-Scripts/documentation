---
title: FAQ & Troubleshooting
sidebar_position: 6
---

# FAQ & Troubleshooting

## General

### Is MSK Paste free to use?

Yes. The hosted instance at [paste.msk-scripts.de](https://paste.msk-scripts.de) is free for everyone. The source code is published under AGPL-3.0 so you can also self-host it on your own infrastructure.

### Do I need an account?

No. MSK Paste has no user system by design. The delete token you receive after creating a paste is what allows you to remove it later.

### Can I edit a paste after creating it?

No. Pastes are immutable. To "edit" a paste, create a new one and delete the old one with the delete token.

### What's the maximum paste size?

1 MB of text. The limit is enforced server-side and by the database. If you need to share larger files, use a proper file hosting service instead.

### How long can a paste live?

From 10 minutes up to 1 year. The default is 1 week. Once a paste expires, it is unreachable immediately and physically deleted from the database within 24 hours.

### Are pastes encrypted?

The `content` column is **not** encrypted at rest — passwords gate viewing but the operator could read the database. If you need real end-to-end secrecy, encrypt the content client-side (e.g. with `age` or `gpg`) before pasting.

### Can I recover a deleted or expired paste?

No. Deletion (manual, expiration, or burn-after-read) is permanent. There is no soft-delete and no trash bin.

### Can I search public pastes?

No. Every paste is unlisted — knowing the ID is the only way to find a paste. There is no public directory, no search, and no listing endpoint.

---

## Using the API

### Where's my API key?

There is no API key. All endpoints are public. Write operations are protected by rate limiting (10 creates per hour per IP hash).

### Why am I getting `429 Too Many Requests`?

You've hit the rate limit on `POST /api/pastes`. Check the `Retry-After` header for how many seconds to wait. If you're self-hosting and need a higher limit, change `RATE_LIMIT_CREATE_PER_HOUR` in `.env`.

### How do I delete a paste via the API?

Send `DELETE /api/pastes/:id?token=<deleteToken>`. The token was returned in the response when you created the paste.

### Can I get a list of all pastes I've created?

No. There is no per-user history — the database doesn't know which pastes belong to "you". Save the delete tokens client-side if you want a personal history.

---

## Self-hosting

### `502 Bad Gateway` from Apache

Apache can't reach the Node process. Check:

```bash
sudo systemctl status msk-paste
sudo journalctl -u msk-paste -n 100
sudo ss -tlnp | grep 3012
```

If the service is failing to start, look at the journal for errors. The most common causes are:

- Missing or wrong `.env` values (especially `DB_*` and `IP_HASH_SECRET`)
- Database connection refused
- Port `3012` already in use by another process

### Port 3012 is already in use

Either stop the conflicting process or change the port in both `.env` (`PORT=3013`) and the Apache vhost (`ProxyPass http://localhost:3013/`). Then restart both services.

### "Cannot find module" after deployment

This usually means `npm ci` failed or `node_modules/` is missing. From the project root:

```bash
sudo rm -rf node_modules
sudo npm ci
sudo npm run build
sudo systemctl restart msk-paste
```

### Database errors at boot

```
Error: Access denied for user 'msk_paste'@'localhost'
```

The credentials in `.env` don't match what's in MariaDB. Verify by trying to log in manually:

```bash
mysql -u msk_paste -p msk_paste
```

If that fails, recreate the user (see [Installation](installation.md)).

### `IP_HASH_SECRET is required` on startup

You missed setting the secret in `.env`. Generate one:

```bash
openssl rand -hex 32
```

Paste it into `.env`, then restart the service.

### Let's Encrypt rate limit hit

If you've been experimenting with certbot and hit a rate limit, use the **staging** environment for testing:

```bash
sudo certbot --apache --staging -d paste.example.com
```

Once you're sure the setup works, run it without `--staging` to get the real certificate.

### Migrations failed in the middle

The migration runner is idempotent — files that successfully ran are recorded in the `_migrations` table. Fix the failing SQL file, then run `npm run migrate` again. Already-applied migrations are skipped.

### How do I back up before an update?

The included script:

```bash
sudo bash /opt/msk-paste/deployment/scripts/backup.sh
```

Creates a SQL dump in `/opt/msk-paste/backups/` with a date-stamped filename. Keep 14 days of dumps by default.

---

## Features

### Why is there no file upload?

Out of scope. MSK Paste is a **text** pastebin. For files, use a proper file host like [Nextcloud](https://nextcloud.com/) or [Hetzner Storage Boxes](https://www.hetzner.com/storage/storage-box).

### Why no comments / discussions / forking?

Privacy-first design. Anything beyond "share a snippet" adds tracking surface (who commented, who forked, who replied). If you need collaboration, use [HedgeDoc](https://hedgedoc.org/) instead.

### Will you add `<language>`?

Open an [issue](https://github.com/MSK-Scripts/msk-paste/issues) with the language name and Shiki's identifier. Adding a language is usually a one-line change.

### Can I customise the theme?

Yes — fork the repo and change `tailwind.config.ts` and `app/globals.css`. The MSK design tokens are concentrated in those two files.

### Is there a CLI tool?

Not officially yet. The [REST API page](api.md) includes a small Bash function (`mskpaste()`) you can drop into your `~/.bashrc`. A proper CLI tool is on the roadmap.

---

## Still stuck?

- Open an issue on [GitHub](https://github.com/MSK-Scripts/msk-paste/issues)
- Join the [MSK Scripts Discord](https://discord.gg/5hHSBRHvJE)
- For security issues, see the [Privacy & Security](privacy.md#reporting-a-vulnerability) page
