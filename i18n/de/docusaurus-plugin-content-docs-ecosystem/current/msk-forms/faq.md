---
title: FAQ
sidebar_position: 10
---

# FAQ

Häufige Fragen zu MSK Forms, zur Bedienung, zum Bot, zu den Tarifen und zu den Daten.

---

## Einstieg

### Muss ich etwas selbst hosten?

Nein. MSK Forms ist ein gehosteter Dienst unter
[forms.msk-scripts.de](https://forms.msk-scripts.de). Du lädst den Bot ein, meldest dich mit
Discord an und baust Formulare. Der Quellcode liegt zwar offen auf
[GitHub](https://github.com/MSK-Scripts/msk-forms), ist aber nicht zum Selbsthosten gedacht.

### Brauchen Bewerber ein Discord-Konto?

Nur wenn das Formular eine Anmeldung verlangt. Öffentliche Formulare kann **jeder mit dem
Link** ausfüllen, ganz ohne Konto. Angemeldete Bewerber bekommen die Extras: Status-DMs vom
Bot und bei einer Zusage automatisch die Rolle.

### Wie sehen Bewerber ihren Status?

Jede Einsendung bekommt einen privaten Link (`/s/<id>`). Der Bewerber öffnet ihn und sieht
seinen Status **live**, ohne Anmeldung und ohne Neuladen. Hat er sich mit Discord angemeldet,
schickt ihm der Bot bei jeder Änderung zusätzlich eine DM.

### Ich habe den Bot eingeladen, aber mein Server steht nicht im Dashboard.

Der Server wird verknüpft, wenn der Bot beitritt und du dich anmeldest. Achte darauf, dass du
dich mit dem Discord-Konto anmeldest, das **Mitglied dieses Servers** ist, und dass der Bot
noch da ist. Neue Mitglieder erscheinen als **Betrachter** ohne Datenzugriff, bis ein Manager
eine Rolle vergibt.

---

## Der Bot

### Ein Slash-Befehl taucht nicht auf.

Nachdem der Bot seine Befehle angemeldet oder geändert hat, kann Discords **globale**
Verteilung bis zu etwa einer Stunde dauern. Gib ihm die Zeit, ein erneutes Einladen
beschleunigt nichts.

### Warum postet der Bot unter einem allgemeinen Namen ohne Server-Avatar?

Es ist ein einziger geteilter Bot, er kann also kein Profil je Server haben. Setz auf der
Seite **Bot** im Dashboard einen **Anzeigenamen**, dann postet er über einen Webhook unter
deinem Namen und deinem Serverlogo. Siehe
[Discord-Bot, wie Beiträge aussehen](discord-bot.md#wie-beiträge-aussehen).

### Beim Annehmen wurde die Rolle nicht vergeben.

Prüfe dreierlei: erstens, ob überhaupt eine **Rolle für Angenommene** eingestellt ist,
serverweit oder für das Formular. Zweitens, ob der Bewerber sich **mit Discord angemeldet
hat**, anonyme Bewerber haben kein Konto, dem sich etwas geben ließe. Drittens, ob die Rolle
des Bots in der Rangfolge des Servers **über** der Rolle steht, die er vergeben soll.

### Kann der Bot meine Sprache sprechen?

Ja, stell sie mit `/forms language <locale>` oder über die Auswahlliste auf der Seite **Bot**
ein (EN, DE, HU, FR, ES, PT, PL). Das gilt für Antworten auf Befehle, Prüf-Embeds, das
Aktivitätsprotokoll und die Status-DMs an Bewerber. Lässt du sie leer, fallen die DMs auf die
Discord-Sprache des jeweiligen Bewerbers zurück.

---

## Formulare

### Welche Feldtypen gibt es?

Über 25: Text, E-Mail, URL, Zahl, Telefon, Auswahl (einfach, mehrfach, Aufklappliste), Ja/Nein,
Zustimmung, Datum und Uhrzeit, Bewertungen (Sterne, NPS, Emoji, Schieberegler), Datei- und
Bild-Upload, Unterschrift, Matrix und berechnete Felder, dazu Layout-Blöcke. Die vollständige
Liste steht im [Formularbaukasten](form-builder.md#felder).

### Kann ein Formular je nach Antwort verzweigen?

Ja, die [bedingte Logik](form-builder.md#bedingte-logik) kann Felder zeigen, verbergen,
verpflichtend machen oder zu einer Seite springen. Zusammen mit
[mehrseitigen Formularen](form-builder.md#mehrseitige-formulare) baust du damit verzweigte
Abläufe.

### Kann ich daraus ein Quiz machen?

Ja. Gib Auswahloptionen **Punkte**, dann bewertet MSK Forms die Einsendungen serverseitig.
Entscheiden lassen kannst du danach über eine
[Automatisierung](form-builder.md#automatisierung), etwa *„Score ≥ 80 → Angenommen"*. Siehe
[Quiz und Punkte](form-builder.md#quiz-und-punkte).

### Kann ich ein Formular zeitgesteuert öffnen und schließen?

Ja, über ein [Zeitfenster](form-builder.md#zeitsteuerung). Vor der Öffnung zeigt es „Öffnet
\<Zeitpunkt\>", in den letzten 24 Stunden vor dem Ende erscheint das Banner „Endet bald".

---

## Tarife und Daten

### Wie funktionieren die Preise?

Drei Stufen, Free, Pro und Enterprise, **je Discord-Server**. Jeden Server stufst du einzeln
hoch. Siehe [Tarife und Grenzen](plans.md) und die
[Preisseite](https://forms.msk-scripts.de/pricing).

### Was sind die Grenzen im Free-Tarif?

3 Formulare, 100 Einsendungen im Monat, 2 Teammitglieder, CSV-Export und ein Hinweis
„Powered by". Pro und Enterprise heben die Grenzen an und schalten Design, Domain,
Automatisierung und API frei. Siehe [Tarife und Grenzen](plans.md).

### Ist MSK Forms Ende-zu-Ende-verschlüsselt wie MSKanban?

Nein. Prüfer müssen Einsendungen lesen können, die Antworten liegen also für das Team des
Servers und für den Betreiber lesbar. Sensible Geheimnisse für Anbindungen, also OAuth und
Captcha, liegen verschlüsselt. Siehe [Datenschutz und Sicherheit](privacy.md).

### Wie lösche ich, oder ein Bewerber, eine Einsendung?

Ein Bewerber kann seine eigene Einsendung von der Statusseite aus **löschen**, das entfernt
die Zeile und alle hochgeladenen Dateien. Teams können Einsendungen oder ganze Formulare
löschen. Damit ist das Löschrecht der DSGVO abgedeckt. Siehe
[Selbstbedienung für Bewerber](submissions-and-review.md#selbstbedienung-für-bewerber-dsgvo).

### Kann ich Einsendungen exportieren?

Ja, CSV in allen Tarifen, XLSX, JSON und PDF ab Pro. Exporte sind Prüfern vorbehalten. Siehe
[Exporte](submissions-and-review.md#exporte).

### Kann ich meine eigene Domain nutzen?

Ja, ab Pro. Leg einen CNAME- und einen TXT-Eintrag an und lass sie bestätigen, TLS läuft
automatisch. Für diese Domain kannst du außerdem deine eigene Discord-Login-App und dein
eigenes Turnstile-Captcha mitbringen. Siehe
[Design und eigene Domains](branding-and-domains.md#eigene-domains).

---

## Kommst du trotzdem nicht weiter?

- [GitHub-Issues](https://github.com/MSK-Scripts/msk-forms/issues) für Fehler und Wünsche
- [Discord](https://discord.gg/5hHSBRHvJE) für Fragen an die Community
