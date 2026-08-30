---
title: FAQ
description: Häufige Fragen zum selbst gehosteten MSK Discord Ticket Bot, von der Datenbankwahl über Transkripte bis zum Hosting.
sidebar_position: 9
---

### Brauche ich FiveM oder einen Gameserver dafür?
Nein. Es ist ein reiner Discord-Bot und hat mit FiveM, ESX, QBCore oder irgendeinem Gameserver nichts zu tun. Er spricht mit Discord und sonst mit nichts, und er braucht nur Node.js und einen Bot-Token. MSK Scripts veröffentlicht daneben auch FiveM-Ressourcen, daher kommt die Frage meistens, aber die beiden teilen sich nichts außer dem Namen auf dem Shop.

### Muss ich einen API Key haben?
Nein. Ohne API Key funktioniert der Bot normal und sendet das Transkript als Datei per DM.  
Der Key ist nur nötig, wenn Transkripte als öffentliche Links gespeichert werden sollen.

### Was passiert wenn ich mein Abo kündige?
Zum Ende des bezahlten Zeitraums wird dein Tier automatisch auf Basic zurückgestuft (eine Kündigung  
während der 14-tägigen Testphase verursacht keine Kosten). Bestehende Transkripte bleiben bis zu  
ihrem Ablaufdatum abrufbar. Eigene Domains werden deaktiviert.

### Kann ich den API Key für mehrere Server nutzen?
Nein. Jeder API Key ist an genau einen Discord-Server gebunden.  
Für jeden Server muss der Verify-Prozess separat durchgeführt werden.

### Ich habe meinen API Key verloren, was nun?
Besuche [www.msk-scripts.de/ticketbot/verify](https://www.msk-scripts.de/ticketbot/verify) erneut und durchlaufe den Prozess.  
Ein neuer Key wird generiert und der alte wird sofort ungültig.  
Vergiss nicht, den Key in der `.env` des Bots zu aktualisieren und ihn neu zu starten.

### Meine Domain zeigt nach langer Zeit noch „DNS ausstehend", was prüfen?
Stelle sicher, dass der A-Record bei deinem Domain-Anbieter korrekt gesetzt ist und auf die  
im Dashboard angezeigte IP zeigt. Die Propagierung kannst du mit [dnschecker.org](https://dnschecker.org) überprüfen.

### Ist das SSL-Zertifikat kostenlos?
Ja. SSL-Zertifikate werden automatisch über **Let's Encrypt** (Certbot) ohne Kosten eingerichtet  
und erneuern sich automatisch vor Ablauf.

### Was ist „Gehostetes Bot-Management"?
In jedem bezahlten Tarif kannst du deinen Bot von MSK Scripts hosten lassen. Der Bot läuft auf unserem Server, und du richtest das selbst im Tab **Bot Hosting** deines Dashboards ein: Bot-Token, Client ID und Client Secret eintragen, den Rest machen wir, inklusive der Prüfung, ob er wirklich hochgekommen ist. Du behältst die Bot-Steuerung (starten, stoppen, neu starten, aktualisieren), eine Live-Log-Konsole und ein Formular zum Korrigieren dieser Zugangsdaten. Kein SSH-Zugang, kein Server-Wissen, und keine Absprache vorab.

### Wie kommt mein Team in das Dashboard des Bots?
Jeder gehostete Bot wird unter einer eigenen Adresse veröffentlicht, `tickets-<id>.msk-scripts.de` oder einer eigenen Domain, und dort läuft der Discord-Login des Bots selbst. Gib die Adresse an dein Team weiter: es meldet sich mit dem eigenen Konto an und sieht genau das, was seine Rechte erlauben. Einen Schritt musst du selbst machen, weil nur du ihn machen kannst: die im Dashboard angezeigte Redirect-URL im Discord Developer Portal unter **OAuth2 → Redirects** eintragen. Ohne sie endet die Anmeldung auf einer Discord-Fehlerseite.

### Kann ich das Hosting wieder abschalten?
Ja, im selben Tab. Beim Entfernen wird der Bot gestoppt, seine Adresse vom Netz genommen und die Installation archiviert; das Archiv wird nach 14 Tagen endgültig gelöscht. Kommst du innerhalb dieser 14 Tage zurück, fragen wir, ob du die alte Installation zurückhaben willst. Ein Klick holt sie samt Tickets, Einstellungen und derselben Adresse zurück.
