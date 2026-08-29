---
title: Formularbaukasten
sidebar_position: 3
---

# Formularbaukasten

Der Baukasten sitzt im **Dashboard → dein Server → Formulare → Neues Formular**, oder unter
**Bearbeiten** bei einem bestehenden Formular. Diese Seite ist die vollständige Runde durch
das, was er kann.

Anlegen und bearbeiten dürfen nur **Manager**, also Inhaber und Admins. Prüfer sehen die
Formulare nur lesend.

---

## Felder

Über **Feld hinzufügen** öffnest du die Feldauswahl, ein Symbolraster mit allen verfügbaren
Typen. Wähle einen aus, und er wird eingefügt. Danach legst du Beschriftung, Beschreibung,
Platzhaltertext und fest, ob er ein **Pflichtfeld** ist.

### Text und Kontakt

| Typ | Hinweise |
|---|---|
| **Kurzer Text** | Eine Zeile. Wahlweise mit Mindest- und Höchstlänge sowie einem regulären Ausdruck. |
| **Langer Text** | Mehrzeiliges Textfeld. |
| **E-Mail** | Wird als E-Mail-Adresse geprüft. |
| **URL** | Wird als URL geprüft. |
| **Passwort** | Verdeckte Eingabe, etwa für einen Zugangscode, den der Bewerber eintippen soll. |
| **Zahl** | Numerisch, wahlweise mit Mindest- und Höchstwert. |
| **Telefon** | Auswahl der Ländervorwahl (Flagge und Vorwahl) plus ein Feld nur für Ziffern, gespeichert als `+<Vorwahl> <Nummer>`. |

### Auswahl

