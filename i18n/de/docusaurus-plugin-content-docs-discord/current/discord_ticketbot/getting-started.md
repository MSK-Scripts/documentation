---
title: Discord Ticket Bot einrichten
description: Discord Ticket Bot selbst hosten, quelloffen und ohne Telemetrie. Ticketsystem, Transkripte, Web-Dashboard und alle Funktionen im Überblick.
keywords:
  - discord ticket bot
  - discord ticket bot einrichten
  - discord ticket bot selbst hosten
  - discord ticket bot deutsch
  - ticketsystem discord
sidebar_position: 1
---

![Discord Ticket Bot](/img/discord_ticketbot_banner.png)

Ein moderner Discord Ticket Bot zum Selbsthosten, gebaut auf **Discord.js v14**. SQLite ist von Haus aus dabei, eine externe Datenbank brauchst du also nicht. **MySQL/MariaDB** und **PostgreSQL** gehen optional trotzdem. Keine Telemetrie, voller Funktionsumfang ab der ersten Minute.

Es ist ein **reiner Discord-Bot**: kein Gameserver, kein FiveM, kein ESX oder QBCore, kein Framework. Er braucht nur Node.js und einen Bot-Token.

[`Lizenz: AGPL-3.0`](https://www.gnu.org/licenses/agpl-3.0) · [`Node.js 24+`](https://nodejs.org) · [`Discord.js v14`](https://discord.js.org)

Du willst erst den Überblick? Die Seite [Discord Ticket Bot zum Selbsthosten](https://www.msk-scripts.de/de/ticketbot)
auf msk-scripts.de geht die Funktionen, die Transkript-Stufen und den Verifizierungsablauf durch.

Noch unentschlossen? Der [Vergleich der Discord Ticket Bots](https://www.msk-scripts.de/de/ticketbot/compare)
stellt diesen Bot neben Discord Tickets, Sayrix Ticket-Bot und das gehostete Ticket Tool,
inklusive der Fälle, in denen ein anderes Projekt besser passt.

Wenn du direkt loslegen willst, geht es auf der Seite [Discord Ticket Bot installieren](./installation.md) weiter.

---

## ✨ Funktionen

| Funktion | Beschreibung |
|---|---|
| 🎫 Ticket-Typen | Bis zu 25 Typen, jeder mit eigenem Emoji, Farbe, Kategorie, Staff-Rollen, Start-Priorität und Fragen |
| 📋 Fragebögen | Bis zu 5 Fragen in einem Formular beim Öffnen. Die Antworten stehen im Ticket und im Transkript |
| 🎛️ Panel | Button oder Auswahlmenü, optional mit Logo und Banner. Das `/setup`-Panel aktualisiert sich bei jedem Start selbst |
| 🙋 Claim-System | Übernehmen und Freigeben per Button oder Befehl, Embed und Kanalthema passen sich an |
| 🔴 Prioritäten | Low, Medium, High, Urgent. Pro Ticket-Typ vorgegeben oder per `/priority` |
| 🛡️ Staff pro Typ | Ein Ticket-Typ mit eigenen `staffRoles` wird nur von diesen Rollen betreut, beim Kanalzugriff und bei jeder Staff-Aktion |
| 🚧 Sperren beim Öffnen | Gesperrte Rollen, `cantAccess` pro Typ, eine Blacklist und ein Limit offener Tickets pro Nutzer, das sich nicht umgehen lässt |
| 📝 Staff-Notizen | Private Notizen pro Ticket mit `/note` |
| 🔀 Ticket verschieben | In einen anderen Typ und dessen Kategorie, mit den passenden Rechten |
| 🔒 Ticket sperren | Ersteller und hinzugefügte Nutzer können nicht mehr schreiben |
| ♻️ Wieder öffnen | Geschlossenes Ticket per Button oder `/reopen` wieder öffnen, Zugriff und Kategorie werden wiederhergestellt |
| ⏰ Auto-Close | Schließt inaktive Tickets nach einer Warnung, pro Ticket pausierbar mit `/autoclose` |
| ⏰ Staff-Erinnerung | Pingt die Staff-Rollen des Tickets, wenn nach X Stunden niemand geantwortet hat |
| ⭐ Bewertungen | 1 bis 5 Sterne mit optionalem Kommentar, gepostet mit Ticket-Kategorie und Avatar des Nutzers. Das Team kann über das Kontextmenü **Comment Feedback** antworten |
| 📄 HTML-Transkript | Eigenständiges HTML im Design **modern** oder **classic**. Avatare, eigene Emojis und ohne API-Key auch die Bilder sind eingebettet, die Datei funktioniert also offline |
| 🔗 Transkript-Links | Mit einem MSK-API-Key wird das Transkript hochgeladen und als Link geteilt, auf Wunsch unter eigener Domain |
| 💬 Textbausteine | Snippets mit Platzhaltern und Autovervollständigung, definiert in `snippets.jsonc` |
| 📢 Broadcast | Eine Nachricht an alle offenen Tickets |
| 🔔 Benachrichtigungen | Optionaler Button „Notify me“, der Ersteller bekommt eine DM, wenn das Team antwortet |
| 📊 Statistiken | Für den Server und pro Nutzer mit `/stats` |
| 🎮 Dynamischer Status | Zeigt die Zahl offener Tickets im Bot-Status |
| 🌍 Mehrsprachig | 7 Sprachen dabei (Englisch, Deutsch, Französisch, Spanisch, Portugiesisch, Polnisch, Ungarisch), leicht erweiterbar |
| 🗄️ Flexible Datenbank | SQLite ohne Einrichtung, optional MySQL/MariaDB oder PostgreSQL über `DATABASE_URL`, mit Migrationsskript |
| 🔄 Update-Hinweis | Prüft beim Start die GitHub-Releases und meldet neue Versionen im Log-Kanal |
| 🖥️ Web-Dashboard | Optionales Browser-Dashboard: Tickets, Statistiken, Config-Editor, Bot-Steuerung, Rechte und ein Portal für Endnutzer. Siehe [Web-Dashboard](/discord/discord_ticketbot/dashboard) |
| 🐳 Docker | Offizielle Images für `linux/amd64` und `linux/arm64`. Siehe [Docker](/discord/discord_ticketbot/docker) |

---

## 🔗 MSK Transcript Service

Ohne API-Key verlässt nichts deinen Server: Das Transkript hängt als eigenständige HTML-Datei im Log-Kanal und, wenn du willst, an der DM beim Schließen. Mit API-Key lädt der Bot es stattdessen zu **[www.msk-scripts.de](https://www.msk-scripts.de)** hoch und teilt einen öffentlichen Link, der sich in jedem Browser öffnen lässt.

Es gibt vier Stufen: **Basic** (kostenlos), **Premium** (4,99 € im Monat), **Premium+** (9,99 € im Monat) und **Business** (19,99 € im Monat), jede bezahlte Stufe auch jährlich mit zwei Monaten geschenkt. Die bezahlten Stufen bringen größere Transkripte samt Dateianhängen, längere Speicherdauer, eigene Domains und das Recht, den MSK-Hinweis zu entfernen. Ab Premium+ kann der Bot selbst auf unseren Servern laufen. Jede bezahlte Stufe startet mit **14 Tagen kostenlos**, ohne Kreditkarte.

Für den Start holst du dir deinen API-Key unter **[www.msk-scripts.de/ticketbot/verify](https://www.msk-scripts.de/ticketbot/verify)** (mit Discord anmelden, Server auswählen) und trägst ihn in die `.env` ein:

```bash
MSK_API_KEY='dein_api_key'
MSK_API_URL="https://www.msk-scripts.de"
```

> 📖 Alles im Detail (Stufenvergleich, API-Key, eigene Domain): **[Service Setup](./service-setup.md)**

---

## 🖥️ Gehostete Bot-Verwaltung (Premium+ und Business)

Du willst gar keinen eigenen Server betreiben? Mit Premium+ und Business kannst du den Bot **von MSK Scripts hosten lassen**, und du richtest das selbst im Dashboard unter **[msk-scripts.de/ticketbot/dashboard](https://www.msk-scripts.de/ticketbot/dashboard)** ein. Bot-Token, Client ID und Client Secret eintragen, ein Knopf, und wir installieren ihn, starten ihn und prüfen, ob er hochgekommen ist.

![Dashboard, gehostete Bot-Verwaltung](/img/discord_ticketbot_hosting_dashboard.png)

Dein Bot bekommt danach eine eigene Adresse, `tickets-<id>.msk-scripts.de` oder eine eigene Domain, mit eigenem Discord-Login. Genau das lässt dein ganzes Support-Team in das Dashboard des Bots, nicht nur dich.

> 📖 Details: **[Service Setup, gehostete Bot-Verwaltung](./service-setup.md)**

---

## 🖥️ Selbst gehostetes Web-Dashboard

Du betreibst den Bot selbst? Das optionale Web-Dashboard verwaltet Tickets, Statistiken, die Konfiguration und den Bot-Prozess im Browser, mit einem Rechtemodell für dein Team. Es ist standardmäßig abgeschaltet und ab Werk sicher konfiguriert.

Einrichtung, Absicherung und das vollständige Rechtemodell stehen auf der eigenen Seite **[Web-Dashboard](/discord/discord_ticketbot/dashboard)**.

---

## 📁 Projektstruktur

```
discord_ticketbot/
├── index.js                 # der reine Bot (npm start)
├── dashboard.js             # Supervisor + Web-Dashboard, startet index.js (npm run dashboard)
├── config/                  # Vorlagen *.example.jsonc; deine Configs sind gitignored
├── locales/                 # Bot-Texte: main.json (Quelle), en, de, fr, es, pt, pl, hu
├── assets/                  # Logo und Banner fürs Panel
├── data/                    # Laufzeitdaten, SQLite-Datenbank
├── docs/                    # Anleitungen zu Setup, Konfiguration und Dashboard
├── scripts/                 # migrate-db.js, dashboard-setup.js
├── tests/                   # node:test-Suites (npm test)
├── web/                     # Dashboard-Oberfläche (React + Vite), web/dist ist committet
└── src/
    ├── client.js            # Startablauf und Staff-Prüfung
    ├── config.js            # JSONC-Parser + Prüfung
    ├── commands/            # Slash-Befehle und das Kontextmenü „Comment Feedback“
    ├── components/          # buttons/, menus/, modals/ (Custom-IDs beginnen mit tb_)
    ├── events/              # ready, interactionCreate, messageCreate, channelDelete
    ├── handlers/            # Lader für Befehle, Komponenten, Events
    ├── database/            # asynchrone DB-Schicht für SQLite, MySQL/MariaDB, PostgreSQL
    ├── dashboard/           # Webserver, Supervisor, Login, Rechte
    └── utils/               # Ticket-Ablauf, Transkript, Embeds, MSK-API-Client, …
```

Der vollständige Aufbau steht in [docs/development-en.md](https://github.com/MSK-Scripts/discord_ticketbot/blob/main/docs/development-en.md) auf GitHub (Englisch).

---

## ⚙️ Slash-Befehle

| Befehl | Wer | Beschreibung |
|---|---|---|
| `/setup` | Administrator | Ticket-Panel senden |
| `/close [reason]` | `closeOption.whoCanCloseTicket` | Aktuelles Ticket schließen |
| `/reopen` | `reopenOption.whoCanReopen` | Geschlossenes Ticket wieder öffnen, Zugriff und Kategorie werden wiederhergestellt |
| `/claim` · `/unclaim` | Staff | Ticket übernehmen oder freigeben, Thema und Embed passen sich an |
| `/move` | Staff | Ticket in einen anderen Typ verschieben |
| `/add <user>` · `/remove <user>` | Staff | Nutzer hinzufügen oder entfernen |
| `/rename <name>` | Staff | Ticket-Kanal umbenennen |
| `/priority <level>` | Staff | low, medium, high oder urgent setzen |
| `/note add <text>` · `/note list` | Staff | Private Staff-Notizen |
| `/lock lock [reason]` · `/lock unlock` | Staff | Ticket sperren oder entsperren |
| `/autoclose pause` · `/autoclose resume` | Staff | Auto-Close und Staff-Erinnerung für dieses Ticket pausieren oder fortsetzen |
| `/transcript` | Staff | HTML-Transkript sofort erzeugen |
| `/snippet send <name>` · `/snippet list` | Staff | Textbaustein senden oder auflisten |
| `/broadcast <message> [type] [embed]` | Staff | Nachricht an alle offenen Tickets |
| `/blacklist add/remove/list` | Server verwalten | Blacklist pflegen |
| `/stats [user]` | Staff | Statistiken für den Server oder einen Nutzer |

**Staff** heißt: die Staff-Rollen des Ticket-Typs, bei Typen ohne eigene die globalen `rolesWhoHaveAccessToTheTickets`. Administratoren zählen immer als Staff. `/setup` und `/blacklist` bringen eine Standard-Berechtigung mit, die der Server-Admin unter *Servereinstellungen → Integrationen* erweitern kann.

### Kontextmenü

| Eintrag | Ziel | Wer | Beschreibung |
|---|---|---|---|
| **Comment Feedback** | Eine gepostete Bewertung (Rechtsklick → Apps) | `ratingSystem.commentRoles`, sonst Staff | Fügt einen Team-Kommentar ins Bewertungs-Embed ein. Ein zweiter Kommentar derselben Person ersetzt den ersten |

---

## 🔘 Ticket-Buttons

| Button | Sichtbar wenn | Beschreibung |
|---|---|---|
| 🔒 Schließen | `closeOption.closeButton` | Ticket schließen, optional mit Grund |
| 🙋 Claim / 🙌 Unclaim | `claimOption.claimButton` | Wechselt zwischen beiden |
| 🔀 Verschieben | Mehr als ein Ticket-Typ | Neuen Typ wählen, nur für das Team |
| 🔕 Benachrichtigen | `userNotifications.enabled` | Der Ersteller aktiviert DMs, sobald das Team antwortet |
| 🗑️ Löschen | Nach dem Schließen | Kanal nach Bestätigung löschen |
| ♻️ Wieder öffnen | Nach dem Schließen, `reopenOption.button` | Ticket wieder öffnen |
| ⭐ 1 bis 5 | Bewertungsanfrage nach dem Schließen | Nur der Ersteller kann bewerten |

---

## 🗄️ Datenbankschema

Die Datenbank wird automatisch angelegt. Standardmäßig ist das eine lokale SQLite-Datei (`data/tickets.db`); mit `DATABASE_URL` nutzt der Bot stattdessen MySQL/MariaDB oder PostgreSQL (siehe [Datenbank](/discord/discord_ticketbot/database)). Das Schema ist für jedes Backend gleich, fehlende Spalten werden beim Start automatisch ergänzt.

| Tabelle | Inhalt |
|---|---|
| `tickets` | Ein Eintrag pro Ticket: Status, Typ, Priorität, Claim, Sperre, Benachrichtigungen, Erinnerung, Auto-Close-Pause, Transkript |
| `blacklist` | Gesperrte Nutzer pro Server, mit Grund und Zeitpunkt |
| `staff_notes` | Private Staff-Notizen pro Ticket |
| `ratings` | Eine Bewertung pro Ticket (1 bis 5 ⭐) mit optionalem Kommentar |
| `panel_messages` | Wo die `/setup`-Nachricht liegt, für die Aktualisierung beim Start |
| `dashboard_access` | Dashboard-Rechte pro Rolle oder Nutzer |
| `dashboard_audit` | Protokoll jeder Änderung im Dashboard, nur anfügend |

---

## 🌍 Eine neue Sprache ergänzen

Sieben Sprachen sind dabei: Englisch, Deutsch, Französisch, Spanisch, Portugiesisch, Polnisch und Ungarisch (`locales/en.json`, `de.json`, `fr.json`, `es.json`, `pt.json`, `pl.json`, `hu.json`). Um eine davon zu nutzen, setzt du ihren Code in `config/config.jsonc` (`"lang": "fr"`).

Für eine weitere Sprache:

1. `locales/en.json` kopieren, etwa als `locales/it.json`
2. Alle Texte übersetzen (auch den Block `transcript`)
3. In `config/config.jsonc` `"lang": "it"` setzen (und optional `"transcriptLang": "it"`)

---

## 📝 Lizenz

AGPL-3.0-only. Wer eine veränderte Fassung weitergibt oder hostet, muss den Quellcode unter derselben Lizenz veröffentlichen.

Eine zusätzliche Bedingung nach Abschnitt 7(b): Der Hinweis, dass es sich um den MSK Ticket Bot handelt, muss für die Nutzer des Bots sichtbar bleiben. Server mit aktivem Premium- oder Premium+-Abo sind davon ausgenommen. Der genaue Wortlaut steht in der Datei [NOTICE](https://github.com/MSK-Scripts/discord_ticketbot/blob/main/NOTICE).
