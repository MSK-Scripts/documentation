---
title: REST-API
sidebar_position: 4
---

# REST-API

MSK Shortener bringt eine vollständige JSON-REST-API mit. Alles, was die Weboberfläche kann,
geht auch programmatisch, praktisch für Kommandozeilenwerkzeuge, Skripte, CI-Pipelines und
die Anbindung an Discord-Bots.

**Basis-URL:** `https://s.msk-scripts.de/api`, bei einer eigenen Instanz entsprechend deine
Domain.

---

## Authentifizierung

Es gibt **keinen API-Key**. Alle Endpunkte sind öffentlich. Schreibende Aufrufe (anlegen und
löschen) sind abgesichert über:

- eine **Ratenbegrenzung** von 20 Anlagen pro Stunde je IP-Hash
- **einmalige Lösch-Token**, die beim Anlegen zurückkommen, für `DELETE`
- eine **eigene Begrenzung beim Prüfen**, 10 Passwortversuche je 5 Minuten bei geschützten Links

---

## Aufbau einer Fehlermeldung

Alle Fehler haben dieselbe Form:

```json
{
  "error": "Lesbare Meldung",
  "details": {
    "feldName": ["Validierungsfehler 1", "Validierungsfehler 2"]
  }
}
```

`details` gibt es nur bei `400 Bad Request`, also bei fehlgeschlagener Validierung.

| Status | Bedeutung |
|---|---|
| `400` | Validierung fehlgeschlagen, siehe `details` |
| `401` | Falsches Passwort oder fehlender Lösch-Token |
| `404` | Link gibt es nicht oder der Token ist ungültig |
| `409` | Der eigene Kurzcode ist bereits vergeben |
| `429` | Ratenbegrenzung erreicht, siehe Header `Retry-After` |

---

## `POST /api/links`, einen Link anlegen

### Anfrage

```http
POST /api/links HTTP/1.1
Content-Type: application/json

{
  "url":        "https://msk-scripts.de",
  "customCode": "msk",
  "password":   "optional",
  "expiresAt":  "2026-12-31T23:59:59Z"
}
```

### Die Felder

| Feld | Typ | Pflicht | Hinweise |
|---|---|---|---|
| `url` | string | ja | Nur `http://` oder `https://`. Höchstens 2048 Zeichen. Private IPs werden abgelehnt. |
| `customCode` | string | nein | 3 bis 20 Zeichen, `[a-zA-Z0-9_-]`. Ohne Angabe wird einer erzeugt. |
| `password` | string | nein | 4 bis 100 Zeichen. |
| `expiresAt` | string (ISO 8601) | nein | Muss in der Zukunft liegen. |

### Antwort (`201 Created`)

```json
{
  "shortCode":   "msk",
  "shortUrl":    "https://s.msk-scripts.de/msk",
  "deleteToken": "dk_a7c4f2e1b9d8...",
  "expiresAt":   "2026-12-31T23:59:59.000Z",
  "hasPassword": false
}
```

Dazu kommen Header zur Ratenbegrenzung:

```
X-RateLimit-Limit:     20
X-RateLimit-Remaining: 19
X-RateLimit-Reset:     1764547200
```

:::warning
Der `deleteToken` ist der **einzige** Weg, den Link später zu löschen. Sichere ihn, er lässt
sich nicht erneut abrufen.
:::

### Beispiel

```bash
curl -X POST https://s.msk-scripts.de/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://msk-scripts.de",
    "customCode": "msk",
    "expiresAt": "2026-12-31T23:59:59Z"
  }'
```

---

## `GET /api/links/:code`, einen Link nachschlagen

### Verhalten

- Liefert die Metadaten des Links.
- Hat der Link ein Passwort, steht die `originalUrl` **nicht** in der Antwort, dafür ist `/api/verify` da.
- Ist der Link abgelaufen, bleibt die `originalUrl` ebenfalls zurückgehalten.

### Antwort

```json
{
  "shortCode":    "msk",
  "shortUrl":     "https://s.msk-scripts.de/msk",
  "originalUrl":  "https://msk-scripts.de",
  "hasPassword":  false,
  "expiresAt":    "2026-12-31T23:59:59.000Z",
  "clickCount":   42,
  "createdAt":    "2026-05-10T14:00:00.000Z"
}
```

### Beispiel

```bash
curl https://s.msk-scripts.de/api/links/msk
```

---

## `POST /api/verify`, einen geschützten Link freischalten

Über diesen Endpunkt holst du die Ziel-URL eines passwortgeschützten Links. Bei Erfolg
erhöht er außerdem den Klickzähler und legt eine anonymisierte Klickzeile an.

### Anfrage

```http
POST /api/verify HTTP/1.1
Content-Type: application/json

{
  "shortCode": "msk",
  "password":  "geheim"
}
```

### Antwort

`200 OK` liefert die Ziel-URL:

```json
{ "originalUrl": "https://msk-scripts.de" }
```

Bei falschem Passwort kommt `401 Unauthorized`. Die Meldung ist bewusst allgemein gehalten,
damit nicht durchsickert, ob es den Link überhaupt gibt.

Nach 10 Fehlversuchen binnen 5 Minuten vom selben IP-Hash kommt `429 Too Many Requests`.

### Beispiel