| Typ | Hinweise |
|---|---|
| **Einfachauswahl** | Radio-Buttons, genau eine Antwort. |
| **Mehrfachauswahl** | Kontrollkästchen, keine bis beliebig viele Antworten. |
| **Aufklappliste** | Ein Auswahlmenü, gut für lange Optionslisten. |
| **Ja / Nein** | Ein Umschalter. Jede Antwort, Ja wie Nein, kann eigene **Punkte** für die [Punktewertung](#quiz-und-punkte) tragen. |
| **Zustimmung** | Ein einzelnes Kontrollkästchen, etwa „Ich akzeptiere die Regeln". |
| **Altersprüfung** | Ein einzelnes Kontrollkästchen zur Bestätigung. |

Jede Auswahloption kann **Punkte** für die [Punktewertung](#quiz-und-punkte) tragen.

### Datum und Uhrzeit

| Typ | Hinweise |
|---|---|
| **Datum** | Eigener Kalender als Aufklappfenster, nicht der native Browser-Dialog. |
| **Uhrzeit** | Eigene Auswahl für Stunde und Minute. |
| **Datum und Uhrzeit** | Beides zusammen. |

### Bewertungen

| Typ | Hinweise |
|---|---|
| **Sternebewertung** | 1 bis N Sterne, standardmäßig 5. |
| **NPS** | Feste Buttons von 0 bis 10. |
| **Emoji-Skala** | 5 Emoji-Buttons. |
| **Schieberegler** | Mindestwert, Höchstwert und Schrittweite, standardmäßig 0 bis 100. |

### Aufwendigere Eingaben

| Typ | Hinweise |
|---|---|
| **Datei-Upload** | Beliebige Datei, mit Grenze für Größe und MIME-Typ. Sicher abgelegt, siehe [Datenschutz](privacy.md#datei-uploads). |
| **Bild-Upload** | Wie der Datei-Upload, aber auf Bilder beschränkt. |
| **Unterschrift** | Eine Fläche zum Unterschreiben, wird als PNG über denselben Upload-Weg gespeichert. |
| **Matrix** | Ein Raster aus Zeilen und Spalten, je Zeile eine Auswahl. |
| **Berechnet** | Ein Feld ohne Eingabe, dessen Wert aus anderen Antworten entsteht, siehe [Berechnete Felder](#berechnete-felder). |

### Layout-Blöcke

Blöcke ohne Eingabe, für die Gliederung: Überschriften, erklärender Text, Trennlinien. Sie
zählen nie als Antwort und sind nie verpflichtend.

### Den Typ eines Feldes wechseln

Falschen Typ erwischt, oder soll aus einer Kurztextfrage eine Aufklappliste werden? Über die
**Typauswahl** oben auf jeder Feldkarte tauschst du ihn an Ort und Stelle. Beschriftung,
Hilfetext, Position und bedingte Logik bleiben erhalten. Einstellungen, die zum neuen Typ
nicht mehr passen, werden zurückgesetzt, ein Hinweis sagt dir das. Optionen und
Matrixzeilen bleiben, wenn der neue Typ sie ebenfalls nutzt, etwa beim Wechsel von
Einfachauswahl zu Aufklappliste. Bestehende Antworten bleiben in jedem Fall unangetastet.

---

## Mehrseitige Formulare

Ein Formular ist eine Liste von **Seiten**. Mit einer Seite ist es ein einzelner Bildschirm,
mit mehreren zeigt der Baukasten ein **mehrstufiges** Formular mit den Buttons **Weiter**
und **Zurück** sowie einem Fortschrittsbalken.

- Seiten fügst du hinzu, entfernst sie, sortierst sie um und benennst sie im Baukasten.
- Jede Seite prüft ihre eigenen Pflichtfelder, bevor **Weiter** weiterschaltet.
- Eine Seite, deren Felder durch [bedingte Logik](#bedingte-logik) alle verborgen sind, wird automatisch übersprungen.

---

## Bedingte Logik

Jedes Feld kann Regeln tragen, die auf andere Antworten reagieren. Eine Regel besteht aus
einer **Aktion**, einem **Zielfeld**, einem **Operator** und einem **Wert**:

- **Aktionen:** Feld zeigen, verbergen, verpflichtend machen oder **zu einer Seite springen** (`skip to`).
- **Operatoren:** gleich, ungleich, enthält, größer als, kleiner als, ist leer, ist nicht leer und weitere, insgesamt acht.

Verborgene Felder werden nie geprüft und nie verlangt. Sichtbarkeit, Fortschritt und
Validierung folgen alle demselben aufgelösten Pfad. In Verbindung mit `skip to` verzweigst
du den Ablauf: *„Wer **Team** gewählt hat, springt zu Seite 3."*

---

## Zeitsteuerung

Jedes Formular kann ein optionales **Zeitfenster** haben:

- **Öffnet am**: Davor zeigt das Formular „Öffnet \<Zeitpunkt\>" und nimmt nichts an.
- **Schließt am**: Danach ist es geschlossen. In den letzten 24 Stunden davor erscheint ein Banner **„Endet bald"**.

Zeiten erscheinen jedem in seiner eigenen Zeitzone. Geschlossene Formulare fallen
automatisch aus der öffentlichen Übersicht.

### Countdown als Vorschau

Schalte in der Zeitsteuerung **Countdown in der öffentlichen Übersicht** ein, um Vorfreude
auf ein Formular zu wecken, das erst später öffnet. Solange es geplant ist:

- zeigt seine Karte in der [öffentlichen Übersicht](branding-and-domains.md#öffentliche-formularübersicht) einen **laufenden Countdown** bis zur Öffnung statt eines nüchternen Datums.
- zeigt die Formularseite denselben Countdown, feuert im Moment der Öffnung ein **Konfetti** ab und deckt das Formular automatisch auf.

Standardmäßig aus, ein geplantes Formular nennt sonst einfach seinen Öffnungszeitpunkt.

---

## Eine Einsendung je Person

Standardmäßig kann jeder angemeldete Bewerber je Formular nur **eine offene Einsendung**
haben. Solange seine Einsendung noch offen ist, also noch keinen Endstatus hat, führt ihn ein
erneuter Aufruf des Formulars direkt auf seine
[Statusseite](submissions-and-review.md#die-statusrückmeldung-aus-sicht-des-bewerbers) statt
auf ein leeres Formular, und der Endpunkt zum Absenden weist Doppelungen ab. Sobald ein
Prüfer einen **Endstatus** setzt (Angenommen, Abgelehnt, Zurückgezogen oder ein eigener
Endstatus), darf er sich erneut bewerben.

- Das gilt nur für **angemeldete** Bewerber, anonyme Einsendungen lassen sich keiner Person zuordnen.
- Für Formulare, die wiederholte Einsendungen annehmen sollen, etwa Umfragen oder Rückmeldungen, schaltest du es im Baukasten über **Eine offene Einsendung je Person** ab.

---

## Quiz und Punkte

Gib Auswahloptionen **Punkte**, dann bewertet MSK Forms jede Einsendung automatisch. Felder
vom Typ **Ja / Nein** gehören zum selben System, dort vergibst du im Feldeditor eigene
Punkte für Ja und für Nein.

- Die Punktzahl ist die Summe der Punkte über die gewählten Optionen und wird **serverseitig** berechnet, der Vorschau im Browser wird nie vertraut.
- Formulare, in denen keine Option Punkte trägt, bleiben ohne Punktzahl. Für Formulare ohne Quiz ändert sich also nichts.
- Die Punktzahl steht in der Einsendungstabelle und auf der Detailseite einer Einsendung.
- Sie steht außerdem der [Automatisierung](#automatisierung) unter dem reservierten Feld **Score** zur Verfügung, etwa *„wenn Score ≥ 80 → Angenommen"* für eine automatische Zusage.

---

## Berechnete Felder

Ein Feld vom Typ **Berechnet** leitet seinen Wert über eine Formel aus anderen Antworten ab:

- **Schreibweise:** Platzhalter `{feldId}` sowie `+ - * / ( )` und Zahlen, etwa `{preis} * {menge}`.
- **Wie Verweise aufgelöst werden:** Zahl und Bewertung ergeben den Wert, Einfachauswahl die Punktzahl der Option, Mehrfachauswahl deren Summe, Wahrheitswerte 1 oder 0, leer und unbekannt ergeben 0.
- Der Wert wird **serverseitig berechnet** und mit den Antworten gespeichert, die Vorschau im Browser ist nie maßgeblich.
- Er erscheint als schreibgeschützte Live-Vorschau, ist nie bearbeitbar und nie verpflichtend.

Im Baukasten schreibst du die Formel in ein Textfeld und fügst über Chips die Felder ein,
auf die du verweisen kannst.

---

## A/B-Tests

:::note[Funktion des Pro-Tarifs]
A/B-Tests brauchen ein [Pro](plans.md)-Abonnement.
:::

Teste zwei Fassungen eines Formulartexts gegeneinander:

- Lege im Baukasten **Varianten** an, jede mit Namen, Gewicht und wahlweise abweichendem Titel oder abweichender Beschreibung.
- Die öffentliche Seite weist eine Variante **beständig** zu, über ein Cookie, sonst gewichtet zufällig, und zeigt deren Texte.
- **Aufrufe** zählt sie beim Anzeigen, **Abschlüsse** beim Absenden mit dieser Variante.
- Eine **Ergebnisseite** je Formular zeigt Aufrufe, Einsendungen und Abschlussquote und markiert die führende Variante, sobald sie mindestens 10 Aufrufe hat.

---

## Automatisierung

:::note[Funktion des Pro-Tarifs]
Automatisierung braucht ein [Pro](plans.md)-Abonnement.
:::

**Wenn-dann-Regeln** je Formular. Beim Absenden greift die erste Regel, deren Bedingungen
**alle** zutreffen:

- **Bedingungen** nutzen dieselbe Form und dieselben Operatoren wie die bedingte Logik und sind mit UND verknüpft. Eine leere Bedingungsmenge trifft immer zu.
- **Aktion (Fassung 1):** Die Einsendung auf einen Zielstatus setzen.

Weil die Aktion denselben Weg für Statusänderungen nimmt wie eine Prüfung von Hand, wirkt
sie überall hin: auf das Statusereignis, die DM an den Bewerber, die Webhooks und die
Live-Statusseite. Der klassische Fall ist die **automatische Zusage**: *„wenn Score ≥ 80 →
Angenommen"*, was mit eingestellter Rolle für Angenommene auch die Discord-Rolle vergibt.

---

## Abweichungen je Formular

Einige serverweite Einstellungen lassen sich für ein einzelnes Formular überschreiben:

- **Prüfkanal**: Die Embeds für neue Einsendungen dieses Formulars gehen in einen bestimmten Kanal statt in den Standardkanal des Servers.
- **Rollen für Angenommene**: Bei einer Zusage werden diese Rollen vergeben, statt oder zusätzlich zum Standard des Servers. Mehrere Rollen sind möglich, mit Komma getrennt.

Wie das den Prüfablauf steuert, steht unter [Discord-Bot](discord-bot.md).

---

## Kategorien

Fasse deine Formulare in **Kategorien** zusammen, etwa *Ingame-Jobs* gegenüber
*Team-Bewerbungen*. Verwalten kannst du sie unter **Dashboard → dein Server → Kategorien**,
nur als Manager: hinzufügen, umbenennen, umfärben und umsortieren. Danach wählst du im
Baukasten für jedes Formular eine Kategorie.

Kategorien bestimmen die Gliederung deiner **öffentlichen Formularübersicht**. Bewerber
sehen deine Formulare dann nach Abschnitten getrennt, Formulare ohne Kategorie stehen unter
*Weitere Formulare*. Siehe
[Design und eigene Domains, öffentliche Formularübersicht](branding-and-domains.md#öffentliche-formularübersicht).

---

## Import und Export (JSON)

:::note[Funktion des Pro-Tarifs]
Eine Formulardefinition zu importieren und zu exportieren braucht ein
[Pro](plans.md)-Abonnement.
:::

Ein Formular auf einen anderen Server umziehen, eine Sicherung behalten oder eine Vorlage
wiederverwenden:

- **Export**: Lade die Definition eines Formulars, also Aufbau und Einstellungen, aber nicht die Einsendungen, als JSON-Datei aus der Formularliste herunter.
- **Import**: Lade eine JSON-Datei als **neues Formular** hoch oder **ersetze** damit den Inhalt eines bestehenden. Als neues Formular importiert, wird der Slug wiederverwendet und bei Bedarf eindeutig gemacht. Beim Ersetzen behält das Formular seinen bisherigen öffentlichen Link. Die Kategorie reist über ihren Namen mit und wird auf dem Zielserver angelegt, falls sie fehlt.

---

## Speichern und live gehen

- **Speichern** legt das Formular als Entwurf ab.
- Setz den **Status auf Live**, damit es Einsendungen annimmt, im Rahmen einer eventuellen [Zeitsteuerung](#zeitsteuerung).
- **Löschen** entfernt ein Formular samt seiner Einsendungen, hochgeladene Dateien eingeschlossen.

**Sieh es dir an, bevor du veröffentlichst.** Jedes Formular hat eine Aktion **Vorschau**,
nur für Manager und in einem neuen Tab. Sie zeigt das Formular genau so, wie die
Öffentlichkeit es sähe, mit Design, mehrstufigem Ablauf und allen Feldtypen, unabhängig vom
Status, also auch bei Entwürfen. Die Vorschau prüft die Eingaben und lässt dich durch die
Seiten laufen wie im Ernstfall, sendet aber nie ab.

:::tip[Grenze im Free-Tarif]
Der Free-Tarif erlaubt bis zu **3 Formulare** je Server, und Pro-Funktionen wie eigenes CSS,
Automatisierung, A/B-Tests und eigene Domain werden für Free-Server entfernt oder gesperrt.
Siehe [Tarife und Grenzen](plans.md).
:::

---

:::info
Weiter geht es mit [Einsendungen und Prüfung](submissions-and-review.md), also dem, was
passiert, nachdem Bewerber auf Absenden geklickt haben.
:::
