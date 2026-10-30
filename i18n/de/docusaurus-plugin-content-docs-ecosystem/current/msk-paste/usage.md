---
title: Bedienung
sidebar_position: 3
---

# MSK Paste benutzen

Diese Seite führt dich durch die Weboberfläche: Pastes anlegen, ansehen und verwalten.

---

## Einen Paste anlegen

Öffne [paste.msk-scripts.de](https://paste.msk-scripts.de) oder deine eigene Instanz, dann
steht dort das Formular zum Anlegen.

### Felder

| Feld | Pflicht | Hinweise |
|---|---|---|
| **Titel** | optional | Höchstens 100 Zeichen. Dient beim Download als Dateiname. |
| **Inhalt** | Pflicht | Der Text, den du teilen willst. Harte Grenze: **1 MB**. |
| **Sprache** | optional | Aus der Liste wählen, damit die Syntaxhervorhebung greift. Standard ist einfacher Text. |
| **Ablauf** | Pflicht | 10 Minuten, 1 Stunde, 1 Tag, 1 Woche, 1 Monat oder 1 Jahr. Standard: **1 Woche**. |
| **Passwort** | optional | Sichert den Zugriff ab. Der Paste selbst liegt unverschlüsselt, das Passwort schützt das Ansehen. |
| **Nach dem Lesen löschen** | optional | Ist es aktiv, wird der Paste nach dem ersten erfolgreichen Aufruf **endgültig gelöscht**. |
| **Eigene ID** | optional | 4 bis 32 Zeichen, nur `a–z`, `A–Z`, `0–9`, `_` und `-`. Reservierte IDs (`raw`, `api`, `stats`, …) werden abgelehnt. |

### Spamschutz

Bevor ein Paste entsteht, prüft das Formular ein paar Dinge. Das meiste davon merkst du
nicht:

- **Cloudflare Turnstile** läuft auf der Seite. Meist geht die Prüfung von allein durch, manchmal sollst du ein Kästchen anklicken.
- Die Anfrage muss von der Seite selbst kommen. Ein verstecktes Feld, das Menschen nie sehen, muss leer bleiben, und das Formular muss frühestens 2 Sekunden und spätestens 24 Stunden nach dem Laden der Seite abgeschickt werden. War der Tab länger offen, lade die Seite neu.
- Je IP-Adresse und 24 Stunden legt das Formular höchstens **20 Pastes mit zusammen 5 MB** an, zusätzlich zur Grenze pro Stunde.

Manche Inhalte werden abgelehnt, im Formular genauso wie über die
[REST-API](api.md#inhaltsprüfung):

- **Kodierte Dateien:** ein ununterbrochener Block von 16 KB aus Base64- oder Hex-Zeichen, oder ein Paste ab 64 KB, der fast nur aus umbrochenem Base64 besteht.
- **Linkspam:** 3 oder mehr Links, die mindestens die Hälfte des Textes ausmachen, oder 3 oder mehr Links als BBCode `[url=` oder HTML `<a href=`.
- **Wiederholungen:** derselbe Inhalt noch einmal innerhalb von 24 Stunden.

### Nach dem Anlegen

Du bekommst:

- die **Paste-URL**, etwa `https://paste.msk-scripts.de/X7q9bA2k`
- die **Roh-URL** (`/raw/X7q9bA2k`)
- einen **Lösch-Token**, den du dir sichern solltest, wenn du den Paste später entfernen können willst

:::warning
Den Lösch-Token siehst du **nur ein einziges Mal**, direkt nach dem Anlegen. Es gibt kein
Kontosystem, über das er sich wiederherstellen ließe. Verlierst du ihn, musst du warten,
bis der Paste abläuft.
:::

---

## Einen Paste ansehen

Ruf `/:id` auf, dort steht der Paste mit Syntaxhervorhebung, Zeilennummern und einem
Kopier-Button.

Die Ansicht bietet:

- **Kopieren**: legt den Rohinhalt in deine Zwischenablage
- **Roh**: öffnet `/raw/:id` (`text/plain`, praktisch für `curl`)
- **Download**: öffnet `/dl/:id` und speichert den Paste als Datei mit passender Endung (`.lua`, `.js`, `.py`, …)
- **Löschen**: erscheint nur, wenn du den Lösch-Token als URL-Parameter mitgibst

### Passwortgeschützte Pastes

Rufst du einen geschützten Paste auf, fragt `/:id/password` nach dem Passwort. Stimmt es,
erscheint der Inhalt direkt, ein zusätzlicher Umweg entfällt. Fehlversuche zählen **nicht**
im Aufrufzähler mit.

### Nach dem Lesen löschen

Ein solcher Paste zeigt vor dem ersten Aufdecken eine Warnung. Nach dem Ansehen wird er in
derselben SQL-Transaktion aus der Datenbank gelöscht. Weitere Aufrufe zeigen den Zustand
„verbrannt".

### Abgelaufene Pastes

Erreicht ein Paste seinen Zeitpunkt `expires_at`, meldet die Ansicht, dass er abgelaufen
ist. Ein Aufräumauftrag entfernt abgelaufene Zeilen jede Nacht aus der Datenbank,
standardmäßig um 03:30 Uhr Serverzeit.

---

## Einen Paste löschen

Hänge deinen Lösch-Token an die URL:

```
https://paste.msk-scripts.de/X7q9bA2k?token=dk_a7c4f2e1b9d8...
```

In der Ansicht erscheint dann ein Lösch-Button. Bestätigst du, ist der Paste sofort weg.

Alternativ geht das über die REST-API:

```bash
curl -X DELETE "https://paste.msk-scripts.de/api/pastes/X7q9bA2k?token=dk_a7c4f2e1b9d8..."
```

---

## Rohansicht und Download

Diese beiden Routen sind für Automatisierung und Kommandozeilenwerkzeuge gedacht.

### Roh

```bash
curl https://paste.msk-scripts.de/raw/X7q9bA2k
```

Liefert den Inhalt als `text/plain; charset=utf-8`. Kein HTML, keine Hervorhebung, nichts
drumherum, ideal zum Weiterreichen an `bash`, `python` oder `jq`.

### Download

```bash
curl -OJ https://paste.msk-scripts.de/dl/X7q9bA2k
```

Schickt `Content-Disposition: attachment; filename="..."`. Der Dateiname entsteht aus dem
Titel des Pastes (bereinigt) und bekommt die übliche Endung der gewählten Sprache.

---

## Sprachumschalter

Über die Sprachauswahl in der Kopfzeile wechselst du zwischen **Deutsch** und **Englisch**.
Die Wahl landet in einem Cookie und gilt für alle künftigen Besuche aus demselben Browser.
Paste-URLs tragen kein Sprachpräfix, `paste.msk-scripts.de/X7q9bA2k` funktioniert in beiden
Sprachen gleich.

---

## Statistikseite

`/stats` zeigt anonyme Gesamtzahlen über die ganze Instanz:

- insgesamt angelegte Pastes
- angelegte Pastes heute und diese Woche
- die meistgenutzten Sprachen

Es gibt **keine Aufrufverfolgung je Paste**, keine IP-Angaben und keine Aufschlüsselung,
über die sich einzelne Nutzer erkennen ließen.

---

## Grenzen

| Grenze | Wert | Hinweise |
|---|---|---|
| Maximale Paste-Größe | 1 MB | Serverseitig über Zod und die Datenbankspalte durchgesetzt. |
| Maximale Titellänge | 100 Zeichen | In der Oberfläche gekürzt, von der API abgelehnt. |
| Ratenbegrenzung im Formular | 10 pro Stunde je IP-Hash | Antwortet mit `429 Too Many Requests` und `Retry-After`. |
| Tagesgrenze im Formular | 20 Pastes und 5 MB je IP-Adresse und 24 Stunden | Antwortet mit `429` und `code: "daily-limit"`. |
| Ratenbegrenzung mit API-Key | 120 pro Stunde je Key | Antwortet mit `429` und `code: "key-limit"`. |
| Längster Ablauf | 1 Jahr | Nach dem Anlegen nicht verlängerbar. |
| Länge einer eigenen ID | 4 bis 32 Zeichen | Reservierte IDs werden beim Anlegen blockiert. |

---

## Wie es weitergeht

- [REST-API](api.md): programmatischer Zugriff für Skripte und Kommandozeilenwerkzeuge
- [Datenschutz und Sicherheit](privacy.md): was MSK Paste speichert und was nicht
