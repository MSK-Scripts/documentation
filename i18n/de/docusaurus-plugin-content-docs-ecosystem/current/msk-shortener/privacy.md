---
title: Datenschutz und Sicherheit
sidebar_position: 5
---

# Datenschutz und Sicherheit

MSK Shortener ist von Grund auf auf Datenschutz gebaut. Diese Seite erklärt genau, was beim
Anlegen eines Links und bei einem Klick darauf gespeichert wird und was nicht.

---

## Was je Link gespeichert wird

Zu jedem angelegten Kurzlink enthält die Zeile in `links`:

| Spalte | Zweck |
|---|---|
| `short_code` | Die öffentliche Kurz-ID, etwa `msk` |
| `original_url` | Die Ziel-URL |
| `password_hash` | bcrypt-Hash (Kostenfaktor 12), nur wenn ein Passwort gesetzt wurde |
| `expires_at` | Zeitpunkt, ab dem der Link als abgelaufen gilt |
| `delete_token` | Zufälliger Token mit 48 Zeichen, nur dem Ersteller gezeigt |
| `click_count` | Anonymer Zähler, nie mit einzelnen Klicks verknüpft |
| `created_at` | Zeitpunkt des Anlegens |
| `created_ip_hash` | **HMAC-SHA-256** der IP des Erstellers, ausschließlich für die Ratenbegrenzung, auch für die Tagesgrenze des Formulars |

---

## Was je Klick gespeichert wird

Jeder Klick auf einen Kurzlink ergänzt die Tabelle `clicks` um eine anonymisierte Zeile:

| Spalte | Beispielwert |
|---|---|
| `link_id` | Fremdschlüssel auf den Link |
| `clicked_at` | Zeitstempel |
| `ip_hash` | `HMAC-SHA-256(IP, IP_HASH_SECRET)`, wird nie zurückgerechnet |
| `referrer` | nur der Host, etwa `github.com`, ohne Pfad und ohne Query |
| `browser` | Familienname aus dem User-Agent, etwa `Chrome` |
| `os` | Familienname aus dem User-Agent, etwa `Linux` |
| `device_type` | `desktop`, `mobile` oder `tablet` |

Mehr nicht. Kein vollständiger User-Agent, keine vollständige Verweis-URL, keine IP im
Klartext, keine Cookies, kein Fingerprinting.

Klickzeilen hängen über `ON DELETE CASCADE` an einer `link_id`. Wird ein Link gelöscht,
verschwinden seine Klicks mit.

---

## Was NICHT gespeichert wird

