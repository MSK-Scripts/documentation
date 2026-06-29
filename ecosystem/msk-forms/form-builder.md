---
title: Form Builder
sidebar_position: 3
---

# Form Builder

The builder lives at **Dashboard → your server → Forms → New form** (or **Edit** on an existing form). This page is the complete tour of what it can do.

Only **managers** (owner / admin) can create and edit forms. Reviewers can see them read-only.

---

## Fields

Click **Add field** to open the field picker — an icon grid of every available type. Pick one and it's inserted; then set its label, description, placeholder, and whether it's **required**.

### Text & contact

| Type | Notes |
|---|---|
| **Short text** | Single line. Optional min/max length and regex pattern. |
| **Long text** | Multi-line textarea. |
| **Email** | Validated as an email address. |
| **URL** | Validated as a URL. |
| **Password** | Masked input (e.g. an access code an applicant should type). |
| **Number** | Numeric, with optional min / max. |
| **Phone** | Country dial-code selector (flag + code) plus a digits-only field; stored as `+<dial> <number>`. |

### Choices

| Type | Notes |
|---|---|
| **Single choice** | Radio buttons, one answer. |
| **Multiple choice / Multi-select** | Checkboxes, zero or more answers. |
| **Dropdown** | A select menu — good for long option lists. |
| **Yes / No** | A boolean toggle. |
| **Consent** | A single checkbox (e.g. "I agree to the rules"). |
| **Age check** | A single checkbox confirmation. |

