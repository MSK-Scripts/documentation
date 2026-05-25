---
title: Overview
sidebar_position: 1
---

# MSKanban

**A self-hostable, zero-knowledge Kanban board** — part of the MSK ecosystem alongside [MSK Paste](../msk-paste/index.md) and [MSK Shortener](../msk-shortener/index.md).

- **Source code:** [github.com/MSK-Scripts/mskanban](https://github.com/MSK-Scripts/mskanban)
- **Container image:** [`ghcr.io/musiker15/mskanban`](https://github.com/musiker15/mskanban/pkgs/container/mskanban)
- **License:** AGPL-3.0-or-later
- **Current release:** `v0.1.0-beta` (pre-1.0 — see the [release notes](https://github.com/MSK-Scripts/mskanban/releases))

:::warning Pre-1.0
The crypto envelope, database schema and public API may still change without a major-version bump. Each change is documented in the project [`CHANGELOG`](https://github.com/MSK-Scripts/mskanban/blob/main/CHANGELOG.md). **Do not put production data on it yet.**
:::

---

## What is MSKanban?

MSKanban is a Trello-style Kanban board that **encrypts your content on your device before it reaches the server**. Even a fully compromised server — database dump, malicious admin, anything short of running code on your machine — cannot read your card titles, descriptions, comments, checklists, custom-field values, or attachments. The server only sees opaque ciphertext and the metadata it strictly needs to route requests (user IDs, timestamps, positions).

The differentiator is **zero-knowledge**: a Trello-style UX with the "server can't read your data" guarantee of Bitwarden or Standard Notes.

---

## Why MSKanban?

| Feature | Trello | Jira Cloud | Planka | Wekan | **MSKanban** |
|---|:-:|:-:|:-:|:-:|:-:|
| Self-hostable | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Zero-knowledge E2EE** | ❌ | ❌ | ❌ | ❌ | ✅ |
| WebAuthn / Passkeys | ⚠️ | ⚠️ | ❌ | ❌ | ✅ |
| Real-time sync (CRDT) | ❌ | ❌ | ⚠️ | ❌ | ✅ |
| Offline-first PWA | ⚠️ | ❌ | ❌ | ⚠️ | ✅ |
| Built-in webhooks with DLQ | ✅ | ✅ | ❌ | ❌ | ✅ |
| GDPR-ready by design | ❌ | ⚠️ | ⚠️ | ✅ | ✅ |
| WCAG 2.1 AA | ⚠️ | ⚠️ | ❌ | ⚠️ | ✅ |
| Signed container + SBOM | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Feature highlights

- **Workspaces, boards, columns, cards** — the usual Kanban primitives, all with E2EE-encrypted titles, descriptions, comments, checklists, and attachments
- **Labels** with colour + encrypted name; **assignees**; **due dates + start dates**
- **Milestones** for grouping cards with a date window (drives burn-down analytics)
- **Five board views**: Kanban / Calendar / Timeline (Gantt) / Table / Analytics
- **Analytics**: Cycle Time, Lead Time, Cumulative Flow Diagram, Throughput, Aging WIP, Burn-Down per milestone
- **Automation rules** ("when a card moves to *Done*, attach label *closed*") — fully E2EE, [ADR 0010](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0010-automation-engine.md)
- **Real-time** via Yjs CRDTs over an encrypted WebSocket relay (card descriptions sync live across users; board-level presence shows who else is on the board)
- **Offline-first PWA** with IndexedDB snapshot cache
- **Authentication**: Argon2id passwords, TOTP 2FA, WebAuthn / Passkeys
- **Recovery key** instead of classic password reset (zero-knowledge means we *can't* email you a reset link — see [ADR 0004](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0004-recovery-key.md))
- **Webhooks** with HMAC-SHA256 signatures, persistent retry queue, dead-letter queue
- **Import**: Trello JSON, plain CSV. **Export**: native JSON, Markdown
- **Hardened deployment**: signed container (cosign keyless OIDC), CycloneDX + SPDX SBOMs, CSP / HSTS / COOP+COEP+CORP headers, systemd hardening profile

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Database | MariaDB 10.11+ via Prisma 7 (driver-adapter) |
| Real-time | Yjs CRDT + custom encrypted WebSocket relay |
| Cache + queue | Redis 7+ (rate-limiting, sessions, BullMQ) |
| Styling | Tailwind CSS 4 + MSK design tokens |
| Crypto | libsodium-wrappers (XChaCha20-Poly1305 + X25519) + argon2-browser (Argon2id KDF) |
| Validation | Zod 4 |
| Web server | Apache2 (reverse proxy) |
| Process manager | systemd or Docker |
| CI/CD | GitHub Actions |

---

## Where to go next

- [Installation](installation.md) — Self-host MSKanban on your own Debian/Ubuntu server (Docker or bare-metal)
- [Getting Started](getting-started.md) — First login, recovery key, creating your first board
- [Features](features.md) — Tour of boards, views, automation, real-time, presence
- [REST API](api.md) — Programmatic access for scripts and integrations
- [Privacy & Security](privacy.md) — What the server can and cannot see, threat model
- [FAQ](faq.md) — Common questions and troubleshooting

---

:::info
Questions or feedback? Join the [Discord](https://discord.gg/5hHSBRHvJE) or open an issue on [GitHub](https://github.com/MSK-Scripts/mskanban/issues).
:::
