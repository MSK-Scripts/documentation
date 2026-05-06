---
title: Configuration
description: Configuration
sidebar_position: 3
---

## 🛠️ Configuration Reference

### Startup Log Visibility

```json
"showLog": true   // Show INFO log messages on startup (commands, events, components)
                  // Set to false for a cleaner output in production
```

### Panel Interaction Type

```json
"panel": {
  "interactionType": "BUTTON"    // "BUTTON" (default) or "SELECT_MENU"
}
```

| Mode            | Behaviour                                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"BUTTON"`      | A green button is shown. Clicking it opens an ephemeral select menu — always fresh, no Discord caching issue.                                                             |
| `"SELECT_MENU"` | The select menu is shown directly in the panel. After every use it automatically resets, so users never need to restart Discord to open a second ticket of the same type. |

### Panel Logo & Banner

```json
"panel": {
  "logo":   { "enabled": true, "file": "logo.png"   },
  "banner": { "enabled": true, "file": "banner.png" }
}
```

Supported formats: PNG, JPG, GIF, WEBP. Run `/setup` again after adding or changing images.

### Channel State Overview

| State              | Channel Name             | Channel Topic                     | Opening Embed       |
| ------------------ | ------------------------ | --------------------------------- | ------------------- |
| Ticket opened      | `ticket-username`        | `🟡 Medium`                        | Priority: 🟡 Medium  |
| `/priority urgent` | `ticket-username`        | `🔴 Urgent`                        | Priority: 🔴 Urgent  |
| `/claim`           | `ticket-username`        | `🟡 Medium \| 🙋 Claimed by @Staff` | + Claimed by field  |
| `/unclaim`         | `ticket-username`        | `🟡 Medium`                        | field removed       |
| `/lock lock`       | `ticket-username`        | unchanged                         | lock notice posted  |
| Ticket closed      | `closed-ticket-username` | unchanged                         | all buttons removed |

> **Note on rate-limits:** Discord limits channel topic changes to 2 per 10 minutes. A warning is shown in the ticket and the update appears automatically once the limit resets.

### Ticket Types

```json
{
  "codeName": "support",
  "name": "Support",
  "description": "...",
  "emoji": "💡",
  "color": "#ff0000",             // Hex color or "" to use mainColor
  "categoryId": "123456789",
  "ticketNameOption": "",         // USERNAME, USERID, TICKETCOUNT or ""
  "customDescription": "...",     // Variables: REASON1, REASON2, USERNAME, USERID
  "cantAccess": ["roleId"],
  "staffRoles": [],               // Type-specific staff roles
  "askQuestions": true,
  "questions": [
    { "label": "Question", "placeholder": "...", "style": "SHORT", "maxLength": 500 }
  ]
}
```

### Bot Status

```json
"status": {
  "enabled": true,
  "dynamic": false,              // true = live ticket count in status
  "dynamicText": "🎫 {open} open tickets", // placeholders: {open}, {total}, {closed}
  "dynamicInterval": 5,          // update interval in minutes
  "text": "Support Tickets",     // used when dynamic: false
  "type": "WATCHING",            // PLAYING, WATCHING, LISTENING, STREAMING, COMPETING
  "status": "online"
}
```

### User Notifications

```json
"userNotifications": {
  "enabled": true   // Show a 🔕 "Notify me" button in new tickets.
                    // User opts in → receives a DM when staff first replies.
                    // Rate-limited to 1 DM per 30 minutes per ticket.
}
```

### Canned Responses (Snippets)

Snippets are defined in a separate file — **not** in `config.jsonc`:

```bash
cp config/snippets.example.jsonc config/snippets.jsonc
```

```json
{
  "snippets": [
    {
      "name": "welcome",
      "description": "Welcome message at the start of a ticket",
      "content": "Hey {user}! 👋 Thanks for opening a ticket. We'll be with you shortly.",
      "embed": {
        "title": "👋 Welcome",
        "color": "#5865F2"
      }
    },
    {
      "name": "docs",
      "description": "Link to the MSK-Scripts documentation",
      "content": "Hey {user}, check out our docs: https://docu.msk-scripts.de",
      "embed": null
    }
  ]
}
```

**Available placeholders:** `{user}` · `{staff}` · `{type}` · `{priority}`

**Commands:** `/snippet send <name>` · `/snippet list`

Snippets support autocomplete — start typing the name or description to filter.

### Staff Reminder

```json
"staffReminder": {
  "enabled": true,
  "afterHours": 4,
  "pingRoles": true
}
```

The bot checks all open tickets every **15 minutes**. Each ticket is only reminded **once**.

### Rating System

```json
"ratingSystem": {
  "enabled": true,
  "dmUser": true,
  "ratingsChannelId": "CHANNEL_ID_HERE"
}
```

### Auto-Close

```json
"autoClose": {
  "enabled": true,
  "inactiveHours": 48,
  "warnBeforeHours": 6,
  "excludeClaimed": true
}
```

### Statistics

`/stats` shows server-wide numbers. `/stats @user` shows a detailed profile split into **👤 As a User** and **🛡️ As Staff**.