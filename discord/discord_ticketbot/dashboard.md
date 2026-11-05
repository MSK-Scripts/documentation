---
title: Web Dashboard
description: Optional self-hosted web dashboard for tickets, statistics, configuration and bot control
sidebar_position: 6
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
| **Dashboard settings** | Set the [accent colour and favicon](#dashboard-settings) to brand the dashboard. Gated by its own view / edit permissions (the owner always has both). |
| **Language** | Each user picks [their own interface language](#language) from seven translations. |

Every view has its own URL (`/tickets`, `/stats`, `/permissions`, an open ticket
is `/tickets/123`), so a reload keeps you on the same page and links are
shareable.

## Language

The dashboard is available in **English, German, French, Spanish, Portuguese,
Polish and Hungarian**. The selector sits at the bottom of the sidebar, above
"Sign out".

Each person picks their own language: the choice is stored in their browser, so
switching the panel to German changes nothing for anyone else, and it needs no
permission. On a first visit the dashboard follows the browser's language and
falls back to English. Dates and times follow the selected language too.

:::note
This is the **dashboard's** interface language. It is separate from `lang` in
`config.jsonc`, which controls what the **bot** writes into Discord. One staff
member reading the panel in Polish does not change what your ticket embeds say.
:::

Adding a language needs no code change: drop a `web/src/locales/<code>.json`
(copy `en.json`, translate the values, set `$meta.name` to the language's own
name) and rebuild the frontend. It appears in the selector on its own. Any key you
leave out falls back to English rather than breaking the page.

The structured `config.jsonc` form (its field labels and help texts) is still
English only; the rest of the dashboard is translated.

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

- **[Dashboard Setup on Windows](/discord/discord_ticketbot/guides/dashboard-windows):** IIS or Caddy
- **[Dashboard Setup on Linux](/discord/discord_ticketbot/guides/dashboard-linux):** Apache + certbot

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
  them, nothing more, and only when the [end-user portal](#the-public-end-user-portal)
  is enabled. By default the dashboard is **staff-only**.

| Permission | Allows |
|---|---|
| `tickets.view` | See the ticket list and ticket details |
| `tickets.act` | Claim, close, reopen, move, lock, set priority |
| `tickets.reply` | Reply in a ticket as the bot |
| `stats.view` | See statistics and team performance |
| `config.view` / `config.edit` | Read / write the config files |
| `settings.view` / `settings.edit` | View / change the dashboard's accent colour and favicon |
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

## Panel images

In **Configuration**, section *Ticket Panel*, the logo and the banner each have
an upload, a preview of the current image and **Reset to default**. This is the
way to change them on a hosted bot, where you have no access to the server's
files. It needs the `config.edit` permission, and every upload and reset is in
the audit log.

Accepted are **PNG, JPEG, GIF, WebP and SVG**, up to **5 MB** per file (see
`ASSET_UPLOAD_MAX_MB` below). The type is read from the file's content, not from
its name. Every image is then converted:

* It is decoded and saved again as a new file. Metadata such as the location,
  camera data or comments does not survive, and neither does anything hidden
  behind the image data.
* The logo is scaled down to at most 1024 px, the banner to at most 2048 px.
  Smaller images keep their size.
* PNG stays PNG, JPEG stays JPEG, WebP stays WebP, an animated GIF stays
  animated. A still GIF becomes PNG.
* **SVG is always converted to PNG.** Discord cannot show SVG in the panel, and
  an SVG file can contain scripts. SVGs with scripts, links to other files or
  web addresses, or entity declarations are refused.
* Images with very many pixels (more than 30 megapixels, for example a
  "decompression bomb" that is tiny as a file and huge in memory) are refused
  before they are decoded.

The image is stored in `assets/` under a generated name such as
`custom-logo-3f2a9c1e5b7d4a60.png`, and `panel.logo.file` or `panel.banner.file`
in `config.jsonc` is set to that name, with all comments kept. The previously
uploaded image of the same slot is deleted; images you put into `assets/`
yourself and the shipped default are never touched. **Reset to default** sets
the name back to `logo.png` or `banner.png` and deletes the uploaded file. Like
any other config change, the panel uses the new image after the next restart of
the bot.

### Virus scan (optional)

If [ClamAV](https://www.clamav.net/) runs on the server, the dashboard can have
every upload scanned by `clamd` before it is processed. Set either
`CLAMAV_SOCKET` (the path of clamd's local socket, on Debian usually
`/var/run/clamav/clamd.ctl`) or `CLAMAV_HOST` and `CLAMAV_PORT`. The user the
dashboard runs as must be allowed to use the socket.

* A file clamd flags is refused and written to the audit log with the name of
  the finding.
* If ClamAV is configured but does not answer (stopped, wrong path, timeout),
  uploads are **refused** until it answers again. A configured scanner never
  lets a file through unscanned.
* Without these variables the dashboard logs once at start that uploads are not
  virus scanned. Images are still converted as described above.

clamd's `StreamMaxLength` (25 MB by default) has to be larger than the upload
limit.

#### Setting up ClamAV

ClamAV is optional. Without it uploads still work and are converted as described
above. clamd keeps its signature database in memory and needs well over 1 GB of
RAM, so check that your server has room for it.

**Debian or Ubuntu**, with the bot running directly on the server:

```bash
sudo apt install clamav-daemon
sudo systemctl enable --now clamav-freshclam clamav-daemon
```

The first signature download takes a few minutes, and clamd only starts once it
is done. Then add this to the bot's `.env` and restart the dashboard:

```bash
CLAMAV_SOCKET=/var/run/clamav/clamd.ctl
```

If the log says the socket cannot be opened, the bot's user may not use it.
Check `LocalSocketGroup` and `LocalSocketMode` in `/etc/clamav/clamd.conf`.

**Docker:** run the official image next to the bot, see
[ClamAV for image uploads](https://docu.msk-scripts.de/discord/discord_ticketbot/docker/#clamav-for-image-uploads).

After a restart the dashboard logs whether ClamAV answers:
`Image uploads are virus scanned with ClamAV (...)` means it works.

## Dashboard settings

A **Dashboard settings** tab lets you brand the panel for everyone who uses it.
Unlike the `.env` editor it is not owner-only: it has its own `settings.view` and
`settings.edit` permissions, so you can let trusted staff adjust the branding
without handing them the bot's secrets. The owner always holds both. A member with
only `settings.view` sees the current colour and favicon but every control is
disabled. What you can set:

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
| `ASSET_UPLOAD_MAX_MB` | `5` | Size limit for a panel image upload in MB, between 1 and 10 |
| `CLAMAV_SOCKET` | *(none)* | clamd socket for the virus scan of uploads, e.g. `/var/run/clamav/clamd.ctl` |
| `CLAMAV_HOST` / `CLAMAV_PORT` | *(none)* / `3310` | clamd over TCP instead of a socket. `CLAMAV_SOCKET` wins when both are set. |

## Running it as a service

:::note[Reverse proxy and service manager are two separate layers]
A reverse proxy (Apache, Caddy or IIS) only terminates HTTPS and forwards to the
dashboard; it does **not** run the Node process. A service manager (systemd, or
NSSM / Task Scheduler on Windows) keeps the Node process (`node dashboard.js`)
alive; it does **not** handle HTTPS. For public use you need both. One Caddy/IIS
instance can also front several apps at once (one site block per hostname), so it
never conflicts with a proxy you already run. Just add another block, do not
start a second instance.
:::

Use `dashboard.js` instead of `index.js` as the entry point. The service manager
keeps the dashboard alive, and the dashboard keeps the bot alive. Follow the
platform guide for the exact steps:

- **[Dashboard Setup on Windows](/discord/discord_ticketbot/guides/dashboard-windows):** Task Scheduler or NSSM
- **[Dashboard Setup on Linux](/discord/discord_ticketbot/guides/dashboard-linux):** systemd

On Windows the dashboard runs as-is (it starts the bot with `fork()` and shells
out to `npm.cmd`/`git` for updates). One difference: "Stop"/"Restart" terminates
the bot directly, because Windows has no catchable `SIGTERM`, safe here since
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
