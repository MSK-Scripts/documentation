---
title: Tarife und Grenzen
sidebar_position: 8
---

# Tarife und Grenzen

MSK Forms hat drei Stufen: **Free**, **Pro** und **Enterprise**. Verbindlich und aktuell
stehen die Preise immer auf der [Preisseite](https://forms.msk-scripts.de/pricing).

:::info[Abonnements gelten je Discord-Server]
Ein Abonnement gilt für **einen Server**. Jeden Server, den du betreibst, stufst du einzeln
hoch, einer allein zieht die anderen nicht mit.
:::

---

## Auf einen Blick

| | **Free** | **Pro** | **Enterprise** |
|---|:-:|:-:|:-:|
| Preis im Monat | 0 € | 4,99 € | 9,99 € |
| Formulare je Server | 3 | unbegrenzt | unbegrenzt |
| Einsendungen im Monat | 100 | 5.000 | unbegrenzt |
| Teammitglieder | 2 | 15 | unbegrenzt |
| Alle Feldtypen, Logik, mehrere Schritte | ✅ | ✅ | ✅ |
| Quiz, Punkte und berechnete Felder | ✅ | ✅ | ✅ |
| Prüfablauf, eigene Status, Kanban | ✅ | ✅ | ✅ |
| Discord-Bot, Status-DMs, Aktivitätsprotokoll | ✅ | ✅ | ✅ |
| Akzentfarbe und Logo | ✅ | ✅ | ✅ |
| Kategorien und öffentliche Übersicht | ✅ | ✅ | ✅ |
| 7 Sprachen, installierbare PWA | ✅ | ✅ | ✅ |
| Exporte | CSV | zusätzlich XLSX, JSON, PDF | zusätzlich XLSX, JSON, PDF |
| Formulare importieren und exportieren (JSON) | — | ✅ | ✅ |
| Hinweis „Powered by MSK Forms" | sichtbar | ausgeblendet | ausgeblendet |
| Eigenes CSS | — | ✅ | ✅ |
| Eigene Domain | — | ✅ | ✅ |
| Discord-Login und Captcha je Server | — | ✅ | ✅ |
| Ausgehende Webhooks | — | ✅ | ✅ |
| Automatisierung (wenn-dann) | — | ✅ | ✅ |
| A/B-Tests | — | ✅ | ✅ |
| REST-API und API-Keys | — | — | ✅ |
| Anbindung an Zapier und Make | — | — | ✅ |

> Die Preise stehen hier zur Orientierung, die aktuellen Werte findest du auf der
> [Preisseite](https://forms.msk-scripts.de/pricing).

---

## Wie die Grenzen durchgesetzt werden

- **Formulare**: Der Free-Tarif verhindert das Anlegen eines vierten Formulars. Pro und Enterprise sind unbegrenzt.
- **Einsendungen**: gezählt je Kalendermonat und je Server. Ist die Grenze überschritten, antwortet das öffentliche Formular bis zum nächsten Monat mit „Grenze erreicht".
- **Mitglieder**: gezählt werden Manager, serverweite Prüfer und jeder mit einer Freigabe für ein einzelnes Formular. Blockiert wirst du nur beim **Hinzufügen** über die Grenze hinaus, bei einem Abstieg wird niemand entfernt.
- **Pro-Funktionen** sind für einen Free-Server entweder **gesperrt**, dann siehst du einen Hinweis zum Höherstufen, oder werden beim Speichern **entfernt**, etwa eigenes CSS und Automatisierung. Akzentfarbe und Logo bleiben immer kostenlos.

---

## Höherstufen

Höherstufen kannst du aus den gesperrten Reitern heraus (Domain, Webhooks oder wenn du an die
Formulargrenze stößt) oder über die Kopfzeile der Formularseite. Die Abrechnung läuft über
**Stripe**:

- **Free zu Pro** oder **Free zu Enterprise** über Stripe Checkout.
- **Pro zu Enterprise** über einen Button auf der Formularseite.
- **Abrechnung verwalten**: Zahlende Server bekommen einen Button **Abonnement verwalten**, der ins Stripe-Kundenportal führt, um Zahlungsdaten zu ändern oder zu kündigen.

Ein Abstieg entzieht die Funktionen der Stufe, etwa den API-Zugang von Enterprise, löscht aber
nie deine Daten.

---

:::info
Weiter geht es mit [Datenschutz und Sicherheit](privacy.md), also welche Daten gespeichert
werden und wie sie geschützt sind.
:::
