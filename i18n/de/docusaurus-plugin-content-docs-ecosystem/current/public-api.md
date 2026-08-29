---
title: Öffentliche API
sidebar_position: 2
description: Die öffentlichen JSON-Endpunkte auf msk-scripts.de, einschließlich des Bildkatalogs hinter cdn.msk-scripts.de.
---

# Öffentliche API

`msk-scripts.de` bietet eine Handvoll rein lesender JSON-Endpunkte, die weder Konto noch
Token noch Registrierung brauchen. Sie versorgen die Seiten der Website selbst und sind
stabil genug, um darauf aufzubauen.

**Basis-URL:** `https://www.msk-scripts.de`

Alles auf dieser Seite antwortet auf ein schlichtes `GET`. Es gibt keine Authentifizierung,
keine Anmeldung und keinen Schlüssel zu beantragen. Was hier nicht steht, ist Internes der
Website und kann sich ohne Ankündigung ändern oder verschwinden.

---

## Konventionen

**Antworten** sind JSON mit `Content-Type: application/json`.

**Fehler** tragen ein Feld `error` und den passenden Statuscode:

```json
{ "error": "unknown category" }
```

| Status | Bedeutung |
|---|---|
| `200` | Erfolg |
| `404` | Die Kategorie oder das Bild gibt es nicht |
| `429` | Ratenbegrenzung erreicht, warte eine Minute |
| `503` | Ein vorgelagerter Dienst ist nicht erreichbar, siehe den Hinweis beim jeweiligen Endpunkt |

**Zugriff über Domaingrenzen hinweg** ist die eine Stelle, an der sich die Endpunkte
unterscheiden. Schau also in die Tabelle, bevor du einen davon aus einem Browser oder einer
FiveM-NUI aufrufst:

