---
title: Web-Dashboard
description: Optionales, selbst gehostetes Web-Dashboard für Tickets, Statistiken, Konfiguration und die Steuerung des Bots
sidebar_position: 6
---

## 🖥️ Web-Dashboard

Tickets, Statistiken und die Konfiguration des Bots im Browser verwalten, statt Dateien
über SSH zu bearbeiten.

Das Dashboard ist **optional und standardmäßig abgeschaltet**. Schaltest du es nie ein,
ändert sich an deinem Bot gar nichts.

### Was es kann

| Bereich | Was du bekommst |
|---|---|
| **Meine Tickets** | Ist das [Portal für Endnutzer](#das-öffentliche-portal-für-endnutzer) aktiv, sieht jedes Mitglied die eigenen Tickets und kann auf offene antworten. Die Antwort landet unter seinem eigenen Namen im Discord-Kanal. Bei geschlossenen Tickets gibt es das Transkript zum Download und mit Premium einen Link „Transkript öffnen". |
| **Tickets** | Vollständige Liste mit Filtern, Detailansicht mit dem laufenden Gespräch, dazu übernehmen, schließen, wieder öffnen, verschieben, sperren und Priorität setzen. |
| **Statistiken** | Gesamtzahlen, Durchschnittsbewertung, durchschnittliche Bearbeitungsdauer und eine Rangliste des Teams nach geschlossenen Tickets. |
| **Konfiguration** | `config.jsonc`, `snippets.jsonc`, `.env` und die Sprachdateien bearbeiten, wahlweise in einer strukturierten **Formularansicht** oder als **Rohdatei** mit Zeilennummern und Syntaxhervorhebung. Änderungen über das Formular erhalten die `//`-Kommentare, und eine Seitenleiste löst **Namen** von Discord-Rollen, -Kanälen und -Kategorien auf, damit du nie nach rohen IDs suchen musst. |
| **Bot-Steuerung** | Starten, stoppen, neu starten und aktualisieren, dazu eine Live-Konsole. |
| **Berechtigungen** | Festlegen, welche Rollen und Nutzer das Dashboard verwenden dürfen und was genau. |
| **Dashboard-Einstellungen** | [Akzentfarbe und Favicon](#dashboard-einstellungen) setzen und das Dashboard so an deine Marke anpassen. Hat eigene Rechte zum Ansehen und Ändern, der Inhaber besitzt immer beide. |
| **Sprache** | Jeder Nutzer wählt [seine eigene Oberflächensprache](#sprache) aus sieben Übersetzungen. |

Jede Ansicht hat ihre eigene URL (`/tickets`, `/stats`, `/permissions`, ein geöffnetes
Ticket ist `/tickets/123`). Ein Neuladen bringt dich also auf dieselbe Seite zurück und
Links lassen sich weitergeben.

## Sprache

Das Dashboard gibt es auf **Englisch, Deutsch, Französisch, Spanisch, Portugiesisch,
Polnisch und Ungarisch**. Die Auswahl sitzt unten in der Seitenleiste, über „Abmelden".

Jeder wählt seine eigene Sprache, die Entscheidung liegt im jeweiligen Browser. Stellst du
das Panel auf Deutsch, ändert sich für niemanden sonst etwas, und ein Recht braucht es
dafür auch nicht. Beim ersten Besuch folgt das Dashboard der Browsersprache und fällt
sonst auf Englisch zurück. Datum und Uhrzeit richten sich ebenfalls nach der gewählten
Sprache.

:::note
Das ist die Oberflächensprache des **Dashboards**. Sie hat nichts mit `lang` in der
`config.jsonc` zu tun, das bestimmt, was der **Bot** nach Discord schreibt. Wenn jemand
aus dem Team das Panel auf Polnisch liest, ändert das nichts an deinen Ticket-Embeds.
:::

Eine Sprache zu ergänzen braucht keine Codeänderung: Lege eine
`web/src/locales/<code>.json` ab (kopiere `en.json`, übersetze die Werte, trage bei
`$meta.name` den Namen der Sprache in dieser Sprache ein) und baue das Frontend neu. Sie
taucht dann von selbst in der Auswahl auf. Schlüssel, die du auslässt, fallen auf Englisch
zurück, statt die Seite zu zerlegen.

Das strukturierte Formular für die `config.jsonc` ist mit seinen Feldbeschriftungen und
Hilfetexten weiterhin nur auf Englisch, der Rest des Dashboards ist übersetzt.

## Schnellstart

```bash
npm run dashboard:setup   # geführte Einrichtung: erzeugt Geheimnisse, schreibt die .env
npm run dashboard         # startet den Bot MIT dem Dashboard
```

`npm start` funktioniert unverändert weiter und startet den reinen Bot ganz ohne
Webserver.

Der Einrichtungsassistent fragt, wie du das Dashboard erreichen willst, und schreibt die
passende Konfiguration. Eine unsichere Kombination **verweigert** er.

## Wie es läuft

Das Dashboard steckt **nicht** im Bot-Prozess. Es ist der **Elternprozess** und startet
den Bot als Kind:

```
node dashboard.js   ← das Dashboard (Webserver und Aufseher)
   └── index.js     ← der Bot
```

Genau deshalb kann das Dashboard den Bot überhaupt neu starten. Ein Dashboard im Bot
könnte den Prozess, aus dem es ausgeliefert wird, nicht neu starten und wäre ausgerechnet
dann weg, wenn du es am dringendsten brauchst, nämlich nach einem Absturz. Getrennt bleibt
das Dashboard oben, zeigt dir den Absturz in der Konsole und lässt dich den Bot wieder
starten.

## Sicherheit

Das Dashboard kann deinen Bot neu starten und deine `.env` bearbeiten. Behandle es wie ein
Admin-Panel, denn genau das ist es.

### Ab Werk sicher

* **Abgeschaltet**, solange du nicht `DASHBOARD_ENABLED=true` setzt.
* **An `127.0.0.1` gebunden**, aus dem Internet also gar nicht erreichbar.
* **Verweigert den Start**, wenn du es ohne HTTPS an eine öffentliche Schnittstelle
  bindest. Du bekommst eine klare Fehlermeldung mit dem Lösungsweg statt eines still
  offenen Panels.
* Der Signaturschlüssel (`SESSION_SECRET`) wird **pro Installation erzeugt**. Es gibt
  keinen mitgelieferten Standard, denn ein gemeinsamer Standardwert würde erlauben, auf
  allen Installationen gleichzeitig Logins zu fälschen.

### Wie du drankommst

**Variante A: SSH-Tunnel (am einfachsten, nichts wird veröffentlicht)**

```bash
ssh -L 3010:127.0.0.1:3010 user@dein-server
```

Danach `http://127.0.0.1:3010` auf deinem eigenen Rechner öffnen.

**Variante B: Reverse Proxy mit HTTPS (für den echten Betrieb)**

Lass `DASHBOARD_HOST=127.0.0.1` stehen und setze einen Reverse Proxy mit HTTPS davor, dann
muss der Port nie ins Internet. `npm run dashboard:setup` erkennt dein Betriebssystem und
gibt eine passende Konfiguration aus. Das Dashboard holt Logs per Abfrage ab, es gibt also
keinen dauerhaft offenen Datenstrom, und jeder übliche Reverse Proxy funktioniert ohne
besondere Puffereinstellungen. Schritt für Schritt steht das in der Anleitung für deine
Plattform:

- **[Dashboard-Einrichtung unter Windows](./guides/dashboard-windows.md)**, mit IIS oder Caddy
- **[Dashboard-Einrichtung unter Linux](./guides/dashboard-linux.md)**, mit Apache und certbot

:::warning
Setze **nicht** einfach `DASHBOARD_HOST=0.0.0.0` und öffne den Port. Ohne TLS wandern dein
Sitzungscookie und alles, was du tippst, im Klartext durchs Netz. Der Bot verweigert in
dieser Konstellation ohnehin den Start.
:::

## Anmeldung und Berechtigungen

Die Anmeldung läuft über **Discord OAuth** mit der Anwendung, die du für den Bot ohnehin
schon angelegt hast. Du musst nur:

1. Die Redirect-URI, die der Einrichtungsassistent nennt, im
   [Discord Developer Portal](https://discord.com/developers/applications) unter
   **OAuth2 → Redirects** eintragen.
2. Das **Client Secret** aus **OAuth2 → Client Secret** nach `CLIENT_SECRET` kopieren.

Deine Discord-Rollen löst **der Bot serverseitig** auf. Das Dashboard glaubt dir nicht
aufs Wort, welche Rechte du hast.

### Das Rechtemodell

* Der **Serverinhaber** hat immer alle Rechte und kann sich nie aussperren.
* Du vergibst Zugriff an **Rollen** oder an einzelne **Nutzer**.
* **Ein Eintrag für einen Nutzer überschreibt dessen Rolleneinträge vollständig.** Genau
  dafür gibt es beides: So kannst du einer einzelnen Person ein Recht *wegnehmen*, das
  ihre Rolle ihr gibt.
* Wer gar keinen Eintrag hat, sieht **nur die eigenen Tickets** und kann darauf antworten,
  mehr nicht, und auch das nur, wenn das
  [Portal für Endnutzer](#das-öffentliche-portal-für-endnutzer) aktiv ist. Standardmäßig
  ist das Dashboard **rein für das Team**.

| Recht | Erlaubt |
|---|---|
| `tickets.view` | Ticketliste und Ticketdetails sehen |
| `tickets.act` | Übernehmen, schließen, wieder öffnen, verschieben, sperren, Priorität setzen |
| `tickets.reply` | Im Ticket als Bot antworten |
| `stats.view` | Statistiken und Teamleistung sehen |
| `config.view` / `config.edit` | Konfigurationsdateien lesen bzw. schreiben |
| `settings.view` / `settings.edit` | Akzentfarbe und Favicon des Dashboards ansehen bzw. ändern |
| `bot.control` | Bot starten, stoppen, neu starten, aktualisieren |
| `blacklist.manage` | Blacklist verwalten |
| `access.manage` | Diese Rechte verwalten |

Du kannst dir weder dein eigenes `access.manage` entziehen noch dich selbst deaktivieren
noch dir ein Recht geben, das du nicht schon hast. *Anderen* Rechte zu geben, ist dagegen
uneingeschränkt möglich.

Jede Änderung über das Dashboard landet in einem Prüfprotokoll.

## Das öffentliche Portal für Endnutzer

Standardmäßig ist das Dashboard **rein für das Team**: Nur der Serverinhaber und
Mitglieder, denen du mindestens ein Recht gegeben hast, können sich anmelden. Das
Dashboard für dein Team einzuschalten, gibt also nicht stillschweigend jedem Servermitglied
einen Zugang.

Mit `DASHBOARD_PUBLIC_PORTAL=true` (der Einrichtungsassistent bietet das ebenfalls an)
öffnest du das Portal für Endnutzer. Jedes Mitglied kann sich dann mit Discord anmelden
und bekommt die Ansicht **„Meine Tickets"** mit **ausschließlich den eigenen Tickets**.
Dort verfolgt es das laufende Gespräch, antwortet auf ein offenes Ticket (die Antwort
erscheint in Discord unter seinem eigenen Namen) und lädt bei einem geschlossenen das
Transkript herunter. Ein Mitglied ohne Rechte sieht niemals fremde Tickets, Statistiken,
die Konfiguration oder die Bot-Steuerung, und jede Antwort wird serverseitig erneut geprüft
(Ticket offen, nicht gesperrt, Mitglied nicht auf der Blacklist, wirklich das eigene
Ticket), bevor sie Discord erreicht.

:::note
Wer abgewiesen wird, bekommt eine deutliche Meldung, dass der Zugang dem Team vorbehalten
ist. Gib der Person entweder unter **Berechtigungen** ein Recht oder aktiviere
`DASHBOARD_PUBLIC_PORTAL`.
:::

## Dashboard-Einstellungen

Über den Reiter **Dashboard-Einstellungen** passt du das Panel für alle an, die es nutzen.
Anders als der `.env`-Editor ist er nicht dem Inhaber vorbehalten, er hat mit
`settings.view` und `settings.edit` eigene Rechte. Du kannst also vertrauten Teammitgliedern
die Gestaltung überlassen, ohne ihnen die Geheimnisse des Bots zu geben. Der Inhaber hat
immer beide Rechte. Wer nur `settings.view` hat, sieht die aktuelle Farbe und das Favicon,
kann aber nichts bedienen. Einstellbar ist:

* Die **Akzentfarbe** für Buttons, Hervorhebungen, den aktiven Menüpunkt und Fokusrahmen.
  Sie zeigt sich schon beim Auswählen in der Vorschau und geht mit einem Klick zurück auf
  das eingebaute Grün.
* Das **Favicon** im Browser-Tab. Lade eine PNG- oder ICO-Datei hoch (bis 256 KB), der
  Dateityp wird am Inhalt erkannt, nicht am Namen.

Beides wird öffentlich ausgeliefert, damit auch die Anmeldeseite im richtigen Design
erscheint. Gespeichert wird es in `data/dashboard-settings.json` (plus der Favicon-Datei)
und gehört allein zum Dashboard, am Bot und seiner Datenbank ändert sich nichts.

## Umgebungsvariablen

| Variable | Standard | Bedeutung |
|---|---|---|
| `DASHBOARD_ENABLED` | `false` | Hauptschalter |
| `DASHBOARD_HOST` | `127.0.0.1` | Adresse, an der gelauscht wird. Lass sie in Ruhe, solange du keinen Grund hast. |
| `DASHBOARD_PORT` | `3010` | Port |
| `DASHBOARD_PUBLIC_URL` | `http://127.0.0.1:<port>` | Die URL, die dein Browser nutzt. Muss zur Redirect-URI bei Discord passen. |
| `DASHBOARD_PUBLIC_PORTAL` | `false` | Aus bedeutet: nur für das Team. An bedeutet: jedes Mitglied darf sich anmelden und nur die eigenen Tickets verwalten. |
| `DASHBOARD_ALLOW_INSECURE` | `false` | Nur, wenn du TLS an einer Stelle beendest, die der Bot nicht sehen kann |
| `SESSION_SECRET` | *wird erzeugt* | Signaturschlüssel für das Cookie. Niemals weitergeben oder wiederverwenden. |
| `CLIENT_SECRET` | *(keiner)* | Client Secret für Discord OAuth2 |

## Als Dienst betreiben

:::note[Reverse Proxy und Dienstverwaltung sind zwei getrennte Ebenen]
Ein Reverse Proxy (Apache, Caddy oder IIS) beendet nur HTTPS und reicht an das Dashboard
weiter, er startet den Node-Prozess **nicht**. Eine Dienstverwaltung (systemd, unter
Windows NSSM oder die Aufgabenplanung) hält den Node-Prozess (`node dashboard.js`) am
Leben, kümmert sich aber **nicht** um HTTPS. Für den öffentlichen Betrieb brauchst du
beides. Eine Caddy- oder IIS-Instanz kann gleichzeitig vor mehreren Anwendungen stehen (ein
Site-Block je Hostname), sie kommt einem Proxy, den du schon betreibst, also nie in die
Quere. Ergänze einfach einen weiteren Block, statt eine zweite Instanz zu starten.
:::

Nimm `dashboard.js` statt `index.js` als Einstiegspunkt. Die Dienstverwaltung hält das
Dashboard am Leben, das Dashboard hält den Bot am Leben. Die genauen Schritte stehen in der
Anleitung für deine Plattform:

- **[Dashboard-Einrichtung unter Windows](./guides/dashboard-windows.md)**, mit Aufgabenplanung oder NSSM
- **[Dashboard-Einrichtung unter Linux](./guides/dashboard-linux.md)**, mit systemd

Unter Windows läuft das Dashboard ohne Anpassung (es startet den Bot mit `fork()` und ruft
für Updates `npm.cmd` und `git` auf). Ein Unterschied: „Stoppen" und „Neu starten" beenden
den Bot direkt, weil Windows kein abfangbares `SIGTERM` kennt. Das ist hier unbedenklich,
weil kein kritischer, noch nicht geschriebener Zustand offen ist.

## Fehlersuche

**Eine neue Dashboard-Funktion antwortet nach einem Update mit „Request failed (404)"**
Die Buttons **Update** und **Neu starten** im Dashboard starten nur den Bot-Prozess neu,
nicht den Webserver selbst. Ändert ein Update den Servercode des Dashboards, etwa um eine
neue API-Route für den Reiter Dashboard-Einstellungen, liefert das laufende Dashboard zwar
schon die neue Seite aus, kennt die neue Route aber noch nicht und antwortet deshalb mit
404. Starte den Dienst einmal neu, damit der Webserver neu lädt:
`sudo systemctl restart ticketbot` (oder starte den NSSM- bzw. PM2-Dienst neu, unter dem du
`dashboard.js` laufen lässt). Reine Bot-Änderungen an Befehlen, Events und Datenbank
greifen dagegen über den Update-Button.

**Das Dashboard verweigert den Start und nennt die Konfiguration unsicher**
Du hast es ohne HTTPS an eine öffentliche Schnittstelle gebunden. Gehe entweder zurück auf
`DASHBOARD_HOST=127.0.0.1` und nutze einen Reverse Proxy, oder setze
`DASHBOARD_PUBLIC_URL` auf deine `https://`-Adresse.

**Die Anmeldung leitet mit einem Fehler zurück**
Die Redirect-URI im Discord-Portal muss **exakt** `DASHBOARD_PUBLIC_URL` plus
`/auth/callback` entsprechen, einschließlich `https` und jedem angehängten Pfad.

**Das Gespräch im Ticket bleibt leer**
Der Bot braucht den Intent **Message Content** (Developer Portal → Bot → Privileged Gateway
Intents) und das Recht `Read Message History` in den Ticket-Kanälen. Fehlt Letzteres,
liefert Discord eine leere Liste statt eines Fehlers.

**Antworten unter dem Namen eines Nutzers erscheinen nicht**
Der Bot braucht das Recht **Manage Webhooks**. Discord bietet keine Möglichkeit, *als*
Nutzer zu posten, die Antwort geht deshalb über einen Webhook mit dessen Namen und Avatar
raus. Ein `APP`-Abzeichen bleibt trotzdem sichtbar, das ist Discords Schutz gegen
Identitätstäuschung und lässt sich nicht entfernen.
