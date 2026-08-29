---
title: Befehle
description: Alle Slash-Befehle des Discord Giveaway Bots im Überblick, vom Anlegen eines Gewinnspiels bis zu Vorlagen und Nachziehen.
sidebar_position: 2
---

## 💬 Befehle

Alle Befehle sind **Slash-Befehle** in Discord. Sie teilen sich danach auf, wer sie
benutzen darf:

- **Alle**: Befehle zur Information, die jedes Mitglied ausführen kann
- **Manager**: Recht `Server verwalten` **oder** die eingestellte [`manager`-Rolle](./configuration.md#manager-rolle)
- **Server verwalten**: Servereinstellungen, abgesichert über das gleichnamige Discord-Recht

:::tip[Lieber im Browser?]
Jeden Manager-Befehl von unten kannst du auch im [**Web-Dashboard**](./getting-started.md#-web-dashboard) unter [msk-scripts.de/giveaway/dashboard](https://www.msk-scripts.de/giveaway/dashboard) ausführen. Mit Discord anmelden und die Gewinnspiele sichtbar verwalten.
:::

### Manager-Befehle

| Befehl | Beschreibung |
|---|---|
| `/gcreate [mode]` | Öffnet ein Modal, um im **aktuellen Kanal** ein Gewinnspiel anzulegen. `mode` legt fest, wie mehrere Preise verteilt werden |
| `/gedit <id> [title] [description] [winners] [prizes] [mode]` | Ein laufendes Gewinnspiel bearbeiten |
| `/gextend <id> <duration>` | Das Ende eines laufenden Gewinnspiels nach hinten schieben |
| `/gend <id>` | Beendet ein Gewinnspiel sofort und lost die Gewinner aus |
| `/greroll <id> [winner]` | Zieht für ein **beendetes** Gewinnspiel neue Gewinner. Mit `winner` wird nur dieser eine ersetzt |
| `/gcancel <id>` | Bricht ein laufendes Gewinnspiel ab, **ohne** auszulosen |
| `/gpause <id>` | Pausiert ein Gewinnspiel und hält den Zeitgeber an |
| `/gresume <id>` | Setzt ein pausiertes Gewinnspiel fort |
| `/gtemplate save \| from \| list \| delete \| use` | Wiederverwendbare Vorlagen verwalten |

### Alle

| Befehl | Beschreibung |
|---|---|
| `/glist` | Listet die laufenden Gewinnspiele des Servers auf |
| `/ginfo <id>` | Zeigt die Details zu einem bestimmten Gewinnspiel |
| `/gstats` | Zeigt die Gewinnspiel-Statistik dieses Servers (Gesamtzahlen, Teilnahmen, Gewinnquote) |
| `/ghelp` | Überblick über alle Befehle |
| `/ginvite` | Gibt den Einladungslink des Bots zurück |

### Server verwalten

| Befehl | Beschreibung |
|---|---|
| `/gsettings show` | Zeigt die aktuelle Konfiguration des Servers |
| `/gsettings set …` | Setzt oder ergänzt eine Einstellung, siehe [Konfiguration](./configuration.md) |
| `/gsettings remove …` | Entfernt oder leert eine Einstellung, siehe [Konfiguration](./configuration.md) |

> **Die Gewinnspiel-ID** (`<id>`) ist der kurze öffentliche Code in der Fußzeile jedes
> Gewinnspiel-Embeds, etwa `A1B2C3`. Nachschlagen kannst du ihn mit `/glist` oder `/ginfo`.

---

## 🎉 Ein Gewinnspiel anlegen mit `/gcreate`

`/gcreate` öffnet ein Modal mit fünf Feldern:

| Feld | Art | Grenzen |
|---|---|---|
| **Titel** | Kurzer Text | bis zu 256 Zeichen |
| **Beschreibung** | Absatz | bis zu 2000 Zeichen |
| **Dauer** | Kurzer Text | Format wie `1d2h30m`, `45m`, `90s`, **mindestens 10 s, höchstens 1 Jahr** |
| **Gewinner** | Zahl | 1 bis 100 (entfällt, wenn `mode` auf *ein Preis je Gewinner* steht, siehe unten) |
| **Preise** *(optional)* | Absatz | **ein Preis je Zeile**, bis zu 20 Preise, je 256 Zeichen |

### Mehrere Preise

Schreibe einen Preis je Zeile in das Feld **Preise**. Die Option `mode` bei `/gcreate`
entscheidet, wer was bekommt:

| `mode` | Verhalten |
|---|---|
| *Alle bekommen alle Preise* (Standard) | Jeder Gewinner erhält die vollständige Liste. Bei zwei Gewinnern und zwei Preisen bekommen also beide beide. |
| *Ein Preis je Gewinner* | Gewinner 1 bekommt Preis 1, Gewinner 2 bekommt Preis 2 und so weiter. |

Bei *ein Preis je Gewinner* ist die Zahl der Gewinner keine eigene Einstellung mehr, sie
ergibt sich aus der Länge der Preisliste. Das Modal lässt das Feld **Gewinner** deshalb weg
und fragt stattdessen nach den Preisen, und `/gedit` weist einen `winners`-Wert zurück, der
nicht zur Liste passt.

Die Reihenfolge zählt gleich doppelt: Sie bestimmt, wie das Embed die Preise zeigt, und in
welcher Reihenfolge die Gewinner gezogen werden. Wird ein einzelner Gewinner mit
`/greroll <id> <winner>` ersetzt, erbt der Nachrücker **dessen** Preis, die übrigen
Gewinner behalten ihre.

:::info[Du suchst den Tebex-Gutschein?]
Discord begrenzt ein Modal auf fünf Felder, und die nutzt `/gcreate` bereits aus. Der Gewinner-Gutschein wird deshalb im [Web-Dashboard](./getting-started.md#-web-dashboard) eingestellt, beim Anlegen oder Bearbeiten eines Gewinnspiels. Siehe [Tebex-Gutscheine für Gewinner](./configuration.md#tebex-gutscheine-für-gewinner). Im Modus *ein Preis je Gewinner* kannst du im Dashboard die rabattierten Pakete sogar **je Preis** wählen, dann bekommt der Gewinner eines Scripts seinen Rabatt genau auf dieses Script. Rabatthöhe und Gültigkeitsdauer gelten immer für das ganze Gewinnspiel.
:::

:::tip[Preise später ändern]
`/gedit <id> prizes:"Nitro | Steam-Key" mode:"Ein Preis je Gewinner"`. Optionen von Slash-Befehlen dürfen keine Zeilenumbrüche enthalten, trenne die Preise dort also mit `|`. Im [Web-Dashboard](./getting-started.md#-web-dashboard) ist es ein normales mehrzeiliges Feld.
:::

### Das Format der Dauer

Eine Dauer schreibst du als Kette aus `<Zahl><Einheit>`, mit diesen Einheiten:

| Einheit | Bedeutung |
|---|---|
| `d` | Tage |
| `h` | Stunden |
| `m` | Minuten |
| `s` | Sekunden |

**Beispiele:** `1d` (1 Tag) · `2h30m` (2,5 Stunden) · `45m` · `1d2h30m` · `90s`

Das Minimum sind **10 Sekunden**, damit der Zeitplaner mit seinem 10-Sekunden-Takt
überhaupt greifen kann, das Maximum ist **1 Jahr**.

---

## 🔁 Pausieren, fortsetzen, beenden und nachziehen

- **Pausieren** (`/gpause`) hält den Countdown an, die Restzeit bleibt erhalten und der Button ist deaktiviert. **Fortsetzen** (`/gresume`) macht genau dort weiter.
- **Beenden** (`/gend`) schließt ein Gewinnspiel vorzeitig ab und lost sofort aus.
- **Abbrechen** (`/gcancel`) schließt ein Gewinnspiel **ohne** Auslosung.
- **Nachziehen** (`/greroll`) zieht für ein bereits beendetes Gewinnspiel neue Gewinner. Gesperrte Rollen bleiben dabei außen vor. Vergibt das Gewinnspiel [Tebex-Gutscheine](./configuration.md#tebex-gutscheine-für-gewinner), verfällt der Code des ersetzten Gewinners in deinem Shop, bevor der neue seinen bekommt. Ziehst du nur einen Gewinner nach, bleiben die Codes der anderen unberührt.

---

## 🗂️ Vorlagen mit `/gtemplate`

Eine Vorlage ist ein vorbereitetes Gewinnspiel ohne Kanal und ohne Enddatum: Titel,
Beschreibung, Dauer, Anzahl der Gewinner, die [Preisliste](#mehrere-preise) samt
Verteilungsmodus und auf Wunsch eigene
[Teilnahmebedingungen](./configuration.md#sperrliste-zulassungsliste-und-zusatzlose-je-gewinnspiel).
Ideal für alles, was du jede Woche machst.

| Unterbefehl | Beschreibung |
|---|---|
| `/gtemplate save <name> <title> <description> <duration> [winners] [prizes] [mode]` | Sichert eine Vorlage unter einem Namen und überschreibt eine gleichnamige |
| `/gtemplate from <giveaway_id> [name]` | Sichert ein bestehendes Gewinnspiel als Vorlage |
| `/gtemplate list` | Listet alle gesicherten Vorlagen des Servers auf |
| `/gtemplate use <name>` | Legt aus einer Vorlage ein Gewinnspiel im aktuellen Kanal an |
| `/gtemplate delete <name>` | Entfernt eine Vorlage |

`prizes` nimmt mehrere Preise, getrennt durch `|`, zum Beispiel `Script A | Script B`.
Optionen von Slash-Befehlen dürfen keine Zeilenumbrüche enthalten, deshalb steht hier nicht
einer je Zeile wie im Modal beim Anlegen. Steht `mode` auf „ein Preis je Gewinner", richtet
sich die Zahl der Gewinner nach der Preisliste, und die Option `winners` wird abgelehnt,
wenn sie etwas anderes behauptet.

Ein Server kann bis zu 50 Vorlagen halten.

### Ein Gewinnspiel als Vorlage sichern

`/gtemplate from` baut die Vorlage aus einem Gewinnspiel, das du schon hattest, das ist
angenehmer, als alles ein zweites Mal zu tippen. Im Dashboard hat jede Gewinnspielkarte
dafür den Button **Als Vorlage sichern**.

- Übernommen werden: Titel, Beschreibung, Preise, Verteilungsmodus, Anzahl der Gewinner und die Teilnahmebedingungen.
- Die **Dauer** ergibt sich aus der Spanne zwischen Anlegen und geplantem Ende. Ein Gewinnspiel speichert einen Zeitpunkt, eine Vorlage eine Dauer.
- Ohne `name` bekommt die Vorlage den Titel des Gewinnspiels, und ein vorhandener Name wird überschrieben statt abgelehnt.
- Das klappt auch mit laufenden Gewinnspielen, nicht nur mit beendeten.

### Vorlagen im Dashboard

Das [Web-Dashboard](./getting-started.md#-web-dashboard) hat einen Reiter **Vorlagen**, der
dasselbe mit einem Formular erledigt: anlegen, bearbeiten, löschen. Legst du dort ein
Gewinnspiel an, sitzt über dem Formular die Auswahl **Vorlage verwenden**. Wählst du eine
aus, sind alle Felder gefüllt und bleiben trotzdem änderbar. Eine Vorlage ist also ein
Startpunkt, kein festes Formular.

Die Teilnahmebedingungen stecken hinter dem Schalter **Eigene Teilnahmebedingungen**, der
standardmäßig aus ist. Aus bedeutet: Ein Gewinnspiel aus dieser Vorlage nutzt die
Servereinstellungen, spätere Änderungen daran eingeschlossen. Bei einer Vorlage, die du
über Monate behältst, willst du meistens genau das.

Zwei Dinge trägt eine Vorlage bewusst nicht mit:

- **Kanal und Enddatum.** Beides entscheidest du beim Anlegen, und genau deshalb passt eine Vorlage für jeden Durchlauf.
- **Die Gutschein-Konfiguration.** Tebex-Pakete stecken als IDs eines bestimmten Shops darin. Eine Vorlage, die monatelang liegt, würde stillschweigend IDs von Paketen mitschleppen, die es nicht mehr gibt, und das Gewinnspiel daraus würde Rabatt auf nichts vergeben.