| Gruppe von Endpunkten | `Access-Control-Allow-Origin` | Aus Browser oder NUI nutzbar |
|---|---|---|
| [Bilder](#bilder) | `*` | ja |
| [Statistiken](#statistiken) | nicht gesetzt | nur serverseitig |
| [Discord](#discord) | nicht gesetzt | nur serverseitig |
| [Shop-Katalog](#shop-katalog) | nicht gesetzt | nur serverseitig |

Die Bild-Endpunkte sind bewusst offen, denn dort sitzen die Nutzer von außerhalb: Eine
FiveM-NUI schickt einen `nui://`-Ursprung und könnte sonst gar nicht fragen, ob es ein Bild
gibt. Der Rest wird für die Seiten der Website selbst ausgeliefert. Eine Lua-Ressource, die
`PerformHttpRequest` aufruft, ist kein Browser und davon ohnehin nicht betroffen.

**Die Ratenbegrenzung** gilt je IP-Adresse. Nur die Bild-Endpunkte haben eine ausdrückliche
Grenze, 300 Anfragen pro Minute. Die übrigen haben keine feste Obergrenze, aber ihre Werte
ändern sich langsam, halte sie also lieber vor, statt sie ständig abzufragen. Wer eine Grenze
reißt, bekommt `429`.

---

## Bilder

Der Bestand hinter [cdn.msk-scripts.de](https://cdn.msk-scripts.de): Renderbilder von
Fahrzeugen, Peds, Waffen und Gegenständen, zugeschnitten, mit Rand versehen und in drei
Größen ausgeliefert.

:::tip[Vielleicht brauchst du die API gar nicht]
Die Bild-URLs sind flach und vorhersagbar. Wenn du Kategorie und Spawn-Namen ohnehin kennst,
bau die Adresse einfach selbst und spar dir die Abfrage:

```
https://cdn.msk-scripts.de/vehicles/zentorno.png        PNG im Original
https://cdn.msk-scripts.de/vehicles/zentorno.webp       WebP mit 400 px
https://cdn.msk-scripts.de/vehicles/zentorno_thumb.webp WebP mit 160 px
```

Das CDN schickt `Access-Control-Allow-Origin: *` und speichert ein Jahr lang zwischen, du
kannst also von überall darauf verweisen. Nimm die API, wenn du wissen musst, **ob** es ein
Bild gibt, wie es heißt oder welche Maße es hat.
:::

### `GET /api/images`, auflisten und suchen

| Parameter | Typ | Standard | Beschreibung |
|---|---|---|---|
| `category` | string | alle | `vehicles`, `peds`, `weapons`, `items`, `props`, `brand` |
| `q` | string | keiner | Volltextsuche über Name, Bezeichnung und Schlagwörter |
| `tag` | string | keiner | Genaue Übereinstimmung eines Schlagworts, etwa `super` oder `pistol` |
| `page` | number | `1` | Seitenzahl, beginnend bei 1 |
| `per` | number | `60` | Treffer je Seite, serverseitig gedeckelt |

```bash
curl "https://www.msk-scripts.de/api/images?category=weapons&q=pistol&per=2"
```

```json
{
  "total": 20,
  "page": 1,
  "per": 2,
  "items": [
    {
      "category": "weapons",
      "name": "weapon_appistol",
      "label": "AP Pistol",
      "ext": "png",
      "width": 99,
      "height": 104,
      "bytes": 4513,
      "version": 1,
      "tags": ["pistol"],
      "url": "https://cdn.msk-scripts.de/weapons/weapon_appistol.png",
      "card": "https://cdn.msk-scripts.de/weapons/weapon_appistol.webp",
      "thumb": "https://cdn.msk-scripts.de/weapons/weapon_appistol_thumb.webp"
    }
  ]
}
```

Eine unbekannte `category` gibt `404` mit `{ "error": "unknown category" }` zurück.

### `GET /api/images/{category}/{name}`, ein einzelnes Bild

Die Abfrage, die ein Script braucht, bevor es etwas anzeigt: Gibt es zu diesem Modellnamen
ein Bild, und wie groß ist es?

```bash
curl "https://www.msk-scripts.de/api/images/vehicles/zentorno"
```

```json
{
  "category": "vehicles",
  "name": "zentorno",
  "label": "Pegassi Zentorno",
  "ext": "png",
  "width": 1024,
  "height": 463,
  "bytes": 99444,
  "version": 2,
  "tags": ["pegassi", "super"],
  "url": "https://cdn.msk-scripts.de/vehicles/zentorno.png?v=2",
  "card": "https://cdn.msk-scripts.de/vehicles/zentorno.webp?v=2",
  "thumb": "https://cdn.msk-scripts.de/vehicles/zentorno_thumb.webp?v=2"
}
```

Bei `name` spielt Groß- und Kleinschreibung keine Rolle. Ein Fehlgriff gibt `404` mit
`{ "error": "not found" }` zurück, und auch diese Antwort trägt den CORS-Header, ein Browser
kann sie also lesen.

:::note[Zum Feld `version`]
Dateien werden ein Jahr lang als `immutable` zwischengespeichert. Wird ein Bild ersetzt,
steigt `version`, und die URLs bekommen ein `?v=` angehängt. Sichere dir also die URLs, die
die API dir gibt, statt sie selbst zu bauen, wenn Austausche bei deinen Nutzern ankommen
sollen.
:::

### `GET /api/images/categories`, Kategorien mit Anzahl

| Parameter | Typ | Standard | Beschreibung |
|---|---|---|---|
| `lang` | `en` \| `de` | `en` | Sprache von `name` und `description` |

```bash
curl "https://www.msk-scripts.de/api/images/categories?lang=de"
```

```json
[
  { "slug": "vehicles", "name": "Fahrzeuge", "description": null, "icon": "Car", "count": 916 },
  { "slug": "peds",     "name": "Peds",      "description": null, "icon": "User", "count": 1030 }
]
```

`icon` ist der Name eines [Lucide](https://lucide.dev)-Symbols und direkt verwendbar, wenn
deine Oberfläche diesen Satz mitbringt. Kategorien mit der Anzahl `0` werden ebenfalls
aufgeführt.

### Beispiel: eine FiveM-Ressource

```lua
-- Serverseitig. Prüft, ob es ein Bild gibt, bevor eine URL an die NUI geht.
local function getVehicleImage(model, cb)
    PerformHttpRequest(
        ('https://www.msk-scripts.de/api/images/vehicles/%s'):format(model:lower()),
        function(status, body)
            if status ~= 200 then return cb(nil) end
            local data = json.decode(body)
            cb(data and data.card or nil)
        end,
        'GET'
    )
end
```

Bei einer NUI, die nur Bilder anzeigt, sparst du dir die Anfrage ganz und baust die CDN-URL
aus dem Modellnamen.

---

## Statistiken

Die Zahlen hinter den öffentlichen Statistikseiten. Alle drei rechnen bei jeder Anfrage neu
und werden nicht zwischengespeichert. Behandle sie also als träge und halte sie auf deiner
Seite vor.

### `GET /api/stats`, Ticket Bot

Zusammengefasste Zahlen über alle registrierten Ticket-Bot-Server hinweg. Weder Server noch
Nutzer noch Transkript ist in der Antwort erkennbar.

```json
{
  "transcripts": 114,
  "apiKeys": 36,
  "tiers": { "basic": 30, "premium": 4, "premium_plus": 2 },
  "avgTranscriptBytes": 244226,
  "attachments": 250,
  "avgAttachmentBytes": 659478,
  "subscriptions": 0,
  "subscriptionTiers": { "basic": 0, "premium": 0, "premium_plus": 0 },
  "customDomains": 3,
  "hostedBots": 1,
  "newGuilds30d": 4,
  "totalStorageBytes": 192711350,
  "transcripts30d": 31,
  "transcriptsWithAttachments": 48,
  "maxTranscriptBytes": 6007524
}
```

Ist die Datenbank nicht erreichbar, kommt `503` mit
`{ "error": "Database unavailable" }`. Dargestellt wird das unter
[/ticketbot/stats](https://www.msk-scripts.de/ticketbot/stats).

### `GET /api/giveaway-stats`, Giveaway Bot

```json
{
  "available": true,
  "servers": 28,
  "giveaways": 97,
  "activeGiveaways": 3,
  "entries": 544,
  "winners": 121,
  "templates": 2,
  "avgEntries": 6,
  "maxEntries": 29,
  "langs": { "en": 22, "de": 4, "fr": 2, "es": 0, "hu": 0, "pl": 0, "pt": 0 },
  "status": { "ACTIVE": 3, "PAUSED": 1, "ENDED": 91, "CANCELLED": 2 }
}
```

`langs` zählt die Server nach eingestellter Bot-Sprache, `status` zählt die Gewinnspiele nach
Zustand. Ist die Giveaway-Datenbank nicht erreichbar, kommt `503`. Dargestellt wird das unter
[/giveaway/stats](https://www.msk-scripts.de/giveaway/stats).

### `GET /api/resource-stats`, Reichweite der FiveM-Ressourcen

Aktuelle Serverzahlen zu den FiveM-Ressourcen von MSK, bezogen von
[fivestats.io](https://fivestats.io) und ausgeliefert, ohne den Schlüssel dorthin
preiszugeben.

```json
{
  "available": true,
  "periodHours": 168,
  "game": "gta5",
  "resources": [
    {
      "resourceName": "msk_core",
      "displayName": "MSK Core",
      "tier": "free",
      "available": true,
      "serverCount": 313,
      "rank": 2014,
      "serverCountChange": 13,
      "rankChange": 86,
      "updatedAt": "2026-08-28 20:15:00",
      "links": [
        { "label": "GitHub", "href": "https://github.com/MSK-Scripts/msk_core", "external": true, "variant": "secondary" }
      ],
      "history": [
        { "t": 1787344200, "serverCount": 300, "rank": 2100 }
      ]
    }
  ]
}
```

`t` in `history` ist ein Unix-Zeitstempel in Sekunden und deckt die letzten `periodHours` ab.
Eine Ressource, zu der es noch keine Daten von außen gibt, hat `available: false` und keine
Zahlen, während der Rest der Liste trotzdem aufgelöst wird. Die ganze Antwort ist nur dann
`503`, wenn fivestats selbst nicht erreichbar ist. Dargestellt wird das unter
[/resources](https://www.msk-scripts.de/resources).

---

## Discord

### `GET /api/discord`, Größe der Community

Mitgliederzahlen des MSK-Discord, über die Invite-API gelesen und 60 Sekunden lang
zwischengespeichert.

```json
{ "online": 133, "total": 622 }
```

Dieser Endpunkt scheitert nie lautstark. Ist Discord nicht erreichbar, antwortet er `200` mit
`{ "online": 0, "total": 0 }`, denn ein kaputter Zähler soll nicht die Seite zerlegen, die
ihn anzeigt. Behandle zwei Nullen als „unbekannt", nicht als „niemand online".

### `GET /api/discord/health`, Zustand der Plattform Discord

Eine Zusammenfassung von [discordstatus.com](https://discordstatus.com) in einem einzigen
Feld, nützlich um „unser Bot ist unten" von „Discord ist unten" zu unterscheiden.

```json
{ "indicator": "none" }
```

`indicator` ist eines von `none`, `minor`, `major`, `critical` oder `unknown`, wenn die
Abfrage selbst fehlgeschlagen ist.

---

## Shop-Katalog

### `GET /api/packages`, Tebex-Pakete

Ein schlanker Vermittler vor der Tebex Headless API, der den Ladenkatalog in Tebex' eigener
Antwortform zurückgibt. Er existiert für die Ladenseite und trägt den öffentlichen
Tebex-Token, der von Haus aus öffentlich ist.

```bash
curl "https://www.msk-scripts.de/api/packages"
```

Wenn du gegen den Katalog baust und nicht gegen diese Website, frag lieber
[Tebex Headless](https://docs.tebex.io/developers/headless-api/overview) direkt. Das sind
dieselben Daten von der maßgeblichen Quelle, mit einem dokumentierten Vertrag, der sich nicht
ändert, wenn sich diese Website ändert.

---

## Nutzungsbedingungen

Die Endpunkte sind frei nutzbar und brauchen keine Registrierung. Zwei Bitten:

- **Halte vor, was du abrufst.** Die Werte hier ändern sich langsam, und keiner dieser Endpunkte ist es wert, im Sekundentakt abgefragt zu werden.
- **Die Bilder sind Spiel-Assets.** Die Rechte an den zugrunde liegenden GTA-V-Modellen liegen bei Rockstar Games und Take-Two Interactive. Ausgeliefert werden hier Renderbilder, bereitgestellt zur Nutzung in FiveM-Projekten. Einsendungen aus der Community tragen eine Rechteerklärung des Einsenders. Wenn du eine Sammlung als Ganzes weiterveröffentlichst, statt einzelne Bilder in einem Projekt zu nutzen, frag bitte vorher.

Fragen oder ein Anwendungsfall, der mehr braucht, als das hier hergibt? Melde dich im
[Discord](https://discord.gg/5hHSBRHvJE).
