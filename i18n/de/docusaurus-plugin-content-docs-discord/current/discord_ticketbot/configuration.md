---
title: Konfiguration
description: Alle Einstellungen des Discord Ticket Bots, von Ticket-Typen über Auto-Close bis zum Design der Transkripte.
sidebar_position: 5
---

## 🛠️ Konfiguration im Überblick

### Ausführlichkeit des Start-Logs

```json
"showLog": true   // INFO-Meldungen beim Start zeigen (Befehle, Events, Komponenten)
                  // Für eine ruhigere Ausgabe im Produktivbetrieb auf false setzen
```

### Interaktionsart des Panels

```json
"panel": {
  "interactionType": "BUTTON"    // "BUTTON" (Standard) oder "SELECT_MENU"
}
```

| Modus           | Verhalten                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `"BUTTON"`      | Es erscheint ein grüner Button. Ein Klick öffnet ein Auswahlmenü, das nur der Klickende sieht. Immer frisch, kein Cache-Problem seitens Discord.                    |
| `"SELECT_MENU"` | Das Auswahlmenü steht direkt im Panel. Nach jeder Nutzung setzt es sich selbst zurück, niemand muss Discord neu starten, um ein zweites Ticket desselben Typs zu öffnen. |

### Panel-Logo und Banner

```json
"panel": {
  "logo":   { "enabled": true, "file": "logo.png"   },
  "banner": { "enabled": true, "file": "banner.png" }
}
```

Unterstützte Formate: PNG, JPG, GIF, WEBP. Führe `/setup` erneut aus, nachdem du Bilder
hinzugefügt oder ausgetauscht hast.

### Zustände eines Ticket-Kanals

| Zustand            | Kanalname                | Kanalthema                             | Eröffnungs-Embed                    |
| ------------------ | ------------------------ | -------------------------------------- | ----------------------------------- |
| Ticket geöffnet    | `ticket-username`        | `🟡 Medium`                             | Priorität: 🟡 Medium                 |
| `/priority urgent` | `ticket-username`        | `🔴 Urgent`                             | Priorität: 🔴 Urgent                 |
| `/claim`           | `ticket-username`        | `🟡 Medium \| 🙋 Übernommen von @Staff` | zusätzliches Feld „Übernommen von"  |
| `/unclaim`         | `ticket-username`        | `🟡 Medium`                             | Feld entfernt                       |
| `/lock lock`       | `ticket-username`        | unverändert                            | Sperrhinweis wird gepostet          |
| Ticket geschlossen | `closed-ticket-username` | unverändert                            | alle Buttons entfernt               |
| Wieder geöffnet    | `ticket-username`        | wiederhergestellt                      | Reopen-Embed und Ticket-Buttons zurück |

> **Hinweis zu Rate-Limits:** Discord erlaubt nur 2 Änderungen des Kanalthemas pro
> 10 Minuten. Der Bot weist im Ticket darauf hin, die Aktualisierung erfolgt
> automatisch, sobald das Limit zurückgesetzt ist.

### Ticket-Typen

```json
{
  "codeName": "support",
  "name": "Support",
  "description": "...",
  "emoji": "💡",
  "color": "#ff0000",             // Hex-Farbe oder "" für mainColor
  "categoryId": "123456789",
  "priority": "medium",           // Startpriorität: "low", "medium", "high" oder "urgent" (Standard "medium")
  "ticketNameOption": "",         // USERNAME, USERID, TICKETCOUNT oder ""
  "customDescription": "...",     // Variablen: REASON1, REASON2, USERNAME, USERID
  "cantAccess": ["roleId"],
  "staffRoles": [],               // Team-Rollen nur für diesen Typ
  "askQuestions": true,
  "questions": [
    { "label": "Frage", "placeholder": "...", "style": "SHORT", "maxLength": 500 }
  ]
}
```

### Bot-Status

```json
"status": {
  "enabled": true,
  "dynamic": false,              // true = Ticketzahl live im Status
  "dynamicText": "🎫 {open} offene Tickets", // Platzhalter: {open}, {total}, {closed}
  "dynamicInterval": 5,          // Aktualisierung in Minuten
  "text": "Support Tickets",     // gilt bei dynamic: false
  "type": "WATCHING",            // PLAYING, WATCHING, LISTENING, STREAMING, COMPETING
  "status": "online"
}
```

### Benachrichtigungen für Nutzer

```json
"userNotifications": {
  "enabled": true   // Zeigt in neuen Tickets einen 🔕-Button „Benachrichtige mich".
                    // Wer ihn aktiviert, bekommt eine DM, sobald das Team zum ersten Mal antwortet.
                    // Begrenzt auf 1 DM je 30 Minuten und Ticket.
}
```

### Textbausteine (Snippets)

Textbausteine stehen in einer eigenen Datei, **nicht** in der `config.jsonc`:

```bash
cp config/snippets.example.jsonc config/snippets.jsonc
```

