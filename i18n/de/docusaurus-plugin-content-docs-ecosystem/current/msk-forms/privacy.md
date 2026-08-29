---
title: Datenschutz und Sicherheit
sidebar_position: 9
---

# Datenschutz und Sicherheit

MSK Forms ist eine gehostete Anwendung, Einsendungen werden also gespeichert, damit Prüfer sie
lesen und Bewerber ihren Status verfolgen können. Diese Seite sagt ehrlich, was das bedeutet
und wie die Daten geschützt sind.

---

## Welche Daten gespeichert werden

| Daten | Wofür |
|---|---|
| Antworten einer Einsendung samt hochgeladener Dateien | Damit Prüfer prüfen und Bewerber ihre eigene Einsendung sehen können. |
| Discord-Identität angemeldeter Bewerber und des Teams (Nutzer-ID, Benutzername, Avatar, E-Mail, Sprache) | Anmeldung, Status-DMs, Teamzugehörigkeit. |
| Serverdaten (Name, Einstellungen, Design, Bot-Konfiguration) | Um deine Formulare und deinen Bot zu betreiben. |
| Ereignisse zu Einsendung und Prüfung, Statusverlauf | Für den Verlauf und das Prüfprotokoll. |
| Ausgangskorb für Benachrichtigungen | Um Status-DMs und Webhooks zuzustellen. |

**Anonyme Einsendungen** über öffentliche Formulare ohne Anmeldung tragen keine
Discord-Identität und bekommen keine DMs. Sie sind allein über den Link zur Einsendung
identifizierbar.

### Sensible Geheimnisse liegen verschlüsselt

Geheimnisse, die du für [Anbindungen je Server](branding-and-domains.md) einträgst, also dein
Client Secret für Discord OAuth und dein Turnstile-Secret, liegen **verschlüsselt**
(AES-256-GCM) und gehen nach dem Speichern nie wieder an den Browser zurück.

---

## Selbstbedienung für Bewerber (DSGVO)

Von seiner Statusseite aus, allein mit dem Link zur Einsendung und ohne Anmeldung, nimmt ein
Bewerber seine Rechte selbst wahr:

| Recht | Wie |
|---|---|
| **Auskunft (Art. 15)** | Die Einsendung als JSON **exportieren**. |
| **Datenübertragbarkeit (Art. 20)** | Derselbe JSON-Export. |
| **Löschung (Art. 17)** | Die Einsendung **löschen**, die Zeile verschwindet kaskadierend und hochgeladene Dateien werden aus dem Speicher entfernt. |
| Einwilligung widerrufen | Die Einsendung **zurückziehen**, sie steht dann auf *Zurückgezogen*. |

Teams können Einsendungen und ganze Formulare ebenfalls löschen, wobei mit dem Formular auch
seine Einsendungen und Dateien verschwinden.

---

## Datei-Uploads

Datei- und Bild-Uploads laufen aus Sicherheitsgründen **über den Server**:

- Der Browser lädt zu MSK Forms hoch, das die Datei unter einem zufälligen Schlüssel in einen privaten, S3-kompatiblen Speicher (MinIO) weiterreicht. Der Speicher ist **nicht** öffentlich, es gibt weder öffentliche Buckets noch vorsignierte URLs.
- Downloads laufen wieder über MSK Forms. Die Datei geht als **Anhang** mit `application/octet-stream` und `nosniff` raus, ein bösartig hochgeladenes HTML oder SVG kann im Browser eines Opfers also nicht ausgeführt werden.
- Grenzen für Größe und MIME-Typ setzt der Server anhand der gespeicherten Metadaten durch, nicht anhand der Behauptung des Browsers.
- **Logo-Uploads** werden zusätzlich nach WebP umgewandelt, was jede versteckte Nutzlast entfernt, siehe [Design](branding-and-domains.md#logo).

---

## Schutz vor Missbrauch

| Maßnahme | Details |
|---|---|
| **Ratenbegrenzung** | Der öffentliche Endpunkt zum Absenden ist je IP begrenzt, über ein festes Fenster in Redis. Für den Upload und einige weitere öffentliche Endpunkte gilt das ebenfalls. |
| **Captcha** | Optionales Cloudflare Turnstile auf öffentlichen Formularen, auf der Hauptdomain standardmäßig an, auf eigenen Domains je Server. |
| **Prüfung von Hosts und offenen Weiterleitungen** | Die Abläufe für Anmeldung und Domains prüfen Hostnamen und lassen nur relative Weiterleitungsziele zu. |

---

## Übertragung und Header

Die Sicherheits-Header setzt die Anwendung, der Apache-Reverse-Proxy entfernt Doppelungen:

```
Content-Security-Policy: nonce-basiert, 'strict-dynamic' (im Produktivbetrieb keine Inline-Skripte)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy: same-origin
```

Die CSP ist **nonce-basiert mit `'strict-dynamic'`**, im Produktivbetrieb gibt es keine
Inline-Skripte.

---

## Webhooks

Ausgehende Webhooks sind mit **HMAC-SHA256** und einem Geheimnis je Webhook **signiert**,
damit der Empfänger die Echtheit prüfen kann. Siehe
[Anbindungen und API](integrations-and-api.md#ausgehende-webhooks).

---

## Wer eine Einsendung lesen darf

- **Jeder mit dem Statuslink** darf genau diese eine Einsendung sehen, der Link ist der Schlüssel, und die Selbstbedienung nutzen.
- **Prüfer** dürfen die Formulare prüfen, für die sie freigegeben sind, entweder serverweit über die Rolle Prüfer oder über eine Freigabe je Formular.
- **Manager** haben auf ihrem Server vollen Zugriff.
- **Reine Betrachter** ohne Freigabe sehen überhaupt keine Einsendungsdaten.

Eine Einsendung auf einer eigenen Domain wird ausschließlich vom Server dieser Domain
ausgeliefert.

---

:::info
Etwas zur Sicherheit gefunden? Melde es bitte verantwortungsvoll über die Sicherheitsrichtlinie
des Repositories statt über ein öffentliches Issue:
[github.com/MSK-Scripts/msk-forms](https://github.com/MSK-Scripts/msk-forms).
:::
