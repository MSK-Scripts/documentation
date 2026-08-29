---
title: Bedienung
sidebar_position: 3
---

# MSK Shortener benutzen

Diese Seite führt dich durch die Weboberfläche: URLs kürzen, Klickstatistiken ansehen,
QR-Codes herunterladen und Links verwalten.

---

## Eine URL kürzen

Öffne [s.msk-scripts.de](https://s.msk-scripts.de) oder deine eigene Instanz, dann steht
dort das Formular zum Anlegen.

### Felder

| Feld | Pflicht | Hinweise |
|---|---|---|
| **URL** | Pflicht | Die lange URL, die gekürzt werden soll. Muss mit `http://` oder `https://` beginnen. Höchstens 2048 Zeichen. |
| **Eigener Code** | optional | 3 bis 20 Zeichen, nur `a–z`, `A–Z`, `0–9`, `_` und `-`. Ohne Angabe entsteht eine ID mit 7 Zeichen. |
| **Passwort** | optional | 4 bis 100 Zeichen. Besucher müssen es eingeben, bevor sie weitergeleitet werden. |
| **Ablauf** | optional | Ein beliebiger künftiger Zeitpunkt nach ISO 8601. Danach meldet der Link, dass er abgelaufen ist. |

### Was blockiert wird

Aus Sicherheitsgründen lehnt MSK Shortener URLs ab, die auf Folgendes zeigen:

- `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`
- `10.0.0.0/8` (privat)
- `172.16.0.0/12` (privat)
- `192.168.0.0/16` (privat)
- `169.254.0.0/16` (Link-Local)

Das ist der **SSRF-Schutz**. Er verhindert, dass dein Kürzer dazu benutzt wird, Verkehr auf
interne Dienste umzulenken.

### Nach dem Anlegen

Du bekommst:

- die **Kurz-URL**, etwa `https://s.msk-scripts.de/msk`
- einen **Lösch-Token**, den du dir sichern solltest, wenn du den Link später entfernen können willst

:::warning
Den Lösch-Token siehst du **nur ein einziges Mal**, direkt nach dem Anlegen. Es gibt kein
Kontosystem, über das er sich wiederherstellen ließe. Verlierst du ihn, musst du warten,
bis der Link abläuft.
:::

---

## Einen Kurzlink aufrufen

Ruft jemand `s.example.com/:code` auf, passiert Folgendes:

1. Der Link wird nachgeschlagen.
2. Ist er abgelaufen, erscheint die Hinweisseite dazu.
3. Hat er ein Passwort, wird danach gefragt, mit Bremse gegen Durchprobieren.
4. Sonst geht es per 302 weiter zur Ziel-URL.
5. Für die Statistik entsteht eine anonymisierte Klickzeile.

### Passwortgeschützte Links

Bei einem geschützten Kurzlink erscheint eine Passwortabfrage. Stimmt das Passwort, geht es
weiter zur Ziel-URL. Fehlversuche sind auf **10 Versuche je 5 Minuten und IP-Hash**
gebremst, damit niemand das Passwort durchprobiert.

### Abgelaufene Links

Erreicht ein Link seinen Zeitpunkt `expires_at`, meldet die Weiterleitungsroute, dass er
abgelaufen ist. Ein Aufräumauftrag entfernt abgelaufene Zeilen jede Nacht aus der Datenbank,
standardmäßig um 03:30 Uhr Serverzeit.

---

## Klickstatistik

Jeder Kurzlink hat seine eigene Statistikseite unter `s.example.com/:code/stats`. Dort
siehst du:

- **Klicks insgesamt**
- **Zeitverlauf** mit Klicks je Tag für die letzten 30 Tage, einstellbar bis 365
- **Browser**, also Chrome, Firefox, Safari und so weiter
- **Betriebssysteme**, also Linux, Windows, macOS, Android, iOS
- **Gerätetypen**, also Desktop, Mobil und Tablet
- **Häufigste Verweisquellen**, also welche Domains Verkehr auf deinen Link geschickt haben

Eine **Identität des Besuchers** steckt in nichts davon. Jede Klickzeile enthält eine
gehashte IP, die nie zurückgerechnet wird, den Host der Verweisquelle und die
User-Agent-Familie. Mehr nicht.

---

## QR-Codes

Jeden Kurzlink kannst du als QR-Code in zwei Formaten herunterladen:

- **PNG**: `s.example.com/api/links/:code/qr?format=png` (Standard, 512 × 512, MSK-Farben)
- **SVG**: `s.example.com/api/links/:code/qr?format=svg` (skalierbar, vektorbasiert)

Der QR-Code enthält die **Kurz-URL**, nicht die lange. Du kannst ein Etikett also drucken
und das Ziel später trotzdem ändern, indem du den Link löschst und neu anlegst.

```bash
# PNG speichern
curl -o msk.png 'https://s.msk-scripts.de/api/links/msk/qr?format=png'

# SVG speichern
curl -o msk.svg 'https://s.msk-scripts.de/api/links/msk/qr?format=svg'
```

---

## Einen Link löschen

Schick eine `DELETE`-Anfrage mit deinem Token als Bearer-Header:

```bash
curl -X DELETE https://s.msk-scripts.de/api/links/msk \
  -H "Authorization: Bearer dk_a7c4f2e1b9d8..."
```

Die Weboberfläche nimmt den Token auch über eine Löschseite entgegen, wenn du Kurzcode und
Token hast.

---

## Sprachumschalter

Über die Sprachauswahl in der Kopfzeile wechselst du zwischen **Deutsch** und **Englisch**.
Die Wahl landet in einem Cookie und gilt für alle künftigen Besuche aus demselben Browser.
Kurz-URLs tragen kein Sprachpräfix, `s.msk-scripts.de/msk` funktioniert in beiden Sprachen
gleich.

---

## Globale Statistikseite

`/stats` zeigt anonyme Gesamtzahlen über die ganze Instanz:

- insgesamt angelegte Links
- angelegte Links heute und diese Woche
- Klicks insgesamt
- die häufigsten Browser, Betriebssysteme und Geräte

Eine **Aufschlüsselung je Link** gibt es hier nicht, die steht auf der Statistikseite des
jeweiligen Links, und IP-Angaben ebenso wenig.

---

## Grenzen

| Grenze | Wert | Hinweise |
|---|---|---|
| Maximale URL-Länge | 2048 Zeichen | Serverseitig über Zod durchgesetzt. |
| Länge eines eigenen Codes | 3 bis 20 Zeichen | Reservierte Codes wie `api`, `stats` oder `privacy` sind gesperrt. |
| Passwortlänge | 4 bis 100 Zeichen | bcrypt mit Kostenfaktor 12. |
| Ratenbegrenzung beim Anlegen | 20 pro Stunde je IP-Hash | Antwortet mit `429 Too Many Requests` und `Retry-After`. |
| Ratenbegrenzung bei der Passwortprüfung | 10 je 5 Minuten und IP-Hash | Schutz gegen Durchprobieren. |
| Längster Ablauf | jeder künftige ISO-Zeitpunkt | Keine harte Grenze, das Aufräumen der Datenbank läuft nächtlich. |

---

## Wie es weitergeht

- [REST-API](api.md): programmatischer Zugriff für Skripte und Kommandozeilenwerkzeuge
- [Datenschutz und Sicherheit](privacy.md): was MSK Shortener speichert und was nicht