```json
{
  "snippets": [
    {
      "name": "welcome",
      "description": "Begrüßung zu Beginn eines Tickets",
      "content": "Hey {user}! 👋 Danke für dein Ticket. Wir melden uns gleich.",
      "embed": {
        "title": "👋 Willkommen",
        "color": "#5865F2"
      }
    },
    {
      "name": "docs",
      "description": "Link zur MSK-Scripts-Dokumentation",
      "content": "Hey {user}, schau mal in unsere Doku: https://docu.msk-scripts.de",
      "embed": null
    }
  ]
}
```

**Verfügbare Platzhalter:** `{user}` · `{staff}` · `{type}` · `{priority}`

**Befehle:** `/snippet send <name>` · `/snippet list`

Textbausteine unterstützen Autovervollständigung, tippe einfach den Namen oder die
Beschreibung an, um zu filtern.

### Team-Erinnerung

```json
"staffReminder": {
  "enabled": true,
  "afterHours": 4,
  "pingRoles": true
}
```

Der Bot prüft alle offenen Tickets alle **15 Minuten**. Je Ticket wird **nur einmal**
erinnert.

### Bewertungssystem

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

### Wieder öffnen

Geschlossene Tickets lassen sich über den Button `♻️ Reopen` an der Schlussnachricht und
über den Befehl `/reopen` erneut öffnen.

```json
"reopenOption": {
  "enabled": true,            // Hauptschalter für die Funktion (Button und /reopen)
  "button": true,             // Den ♻️-Button an der Schlussnachricht zeigen
  "whoCanReopen": "STAFFONLY" // "EVERYONE" oder "STAFFONLY"
}
```

| Feld           | Beschreibung                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------- |
| `enabled`      | Hauptschalter. Bei `false` ist der Button ausgeblendet und `/reopen` antwortet, dass es deaktiviert ist. |
| `button`       | Ob der Button `♻️ Reopen` an der Schlussnachricht erscheint.                                          |
| `whoCanReopen` | `"STAFFONLY"` (Standard) verlangt Team-Rechte. `"EVERYONE"` erlaubt es jedem, der den Kanal sieht.    |

Beim Wiederöffnen bekommt der Ersteller seinen Zugriff zurück, der Kanal wandert in die
Kategorie seines Ticket-Typs und verliert das Namenspräfix `closed-`.

> **Hinweis:** Geschlossene Kanäle sieht normalerweise nur das Team, dem Ersteller wird
> die Sicht beim Schließen entzogen. `"EVERYONE"` wird also vor allem dann relevant, wenn
> du geschlossene Kanäle für Nutzer sichtbar lässt.

### Design und Sprache der Transkripte

Das erzeugte HTML-Transkript gibt es in zwei Stilen und in jeder der mitgelieferten
Sprachen:

```json
"transcriptDesign": "modern",  // "modern" (Standard) oder "classic"
"transcriptLang": "de"         // en, de, fr, es, pt, pl, hu. Fällt auf Englisch zurück, wenn leer oder unbekannt
```

| Wert       | Aussehen                                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| `"modern"` | Reduziertes Layout im MSK-Design (Standard, gilt auch, wenn der Schlüssel fehlt). |
| `"classic"`| Das ursprüngliche dunkle Layout im Discord-Stil.                                 |

`transcriptLang` übersetzt alle Beschriftungen im Transkript (Kopfzeilen, Abschnittstitel,
Fußzeile, Tooltip des Kopier-Buttons) und stellt das Datumsformat um. Sieben Sprachen sind
eingebaut (`en`, `de`, `fr`, `es`, `pt`, `pl`, `hu`), jeder andere Wert fällt auf Englisch
zurück. Die Nachrichten des Bots selbst laufen über den getrennten Schlüssel `lang`, der
dieselben Werte akzeptiert.

Beide Stile sind vollständig **eigenständig und offline nutzbar**, es gibt keine externen
Anfragen:

- Avatare **und eigene Emojis** stecken als Base64 mit drin. Lässt sich das Bild beim
  Erzeugen nicht laden, fällt ein eigenes Emoji auf den Text `:name:` zurück.
- Erwähnungen von Nutzern und die Kopfzeilenfelder **Erstellt von / Übernommen von /
  Geschlossen von** erscheinen als **Anzeigenamen** statt als rohe IDs. Lässt sich eine ID
  nicht auflösen, steht dort die ID.
- Die Kopfzeile nennt außerdem **Geschlossen von** und den **Schließgrund**, letzteren nur,
  wenn einer angegeben wurde.
- Code-Blöcke zeigen ihre Sprache als kleines Etikett (etwa `LUA`) und haben einen
  **Kopier-Button**, der den Block in die Zwischenablage legt. Syntaxfarben gibt es
  bewusst nicht, damit keine Abhängigkeiten nötig sind.

### Statistiken

`/stats` zeigt die serverweiten Zahlen. `/stats @Nutzer` zeigt ein ausführliches Profil,
getrennt nach **👤 Als Nutzer** und **🛡️ Als Team**.
