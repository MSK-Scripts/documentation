---
title: FAQ
sidebar_position: 7
---

# FAQ

Common questions about MSKanban — usage, security, deployment.

---

## Usage

### I forgot my password. What now?

Use the **recovery key** you saved at registration. The 24-word phrase deterministically re-derives a wrap key that unwraps a backup copy of your User Symmetric Key. Follow the *Recover* link on the login page.

If you lost both the password **and** the recovery key: your data is unrecoverable. The server cannot help — it never had a usable copy. This is by design (zero-knowledge), not a bug.

### Can the server admin read my cards?

No — that's the whole point. Card titles, descriptions, comments, checklists, custom field values, attachments, label names, milestone names and automation rule bodies are all XChaCha20-Poly1305 ciphertext on the server, with keys that never leave a logged-in user's browser. See [Privacy & Security](privacy.md) for the full key hierarchy.

What the server *does* see: user IDs, board / card / column IDs (random CUIDs), timestamps, positions, due dates, and label colours. That's the metadata it needs for sorting, filtering, the calendar / timeline UI, and analytics.

### Why can't I search across all my boards?

Server-side full-text search is impossible on ciphertext, and that's a deliberate trade-off. Client-side search works inside a board you've opened (the cards are decrypted in memory once). A future iteration may add an encrypted search index (think Searchable Symmetric Encryption) but that's not in v0.x.

### Can I edit a card from my phone?

Yes — the UI is responsive. PWA installation works on iOS and Android (offline-first with IndexedDB snapshot). The Argon2id KDF takes a couple of seconds longer on a phone than on a laptop; that's normal.

### What happens to comments / activity when I delete a card?

The card and its children (comments, checklists, attachments) are hard-deleted via `onDelete: Cascade`. The activity log retains a `CARD_DELETED` row with the card's ID (no plaintext) so the audit trail stays intact — that row points to a no-longer-existing target.

### My Timeline view shows "Timeline is empty" even though I have due dates set.

The Timeline only renders cards that have **at least a `dueAt`**. Cards without a due date are intentionally hidden — the footer hint tells you how many. To draw a Gantt-style **bar** (instead of just a diamond on the due day), the card also needs a `startAt` — set it in the card drawer.

### What's the difference between Timeline and Calendar?

Calendar is a month grid keyed by `dueAt`. Timeline is a horizontal Gantt grouped by milestone with day / week / month zoom — better for project planning across weeks or months.

---

## Security

### Is MSKanban audited?

Internally: yes — threat model, code review, blocking CodeQL in CI, signed containers, SBOMs. Externally: not yet. An external audit + pen-test is planned ahead of the v1.0 release. Until then, treat MSKanban as production-ready for self-host evaluation, not for high-sensitivity third-party data.

### Why not Bitwarden's crypto verbatim?

We use the same primitives (Argon2id, XChaCha20-Poly1305, X25519) and the same general shape (KDF → MK → wrapped DEKs). Differences:

- Workspace + Board keys are per-resource (Bitwarden is per-organisation / per-collection — finer granularity here because boards within a workspace can have different memberships in the future, even though v0.x makes them workspace-wide)
- The recovery flow uses BIP39-style English words for memorability instead of a generated PIN
- We use `argon2-browser` (WASM) rather than a server-roundtrip — the password never reaches the server

### Why is there no "share via link" feature?

