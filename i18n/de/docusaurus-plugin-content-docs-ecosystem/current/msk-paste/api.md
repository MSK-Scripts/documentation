---
title: REST-API
sidebar_position: 4
---

# REST-API

MSK Paste bringt eine vollständige JSON-REST-API mit. Alles, was die Weboberfläche kann,
geht auch programmatisch, praktisch für Uploads von der Kommandozeile, für Skripte,
CI-Pipelines und Editor-Anbindungen.

**Basis-URL:** `https://paste.msk-scripts.de/api`, bei einer eigenen Instanz entsprechend
deine Domain.

---

## Authentifizierung

Es gibt **keine**. Alle Endpunkte sind öffentlich. Schreibende Aufrufe (anlegen und löschen)
sind über eine Ratenbegrenzung abgesichert, das Löschen zusätzlich über einen einmaligen,
zufälligen Lösch-Token.

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
| `401` | Falsches Passwort (bei `/verify`) |
| `403` | Passwort nötig (bei `/api/pastes/:id`) |
| `404` | Paste gibt es nicht, ist abgelaufen oder wurde nach dem Lesen gelöscht |
| `409` | Die eigene ID ist bereits vergeben |
| `413` | Inhalt größer als 1 MB |
| `429` | Ratenbegrenzung erreicht, siehe Header `Retry-After` |

---

## `POST /api/pastes`, einen Paste anlegen

### Anfrage

```http
POST /api/pastes HTTP/1.1
Content-Type: application/json

{
  "content":       "console.log('hello world')",
  "title":         "Mein Schnipsel",
  "language":      "javascript",
  "expiresIn":     "1w",
  "password":      "optional",
  "burnAfterRead": false,
  "customId":      "mein-schnipsel"
}
```

### Die Felder

| Feld | Typ | Pflicht | Hinweise |
|---|---|---|---|
| `content` | string | ja | 1 Zeichen bis 1 MB |
| `title` | string | nein | höchstens 100 Zeichen |
| `language` | string | nein | Standard `"plaintext"`. Muss aus der Liste der unterstützten Sprachen stammen. |
| `expiresIn` | string | ja | `"10min"`, `"1h"`, `"1d"`, `"1w"`, `"1mo"`, `"1y"` |
| `password` | string | nein | 1 bis 128 Zeichen |
| `burnAfterRead` | boolean | nein | Standard `false` |
| `customId` | string | nein | 4 bis 32 Zeichen, `[a-zA-Z0-9_-]` |

### Antwort (`201 Created`)

```json
{
  "pasteId":       "X7q9bA2k",
  "url":           "https://paste.msk-scripts.de/X7q9bA2k",
  "rawUrl":        "https://paste.msk-scripts.de/raw/X7q9bA2k",
  "deleteToken":   "dk_a7c4f2e1b9d8...",
  "expiresAt":     "2026-05-20T16:00:00.000Z",
  "hasPassword":   false,
  "burnAfterRead": false
}
```

:::warning
Der `deleteToken` ist der **einzige** Weg, den Paste später zu löschen. Sichere ihn. Er
liegt nirgends, wo du ihn abrufen könntest.
:::

### Beispiel

```bash
curl -X POST https://paste.msk-scripts.de/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "print(\"hello\")",
    "language": "python",
    "expiresIn": "1d"
  }'
```

---

## `GET /api/pastes/:id`, einen Paste abrufen

### Verhalten

- Ist der Paste passwortgeschützt, kommt `403` mit `{ "passwordRequired": true }`.
- Ist er abgelaufen oder nach dem Lesen gelöscht, kommt `404`.
- Sonst kommt der Inhalt, `view_count` wird erhöht, und bei „nach dem Lesen löschen" **verschwindet der Paste in derselben Transaktion**.

### Antwort

