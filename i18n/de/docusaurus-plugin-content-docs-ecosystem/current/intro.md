---
sidebar_position: 1
slug: /
---

# Willkommen im MSK Ecosystem

Das MSK Ecosystem ist eine wachsende Familie selbst gehosteter, datenschutzfreundlicher
Web-Werkzeuge. Alle folgen derselben Gestaltungssprache, denselben Ansprüchen an die
Codequalität und demselben Respekt vor deinen Daten.

---

## Was dazugehört

- **[MSK Paste](msk-paste/index.md)**: eine selbst gehostete Alternative zu Pastebin, mit Syntaxhervorhebung, Passwortschutz und Pastes, die sich nach dem Lesen selbst löschen.
- **[MSK Shortener](msk-shortener/index.md)**: ein selbst gehosteter URL-Kürzer mit anonymer Klickstatistik, QR-Codes und ablaufenden Links.
- **[MSK Forms](msk-forms/index.md)**: eine gehostete Plattform für Formulare und Bewerbungen, mit Live-Statusverfolgung für Bewerber und einem mandantenfähigen Discord-Bot, den jeder Server einladen kann.

Weitere Projekte sind geplant, unter anderem MSK Banking.

---

## Gemeinsame Grundsätze

Jedes Projekt im Ecosystem folgt denselben Regeln:

- **Keine Konten, keine Sitzungen, kein Tracking.** Werkzeuge sind nützlich, ohne dass jemand seine Identität preisgeben muss.
- **Keine Tracker von Dritten.** Kein Google Analytics, kein Plausible, kein Fathom, gar nichts.
- **Keine IP-Adressen im Klartext.** IP-Adressen werden mit einem HMAC-Geheimnis je Installation gehasht.
- **Kein GeoIP.** Standortdaten werden nie erhoben.
- **Wirklich löschen statt nur ausblenden.** Wird etwas entfernt, ob von Hand, durch Ablauf oder nach dem Lesen, ist es tatsächlich weg.
- **Quelloffen unter AGPL-3.0.** Jede Zeile Code lässt sich auf [GitHub](https://github.com/MSK-Scripts) nachlesen.

---

## Gemeinsamer Technikunterbau

| Ebene | Wahl |
|---|---|
| Framework | Next.js 15 (App Router) |
| Sprache | TypeScript (strict) |
| Datenbank | MariaDB über `mysql2` |
| Gestaltung | Tailwind CSS und die MSK Design Tokens |
| Validierung | Zod 4 |
| i18n | next-intl v4 (Deutsch und Englisch, über Cookie) |
| Passwörter | bcryptjs (Kostenfaktor 12) |
| Webserver | Apache2 (Reverse Proxy) |
| Prozessverwaltung | systemd |
| CI/CD | GitHub Actions |

---

:::info
Fragen oder Rückmeldungen? Komm in den [Discord](https://discord.gg/5hHSBRHvJE) oder mach
ein Issue auf [GitHub](https://github.com/MSK-Scripts) auf.
:::