There is — kind of. Public read-only boards are on the roadmap (USP §5.9). The implementation will put the Board Key in the URL **fragment** (`#key=…`) so the server never sees it (browsers don't send fragments in HTTP requests). Owner has to opt-in explicitly. Not in v0.1.

### Can I disable end-to-end encryption to make backups simpler?

No, and that wouldn't simplify backups anyway — a ciphertext DB dump is the same SQL operation as a plaintext one. The benefit of E2EE is the stolen-dump scenario: a thief gets nothing useful, even with full filesystem access.

### What does the server actually log?

Per the bundled pino logger config: structured JSON, `LOG_LEVEL=info` by default. Logs include API method + path + response time + status code + `userId` if authenticated + a hashed IP (HMAC over `IP_HASH_SECRET`). Logs **never** include card content, decrypted blobs, raw IPs, or Crypto material. See `src/lib/logger.ts` in the source for the exact format.

---

## Deployment

### The container starts and immediately exits with `DATABASE_URL not set`.

Both `DATABASE_URL` and `REDIS_URL` are mandatory. Check your `.env` file (or `EnvironmentFile` for systemd). The example in [`Installation`](installation.md#environment-variables) covers the full list.

### `502 Bad Gateway` after install.

Apache is reverse-proxying but the upstream isn't up. Check:

```bash
# systemd
sudo systemctl status mskanban
sudo journalctl -u mskanban -e --no-pager

# Docker
sudo docker compose -f /opt/mskanban/docker/docker-compose.prod.yml ps
sudo docker compose -f /opt/mskanban/docker/docker-compose.prod.yml logs app
```

Most common cause: the migration step failed (DB user lacks `CREATE` privilege). Re-run with verbose output:

```bash
sudo -u mskanban pnpm prisma migrate deploy
```

### WebSocket relay drops repeatedly / "Live updates paused".

Apache must have `mod_proxy_wstunnel` enabled and the example vhost includes the necessary `RewriteRule` for the `/api/ws` upgrade. Verify with:

```bash
apache2ctl -M | grep -E 'proxy|wstunnel'
```

If `proxy_wstunnel_module` is missing:

```bash
sudo a2enmod proxy_wstunnel
sudo systemctl reload apache2
```

### Passkey registration fails silently in the browser.

`WEBAUTHN_RP_ID` **must** exactly equal the hostname (no scheme, no port, no trailing slash). For `https://kanban.example.com`, set `WEBAUTHN_RP_ID=kanban.example.com`. Mismatch causes the registration to fail without a server-side log (the browser refuses to even send the request).

### How do I upgrade across pre-1.0 minor versions?

Read the [release notes](https://github.com/MSK-Scripts/mskanban/releases) first. Pre-1.0 means schema-breaking changes are possible — `pnpm prisma migrate deploy` will tell you what it wants to do before doing it. Take a DB backup before any upgrade.

### Can I run MSKanban behind nginx / Caddy / Traefik instead of Apache?

Yes. The reverse proxy just needs to:

1. Terminate TLS
2. Forward `/` to `http://127.0.0.1:3000` (the Next.js server)
3. Forward `/api/ws` with WebSocket upgrade to `http://127.0.0.1:3001` (the relay)
4. Pass the security headers (`Strict-Transport-Security`, etc.) — or let MSKanban set them and just forward them

The Apache example in `apache/mskanban.conf.example` is the reference; translating to nginx is a few lines, Caddy is trivial. Recipes for both are on the to-do list.

### Where does the attachment storage live?

`STORAGE_DRIVER=local` (the default) writes UUID-named files to `STORAGE_LOCAL_PATH`. Each file is encrypted under a per-attachment file key, which itself is encrypted under the Board Key — server admins reading the directory see meaningless bytes.

S3-compatible storage is supported but not yet documented; see `src/lib/storage/` in the source if you want to wire it up.

---

## Project

### Why AGPL-3.0?

Because we don't want a future cloud vendor to fork MSKanban, host it, and not contribute back. AGPL's network-trigger clause means: if you operate a modified MSKanban as a service for others, you have to publish your modifications. Self-hosting **for yourself** has no such obligation.

### How do I contribute?

Read [`CONTRIBUTING.md`](https://github.com/MSK-Scripts/mskanban/blob/main/CONTRIBUTING.md). DCO sign-off (`git commit --signoff`) is mandatory on every commit — no CLA, no copyright assignment.

### Roadmap?

Phase markers are tracked in [`CLAUDE.md`](https://github.com/MSK-Scripts/mskanban/blob/main/CLAUDE.md#10-roadmap) of the source repo. Phases 0–10 are ✅ shipped (v0.1.0-beta). Post-beta items live as GitHub issues.

### I have a feature request.

Open an [issue](https://github.com/MSK-Scripts/mskanban/issues/new) on GitHub. Please check the existing list first — many ideas are already tracked.

---

## Still stuck?

- [GitHub issues](https://github.com/MSK-Scripts/mskanban/issues) for bugs and feature requests
- [Discord](https://discord.gg/5hHSBRHvJE) for community questions
- For security findings: see [`SECURITY.md`](https://github.com/MSK-Scripts/mskanban/blob/main/SECURITY.md), **not** the issue tracker
