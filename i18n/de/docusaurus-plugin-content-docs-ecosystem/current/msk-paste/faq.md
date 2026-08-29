---
title: FAQ und Fehlersuche
sidebar_position: 6
---

# FAQ und Fehlersuche

## Allgemein

### Ist MSK Paste kostenlos?

Ja. Die gehostete Instanz unter [paste.msk-scripts.de](https://paste.msk-scripts.de) ist für
alle kostenlos. Der Quellcode steht unter AGPL-3.0, du kannst es also auch auf deiner
eigenen Infrastruktur betreiben.

### Brauche ich ein Konto?

Nein. MSK Paste hat bewusst kein Nutzersystem. Der Lösch-Token, den du beim Anlegen
bekommst, ist das, womit du einen Paste später wieder entfernst.

### Kann ich einen Paste nachträglich bearbeiten?

Nein. Pastes sind unveränderlich. Zum „Bearbeiten" legst du einen neuen an und löschst den
alten mit dem Lösch-Token.

### Wie groß darf ein Paste sein?

1 MB Text. Die Grenze wird serverseitig und von der Datenbank durchgesetzt. Für größere
Dateien nimm lieber einen richtigen Dateihoster.

### Wie lange lebt ein Paste?

Von 10 Minuten bis zu 1 Jahr, standardmäßig 1 Woche. Ist ein Paste abgelaufen, ist er sofort
nicht mehr erreichbar und verschwindet binnen 24 Stunden auch physisch aus der Datenbank.

### Sind Pastes verschlüsselt?

Die Spalte `content` liegt **nicht** verschlüsselt. Passwörter schützen das Ansehen, aber
der Betreiber könnte die Datenbank lesen. Brauchst du echte Ende-zu-Ende-Vertraulichkeit,
verschlüssle den Inhalt vorher auf deinem Rechner, etwa mit `age` oder `gpg`.

### Kann ich einen gelöschten oder abgelaufenen Paste wiederherstellen?

Nein. Löschen ist endgültig, ob von Hand, durch Ablauf oder nach dem Lesen. Es gibt kein
Ausblenden und keinen Papierkorb.

### Kann ich öffentliche Pastes durchsuchen?

Nein. Jeder Paste ist ungelistet, nur wer die ID kennt, findet ihn. Es gibt kein
öffentliches Verzeichnis, keine Suche und keinen Endpunkt, der auflistet.

---

## Die API benutzen

### Wo ist mein API-Key?

Es gibt keinen. Alle Endpunkte sind öffentlich. Schreibende Aufrufe schützt die
Ratenbegrenzung, also 10 Anlagen pro Stunde je IP-Hash.

### Warum bekomme ich `429 Too Many Requests`?

Du hast die Ratenbegrenzung von `POST /api/pastes` erreicht. Im Header `Retry-After` steht,
wie viele Sekunden du warten musst. Betreibst du eine eigene Instanz und brauchst mehr,
ändere `RATE_LIMIT_CREATE_PER_HOUR` in der `.env`.

### Wie lösche ich einen Paste über die API?

Schick `DELETE /api/pastes/:id?token=<deleteToken>`. Den Token hast du in der Antwort beim
Anlegen bekommen.

### Bekomme ich eine Liste aller Pastes, die ich angelegt habe?

Nein. Es gibt keinen Verlauf je Nutzer, die Datenbank weiß nicht, welche Pastes „dir"
gehören. Sichere die Lösch-Token bei dir, wenn du einen persönlichen Verlauf willst.

---

## Selbst hosten

### `502 Bad Gateway` von Apache

Apache erreicht den Node-Prozess nicht. Prüfe:

```bash
sudo systemctl status msk-paste
sudo journalctl -u msk-paste -n 100
sudo ss -tlnp | grep 3012
```

Startet der Dienst nicht, schau ins Journal. Die häufigsten Ursachen sind:

- fehlende oder falsche Werte in der `.env`, vor allem `DB_*` und `IP_HASH_SECRET`
- die Datenbank verweigert die Verbindung
- Port `3012` ist schon von einem anderen Prozess belegt

### Port 3012 ist belegt

Stoppe entweder den störenden Prozess oder ändere den Port an beiden Stellen, in der `.env`
(`PORT=3013`) und im Apache-vHost (`ProxyPass http://localhost:3013/`). Danach beide Dienste
neu starten.

### „Cannot find module" nach dem Deploy

Meist ist `npm ci` fehlgeschlagen oder `node_modules/` fehlt. Im Projektverzeichnis:

```bash
sudo rm -rf node_modules
sudo npm ci
sudo npm run build
sudo systemctl restart msk-paste
```

### Datenbankfehler beim Start

```
Error: Access denied for user 'msk_paste'@'localhost'
```

Die Zugangsdaten in der `.env` passen nicht zu denen in MariaDB. Prüfe es, indem du dich von
Hand anmeldest:

```bash
mysql -u msk_paste -p msk_paste
```

Klappt das nicht, lege den Nutzer neu an, siehe [Installation](installation.md).

### `IP_HASH_SECRET is required` beim Start

Du hast das Geheimnis in der `.env` nicht gesetzt. Erzeuge eines:

```bash
openssl rand -hex 32
```

Trag es in die `.env` ein und starte den Dienst neu.

### Ratenbegrenzung von Let's Encrypt erreicht

Hast du beim Ausprobieren mit certbot die Grenze gerissen, nimm zum Testen die
**Staging**-Umgebung:

```bash
sudo certbot --apache --staging -d paste.example.com
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
sudo bash /opt/msk-paste/deployment/scripts/backup.sh
```

Es legt einen SQL-Dump mit Datum im Dateinamen unter `/opt/msk-paste/backups/` ab.
Standardmäßig bleiben 14 Tage erhalten.

---

## Funktionen

### Warum gibt es keinen Datei-Upload?

Das gehört nicht dazu. MSK Paste ist ein Pastebin für **Text**. Für Dateien nimm einen
richtigen Dateihoster wie [Nextcloud](https://nextcloud.com/) oder die
[Storage Boxes von Hetzner](https://www.hetzner.com/storage/storage-box).

### Warum keine Kommentare, Diskussionen oder Forks?

Weil Datenschutz an erster Stelle steht. Alles jenseits von „einen Schnipsel teilen"
schafft Angriffsfläche für Verfolgung: wer kommentiert hat, wer geforkt hat, wer geantwortet
hat. Brauchst du Zusammenarbeit, nimm lieber [HedgeDoc](https://hedgedoc.org/).

### Kommt `<Sprache>` noch dazu?

Mach ein [Issue](https://github.com/MSK-Scripts/msk-paste/issues) mit dem Namen der Sprache
und ihrer Kennung bei Shiki auf. Eine Sprache zu ergänzen ist meist eine Zeile Code.

### Kann ich das Aussehen anpassen?

Ja. Forke das Repository und ändere `tailwind.config.ts` und `app/globals.css`, die MSK
Design Tokens stecken in diesen beiden Dateien.

### Gibt es ein Kommandozeilenwerkzeug?

Offiziell noch nicht. Auf der [Seite zur REST-API](api.md) steht eine kleine Bash-Funktion
(`mskpaste()`), die du in deine `~/.bashrc` legen kannst. Ein richtiges Werkzeug ist geplant.

---

## Kommst du trotzdem nicht weiter?

- Mach ein Issue auf [GitHub](https://github.com/MSK-Scripts/msk-paste/issues) auf
- Komm in den [Discord von MSK Scripts](https://discord.gg/5hHSBRHvJE)
- Bei Sicherheitsproblemen schau auf die Seite [Datenschutz und Sicherheit](privacy.md#eine-sicherheitslücke-melden)
