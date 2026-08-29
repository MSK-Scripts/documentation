---
title: Erste Schritte
sidebar_position: 2
---

# Erste Schritte

Diese Seite führt dich durch deine **ersten zehn Minuten** mit MSK Forms: den Bot einladen,
ein Formular bauen, es nach Discord posten und die erste Einsendung prüfen.

Zu installieren gibt es nichts, MSK Forms ist unter
[forms.msk-scripts.de](https://forms.msk-scripts.de) gehostet.

---

## 1. Den Bot auf deinen Server einladen

1. Geh auf [forms.msk-scripts.de](https://forms.msk-scripts.de) und klick auf **Bot einladen**.
2. Wähle den Discord-Server (die Guild), den du nutzen willst, und erlaube dem Bot den Zugriff. Dafür brauchst du auf diesem Server das Recht **Server verwalten**.
3. In dem Moment, in dem der Bot beitritt, verknüpft MSK Forms deinen Server: Der Serverinhaber wird zum **Inhaber** in MSK Forms, und der Server taucht im Dashboard auf.

Mehr Einrichtung braucht der Bot nicht. Kanäle oder Rollen verlangt er vorab nicht, die
stellst du später ein, wenn du Prüf-Embeds und automatische Rollenvergabe möchtest.

---

## 2. Im Dashboard anmelden

1. Klick oben rechts auf **Mit Discord anmelden**. MSK Forms nutzt Discord OAuth und fragt ausschließlich nach `identify`, `email` und deiner Serverliste.
2. Du landest im **Dashboard**, das jeden Server auflistet, auf dem der Bot installiert und du Mitglied bist.
3. Klick deinen Server an, um ihn zu öffnen.

:::info[Rollen]
Was du tun darfst, hängt von deiner Stellung auf dem Server ab:

- **Inhaber und Admin** sind *Manager*: Formulare bauen, Bot einstellen, Design, Team, alles.
- **Prüfer** sehen Einsendungen über alle Formulare hinweg durch.
- **Betrachter** ist die Voreinstellung für neu gesehene Mitglieder, ohne Datenzugriff, bis ein Manager eine Rolle oder ein bestimmtes Formular freigibt.

Rollen vergeben Manager auf der Seite **Team**. Das ganze Modell steht unter
[Einsendungen und Prüfung](submissions-and-review.md#team-und-zugriff).
:::

---

## 3. Das erste Formular bauen

Öffne im Dashboard deines Servers den Reiter **Formulare** und klick auf **Neues Formular**.

1. Gib dem Formular einen **Titel** und wahlweise eine Beschreibung.
2. Füge Felder aus der Auswahl hinzu. Fang einfach an, mit zwei Feldern **Kurzer Text** und einer **Einfachauswahl**.
3. Markiere die Felder, die Bewerber ausfüllen müssen, als **Pflichtfeld**, oder nimm **Alle verpflichtend machen** und schalte sie auf einen Schlag um.
4. Stelle die **Sichtbarkeit** ein, entweder öffentlich für jeden mit dem Link oder nur nach Anmeldung.
5. Klick auf **Speichern**. Das Formular entsteht als Entwurf.

Wenn du so weit bist, stellst du den Status des Formulars auf **Live**, dann nimmt es
Einsendungen an. Ein Live-Formular hat eine öffentliche URL:

```
https://forms.msk-scripts.de/f/<dein-formular-slug>
```

Der Baukasten kann noch erheblich mehr: mehrseitige Formulare, bedingte Logik, Punkte,
Datei-Uploads, Zeitsteuerung und A/B-Tests. Die vollständige Runde steht auf der Seite
[Formularbaukasten](form-builder.md).

---

## 4. Das Formular teilen

In der Liste **Formulare** hat jedes Live-Formular ein Feld **Teilen**:

- **Direktlink**: die `/f/<slug>`-URL von oben
- **QR-Code**: serverseitig erzeugt, fertig für ein Plakat oder ein Bild
- **Einbetten**: ein `<iframe>`-Schnipsel für deine eigene Website

Oder du postest es direkt nach Discord, siehe der nächste Schritt.

---

## 5. Das Formular in einen Discord-Kanal posten

Führe in Discord aus:

```
/forms post
```

Wähle das Formular, der Bot vervollständigt deine Live-Formulare automatisch, und den Kanal.
Der Bot postet ein Embed mit einem Button, der Bewerber zum Formular führt. Zum Posten
brauchst du **Server verwalten**.

Weitere nützliche Befehle:

- `/forms list` listet die Live-Formulare des Servers auf
- `/forms setup` gibt dir einen Link ins Dashboard

Die vollständige Befehlsübersicht steht unter [Discord-Bot](discord-bot.md).

---

## 6. Die erste Einsendung erhalten und prüfen

Sobald jemand absendet:

1. Er landet auf seiner **privaten Statusseite**, `https://forms.msk-scripts.de/s/<einsendungs-id>`, auf der er von nun an seinen Status live mitverfolgt.
2. Im Dashboard taucht die Einsendung unter dem Reiter **Einsendungen** auf.
3. Öffne sie, um alle Antworten zu sehen. Über das Prüffeld änderst du den **Status**, hinterlässt eine **interne Notiz** nur für Prüfer oder schickst eine **öffentliche Nachricht**, die der Bewerber auf seiner Statusseite sieht.

Hast du einen Prüfkanal eingerichtet (siehe
[Discord-Bot, Ablauf der Prüfung](discord-bot.md#ablauf-der-prüfung)), postet der Bot dort
zusätzlich ein Embed für die neue Einsendung, mit Buttons zum **Annehmen** und **Ablehnen**.

---

## 7. Den Kreis schließen

Setz den Status einer Einsendung auf **Angenommen**. Dann passiert dreierlei:

- Die Statusseite des Bewerbers aktualisiert sich **sofort**, sie ist live.
- Hat der Bewerber sich mit Discord angemeldet, schickt ihm der Bot den neuen Status **per DM**, samt Link.
- Hast du eine **Rolle für Angenommene** eingestellt, **vergibt der Bot diese Rolle** auf deinem Server.

Genau darum geht es bei MSK Forms: Der Bewerber weiß jederzeit, woran er ist, und eine
Zusage lässt sich vollständig in deinen Discord hinein automatisieren.

---

## Wie es weitergeht

- [Formularbaukasten](form-builder.md): Feldtypen, Logik, Zeitsteuerung, Punkte, A/B-Tests, Automatisierung
- [Einsendungen und Prüfung](submissions-and-review.md): Status, Kanban-Board, Sammelaktionen, Exporte
- [Discord-Bot](discord-bot.md): Befehle, Prüf-Embeds, Rollenvergabe, Status-DMs, Aktivitätsprotokoll
- [Tarife und Grenzen](plans.md): was Free, Pro und Enterprise enthalten

---

:::info
Du kommst irgendwo nicht weiter? Mach ein
[Issue](https://github.com/MSK-Scripts/msk-forms/issues) auf oder komm in den
[Discord](https://discord.gg/5hHSBRHvJE).
:::
