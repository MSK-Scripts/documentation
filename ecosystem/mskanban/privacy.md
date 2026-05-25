---
title: Privacy & Security
sidebar_position: 6
---

# Privacy & Security

MSKanban's defining property is **zero-knowledge** end-to-end encryption: a fully compromised server — DB dump, malicious admin, anything short of running code on your device — cannot read your content.

This page documents exactly what is and is not protected, the key hierarchy, and the threat model. It's intentionally detailed; if you're evaluating MSKanban for sensitive work, this is what you need to read.

The authoritative reference is the project's [threat model](https://github.com/MSK-Scripts/mskanban/blob/main/docs/threat-model.md) and [ADR 0003](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0003-zero-knowledge-e2ee.md). This page is the human-friendly tour.

---

## What the server sees

| Plaintext on server | Reason |
|---|---|
| User ID, email | Login routing, member lookup |
| Workspace / Board / Card / Column IDs | Random CUIDs, no plaintext meaning |
| Card `position`, `dueAt`, `startAt`, `archived` | Sorting, calendar / timeline UI, server-side cleanup |
| `Card.milestoneId`, `CardLabel.labelId` | Foreign-key references for filter / sort UI |
| Label **colour** (hex) | Used for filter / sort UI |
| Milestone `startAt`, `endAt`, `archived` | Burn-Down + Timeline scoping |
| `AutomationRule.trigger_type`, `trigger_meta` | Plaintext trigger envelope for future scheduler (see [ADR 0010](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0010-automation-engine.md)) — strict whitelist on write |
| Activity log: verb + actorId + targetId + ISO timestamp | Activity feed, webhooks, notifications |
| Hashed IPs (HMAC over `IP_HASH_SECRET`) | Brute-force protection, never raw |
| HTTP session timestamps + UA string | Sliding-window session expiry |

| Ciphertext only (server cannot read) | Encrypted under |
|---|---|
| Workspace name + metadata | Workspace Key |
| Board name + metadata | Workspace Key (binding `board:<id>`) |
| Column name | Board Key |
| Card title + description + custom field values | Board Key (binding `card:<id>`) |
| Comments | Board Key (binding `card:<id>`) |
| Checklists + checklist items | Board Key |
| Attachment filename, MIME type, blob bytes | Board Key + per-attachment file key |
| Label name | Board Key |
| Milestone name + description | Board Key |
| Automation rule body (name + conditions + actions) | Board Key |
| Card template body | Board Key |
| Webhook secret | `SERVER_ENCRYPTION_KEY` (server-side, not user-derived) |
| TOTP secret | `SERVER_ENCRYPTION_KEY` |

---

## Key hierarchy

```
Password (user types)
   │
   ▼ Argon2id (m=64 MiB, t=3, p=4, per-user salt)
Master Key (MK) ─────► never sent to server
   │
   ├─► Auth Hash (Argon2id of MK with a different salt) ──► sent on login
   │
   ▼ wraps
User Symmetric Key (USK)  +  User X25519 keypair
   │
   ▼ USK wraps
Workspace Key (one per workspace)
   │
   ▼ Workspace Key wraps
Board Key (one per board)
   │
   ▼ Board Key wraps (XChaCha20-Poly1305 AEAD)
Card content, comments, attachments, labels, milestones, automation rules…
```

Sharing a workspace with a new member is a NaCl Sealed Box of the Workspace Key, addressed to the invitee's X25519 public key. The server stores the sealed copy per-member; only the invitee's private key can open it.

### Primitives

| Where | Algorithm |
|---|---|
| Password KDF | Argon2id, m=64 MiB, t=3, p=4 — implemented via `argon2-browser` (WASM) |
| Symmetric AEAD | XChaCha20-Poly1305 (libsodium-wrappers) |
| Member key exchange | X25519 + crypto_box (sealed boxes) |
| Random | Web Crypto API `crypto.getRandomValues()` exclusively |
| HMAC (webhook signing, IP hashing) | HMAC-SHA256 |
| Server-side at-rest key (`SERVER_ENCRYPTION_KEY`) | AES-256-GCM |

Algorithms are **not** user-configurable. Crypto agility for a future migration is handled at the envelope level (`v1.<nonce>.<ct>` — the `v1` prefix is the negotiation hook).

---

## Recovery Key (read this once)

Zero-knowledge means **no email-me-a-reset-link**. The server cannot regenerate access; it never had a usable copy.

The fallback is a 24-word recovery phrase shown **exactly once** at registration. It deterministically derives an alternate wrap key that the server uses to encrypt a separate copy of the User Symmetric Key. On recovery the user enters the 24 words, the wrap key is re-derived client-side, the alternate USK copy is unwrapped, and the user sets a fresh password.

If the user loses **both** the password and the recovery phrase, the data is unrecoverable. This is by design.

