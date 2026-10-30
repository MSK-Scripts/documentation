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

Wer über die API einen Paste anlegen will, braucht einen API-Key. Er geht als Bearer-Header
mit:

```http
Authorization: Bearer mskp_...
```

Keys für MSK Paste beginnen mit `mskp_`. Der Betreiber stellt sie auf dem Server aus, eine
Registrierung oder Selbstbedienung gibt es nicht. Die gehostete Instanz paste.msk-scripts.de gibt keine Keys an andere aus, dort legst du Pastes über die Website an. Auf deiner eigenen Instanz
legst du Keys mit dem Key-Skript an, siehe [Installation](installation.md#api-keys).

Ohne Key nimmt `POST /api/pastes` nur Anfragen aus dem eigenen Formular der Seite an und
antwortet sonst mit `401`:

```json
{ "error": "Creating pastes through the API requires an API key", "code": "api-key-required" }
```

Ein falscher oder gesperrter Key bekommt ebenfalls `401`, mit `"code": "api-key-invalid"`.

Alles andere geht wie bisher ohne Key: einen Paste abrufen, ihn mit
`POST /api/pastes/:id/verify` freischalten, ihn mit seinem Lösch-Token löschen und
`GET /api/stats`.

---

## Aufbau einer Fehlermeldung

Alle Fehler haben dieselbe Form:

```json
{
  "error": "Lesbare Meldung",
  "code": "api-key-required",
  "details": {
    "feldName": ["Validierungsfehler 1", "Validierungsfehler 2"]
  }
}
```

`code` nennt den Grund in fester, maschinenlesbarer Form. Er steht bei den Ablehnungen von
`POST /api/pastes` wegen API-Key, Grenzen und Inhaltsprüfung. Skripte werten deshalb besser
`code` aus als die Meldung. `details` gibt es nur bei `400 Bad Request`, also bei
fehlgeschlagener Validierung.

| Status | Bedeutung |
|---|---|
| `400` | Validierung fehlgeschlagen, siehe `details` |
| `401` | API-Key fehlt oder ist ungültig (beim Anlegen), falsches Passwort (bei `/verify`) |
| `403` | Passwort nötig (bei `/api/pastes/:id`) |
| `404` | Paste gibt es nicht, ist abgelaufen oder wurde nach dem Lesen gelöscht |
| `409` | Die eigene ID ist bereits vergeben, oder derselbe Inhalt wurde in den letzten 24 Stunden schon eingefügt (`code: "duplicate"`) |
| `413` | Inhalt größer als 1 MB |
| `422` | Inhalt von der [Inhaltsprüfung](#inhaltsprüfung) abgelehnt |
| `429` | Grenze erreicht, siehe [Ratenbegrenzung](#ratenbegrenzung) |

---

## `POST /api/pastes`, einen Paste anlegen

### Anfrage

```http
POST /api/pastes HTTP/1.1
Authorization: Bearer mskp_...
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
  -H "Authorization: Bearer $MSK_PASTE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "print(\"hello\")",
    "language": "python",
    "expiresIn": "1d"
  }'
```

---

## Inhaltsprüfung

Jeder neue Paste durchläuft dieselben Prüfungen, egal ob er aus dem Formular kommt oder über
einen API-Key. Abgelehnt wird ein Paste, wenn er

- eine kodierte Datei enthält: einen ununterbrochenen Block von 16 KB aus Base64- oder Hex-Zeichen, oder ab 64 KB Größe fast nur aus umbrochenem Base64 besteht (`422`, `code: "blob"`)
- vor allem aus Links besteht: 3 oder mehr Links, die mindestens die Hälfte des Textes ausmachen, oder 3 oder mehr Links als BBCode `[url=` oder HTML `<a href=` (`422`, `code: "links"`)
- einen Inhalt wiederholt, der in den letzten 24 Stunden schon eingefügt wurde (`409`, `code: "duplicate"`)

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

Anfragen mit API-Key und Anfragen aus dem Formular sind getrennt begrenzt:

| Gesendet über | Grenze | `code` bei `429` | Einstellung |
|---|---|---|---|
| API-Key | 120 Pastes pro Stunde je Key | `key-limit` | `API_KEY_CREATE_PER_HOUR` |
| Falsche API-Keys | 10 je Adresse in 10 Minuten, danach wartet die Adresse | `key-attempts` | fest |
| Formular | 10 Pastes pro Stunde je IP-Hash | `rate-limit` | `RATE_LIMIT_CREATE_PER_HOUR` |
| Formular | 20 Pastes und zusammen 5 MB je IP-Adresse und 24 Stunden | `daily-limit` | `DAILY_PASTES_PER_IP`, `DAILY_BYTES_PER_IP` |

Für Anfragen mit Key gelten die Grenzen des Formulars nicht. Ist die Grenze pro Stunde und
IP-Hash erreicht:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1742
Content-Type: application/json

{ "error": "Rate limit exceeded", "code": "rate-limit" }
```

`Retry-After` steht in Sekunden. Bei einer eigenen Instanz änderst du jede Grenze über die
Einstellung aus der Tabelle.

---

## Beispiel: Upload von der Kommandozeile

Eine knappe Bash-Funktion, die eine Datei hochlädt. Den API-Key liest sie aus
`MSK_PASTE_KEY`:

```bash
mskpaste() {
  local file="$1"
  local lang="${2:-plaintext}"
  curl -sS -X POST https://paste.msk-scripts.de/api/pastes \
    -H "Authorization: Bearer $MSK_PASTE_KEY" \
    -H "Content-Type: application/json" \
    -d "$(jq -n \
      --arg c "$(cat "$file")" \
      --arg l "$lang" \
      '{content: $c, language: $l, expiresIn: "1w"}')" \
    | jq -r '.url'
}

# Aufruf (den Key vom Betreiber, etwa in der ~/.bashrc gesetzt):
export MSK_PASTE_KEY="mskp_..."
mskpaste script.lua lua
mskpaste server.log
```

---

## Beispiel: Node.js

```js
const res = await fetch('https://paste.msk-scripts.de/api/pastes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.MSK_PASTE_KEY}`,
    'Content-Type': 'application/json',
  },
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
import os
import requests

r = requests.post(
    "https://paste.msk-scripts.de/api/pastes",
    headers={"Authorization": f"Bearer {os.environ['MSK_PASTE_KEY']}"},
    json={
        "content": "print('hi')",
        "language": "python",
        "expiresIn": "1h",
    },
)
print(r.json()["url"])
```
