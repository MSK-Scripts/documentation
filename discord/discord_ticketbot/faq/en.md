---
title: FAQ - (English)
description: FAQ - (English)
sidebar_position: 1
---

# Frequently Asked Questions

### Do I need an API key?
No. Without an API key the bot works normally and sends the transcript as a file via DM.  
The API key is only needed if you want transcripts stored as public links.

### What happens when my sponsorship expires?
Your tier is automatically downgraded to Basic. Existing transcripts remain accessible  
until their individual expiry date. Custom domains are deactivated.

### Can I use the same API key for multiple servers?
No. Each API key is bound to one specific Discord server.  
Complete the verify process separately for each server you want to use the service for.

### I lost my API key — what now?
Visit [www.msk-scripts.de/verify](https://www.msk-scripts.de/verify) again and complete the process.  
A new key is generated and the old one is invalidated immediately.  
Don't forget to update the key in your bot's `.env` and restart.

### My domain shows "DNS pending" after a long time — what should I check?
Verify that the A-record is set correctly at your domain registrar and points to the exact IP  
shown in the dashboard. You can check propagation using tools like [dnschecker.org](https://dnschecker.org).

### Is the SSL certificate free? 
Yes. SSL certificates are obtained automatically via **Let's Encrypt** (Certbot) at no cost.  
They renew automatically before expiry.