Each choice option can carry a **points** value for [scoring](#quiz--scoring).

### Date & time

| Type | Notes |
|---|---|
| **Date** | Styled calendar popover (not the native browser picker). |
| **Time** | Styled hour / minute selector. |
| **Date & time** | Combined. |

### Ratings

| Type | Notes |
|---|---|
| **Star rating** | 1–N stars (default 5). |
| **NPS** | Fixed 0–10 buttons. |
| **Emoji scale** | 1–5 emoji buttons. |
| **Slider** | Min / max / step (default 0–100). |

### Rich inputs

| Type | Notes |
|---|---|
| **File upload** | Any file, with a size and MIME limit. Stored securely (see [Privacy](privacy.md#file-uploads)). |
| **Image upload** | Same as file upload, restricted to images. |
| **Signature** | A canvas the applicant draws on; saved as a PNG via the upload pipeline. |
| **Matrix** | A grid — rows × columns, one choice per row. |
| **Calculated** | A read-only field derived from other answers — see [Calculated fields](#calculated-fields). |

### Layout blocks

Non-input blocks for structure — headings, descriptive text, dividers. They never count as answers and are never required.

### Change a field's type

Picked the wrong type, or want to turn a short-text question into a dropdown? Use the **type selector** at the top of any field card to switch it in place. The field keeps its label, help text, position, and conditional logic; type-specific settings that no longer apply are reset (a note warns you when that happens). Options and matrix rows are kept when the new type also uses them (e.g. single choice to dropdown). Existing answers are never touched.

---

## Multi-step pages

A form is a list of **pages**. With one page it's a single screen; add more and the builder renders a **multi-step** form with **Next / Back** buttons and a progress bar.

- Add, remove, reorder, and title pages in the builder.
- Each page validates its own required fields before **Next** advances.
- A page whose fields are all hidden by [conditional logic](#conditional-logic) is automatically skipped.

---

## Conditional logic

Every field can carry rules that react to other answers. A rule has an **action**, a **target field**, an **operator**, and a **value**:

- **Actions:** show the field, hide it, make it required, or **jump to a page** (`skip to`).
- **Operators:** equals, not equals, contains, greater than, less than, is empty, is not empty, … (8 in total).

Hidden fields are never validated and never required — visibility, progress, and validation all follow the same resolved path. Combined with `skip to`, you can branch the flow: *"if you picked **Staff**, jump to page 3."*

---

## Scheduling

Each form can have an optional **open / close window**:

- **Opens at** — before this time the form shows "Opens \<time\>" and rejects submissions.
- **Closes at** — after this time it's closed. Within the last 24 hours before closing it shows an **"Ending soon"** banner.

Times are shown in each viewer's local timezone. Closed forms drop out of the public index automatically.

---

## Quiz & scoring

Give choice options a **points** value and MSK Forms scores each submission automatically:

- The score is the sum of points across the chosen options, computed **server-side** (the client preview is never trusted).
- Forms where no option has points stay score-less — nothing changes for non-quiz forms.
- The score shows in the submissions table and on the submission detail page.
- The score is also available to [automations](#automations) under the reserved field **Score** — e.g. *"if Score ≥ 80 → Accepted"* for auto-acceptance.

---

## Calculated fields

A **Calculated** field derives its value from other answers with a formula:

- **Syntax:** `{fieldId}` placeholders plus `+ - * / ( )` and numbers — e.g. `{price} * {qty}`.
- **Reference resolution:** Number/Rating → the value; Single choice → the option's score; Multi-select → the sum; booleans → 1 / 0; empty/unknown → 0.
- The value is **computed server-side** and stored with the answers — the client preview is never authoritative.
- It renders as a read-only live preview; it's never editable or required.

In the builder you write the formula in a textarea and click chips to insert referenceable fields.

---

## A/B testing

:::note[Pro feature]
A/B testing requires a [Pro](plans.md) subscription.
:::

Split-test a form's copy:

- Define **variants** in the builder — each with a name, a weight, and optionally an overriding title and/or description.
- The public page assigns a variant **stickily** (a cookie, otherwise weighted-random) and shows that variant's copy.
- **Views** are tracked on mount; **conversions** are tracked when the form is submitted with that variant.
- A **results page** (per form) shows Views / Submissions / Conversion-% and marks the leader once a variant has ≥ 10 views.

---

## Automations

:::note[Pro feature]
Automations require a [Pro](plans.md) subscription.
:::

Per-form **when-then rules**. On submission, the first rule whose conditions **all** match is applied:

- **Conditions** use the same field-condition form and operators as conditional logic, AND-combined (an empty condition set always matches).
- **Action (v1):** set the submission to a target status.

Because the action runs through the same status-change path as a manual review, it cascades everywhere: the status event, the applicant DM, webhooks, and the live status page. The classic use case is **auto-acceptance**: *"if Score ≥ 80 → Accepted"*, which (with an accepted role configured) also hands out the Discord role.

---

## Per-form overrides

Some guild-wide settings can be overridden on a single form:

- **Review channel** — post this form's new-submission embeds to a specific channel instead of the guild default.
- **Accepted role(s)** — grant these role(s) on acceptance instead of (or in addition to) the guild default. Multiple roles are supported (comma-separated).

See [Discord Bot](discord-bot.md) for how these drive the review workflow.

---

## Categories

Group your forms into **categories** — e.g. *In-game jobs* vs *Staff applications*. Manage them under **Dashboard → your server → Categories** (managers only): add, rename, recolor, and reorder. Then pick a category for each form in the builder.

Categories drive the grouping on your **public form hub** — applicants see your forms split into sections, with uncategorized forms under *Other forms*. See [Branding & Custom Domains → Public form hub](branding-and-domains.md#public-form-hub).

---

## Import & export (JSON)

:::note[Pro feature]
Importing and exporting a form definition requires a [Pro](plans.md) subscription.
:::

Move a form between servers, keep a backup, or reuse a template:

- **Export** — download a form's definition (its structure and settings, not its submissions) as a JSON file from the Forms list.
- **Import** — upload a JSON file as a **new form**, or **replace** an existing form's content from a file. Imported as new, the slug is reused (and de-duplicated if already taken); on replace, the form keeps its current public link. The form's category travels with the file by name and is recreated on the target server if missing.

---

## Saving & going live

- **Save** stores the form as a draft.
- Set the **status to Live** to start accepting submissions (subject to any [schedule](#scheduling)).
- **Delete** removes a form and its submissions (cascade), including any uploaded files.

**Preview before you publish.** Every form has a **Preview** action (managers, opens in a new tab) that renders the exact public form — branding, multi-step flow, all field types — for any status, including drafts. Preview validates and lets you walk the pages like the real thing, but never submits.

:::tip[Free plan limit]
The Free plan allows up to **3 forms** per server, and Pro features (CSS, automations, A/B, custom domain) are stripped or gated for Free guilds. See [Plans & Limits](plans.md).
:::

---

:::info
Next: [Submissions & Review](submissions-and-review.md) — what happens after applicants hit submit.
:::