```json
{
  "pasteId":       "X7q9bA2k",
  "title":         "Mein Schnipsel",
  "content":       "console.log('hello world')",
  "language":      "javascript",
  "createdAt":     "2026-05-13T16:00:00.000Z",
  "expiresAt":     "2026-05-20T16:00:00.000Z",
  "viewCount":     1,
  "burnAfterRead": false,
  "sizeBytes":     27
}
```

### Beispiel

```bash
curl https://paste.msk-scripts.de/api/pastes/X7q9bA2k
```

---

## `POST /api/pastes/:id/verify`, einen geschützten Paste freischalten

### Anfrage

```http
POST /api/pastes/X7q9bA2k/verify HTTP/1.1
Content-Type: application/json

{ "password": "geheim" }
```

### Antwort

`200 OK` liefert dieselben Daten wie `GET /api/pastes/:id`, dazu ein Feld
`highlightedHtml` zum direkten Anzeigen.

Bei falschem Passwort kommt `401 Unauthorized`. Fehlversuche zählen **nicht** im
Aufrufzähler mit und lösen **kein** Löschen nach dem Lesen aus.

### Beispiel

```bash
curl -X POST https://paste.msk-scripts.de/api/pastes/X7q9bA2k/verify \
  -H "Content-Type: application/json" \
  -d '{"password":"hunter2"}'
```

---

## `DELETE /api/pastes/:id`, einen Paste löschen

Braucht einen gültigen Lösch-Token als Query-Parameter.

### Anfrage

```http
DELETE /api/pastes/X7q9bA2k?token=dk_a7c4f2e1b9d8... HTTP/1.1
```

### Antwort

Bei Erfolg `204 No Content`. Ist Paste oder Token ungültig, kommt `404`. Die API
unterscheidet das bewusst nicht, damit sich Tokens nicht durch Ausprobieren finden lassen.

### Beispiel

```bash
curl -X DELETE "https://paste.msk-scripts.de/api/pastes/X7q9bA2k?token=dk_a7c4f2e1b9d8..."
```

---

## `GET /api/stats`, globale Statistik

Liefert die anonymen Gesamtzahlen, die auch auf der Seite
[/stats](https://paste.msk-scripts.de/stats) stehen.

### Antwort

```json
{
  "totalPastes":    1234,
  "pastesToday":    42,
  "pastesThisWeek": 187,
  "topLanguages": [
    { "language": "javascript", "count": 320 },
    { "language": "lua",        "count": 211 },
    { "language": "python",     "count": 198 },
    { "language": "plaintext",  "count": 156 },
    { "language": "json",       "count": 99  }
  ]
}
```

---

## Ratenbegrenzung

Der Endpunkt zum Anlegen ist standardmäßig auf **10 Anfragen pro Stunde und IP-Hash**
begrenzt. Ist das erreicht:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1742
Content-Type: application/json

{ "error": "Rate limit exceeded. Please try again later." }
```

`Retry-After` steht in Sekunden. Bei einer eigenen Instanz änderst du die Grenze über
`RATE_LIMIT_CREATE_PER_HOUR`.

---

## Beispiel: Upload von der Kommandozeile

Eine knappe Bash-Funktion, die eine Datei hochlädt:

```bash
mskpaste() {
  local file="$1"
  local lang="${2:-plaintext}"
  curl -sS -X POST https://paste.msk-scripts.de/api/pastes \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg c "$(cat "$file")" \
      --arg l "$lang" \
      '{content: $c, language: $l, expiresIn: "1w"}')" \
    | jq -r '.url'
}

# Aufruf:
mskpaste script.lua lua
mskpaste server.log
```

---

## Beispiel: Node.js

```js
const res = await fetch('https://paste.msk-scripts.de/api/pastes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'console.log("hi")',
    language: 'javascript',
    expiresIn: '1d',
  }),
})
const paste = await res.json()
console.log(paste.url)
```

---

## Beispiel: Python

```python
import requests

r = requests.post(
    "https://paste.msk-scripts.de/api/pastes",
    json={
        "content": "print('hi')",
        "language": "python",
        "expiresIn": "1h",
    },
)
print(r.json()["url"])
```
