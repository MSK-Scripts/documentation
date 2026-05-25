---
title: Features
sidebar_position: 4
---

# Features

A tour of what MSKanban can do once you're past the [Getting Started](getting-started.md) basics.

---

## Workspaces, boards, columns, cards

The standard Kanban hierarchy:

```
Workspace
└── Board
    ├── Column (with optional WIP limit)
    │   └── Card
    │       ├── Title, Markdown description
    │       ├── Labels (coloured, named)
    │       ├── Assignees (workspace members)
    │       ├── Start date + Due date
    │       ├── Milestone (optional)
    │       ├── Checklists (multiple per card)
    │       ├── Comments (Markdown, @-mentions)
    │       ├── Attachments (encrypted blobs)
    │       └── Custom field values
    └── (Labels, Milestones, Templates, Automation rules, Webhooks)
```

Drag-and-drop works between columns and within a column. The keyboard sensor (per WCAG 2.1.1) lets you do the same with `Tab` + `Space` + arrow keys — try it.

---

## Five board views

All views render from the same locally-decrypted snapshot. Switching tabs is instant.

### Board (Kanban)
The default. Columns and cards, drag-and-drop, template picker per column.

### Calendar
Month grid keyed by `dueAt`. Cards without a due date are listed in a side panel.

### Timeline (Gantt)
Horizontal Gantt-style view grouped by milestone:

- Cards with **both `startAt` and `dueAt`** → range bar across the day window
- Cards with **only `dueAt`** → diamond marker on the due day
- Cards with **neither** → hidden, counted in the footer hint

Day / Week / Month zoom toggle, vertical "today" line, `←` / `→` to pan, `+` / `-` to zoom. Pure SVG renderer — no chart library.

### Table
Sortable / filterable list view. Click a column header to sort; type in the filter box to text-search across decrypted titles and descriptions.

### Analytics
Six built-in charts:

| Chart | What it shows |
|---|---|
| **Cycle Time** | Histogram of "time from first move out of Backlog to entering Done" per card |
| **Lead Time** | Histogram of "time from card creation to entering Done" |
| **Cumulative Flow Diagram (CFD)** | Stacked-area of column counts over time — reveals bottlenecks |
| **Throughput** | Cards per week entering Done |
| **Aging WIP** | Indicator of cards sitting too long in their current column |
| **Burn-Down per milestone** | Scope vs. remaining work vs. ideal line for a milestone window |

All computations run client-side from the decrypted activity feed. The server hosts metadata-only event rows; it doesn't know what's in the cards being counted.

---

## Labels

Each label has:

- A **colour** (server-visible — needed for filter / sort UI)
- An **encrypted name** (server stores ciphertext only)

Attaching a label to a card is a server-side row in `CardLabel` referencing both IDs. The IDs are opaque, so a server admin learns "card X has label Y" but not what Y *means*.

---

## Milestones

Milestones group cards into deliverables with an optional date window:

- **Server-visible**: board association, `startAt`, `endAt`, `archived` flag (needed by Timeline + Burn-Down)
- **Encrypted**: name, description

A card is linked to at most one milestone (`Card.milestoneId`, nullable). Milestone deletion is `onDelete: SetNull` — cards survive, the link drops.

Used by Timeline (group rows) and Analytics → Burn-Down (scope baseline).

---

## Card Templates

Save a card (title + description + checklists) as a board-wide template, then create new cards from it with one click. Useful for repeated work patterns (bug report, retro item, onboarding checklist, release checklist).

Templates are encrypted under the Board Key just like cards.

---

## Custom Fields

Per-board configurable fields. Six types:

- `text` — free-form string (encrypted)
- `number` — JSON-encoded number (encrypted)
- `date` — ISO date string (encrypted)
- `url` — URL (encrypted)
- `checkbox` — true/false (encrypted)
- `dropdown` — pick one of an admin-defined option list (the *list* lives encrypted in the field definition; the *value* is encrypted too)

Custom fields show in the card drawer below the description.

---

## Automation Rules

Declarative `{when, do}` rules per board. See [ADR 0010](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0010-automation-engine.md) for the architecture.

**v1 triggers (wired)**:
- `card_created`
- `card_moved`

**v1 actions** (all idempotent — running twice converges to the same state):
- `set_label`
- `assign_member`
- `move_to_column`

