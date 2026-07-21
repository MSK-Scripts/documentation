---
title: Web Dashboard
description: Optional self-hosted web dashboard for tickets, statistics, configuration and bot control
sidebar_position: 5
---

## 🖥️ Web Dashboard

Manage tickets, statistics and the bot configuration in your browser instead of
editing files over SSH.

The dashboard is **optional and disabled by default**. If you never enable it,
nothing about your bot changes.

### What it can do

| Area | What you get |
|---|---|
| **My tickets** | With the [end-user portal](#the-public-end-user-portal) enabled, every member sees the tickets they opened and can reply to the open ones. Their reply is posted in the Discord channel under their own name. Closed tickets offer a transcript download and, on premium, an "Open transcript" link. |
| **Tickets** | Full list with filters, ticket detail with the live conversation, claim / close / reopen / move / lock / priority. |
| **Statistics** | Totals, average rating, average handling time, and a team ranking by tickets closed. |
| **Configuration** | Edit `config.jsonc`, `snippets.jsonc`, `.env` and the locale files in either a structured **form** view or a raw **file** view (with line numbers and syntax highlighting). Form edits preserve the `//` comments, and a side panel resolves Discord role/channel/category **names** so you never have to hunt for raw IDs. |
| **Bot control** | Start, stop, restart and update the bot, plus a live console. |
| **Permissions** | Decide which roles and users may use the dashboard, and what they may do. |
| **Dashboard settings** | Owner-only. Set the [accent colour and favicon](#dashboard-settings) to brand the dashboard. |

Every view has its own URL (`/tickets`, `/stats`, `/permissions`, an open ticket
is `/tickets/123`), so a reload keeps you on the same page and links are
shareable.

## Quick start

```bash
npm run dashboard:setup   # guided setup: generates secrets, writes .env
npm run dashboard         # starts the bot WITH the dashboard
```

`npm start` keeps working exactly as before and runs the plain bot with no web
server at all.

The setup wizard asks how you want to reach the dashboard and writes the right
configuration for you. It **refuses** to write an unsafe combination.

## How it runs

The dashboard is **not** inside the bot process. It is the **parent** process and
runs the bot as a child:

```
node dashboard.js   ← the dashboard (web server + supervisor)
   └── index.js     ← the bot
```

This is why the dashboard can restart the bot at all. A dashboard living inside
the bot could not restart the process it is served from, and would be gone
exactly when you need it most: after a crash. With the split, the dashboard stays
up, shows you the crash in the console, and lets you start the bot again.

## Security

The dashboard can restart your bot and edit your `.env`. Treat it like an admin
panel, because that is what it is.

### It is safe by default

* **Disabled** unless you set `DASHBOARD_ENABLED=true`.
* **Bound to `127.0.0.1`**, so it is not reachable from the internet at all.
* **Refuses to start** if you bind it to a public interface without HTTPS.
  You will get a clear error telling you how to fix it, rather than a silently
  exposed panel.
* The signing secret (`SESSION_SECRET`) is **generated per installation**. There
  is no shipped default, because a shared default would let anyone forge a login
  on every installation at once.

### Reaching it

**Option A: SSH tunnel (simplest, nothing exposed)**

```bash
ssh -L 3010:127.0.0.1:3010 user@your-server
```

Then open `http://127.0.0.1:3010` on your own computer.

**Option B: reverse proxy with HTTPS (for real use)**

Keep `DASHBOARD_HOST=127.0.0.1` and put a reverse proxy with HTTPS in front, so
the port never has to be open to the internet. `npm run dashboard:setup` detects
your operating system and prints a matching config. The dashboard polls for logs
(no long-lived streaming), so any standard reverse proxy works without special
buffering settings. For the full step-by-step, follow the platform guide:

- **[Dashboard Setup on Windows](/discord/discord_ticketbot/guides/dashboard-windows)** — IIS or Caddy
- **[Dashboard Setup on Linux](/discord/discord_ticketbot/guides/dashboard-linux)** — Apache + certbot

:::warning
**Do not** simply set `DASHBOARD_HOST=0.0.0.0` and open the port. Without TLS
your session cookie and everything you type travels in plaintext. The bot will
refuse to start in that configuration anyway.
:::

## Login and permissions

Login is **Discord OAuth** using the application you already created for the bot.
You only need to:

1. Add the redirect URI shown by the setup wizard in the
   [Discord Developer Portal](https://discord.com/developers/applications)
   under **OAuth2 → Redirects**.
2. Copy the **Client Secret** from **OAuth2 → Client Secret** into `CLIENT_SECRET`.

Your Discord roles are resolved **server-side by the bot**. The dashboard never
takes your word for what permissions you have.

### The permission model

* The **server owner** always has every permission and can never be locked out.
* You grant access to **roles** or to individual **users**.
* **A user entry overrides that person's role entries completely.** This is the
  point of having both: it lets you take a single permission *away* from one
  person that their role grants them.
* Someone with no entry at all sees **only their own tickets** and can reply to
  them, nothing more — and only when the [end-user portal](#the-public-end-user-portal)
  is enabled. By default the dashboard is **staff-only**.

| Permission | Allows |
|---|---|
| `tickets.view` | See the ticket list and ticket details |
| `tickets.act` | Claim, close, reopen, move, lock, set priority |
| `tickets.reply` | Reply in a ticket as the bot |
| `stats.view` | See statistics and team performance |
| `config.view` / `config.edit` | Read / write the config files |
| `bot.control` | Start, stop, restart, update the bot |
| `blacklist.manage` | Manage the blacklist |
| `access.manage` | Manage these permissions |

You cannot remove your own `access.manage`, deactivate yourself, or grant
yourself a permission you do not already have. Granting permissions to *other*
people is unrestricted.

Every change made through the dashboard is written to an audit log.

## The public end-user portal

By default the dashboard is **staff-only**: only the server owner and members you
have granted at least one permission can sign in. Enabling the dashboard for your
team does **not** silently give every server member a login.

Set `DASHBOARD_PUBLIC_PORTAL=true` (the setup wizard also offers this) to open the
end-user portal. Any member can then sign in with Discord and gets a **"My
tickets"** view showing **only their own tickets**, where they can follow the live
conversation and reply to an open ticket (posted in Discord under their own name)
and download the transcript of a closed one. A member with no permissions can never
see other people's tickets, statistics, the config, or the bot controls, and every
reply is re-checked server-side (ticket open, not locked, member not blacklisted,
really their own ticket) before it reaches Discord.

:::note
A member who is turned away sees a clear "limited to staff" message. Either grant
them a permission under **Permissions**, or enable `DASHBOARD_PUBLIC_PORTAL`.
:::

## Dashboard settings

A **Dashboard settings** tab (owner-only, like the `.env` editor) lets you brand
the panel for everyone who uses it:

* **Accent colour** for buttons, highlights, the active menu item and focus rings.
  It previews live while you pick and reverts to the built-in green with one click.
* **Favicon** in the browser tab. Upload a PNG or ICO (up to 256 KB); the file
  type is read from its content, not its name.

Both are served publicly so the login page is themed too. They are stored in
`data/dashboard-settings.json` (plus the favicon file) as dashboard-only state, so
nothing about the bot or its database changes.

## Environment variables

| Variable | Default | Meaning |
|---|---|---|
| `DASHBOARD_ENABLED` | `false` | Master switch |
| `DASHBOARD_HOST` | `127.0.0.1` | Bind address. Leave it alone unless you know why. |
| `DASHBOARD_PORT` | `3010` | Port |
| `DASHBOARD_PUBLIC_URL` | `http://127.0.0.1:<port>` | The URL your browser uses. Must match the Discord redirect URI. |
| `DASHBOARD_PUBLIC_PORTAL` | `false` | Staff-only when off. When on, any member may sign in to manage only their own tickets. |
| `DASHBOARD_ALLOW_INSECURE` | `false` | Only if you terminate TLS somewhere the bot cannot see |
| `SESSION_SECRET` | *generated* | Cookie signing key. Never share or reuse it. |
| `CLIENT_SECRET` | *(none)* | Discord OAuth2 client secret |

## Running it as a service

:::note[Reverse proxy and service manager are two separate layers]
A reverse proxy (Apache, Caddy or IIS) only terminates HTTPS and forwards to the
dashboard; it does **not** run the Node process. A service manager (systemd, or
NSSM / Task Scheduler on Windows) keeps the Node process (`node dashboard.js`)
alive; it does **not** handle HTTPS. For public use you need both. One Caddy/IIS
instance can also front several apps at once (one site block per hostname), so it
never conflicts with a proxy you already run — just add another block, do not
start a second instance.
:::

Use `dashboard.js` instead of `index.js` as the entry point. The service manager
keeps the dashboard alive, and the dashboard keeps the bot alive. Follow the
platform guide for the exact steps:

- **[Dashboard Setup on Windows](/discord/discord_ticketbot/guides/dashboard-windows)** — Task Scheduler or NSSM
- **[Dashboard Setup on Linux](/discord/discord_ticketbot/guides/dashboard-linux)** — systemd

On Windows the dashboard runs as-is (it starts the bot with `fork()` and shells
out to `npm.cmd`/`git` for updates). One difference: "Stop"/"Restart" terminates
the bot directly, because Windows has no catchable `SIGTERM` — safe here since
there is no critical unflushed state.

## Troubleshooting

**A new dashboard feature returns "Request failed (404)" after an update**
The **Update** and **Restart** buttons inside the dashboard only restart the bot
process, not the web server itself. When an update changes the dashboard's own
server code (a new API route, such as the Dashboard settings tab), the running
dashboard already serves the new page but does not yet know the new route, so it
answers 404. Restart the service once so the web server reloads:
`sudo systemctl restart ticketbot` (or restart the NSSM / PM2 service you run
`dashboard.js` under). Plain bot changes (commands, events, the database) do take
effect through the Update button.

**The dashboard refuses to start, saying the configuration is not safe**
You bound the dashboard to a public interface without HTTPS. Either go back to
`DASHBOARD_HOST=127.0.0.1` and use a reverse proxy, or set `DASHBOARD_PUBLIC_URL`
to your `https://` address.

**Login redirects back with an error**
The redirect URI in the Discord portal must match `DASHBOARD_PUBLIC_URL` +
`/auth/callback` **exactly**, including `https` and any trailing path.

**The conversation in a ticket is empty**
The bot needs the **Message Content** intent (Developer Portal → Bot →
Privileged Gateway Intents) and `Read Message History` in the ticket channels.
Without the latter Discord returns an empty list rather than an error.

**Replies posted under a user's name do not appear**
The bot needs the **Manage Webhooks** permission. Discord offers no way to post
*as* a user, so the reply is sent through a webhook carrying that user's name and
avatar. It will still show an `APP` badge, which is Discord's anti-impersonation
protection and cannot be removed.
