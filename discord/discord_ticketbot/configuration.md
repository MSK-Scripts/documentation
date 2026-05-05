---
title: Configuration
description: Configuration
sidebar_position: 3
---

## 🛠️ Configuration Reference

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