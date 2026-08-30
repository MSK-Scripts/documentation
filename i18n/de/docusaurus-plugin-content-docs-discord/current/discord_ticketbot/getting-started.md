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
| 🎫 Ticket-Typen | Bis zu 25 konfigurierbare Typen mit eigenem Emoji, eigener Farbe, Kategorie und eigenen Fragen |
| 📋 Fragebögen | Modal-Formulare mit bis zu 5 Fragen, die beim Öffnen eines Tickets erscheinen |
| 🙋 Claim-System | Das Team kann Tickets übernehmen und wieder abgeben. Der Button schaltet um, Embed und Kanalthema aktualisieren sich von selbst |
| 🔴 Prioritäten | Niedrig, Mittel, Hoch, Dringend. Pro Ticket-Typ vorgegeben oder per `/priority` gesetzt, sichtbar im Kanalthema und im Embed |
| 📝 Team-Notizen | Interne Notizen über `/note add` und `/note list` |
| 🔀 Ticket verschieben | Per `/move` oder Button in einen anderen Typ bzw. eine andere Kategorie verschieben, nur für das Team |
| 🛡️ Rollen je Ticket-Typ | Jeder Ticket-Typ kann eigene Team-Rollen festlegen |
| 🖼️ Panel-Logo und Banner | Optionales Logo als Thumbnail und/oder ein Bannerbild im Panel-Embed |
| 🎛️ Panel-Interaktion | Wahlweise ein Button oder direkt ein Auswahlmenü im Panel |
| ⭐ Bewertungssystem | Bewertung von 1 bis 5 Sternen nach dem Schließen, automatisch in einen festgelegten Kanal gepostet |
| ⏰ Team-Erinnerung | Automatischer Ping im Ticket, wenn sich nach X Stunden niemand aus dem Team gemeldet hat |
| ⏰ Auto-Close | Inaktive Tickets schließen sich automatisch, mit einstellbarer Vorwarnzeit |
| ♻️ Tickets wieder öffnen | Ein geschlossenes Ticket über den `♻️`-Button oder `/reopen` erneut öffnen. Zugriff und Kategorie werden wiederhergestellt |
| 🔗 Transkript-Links | Transkripte liegen online und sind über einen öffentlichen Link erreichbar |
| 📄 HTML-Transkript | In sich geschlossenes HTML-Transkript, **modern oder klassisch**. Avatare und eigene Emojis stecken als Base64 mit drin, Erwähnungen sowie Erstellt-, Übernommen- und Geschlossen-von erscheinen als Namen. Kein CDN nötig |
| 🌐 Eigene Domain | Premium-Kunden liefern Transkripte unter ihrer eigenen Domain aus |
| 📊 Statistiken | Serverweite Statistiken und detaillierte Nutzerstatistiken über `/stats` |
| 🚫 Blacklist | `/blacklist add/remove/list` sperrt Nutzer für das Öffnen von Tickets |
| 💬 Textbausteine | Vorformulierte Antworten mit einem Befehl, konfiguriert in `snippets.jsonc` |
| 🔒 Ticket sperren | Ticket sperren und entsperren, damit der Nutzer keine Nachrichten mehr schreiben kann |
| 📢 Rundnachricht | Eine Nachricht auf einmal in alle offenen Ticket-Kanäle schicken |
| 🔔 Benachrichtigungen | Optionale DM an den Nutzer, sobald jemand aus dem Team antwortet |
| 🎮 Dynamischer Bot-Status | Zeigt die Anzahl der offenen Tickets automatisch im Bot-Status an |
| 🌍 Mehrsprachig | 7 Sprachen enthalten (Englisch, Deutsch, Französisch, Spanisch, Portugiesisch, Polnisch, Ungarisch), leicht erweiterbar |
| 🗄️ Flexible Datenbank | SQLite ohne jede Einrichtung. Optional MySQL/MariaDB oder PostgreSQL über `DATABASE_URL`, inklusive Migrationsskript |
| 🔄 Update-Prüfung | Prüft beim Start auf neue GitHub-Releases und meldet sich mit einer Update-Anleitung |
| 🖥️ Web-Dashboard | Optionales, selbst gehostetes Dashboard im Browser (standardmäßig aus): Tickets, Statistiken, ein Editor für Konfiguration und Dateien, Bot-Steuerung und Rechte je Rolle oder Nutzer. Siehe [Web-Dashboard](/discord/discord_ticketbot/dashboard). |

---

## 🔗 MSK Transcript Service

