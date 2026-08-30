---
title: FAQ
description: Frequently asked questions about the self-hosted MSK Discord ticket bot, from database choice to transcripts and hosting.
sidebar_position: 9
---

### Do I need FiveM or a game server for it?
No. It is a plain Discord bot and has nothing to do with FiveM, ESX, QBCore or any game server. It talks to Discord and to nothing else, and all it needs is Node.js and a bot token. MSK Scripts also publishes FiveM resources, which is where the question usually comes from, but the two share nothing beyond the name on the shop.

### Do I need an API key?
No. Without an API key the bot works normally and sends the transcript as a file via DM.  
The API key is only needed if you want transcripts stored as public links.

### What happens when I cancel my subscription?
At the end of the paid period your tier is automatically downgraded to Basic (cancelling during  
the 14-day free trial incurs no charge). Existing transcripts remain accessible until their  
individual expiry date. Custom domains are deactivated.

### Can I use the same API key for multiple servers?
No. Each API key is bound to one specific Discord server.  
Complete the verify process separately for each server you want to use the service for.

### I lost my API key, what now?
Visit [www.msk-scripts.de/ticketbot/verify](https://www.msk-scripts.de/ticketbot/verify) again and complete the process.  
A new key is generated and the old one is invalidated immediately.  
Don't forget to update the key in your bot's `.env` and restart.

### My domain shows "DNS pending" after a long time, what should I check?
Verify that the A-record is set correctly at your domain registrar and points to the exact IP  
shown in the dashboard. You can check propagation using tools like [dnschecker.org](https://dnschecker.org).

### Is the SSL certificate free? 
Yes. SSL certificates are obtained automatically via **Let's Encrypt** (Certbot) at no cost.  
They renew automatically before expiry.

### What is "Hosted Bot Management"?
Any paid tier can have its bot instance hosted by MSK Scripts. The bot runs on our server, and you set it up yourself in the **Bot Hosting** tab of your dashboard: enter your bot token, client ID and client secret, and we install it, start it and check that it came up. You keep bot control (start/stop/restart/update), a live log console and a form for correcting those credentials. No SSH access or server knowledge is required, and no arrangement with us beforehand.

### How does my team get into the bot's dashboard?
Every hosted bot is published at its own address, `tickets-<id>.msk-scripts.de` or a domain of your own, and that address runs the bot's own Discord login. Share it with your staff: they sign in with their own account and see exactly what their permissions allow. One step is yours to do, because only you can: add the redirect URL shown in the dashboard under **OAuth2 → Redirects** in the Discord developer portal. Without it the login ends on a Discord error page.

### Can I turn hosting off again?
Yes, in the same tab. Removing it stops the bot, takes its address offline and archives the installation, which is deleted for good after 14 days. If you come back within those 14 days, we ask whether you want the old installation restored, and one click brings it back with its tickets, its settings and the same address.