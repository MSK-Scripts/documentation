---
title: FAQ und Fehlersuche
sidebar_position: 6
---

# FAQ und Fehlersuche

## Allgemein

### Ist MSK Shortener kostenlos?

Ja. Die gehostete Instanz unter [s.msk-scripts.de](https://s.msk-scripts.de) ist für alle
kostenlos. Der Quellcode steht unter AGPL-3.0, du kannst ihn also auch unter deiner eigenen
Domain betreiben.

### Brauche ich ein Konto?

Nein. MSK Shortener hat bewusst kein Nutzersystem. Der Lösch-Token, den du beim Anlegen
bekommst, ist das, womit du einen Link später wieder entfernst.

### Kann ich einen Kurzlink auf ein anderes Ziel umbiegen?

Nein. Links sind unveränderlich. Um das Ziel zu ändern, löschst du den alten Link mit dem
Lösch-Token und legst einen neuen mit demselben eigenen Code an.

### Wie lange lebt ein Link?

So lange du willst. Das Feld `expiresAt` ist optional, ein Link ohne Ablauf bleibt aktiv,
bis du ihn löschst. Setzt du einen, muss es ein gültiger ISO-8601-Zeitpunkt in der Zukunft
sein.

### Kann ich einen gelöschten oder abgelaufenen Link wiederherstellen?

Nein. Löschen ist endgültig, ob von Hand oder durch Ablauf. Die zugehörige Klickstatistik
verschwindet mit.

### Kann ich sehen, wer meine Links angeklickt hat?

Nein, und das ist der Sinn der Sache. Die Statistik zeigt zusammengefasste Zahlen zu
Browser, Betriebssystem, Gerät und Verweisquelle, aber niemals die Identität eines einzelnen
Besuchers. IPs sind mit einem Geheimnis gehasht, vollständige User-Agents werden nie
gespeichert.

### Gehen Kurzlinks kaputt, wenn sich das Ziel ändert?

Ja. MSK Shortener speichert die URL genau so, wie du sie eingereicht hast. Verschwindet das
Ziel, führt der Kurzlink auf eine kaputte Seite. Eine eingebaute Prüfung der Linkgesundheit
gibt es nicht.

---

## Die API benutzen

### Wo ist mein API-Key?

Es gibt keinen. Alle Endpunkte sind öffentlich. Schreibende Aufrufe schützt die
Ratenbegrenzung, also 20 Anlagen pro Stunde je IP-Hash.

### Warum bekomme ich `429 Too Many Requests`?

Du hast eine Ratenbegrenzung erreicht. Schau in den Header `Retry-After`. Es gibt zwei
Grenzen:

- **Anlegen:** 20 pro Stunde je IP-Hash
- **Prüfen (Passwort):** 10 je 5 Minuten und IP-Hash, als Schutz gegen Durchprobieren

Betreibst du eine eigene Instanz und brauchst mehr, ändere `RATE_LIMIT_CREATE_PER_HOUR` in
der `.env`.

### Wie lösche ich einen Link über die API?

Schick ein `DELETE /api/links/:code` mit dem Lösch-Token als Bearer-Header:

```bash
curl -X DELETE https://s.msk-scripts.de/api/links/msk \
  -H "Authorization: Bearer dk_a7c4f2..."
```

### Warum lehnt die API meine URL mit „Interne / private Adressen sind nicht erlaubt" ab?

Du wolltest eine URL kürzen, die auf einen privaten IP-Bereich oder auf localhost zeigt. Das
ist der **SSRF-Schutz**, siehe [Datenschutz und Sicherheit](privacy.md#ssrf-schutz). Der
Kürzer ist nur für öffentliche Ziele gedacht.

### Bekomme ich eine Liste aller Links, die ich angelegt habe?

Nein. Es gibt keinen Verlauf je Nutzer, die Datenbank weiß nicht, welche Links „dir"
gehören. Sichere die Lösch-Token bei dir, wenn du einen persönlichen Verlauf willst.

---

## Selbst hosten

### `502 Bad Gateway` von Apache

Apache erreicht den Node-Prozess nicht. Prüfe:

```bash
sudo systemctl status msk-shortener
sudo journalctl -u msk-shortener -n 100
sudo ss -tlnp | grep 3011
```

Startet der Dienst nicht, schau ins Journal. Die häufigsten Ursachen sind:

- fehlende oder falsche Werte in der `.env`, vor allem `DB_*` und `IP_HASH_SECRET`
- die Datenbank verweigert die Verbindung
- Port `3011` ist schon von einem anderen Prozess belegt

### Port 3011 ist belegt

Stoppe entweder den störenden Prozess oder ändere den Port an drei Stellen: in der `.env`
(`PORT=3014`), in der `package.json` (`next start -p 3014`) und im Apache-vHost
(`ProxyPass http://localhost:3014/`). Danach beide Dienste neu starten.

### „Cannot find module" nach dem Deploy

Meist ist `npm ci` fehlgeschlagen oder `node_modules/` fehlt. Im Projektverzeichnis:

```bash
sudo rm -rf node_modules
sudo npm ci
sudo npm run build
sudo systemctl restart msk-shortener
```

### Datenbankfehler beim Start

```
Error: Access denied for user 'msk_shortener'@'localhost'
```

Die Zugangsdaten in der `.env` passen nicht zu denen in MariaDB. Prüfe es, indem du dich von
Hand anmeldest:

```bash
mysql -u msk_shortener -p msk_shortener
```

Klappt das nicht, lege den Nutzer neu an, siehe [Installation](installation.md).

### `IP_HASH_SECRET is required` beim Start

Du hast das Geheimnis in der `.env` nicht gesetzt. Erzeuge eines:

```bash
openssl rand -hex 32
```

Trag es in die `.env` ein und starte den Dienst neu.

:::warning
Änderst du `IP_HASH_SECRET` nachträglich, gelten alle bestehenden Hashes der
Ratenbegrenzung und der Klicks als „andere Besucher". Daten verlierst du dabei nicht, nur
die Kontinuität im Fenster der Ratenbegrenzung.
:::

### Ratenbegrenzung von Let's Encrypt erreicht

Hast du beim Ausprobieren mit certbot die Grenze gerissen, nimm zum Testen die
**Staging**-Umgebung:

```bash
sudo certbot --apache --staging -d s.example.com
```

Sobald die Einrichtung sicher steht, führst du es ohne `--staging` aus und bekommst das
echte Zertifikat.

### Die Migration ist mittendrin abgebrochen

Der Migrationslauf ist wiederholbar. Erfolgreich ausgeführte Dateien stehen in der Tabelle
`_migrations`. Repariere die fehlerhafte SQL-Datei und führe `npm run migrate` erneut aus,
bereits angewandte Migrationen werden übersprungen.

### Wie sichere ich vor einem Update?

Mit dem beiliegenden Skript:

```bash
sudo bash /opt/msk-shortener/deployment/scripts/backup.sh
```

Es legt einen SQL-Dump mit Datum im Dateinamen unter `/opt/msk-shortener/backups/` ab.
Standardmäßig bleiben 14 Tage erhalten.

### Kann ich MSK Shortener und MSK Paste auf demselben Server betreiben?

Ja, das ist der übliche Aufbau. Sie nutzen verschiedene Ports (`3011` und `3012`), getrennte
Datenbanken und getrennte Apache-vHosts. Die Installationsskripte sind darauf ausgelegt,
nebeneinander zu bestehen.

---

## Funktionen

### Warum werden beliebige Protokolle wie `ftp://` oder `magnet:` nicht unterstützt?

Akzeptiert werden nur `http://` und `https://`, weil das für einen öffentlichen Kürzer die
sichersten Voreinstellungen sind. Andere Schemata zuzulassen hieße, dass jemand Opfer auf
Dateifreigaben oder tief in Apps hinein umlenken kann. Brauchst du das für eine private
Installation wirklich, steht die Prüfung in `src/lib/validation.ts` und lässt sich lockern.

### Warum gibt es keine Linkvorschau über OG-Tags?

Um datenschutzfreundlich und schlank zu bleiben. Eine Vorschau würde bedeuten, dass der
Kürzer bei jedem Kurzlink die Ziel-URL abruft. Das verrät erstens Klick-Metadaten an den
Zielserver und öffnet zweitens trotz Eingabefilter eine SSRF-Angriffsfläche.

### Kommen eigene Domains noch dazu?

Im jetzigen Aufbau nicht. Der Kürzer geht von einer einzigen Basis-URL je Instanz aus
(`NEXT_PUBLIC_BASE_URL`). Willst du für ein anderes Publikum eine andere Kurzdomain,
betreibe eine zweite Instanz.

### Kann ich Links stapelweise importieren oder exportieren?

Über die Oberfläche nicht, aber die REST-API lässt sich für beide Richtungen skripten:

```bash
# Stapelweise anlegen
while read url; do
  curl -sS -X POST https://s.msk-scripts.de/api/links \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg u "$url" '{url: $u}')" \
    | jq -r '"\(.shortUrl) \(.deleteToken)"'
done < urls.txt
```

Bei einer eigenen Instanz ist direktes SQL der einfachste Weg zum Export:

```sql
SELECT short_code, original_url, expires_at, click_count FROM links;
```

### Gibt es ein Kommandozeilenwerkzeug?

Offiziell noch nicht. Auf der [Seite zur REST-API](api.md) steht eine kleine Bash-Funktion
(`mskshort()`), die du in deine `~/.bashrc` legen kannst. Ein richtiges Werkzeug ist geplant.

---

## Kommst du trotzdem nicht weiter?

- Mach ein Issue auf [GitHub](https://github.com/MSK-Scripts/msk-shortener/issues) auf
- Komm in den [Discord von MSK Scripts](https://discord.gg/5hHSBRHvJE)
- Bei Sicherheitsproblemen schau auf die Seite [Datenschutz und Sicherheit](privacy.md#eine-sicherheitslücke-melden)
