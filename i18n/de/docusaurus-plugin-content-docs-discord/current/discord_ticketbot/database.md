---
title: Datenbank
description: Datenbank-Backends des Ticket Bots, SQLite als Standard, dazu MySQL/MariaDB und PostgreSQL
sidebar_position: 4
---

## 🗄️ Datenbank

Der Bot legt alles in einer Datenbank ab, die beim ersten Start automatisch entsteht.
Standardmäßig ist das eine lokale **SQLite**-Datei, dafür musst du nichts einrichten.
Wahlweise kannst du den Bot stattdessen auf eine externe **MySQL/MariaDB**- oder
**PostgreSQL**-Datenbank zeigen lassen.

Welches Backend es wird, entscheidet eine einzige Umgebungsvariable: `DATABASE_URL`.

---

## Backend auswählen

Setze `DATABASE_URL` in deiner `.env`:

```bash
# Nicht gesetzt oder leer → mitgelieferte SQLite-Datei (data/tickets.db). Standard.
# DATABASE_URL=""

# MySQL / MariaDB
DATABASE_URL="mysql://user:password@host:3306/ticketbot"

# PostgreSQL
DATABASE_URL="postgres://user:password@host:5432/ticketbot"

# SQLite an einem eigenen Pfad
DATABASE_URL="sqlite:./data/tickets.db"
```

| Backend | `DATABASE_URL` | Hinweise |
|---|---|---|
| **SQLite** (Standard) | *nicht gesetzt* oder `sqlite:./pfad.db` | Keine Einrichtung nötig, die Datei entsteht von selbst. Die beste Wahl, wenn du auf einem Server hostest. |
| **MySQL / MariaDB** | `mysql://…` oder `mariadb://…` | Standardport `3306`. |
| **PostgreSQL** | `postgres://…` oder `postgresql://…` | Standardport `5432`. |

> 💾 **Du musst keinen Treiber nachinstallieren.** Die Treiber für MySQL (`mysql2`) und
> PostgreSQL (`pg`) liegen dem Bot bei, ein normales `npm install` deckt alle drei
> Backends ab.

> 🔐 **Zugangsdaten gehören in die `.env`, niemals in die `config.jsonc`.** Die
> Konfigurationsdatei lässt sich über das gehostete Dashboard bearbeiten und darf
> deshalb keine Datenbankpasswörter enthalten.

---

## TLS / SSL

Verlangt eine verwaltete Datenbank eine verschlüsselte Verbindung, hängst du
`?ssl=true` (oder `?sslmode=require`) an die URL an:

```bash
DATABASE_URL="postgres://user:password@db.example.com:5432/ticketbot?ssl=true"
```

---

## Eine bestehende SQLite-Datenbank umziehen

Wenn du den Bot bisher mit SQLite betrieben hast und auf MySQL oder PostgreSQL
wechseln willst, kopierst du deine Daten mit dem beiliegenden Migrationsskript.
Ticket-Verlauf, Bewertungen und Statistiken bleiben dabei erhalten.

```bash
# Liest data/tickets.db, schreibt in die Datenbank aus DATABASE_URL
npm run db:migrate
```

Quelle und Ziel kannst du auch ausdrücklich angeben:

```bash
node scripts/migrate-db.js --from ./data/tickets.db --to "postgres://user:pass@host:5432/ticketbot"
```

Das Skript legt das Zielschema automatisch an, kopiert jede Tabelle in einer
Reihenfolge, die die Fremdschlüssel respektiert, behält die ursprünglichen
Primärschlüssel und setzt bei PostgreSQL die ID-Sequenzen zurück, damit neu
erstellte Tickets nicht kollidieren.

> ⚠️ **Eingebaute Sicherung.** Die Migration bricht ab, wenn die Zieldatenbank
> bereits Daten enthält. Mit `--force` schreibst du trotzdem in ein nicht leeres Ziel.

---

## Wie es funktioniert

- Das Schema ist bei allen drei Engines identisch, nur die Spaltentypen
  unterscheiden sich intern. Zeitstempel liegen als Ganzzahlen, Wahrheitswerte als
  `0/1`, das Verhalten ist also unabhängig vom Backend dasselbe.
- Fehlende Spalten kommen beim Start automatisch dazu (Inline-Migrationen). Ein
  Update des Bots verlangt deshalb nie Handarbeit an der Datenbank.
- Ein Wechsel des Backends verschiebt deine Daten **nicht** von allein, dafür ist
  `npm run db:migrate` da.

> ℹ️ **Wer bereits SQLite nutzt, muss nichts ändern.** Ohne `DATABASE_URL` bleibt der
> Bot bei `data/tickets.db`, genau wie vorher.
