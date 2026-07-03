---
title: Submissions & Review
sidebar_position: 4
---

# Submissions & Review

Once a form is live, submissions flow into the dashboard. This page covers the review workflow, statuses, the Kanban board, bulk actions, exports, and the live status loop.

---

## The status loop (applicant side)

Every submission gets a **private status page**:

```
https://forms.msk-scripts.de/s/<submission-id>
```

The submission ID is the capability — anyone with the link can view it; no login required. On that page the applicant sees:

- Their current **status** (e.g. Submitted → In review → Accepted).
- An **activity timeline** of status changes and any public messages reviewers sent.
- Their own answers.
- A **"Your data"** self-service section (see [GDPR self-service](#applicant-self-service-gdpr)).

The page is **live** — when a reviewer changes the status, it updates within moments without a refresh, over a WebSocket. If realtime is unavailable it still works, just not instant.

If the form limits applicants to [one active submission](form-builder.md#one-submission-per-person), reopening it while their submission is still open brings a signed-in applicant straight back to this page.

---

## The status pipeline

Submissions move through a status pipeline. The built-in statuses are:

| Status | Meaning |
|---|---|
| **Submitted** | Just arrived. |
| **In review** | A reviewer is looking at it. |
| **On hold** | Parked for now. |
| **Accepted** | Approved (terminal). |
| **Rejected** | Declined (terminal). |
| **Withdrawn** | The applicant pulled it (terminal). |

Built-in status labels are shown in the applicant's and reviewer's language.

### Custom statuses

Managers can define their own statuses on the **Statuses** page — each with a key, label, color, a "terminal" flag, and whether it's visible to the applicant. They slot into the pipeline alongside the built-ins.

---

## Reviewing a submission

Open a submission from the **Submissions** tab. The detail page shows every answer (files appear as download links). The review panel lets a reviewer:

- **Change the status** (built-in or custom). Tick **Hide this change from the applicant** to keep it internal: the applicant gets no DM and the change never shows on their status page, but the status still updates for your team and is recorded in the activity log.
- **Add an internal note** — visible only to the team, never to the applicant.
- **Send a public message** — appears on the applicant's status page and (if they logged in with Discord) is DM'd to them.

Every status change is one consistent operation, so it always triggers the applicant DM, any webhooks, automations, and the live update — no matter where it came from (web, Kanban, bulk, or a Discord button).

---

## The Kanban board

The **Board** tab is a Kanban view of submissions: columns are your statuses, cards are submissions. Drag — or use the **Move to** menu — to change a submission's status. Updates are optimistic and revert on error. It's reviewer-gated.

---

## Bulk actions

In the **Submissions** table, select multiple rows (or select-all) and apply a status change to all of them at once. You can filter the table by form first (when a server has more than one form). Bulk actions are reviewer-only.

---

## Archiving

Done with a submission but don't want to delete it? **Archive** it from the **Submissions** table (the action next to **Open**). Archived submissions drop out of the active list and the Board but are never deleted, files and all.

They live on a dedicated **Archived** page, reachable from the link above the Submissions table (it shows the archived count). There you can **Open** or **Restore** each one back to the active list. Archiving and restoring are reviewer actions and don't notify the applicant or change the submission's status.

---

## Exports

Export a form's submissions from the **Forms** list:

| Format | Plan |
|---|---|
| **CSV** | All plans |
| **XLSX** (Excel) | Pro+ |
| **JSON** | Pro+ |
| **PDF** | Pro+ |

Columns follow the form's field order; answers are formatted consistently across all formats. Exports are reviewer-only and rate-limited.

:::warning
An export is a plaintext copy of everything in those submissions, including personal data applicants entered. Keep the file secure and delete it when you're done.
:::

---

## Team & access

Roles decide who can do what in a guild:

| Role | Can do |
|---|---|
| **Owner / Admin** (managers) | Everything — build forms, configure bot/branding, manage the team, review. |
| **Reviewer** | Review submissions across **all** forms. |
| **Viewer** | The default for newly seen members — **no** data access until granted. |

There are two ways to let someone review:

- **Globally** — give them the **Reviewer** role.
- **Per form** — grant a Viewer access to specific forms only (the **Form access** checkboxes on the Team page).

Members appear automatically the first time they log in (as Viewer), or a manager can **add a member by Discord ID** ahead of time. Managers set roles and per-form grants on the **Team** page.

:::info[Member limits]
Free **2** / Pro **15** / Enterprise **unlimited**. The count includes managers, global reviewers, and anyone with a per-form grant. See [Plans & Limits](plans.md).
:::

---

## Applicant self-service (GDPR)

From their status page, an applicant can — using only the link, no login:

- **Withdraw** the submission (sets it to *Withdrawn*).
- **Export** their data as JSON.
- **Delete** the submission entirely, including any files they uploaded.

This satisfies the GDPR rights to access (Art. 15), portability (Art. 20), and erasure (Art. 17). See [Privacy & Security](privacy.md).

---

:::info
Next: [Discord Bot](discord-bot.md) — bring the review workflow into Discord.
:::