Statt Transkripte als Dateianhang per DM zu verschicken, kann der Bot sie zu **[www.msk-scripts.de](https://www.msk-scripts.de)** hochladen und daraus einen öffentlichen Link erzeugen. Der lässt sich in jedem Browser öffnen, ganz ohne Download.

Es gibt vier Stufen: **Basic** (kostenlos), **Premium** (3,99 € im Monat), **Premium+** (6,99 € im Monat) und **Business** (9,99 € im Monat). Die bezahlten Stufen bringen größere Transkripte samt Dateianhängen, längere Speicherdauer, eigene Domains, das Recht den MSK-Hinweis zu entfernen und das Hosting des Bots auf unseren Servern. Abgeschlossen wird über **Stripe**, mit **14 Tagen kostenlos** und ohne Kreditkarte.

Für den Start holst du dir deinen API-Key unter **[www.msk-scripts.de/ticketbot/verify](https://www.msk-scripts.de/ticketbot/verify)** (mit Discord anmelden, Server auswählen) und trägst ihn in die `.env` ein:

```bash
MSK_API_KEY='dein_api_key'
MSK_API_URL="https://www.msk-scripts.de"
```

> 📖 Alles im Detail (Stufenvergleich, API-Key, eigene Domain, Stripe): **[Service Setup](./service-setup.md)**

---

## 🖥️ Gehostete Bot-Verwaltung (Premium, Premium+ und Business)

Du willst gar keinen eigenen Server betreiben? In jedem bezahlten Tarif kannst du den Bot **von MSK Scripts hosten lassen**, und du richtest das selbst im Dashboard unter **[msk-scripts.de/ticketbot/dashboard](https://www.msk-scripts.de/ticketbot/dashboard)** ein. Bot-Token, Client ID und Client Secret eintragen, ein Knopf, und wir installieren ihn, starten ihn und prüfen, ob er hochgekommen ist.

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
├── index.js                    # Einstiegspunkt
├── package.json
├── .env.example                # Vorlage für die Umgebungsvariablen
├── ticketbot.service           # systemd-Unit für Linux-Server
├── assets/                     # Statische Dateien (Logo, Banner)
│   ├── logo.png                # Logo-Thumbnail im Panel (eigenes hier ablegen)
│   └── banner.png              # Bannerbild im Panel (eigenes hier ablegen)
├── config/
│   ├── config.example.jsonc    # Konfigurationsvorlage (kommentiert)
│   └── snippets.example.jsonc  # Vorlage für Textbausteine
├── docs/
│   ├── setup-en.md             # Anleitung zum MSK Transcript Service (englisch)
│   └── setup-de.md             # Anleitung zum MSK Transcript Service (deutsch)
├── locales/                    # 7 Sprachen + main.json (englische Vorlage)
│   ├── en.json                 # Englisch
│   ├── de.json                 # Deutsch
│   └── …                       # fr, es, pt, pl, hu
├── scripts/
│   └── migrate-db.js           # npm run db:migrate, SQLite nach MySQL/PostgreSQL
├── data/
│   └── tickets.db              # SQLite-Datenbank (wird angelegt, Standard-Backend)
└── src/
    ├── client.js               # Erweiterter Discord-Client
    ├── config.js               # Laden und Prüfen der Konfiguration
    ├── database/               # Datenbankschicht für SQLite, MySQL und PostgreSQL
    │   ├── index.js            # Öffentliche async-API und alle Queries
    │   ├── url.js              # DATABASE_URL auswerten, Treiber wählen
    │   ├── schema.js           # Schema und Migrationen je Dialekt
    │   └── drivers/            # sqlite.js / mysql.js / postgres.js
    ├── handlers/
    │   ├── commandHandler.js   # Lädt und registriert die Slash-Befehle
    │   ├── eventHandler.js     # Lädt die Discord-Events
    │   └── componentHandler.js # Lädt Buttons, Modals und Menüs
    ├── commands/               # Slash-Befehle
    │   ├── setup.js            # /setup      – Panel senden
    │   ├── close.js            # /close      – Ticket schließen
    │   ├── reopen.js           # /reopen     – Ticket wieder öffnen
    │   ├── add.js              # /add        – Nutzer hinzufügen
    │   ├── remove.js           # /remove     – Nutzer entfernen
    │   ├── claim.js            # /claim      – Ticket übernehmen
    │   ├── unclaim.js          # /unclaim    – Ticket abgeben
    │   ├── move.js             # /move       – Ticket verschieben
    │   ├── rename.js           # /rename     – Kanal umbenennen
    │   ├── transcript.js       # /transcript – HTML-Transkript erzeugen
    │   ├── priority.js         # /priority   – Priorität setzen
    │   ├── note.js             # /note       – Team-Notizen
    │   ├── blacklist.js        # /blacklist  – Nutzer sperren
    │   ├── stats.js            # /stats      – Statistiken
    │   ├── snippet.js          # /snippet    – Textbausteine senden
    │   ├── broadcast.js        # /broadcast  – An alle offenen Tickets
    │   ├── lock.js             # /lock       – Ticket sperren/entsperren
    │   └── autoclose.js        # /autoclose  – Inaktivität pausieren/fortsetzen
    ├── events/
    │   ├── ready.js            # Start, Status, Auto-Close und Team-Erinnerung
    │   ├── messageCreate.js    # Aktivität verfolgen und DM-Benachrichtigungen
    │   └── interactionCreate.js # Alle Interaktionen verteilen
    ├── components/
    │   ├── buttons/
    │   │   ├── openTicket.js       # tb_open
    │   │   ├── closeTicket.js      # tb_close
    │   │   ├── claimTicket.js      # tb_claim
    │   │   ├── unclaimTicket.js    # tb_unclaim
    │   │   ├── moveTicket.js       # tb_move
    │   │   ├── deleteTicket.js     # tb_delete
    │   │   ├── deleteConfirm.js    # tb_deleteConfirm
    │   │   ├── deleteCancel.js     # tb_deleteCancel
    │   │   ├── reopenTicket.js     # tb_reopen
    │   │   ├── rateTicket.js       # tb_rate:N:id
    │   │   └── notifyToggle.js     # tb_notifyToggle
    │   ├── modals/
    │   │   ├── closeReason.js      # tb_modalClose
    │   │   ├── ticketQuestions.js  # tb_modalQuestions:type
    │   │   └── rateComment.js      # tb_modalRate:N:id
    │   └── menus/
    │       ├── panelSelect.js      # tb_panelSelect
    │       ├── ticketType.js       # tb_selectType
    │       └── moveSelect.js       # tb_moveSelect
    └── utils/
        ├── logger.js           # Farbiger Konsolen-Logger
        ├── embeds.js           # Alle Embed-Konstruktoren
        ├── transcript.js       # Eigenständiges HTML, Avatare als Base64
        ├── mskApi.js           # API-Client für den MSK Transcript Service
        ├── ticketActions.js    # Kernlogik: openTicket, performClose, performReopen, performMove
        ├── versionCheck.js     # Update-Prüfung beim Start gegen GitHub-Releases
        └── snippets.js         # Lader und Platzhalter-Engine für Textbausteine
```

---

## ⚙️ Slash-Befehle

| Befehl              | Berechtigung   | Beschreibung                                                         |
| ------------------- | -------------- | -------------------------------------------------------------------- |
| `/setup`            | Administrator  | Das Ticket-Panel senden                                              |
| `/close [Grund]`    | Konfigurierbar | Das aktuelle Ticket schließen                                        |
| `/reopen`           | Konfigurierbar | Ein geschlossenes Ticket wieder öffnen, Zugriff und Kategorie zurück |
| `/claim`            | Team           | Ticket übernehmen, Kanalthema und Embed aktualisieren sich           |
| `/unclaim`          | Team           | Übernommenes Ticket wieder abgeben                                   |
| `/move`             | Team           | Ticket in einen anderen Typ oder eine andere Kategorie verschieben   |
| `/add <Nutzer>`     | Team           | Einen Nutzer zum Ticket hinzufügen                                   |
| `/remove <Nutzer>`  | Team           | Einen Nutzer aus dem Ticket entfernen                                |
| `/rename <Name>`    | Team           | Den Ticket-Kanal umbenennen                                          |
| `/transcript`       | Team           | Ein HTML-Transkript erzeugen                                         |
| `/priority <Stufe>` | Team           | Priorität setzen, aktualisiert Kanalthema und Embed                  |
| `/note add <Text>`  | Team           | Eine Team-Notiz anlegen                                              |
| `/note list`        | Team           | Alle Notizen zu diesem Ticket anzeigen                               |
| `/stats`            | Team           | Serverweite Ticket-Statistiken                                       |
| `/stats @Nutzer`    | Team           | Detaillierte Statistiken zu einem Nutzer                             |
| `/blacklist add`       | Server verwalten | Einen Nutzer sperren                                              |
| `/blacklist remove`    | Server verwalten | Eine Sperre aufheben                                              |
| `/blacklist list`      | Server verwalten | Die Blacklist anzeigen                                            |
| `/snippet send <Name>` | Team             | Einen Textbaustein ins Ticket schicken                            |
| `/snippet list`        | Team             | Alle verfügbaren Textbausteine anzeigen                           |
| `/lock lock [Grund]`   | Team             | Ticket sperren, der Nutzer kann nicht mehr schreiben              |
| `/lock unlock`         | Team             | Ticket entsperren                                                 |
| `/autoclose pause`     | Team             | Inaktivitätswarnung, Auto-Close und Team-Erinnerung pausieren     |
| `/autoclose resume`    | Team             | Die normalen Inaktivitätsregeln wieder aufnehmen                  |
| `/broadcast <Text>`    | Team             | Eine Nachricht an alle offenen Ticket-Kanäle senden               |

---

## 🔘 Ticket-Buttons

In jedem Ticket-Kanal steht oben eine Button-Reihe:

| Button             | Sichtbar wenn                               | Beschreibung                                                        |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------- |
| 🔒 Schließen        | Immer (konfigurierbar)                      | Deaktiviert alle Buttons, erzeugt das Transkript, schließt und benennt den Kanal um |
| 🙋 Übernehmen       | `claimButton: true`, noch nicht übernommen  | Das Team übernimmt, Kanalthema und Embed aktualisieren sich         |
| 🙌 Abgeben          | `claimButton: true`, bereits übernommen     | Das Team gibt wieder ab, Kanalthema und Embed aktualisieren sich    |
| 🔀 Verschieben      | Mehr als 1 Ticket-Typ konfiguriert          | Öffnet die Typauswahl, nur für das Team                             |
| 🗑️ Löschen          | Nach dem Schließen                          | Löscht den Kanal nach einer Rückfrage                               |
| ♻️ Wieder öffnen    | Nach dem Schließen (`reopenOption.enabled`) | Öffnet das Ticket erneut und schiebt es zurück in seine Kategorie   |
| 🔕 Benachrichtigen  | `userNotifications.enabled: true`           | Der Nutzer aktiviert DMs, sobald das Team antwortet                 |

---

## 🗄️ Datenbankschema

Die Datenbank wird automatisch angelegt. Standardmäßig ist das eine lokale SQLite-Datei
(`data/tickets.db`). Setzt du `DATABASE_URL`, nutzt der Bot stattdessen MySQL/MariaDB oder
PostgreSQL, siehe [Datenbank](/discord/discord_ticketbot/database). Schema und Migrationen sind für jedes Backend
gleich, fehlende Spalten kommen beim Start automatisch dazu.

| Tabelle          | Inhalt                                                                          |
| ---------------- | ------------------------------------------------------------------------------- |
| `tickets`        | Alle Tickets: Status, Typ, Priorität, Claim, Sperre, Benachrichtigung, Erinnerung, Transkript |
| `blacklist`      | Gesperrte Nutzer mit Grund und Zeitstempel                                      |
| `staff_notes`    | Interne Team-Notizen je Ticket                                                  |
| `ratings`        | Bewertungen (1 bis 5 ⭐) mit optionalem Kommentar                                |
| `panel_messages` | Fundort der `/setup`-Panel-Nachricht, für die Auffrischung beim Start           |

**Spalten aus den letzten Updates:**

| Spalte | Standard | Zweck |
| --- | --- | --- |
| `locked` | `0` | Ob das Ticket gerade gesperrt ist |
| `notify_on_reply` | `0` | Ob der Ersteller DM-Benachrichtigungen aktiviert hat |
| `last_notify_sent` | `NULL` | Zeitstempel der letzten Benachrichtigung (30 Minuten Sperrzeit) |

---

## 🌍 Eine neue Sprache ergänzen

Sieben Sprachen liegen bei: Englisch, Deutsch, Französisch, Spanisch, Portugiesisch, Polnisch und Ungarisch (`locales/en.json`, `de.json`, `fr.json`, `es.json`, `pt.json`, `pl.json`, `hu.json`). Um eine davon zu nutzen, trägst du ihren Code in `config/config.jsonc` ein (`"lang": "de"`).

Für eine weitere Sprache:

1. `locales/en.json` kopieren, zum Beispiel als `locales/it.json`
2. Alle Strings übersetzen, den `transcript`-Block eingeschlossen
3. `"lang": "it"` in `config/config.jsonc` setzen, optional auch `"transcriptLang": "it"`

---

## 📝 Lizenz

AGPL-3.0. Der Quellcode muss offen bleiben und bei Weitergabe oder beim Hosten unter derselben Lizenz veröffentlicht werden.

Forks und Änderungen, die die Anbindung an den MSK Transcript Service entfernen oder umgehen, sind nicht gestattet.
