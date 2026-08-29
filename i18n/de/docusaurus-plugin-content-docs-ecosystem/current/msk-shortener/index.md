---
title: Überblick
sidebar_position: 1
---

# MSK Shortener

**Ein selbst gehosteter URL-Kürzer mit Klickstatistik, QR-Codes und Passwortschutz**, das
erste Webprojekt im MSK Ecosystem.

- **Öffentliche Instanz:** [s.msk-scripts.de](https://s.msk-scripts.de)
- **Quellcode:** [github.com/MSK-Scripts/msk-shortener](https://github.com/MSK-Scripts/msk-shortener)
- **Lizenz:** AGPL-3.0-or-later

---

## Was ist MSK Shortener?

MSK Shortener macht aus langen URLs kurze, teilbare Links, so wie Bitly oder TinyURL, aber
**ohne Verfolgung**. Gebaut ist er für den privaten Gebrauch, für Abläufe im Team und für
kleine Communitys, die eine eigene Kurzlink-Domain haben wollen.

Die gehostete Instanz unter [s.msk-scripts.de](https://s.msk-scripts.de) ist kostenlos
nutzbar. Willst du eine eigene Kurzdomain wie `s.example.com`, kannst du ihn auf deinem
eigenen Server betreiben, siehe [Installation](installation.md).

---

## Funktionen

- **Automatisch erzeugte Kurzcodes** (standardmäßig 7 Zeichen) über nanoid
- **Eigene Kurzcodes**, frei wählbar (3 bis 20 Zeichen, `[a-zA-Z0-9_-]`)
- **Klickstatistik** mit anonymem Zeitverlauf, Auswertung nach Browser, Betriebssystem und Gerät sowie den häufigsten Verweisquellen
- **QR-Codes** als PNG oder SVG im MSK-Design zum Herunterladen
- **Passwortschutz** mit bcrypt (Kostenfaktor 12) und Bremse gegen Durchprobieren
- **Ablaufdatum**: Links verfallen zu jedem gewünschten Zeitpunkt
- **Lösch-Token**: Links ohne Konto wieder entfernen
- **REST-API** für jede Funktion der Oberfläche
- **Zweisprachige Oberfläche** (Deutsch und Englisch), umschaltbar über ein Cookie
- **Globale Statistikseite** mit anonymen Gesamtzahlen
- **SSRF-Schutz**: private IP-Bereiche (RFC 1918, Loopback, Link-Local) werden als Ziel abgelehnt
- **Keine Tracking-Cookies, kein GeoIP, keine Analyse durch Dritte**

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
| Passwörter | bcryptjs (Kostenfaktor 12) |
| Kurzcodes | nanoid |
| QR-Codes | `qrcode` |
| Diagramme | Recharts |
| User-Agent auswerten | `ua-parser-js` |
| Webserver | Apache2 (Reverse Proxy) |
| Prozessverwaltung | systemd |

---

## Wie die Klickerfassung funktioniert

Anders als MSK Paste, das nur Aufrufe zählt, legt MSK Shortener für eine reichhaltigere
Statistik anonymisierte Zeilen **je Klick** an. Keine dieser Angaben identifiziert den
Besucher:

| Wird gespeichert | Wird nicht gespeichert |
|---|---|
| Zeitstempel | IP-Adresse im Klartext |
| Browserfamilie, etwa `Firefox` | Vollständiger User-Agent |
| Betriebssystemfamilie, etwa `Linux` | GeoIP und Land |
| Gerätetyp (`desktop`, `mobile`, `tablet`) | Cookies |
| Host der Verweisquelle | Query-Strings |
| HMAC-SHA-256(IP) | Konto- und Sitzungsdaten |

IPs werden mit einem serverseitigen Geheimnis (`IP_HASH_SECRET`) über HMAC-SHA-256 gehasht
und lassen sich ohne dieses Geheimnis nicht zurückrechnen.

---

## Wie es weitergeht

- [Installation](installation.md): MSK Shortener auf deinem eigenen Debian- oder Ubuntu-Server betreiben
- [Bedienung](usage.md): Links anlegen, verwalten und auswerten
- [REST-API](api.md): programmatischer Zugriff für Skripte und Kommandozeilenwerkzeuge
- [Datenschutz und Sicherheit](privacy.md): was gespeichert wird und was nicht
- [FAQ](faq.md): häufige Fragen und Fehlersuche

---

:::info
Fragen oder Rückmeldungen? Komm in den [Discord](https://discord.gg/5hHSBRHvJE) oder mach
ein Issue auf [GitHub](https://github.com/MSK-Scripts/msk-shortener/issues) auf.
:::
