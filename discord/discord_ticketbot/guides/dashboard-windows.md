---
title: Dashboard Setup on Windows
description: Step-by-step guide to run the ticket bot web dashboard on a Windows server, reachable over HTTPS.
sidebar_position: 1
---

# Dashboard Setup on Windows

A step-by-step guide to run the optional web dashboard on a Windows server and
reach it over HTTPS.

:::note[Two separate layers]
Getting this working means two independent things: a **reverse proxy** (IIS or
Caddy) that terminates HTTPS and forwards to the dashboard, and a **service
manager** (Task Scheduler or NSSM) that keeps the Node process alive. The reverse
proxy does not run the bot, and the service manager does not handle HTTPS. You
need both.
:::

## Prerequisites

- Node.js 22+ and Git installed.
- The bot already set up and running, with a valid `.env` (`TOKEN`, `CLIENT_ID`, `GUILD_ID`).
- A subdomain for the dashboard, e.g. `tickets.example.com`, with a DNS **A record** pointing to this server.

## Firewall

The dashboard binds to `127.0.0.1` only, so its port (default `3010`) is **not**
reachable from outside and needs **no** firewall rule. Leave it closed. Only the
reverse proxy must be reachable from the internet:

| Direction | Rule | Why |
|---|---|---|
| Inbound | **TCP 80** | Let's Encrypt certificate issuance/renewal (ACME) and HTTP → HTTPS redirect |
| Inbound | **TCP 443** | HTTPS, the actual dashboard traffic |
| Outbound | TCP 443 | Discord, Let's Encrypt, updates (usually already allowed) |

No UDP is required. (Only add inbound UDP 443 if you deliberately enable HTTP/3.)
Do **not** open port 3010 inbound. Add the inbound rules under **Windows Defender
Firewall with Advanced Security → Inbound Rules → New Rule → Port**.

## 1. Run the guided setup

In the bot folder:

```
npm run dashboard:setup
```

- Choose **b** (public, behind a reverse proxy with HTTPS).
- Port: keep `3010` (or pick a free one and remember it).
- Enter your domain, e.g. `tickets.example.com`.
- Add the shown **Redirect URI** in the [Discord Developer Portal](https://discord.com/developers/applications) under **OAuth2 → Redirects** (it will be `https://tickets.example.com/auth/callback`).
- Paste your **Client Secret** (OAuth2 → Client Secret) when asked.

This writes the correct `.env`. The dashboard binds to `127.0.0.1`, so the port is
never exposed directly. The wizard also prints the reverse-proxy snippets below.

## 2. Reverse proxy (pick one)

### Option A: IIS (native to Windows Server)

1. Install **URL Rewrite** and **Application Request Routing (ARR)**.
2. Enable the proxy: IIS Manager → server node → *Application Request Routing Cache* → *Server Proxy Settings* → check **Enable proxy**.
3. Create a site bound to your domain and put this `web.config` in its root:

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ticketbot-dashboard" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:3010/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

4. Bind an HTTPS certificate to the site. The easiest way is [win-acme](https://www.win-acme.com): it issues a Let's Encrypt certificate and renews it automatically. ARR appends the real client to `X-Forwarded-For` on its own, which is what the dashboard reads.

### Option B: Caddy (simplest, automatic HTTPS)

If port 443 is free, Caddy is the least effort. If you already run Caddy for
something else, **do not start a second instance** (that collides on port 443) —
just add one more site block to your existing `Caddyfile`:

```
tickets.example.com {
    reverse_proxy 127.0.0.1:3010
}
```

Then reload Caddy:

```
caddy reload --config C:\path\to\Caddyfile
```

Caddy obtains and renews the certificate automatically. One Caddy instance can
front any number of sites, one block per hostname.

## 3. Keep the bot running as a service (pick one)

Use `dashboard.js` (not `index.js`) as the entry point so it also supervises the bot.

### Option A: Task Scheduler (no extra tools)

- Create Task → *General*: "Run whether user is logged on or not".
- *Triggers* → New → "At startup".
- *Actions* → New: Program `C:\Program Files\nodejs\node.exe`, Arguments `dashboard.js`, Start in `C:\path\to\discord_ticketbot`.
- Save, then run the task once.

### Option B: NSSM

```
nssm install TicketBot "C:\Program Files\nodejs\node.exe" dashboard.js
nssm set TicketBot AppDirectory C:\path\to\discord_ticketbot
nssm start TicketBot
```

:::tip
For a first test, just run `npm run dashboard` in a terminal to confirm
everything works, then stop it and set up the service. Do not run both at once —
they would fight over the port.
:::

Note: "Stop"/"Restart" from the dashboard terminates the bot directly, because
Windows has no catchable `SIGTERM`. That is safe here since there is no critical
unflushed state.

## 4. Open it

Go to `https://tickets.example.com` and log in with Discord. As the server owner
you are automatically admin. Grant everyone else access under **Permissions**.

## Troubleshooting

- **Login redirects back with an error** — the redirect URI in the Discord portal must match `DASHBOARD_PUBLIC_URL` + `/auth/callback` **exactly**, including `https`.
- **502 / 503 from the proxy** — the bot process is not running. Check the service (Task Scheduler / NSSM) is started and listening on the configured port.
- **The dashboard refuses to start, saying the configuration is not safe** — you bound it to a public interface without HTTPS. Keep `DASHBOARD_HOST=127.0.0.1` and reach it through the reverse proxy.
