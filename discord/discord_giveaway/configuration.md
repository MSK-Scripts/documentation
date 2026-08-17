---
title: Configuration
description: Per-server settings
sidebar_position: 3
---

## 🛠️ Configuration

Every server configures the bot **independently** — there are no config files to edit. All settings are managed in Discord with `/gsettings`, gated behind the native **Manage Server** permission.

- `/gsettings show` — display the current configuration
- `/gsettings set <option> …` — set or add a value
- `/gsettings remove <option> …` — remove or clear a value

Settings take effect immediately and apply to all future giveaways on that server.

> **set vs. remove:** `set` adds a role to a list (blacklist/whitelist) or sets a single value (manager/notify/bonus); `remove` takes it back out. The `log` channel is the exception — `set log` toggles it (running it again with the same channel clears it).

:::tip[Configure in the browser]
All of these settings can also be edited from the [**Web Dashboard**](./getting-started.md#-web-dashboard) (Discord login) — handy for picking roles and channels from a list instead of typing IDs.
:::

---

## ⚙️ Options

### `/gsettings set …`

| Option | Value | Default | Description |
|---|---|---|---|
| `lang <value>` | `en` · `de` · `fr` · `es` | `en` | UI language of the bot for this server |
| `color <value>` | `#RRGGBB` | `#00e676` | Embed accent colour |
| `emoji <value>` | any emoji | 🎉 | Emoji on the entry button |
| `button <value>` | `PRIMARY` · `SECONDARY` · `SUCCESS` · `DANGER` | `PRIMARY` | Entry button style |
| `blacklist <role> [giveaway_id]` | role (+ optional ID) | — | Members with this role **cannot** enter |
| `whitelist <role> [giveaway_id]` | role (+ optional ID) | — | If any whitelist role is set, members need **at least one** to enter |
| `bonus <role> <amount> [giveaway_id]` | role + `1`–`100` (+ optional ID) | — | Extra entries granted to a role for a weighted draw |
| `minaccount <days>` | `0`–`3650` | `0` (off) | Minimum Discord **account age** in days to enter |
| `minmember <days>` | `0`–`3650` | `0` (off) | Minimum **server membership** in days to enter |
| `manager <role>` | role | — | Role allowed to manage giveaways without *Manage Server* |
| `notify <role>` | role | — | Role pinged when a giveaway is created |
| `log <channel>` | channel | — | Channel that receives giveaway audit logs (toggle) |
| `reminder <minutes>` | `0`–`1440` | `0` (off) | Post an "ending soon" reminder *N* minutes before a giveaway ends |
| `claim <text>` | text | — | Instructions added to the winner DM (e.g. how to claim the prize) |

### `/gsettings remove …`

| Option | Value | Description |
|---|---|---|
| `blacklist <role> [giveaway_id]` | role (+ optional ID) | Remove a role from the blacklist |
| `whitelist <role> [giveaway_id]` | role (+ optional ID) | Remove a role from the whitelist |
| `bonus <role> [giveaway_id]` | role (+ optional ID) | Remove the bonus entries for a role |
| `manager <role>` | role | Clear the manager role |
| `notify <role>` | role | Clear the notify role |
| `claim` | — | Clear the winner-DM claim instructions |
| `conditions <giveaway_id>` | giveaway ID | Drop a giveaway's own conditions so the server settings apply to it again |

---

### Per-giveaway blacklist / whitelist / bonus

`blacklist`, `whitelist` and `bonus` (both `set` and `remove`) accept an **optional `giveaway_id`**:

- **Without** `giveaway_id` → applies to the **server-wide** setting (all giveaways).
- **With** `giveaway_id` → applies **only to that one giveaway**, and what a giveaway carries **replaces** the server-wide setting for it.

Each of the three stands on its own: a giveaway can bring its own blacklist and still follow the server-wide bonus entries. A giveaway that carries nothing of its own follows the server settings, including later changes to them.

Changing a single role on a giveaway that has nothing of its own **copies the server-wide list first** and then applies the change, so `set blacklist role:@Muted giveaway_id:…` adds a role instead of switching all the others off. To go the other way — one giveaway *without* a server-wide rule — take the role out with `remove`, or clear the list in the dashboard. `remove conditions giveaway_id:<ID>` puts the giveaway back to following the server settings entirely.

The same three settings are available in the **web dashboard** without an ID: the create form and the edit form of a running giveaway both carry an *Entry conditions for this giveaway* block, prefilled with the server settings, so what the form shows is what will apply.

```text
/gsettings set blacklist role:@Muted                          → blocked on every giveaway
/gsettings set whitelist role:@VIP giveaway_id:A1B2C3         → only giveaway A1B2C3 requires @VIP
/gsettings set bonus role:@Booster amount:3 giveaway_id:A1B2C3 → @Booster gets +3 in A1B2C3, whatever the server setting says
/gsettings remove blacklist role:@Muted giveaway_id:A1B2C3    → @Muted may enter this one giveaway
/gsettings remove conditions giveaway_id:A1B2C3               → back to the server settings
```

---

### Button Styles

| Value | Appearance |
|---|---|
| `PRIMARY` | Blurple |
| `SECONDARY` | Grey |
| `SUCCESS` | Green |
| `DANGER` | Red |

---

### Eligibility Rules

Several options combine to decide who may enter a giveaway:

- **Blacklist** — members holding a blacklisted role cannot enter. The giveaway's own list applies if it has one, otherwise the server-wide list.
- **Whitelist** — if one or more whitelist roles are configured, a member must hold **at least one** of them. With no whitelist set, everyone may enter (subject to the other rules).
- **Minimum account age** (`minaccount`) — rejects accounts younger than *N* days. `0` disables the check.
- **Minimum server membership** (`minmember`) — rejects members who joined less than *N* days ago. `0` disables the check.

All rules are checked both when a member presses the entry button **and** again when winners are drawn.

---

### Bonus Entries (Weighted Draw)

`set bonus <role> <amount>` grants members of a role **additional entries** (1–100), increasing their chance of winning. This stacks for members who hold several bonus roles. Use `remove bonus <role>` to take it away again.

Add an optional `giveaway_id` to scope a bonus to **one giveaway only** — the bonus entries of that giveaway then apply **instead of** the server-wide ones.

Bonus roles are also editable in the **web dashboard**: server-wide in the *Settings* tab, per giveaway in the create form and when editing a running giveaway. Whatever is configured is shown to everyone in the giveaway message, see [Bonus entries in the embed](#bonus-entries-in-the-embed).

---

### Manager Role

By default, only members with the **Manage Server** permission can run the manager commands (`/gcreate`, `/gend`, …). Setting a `manager` role lets you delegate giveaway control to that role **without** granting them *Manage Server*. Both *Manage Server* and the manager role always work. Use `remove manager <role>` to clear it.

---

### Notify Role & Logging

- **Notify role** — pinged once when a new giveaway is created. The bot restricts its pings to this role only (no `@everyone`). The role must be mentionable by the bot. Clear it with `remove notify <role>`.
- **Log channel** — when set, the bot posts an audit entry for every giveaway event (created, ended, rerolled, cancelled, …) to this channel.

---

### Winner DMs & Reminders

- **Winner DMs** — when a giveaway ends (or a winner is rerolled), each winner automatically receives a direct message with the prize, the configured **claim instructions** (`set claim <text>`) and a link to the giveaway. If the giveaway hands out [one prize per winner](./commands.md#multiple-prizes), the DM names only that winner's own prize. If a winner has DMs disabled, it is silently skipped.
- **"Ending soon" reminder** — `set reminder <minutes>` makes the bot post a reminder in the giveaway channel that many minutes before the end (pinging the notify role if configured). `0` disables it. The reminder also re-schedules itself when you extend a giveaway with `/gextend`.

---

### Eligibility requirements in the embed

Whenever a giveaway has eligibility rules (required/blocked roles, minimum account age or membership), they are listed in a **Requirements** field on the giveaway embed, so members can see at a glance whether they qualify.

Changing any of these settings later updates the message of every running giveaway. Settings that appear in no embed (log channel, manager role, reminder, claim text) leave the messages untouched.

---

### Bonus entries in the embed

Configured bonus roles get their **own field** on the giveaway embed, listing each role with its extra entries and a line explaining what that means. The field shows what actually applies to this giveaway: its own bonus entries if it has any, otherwise the server-wide ones.

It is deliberately kept out of the *Requirements* field: a bonus blocks nobody, it only improves the odds, and listed among the requirements it would read like another hurdle. With no bonus roles configured, the field does not appear at all.

---

### Tebex Winner Coupons

Every winner can automatically receive a **personal discount code** for **your own Tebex store** by DM. The bot is not tied to any particular shop: each server connects its own store.

**Setting up the store (web dashboard → *Tebex store*)**

This section is visible to the **server owner only**, not to administrators. A Tebex plugin secret is unscoped full access to your shop, so it is deliberately kept in one pair of hands.

| Field | What it is |
|---|---|
| Plugin secret | From your Tebex creator panel. Checked against Tebex before it is saved, so a typo fails immediately instead of weeks later. |
| Public token | The public Headless token of your store. Only used to list your packages in the dropdown. |
| Store address | Where winners redeem the code. Appears as a link in the winner DM. |

The secret is stored **encrypted** (AES-256-GCM) and the key lives outside the database. The dashboard shows only the last four characters and the date it was set; you can reveal the full value with an explicit click, or remove it at any time.

**Configuring a coupon (per giveaway)**

In the dashboard, when creating or editing a giveaway:

- **Discount %**: 1 to 100. Leave empty for no coupon.
- **Valid for (days)**: leave empty and the code never expires.
- **Limited to packages**: pick one or more packages, or select none to discount the whole cart.

Coupons are configured in the **web dashboard only**; the `/gcreate` modal is already at Discord's limit of five fields.

#### A different package per winner

If the giveaway hands out [one prize per winner](./commands.md#multiple-prizes), the dashboard shows an extra package selector **per prize**. That is how you give the winner of "Script A" a discount on Script A and the winner of "Script B" one on Script B.

| Selection | Result |
|---|---|
| Packages picked for that prize | the winner's code is limited to those packages |
| That prize left empty | the winner falls back to the shared selection above |
| Both empty | the code discounts the whole cart |

Two things follow from the selector being tied to the prize slot:

- **It only exists in "one prize per winner" mode.** When everyone gets all prizes there is no "winner 2" to point at: the draw order is arbitrary and shown nowhere, so a per-winner package would be a promise the bot cannot keep.
- **Reordering the prize list moves the package selections with the position, not with the text.** If you swap two lines, swap their packages too. A single reroll is safe: the replacement inherits the slot of the winner it replaces, and therefore that slot's packages.

#### Codes from someone else's shop

Running a giveaway together with another creator? Their coupon codes cannot be generated by the bot, it has no access to their store. Enter them instead, under **Fixed codes (other shop)**:

- **Code for all winners** — one code every winner receives.
- **Code per winner** — with [one prize per winner](./commands.md#multiple-prizes), a separate code per prize. Empty falls back to the code above.
- **Note for the DM** — free text sent with the code, typically where to redeem it.

This needs **no Tebex store of your own**: it works on a server that has never connected one.

A fixed code and a generated coupon are **independent of each other**. Set up both and the winner receives both codes in the same DM, one for your shop and one for the partner's. That is usually the point of a joint giveaway. If you only want the partner's code, leave the discount above empty.

What the bot cannot do with a foreign code, by definition:

- **Check it.** A typo is delivered as faithfully as a valid code.
- **Revoke it on a reroll.** The replaced winner already has it in their DM and keeps it. The bot writes a warning to your log channel so you notice; blocking the code is something the partner does in their shop.
- **Guarantee it is single-use.** One code for all winners means whoever redeems it first may be the only one who benefits. Use one code per winner if that matters.

**What the winners get**

Each winner receives their **own** code, single-use, in their DM alongside the prize and the claim instructions. The code never appears in the public results message or on the public results page.

On a **reroll**, the replaced winner's code is revoked in your store before the new winner gets theirs. Rerolling a single winner leaves the other winners' codes untouched.

If the coupon cannot be created (Tebex unreachable, key revoked), the giveaway still ends normally and the winner simply gets the regular DM. The failure is recorded in the log channel and the bot's log.