```bash
curl -X POST https://s.msk-scripts.de/api/verify \
  -H "Content-Type: application/json" \
  -d '{"shortCode":"msk","password":"hunter2"}'
```

---

## `DELETE /api/links/:code`, einen Link löschen

Braucht den Lösch-Token als Bearer-Header. Es wird kaskadierend gelöscht, alle Klickzeilen
des Links verschwinden mit.

### Anfrage

```http
DELETE /api/links/msk HTTP/1.1
Authorization: Bearer dk_a7c4f2e1b9d8...
```

### Antwort

Bei Erfolg `200 OK`:

```json
{ "message": "Link erfolgreich gelöscht" }
```

Ist Link oder Token ungültig, kommt `404 Not Found`. Die API unterscheidet das bewusst
nicht, damit sich Tokens nicht durch Ausprobieren finden lassen.

### Beispiel

```bash
curl -X DELETE https://s.msk-scripts.de/api/links/msk \
  -H "Authorization: Bearer dk_a7c4f2e1b9d8..."
```

---

## `GET /api/links/:code/stats`, Statistik zu einem Link

Liefert die vollständige Statistik eines einzelnen Kurzlinks, dieselben Daten wie auf der
öffentlichen Statistikseite.

### Query-Parameter

| Parameter | Standard | Hinweise |
|---|---|---|
| `days` | `30` | Länge des Zeitverlaufs. Mindestens 1, höchstens 365. |

### Antwort

```json
{
  "shortCode":   "msk",
  "totalClicks": 42,
  "createdAt":   "2026-05-10T14:00:00.000Z",
  "expiresAt":   "2026-12-31T23:59:59.000Z",
  "timeline": [
    { "date": "2026-05-10", "clicks": 5 },
    { "date": "2026-05-11", "clicks": 12 }
  ],
  "browsers":         [{ "name": "Chrome",  "count": 28 }],
  "operatingSystems": [{ "name": "Linux",   "count": 19 }],
  "devices":          [{ "name": "desktop", "count": 35 }],
  "topReferrers":     [{ "host": "github.com", "count": 8 }]
}
```

### Beispiel

```bash
curl 'https://s.msk-scripts.de/api/links/msk/stats?days=7'
```

---

## `GET /api/links/:code/qr`, QR-Code

Liefert einen QR-Code, der die Kurz-URL enthält.

### Query-Parameter

| Parameter | Standard | Erlaubt |
|---|---|---|
| `format` | `png` | `png`, `svg` |

### Antwort

- **PNG:** `image/png`, 512 × 512, MSK-Farben (`#1b1b1d` auf Weiß)
- **SVG:** `image/svg+xml`, vektorbasiert und skalierbar
- Beide Antworten tragen `Content-Disposition: inline; filename="msk-<code>.<ext>"` und werden 24 Stunden zwischengespeichert.

### Beispiel

```bash
curl -o msk.png 'https://s.msk-scripts.de/api/links/msk/qr'
curl -o msk.svg 'https://s.msk-scripts.de/api/links/msk/qr?format=svg'
```

---

## `GET /api/stats`, globale Statistik

Liefert die anonymen Gesamtzahlen, die auch auf der Seite
[/stats](https://s.msk-scripts.de/stats) stehen. Wird 5 Minuten zwischengespeichert.

### Antwort

```json
{
  "totalLinks":     1234,
  "totalClicks":    98765,
  "linksToday":     42,
  "linksThisWeek":  187,
  "topBrowsers":         [{ "name": "Chrome", "count": 50321 }],
  "topOperatingSystems": [{ "name": "Linux",  "count": 22110 }],
  "topDevices":          [{ "name": "desktop", "count": 70000 }]
}
```

---

## Ratenbegrenzung

Der Endpunkt zum Anlegen ist standardmäßig auf **20 Anfragen pro Stunde und IP-Hash**
begrenzt. Ist das erreicht:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1742
X-RateLimit-Limit:     20
X-RateLimit-Remaining: 0
X-RateLimit-Reset:     1764547200
Content-Type: application/json

{ "error": "Zu viele Anfragen. Bitte später erneut versuchen." }
```

`Retry-After` steht in Sekunden. Bei einer eigenen Instanz änderst du die Grenze über
`RATE_LIMIT_CREATE_PER_HOUR`.

Der Endpunkt zum Prüfen hat eine eigene Grenze von **10 Versuchen je 5 Minuten** und
IP-Hash, als Schutz gegen Durchprobieren.

---

## Beispiel: Kürzen von der Kommandozeile

Eine knappe Bash-Funktion, die eine URL kürzt:

```bash
mskshort() {
  curl -sS -X POST https://s.msk-scripts.de/api/links \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg u "$1" '{url: $u}')" \
    | jq -r '.shortUrl'
}

# Aufruf:
mskshort "https://example.com/sehr/lange/url"
```

---

## Beispiel: Node.js

```js
const res = await fetch('https://s.msk-scripts.de/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://msk-scripts.de',
    customCode: 'msk',
  }),
})
const link = await res.json()
console.log(link.shortUrl)
```

---

## Beispiel: Python

```python
import requests

r = requests.post(
    "https://s.msk-scripts.de/api/links",
    json={
        "url": "https://msk-scripts.de",
        "customCode": "msk",
    },
)
print(r.json()["shortUrl"])
```
