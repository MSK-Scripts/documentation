---
title: Branding & Custom Domains
sidebar_position: 6
---

# Branding & Custom Domains

Make public forms and status pages look like they belong to your community. Branding lives under **Dashboard → your server → Branding** (and **Domain** for custom domains). All of it is manager-only.

---

## Accent color

Set a guild-wide **accent color** with the color picker. It's applied to the public form and status pages — buttons, highlights, and links adopt it. The Discord bot also uses it as the embed color for posted forms and review embeds.

It works by overriding the theme's primary color token for those pages, so every accented element inherits it without per-element edits.

---

## Logo

Upload a **logo** and it appears in the header of your public form and status pages. The upload is hardened:

- Allowed by magic-byte check (no SVG).
- Re-encoded to **WebP** (stripping hidden code, EXIF, and polyglot tricks), max 512 px, 1 MB limit.
- Animated GIF/WebP logos are preserved as animated WebP.

The logo is served from a fixed `image/webp` route with `nosniff`.

---

## Custom CSS

:::note[Pro feature]
Custom CSS requires a [Pro](plans.md) subscription.
:::

Managers can add **custom CSS** that applies to the public form and status pages — style the `.msk-form` wrapper or override the theme's CSS variables. The CSS is sanitized on save **and** on render (defense in depth): anything that could break out of the style context is stripped, `@import` / `expression()` / `javascript:` are removed, and length is capped.

---

## Custom domains

:::note[Pro feature]
Custom domains require a [Pro](plans.md) subscription.
:::

Serve your forms under your **own domain** — e.g. `apply.your-community.com` — with automatic TLS.

### Setup

On the **Domain** page:

1. Enter your domain. MSK Forms shows you two DNS records to add:
   - A **CNAME** pointing your domain at the MSK Forms host.
   - A **TXT** record (`_msk-forms.<domain>`) carrying a verification token.
2. Add those records at your DNS provider.
3. Click **Verify**. MSK Forms checks the TXT record (via public resolvers, to avoid stale caches).

Once verified, provisioning is fast (typically ~10–30 seconds) — a certificate is issued automatically and your domain goes live. A verified custom domain serves **only your guild's** forms; the root of the domain shows your guild's branded live-form index.

### Per-guild Discord login (own OAuth app)

On a custom domain, logging in with the global MSK Forms Discord app would bounce users back to the primary domain. To keep the whole login on your domain, add your **own Discord OAuth app**:

1. Create an app at discord.com/developers.
2. Add `https://<your-domain>/api/auth/discord/callback` as a redirect, with scopes `identify email guilds`.
3. Enter the Client ID and Secret on the **Domain** page (the secret is stored encrypted and never shown again).

Now the full OAuth flow runs on your domain and the session is set there directly.

### Per-guild captcha (own Turnstile key)

The global Cloudflare Turnstile key is bound to the primary domain's hostname, so it can't render on a custom domain. Add your **own Turnstile widget** (bound to your domain in the Cloudflare dashboard) on the **Domain** page — site key + secret — and the captcha works on your custom domain too. Without it, custom-domain forms are still protected by rate-limiting.

---

:::info
Next: [Integrations & API](integrations-and-api.md) — webhooks, Zapier / Make, and the REST API.
:::
