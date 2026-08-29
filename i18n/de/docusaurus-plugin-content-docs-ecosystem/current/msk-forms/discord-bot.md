---
title: Discord-Bot
sidebar_position: 5
---

# Discord-Bot

Der Discord-Bot ist das, was MSK Forms von anderen abhebt. Ein einziger gemeinsamer Bot
bedient jeden Server, er ist mandantenfähig, du lädst ihn einfach ein. Diese Seite behandelt
die Befehle, den Ablauf der Prüfung, Status-DMs, das Aktivitätsprotokoll und die Sprache des
Bots.

---

## Einladen und verknüpfen

Lade den Bot über [forms.msk-scripts.de](https://forms.msk-scripts.de) → **Bot einladen** ein,
dafür brauchst du **Server verwalten**. Beim Beitritt verknüpft MSK Forms den Server
automatisch:

- Server und Inhaber werden erfasst, der **Inhaber wird zum Inhaber in MSK Forms**.
- Der Server taucht im Dashboard auf.

Kanäle oder Rollen sind dafür vorab nicht nötig.

---

## Slash-Befehle

| Befehl | Wer | Was er tut |
|---|---|---|
| `/forms list` | alle | Listet die Live-Formulare des Servers auf. |
| `/forms post` | Server verwalten | Postet ein Formular als Embed mit Link-Button in einen Kanal. Vervollständigt deine Live-Formulare automatisch. |
| `/forms setup` | alle | Gibt einen Link ins Dashboard zurück. |
| `/forms language <locale>` | Server verwalten | Legt fest, welche Sprache der Bot auf diesem Server spricht, siehe [Sprache des Bots](#sprache-des-bots). |

:::note[Wie lange Befehle brauchen]
Nachdem der Bot seine Befehle aktualisiert hat, kann es bis zu etwa einer Stunde dauern, bis
Discord sie überall ausgerollt hat.
:::

---

## Ablauf der Prüfung

Richte im Dashboard auf der Seite **Bot** einen **Prüfkanal** ein (Bot-Konfiguration:
Prüfkanal und Rolle für Angenommene). Danach gilt:

1. **Neue Einsendung geht in den Prüfkanal.** Sobald jemand absendet, postet der Bot dort ein Embed mit den wichtigsten Angaben und einem Link **„Im Dashboard öffnen"**.
2. **Buttons zum Annehmen und Ablehnen.** Das Embed trägt die Buttons **Annehmen** und **Ablehnen**, bedienbar mit dem Recht Server verwalten. Ein Klick darauf:
   - schreibt den neuen Status, genau wie eine Prüfung im Web
   - schickt dem Bewerber sein Ergebnis per DM über den Statusausgang
   - vergibt bei **Annehmen** die eingestellten **Rollen für Angenommene**
   - aktualisiert das Embed entsprechend der Aktion

Ein Formular kann den Prüfkanal und die Rollen des Servers überschreiben, siehe
[Formularbaukasten, Abweichungen je Formular](form-builder.md#abweichungen-je-formular).

### Automatische Rollenvergabe

Die **Rolle für Angenommene** wird auf **jedem** Weg zur Zusage vergeben, per Discord-Button,
über eine Prüfung im Web, über eine Sammelaktion oder über die
[Automatisierung](form-builder.md#automatisierung), sofern der Bewerber sich mit Discord
angemeldet hat. Rollen kommen nur dazu, wenn sie fehlen, doppelt vergeben wird also nie.

---

## Status-DMs

Ändert sich der Status einer Einsendung oder schickt ein Prüfer eine öffentliche Nachricht,
schickt der Bot dem Bewerber eine **DM** mit dem neuen Status und einem Link zu seiner
Statusseite, sofern der Bewerber sich mit Discord angemeldet hat. Anonyme Bewerber haben kein
Discord-Konto, an das sich schreiben ließe. Hat dein Server eine bestätigte
[eigene Domain](branding-and-domains.md#eigene-domains), zeigt der Statuslink dorthin, und
Bewerber bleiben auf deiner Domain.

Eine Statusänderung, die ein Prüfer als
[verborgen](submissions-and-review.md#eine-einsendung-prüfen) markiert, schickt keine DM.

Dahinter steckt ein **Ausgangskorb**: Die Webanwendung legt die Benachrichtigung in derselben
Transaktion an wie die Statusänderung, der Bot fragt alle 15 Sekunden nach und stellt sie zu.
Vorübergehende Fehlschläge versucht er erneut, unmögliche Fälle verwirft er, etwa wenn
jemand DMs blockiert.

DMs nutzen die [Sprache des Bots](#sprache-des-bots), sofern eingestellt, damit der ganze Bot
eine Sprache spricht. Hat der Server keine gesetzt, fallen DMs auf die **Discord-Sprache des
Bewerbers** zurück.

---

## Aktivitätsprotokoll

Richte dem Bot einen **Log-Kanal** ein (Bot-Konfiguration → Log-Kanal), dann postet er zu
**jedem erfassten Ereignis** des Servers ein Embed, ein Prüfprotokoll direkt in Discord.
Erfasst werden unter anderem:

- Lebenslauf einer Einsendung: angelegt, Status geändert, Nachricht verschickt, zurückgezogen, gelöscht
- Rollenvergabe bei einer Zusage
- Formularverwaltung: angelegt, geändert, gelöscht, gepostet
- Team und Konfiguration: Mitglied hinzugefügt, Rolle geändert, Mitglied entfernt, Bot-Konfiguration geändert, Design geändert, Domain geändert

Ohne Log-Kanal wird nichts gepostet.

---

## Sprache des Bots

Ein Server kann festlegen, welche Sprache der **Bot serverweit spricht**: Antworten auf
Slash-Befehle, Prüf-Embeds (neue Einsendung, Annehmen, Ablehnen), die Embeds im
Aktivitätsprotokoll und die Status-DMs an Bewerber. Einstellen kannst du das:

- mit `/forms language <locale>` in Discord **oder**
- über die Auswahlliste auf der Seite **Bot** im Dashboard

Unterstützt werden Englisch, Deutsch, Ungarisch, Französisch, Spanisch, Portugiesisch (BR)
und Polnisch. Ist sie gesetzt, gilt die Sprache des Bots auch für die **Status-DMs an
Bewerber**, sie hören also in der Sprache deiner Community von dir. Lässt du sie leer, fallen
DMs auf die Discord-Sprache des jeweiligen Bewerbers zurück.

---

## Wie Beiträge aussehen

Weil der Bot von allen geteilt wird, kann er kein Profilbild je Server haben. Stattdessen
legst du auf der Seite **Bot** einen **Anzeigenamen** fest. Der Bot postet Formulare und
Prüf-Embeds dann über einen eigenen Webhook unter **deinem gewählten Namen und deinem
Serverlogo**, während die Buttons weiter funktionieren. Fehlt das Recht Manage Webhooks,
fällt er auf eine gewöhnliche Nachricht zurück.

Die Farbe des Embeds folgt deiner
[Akzentfarbe](branding-and-domains.md#akzentfarbe).

---

:::info
Weiter geht es mit [Design und eigenen Domains](branding-and-domains.md), damit deine
Formulare auch nach dir aussehen.
:::
