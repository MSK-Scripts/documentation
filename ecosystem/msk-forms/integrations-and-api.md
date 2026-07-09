---
title: Integrations & API
sidebar_position: 7
---

# Integrations & API

MSK Forms connects to the rest of your stack through outgoing webhooks, Zapier / Make, and a REST API.

---

## Outgoing webhooks

:::note[Pro feature]
Webhooks require a [Pro](plans.md) subscription.
:::

Register endpoints that receive a POST when something happens. Manage them on **Dashboard → your server → Webhooks** (manager-only).

**Events:**

- `submission.created`
- `submission.status_changed`

**Delivery format:** each endpoint is one of two formats.

- **Generic JSON** — the full submission as a JSON body, HMAC-SHA256 signed with a per-webhook secret (sent as `X-MSK-Signature: sha256=…`, alongside `X-MSK-Event`). Use this for your own integrations. Verify it by recomputing the HMAC over the raw request body with your secret and comparing it to the header.
- **Discord webhook** — paste a Discord channel webhook URL (Server Settings → Integrations → Webhooks) and MSK Forms posts each event there as a formatted embed (applicant, status, score, answers). This works for **any** Discord server, including ones the bot is not in, so you can log submissions into an external channel. No signature is used (Discord does not verify one).

**Form scope:** each webhook can target **all forms** (default) or a **single form**. Scope it to one form to route that form's submissions to their own endpoint or Discord channel.

**Delivery:** deliveries are queued (an outbox) and drained by the bot every 15 seconds, with retry + backoff up to 6 attempts before being marked failed. Generic-JSON payloads are **hydrated** at delivery time with the full submission: form metadata, status, score, applicant, and formatted answers. Each endpoint shows its **last delivery outcome** (delivered, failed with the error, or pending) on the Webhooks page, so a hook that isn't firing can be diagnosed.

:::tip[Logging to Discord]
When pasting a Discord channel webhook URL, set the format to **Discord webhook**. Leaving it on Generic JSON sends a signed body that Discord rejects, so nothing is logged.
:::

---

## Zapier & Make

:::note[Enterprise feature]
The integration REST hooks require an [Enterprise](plans.md) subscription and an API key.
:::

Zapier and Make connect through a REST-hook layer on top of the webhook infrastructure, authenticated with an API key (Bearer token).

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/me` | Connection / auth test (the "Connect" step). |
| `POST /api/v1/hooks` | Subscribe — creates a hook, returns its `id`. |
| `GET /api/v1/hooks` | List your hooks. |
| `DELETE /api/v1/hooks/{hookId}` | Unsubscribe (idempotent, guild-scoped). |

Subscribed hooks receive the same hydrated payloads as manual webhooks. Both platforms already work through their generic REST-hook / custom-API flows; a published Zapier app may follow.

---

## REST API

:::note[Enterprise feature]
The REST API requires an [Enterprise](plans.md) subscription.
:::

### API keys

Create and manage keys on **Dashboard → your server → API** (manager-only; creating a key is Enterprise-gated). The secret is shown **once** on creation — store it then; only a hash is kept. Keys are prefixed `mskf_`.

```
Authorization: Bearer mskf_xxxxxxxxxxxxxxxxxxxx
```

Each key is scoped to its guild and rate-limited. Downgrading from Enterprise revokes API access automatically.

### Endpoints

| Endpoint | Returns |
|---|---|
| `GET /api/v1/me` | Auth check + your guild context. |
| `GET /api/v1/forms/{formId}/submissions` | All submissions for a form (scoped to the key's guild), as JSON: `{ form, count, submissions }`. |
| `POST` / `GET` / `DELETE /api/v1/hooks` | Manage REST hooks (see [above](#zapier--make)). |

Example:

```bash
curl -H "Authorization: Bearer mskf_xxxxxxxxxxxx" \
  https://forms.msk-scripts.de/api/v1/forms/<formId>/submissions
```

---

:::info
Next: [Plans & Limits](plans.md) — which features each tier includes.
:::
