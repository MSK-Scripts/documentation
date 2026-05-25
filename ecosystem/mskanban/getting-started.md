---
title: Getting Started
sidebar_position: 3
---

# Getting Started

This page walks you through the **first ten minutes** with MSKanban: creating an account, understanding what makes the zero-knowledge model different, and getting to a working board.

If you haven't installed the server yet, see [Installation](installation.md) first.

---

## The zero-knowledge model in one minute

MSKanban is **not** a normal SaaS Kanban.

When you sign up:

1. Your browser derives a **Master Key** from your password using Argon2id (the same KDF Bitwarden uses).
2. The Master Key never leaves your browser. The server stores a separate **Auth Hash** derived from it, which can verify your password but cannot decrypt anything.
3. The Master Key encrypts a per-user Symmetric Key + an X25519 keypair. Those in turn encrypt your Workspace Keys, which encrypt your Board Keys, which finally encrypt card content.
4. When you log out or close the browser, the Master Key is wiped. To get back in you have to re-enter your password — there is **no other path** to your data.

The practical consequence: **a forgotten password = lost data**, unless you saved the recovery key. There is no "email me a reset link" button because the server has nothing to send you that would let it back in.

This is the same trade-off Bitwarden, Standard Notes and CryptPad make. It's not a bug.

---

## 1. Create the first account

Open your instance (e.g. `https://kanban.your-domain.com`) and click **Register**. You need:

- An email address (used for login notifications and the username — never published)
- A password of **at least 12 characters** (checked against the HaveIBeenPwned k-anonymity API client-side; pwned passwords are blocked)

After hitting "Create account", the browser runs Argon2id locally — this takes 1–3 seconds depending on your CPU. That's intentional: it's the same work an attacker would have to do for each password guess.

---

## 2. Save your Recovery Key

Immediately after registration you are shown a **24-word recovery phrase** (BIP39-style, English wordlist).

:::danger Write it down NOW.
This is the only fallback for a forgotten password. Lose it and your data is gone. The server can't help — it cannot recover it for you because it never had it.

**Do** store it in a password manager, on paper in a safe, or both.
**Don't** screenshot it into your phone gallery. Don't email it to yourself. Don't paste it into a chat.
:::

The recovery key encrypts an alternate copy of your User Symmetric Key on the server. If you ever forget your password, you go to the **Recover** page, type the 24 words, set a new password, and you're back in. The server only learns that someone successfully recovered — not the wordlist itself, which gets re-derived from the user input client-side.

---

## 3. Turn on 2FA (recommended)

In **Account → Security** you'll find two options:

- **TOTP** (Google Authenticator, Aegis, 1Password, …) — scan the QR code, enter the 6-digit code to confirm
- **WebAuthn / Passkeys** — works with any FIDO2 authenticator: hardware key, Touch ID, Windows Hello, mobile Passkey

Both can be enabled at the same time. The TOTP secret is stored on the server encrypted with `SERVER_ENCRYPTION_KEY` (not derived from your password), so it survives a password reset via recovery key.

:::tip Passkeys are the better default.
A YubiKey or platform authenticator means even a leaked password + recovery key won't get an attacker in. Set one up the first time you log in from a desktop browser.
:::

---

## 4. Create your first workspace + board

After the first login you land on an empty **Workspaces** screen.

1. Click **+ New workspace** and give it a name (e.g. *Personal*, *Acme Co*). The name is encrypted under your User Symmetric Key — the server never sees the plaintext.
2. Inside the workspace, click **+ New board**. The board comes pre-populated with three columns: *Backlog*, *In progress*, *Done*.
3. Drag-and-drop a placeholder card around to convince yourself it works. Then click **+ Add a card** to create your first real one.

Card titles and descriptions are encrypted under the **Board Key**, which itself is encrypted under your Workspace Key, which itself is encrypted under your User Key. See [Privacy & Security](privacy.md) for the full key hierarchy.

---

## 5. Invite teammates to a workspace

A workspace can have multiple members. Adding one is a four-step crypto dance under the hood, but the UI hides it:

1. In **Workspace settings → Members** click **+ Add member** and enter their email.
2. The server confirms the user exists and returns their X25519 **public key**.
3. Your browser uses that public key to **seal** a copy of the Workspace Key (NaCl Sealed Box — anonymous sender, only the holder of the matching private key can open it).
4. The sealed copy goes back to the server, which stores it on the new `WorkspaceMember` row.

Now the new member can open the workspace: their browser fetches the sealed blob, opens it with their User Private Key (decrypted from their own Master Key), and adds the Workspace Key to their in-memory key bundle.

The server **never** sees the Workspace Key in the clear. It only sees ciphertext addressed to each member individually.

---

## 6. Explore the views

Each board has five views — switch between them via the tab strip near the top right:

| View | When to use |
|---|---|
| **Board** (default) | Classic Kanban — drag cards between columns |
| **Calendar** | Cards with due dates as a month grid |
| **Timeline** | Gantt-style — cards as bars / diamonds, grouped by milestone |
| **Table** | Sortable / filterable list, good for bulk edits |
| **Analytics** | Cycle Time, Cumulative Flow, Throughput, Burn-Down |

All five views render from the same locally-decrypted dataset — switching tabs is instant and does not re-fetch from the server.

See [Features](features.md) for what each view does in detail.

---

## 7. Set up an automation rule

Scroll past the board to the **Automation rules** panel.

A simple first rule:

- **Trigger:** "When a card is moved"
- **Only when moved to column:** `Done`
- **Action:** "attach a label" → pick (or create first) a label like `closed`

Click **Create rule**. Now move a card to *Done* — the label appears automatically.

The rule body lives in `enc_rule` on the server (server can't read it). Only a small "trigger envelope" (`trigger_type=card_moved`, `trigger_meta={toColumnId:"col_done"}`) is server-visible, and even that is validated against a strict whitelist on write. See the [automation ADR](https://github.com/MSK-Scripts/mskanban/blob/main/docs/architecture/0010-automation-engine.md) for the architecture.

---

## 8. Real-time check

Open the same board in a second browser (or incognito window with a different account that's a member of the same workspace).

You should see:

- An **avatar stack** in the board header showing who else is on the board
- **Coloured dots** on a card when somebody else has its drawer open
- Card-description edits **sync live** between the two windows via Yjs CRDT

All of this happens over an encrypted WebSocket relay — the relay sees only ciphertext, even for presence updates.

---

## What's next

- [Features](features.md) — deeper look at views, milestones, automation, presence
- [REST API](api.md) — for scripts and integrations
- [Privacy & Security](privacy.md) — full key hierarchy, threat model, GDPR notes
- [FAQ](faq.md) — common questions ("I lost my recovery key, what now?", etc.)

---

:::info
Stuck on something? Open an [issue](https://github.com/MSK-Scripts/mskanban/issues) or join the [Discord](https://discord.gg/5hHSBRHvJE).
:::
