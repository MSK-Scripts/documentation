# Apache vhost Setup — docu.msk-scripts.de

Diese Vorlage gehört zur Hash-basierten CSP-Strategie der Docusaurus-Site. Das vhost-File liest seine `Content-Security-Policy` aus einer Snippet-Datei, die nach jedem `yarn build` von [`scripts/generate-csp.mjs`](../scripts/generate-csp.mjs) automatisch generiert wird.

## Dateien

| Datei | Zweck |
|---|---|
| [`vhost.example.conf`](./vhost.example.conf) | Apache-vhost-Vorlage für `/etc/apache2/sites-available/docu.msk-scripts.de.conf` |
| `../scripts/generate-csp.mjs` | Postbuild-Script — schreibt `build/csp-hashes.conf` |
| `../build/csp-hashes.conf` | Generierter Apache `<IfModule mod_headers.c>`-Block mit allen SHA256-Hashes |

## Einmaliges Server-Setup

```bash
# 1) Required Apache-Module aktivieren
sudo a2enmod headers rewrite ssl http2 expires deflate

# 2) Snippet-Verzeichnis anlegen
sudo mkdir -p /etc/apache2/snippets
sudo chown root:root /etc/apache2/snippets

# 3) Bestehende security.conf-Defaults entschärfen (optional, aber empfohlen)
#    Der vhost setzt alles selbst mit `Header always unset` → der Schritt schadet nicht.

# 4) vhost-Datei aus apache/vhost.example.conf in /etc/apache2/sites-available/ kopieren
sudo cp apache/vhost.example.conf /etc/apache2/sites-available/docu.msk-scripts.de.conf

# 5) Zertifikate via Certbot besorgen (falls noch nicht vorhanden)
sudo certbot --apache -d docu.msk-scripts.de

# 6) Site aktivieren
sudo a2ensite docu.msk-scripts.de
sudo apachectl configtest
sudo systemctl reload apache2
```

## Bei jedem Deploy

`yarn build` erzeugt zusätzlich `build/csp-hashes.conf`. Dieses Snippet muss nach jedem Deploy auf den Server in das Snippets-Verzeichnis kopiert werden, gefolgt von einem Apache-Reload:

```bash
sudo cp /var/www/html/docs_msk-scripts/csp-hashes.conf /etc/apache2/snippets/docu-csp-hashes.conf
sudo chown root:root /etc/apache2/snippets/docu-csp-hashes.conf
sudo systemctl reload apache2
```

Im Deploy-Workflow ([`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)) erledigt das der zweite SSH-Schritt automatisch, sofern der Deploy-User `sudo cp` und `sudo systemctl reload apache2` ohne Passwort darf. Beispiel-`sudoers.d`-Eintrag für den Deploy-User:

```sudoers
# /etc/sudoers.d/deploy-docu
deploy ALL=(root) NOPASSWD: /bin/cp /var/www/html/docs_msk-scripts/csp-hashes.conf /etc/apache2/snippets/docu-csp-hashes.conf, /bin/chown root\:root /etc/apache2/snippets/docu-csp-hashes.conf, /bin/systemctl reload apache2
```

## Sicherheits-Header — Übersicht

| Header | Wert | Begründung |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | 2 Jahre, preload-ready |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'sha256-…'; …` | Hash-basiert, kein `unsafe-inline`/`unsafe-eval` |
| `X-Content-Type-Options` | `nosniff` | MIME-Sniffing aus |
| `X-Frame-Options` | `DENY` | Defense-in-Depth zu `frame-ancestors 'none'` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Standard-Empfehlung |
| `Cross-Origin-Opener-Policy` | `same-origin` | Cross-Origin Window-Isolation |
| `Cross-Origin-Embedder-Policy` | `require-corp` | Cross-Origin Resource-Isolation |
| `Cross-Origin-Resource-Policy` | `same-origin` | Resource-Embedding-Schutz |
| `Permissions-Policy` | `accelerometer=(), camera=(), …` | Alle nicht benötigten Browser-APIs explizit verboten |
| `X-XSS-Protection` | **— nicht gesetzt** | Header ist deprecated, alle modernen Browser haben ihn entfernt |

## Wann muss die CSP neu generiert werden?

Bei jedem dieser Auslöser läuft `yarn build` und damit `generate-csp.mjs` automatisch:

- Docusaurus-Upgrade (das die internen Bootstrap-Scripts ändert)
- Theme/Layout-Änderungen, die neue `style="…"`-Attribute einführen
- Neue Plugins oder `headTags`, die Inline-`<script>` oder `<style>` ausgeben

Wenn du nach einem Deploy in der Browser-Konsole `Refused to execute inline script because it violates the following Content Security Policy directive…` siehst, fehlt ein neuer Hash → erneuter Deploy mit aktualisiertem Snippet löst das.

## Mozilla Observatory

Erwartete Bewertung nach Aktivierung: **A+** (CSP von −20 auf 0, alle weiteren Header bereits grün).
