---
title: Überblick
sidebar_position: 1
---

# MSK Forms

**Bewerbungen und Formulare mit einer echten Statusrückmeldung**, Teil des MSK Ecosystem
neben [MSK Paste](../msk-paste/index.md) und [MSK Shortener](../msk-shortener/index.md).

- **Gehostet unter:** [forms.msk-scripts.de](https://forms.msk-scripts.de)
- **Quellcode:** [github.com/MSK-Scripts/msk-forms](https://github.com/MSK-Scripts/msk-forms) (öffentlich einsehbar, proprietäre Lizenz)
- **Preise:** [forms.msk-scripts.de/pricing](https://forms.msk-scripts.de/pricing), Free, Pro und Enterprise, je Discord-Server

---

## Was ist MSK Forms?

MSK Forms ist ein Formularbaukasten, vergleichbar mit Google Forms oder Typeform, mit zwei
Dingen, die es dort nicht gibt:

1. **Eine Statusrückmeldung für Bewerber.** Jede Einsendung bekommt einen privaten Link. Der Bewerber öffnet ihn und sieht seinen Status live, auf derselben Seite, auf der er sich beworben hat, ganz ohne Anmeldung. Schluss mit *„habt ihr meine Bewerbung überhaupt gesehen?"*.
2. **Einen Discord-Bot, den jeder Server einladen kann.** Formulare gehören zu einem Discord-Server (einer *Guild*). Poste ein Formular in einen Kanal, sieh dir Einsendungen an, nimm sie per Button an oder lehne sie ab, vergib automatisch eine Rolle und schick dem Bewerber sein Ergebnis per DM, alles aus Discord heraus.

Gebaut ist es für Communitys, die rekrutieren: FiveM- und Rollenspielserver mit
Whitelist- und Team-Bewerbungen, Gaming-Clans, Discord-Communitys und jedes Team, das ein
Bewerbungsverfahren betreibt und will, dass Bewerber wirklich wissen, woran sie sind.

Das ist ein **gehosteter Dienst**, du installierst nichts. Du lädst den Bot ein, meldest
dich mit Discord an und baust deine Formulare im Dashboard.

---

## Warum MSK Forms?

| Funktion | Google Forms | Typeform | **MSK Forms** |
|---|:-:|:-:|:-:|
| Kostenloser Einstieg ohne Bezahlschranke je Antwort | ✅ | ⚠️ | ✅ |
| **Live-Statusrückmeldung an den Bewerber** | ❌ | ❌ | ✅ |
| **Eigener Discord-Bot** (posten, prüfen, Rolle vergeben, DMs) | ❌ | ❌ | ✅ |
| Prüfablauf mit eigenen Status und Kanban | ❌ | ⚠️ | ✅ |
| Bedingte Logik und mehrere Schritte | ⚠️ | ✅ | ✅ |
| Quiz, Punkte und berechnete Felder | ✅ | ⚠️ | ✅ |
| A/B-Tests | ❌ | ⚠️ | ✅ |
| Eigene Domain und eigenes Design | ❌ | ✅ | ✅ |
| Webhooks, Zapier und Make, REST-API | ⚠️ | ✅ | ✅ |
| DSGVO-Selbstbedienung (zurückziehen, exportieren, löschen) | ❌ | ⚠️ | ✅ |
| 7 Sprachen in der Oberfläche | ✅ | ✅ | ✅ |
| Installierbare PWA mit Statusseite offline | ❌ | ❌ | ✅ |

---

## Die wichtigsten Funktionen

- **Formularbaukasten ohne Code**: über 25 Feldtypen (Text, Auswahl, Datum, Telefon, Datei- und Bild-Upload, Unterschrift, Bewertung, NPS, Schieberegler, Matrix und mehr), mehrseitige Formulare, Layout-Blöcke
- **Bedingte Logik**: Felder je nach Antwort zeigen, verbergen oder verpflichtend machen und zwischen Seiten springen
- **Quiz und Punkte**: Punkte je Option, berechnete Felder mit Formeln, automatische Entscheidungen anhand der Punktzahl
- **A/B-Tests**: Formulartexte gegeneinander testen, Aufrufe und Abschlüsse messen
- **Prüfablauf**: eigene Status, ein Kanban-Board, Sammelaktionen und Exporte (CSV, XLSX, JSON, PDF)
- **Die Statusrückmeldung**: Bewerber verfolgen ihren Status live über einen privaten Link, Änderungen kommen sofort an
- **Discord-Bot**: `/forms`-Befehle, Prüf-Embeds mit Buttons zum Annehmen und Ablehnen, automatische Rollenvergabe, Status-DMs und ein Aktivitätsprotokoll je Server
- **Eigenes Design**: Akzentfarbe, Logo, eigenes CSS und deine eigene Domain mit automatischem TLS
- **Automatisierung und Anbindungen**: Wenn-dann-Regeln, ausgehende Webhooks (HMAC-signiert), Zapier und Make sowie eine REST-API
- **Selbstbedienung für Bewerber (DSGVO)**: Einsendung zurückziehen, exportieren oder löschen, direkt auf der Statusseite
- **7 Sprachen**: Englisch, Deutsch, Ungarisch, Französisch, Spanisch, Portugiesisch (BR) und Polnisch
- **Installierbare PWA**: auf den Startbildschirm legen, die Statusseite funktioniert auch offline

---

## Technikunterbau

| Ebene | Technik |
|---|---|
| Framework | Next.js 16 (App Router, React 19), TypeScript |
| Datenbank | PostgreSQL 16 über Prisma 7 (Driver Adapter) |
| Cache und Ratenbegrenzung | Redis 7 |
| Speicher | MinIO (S3-kompatibel) für Datei-Uploads |
| Bot | discord.js v14, mandantenfähig |
| Echtzeit | WebSocket-Dienst über `LISTEN/NOTIFY` von Postgres |
| Gestaltung | Tailwind CSS, shadcn/ui und die MSK Design Tokens |
| Captcha | Cloudflare Turnstile (optional) |
| Abrechnung | Stripe |
| Webserver | Apache2 (Reverse Proxy) |
| CI/CD | GitHub Actions |

---

## Wie es weitergeht

- [Erste Schritte](getting-started.md): Bot einladen, erstes Formular bauen, posten, erste Einsendung prüfen
- [Formularbaukasten](form-builder.md): alle Feldtypen, bedingte Logik, Zeitsteuerung, Punkte, A/B-Tests, Automatisierung
- [Einsendungen und Prüfung](submissions-and-review.md): Statusverlauf, eigene Status, Kanban-Board, Sammelaktionen, Exporte
- [Discord-Bot](discord-bot.md): Befehle, Prüfkanal, Annehmen und Ablehnen, Status-DMs, Aktivitätsprotokoll, Sprache des Bots
- [Design und eigene Domains](branding-and-domains.md): Akzent, Logo, eigenes CSS, deine Domain, Login und Captcha je Server
- [Anbindungen und API](integrations-and-api.md): Webhooks, Zapier und Make, die REST-API und API-Keys
- [Tarife und Grenzen](plans.md): was Free, Pro und Enterprise freischalten
- [Datenschutz und Sicherheit](privacy.md): welche Daten gespeichert werden, Selbstbedienung für Bewerber, DSGVO, Sicherheitsmodell
- [FAQ](faq.md): häufige Fragen und Fehlersuche

---

:::info
Fragen oder Rückmeldungen? Komm in den [Discord](https://discord.gg/5hHSBRHvJE) oder mach
ein Issue auf [GitHub](https://github.com/MSK-Scripts/msk-forms/issues) auf.
:::
