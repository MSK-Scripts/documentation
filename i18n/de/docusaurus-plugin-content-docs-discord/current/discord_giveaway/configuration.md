---
title: Konfiguration
description: Einstellungen des Discord Giveaway Bots je Server, von Sprache und Design über Teilnahmebedingungen bis zu den Tebex-Gutscheinen.
sidebar_position: 3
---

## 🛠️ Konfiguration

Jeder Server richtet den Bot **für sich allein** ein, es gibt keine Konfigurationsdateien
zum Bearbeiten. Alle Einstellungen laufen in Discord über `/gsettings` und sind hinter dem
Discord-Recht **Server verwalten** abgesichert.

- `/gsettings show` zeigt die aktuelle Konfiguration
- `/gsettings set <option> …` setzt oder ergänzt einen Wert
- `/gsettings remove <option> …` entfernt oder leert einen Wert

Änderungen greifen sofort und gelten für alle künftigen Gewinnspiele dieses Servers.

> **set gegen remove:** `set` nimmt eine Rolle in eine Liste auf (Sperr- oder
> Zulassungsliste) oder setzt einen einzelnen Wert (manager, notify, bonus), `remove` nimmt
> sie wieder heraus. Der Log-Kanal ist die Ausnahme, `set log` schaltet ihn um. Führst du es
> mit demselben Kanal erneut aus, ist er wieder leer.

