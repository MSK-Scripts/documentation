---
title: Privacy & Security
sidebar_position: 9
---

# Privacy & Security

MSK Forms is a hosted application — submissions are stored so reviewers can read them and applicants can track their status. Unlike [MSKanban](../mskanban/index.md), it is **not** zero-knowledge: by design, a form's answers are readable by the guild's reviewers (and the operator who runs the infrastructure). This page is honest about what that means and how the data is protected.

---

## What data is stored

| Data | Why |
|---|---|
| Submission answers (incl. uploaded files) | So reviewers can review and applicants can see their own submission. |
| Discord identity for logged-in applicants & team (user ID, username, avatar, email, language) | Login, status DMs, team membership. |
| Guild data (name, settings, branding, bot config) | Running your forms and bot. |
| Submission & review events, status history | The activity timeline and audit log. |
| Notifications outbox | Delivering status DMs and webhooks. |

**Anonymous submissions** (public forms, no login) carry no Discord identity and get no DMs — only the submission link identifies them.

### Sensitive secrets are encrypted at rest

Secrets you enter for [per-guild integrations](branding-and-domains.md) — your Discord OAuth client secret and your Turnstile secret — are stored **encrypted** (AES-256-GCM) and never returned to the browser after saving.

---

## Applicant self-service (GDPR)

From their status page — using only the submission link, no login — an applicant can exercise their rights:

| Right | How |
|---|---|
| **Access (Art. 15)** | **Export** the submission as JSON. |
| **Portability (Art. 20)** | The same JSON export. |
| **Erasure (Art. 17)** | **Delete** the submission — the row is removed (cascade) and any uploaded files are deleted from storage. |
| Withdraw consent | **Withdraw** the submission (sets it to *Withdrawn*). |

Teams can also delete submissions and whole forms (which cascades to submissions and files).

---

## File uploads

File and image uploads are handled **server-proxied** for safety:

- The browser uploads to MSK Forms, which streams the file to private S3-compatible storage (MinIO) under a random key. The storage is **not** public — there are no public buckets or presigned URLs.
- Downloads go back through MSK Forms; the file is served as an **attachment** with `application/octet-stream` + `nosniff`, so a malicious HTML/SVG upload can't render in a victim's browser.
- Size and MIME limits are enforced server-side using the stored metadata, not the client's claim.
- **Logo uploads** are additionally re-encoded to WebP, stripping any hidden payload (see [Branding](branding-and-domains.md#logo)).

---

## Abuse protection

| Control | Detail |
|---|---|
| **Rate limiting** | The public submit endpoint is limited per IP (a fixed window via Redis). Upload and a few other public endpoints are limited too. |
| **Captcha** | Optional Cloudflare Turnstile on public forms — on by default on the primary domain, and per-guild on custom domains. |
| **Open-redirect & host validation** | Login / domain flows validate hosts and only allow relative redirect targets. |

---

## Transport & headers

Security headers are set by the app (and de-duplicated at the Apache reverse proxy):

```
Content-Security-Policy: nonce-based, 'strict-dynamic' (no inline scripts in production)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy: same-origin
```

The CSP is **nonce-based with `'strict-dynamic'`** — there are no inline scripts in production.

---

## Webhooks

Outgoing webhooks are **HMAC-SHA256 signed** with a per-webhook secret so the receiver can verify authenticity. See [Integrations & API](integrations-and-api.md#outgoing-webhooks).

---

## Who can read a submission

- **Anyone with the status link** — can view that one submission (the link is the capability) and use the self-service actions.
- **Reviewers** — can review the forms they're scoped to (globally via the Reviewer role, or per-form grants).
- **Managers** — full access within their guild.
- **Pure Viewers** with no grant — see no submission data at all.

A submission on a custom domain is only served from that domain's own guild.

---

:::info
Security finding? Please report it responsibly via the repository's security policy rather than a public issue: [github.com/MSK-Scripts/msk-forms](https://github.com/MSK-Scripts/msk-forms).
:::
