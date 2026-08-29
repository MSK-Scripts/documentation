---
title: Einsendungen und Prüfung
sidebar_position: 4
---

# Einsendungen und Prüfung

Sobald ein Formular live ist, laufen die Einsendungen im Dashboard ein. Diese Seite behandelt
den Prüfablauf, die Status, das Kanban-Board, Sammelaktionen, Exporte und die
Live-Statusrückmeldung.

---

## Die Statusrückmeldung aus Sicht des Bewerbers

Jede Einsendung bekommt eine **private Statusseite**:

```
https://forms.msk-scripts.de/s/<einsendungs-id>
```

Die Einsendungs-ID ist der Schlüssel. Wer den Link hat, darf die Seite sehen, eine Anmeldung
braucht es nicht. Dort sieht der Bewerber:

- seinen aktuellen **Status**, etwa Eingereicht → In Prüfung → Angenommen
- einen **Verlauf** der Statusänderungen und aller öffentlichen Nachrichten der Prüfer
- seine eigenen Antworten
- einen Bereich **„Deine Daten"** zur Selbstbedienung, siehe [DSGVO-Selbstbedienung](#selbstbedienung-für-bewerber-dsgvo)

Die Seite ist **live**. Ändert ein Prüfer den Status, aktualisiert sie sich binnen Momenten
über einen WebSocket, ganz ohne Neuladen. Ist die Echtzeitverbindung nicht verfügbar,
funktioniert sie trotzdem, nur eben nicht sofort.