:::tip[Im Browser einstellen]
All diese Einstellungen kannst du auch im [**Web-Dashboard**](./getting-started.md#-web-dashboard) mit Discord-Login bearbeiten. Praktisch, weil du Rollen und Kanäle aus einer Liste wählst, statt IDs zu tippen.
:::

---

## ⚙️ Optionen

### `/gsettings set …`

| Option | Wert | Standard | Beschreibung |
|---|---|---|---|
| `lang <Wert>` | `en` · `de` · `fr` · `es` · `hu` · `pl` · `pt` | `en` | Sprache des Bots auf diesem Server |
| `color <Wert>` | `#RRGGBB` | `#00e676` | Akzentfarbe des Embeds |
| `emoji <Wert>` | ein beliebiges Emoji | 🎉 | Emoji auf dem Teilnahme-Button |
| `button <Wert>` | `PRIMARY` · `SECONDARY` · `SUCCESS` · `DANGER` | `PRIMARY` | Stil des Teilnahme-Buttons |
| `blacklist <Rolle> [giveaway_id]` | Rolle (optional mit ID) | — | Mitglieder mit dieser Rolle können **nicht** teilnehmen |
| `whitelist <Rolle> [giveaway_id]` | Rolle (optional mit ID) | — | Ist mindestens eine Rolle gesetzt, brauchen Mitglieder **mindestens eine** davon |
| `bonus <Rolle> <Anzahl> [giveaway_id]` | Rolle und `1` bis `100` (optional mit ID) | — | Zusatzlose für eine Rolle, für eine gewichtete Auslosung |
| `minaccount <Tage>` | `0` bis `3650` | `0` (aus) | Mindestalter des **Discord-Kontos** in Tagen |
| `minmember <Tage>` | `0` bis `3650` | `0` (aus) | Mindestzugehörigkeit zum **Server** in Tagen |
| `manager <Rolle>` | Rolle | — | Rolle, die Gewinnspiele ohne *Server verwalten* steuern darf |
| `notify <Rolle>` | Rolle | — | Rolle, die beim Anlegen eines Gewinnspiels gepingt wird |
| `log <Kanal>` | Kanal | — | Kanal für das Prüfprotokoll (Umschalter) |
| `reminder <Minuten>` | `0` bis `1440` | `0` (aus) | Erinnerung „läuft bald aus" *N* Minuten vor dem Ende |
| `claim <Text>` | Text | — | Hinweise in der Gewinner-DM, etwa wie der Preis eingelöst wird |

### `/gsettings remove …`

| Option | Wert | Beschreibung |
|---|---|---|
| `blacklist <Rolle> [giveaway_id]` | Rolle (optional mit ID) | Eine Rolle aus der Sperrliste nehmen |
| `whitelist <Rolle> [giveaway_id]` | Rolle (optional mit ID) | Eine Rolle aus der Zulassungsliste nehmen |
| `bonus <Rolle> [giveaway_id]` | Rolle (optional mit ID) | Die Zusatzlose einer Rolle entfernen |
| `manager <Rolle>` | Rolle | Die Manager-Rolle leeren |
| `notify <Rolle>` | Rolle | Die Benachrichtigungsrolle leeren |
| `claim` | — | Die Hinweise in der Gewinner-DM leeren |
| `conditions <giveaway_id>` | Gewinnspiel-ID | Die eigenen Bedingungen eines Gewinnspiels verwerfen, damit wieder die Servereinstellungen gelten |

---

### Sperrliste, Zulassungsliste und Zusatzlose je Gewinnspiel

`blacklist`, `whitelist` und `bonus` nehmen sowohl bei `set` als auch bei `remove` eine
**optionale `giveaway_id`** entgegen:

- **Ohne** `giveaway_id` gilt es **serverweit**, also für alle Gewinnspiele.
- **Mit** `giveaway_id` gilt es **nur für dieses eine Gewinnspiel**, und was ein Gewinnspiel mitbringt, **ersetzt** dort die serverweite Einstellung.

Die drei sind voneinander unabhängig: Ein Gewinnspiel kann eine eigene Sperrliste haben und
trotzdem den serverweiten Zusatzlosen folgen. Bringt ein Gewinnspiel nichts Eigenes mit,
folgt es den Servereinstellungen, spätere Änderungen daran eingeschlossen.

Änderst du eine einzelne Rolle bei einem Gewinnspiel, das nichts Eigenes hat, **wird zuerst
die serverweite Liste kopiert** und dann die Änderung angewandt.
`set blacklist role:@Muted giveaway_id:…` ergänzt also eine Rolle, statt alle anderen
abzuschalten. Für den umgekehrten Fall, ein Gewinnspiel *ohne* eine serverweite Regel,
nimmst du die Rolle mit `remove` heraus oder leerst die Liste im Dashboard.
`remove conditions giveaway_id:<ID>` stellt ein Gewinnspiel vollständig auf die
Servereinstellungen zurück.

Dieselben drei Einstellungen gibt es im **Web-Dashboard** ganz ohne ID: Sowohl das Formular
zum Anlegen als auch das zum Bearbeiten eines laufenden Gewinnspiels enthält den Block
*Teilnahmebedingungen für dieses Gewinnspiel*, vorbelegt mit den Servereinstellungen. Was
im Formular steht, gilt also auch.

```text
/gsettings set blacklist role:@Muted                          → auf jedem Gewinnspiel gesperrt
/gsettings set whitelist role:@VIP giveaway_id:A1B2C3         → nur A1B2C3 verlangt @VIP
/gsettings set bonus role:@Booster amount:3 giveaway_id:A1B2C3 → @Booster bekommt +3 in A1B2C3, egal was serverweit gilt
/gsettings remove blacklist role:@Muted giveaway_id:A1B2C3    → @Muted darf bei diesem einen Gewinnspiel mitmachen
/gsettings remove conditions giveaway_id:A1B2C3               → zurück zu den Servereinstellungen
```

---

### Button-Stile

| Wert | Aussehen |
|---|---|
| `PRIMARY` | Blurple |
| `SECONDARY` | Grau |
| `SUCCESS` | Grün |
| `DANGER` | Rot |

---

### Teilnahmebedingungen

Mehrere Optionen wirken zusammen und entscheiden, wer teilnehmen darf:

- **Sperrliste**: Wer eine gesperrte Rolle hat, kann nicht teilnehmen. Es gilt die eigene Liste des Gewinnspiels, falls es eine hat, sonst die serverweite.
- **Zulassungsliste**: Sind eine oder mehrere Rollen eingetragen, braucht ein Mitglied **mindestens eine** davon. Ohne Zulassungsliste darf jeder mitmachen, sofern die übrigen Regeln passen.
- **Mindestalter des Kontos** (`minaccount`): weist Konten ab, die jünger als *N* Tage sind. `0` schaltet die Prüfung aus.
- **Mindestzugehörigkeit zum Server** (`minmember`): weist Mitglieder ab, die vor weniger als *N* Tagen beigetreten sind. `0` schaltet die Prüfung aus.

Alle Regeln werden zweimal geprüft: wenn jemand den Teilnahme-Button drückt **und** noch
einmal beim Auslosen.

---

### Zusatzlose und gewichtete Auslosung

`set bonus <Rolle> <Anzahl>` gibt den Mitgliedern einer Rolle **zusätzliche Lose** (1 bis
100) und erhöht damit ihre Gewinnchance. Bei mehreren Bonusrollen summiert sich das. Mit
`remove bonus <Rolle>` nimmst du es wieder weg.

Mit einer optionalen `giveaway_id` gilt ein Bonus **nur für ein Gewinnspiel**, die
Zusatzlose dieses Gewinnspiels treten dann **an die Stelle** der serverweiten.

Bonusrollen lassen sich auch im **Web-Dashboard** pflegen: serverweit im Reiter
*Einstellungen*, je Gewinnspiel im Formular zum Anlegen und beim Bearbeiten eines laufenden.
Was eingestellt ist, sieht jeder in der Gewinnspielnachricht, siehe
[Zusatzlose im Embed](#zusatzlose-im-embed).

---

### Manager-Rolle

Standardmäßig dürfen nur Mitglieder mit dem Recht **Server verwalten** die Manager-Befehle
ausführen (`/gcreate`, `/gend` und so weiter). Setzt du eine `manager`-Rolle, gibst du die
Steuerung der Gewinnspiele an diese Rolle weiter, **ohne** *Server verwalten* zu vergeben.
Beides funktioniert immer, das Recht wie die Rolle. Mit `remove manager <Rolle>` leerst du
sie wieder.

---

### Benachrichtigungsrolle und Protokoll

- **Benachrichtigungsrolle**: wird einmal gepingt, sobald ein neues Gewinnspiel entsteht. Der Bot beschränkt seine Pings auf genau diese Rolle, `@everyone` wird nie erwähnt. Die Rolle muss für den Bot erwähnbar sein. Leeren kannst du sie mit `remove notify <Rolle>`.
- **Log-Kanal**: Ist er gesetzt, schreibt der Bot zu jedem Ereignis eines Gewinnspiels einen Protokolleintrag dorthin, also angelegt, beendet, nachgezogen, abgebrochen und so weiter.

---

### Gewinner-DMs und Erinnerungen

- **Gewinner-DMs**: Endet ein Gewinnspiel oder wird ein Gewinner nachgezogen, bekommt jeder Gewinner automatisch eine Direktnachricht mit dem Preis, den eingestellten **Einlösehinweisen** (`set claim <Text>`) und einem Link zum Gewinnspiel. Vergibt das Gewinnspiel [einen Preis je Gewinner](./commands.md#mehrere-preise), nennt die DM nur den eigenen Preis. Hat jemand DMs abgeschaltet, wird das stillschweigend übersprungen.
- **Erinnerung „läuft bald aus"**: `set reminder <Minuten>` lässt den Bot so viele Minuten vor dem Ende eine Erinnerung im Gewinnspielkanal posten und pingt dabei die Benachrichtigungsrolle, falls eingestellt. `0` schaltet das ab. Verlängerst du ein Gewinnspiel mit `/gextend`, plant sich die Erinnerung selbst neu ein.

---

### Teilnahmebedingungen im Embed

Sobald ein Gewinnspiel Bedingungen hat, also verlangte oder gesperrte Rollen, ein
Mindestalter des Kontos oder eine Mindestzugehörigkeit, stehen sie im Feld
**Voraussetzungen** des Gewinnspiel-Embeds. So sieht jedes Mitglied auf einen Blick, ob es
mitmachen darf.

Änderst du eine dieser Einstellungen später, aktualisiert das die Nachricht jedes laufenden
Gewinnspiels. Einstellungen, die in keinem Embed auftauchen (Log-Kanal, Manager-Rolle,
Erinnerung, Einlösehinweise), lassen die Nachrichten unberührt.

---

### Zusatzlose im Embed

Eingestellte Bonusrollen bekommen ein **eigenes Feld** im Gewinnspiel-Embed. Es führt jede
Rolle mit ihren Zusatzlosen auf, dazu eine Zeile, die erklärt, was das bedeutet. Das Feld
zeigt, was für dieses Gewinnspiel tatsächlich gilt: seine eigenen Zusatzlose, falls es
welche hat, sonst die serverweiten.

Aus dem Feld *Voraussetzungen* bleibt es bewusst heraus. Ein Bonus sperrt niemanden aus, er
verbessert nur die Chancen, und zwischen den Voraussetzungen gelesen wirkte er wie eine
weitere Hürde. Sind keine Bonusrollen eingestellt, erscheint das Feld gar nicht.

---

### Tebex-Gutscheine für Gewinner

Jeder Gewinner kann automatisch einen **persönlichen Rabattcode** für **deinen eigenen
Tebex-Shop** per DM bekommen. Der Bot hängt an keinem bestimmten Shop, jeder Server
verbindet seinen eigenen.

**Den Shop einrichten (Web-Dashboard → *Tebex-Shop*)**

Diesen Bereich sieht **nur der Serverinhaber**, Administratoren nicht. Ein
Tebex-Plugin-Secret ist unbeschränkter Vollzugriff auf deinen Shop, deshalb liegt er
bewusst in genau einer Hand.

| Feld | Was es ist |
|---|---|
| Plugin Secret | Aus deinem Tebex-Creator-Panel. Wird vor dem Speichern gegen Tebex geprüft, ein Tippfehler fällt also sofort auf und nicht erst Wochen später. |
| Public Token | Der öffentliche Headless-Token deines Shops. Er dient allein dazu, deine Pakete in der Auswahlliste anzuzeigen. |
| Shop-Adresse | Wo Gewinner den Code einlösen. Erscheint als Link in der Gewinner-DM. |

Das Secret liegt **verschlüsselt** (AES-256-GCM), der Schlüssel dazu außerhalb der
Datenbank. Das Dashboard zeigt nur die letzten vier Zeichen und das Datum, an dem es
gesetzt wurde. Den vollen Wert kannst du mit einem ausdrücklichen Klick sichtbar machen
oder ihn jederzeit entfernen.

**Einen Gutschein einstellen (je Gewinnspiel)**

Im Dashboard, beim Anlegen oder Bearbeiten eines Gewinnspiels:

- **Rabatt in %**: 1 bis 100. Leer lassen heißt kein Gutschein.
- **Gültig für (Tage)**: leer lassen, dann verfällt der Code nie.
- **Auf Pakete begrenzt**: ein oder mehrere Pakete wählen, oder keines, dann gilt der Rabatt auf den gesamten Warenkorb.

Gutscheine stellst du **ausschließlich im Web-Dashboard** ein, das Modal von `/gcreate`
schöpft Discords Grenze von fünf Feldern bereits aus.

#### Ein eigenes Paket je Gewinner

Vergibt das Gewinnspiel [einen Preis je Gewinner](./commands.md#mehrere-preise), zeigt das
Dashboard eine zusätzliche Paketauswahl **je Preis**. So bekommt der Gewinner von
„Script A" seinen Rabatt auf Script A und der Gewinner von „Script B" seinen auf Script B.

| Auswahl | Ergebnis |
|---|---|
| Pakete für diesen Preis gewählt | Der Code des Gewinners gilt nur für diese Pakete |
| Dieser Preis leer gelassen | Für diesen Gewinner greift die gemeinsame Auswahl von oben |
| Beides leer | Der Code rabattiert den gesamten Warenkorb |

Weil die Auswahl am Platz in der Preisliste hängt, folgt daraus zweierlei:

- **Es gibt sie nur im Modus „ein Preis je Gewinner".** Bekommen alle jeden Preis, gibt es keinen „Gewinner 2", auf den man zeigen könnte. Die Ziehungsreihenfolge ist beliebig und wird nirgends angezeigt, ein Paket je Gewinner wäre also ein Versprechen, das der Bot nicht halten kann.
- **Sortierst du die Preisliste um, wandern die Paketauswahlen mit der Position, nicht mit dem Text.** Tauschst du zwei Zeilen, tausche auch ihre Pakete. Ein einzelnes Nachziehen ist unkritisch, der Nachrücker erbt den Platz des ersetzten Gewinners und damit dessen Pakete.

#### Codes aus einem fremden Shop

Ihr macht ein Gewinnspiel gemeinsam mit einem anderen Anbieter? Deren Codes kann der Bot
nicht erzeugen, er hat keinen Zugriff auf den fremden Shop. Trage sie stattdessen unter
**Feste Codes (fremder Shop)** ein:

- **Code für alle Gewinner**: ein Code, den jeder Gewinner bekommt.
- **Code je Gewinner**: bei [einem Preis je Gewinner](./commands.md#mehrere-preise) ein eigener Code je Preis. Bleibt er leer, greift der Code von oben.
- **Hinweis für die DM**: freier Text, der mit dem Code verschickt wird, üblicherweise wo er einzulösen ist.

Dafür brauchst du **keinen eigenen Tebex-Shop**, das funktioniert auch auf einem Server,
der nie einen verbunden hat.

Ein fester Code und ein erzeugter Gutschein sind **voneinander unabhängig**. Richtest du
beides ein, bekommt der Gewinner beide Codes in derselben DM, einen für deinen Shop und
einen für den des Partners. Genau darum geht es bei einem gemeinsamen Gewinnspiel meistens.
Willst du nur den Code des Partners, lass den Rabatt oben leer.

Was der Bot mit einem fremden Code naturgemäß nicht kann:

- **Ihn prüfen.** Ein Tippfehler wird genauso zuverlässig zugestellt wie ein gültiger Code.
- **Ihn beim Nachziehen zurückziehen.** Der ersetzte Gewinner hat ihn schon in seiner DM und behält ihn. Der Bot schreibt eine Warnung in deinen Log-Kanal, damit es dir auffällt. Den Code zu sperren, ist Sache des Partners in seinem Shop.
- **Garantieren, dass er nur einmal gilt.** Ein Code für alle Gewinner heißt: Wer zuerst einlöst, hat womöglich als Einziger etwas davon. Nimm einen Code je Gewinner, wenn das eine Rolle spielt.

**Was die Gewinner bekommen**

Jeder Gewinner erhält seinen **eigenen** Code, einmal einlösbar, per DM zusammen mit dem
Preis und den Einlösehinweisen. In der öffentlichen Ergebnisnachricht und auf der
öffentlichen Ergebnisseite taucht der Code nie auf.

Beim **Nachziehen** verfällt der Code des ersetzten Gewinners in deinem Shop, bevor der
neue seinen bekommt. Ziehst du nur einen Gewinner nach, bleiben die Codes der anderen
unberührt.

Lässt sich der Gutschein nicht anlegen, etwa weil Tebex nicht erreichbar oder der Schlüssel
zurückgezogen ist, endet das Gewinnspiel trotzdem normal und der Gewinner bekommt einfach
die übliche DM. Der Fehlschlag landet im Log-Kanal und im Log des Bots.
