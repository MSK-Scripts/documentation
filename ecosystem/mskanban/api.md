---
title: REST API
sidebar_position: 5
---

# REST API

Programmatic access for scripts, CLI tools, and integrations.

:::tip
The API surfaces **metadata and ciphertext** — it does not expose plaintext. To work with card content programmatically you need to implement the [crypto layer](privacy.md#key-hierarchy) client-side and present the right Workspace / Board Key. A small example CLI is on the roadmap; until then, the test fixtures under `tests/integration/` in the source repo are the best reference.
:::

---

## Base URL & auth

- **Base URL**: `https://kanban.your-domain.com/api`
- **Auth**: session cookie. Log in once via `POST /api/auth/login` (browser does it on the login page), then reuse the resulting `Set-Cookie` for subsequent calls. The cookie is `HttpOnly` + `Secure` + `SameSite=Strict`.

For CLI use without a browser, the recommended pattern is a long-lived session via curl-with-cookies:

```bash
# 1. Log in (returns a Set-Cookie that you save)
curl -c cookies.txt -b cookies.txt -X POST \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","authHash":"...","totp":"123456"}' \
  https://kanban.your-domain.com/api/auth/login

# 2. Reuse cookies.txt on every subsequent call
curl -b cookies.txt https://kanban.your-domain.com/api/me
```

:::warning
`authHash` is the Argon2id-derived auth hash, **not** the plaintext password. Deriving it without a browser requires the same Argon2id parameters MSKanban uses (m=64MB, t=3, p=4) plus the per-user salt returned by `POST /api/auth/login-init`. There is no "send the raw password" shortcut — that's the whole point of the zero-knowledge layer.
:::

---

## Conventions

- **Content-Type**: `application/json` for request and response bodies
- **Error shape**:
  ```json
  { "error": { "code": "BAD_REQUEST", "message": "human-readable" } }
  ```
- **Encrypted fields** are always strings of the form `v1.<nonce>.<ciphertext>` (Base64url-encoded). They round-trip unchanged through the API — the server never touches them
- **IDs** are CUIDs (`c…`), opaque, URL-safe, ≤ 64 chars
- **Timestamps** are ISO 8601 with offset (`2026-05-25T12:34:56.789Z`)

---

## Endpoint reference

The full surface is ~56 routes. The OpenAPI 3.1 spec lives in the project repo at [`docs/api/openapi.yaml`](https://github.com/MSK-Scripts/mskanban/blob/main/docs/api/openapi.yaml) and is the authoritative reference. The table below is a curated index.

### Auth

| Method | Path | Notes |
|---|---|---|
| `POST` | `/auth/register` | Create account with `{email, authHash, publicKey, encPrivateKey, encSymmetricKey, encRecoveryBlob}` |
| `POST` | `/auth/login` | `{email, authHash, totp?}` → session cookie |
| `POST` | `/auth/logout` | Invalidate current session |
| `POST` | `/auth/recovery` | Recovery-key-based reset |
| `POST` | `/auth/2fa/enroll` | Generate TOTP secret |
| `POST` | `/auth/2fa/verify` | Confirm enrollment |
| `POST` | `/auth/2fa/disable` | Remove TOTP |
| `POST` | `/auth/webauthn/register` | Begin WebAuthn registration |
| `POST` | `/auth/webauthn/verify` | Finish WebAuthn registration |
| `POST` | `/auth/ws-ticket` | One-shot ticket for the WebSocket relay |

### Self

| Method | Path | Notes |
|---|---|---|
| `GET` | `/me` | Current user + workspace memberships |
| `GET` | `/me/export` | GDPR Art. 15 export (encrypted blobs + metadata) |
| `DELETE` | `/me` | GDPR Art. 17 delete — crypto-shreds keys immediately, hard-delete after 30 days |
| `GET` | `/me/notifications` | Recent assignment / mention notifications |

### Workspaces

| Method | Path | Notes |
|---|---|---|
| `GET / POST` | `/workspaces` | List own / create |
| `GET / PATCH / DELETE` | `/workspaces/:id` | |
| `GET / POST` | `/workspaces/:id/members` | List / invite (with `{userId, encWorkspaceKey}` sealed for the invitee) |
| `DELETE` | `/workspaces/:id/members/:userId` | Remove member |

### Boards, columns, cards

| Method | Path | Notes |
|---|---|---|
| `GET / POST` | `/workspaces/:wsId/boards` | List / create boards in a workspace |
| `GET / PATCH / DELETE` | `/boards/:id` | |
| `GET / POST` | `/boards/:id/columns` | List / create columns |
| `PATCH / DELETE` | `/columns/:id` | Edit / delete column |
| `POST` | `/columns/:id/cards` | Create card |
| `GET` | `/boards/:id/cards` | List cards on a board |
| `GET / PATCH / DELETE` | `/cards/:id` | |
| `PATCH` | `/cards/:id/move` | `{toColumnId, beforeCardId?, afterCardId?}` |
| `POST / DELETE` | `/cards/:id/labels` | Attach / detach (idempotent) |
| `POST` | `/cards/:id/assignments` / `/cards/:id/assignments/:userId` | Assign / unassign |
| `PUT` | `/cards/:id/milestone` | `{milestoneId\|null}` |
| `POST` | `/cards/:id/comments` | Create comment |
| `POST / GET` | `/cards/:id/attachments` | Upload / list attachments |

### Labels, milestones, templates, custom fields

| Method | Path | Notes |
|---|---|---|
| `GET / POST` | `/boards/:id/labels` | |
| `PATCH / DELETE` | `/labels/:id` | |
| `GET / POST` | `/boards/:id/milestones` | `?archived=1` includes archived |
| `PATCH / DELETE` | `/milestones/:id` | |
| `GET / POST` | `/boards/:id/card-templates` | |
| `DELETE` | `/card-templates/:id` | |
| `GET / POST` | `/boards/:id/custom-fields` | |
| `PATCH / DELETE` | `/custom-fields/:id` | |

### Comments, checklists

| Method | Path |
|---|---|
| `PATCH / DELETE` | `/comments/:id` |
| `GET / POST` | `/cards/:id/checklists` |
| `PATCH / DELETE` | `/checklists/:id` |
| `POST` | `/checklists/:id/items` |
| `PATCH / DELETE` | `/checklist-items/:id` |

### Automations, webhooks

| Method | Path |
|---|---|
| `GET / POST` | `/boards/:id/automations` |
| `PATCH / DELETE` | `/automations/:id` |
| `GET / POST` | `/boards/:id/webhooks` |
| `PATCH / DELETE` | `/webhooks/:id` |
| `GET` | `/webhooks/:id/deliveries` |
| `POST` | `/webhooks/deliveries/:id/requeue` |

### Live + health

| Method | Path | Notes |
|---|---|---|
| `GET` | `/health` | Liveness/readiness — `{ok, db, redis}` |
| `GET` | `/boards/:id/live` | Server-Sent Events stream of board ticks |
| `GET` | `/boards/:id/activity` | Activity feed (metadata only) |

### WebSocket relay

Not an HTTP endpoint — a WebSocket upgrade on `/api/ws` (or directly on port 3001 in dev):

```
ws://… /api/ws?t=<ticket>
```

Two room kinds:

- `card:<id>` — Yjs Y.Doc for the card description
- `board:<id>` — Yjs Awareness for board-level presence

Every payload is XChaCha20-Poly1305 ciphertext under the Board Key. The relay never decrypts — it just routes by room name.

---

## Rate limits

Default sliding-window limits (configurable via env):

| Group | Limit |
|---|---|
| `POST /auth/login` | 10/IP/minute + per-account exponential backoff after 3 failures |
| `POST /auth/register` | 5/IP/hour |
| Card / column / board mutations | 60/user/minute |
| Read-only endpoints | 600/user/minute |

A breached limit returns `429 Too Many Requests` with a `Retry-After` header.

---

## Webhooks (outbound)

Configure per board via the UI or `POST /api/boards/:id/webhooks`. Payload shape:

```json
{
  "verb": "CARD_MOVED",
  "boardId": "c...",
  "cardId": "c...",
  "actorId": "c...",
  "timestamp": "2026-05-25T12:00:00.000Z",
  "metadata": { "fromColumnId": "c...", "toColumnId": "c..." }
}
```

Headers on each delivery:

```
X-MSKanban-Event: CARD_MOVED
X-MSKanban-Delivery-Id: <ulid>
X-MSKanban-Signature: t=<unix>,v1=<hmac-sha256-hex>
```

Verify the signature with HMAC-SHA256 over `<t>.<body>` using the webhook secret. The `t` value is also in the signature header to prevent replay — reject requests with a `t` more than 5 minutes from now.

Retries on `5xx` / network error follow an exponential schedule: 30 s, 2 min, 10 min, 1 h, 6 h, 24 h. Anything still failing after 24 h moves to the dead-letter queue.

---

## OpenAPI

The full spec is at [`docs/api/openapi.yaml`](https://github.com/MSK-Scripts/mskanban/blob/main/docs/api/openapi.yaml) in the project repo. Load it in any OpenAPI viewer (Swagger UI, Stoplight, Insomnia) for an interactive reference.
