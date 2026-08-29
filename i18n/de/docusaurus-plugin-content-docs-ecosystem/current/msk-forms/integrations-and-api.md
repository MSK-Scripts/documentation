---
title: Anbindungen und API
sidebar_position: 7
---

# Anbindungen und API

MSK Forms verbindet sich über ausgehende Webhooks, über Zapier und Make sowie über eine
REST-API mit dem Rest deiner Werkzeuge.

---

## Ausgehende Webhooks

:::note[Funktion des Pro-Tarifs]
Webhooks brauchen ein [Pro](plans.md)-Abonnement.
:::

Trage Endpunkte ein, die ein POST bekommen, sobald etwas passiert. Verwalten kannst du sie
unter **Dashboard → dein Server → Webhooks**, nur als Manager.

**Ereignisse:**

- `submission.created`
- `submission.status_changed`

**Zustellformat:** Jeder Endpunkt nutzt eines von zwei Formaten.

- **Allgemeines JSON**: die vollständige Einsendung als JSON-Körper, mit HMAC-SHA256 und einem Geheimnis je Webhook signiert (verschickt als `X-MSK-Signature: sha256=…`, dazu `X-MSK-Event`). Das ist das Format für deine eigenen Anbindungen. Prüfe es, indem du den HMAC über den rohen Anfragekörper mit deinem Geheimnis neu berechnest und mit dem Header vergleichst.
- **Discord-Webhook**: Füge die Webhook-URL eines Discord-Kanals ein (Servereinstellungen → Integrationen → Webhooks), dann postet MSK Forms jedes Ereignis dort als aufbereitetes Embed, mit Bewerber, Status, Punktzahl und Antworten. Das funktioniert auf **jedem** Discord-Server, auch auf solchen, auf denen der Bot nicht ist. Du kannst Einsendungen also in einen externen Kanal protokollieren. Eine Signatur gibt es hier nicht, Discord prüft keine.

**Geltungsbereich:** Jeder Webhook kann **alle Formulare** betreffen (Voreinstellung) oder
**ein einzelnes**. Beschränke ihn auf ein Formular, um dessen Einsendungen an einen eigenen
Endpunkt oder Discord-Kanal zu leiten.

**Zustellung:** Zustellungen laufen über eine Warteschlange, einen Ausgangskorb, den der Bot
alle 15 Sekunden leert, mit Wiederholung und wachsendem Abstand bis zu 6 Versuchen, bevor er
sie als fehlgeschlagen markiert. Nutzlasten im allgemeinen JSON-Format werden erst bei der
Zustellung **mit den vollständigen Daten befüllt**: Angaben zum Formular, Status, Punktzahl,
Bewerber und aufbereitete Antworten. Jeder Endpunkt zeigt auf der Webhook-Seite sein
**letztes Ergebnis**, also zugestellt, fehlgeschlagen samt Fehler oder ausstehend. Damit lässt
sich ein Hook, der nicht auslöst, überhaupt untersuchen.

:::tip[Nach Discord protokollieren]
Fügst du die Webhook-URL eines Discord-Kanals ein, stell das Format auf **Discord-Webhook**.
Lässt du es auf allgemeinem JSON, geht ein signierter Körper raus, den Discord ablehnt, und
es wird nichts protokolliert.
:::

---

## Zapier und Make

:::note[Funktion des Enterprise-Tarifs]
Die REST-Hooks für Anbindungen brauchen ein [Enterprise](plans.md)-Abonnement und einen
API-Key.
:::

Zapier und Make hängen über eine REST-Hook-Schicht auf dem Webhook-Unterbau, authentifiziert
mit einem API-Key als Bearer-Token.

| Endpunkt | Zweck |
|---|---|
| `GET /api/v1/me` | Verbindung und Anmeldung testen, der Schritt „Verbinden". |
| `POST /api/v1/hooks` | Abonnieren, legt einen Hook an und gibt dessen `id` zurück. |
| `GET /api/v1/hooks` | Deine Hooks auflisten. |
| `DELETE /api/v1/hooks/{hookId}` | Abbestellen, wiederholbar und auf den Server begrenzt. |

Abonnierte Hooks bekommen dieselben, vollständig befüllten Nutzlasten wie Webhooks von Hand.
Beide Plattformen funktionieren bereits über ihre allgemeinen REST-Hook- und
Eigene-API-Abläufe, eine veröffentlichte Zapier-App kann folgen.

---

## REST-API

:::note[Funktion des Enterprise-Tarifs]
Die REST-API braucht ein [Enterprise](plans.md)-Abonnement.
:::

### API-Keys

Schlüssel legst du unter **Dashboard → dein Server → API** an und verwaltest sie dort, nur als
Manager, und das Anlegen ist an Enterprise gebunden. Das Geheimnis siehst du **ein einziges
Mal** beim Anlegen, sichere es also sofort, gespeichert wird nur ein Hash. Schlüssel beginnen
mit `mskf_`.

```
Authorization: Bearer mskf_xxxxxxxxxxxxxxxxxxxx
```

Jeder Schlüssel gilt nur für seinen Server und ist in der Häufigkeit begrenzt. Steigst du von
Enterprise ab, wird der API-Zugang automatisch entzogen.

### Endpunkte

| Endpunkt | Liefert |
|---|---|
| `GET /api/v1/me` | Prüfung der Anmeldung und den Kontext deines Servers. |
| `GET /api/v1/forms/{formId}/submissions` | Alle Einsendungen eines Formulars, begrenzt auf den Server des Schlüssels, als JSON: `{ form, count, submissions }`. |
| `POST`, `GET` und `DELETE /api/v1/hooks` | REST-Hooks verwalten, siehe [oben](#zapier-und-make). |

Beispiel:

```bash
curl -H "Authorization: Bearer mskf_xxxxxxxxxxxx" \
  https://forms.msk-scripts.de/api/v1/forms/<formId>/submissions
```

---

:::info
Weiter geht es mit [Tarife und Grenzen](plans.md), also welche Funktion in welchem Tarif
steckt.
:::
