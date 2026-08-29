---
title: Erste Schritte
description: Kostenloser Discord Giveaway Bot, neustartsicher, mehrsprachig und pro Server einstellbar. Teilnahme per Button, gewichtete Auslosung, Web-Dashboard und Tebex-Gutscheine.
keywords:
  - discord giveaway bot
  - giveaway bot deutsch
  - gewinnspiel bot discord
  - discord verlosung
sidebar_position: 1
---

![Discord Giveaway Bot](/img/msk-giveaway-bot-banner.png)

Ein mehrsprachiger Discord Giveaway Bot auf Basis von **Discord.js v14**, der sich pro
Server einstellen lässt und seine Daten in **MariaDB** (über Prisma) ablegt. Mit
neustartsicherem Zeitplaner, Teilnahme per Button, gewichteter Auslosung samt Prüfung der
Teilnahmebedingungen und Nachziehen von Gewinnern. Entwickelt und gepflegt von
[MSK Scripts](https://www.msk-scripts.de).

[`Lizenz: AGPL-3.0`](https://www.gnu.org/licenses/agpl-3.0) · [`Node.js 22+`](https://nodejs.org) · [`Discord.js v14`](https://discord.js.org)

Du willst erst den Überblick? Die Seite
[Discord Giveaway Bot, kostenlos und neustartsicher](https://www.msk-scripts.de/de/giveaway)
auf msk-scripts.de geht die Funktionen, die Befehle und die Tebex-Gutscheine für Gewinner
durch.

---

## ➕ Zum eigenen Server hinzufügen

Am einfachsten nutzt du die **offizielle öffentliche Instanz**: kein Hosting, keine
Datenbank, keine Einrichtung.

> [**🎉 Giveaway Bot einladen →**](https://discord.com/oauth2/authorize?client_id=1512465732179329065&scope=bot+applications.commands&permissions=478208)

Diesen Link bekommst du jederzeit auch in Discord über den Befehl `/ginvite`.

Sobald der Bot beigetreten ist, eröffnet jemand mit Servermanager-Rechten über
[`/gcreate`](./commands.md) ein Gewinnspiel. Mitglieder nehmen mit einem einzigen Klick
teil, und der Bot lost die Gewinner automatisch aus, sobald die Zeit abgelaufen ist.

---

## ✨ Funktionen

| Funktion | Beschreibung |
|---|---|
| 🎉 Teilnahme per Button | Mitglieder machen mit einem Klick mit, Emoji, Beschriftung und Button-Stil sind frei wählbar |
| 🔁 Neustartsicher | Der Zeitplaner arbeitet mit Abfragen, es geht also kein Gewinnspiel verloren, auch nicht nach einem Neustart |
| 🎁 Mehrere Preise | Führe mehrere Preise je Gewinnspiel auf, entweder bekommen alle jeden Preis oder [jeder Gewinner seinen eigenen](./commands.md#mehrere-preise) |
| 👥 Gewichtete Zusatzlose | Gib bestimmten Rollen zusätzliche Lose (bis zu 100), [sichtbar in der Gewinnspielnachricht](./configuration.md#zusatzlose-im-embed), damit alle davon wissen |
| 🛡️ Teilnahmebedingungen | Rollen erlauben oder ausschließen, dazu Mindestalter des Kontos und Mindestzugehörigkeit zum Server. Serverweit, und ein einzelnes Gewinnspiel darf eigene Regeln nutzen |
| ⏸️ Pausieren und fortsetzen | Halte den Zeitgeber mittendrin an und mach nahtlos dort weiter, wo du aufgehört hast |
| 🗂️ Vorlagen | Sichere jedes Gewinnspiel mit einem Klick als Vorlage, Preise und Bedingungen inklusive, und nutze sie per Befehl oder im Dashboard wieder |
| ✨ Nachziehen | Lose für ein beendetes Gewinnspiel neue Gewinner aus, die Sperrliste wird dabei beachtet |
| 🖥️ Web-Dashboard | Gewinnspiele und Einstellungen vollständig im Browser anlegen und verwalten, mit Discord-Login und ganz ohne Befehle |
| 🏆 Öffentliche Ergebnisseiten | Jedes beendete Gewinnspiel bekommt eine teilbare Ergebnisseite mit den Gewinnern und der Teilnehmerzahl |
| 🎟️ Tebex-Gutscheine für Gewinner | Verbinde deinen eigenen Tebex-Shop, jeder Gewinner bekommt per DM seinen eigenen Einmal-Rabattcode |
| 🌐 Mehrsprachig | Englisch, Deutsch, Französisch, Spanisch, Ungarisch, Polnisch und Portugiesisch, je Server wählbar |
| 🎨 Eigenes Design je Server | Eigene Embed-Farbe, eigenes Button-Emoji, eigener Button-Stil |
| 📜 Prüfprotokoll | Ein optionaler Log-Kanal hält jedes Ereignis eines Gewinnspiels fest |
| 🧑‍⚖️ Manager-Rolle | Gib die Steuerung der Gewinnspiele weiter, ohne *Server verwalten* zu vergeben |
| 🔒 Minimale Rechte | Nur der `Guilds`-Intent und die nötigsten Rechte, kein Zugriff auf Nachrichteninhalte |

---

## 🔑 Benötigte Rechte

Über den Link oben eingeladen, fragt der Bot genau die Rechte an, die er braucht
(Rechte-Zahl **478208**):

| Recht | Wofür es gebraucht wird |
|---|---|
| Kanal ansehen | Den Kanal sehen, in dem das Gewinnspiel läuft |
| Nachrichten senden | Die Gewinnspielnachricht posten |
| Links einbetten | Das Gewinnspiel-Embed darstellen |
| Nachrichtenverlauf lesen | Die eigene Gewinnspielnachricht finden und bearbeiten |
| Externe Emojis verwenden | Ein eigenes Button-Emoji ermöglichen |
| Alle erwähnen | Die eingestellte Benachrichtigungsrolle beim Anlegen anpingen |

Zur Laufzeit begrenzt `allowedMentions` die Pings ausdrücklich auf die eingestellte
Benachrichtigungsrolle, der Bot pingt niemals `@everyone` durch.

Der Bot nutzt **ausschließlich** den Gateway-Intent `Guilds`. Er braucht keine
privilegierten Intents und öffnet keinen eingehenden Port.

---

## 🌍 Live-Statistiken

Anonyme, serverübergreifende Statistiken der offiziellen Instanz findest du unter
**[msk-scripts.de/giveaway/stats](https://www.msk-scripts.de/giveaway/stats)**: Anzahl der
Server, Gewinnspiele, Teilnahmen und Gewinner, dazu die Verteilung nach Sprache und Status.
Server-IDs, Nutzer-IDs oder andere personenbezogene Daten stehen dort nicht.

---

## 🖥 Web-Dashboard

Lieber Browser als Slash-Befehle? Serveradministratoren verwalten alles unter
**[msk-scripts.de/giveaway/dashboard](https://www.msk-scripts.de/giveaway/dashboard)**:

1. Mit **Discord** anmelden. Du siehst nur Server, auf denen du *Server verwalten* hast **und** der Bot vorhanden ist.
2. Einen Server auswählen.
3. Gewinnspiele anlegen, bearbeiten, verlängern, pausieren und fortsetzen, beenden, abbrechen und nachziehen, dazu jede Einstellung des Servers ändern.
4. [Vorlagen](./commands.md#vorlagen-im-dashboard) in einem eigenen Reiter verwalten und beim Anlegen davon ausgehen: Wähle sie über dem Formular aus, und jedes Feld ist gefüllt. **Als Vorlage sichern** auf einer Gewinnspielkarte macht aus einem gelaufenen Gewinnspiel eine Vorlage.
5. Die [Teilnahmebedingungen](./configuration.md#zusatzlose-und-gewichtete-auslosung) setzen: gesperrte und verlangte Rollen sowie Zusatzlose je Rolle, serverweit im Reiter *Einstellungen* oder für ein einzelnes Gewinnspiel in dessen Formular. Die Felder je Gewinnspiel starten als Kopie der Servereinstellungen und gelten an deren Stelle, du kannst eine serverweite Regel für ein einzelnes Gewinnspiel also aufheben.

Im Dashboard stecken auch die beiden Dinge, für die es keinen Slash-Befehl gibt: die
Einstellungen zum [Gewinner-Gutschein](./configuration.md#tebex-gutscheine-für-gewinner)
eines Gewinnspiels und der Reiter **Tebex-Shop**, den nur der Serverinhaber sieht.

Im Hintergrund reicht das Dashboard jede Aktion über einen privaten, serverinternen Kanal
an den laufenden Bot weiter. Discord-Nachricht, Button, Gewinner-DMs und Prüfprotokoll
bleiben dadurch genau im Gleichtakt, so als hättest du die Slash-Befehle benutzt. Alles,
was du im Dashboard tust, landet weiterhin in deinem [Log-Kanal](./configuration.md).

---

## 🏆 Öffentliche Ergebnisseiten

Endet ein Gewinnspiel, veröffentlicht der Bot eine aufgeräumte, teilbare Ergebnisseite
unter **`msk-scripts.de/giveaway/g/<token>`**, verlinkt automatisch in der
Ergebnisnachricht und in den Gewinner-DMs. Sie zeigt Titel und Preis des Gewinnspiels, die
**Gewinner** und die **Zahl der Teilnehmer**. Gab es
[einen Preis je Gewinner](./commands.md#mehrere-preise), steht bei jedem Gewinner dabei,
was er gewonnen hat. Die vollständige Teilnehmerliste wird aus Datenschutzgründen nie
veröffentlicht. Entfernst du den Bot von deinem Server, verschwindet die Seite automatisch.

---

## 🎟️ Tebex-Gutscheine für Gewinner

Du betreibst einen Tebex-Shop? Dann bekommen Gewinner automatisch einen **persönlichen
Einmal-Rabattcode** für **deinen eigenen Shop**, nicht für unseren. Der Serverinhaber
verbindet den Shop einmalig im Dashboard, danach kann jedes Gewinnspiel einen
Rabattprozentsatz, wahlweise eine Einschränkung auf bestimmte Pakete und wahlweise eine
Gültigkeitsdauer mitbringen.

Der Code kommt zusammen mit dem Preis per DM und taucht weder in der öffentlichen
Ergebnisnachricht noch auf der Ergebnisseite auf. Wird nachgezogen, verfällt der Code des
ersetzten Gewinners, bevor der neue ausgestellt wird.

Weil ein Tebex-Plugin-Secret vollen Zugriff auf einen Shop gibt, darf nur der
**Serverinhaber** einen Shop verbinden, und der Schlüssel liegt verschlüsselt. Die
vollständige Einrichtung steht in der [Konfiguration](./configuration.md).

---

## 🔒 Selbst hosten

Eine eigene Kopie dieses Bots zu betreiben, wird **weder unterstützt noch empfohlen**. Der
Quellcode ist offen, damit nachvollziehbar ist, wie sich der Bot verhält, und damit andere
Entwickler daraus lernen können. Er ist kein fertiges Produkt zum Weiterbetreiben. Für das
Installieren, Anpassen oder Bauen einer eigenen Instanz gibt es keinen Support.

Lade stattdessen einfach die
[offizielle Instanz ein](https://discord.com/oauth2/authorize?client_id=1512465732179329065&scope=bot+applications.commands&permissions=478208).

---

## 📝 Lizenz

AGPL-3.0. Der Quellcode muss offen bleiben und bei Weitergabe oder beim Hosten unter
derselben Lizenz veröffentlicht werden.
