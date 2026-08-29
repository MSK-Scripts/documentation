---
title: Erste Schritte
description: Discord Multi-Bot von MSK Scripts, drei eigenständige Bots in einem Node.js-Prozess, mit Befehlen, Server-Logging und Minispielen.
sidebar_position: 1
---

# Discord Multi-Bot

Ein modulares Discord-Bot-System auf Basis von **discord.js v14**, das drei eigenständige
Bots in einem einzigen Node.js-Prozess betreibt. Entwickelt und gepflegt von
[MSK Scripts](https://www.msk-scripts.de).

Alle drei Bots laufen parallel. Stürzt einer ab, startet er nach 10 Sekunden von selbst
neu, ohne die anderen zu stören.

---

## ✨ Funktionen

### Commands-Bot

| Befehl | Beschreibung | Rollenbeschränkt |
|---|---|---|
| `/information` | Postet ein Server-Info-Embed im eigenen Design | ✅ Manager / Founder |
| `/rules` | Postet die Serverregeln mit Buttons für Verifizierung und Giveaway-Benachrichtigung | ✅ Manager / Founder |
| `/roles` | Postet die Buttons für die Update-Benachrichtigungsrollen der Scripts | ✅ Manager / Founder |
| `/script_guides` | Verlinkt die Dokumentation zu einem ausgewählten Script | ✅ Support und höher |
| `/donation` | Zeigt die Spendenmöglichkeiten mit Zahlungslinks | ✅ Manager / Founder |
| `/order_terms` | Schickt die AGB als PDF mit Buttons zum Annehmen und Ablehnen | ✅ Developer / Manager / Founder |
| `/order_price` | Zeigt einen Bestellpreis mit Buttons zum Annehmen und Ablehnen | ✅ Developer / Manager / Founder |
| `/send_message` | Schickt über ein Modal eine eigene Nachricht in einen beliebigen Kanal | ✅ Manager / Founder |
| `/send_embed` | Schickt ein frei gestaltbares Embed in einen beliebigen Kanal | ✅ Manager / Founder |
| `/backup_database` | Legt ein MySQL-Backup an und lädt es in den Log-Kanal hoch | ✅ Founder |
| `/ping` | Zeigt die Latenz des Bots und die Antwortzeit der API | — |
| `/userinfo` | Zeigt Infos und Minispiel-Punkte eines Nutzers | — |
| `/clear` | Löscht bis zu 100 Nachrichten auf einmal | ✅ Team |
| `/random` | Zieht eine Zufallszahl aus einem Bereich (für Rateaktionen) | ✅ Team |
| `/rg` | Rate die gerade aktive Geheimzahl | — |
| `/flachwitz` | Postet einen zufälligen Flachwitz aus der lokalen Sammlung | — |
| `/add_flachwitz` | Nimmt einen neuen Witz in die Sammlung auf | ✅ Team |

**Dauerhafte Rollen-Buttons**, die einen Neustart des Bots überstehen:

- `✅ Verifizierung` vergibt die Mitgliedsrolle
- `🎁 Giveaway Notify` schaltet die Giveaway-Benachrichtigungsrolle an und aus
- `⏰ Garage / Handcuffs / Storage / Vehicle Keys` schalten die Update-Rollen der Scripts an und aus

---

### Events-Bot

**Server-Logging.** Alle Ereignisse landen als farbige Embeds im eingestellten Log-Kanal:

| Bereich | Was protokolliert wird |
|---|---|
| Mitglieder | Beitritt, Austritt, Kick, Bann, Entbannung, Timeout gesetzt und aufgehoben |
| Rollen | Rolle vergeben (samt Vergebendem), Rolle entzogen (samt Entziehendem) |
| Benutzer- und Anzeigename | Benutzername geändert, Servername geändert |
| Nachrichten | Bearbeitet, gelöscht (samt Löschendem), Massenlöschung (samt Löschendem) |
| Kanäle | Erstellt, gelöscht, geändert (Name, Thema, Slowmode, NSFW) |
| Serverrollen | Erstellt, gelöscht, geändert (Name, Farbe, Rechteunterschiede) |
| Sprachkanäle | Betreten, verlassen, verschoben, servermuted und entmutet, servertaub und enttaubt |
| Einladungen | Erstellt (mit maximaler Nutzung und Ablauf), gelöscht |

**Zusätzliches Verhalten:**

- **Automatische Antwort**, sobald jemand außerhalb des Teams „Musiker15" erwähnt
- **Feedback-Embed**: Nachrichten im Feedback-Kanal werden automatisch in Embeds im eigenen Design umgewandelt, die ursprüngliche Nachricht wird gelöscht

**Kontextmenüs** (Rechtsklick auf eine Nachricht):

| Befehl | Beschreibung | Rollenbeschränkt |
|---|---|---|
| `📝 Feedback kommentieren` | Ergänzt ein Feedback-Embed um einen Kommentar der Moderation und schickt dem Verfasser eine DM | ✅ Manager / Founder |
| `💬 Auf eine Nachricht antworten` | Schickt über ein Modal eine Antwort auf eine beliebige Nachricht | ✅ Manager / Founder |
| `✏️ Nachricht bearbeiten` | Bearbeitet eine Nachricht des Bots über ein Modal | ✅ Manager / Founder |
| `🖼️ Embed bearbeiten` | Bearbeitet ein Embed des Bots über ein Modal (Titel, Beschreibung, Thumbnail, Bild, Fußzeile) | ✅ Manager / Founder |

---

### Minispiele-Bot

Alle Minispiele laufen sitzungsbasiert, es gibt also keinen globalen Zustand, und jeder
Ausgang bringt Punkte oder zieht welche ab. Mit `/points` siehst du deinen Punktestand und
wie weit es noch bis zur nächsten Belohnung ist.

#### Befehle

| Befehl | Beschreibung |
|---|---|
| `/8ball` | Magische 8-Kugel, beantwortet Ja-Nein-Fragen |
| `/dice` | Würfeln, von W4 bis W100, 1 bis 10 Würfel |
| `/flipcoin` | Münzwurf, Kopf oder Zahl |
| `/rps` | Schere, Stein, Papier gegen den Bot |
| `/slots` | Spielautomat mit animierter Drehung und 7 Symbolstufen |
| `/trivia` | Quiz mit Mehrfachauswahl (OpenTrivia DB, lokal abgesichert) |
| `/hangman` | Klassisches Galgenmännchen mit Buchstabeneingabe per Modal |
| `/wordle` | Wordle, das Wort aus 5 Buchstaben in 6 Versuchen |
| `/tictactoe` | Tic Tac Toe, KI in Leicht, Mittel und Minimax-Schwer |
| `/connect4` | Vier gewinnt, mit Bot-KI für Gewinn, Block und Mitte |
| `/blackjack` | Blackjack mit Hit, Stand und Double Down gegen den Dealer |
| `/points` | Zeigt deinen Punktestand mit Fortschrittsbalken |

> `/8ball` ist vom Punktesystem ausgenommen.

#### Belohnungsstufen

| Punkte | Belohnung |
|---|---|
| 500 | 🥉 Bronze Player |
| 1.500 | 🥈 Silver Player |
| 4.000 | 🥇 Gold Player |
| 10.000 | 💎 Diamond Player |

> Punktwerte und Belohnungen lassen sich in `bots/minigames/points_config.json` anpassen.
> Trage dort Discord-Rollen-IDs ein, damit die Rollen automatisch vergeben werden, und
> starte den Bot nach Änderungen neu.

---

## 📁 Projektstruktur

```
discord_multibot_js/
├── main.js                          ← Startet alle 3 Bots, kümmert sich um Neustarts
├── package.json
├── .env                             ← Nicht im Repository (siehe .gitignore)
├── .github/
│   └── dependabot.yml               ← Wöchentliche Prüfung auf Abhängigkeits-Updates
├── core/
│   ├── config.js                    ← Konfiguration aus der Umgebung
│   ├── utils.js                     ← Gemeinsame Helfer (makeEmbed, readJson, …)
│   └── pointsManager.js             ← Punkte lesen und schreiben, Belohnungshinweise
├── data/
│   ├── points.json                  ← Punktestände (wird angelegt)
│   └── backups/                     ← Datenbank-Backups (werden angelegt und aufgeräumt)
├── assets/                          ← Statische Dateien, etwa die AGB als PDF
└── bots/
    ├── commands/
    │   ├── bot.js
    │   └── commands/
    │       ├── community.js          ← /information, /rules, /roles
    │       ├── admin.js              ← /backup_database, /send_message, /send_embed
    │       ├── support.js            ← /script_guides
    │       ├── orders.js             ← /donation, /order_terms, /order_price
    │       ├── utility.js            ← /ping, /userinfo, /clear
    │       └── minigames.js          ← /random, /rg, /flachwitz, /add_flachwitz
    ├── events/
    │   ├── bot.js
    │   └── handlers/
    │       ├── logging.js
    │       ├── messageHandler.js
    │       └── contextMenus.js
    └── minigames/
        ├── bot.js
        ├── points_config.json
        └── commands/
            ├── eightball.js, dice.js, flipcoin.js, rps.js
            ├── slots.js, trivia.js, hangman.js, wordle.js
            ├── tictactoe.js, connect4.js, blackjack.js, points.js
```

---

## 📝 Lizenz

AGPL-3.0. Der Quellcode muss offen bleiben und bei Weitergabe oder beim Hosten unter
derselben Lizenz veröffentlicht werden.
