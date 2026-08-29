---
title: Überblick
sidebar_position: 1
---

# MSK Paste

**Eine selbst gehostete, datenschutzfreundliche Alternative zu Pastebin**, Teil des
MSK Ecosystem neben [MSK Shortener](https://s.msk-scripts.de).

- **Öffentliche Instanz:** [paste.msk-scripts.de](https://paste.msk-scripts.de)
- **Quellcode:** [github.com/MSK-Scripts/msk-paste](https://github.com/MSK-Scripts/msk-paste)
- **Lizenz:** AGPL-3.0-or-later

---

## Was ist MSK Paste?

MSK Paste ist ein direkter Ersatz für Pastebin oder Hastebin, für dich allein oder im Team.
Gebaut ist es zum Teilen von Codeschnipseln, Logs und Konfigurationsdateien, ganz ohne
Analyse, Tracking-Cookies oder Benutzerkonten.

Die gehostete Instanz unter [paste.msk-scripts.de](https://paste.msk-scripts.de) ist
kostenlos nutzbar. Willst du deine Daten vollständig selbst in der Hand haben, kannst du es
auch auf deinem eigenen Server betreiben, siehe [Installation](installation.md).

---

## Funktionen

- **Syntaxhervorhebung** für über 30 Sprachen über [Shiki](https://shiki.style/), mit den Grammatiken aus VS Code und serverseitig gerendert
- **Passwortschutz** mit bcrypt (Kostenfaktor 12)
- **Ablaufdatum** von 10 Minuten bis zu 1 Jahr
- **Nach dem Lesen löschen**: Der Paste verschwindet automatisch nach dem ersten Aufruf
- **Eigene Paste-IDs** (4 bis 32 Zeichen, `[a-zA-Z0-9_-]`)
- **Rohansicht** (`/raw/:id`) und **Download** (`/dl/:id`) mit passender Dateiendung
- **Lösch-Token**: Pastes ohne Konto wieder entfernen
- **REST-API** für Kommandozeilenwerkzeuge und Automatisierung
- **Zweisprachige Oberfläche** (Deutsch und Englisch), umschaltbar über ein Cookie
- **Öffentliche Statistikseite** mit anonymen Gesamtzahlen
- **Kein Tracking, keine Analyse, kein GeoIP**

---

## Unterstützte Sprachen

```
plaintext, bash, shell, powershell,
c, cpp, csharp, go, java, kotlin, rust, swift,
javascript, typescript, jsx, tsx,
python, ruby, php, perl,
html, css, scss, sass,
json, yaml, toml, xml,
sql, graphql, markdown, dockerfile, lua, diff
```

Fehlt dir eine Sprache, mach gern
[ein Issue auf](https://github.com/MSK-Scripts/msk-paste/issues).

---

## Technikunterbau

| Ebene | Technik |
|---|---|
| Framework | Next.js 15 (App Router) |
| Sprache | TypeScript (strict) |
| Datenbank | MariaDB (über `mysql2`) |
| Gestaltung | Tailwind CSS und die MSK Design Tokens |
| Validierung | Zod 4 |
| i18n | next-intl v4 |
| Syntaxhervorhebung | Shiki |
| Passwörter | bcryptjs (Kostenfaktor 12) |
| Webserver | Apache2 (Reverse Proxy) |
| Prozessverwaltung | systemd |

---

## Wie es weitergeht

- [Installation](installation.md): MSK Paste auf deinem eigenen Debian- oder Ubuntu-Server betreiben
- [Bedienung](usage.md): Pastes anlegen, ansehen und verwalten
- [REST-API](api.md): programmatischer Zugriff für Skripte und Kommandozeilenwerkzeuge
- [Datenschutz und Sicherheit](privacy.md): was gespeichert wird und was nicht
- [FAQ](faq.md): häufige Fragen und Fehlersuche

---

:::info
Fragen oder Rückmeldungen? Komm in den [Discord](https://discord.gg/5hHSBRHvJE) oder mach
ein Issue auf [GitHub](https://github.com/MSK-Scripts/msk-paste/issues) auf.
:::
