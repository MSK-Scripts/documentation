# Apache vhost Setup — docu.msk-scripts.de

Diese Vorlage gehört zur Hash-basierten CSP-Strategie der Docusaurus-Site. Das vhost-File liest seine `Content-Security-Policy` aus einer Snippet-Datei, die nach jedem `yarn build` von [`scripts/generate-csp.mjs`](../scripts/generate-csp.mjs) automatisch generiert wird.

## Dateien

| Datei | Zweck |
|---|---|
| [`vhost.example.conf`](./vhost.example.conf) | Apache-vhost-Vorlage **als Referenz**. Der laufende vhost auf dem Server bleibt unangetastet (Wildcard-Zert ist dort schon konfiguriert) — aus dem Beispiel werden nur die Header-/Include-Direktiven manuell übernommen. |
| `../scripts/generate-csp.mjs` | Postbuild-Script — schreibt `build/csp-hashes.conf` |
| `../build/csp-hashes.conf` | Generierter Apache `<IfModule mod_headers.c>`-Block mit allen SHA256-Hashes |

## Einmaliges Server-Setup

Da der Deploy-User bereits mit Root-Rechten arbeitet (das bestehende `chown -R www-data:www-data` im Workflow läuft ohne `sudo`), ist kein zusätzlicher `sudoers.d`-Eintrag nötig.

```bash
# 1) Required Apache-Module aktivieren
a2enmod headers rewrite ssl http2 expires deflate

# 2) Snippet-Verzeichnis anlegen (wird vom Deploy-Workflow auch automatisch
#    nachgeholt — siehe mkdir -p im Postdeploy-Step)
mkdir -p /etc/apache2/snippets

# 3) Im bestehenden vhost (mit Wildcard-Zert) die kritischen Direktiven aus
#    apache/vhost.example.conf manuell ergänzen — siehe unten.

# 4) Site testen + reloaden
apachectl configtest
systemctl reload apache2
```

### Patch-Block für den bestehenden vhost

Diese Direktiven gehören **innerhalb** des `<VirtualHost *:443>` deines bestehenden Configs, idealerweise nach dem SSL-Block:

```apache
    DocumentRoot /var/www/html/docs_msk-scripts

    <Directory /var/www/html/docs_msk-scripts>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    # Apache-Config-Files niemals via HTTP ausliefern
    <FilesMatch "\.(conf|htaccess|htpasswd|ini)$">
        Require all denied
    </FilesMatch>

    <IfModule mod_headers.c>
        # Erst alles unsetten, was security.conf oder andere Includes setzen
        Header always unset X-Frame-Options
        Header always unset X-Content-Type-Options
        Header always unset X-XSS-Protection
        Header always unset Strict-Transport-Security
        Header always unset Referrer-Policy
        Header always unset Permissions-Policy
        Header always unset Feature-Policy
        Header always unset Cross-Origin-Opener-Policy
        Header always unset Cross-Origin-Embedder-Policy
        Header always unset Cross-Origin-Resource-Policy
        Header always unset Content-Security-Policy
        Header always unset Content-Security-Policy-Report-Only

        # X-XSS-Protection bleibt bewusst weg (deprecated)
        Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        Header always set X-Content-Type-Options "nosniff"
        Header always set X-Frame-Options "DENY"
        Header always set Referrer-Policy "strict-origin-when-cross-origin"
        Header always set Cross-Origin-Opener-Policy "same-origin"
        Header always set Cross-Origin-Embedder-Policy "require-corp"
        Header always set Cross-Origin-Resource-Policy "same-origin"
        Header always set Permissions-Policy "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), interest-cohort=()"
    </IfModule>

    # CSP-Hashes — wird vom Deploy-Workflow gepflegt
    Include /etc/apache2/snippets/docu-csp-hashes.conf

    ErrorDocument 404 /404.html
```

> **Hinweis:** Beim allerersten Deploy ist `/etc/apache2/snippets/docu-csp-hashes.conf` noch nicht vorhanden. Das `Include`-Directive im vhost wirft dann beim `configtest` einen Fehler. Lösung: entweder zuerst einen Build pushen (Workflow legt das Snippet an), oder das `Include` im vhost erst aktivieren, **nachdem** der erste Deploy gelaufen ist.

## Bei jedem Deploy

`yarn build` erzeugt zusätzlich `build/csp-hashes.conf`. Der Postdeploy-Step in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) erledigt **vollautomatisch**:

1. `csp-hashes.conf` aus dem DocumentRoot nach `/etc/apache2/snippets/docu-csp-hashes.conf` mit `install -o root -g root -m 0644` kopieren
2. Die Datei aus dem DocumentRoot wieder entfernen (Defense-in-Depth zusätzlich zum `FilesMatch`-Block im vhost)
3. `apachectl configtest` — bricht den Workflow ab, falls die Apache-Config kaputt ist
4. `systemctl reload apache2`
5. Health-Check via `systemctl is-active --quiet apache2`

Manueller Aufruf — falls mal nötig:

```bash
install -o root -g root -m 0644 /var/www/html/docs_msk-scripts/csp-hashes.conf /etc/apache2/snippets/docu-csp-hashes.conf
rm -f /var/www/html/docs_msk-scripts/csp-hashes.conf
apachectl configtest && systemctl reload apache2
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