ADR: [`0004-recovery-key.md`](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0004-recovery-key.md).

---

## Master Key persistence

ADR 0009: the Master Key lives in **memory** + a **`sessionStorage`** envelope.

- Inside one tab, the MK is held in a module-private variable
- A separate wrap key (32 bytes, Web Crypto) is also held in memory only
- The MK is encrypted with the wrap key (XChaCha20-Poly1305, AAD `mskanban|mk-session|v1`) and the **encrypted** blob is stored in `sessionStorage`
- On page reload the wrap key is gone, the blob in sessionStorage is unrecoverable, the user must sign in again. So: one password prompt per *browser session*, not per F5.
- New tabs cannot share the MK (each tab is its own JS Realm + its own sessionStorage)
- `wipe()` on logout zeroes both memory and sessionStorage

A future Service Worker mode could enable cross-tab continuity but is intentionally not in scope today — [ADR 0009](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0009-mk-session-persistence.md) explains the trade-off.

---

## Transport security

Configured both in Next.js middleware **and** in the Apache vhost (defence in depth):

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' wss://<self>;
  font-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

The `'unsafe-inline'` for styles is on a tracked TODO to replace with nonces. `'wasm-unsafe-eval'` is required for libsodium's WASM build.

---

## Threat model — quick summary

The [full STRIDE analysis](https://github.com/MSK-Scripts/mskanban/blob/main/docs/threat-model.md) is in the source repo. In short:

| Threat | Mitigation |
|---|---|
| Stolen DB dump | All sensitive fields ciphertext-only; AEAD keys never leave the client |
| Malicious admin | Cannot decrypt without the user's password / recovery key |
| Stolen session cookie | HttpOnly + Secure + SameSite=Strict + 30-min idle timeout |
| Brute-force login | Per-IP + per-user exponential backoff, account lockout after 10 fails |
| XSS | React default-escaping + DOMPurify for Markdown + strict CSP |
| CSRF | Double-submit cookie + SameSite=Strict |
| SQL injection | Prisma parametrised queries exclusively; no `$queryRawUnsafe` |
| Mass assignment | Zod schema on every endpoint |
| SSRF via webhooks | Private IP range block + DNS rebinding check |
| Path traversal in attachments | UUID storage keys, never user-input filenames |
| Replay of webhook payloads | HMAC-SHA256 with timestamp + 5-min window |
| ReDoS | All regexes `safe-regex` checked |
| Supply chain | Signed container (cosign keyless OIDC), CycloneDX + SPDX SBOMs, `pnpm audit` in CI |

What **isn't** mitigated (and isn't claimed to be):

- Code execution **on the user's device**. A malicious browser extension or compromised endpoint can read the MK from memory — that's outside the threat model. Zero-knowledge protects against the server, not the client.
- Traffic analysis. The server sees you exist, you log in at certain times, you touch certain Card IDs. It cannot see the content of those Cards, but the access pattern itself is metadata.
- The server learning who is on a board at a given moment (Yjs Awareness routes a `board:<id>` room, the relay sees that fact). Awareness payloads themselves are encrypted, but the *existence* of a connection is observable to the operator.

---

## GDPR

| Article | Implementation |
|---|---|
| Art. 15 (Right of Access) | `GET /api/me/export` — full JSON dump of everything the user can decrypt + all metadata about them |
| Art. 17 (Right to Erasure) | `DELETE /api/me` — crypto-shreds keys immediately (data instantly unreadable), hard-deletes rows after a 30-day grace window |
| Art. 20 (Data Portability) | JSON export is restorable into another MSKanban instance; the Markdown export is human-readable; a Trello-compatible JSON export is on the roadmap |

The hosted demo instance shows a cookie banner; self-hosted installs **don't** need one because nothing is tracked. Set `FEATURE_DEMO_MODE=false` (the default) to hide it.

---

## Reporting a vulnerability

Read the [`SECURITY.md`](https://github.com/MSK-Scripts/mskanban/blob/main/SECURITY.md) in the source repo:

- Coordinated disclosure, 90-day window
- PGP key published on the security page
- Hall of Fame for valid reports

Please do **not** open a public GitHub issue for security findings.

---

## Audit status

| Category | Status |
|---|---|
| Internal threat model + code review | ✅ documented in `docs/threat-model.md` |
| Static analysis (CodeQL) | ✅ blocking in CI |
| Container signing (cosign keyless OIDC) | ✅ all `ghcr.io/musiker15/mskanban` tags |
| SBOM (CycloneDX + SPDX) | ✅ attached to every release |
| External audit | ⚪ not yet — planned for the v1.0 cycle |
| Penetration test | ⚪ not yet — planned for the v1.0 cycle |

Pre-1.0: treat MSKanban as production-ready for self-host evaluation, not for processing high-sensitivity third-party data, until the external audit lands.