- **Keine IP-Adressen im Klartext.** IPs werden mit HMAC-SHA-256 und einem serverseitigen Geheimnis (`IP_HASH_SECRET`) gehasht. Ohne das Geheimnis lassen sich die Hashes nicht zurückrechnen.
- **Kein GeoIP, keine Länderabfragen.** Die Anwendung fragt nie einen Standortdienst.
- **Keine Analyse.** Kein Google Analytics, kein Plausible, kein Fathom, kein Matomo, gar nichts.
- **Keine Tracking-Cookies.** Das einzige Cookie von MSK Shortener heißt `NEXT_LOCALE` und merkt sich deine Sprache (`de` oder `en`).
- **Ein einziges Skript von Dritten, und nur auf der Seite zum Anlegen.** Die Seite mit dem Formular lädt Cloudflare Turnstile als Spamschutz, siehe [unten](#spamschutz-cloudflare-turnstile). Wer einen Kurzlink aufruft, lädt nichts von Dritten. Alles andere kommt vom selben Ursprung.
- **Kein Referer-Logging über den Host hinaus.** Query-String und vollständiger Pfad werden vor dem Speichern abgeschnitten.
- **Keine Konten oder Sitzungen.** Es gibt weder eine Tabelle `users` noch `sessions`, kein JWT, also auch nichts, was auslaufen könnte. API-Keys für die REST-API liegen nur als scrypt-Hash in der Tabelle `api_keys`, mit kurzem Präfix, Bezeichnung und ihren Zeitpunkten.

---

## Wie die Ratenbegrenzung ohne IPs funktioniert

Eine Ratenbegrenzung muss „denselben Client" erkennen, ohne identifizierende Daten zu
speichern. Der Ablauf:

1. Die IP des Clients aus `X-Real-IP` nehmen. Den Header setzt Apache aus der Verbindung, er ersetzt alles, was ein Client selbst mitschickt. Fehlt er, gilt der letzte Eintrag in `X-Forwarded-For`, den Apache angehängt hat. `CF-Connecting-IP` und der erste Eintrag in `X-Forwarded-For` werden nie benutzt, weil der Client sie selbst schreibt und sich damit für jede Anfrage eine neue Adresse aussuchen könnte.
2. `HMAC-SHA-256(ip, IP_HASH_SECRET)` berechnen.
3. Den Hash in einem **rein im Speicher** gehaltenen gleitenden Fenster der letzten Anfragen ablegen. Das ist die Grenze pro Stunde.

Die Tagesgrenze des Formulars (20 Links je 24 Stunden) zählt die Links, die mit demselben
`created_ip_hash` gespeichert sind. Der Hash wird zusammen mit dem Link gelöscht.

Weil das Geheimnis je Installation erzeugt wird (`openssl rand -hex 32`), kann selbst jemand
mit vollem Datenbankzugriff die Hashes nicht in IP-Adressen zurückverwandeln.

Der Speicher-Eimer der Grenze pro Stunde wird bei jedem Neustart geleert, dieser Teil der
Ratenbegrenzung ist also kurzlebig. Anfragen mit API-Key werden je Key gezählt, nicht je
IP-Adresse.

---

## Spamschutz (Cloudflare Turnstile)

Die Seite mit dem Formular zum Anlegen lädt Cloudflare Turnstile von
`challenges.cloudflare.com`. Turnstile prüft, ob ein Mensch das Formular abschickt. Es ist
das einzige Skript von Dritten in MSK Shortener, und wer einen Kurzlink aufruft, lädt es
nicht.

Beim Laden der Seite zum Anlegen verbindet sich dein Browser mit Cloudflare, Cloudflare
erhält dabei deine IP-Adresse und Angaben zu deinem Browser. Schickst du das Formular ab,
reicht MSK Shortener das Turnstile-Token und deine IP-Adresse an Cloudflare weiter, um die
Prüfung zu bestätigen.

- **Anbieter:** Cloudflare, Inc., USA
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO, das berechtigte Interesse, den Dienst frei von Spam und Missbrauch zu halten
- **Übermittlung in die USA:** Cloudflare ist nach dem EU-US Data Privacy Framework zertifiziert. Zusätzlich gelten Standardvertragsklauseln.

---

## SSRF-Schutz

URLs, die auf private Adressen oder auf Loopback zeigen, werden schon beim Anlegen
abgelehnt. Das verhindert, dass dein Kürzer als Sprungbrett in interne Netze missbraucht
wird. Gesperrt sind:

- `127.0.0.0/8` (Loopback)
- `0.0.0.0`, `::1`, `localhost`
- `10.0.0.0/8` (RFC 1918)
- `172.16.0.0/12` (RFC 1918)
- `192.168.0.0/16` (RFC 1918)
- `169.254.0.0/16` (Link-Local und Cloud-Metadaten)

Akzeptiert werden ausschließlich die Schemata `http://` und `https://`, also kein `file://`,
`gopher://`, `ftp://` und dergleichen.

Darüber hinaus werden Links auf nackte IP-Adressen abgelehnt, auch auf öffentliche, ebenso
Links auf andere URL-Kürzer und auf Hostnamen, die wie Phishing-Seiten gebaut sind. Siehe
[Bedienung](usage.md#was-blockiert-wird).

---

## Passwortschutz

Passwörter werden vor dem Speichern mit **bcrypt bei Kostenfaktor 12** gehasht. Das
Klartextpasswort landet nie in der Datenbank.

Beim Prüfen greifen zwei Vorkehrungen:

1. **Allgemein gehaltene Fehlermeldungen.** Die API antwortet bei falschem Passwort und bei nicht vorhandenem Link mit demselben `401`. So lässt sich nicht herausfinden, welche Kurzcodes geschützt sind.
2. **Bremse gegen Durchprobieren.** Prüfversuche sind auf **10 je 5 Minuten** und IP-Hash begrenzt.

---

## Ablauf und Aufräumen

Jeder Link kann einen Zeitpunkt `expires_at` haben. Die Weiterleitungsroute prüft ihn bei
jeder Anfrage und zeigt den abgelaufenen Zustand, sobald er überschritten ist.

Ein nächtlicher Cronjob (`scripts/cleanup.ts`) führt
`DELETE FROM links WHERE expires_at < NOW()` aus und entfernt abgelaufene Zeilen
tatsächlich. Standardmäßig läuft er um 03:30 Uhr Serverzeit. Das `ON DELETE CASCADE` an der
Tabelle `clicks` sorgt dafür, dass die zugehörigen Klickdaten mit verschwinden.

---

## Datenbank-Backups

Das beiliegende Skript `backup.sh` legt täglich einen SQL-Dump an (standardmäßig um 03:00
Uhr) und hält ihn **14 Tage** vor. Backups enthalten alles aus der Datenbank, also auch
gehashte IPs und Passwort-Hashes, aber keine IPs und keine Passwörter im Klartext.

Sie sicher aufzubewahren, ist deine Aufgabe. Denk an:

- den Dump verschlüsseln (`gpg --symmetric`)
- ihn außer Haus schaffen (rsync, S3 mit SSE, restic nach Backblaze und Ähnliches)
- die Dateirechte des Backup-Verzeichnisses einschränken

---

## CSP und Sicherheits-Header

MSK Shortener setzt bei jeder Antwort eine strikte Content Security Policy und weitere
Header, und zwar in `proxy.ts`:

```
Content-Security-Policy: default-src 'none'; script-src 'self' 'nonce-...' 'strict-dynamic' https://challenges.cloudflare.com; ...
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

Die einzige fremde Quelle, die die Policy zulässt, ist `https://challenges.cloudflare.com`,
für das Skript von Turnstile, seinen Frame und seine Anfragen.

Der Apache-vHost erzwingt zusätzlich HTTPS, OCSP-Stapling und zeitgemäße TLS-Verfahren.

---

## Eine Sicherheitslücke melden

Du hast ein Sicherheitsproblem gefunden? Bitte melde es über:

- **GitHub Security Advisories:** [vertraulich einreichen](https://github.com/MSK-Scripts/msk-shortener/security/advisories/new)
- **E-Mail:** `info@msk-scripts.de`

Mach für Sicherheitsprobleme bitte **kein** öffentliches GitHub-Issue auf, damit wir die
Lücke schließen und verantwortungsvoll offenlegen können.

---

## Quelloffen

MSK Shortener steht unter [AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0). Du
kannst jede Zeile des Quellcodes auf
[GitHub](https://github.com/MSK-Scripts/msk-shortener) nachlesen und diese Angaben selbst
überprüfen. Änderst du den Code und betreibst die geänderte Fassung als Netzwerkdienst,
verlangt die AGPL, dass du deine Änderungen veröffentlichst.
