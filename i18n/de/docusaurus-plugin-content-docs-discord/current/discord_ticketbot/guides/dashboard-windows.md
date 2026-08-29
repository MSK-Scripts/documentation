---
title: Dashboard unter Windows einrichten
description: Schritt für Schritt zum Web-Dashboard des Ticket Bots auf einem Windows-Server, erreichbar über HTTPS.
sidebar_position: 1
---

# Dashboard unter Windows einrichten

Schritt für Schritt zum optionalen Web-Dashboard auf einem Windows-Server, erreichbar über
HTTPS.

:::note[Zwei getrennte Ebenen]
Damit das läuft, braucht es zwei voneinander unabhängige Dinge: einen **Reverse Proxy**
(IIS oder Caddy), der HTTPS beendet und an das Dashboard weiterreicht, und eine
**Dienstverwaltung** (Aufgabenplanung oder NSSM), die den Node-Prozess am Leben hält. Der
Reverse Proxy startet den Bot nicht, und die Dienstverwaltung kümmert sich nicht um HTTPS.
Du brauchst beides.
:::

## Voraussetzungen

- Node.js ab Version 24 und Git installiert.
- Der Bot ist bereits eingerichtet und läuft, mit gültiger `.env` (`TOKEN`, `CLIENT_ID`, `GUILD_ID`).
- Eine Subdomain für das Dashboard, etwa `tickets.example.com`, mit einem **A-Record** im DNS auf diesen Server.

## Firewall

Das Dashboard lauscht nur auf `127.0.0.1`, sein Port (standardmäßig `3010`) ist von außen
also **nicht** erreichbar und braucht **keine** Firewall-Regel. Lass ihn zu. Nur der
Reverse Proxy muss aus dem Internet erreichbar sein:

| Richtung | Regel | Wofür |
|---|---|---|
| Eingehend | **TCP 80** | Ausstellung und Erneuerung des Let's-Encrypt-Zertifikats (ACME) sowie die Weiterleitung von HTTP auf HTTPS |
| Eingehend | **TCP 443** | HTTPS, der eigentliche Verkehr des Dashboards |
| Ausgehend | TCP 443 | Discord, Let's Encrypt, Updates (meist ohnehin erlaubt) |

UDP wird nicht gebraucht. Eingehendes UDP 443 ergänzt du nur, wenn du HTTP/3 bewusst
einschaltest. Öffne Port 3010 **nicht** für eingehenden Verkehr. Die eingehenden Regeln
legst du unter **Windows Defender Firewall mit erweiterter Sicherheit → Eingehende Regeln →
Neue Regel → Port** an.

## 1. Die geführte Einrichtung starten

Im Ordner des Bots:

```
npm run dashboard:setup
```

- Wähle **b** (öffentlich, hinter einem Reverse Proxy mit HTTPS).
- Port: `3010` beibehalten (oder einen freien nehmen und ihn dir merken).
- Trage deine Domain ein, etwa `tickets.example.com`.
- Hinterlege die angezeigte **Redirect-URI** im [Discord Developer Portal](https://discord.com/developers/applications) unter **OAuth2 → Redirects**, sie lautet `https://tickets.example.com/auth/callback`.
- Füge auf Nachfrage dein **Client Secret** ein (OAuth2 → Client Secret).

Das schreibt die richtige `.env`. Das Dashboard lauscht auf `127.0.0.1`, der Port liegt
also nie offen. Der Assistent gibt außerdem die Abschnitte für den Reverse Proxy von unten
aus.

## 2. Reverse Proxy (eines von beiden)

### Variante A: IIS (gehört zu Windows Server)

1. Installiere **URL Rewrite** und **Application Request Routing (ARR)**.
2. Schalte den Proxy ein: IIS-Manager → Serverknoten → *Application Request Routing Cache* → *Server Proxy Settings* → Haken bei **Enable proxy**.
3. Lege eine Site an, die an deine Domain gebunden ist, und leg diese `web.config` in ihr Stammverzeichnis:

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ticketbot-dashboard" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:3010/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

4. Binde ein HTTPS-Zertifikat an die Site. Am einfachsten geht das mit [win-acme](https://www.win-acme.com): Es stellt ein Let's-Encrypt-Zertifikat aus und erneuert es automatisch. ARR hängt den echten Client von sich aus an `X-Forwarded-For` an, und genau das liest das Dashboard.

### Variante B: Caddy (am einfachsten, HTTPS automatisch)

Ist Port 443 frei, ist Caddy der geringste Aufwand. Betreibst du Caddy schon für etwas
anderes, **starte keine zweite Instanz**, die würde auf Port 443 kollidieren. Ergänze
stattdessen einen weiteren Site-Block in deiner vorhandenen `Caddyfile`:

```
tickets.example.com {
    reverse_proxy 127.0.0.1:3010
}
```

Danach Caddy neu laden:

```
caddy reload --config C:\pfad\zur\Caddyfile
```

Caddy holt und erneuert das Zertifikat selbst. Eine Caddy-Instanz kann beliebig viele
Sites bedienen, ein Block je Hostname.

## 3. Den Bot als Dienst laufen lassen (eines von beiden)

Nimm `dashboard.js` als Einstiegspunkt, nicht `index.js`, dann beaufsichtigt es den Bot
gleich mit.

### Variante A: Aufgabenplanung (ohne Zusatzwerkzeuge)

- Aufgabe erstellen → *Allgemein*: „Unabhängig von der Benutzeranmeldung ausführen".
- *Trigger* → Neu → „Beim Start".
- *Aktionen* → Neu: Programm `C:\Program Files\nodejs\node.exe`, Argumente `dashboard.js`, Starten in `C:\pfad\zu\discord_ticketbot`.
- Speichern, dann die Aufgabe einmal ausführen.

### Variante B: NSSM

```
nssm install TicketBot "C:\Program Files\nodejs\node.exe" dashboard.js
nssm set TicketBot AppDirectory C:\pfad\zu\discord_ticketbot
nssm start TicketBot
```

:::tip
Für einen ersten Test reicht `npm run dashboard` in einer Konsole, um zu sehen, ob alles
läuft. Danach beenden und den Dienst einrichten. Betreibe niemals beides gleichzeitig, sie
würden sich um den Port streiten.
:::

Hinweis: „Stoppen" und „Neu starten" aus dem Dashboard beenden den Bot direkt, weil Windows
kein abfangbares `SIGTERM` kennt. Das ist hier unbedenklich, weil kein kritischer, noch
nicht geschriebener Zustand offen ist.

## 4. Aufrufen

Öffne `https://tickets.example.com` und melde dich mit Discord an. Als Serverinhaber bist
du automatisch Administrator. Allen anderen gibst du unter **Berechtigungen** Zugriff.

## Fehlersuche

- **Die Anmeldung leitet mit einem Fehler zurück**: Die Redirect-URI im Discord-Portal muss **exakt** `DASHBOARD_PUBLIC_URL` plus `/auth/callback` entsprechen, einschließlich `https`.
- **502 oder 503 vom Proxy**: Der Bot-Prozess läuft nicht. Prüfe, ob der Dienst (Aufgabenplanung oder NSSM) gestartet ist und auf dem eingestellten Port lauscht.
- **Das Dashboard verweigert den Start und nennt die Konfiguration unsicher**: Du hast es ohne HTTPS an eine öffentliche Schnittstelle gebunden. Lass `DASHBOARD_HOST=127.0.0.1` stehen und geh über den Reverse Proxy.
