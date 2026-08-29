---
title: Design und eigene Domains
sidebar_position: 6
---

# Design und eigene Domains

Lass öffentliche Formulare und Statusseiten so aussehen, als gehörten sie zu deiner
Community. Das Design sitzt unter **Dashboard → dein Server → Design**, eigene Domains unter
**Domain**. Alles davon ist Managern vorbehalten.

---

## Akzentfarbe

Lege über die Farbauswahl eine serverweite **Akzentfarbe** fest. Sie greift auf den
öffentlichen Formular- und Statusseiten, Buttons, Hervorhebungen und Links übernehmen sie.
Der Discord-Bot nutzt sie außerdem als Embed-Farbe für geposteten Formulare und Prüf-Embeds.

Technisch überschreibt sie für diese Seiten das Token der Primärfarbe im Theme, jedes
akzentuierte Element erbt sie also, ohne dass etwas einzeln angefasst werden müsste.

---

## Logo

Lade ein **Logo** hoch, dann erscheint es in der Kopfzeile deiner öffentlichen Formular- und
Statusseiten. Der Upload ist abgesichert:

- Erlaubt wird über eine Prüfung der Magic Bytes, SVG ist ausgeschlossen.
- Die Datei wird nach **WebP** umgewandelt, was versteckten Code, EXIF-Daten und Polyglot-Tricks entfernt, auf höchstens 512 px und 1 MB.
- Animierte GIF- und WebP-Logos bleiben als animiertes WebP erhalten.

Ausgeliefert wird das Logo über eine feste Route mit `image/webp` und `nosniff`.

---

## Eigenes CSS

:::note[Funktion des Pro-Tarifs]
Eigenes CSS braucht ein [Pro](plans.md)-Abonnement.
:::

Manager können **eigenes CSS** hinterlegen, das auf den öffentlichen Formular- und
Statusseiten greift. Gestalte den Rahmen `.msk-form` oder überschreibe die CSS-Variablen des
Themes. Das CSS wird beim Speichern **und** beim Anzeigen bereinigt, also doppelt abgesichert:
Alles, was aus dem Stilkontext ausbrechen könnte, fliegt raus, `@import`, `expression()` und
`javascript:` werden entfernt, und die Länge ist begrenzt.

### Vorschau und Startvorlagen

Du musst kein CSS können, um loszulegen:

- **Schnelle Stile**: Buttons, die mit einem Klick eine fertige Regel in den Editor legen, etwa abgerundete Ecken, Akzenthintergrund, größere Schrift oder eine farbige Überschrift. Anpassen kannst du sie danach.
- **Live-Vorschau**: Ein Ausschnitt deines öffentlichen Formulars aktualisiert sich beim Tippen, mit deiner Akzentfarbe und deinem CSS. Du siehst das Ergebnis also vor dem Speichern. Gespeichert wird erst, wenn du auf **Speichern** drückst.

Jede Startvorlage zielt auf `.msk-form` oder eine CSS-Variable, also auf die beiden stabilen
Angriffspunkte. Damit verhält sie sich in der Vorschau genauso wie auf der echten Seite.

---

## Öffentliche Formularübersicht

Jeder Server bekommt eine **öffentliche Übersicht**, die all seine Live-Formulare auflistet,
gruppiert nach [Kategorie](form-builder.md#kategorien). Formulare ohne Kategorie stehen unter
*Weitere Formulare*. Das ist kostenlos, eine eigene Domain braucht es dafür nicht.

- Erreichbar ist sie immer unter `https://forms.msk-scripts.de/g/<deine-server-id>`.
- Legst du auf der Seite **Domain** ein **Kürzel** fest (im Abschnitt *Link zur öffentlichen Übersicht*, kostenlos für alle Manager), bekommt die Übersicht zusätzlich einen aufgeräumten Pfad, etwa `https://forms.msk-scripts.de/msk-forms`. Kürzel sind 2 bis 32 Zeichen lang (Kleinbuchstaben, Ziffern, Bindestriche), über MSK Forms hinweg eindeutig, und einige reservierte Namen sind gesperrt.
- Auf einer bestätigten [eigenen Domain](#eigene-domains) ist die **Wurzel** der Domain genau diese Übersicht.

Teile den Link zur Übersicht, dann finden Bewerber jedes offene Formular an einer Stelle.

---

## Eigene Domains

:::note[Funktion des Pro-Tarifs]
Eigene Domains brauchen ein [Pro](plans.md)-Abonnement.
:::

Liefere deine Formulare unter deiner **eigenen Domain** aus, etwa
`bewerbung.deine-community.de`, mit automatischem TLS.

### Einrichtung

Auf der Seite **Domain**:

1. Trag deine Domain ein. MSK Forms zeigt dir zwei DNS-Einträge, die du anlegen musst:
   - einen **CNAME**, der deine Domain auf den Host von MSK Forms zeigt
   - einen **TXT**-Eintrag (`_msk-forms.<domain>`) mit einem Bestätigungstoken
2. Lege diese Einträge bei deinem DNS-Anbieter an.
3. Klick auf **Prüfen**. MSK Forms schaut über öffentliche Resolver nach dem TXT-Eintrag, um veralteten Caches aus dem Weg zu gehen.

Nach der Bestätigung geht es schnell, meist 10 bis 30 Sekunden. Ein Zertifikat wird
automatisch ausgestellt und deine Domain ist live. Eine bestätigte eigene Domain liefert
**ausschließlich die Formulare deines Servers** aus, die Wurzel der Domain zeigt die
Übersicht deiner Live-Formulare in deinem Design.

### Discord-Login je Server über eine eigene OAuth-App

Auf einer eigenen Domain würde die Anmeldung über die globale Discord-App von MSK Forms die
Leute zurück auf die Hauptdomain werfen. Damit die ganze Anmeldung auf deiner Domain bleibt,
hinterlegst du deine **eigene Discord-OAuth-App**:

1. Lege unter discord.com/developers eine App an.
2. Trag `https://<deine-domain>/api/auth/discord/callback` als Redirect ein, mit den Scopes `identify email guilds`.
3. Gib Client ID und Secret auf der Seite **Domain** ein. Das Secret wird verschlüsselt gespeichert und nie wieder angezeigt.

Danach läuft der komplette OAuth-Ablauf auf deiner Domain, und die Sitzung wird direkt dort
gesetzt.

### Captcha je Server über einen eigenen Turnstile-Schlüssel

Der globale Schlüssel für Cloudflare Turnstile hängt am Hostnamen der Hauptdomain und kann
auf einer eigenen Domain deshalb nicht angezeigt werden. Hinterlege auf der Seite **Domain**
dein **eigenes Turnstile-Widget**, im Cloudflare-Dashboard an deine Domain gebunden, mit Site
Key und Secret, dann funktioniert das Captcha auch auf deiner Domain. Ohne das sind Formulare
auf eigenen Domains weiterhin über die Ratenbegrenzung geschützt.

---

:::info
Weiter geht es mit [Anbindungen und API](integrations-and-api.md), also Webhooks, Zapier und
Make sowie der REST-API.
:::
