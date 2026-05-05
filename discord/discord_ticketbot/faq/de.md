---
title: FAQ - (Deutsch)
description: FAQ - (Deutsch)
sidebar_position: 2
---

# Häufige Fragen

### Muss ich einen API Key haben?
Nein. Ohne API Key funktioniert der Bot normal und sendet das Transkript als Datei per DM.  
Der Key ist nur nötig, wenn Transkripte als öffentliche Links gespeichert werden sollen.

### Was passiert wenn mein Sponsoring ausläuft?
Dein Tier wird automatisch auf Basic zurückgestuft. Bestehende Transkripte bleiben bis zu  
ihrem Ablaufdatum abrufbar. Eigene Domains werden deaktiviert.

### Kann ich den API Key für mehrere Server nutzen?
Nein. Jeder API Key ist an genau einen Discord-Server gebunden.  
Für jeden Server muss der Verify-Prozess separat durchgeführt werden.

### Ich habe meinen API Key verloren — was nun?
Besuche [www.msk-scripts.de/verify](https://www.msk-scripts.de/verify) erneut und durchlaufe den Prozess.  
Ein neuer Key wird generiert und der alte wird sofort ungültig.  
Vergiss nicht, den Key in der `.env` des Bots zu aktualisieren und ihn neu zu starten.

### Meine Domain zeigt nach langer Zeit noch „DNS ausstehend" — was prüfen?
Stelle sicher, dass der A-Record bei deinem Domain-Anbieter korrekt gesetzt ist und auf die  
im Dashboard angezeigte IP zeigt. Die Propagierung kannst du mit [dnschecker.org](https://dnschecker.org) überprüfen.

### Ist das SSL-Zertifikat kostenlos?
Ja. SSL-Zertifikate werden automatisch über **Let's Encrypt** (Certbot) ohne Kosten eingerichtet  
und erneuern sich automatisch vor Ablauf.