---
title: Datenschutz und Sicherheit
sidebar_position: 5
---

# Datenschutz und Sicherheit

MSK Paste ist von Grund auf auf Datenschutz gebaut. Diese Seite erklärt genau, was beim
Anlegen und Ansehen eines Pastes gespeichert wird und was nicht.

---

## Was gespeichert wird

Zu jedem angelegten Paste enthält die Datenbankzeile:

| Spalte | Zweck |
|---|---|
| `paste_id` | Die öffentliche Kurz-ID, etwa `X7q9bA2k` |
| `title` | Optionaler Titel, nur wenn du einen angegeben hast |
| `content` | Der Text des Pastes |
| `language` | Die gewählte Sprache für die Syntaxhervorhebung |
| `password_hash` | bcrypt-Hash (Kostenfaktor 12), nur wenn ein Passwort gesetzt wurde |
| `expires_at` | Zeitpunkt, ab dem der Paste nicht mehr erreichbar ist und gelöscht wird |
| `burn_after_read` | Wahrheitswert |
| `view_count` | Anonymer Zähler, nie mit Betrachtern verknüpft |
| `delete_token` | Zufälliger Token mit 64 Zeichen, nur dem Ersteller gezeigt |
| `size_bytes` | Größe von `content` in Bytes |
| `created_at` | Zeitpunkt des Anlegens |
| `created_ip_hash` | **HMAC-SHA-256** der IP des Erstellers, ausschließlich für die Ratenbegrenzung |

Mehr nicht. Es gibt keine Tabelle für Aufrufe, keine für Nutzer, keine für Sitzungen und
keine Spalte mit einer IP-Adresse im Klartext.

---

## Was NICHT gespeichert wird

- **Keine IP-Adressen im Klartext.** IPs werden mit HMAC-SHA-256 und einem serverseitigen Geheimnis (`IP_HASH_SECRET`) gehasht. Ohne das Geheimnis lassen sich die Hashes nicht zurückrechnen.
- **Kein GeoIP, keine Länderabfragen.** Die Anwendung fragt nie einen Standortdienst.
- **Keine Analyse.** Kein Google Analytics, kein Plausible, kein Fathom, kein Matomo, gar nichts.
- **Keine Tracking-Cookies.** Das einzige Cookie von MSK Paste heißt `MSK_PASTE_LOCALE` und merkt sich deine Sprache (`de` oder `en`).
- **Keine Skripte von Dritten.** Alle Dateien kommen vom selben Ursprung. Shiki und die Schriften werden beim Bauen mit eingepackt.
- **Kein Referer-Logging auf Anwendungsebene.** Apache schreibt möglicherweise übliche Zugriffsprotokolle, das entscheidet der Betreiber.
- **Kein Aufrufverlauf.** Der Zähler steigt, aber die Anwendung hat keine Möglichkeit zu wissen, *wer* einen Paste angesehen hat.

---

## Wie die Ratenbegrenzung ohne IPs funktioniert

Eine Ratenbegrenzung muss „denselben Client" erkennen, ohne identifizierende Daten zu
speichern. Der Ablauf:

1. Die anfragende IP aus `X-Forwarded-For` (von Apache gesetzt) oder von der Socket-Adresse nehmen.
2. `HMAC-SHA-256(ip, IP_HASH_SECRET)` berechnen.
3. Den Hash in einem **rein im Speicher** gehaltenen gleitenden Fenster der letzten Anfragen ablegen.

Weil das Geheimnis je Installation erzeugt wird (`openssl rand -hex 32`), kann selbst
jemand mit vollem Datenbankzugriff die Hashes nicht in IP-Adressen zurückverwandeln. Ohne
das Geheimnis lässt sich keine Rainbow Table dafür berechnen.

Der Speicher-Eimer wird bei jedem Neustart geleert, selbst der Zustand der Ratenbegrenzung
ist also kurzlebig.

---

## Passwortschutz

Passwörter werden vor dem Speichern mit **bcrypt bei Kostenfaktor 12** gehasht. Das
Klartextpasswort landet nie in der Datenbank. Beim Prüfen wird das eingegebene Passwort
gegen den Hash gehalten. Fehlversuche zählen **nicht** im Aufrufzähler mit und lösen
**kein** Löschen nach dem Lesen aus.

:::info
Der **Inhalt selbst liegt unverschlüsselt**. Das Passwort schützt den Zugriff, aber wer die
Datenbank verwaltet, könnte den Inhalt technisch direkt lesen. Für wirklich sensible
Geheimnisse behandle MSK Paste als nicht vertrauenswürdig und verschlüssle den Inhalt
vorher selbst, etwa mit `age` oder `gpg`.
:::

---

## Nach dem Lesen löschen

Ist die Funktion aktiv, löst der erste erfolgreiche Aufruf ein **atomares SQL-`DELETE`** im
selben Durchgang wie das Lesen aus. Das bedeutet:

- Zwei gleichzeitige Betrachter können den Inhalt nicht beide sehen. Nur einer gewinnt das Rennen, der andere sieht den Zustand „verbrannt".
- Nach dem Löschen ist die Zeile weg. Kein Ausblenden, keine Wiederherstellung.
- Selbst der Betreiber, also du beim Selbsthosten, kommt danach nicht mehr an den Inhalt.

---

## Ablauf und Aufräumen

Jeder Paste hat einen Zeitpunkt `expires_at`. Die Ansicht prüft ihn bei jeder Anfrage und
zeigt den abgelaufenen Zustand, sobald er überschritten ist.

Ein nächtlicher Cronjob (`scripts/cleanup.ts`) führt
`DELETE FROM pastes WHERE expires_at < NOW()` aus und entfernt abgelaufene Zeilen
tatsächlich. Standardmäßig läuft er um 03:30 Uhr Serverzeit.

Soll ein Paste sofort beim Ablauf verschwinden statt erst nachts, lass das Aufräumskript
einfach häufiger laufen, etwa stündlich.

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

MSK Paste bringt über die `next.config.ts` eine strikte Content Security Policy und weitere
Header mit:

```
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Der Apache-vHost erzwingt zusätzlich HTTPS, OCSP-Stapling und zeitgemäße TLS-Verfahren.

---

## Eine Sicherheitslücke melden

Du hast ein Sicherheitsproblem gefunden? Bitte melde es über:

- **GitHub Security Advisories:** [vertraulich einreichen](https://github.com/MSK-Scripts/msk-paste/security/advisories/new)
- **E-Mail:** `info@msk-scripts.de`

Mach für Sicherheitsprobleme bitte **kein** öffentliches GitHub-Issue auf, damit wir die
Lücke schließen und verantwortungsvoll offenlegen können.

---

## Quelloffen

MSK Paste steht unter [AGPL-3.0-or-later](https://www.gnu.org/licenses/agpl-3.0). Du kannst
jede Zeile des Quellcodes auf [GitHub](https://github.com/MSK-Scripts/msk-paste) nachlesen
und diese Angaben selbst überprüfen. Änderst du den Code und betreibst die geänderte
Fassung als Netzwerkdienst, verlangt die AGPL, dass du deine Änderungen veröffentlichst.