Begrenzt das Formular Bewerber auf
[eine offene Einsendung](form-builder.md#eine-einsendung-je-person), landet ein angemeldeter
Bewerber direkt wieder hier, wenn er das Formular öffnet, solange seine Einsendung noch offen
ist.

---

## Der Statusverlauf

Einsendungen durchlaufen einen Statusverlauf. Die eingebauten Status sind:

| Status | Bedeutung |
|---|---|
| **Eingereicht** | Gerade angekommen. |
| **In Prüfung** | Ein Prüfer schaut sie sich an. |
| **Zurückgestellt** | Vorerst geparkt. |
| **Angenommen** | Zugesagt (Endstatus). |
| **Abgelehnt** | Abgesagt (Endstatus). |
| **Zurückgezogen** | Der Bewerber hat sie zurückgezogen (Endstatus). |

Die Bezeichnungen der eingebauten Status erscheinen jeweils in der Sprache des Bewerbers
beziehungsweise des Prüfers.

### Eigene Status

Manager legen auf der Seite **Status** eigene Status an, jeweils mit Schlüssel,
Beschriftung, Farbe, einem Kennzeichen „Endstatus" und der Angabe, ob der Bewerber ihn sehen
darf. Sie reihen sich neben den eingebauten in den Verlauf ein.

---

## Eine Einsendung prüfen

Öffne eine Einsendung im Reiter **Einsendungen**. Die Detailseite zeigt jede Antwort, Dateien
erscheinen als Download-Links. Über das Prüffeld kann ein Prüfer:

- **Den Status ändern**, eingebaut oder eigen. Setzt du den Haken bei **Diese Änderung vor dem Bewerber verbergen**, bleibt sie intern: Der Bewerber bekommt keine DM und sieht die Änderung nie auf seiner Statusseite, für dein Team ändert sich der Status trotzdem und das Aktivitätsprotokoll hält es fest.
- **Eine interne Notiz hinterlassen**, sichtbar nur für das Team, nie für den Bewerber.
- **Eine öffentliche Nachricht schicken**, die auf der Statusseite des Bewerbers erscheint und ihm, sofern er sich mit Discord angemeldet hat, per DM zugeht.

Jede Statusänderung ist ein und derselbe Vorgang. Sie löst also immer die DM an den Bewerber,
alle Webhooks, die Automatisierung und die Live-Aktualisierung aus, ganz gleich woher sie kam,
ob aus dem Web, vom Kanban-Board, aus einer Sammelaktion oder von einem Discord-Button.

---

## Automatische Statusnachrichten

Statt jedes Mal dasselbe zu tippen, hinterlegst du je Status eine automatische Nachricht.
Erreicht eine Einsendung diesen Status, geht die Nachricht an den Bewerber, sichtbar auf
seiner Statusseite und per DM, falls er sich mit Discord angemeldet hat.

- **Vorlagen für den ganzen Server:** Der Reiter **Nachrichten** listet jeden Status auf, eingebaut wie eigen, mit einem Textfeld. Zum Beispiel „Glückwunsch, du wurdest angenommen!" bei Angenommen oder „Danke für deine Bewerbung, dieses Mal passt es leider nicht." bei Abgelehnt. Lass ein Feld leer, dann geht keine Nachricht raus.
- **Abweichung je Formular:** Ein Formular kann die Servervorlagen in seinem Baukasten überschreiben, im Abschnitt „Statusnachrichten (dieses Formular)". Bleibt das Feld leer, greift die Servervorlage.
- **Abweichung je Änderung:** Änderst du im Prüffeld einen Status, steht die passende Vorlage bereits in einem bearbeitbaren Feld. Schick sie so ab, passe sie für diesen Bewerber an oder leere das Feld, dann geht nichts raus.

Eine automatische Nachricht ersetzt die allgemeine DM „Status geändert", der Bewerber bekommt
also genau eine klare Benachrichtigung. Das gilt überall, wo sich ein Status ändert: im
Prüffeld, auf dem Kanban-Board, bei Sammelaktionen, über die Buttons des Bots zum Annehmen
und Ablehnen und bei der Automatisierung nach Punktzahl. Verborgene Statusänderungen schicken
nie eine Nachricht.

---

## Das Kanban-Board

Der Reiter **Board** zeigt die Einsendungen als Kanban: Die Spalten sind deine Status, die
Karten sind Einsendungen. Zieh eine Karte oder nimm das Menü **Verschieben nach**, um den
Status zu ändern. Die Anzeige geht optimistisch vom Erfolg aus und rollt bei einem Fehler
zurück. Das Board ist Prüfern vorbehalten.

---

## Sammelaktionen

Wähle in der Tabelle **Einsendungen** mehrere Zeilen aus, oder gleich alle, und ändere ihren
Status auf einmal. Vorher kannst du die Tabelle nach Formular filtern, sofern ein Server mehr
als eines hat. Sammelaktionen sind Prüfern vorbehalten.

---

## Archivieren

Eine Einsendung ist erledigt, soll aber nicht weg? Dann **archiviere** sie in der Tabelle
**Einsendungen**, die Aktion sitzt neben **Öffnen**. Archivierte Einsendungen fallen aus der
aktiven Liste und aus dem Board, gelöscht werden sie nie, Dateien eingeschlossen.

Sie liegen auf einer eigenen Seite **Archiv**, erreichbar über den Link oberhalb der Tabelle,
der auch die Anzahl nennt. Dort kannst du jede **öffnen** oder in die aktive Liste
**zurückholen**. Archivieren und Zurückholen sind Prüferaktionen, sie benachrichtigen den
Bewerber nicht und ändern den Status nicht.

---

## Exporte

Die Einsendungen eines Formulars exportierst du aus der Liste **Formulare**:

| Format | Tarif |
|---|---|
| **CSV** | alle Tarife |
| **XLSX** (Excel) | ab Pro |
| **JSON** | ab Pro |
| **PDF** | ab Pro |

Die Spalten folgen der Feldreihenfolge des Formulars, Antworten sind über alle Formate hinweg
gleich aufbereitet. Exporte sind Prüfern vorbehalten und in der Häufigkeit begrenzt.

:::warning
Ein Export ist eine Klartextkopie von allem, was in diesen Einsendungen steht, einschließlich
der personenbezogenen Daten, die Bewerber eingegeben haben. Bewahre die Datei sicher auf und
lösche sie, wenn du fertig bist.
:::

---

## Team und Zugriff

Rollen entscheiden, wer auf einem Server was darf:

| Rolle | Darf |
|---|---|
| **Inhaber und Admin** (Manager) | Alles: Formulare bauen, Bot und Design einstellen, Team verwalten, prüfen. |
| **Prüfer** | Einsendungen über **alle** Formulare hinweg durchsehen. |
| **Betrachter** | Die Voreinstellung für neu gesehene Mitglieder, **kein** Datenzugriff, bis er gewährt wird. |

Über die Voreinstellung Betrachter hinaus gibt es zwei Wege, Zugriff zu geben:

- **Serverweit:** Gib die Rolle **Prüfer**, dann darf die Person jedes Formular prüfen.
- **Je Formular:** Auf der Seite **Team** hat jedes Formular für einen Betrachter eine Auswahl **Formularzugriff** mit drei Stufen:
  - **Kein Zugriff** (Voreinstellung).
  - **Prüfen** erlaubt, die Einsendungen genau dieses Formulars zu lesen und zu bearbeiten.
  - **Verwalten** erlaubt, genau dieses Formular vollständig zu betreiben, also im Baukasten zu bearbeiten, zu löschen, zu exportieren und seine Einsendungen zu prüfen, ganz ohne serverweiten Zugriff. Damit gibst du jemandem ein einzelnes Formular in die Hand, ohne ihn zum Admin zu machen.

Den Server selbst zu verwalten, also neue Formulare anzulegen und die Einstellungen zu Bot,
Design, Domain und Team zu ändern, bleibt Inhabern und Admins vorbehalten.

Nimm Teammitglieder bewusst auf: Ein Manager **fügt ein Mitglied über seine Discord-ID hinzu**,
auf der Seite **Team**, und legt danach Rolle und Zugriff je Formular fest. Wer sich anmeldet,
um ein Formular auszufüllen, landet dadurch **nicht** im Team. Die Liste bleibt also auf die
Leute beschränkt, denen du tatsächlich Zugriff gegeben hast. Der Serverinhaber kommt
automatisch dazu, sobald der Bot beitritt.

:::info[Grenzen für Mitglieder]
Free **2**, Pro **15**, Enterprise **unbegrenzt**. Mitgezählt werden Manager, serverweite
Prüfer und jeder mit einer Freigabe für ein einzelnes Formular. Siehe
[Tarife und Grenzen](plans.md).
:::

---

## Selbstbedienung für Bewerber (DSGVO)

Von seiner Statusseite aus kann ein Bewerber, allein mit dem Link und ohne Anmeldung:

- die Einsendung **zurückziehen**, sie steht dann auf *Zurückgezogen*
- seine Daten als JSON **exportieren**
- die Einsendung vollständig **löschen**, samt aller Dateien, die er hochgeladen hat

Damit sind die Rechte auf Auskunft (Art. 15), Datenübertragbarkeit (Art. 20) und Löschung
(Art. 17) der DSGVO abgedeckt. Siehe [Datenschutz und Sicherheit](privacy.md).

---

:::info
Weiter geht es mit dem [Discord-Bot](discord-bot.md), der den Prüfablauf nach Discord holt.
:::