**Coming next**: `card_due_reached` (needs a BullMQ scheduler), `post_comment` + `emit_webhook` (need the Redis SETNX idempotency claim), `append_checklist`, plus drawer-side emitters for `card_label_added` and `comment_added`.

The rule body lives in `enc_rule` (server can't read it). A small plaintext trigger envelope (`trigger_type` + `trigger_meta`) is mirrored separately, validated against a strict whitelist on write, so the future scheduler can route ticks without breaking E2EE.

---

## Real-Time Collaboration

Two layers, both over the same encrypted WebSocket relay:

### Card description sync (Yjs CRDT)
Open the same card in two browser sessions — type in one, the other reflects within ~50 ms. Concurrent edits are CRDT-merged so neither side overwrites the other.

### Board presence (Yjs Awareness)
The board header shows an avatar stack of everyone currently on the board (max 5 + "+N more"). When somebody has a card drawer open, small coloured dots appear on that card in the kanban view.

Awareness payload is **`{userId, color, viewing?}` only** — no email, no card title, no description text. Colours are deterministic HSL hashes of `userId`, stable across reloads.

---

## Offline-First PWA

MSKanban registers a Service Worker and persists decrypted board snapshots to IndexedDB. Effect:

- A board you've opened before loads **instantly** on a flaky connection (cache hit, then refresh in the background)
- Card description drafts are persisted locally — closing the drawer doesn't lose unsaved work
- A board opens even fully offline, against the last snapshot

The IndexedDB store is keyed per user-id so account-switching on the same browser doesn't leak the previous user's data. On logout the store is wiped.

---

## Authentication

| Method | Server stores |
|---|---|
| Password | Argon2id-hashed AuthHash (m=64MB, t=3, p=4). The Master Key derived from the password never reaches the server. |
| TOTP | Secret encrypted with `SERVER_ENCRYPTION_KEY` (not the user's password — so it survives a recovery-key reset) |
| WebAuthn / Passkeys | Public key + credential ID. The private half lives in the authenticator. |
| Recovery Key | An alternate `encRecoveryBlob` of the User Symmetric Key, encrypted under a key derived from the recovery phrase. |

Brute-force protection: per-IP + per-user exponential backoff, account lockout after 10 failed attempts (15-minute window).

Sessions are HttpOnly + Secure + SameSite=Strict cookies, 30-minute idle timeout, sliding-window refresh. WebSocket connections use single-use tickets fetched via the cookie session.

---

## Webhooks

Per-board configurable. Events: card created / moved / deleted, comment added, assignment, label added, …

Each delivery is:

- HMAC-SHA256-signed with a per-webhook secret (returned **once** at creation — never re-displayed)
- Retried with exponential backoff (up to 24 h)
- Routed through a **dead-letter queue** if all retries fail; the UI lets you inspect failures and one-click requeue
- SSRF-guarded (no private IP ranges, no link-local)

Payloads carry **metadata only** — `{verb, cardId, actorId, timestamp}`. They do **not** contain card titles or descriptions. To get content, the receiver has to be a workspace member and decrypt it through the regular API.

---

## Import / Export

### Import
- **Trello JSON** — boards, lists, cards (with descriptions, labels, due dates)
- **CSV** — flexible columns, mapped to title/description/dueAt/columnName

### Export
- **Native JSON** — complete board snapshot, restorable
- **Markdown** — human-readable, one file per board

:::warning
**Exports leave the encrypted boundary.** A JSON export is a plaintext copy of everything the user could already see. The UI warns and asks for confirmation before downloading — keep the file secure.
:::

---

## API

A REST API mirrors most UI actions. Useful for CLI tools, scripts, CI/CD integrations.

See the [API reference](api.md).

---

## Accessibility

Built to WCAG 2.1 AA:

- Full keyboard navigation including drag-and-drop alternative
- Screen-reader optimisations: `aria-*`, semantic HTML, live regions for board updates
- `prefers-reduced-motion` respected
- Contrast ratios verified
- Focus rings on every interactive element

---

## Internationalisation

UI ships with **German** and **English**, switched via a cookie. Adding a locale is a `messages/<lang>.json` file plus `next-intl` registration — see the project README for the pattern.

The crypto layer is locale-independent.
