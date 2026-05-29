#!/usr/bin/env node
/**
 * generate-csp.mjs
 * ------------------------------------------------------------------
 * Postbuild-Script für die Docusaurus-Site docu.msk-scripts.de.
 *
 * Walks `build/` rekursiv und extrahiert pro HTML-Datei mit einem echten
 * HTML-Parser (cheerio):
 *   - alle inline <script>…</script>      (ohne src, nur ausführbares JS)
 *   - alle inline <style>…</style>
 *   - alle style="…"-Attribute
 *
 * Berechnet von jedem einzigartigen Block / Attribut einen SHA256-Hash
 * und schreibt ein Apache-Snippet `build/csp-hashes.conf`, das im vhost
 * via `Include` geladen werden kann.
 *
 * Damit fallen `unsafe-inline` (script + style) und `unsafe-eval` weg.
 * Für die inline style="…"-Attribute wird `'unsafe-hashes'` zusätzlich
 * gesetzt (W3C-Spec: pro Attribut-Hash erforderlich).
 *
 * Warum cheerio statt Regex? "Parsing general HTML using regular
 * expressions is impossible" — ein Regex übersieht z. B. unquoted
 * Attribute (style=foo:bar) und matcht fälschlich style= innerhalb von
 * <script>-Text. Der Parser bildet exakt das ab, was der Browser parst
 * und hasht. (Vermeidet außerdem CodeQL js/bad-tag-filter.)
 *
 * Hash-Korrektheit:
 *   - <script>/<style> sind "raw text" → cheerio .html() liefert den
 *     Inhalt unverändert; der Browser hasht denselben Rohtext.
 *   - style="…" wird vom Parser entity-dekodiert (&quot; → "); der
 *     Browser hasht ebenfalls den dekodierten Wert. cheerios .attr()
 *     liefert genau diesen dekodierten Wert.
 *
 * Apache reload nach Deploy nicht vergessen.
 * ------------------------------------------------------------------
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {load} from 'cheerio';

const BUILD_DIR = 'build';
const OUTPUT_FILE = join(BUILD_DIR, 'csp-hashes.conf');

// JS-MIME-Types laut HTML-Spec. Nur diese (oder kein/leerer type, oder
// "module") sind ausführbar und werden von CSP `script-src` enforced.
// Nicht-ausführbare Types wie application/ld+json müssen NICHT gehasht werden.
const JS_MIME_TYPES = new Set([
  'text/javascript',
  'application/javascript',
  'application/ecmascript',
  'text/ecmascript',
  'application/x-ecmascript',
  'application/x-javascript',
  'text/javascript1.0',
  'text/javascript1.1',
  'text/javascript1.2',
  'text/javascript1.3',
  'text/javascript1.4',
  'text/javascript1.5',
  'text/jscript',
  'text/livescript',
  'text/x-ecmascript',
  'text/x-javascript',
]);

function isExecutableJsType(typeAttr) {
  const value = (typeAttr ?? '').trim().toLowerCase();
  if (value === '' || value === 'module') return true;
  return JS_MIME_TYPES.has(value);
}

// ----- State -------------------------------------------------------
const scriptHashes = new Set();
const styleBlockHashes = new Set();
const styleAttrHashes = new Set();

let htmlCount = 0;

// ----- Helpers -----------------------------------------------------
function sha256Base64(input) {
  return createHash('sha256').update(input, 'utf8').digest('base64');
}

async function walk(dir) {
  const entries = await readdir(dir, {withFileTypes: true});
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      await processHtml(full);
    }
  }
}

async function processHtml(path) {
  htmlCount++;
  const html = await readFile(path, 'utf8');
  const $ = load(html);

  // Inline <script> — ohne src, nur ausführbares JavaScript.
  $('script').each((_, el) => {
    if (el.attribs && 'src' in el.attribs) return;
    if (!isExecutableJsType(el.attribs?.type)) return;
    const body = $(el).html() ?? '';
    if (!body.trim()) return;
    scriptHashes.add(sha256Base64(body));
  });

  // Inline <style>
  $('style').each((_, el) => {
    const body = $(el).html() ?? '';
    if (!body.trim()) return;
    styleBlockHashes.add(sha256Base64(body));
  });

  // style="…" Attribute — cheerio liefert den entity-dekodierten Wert,
  // exakt wie der Browser ihn hasht.
  $('[style]').each((_, el) => {
    const value = el.attribs?.style ?? '';
    if (!value) return;
    styleAttrHashes.add(sha256Base64(value));
  });
}

function formatHashList(set) {
  return [...set].map((h) => `'sha256-${h}'`).join(' ');
}

// ----- Main --------------------------------------------------------
if (!existsSync(BUILD_DIR)) {
  console.error(
    `[csp] ✗ "${BUILD_DIR}/" nicht gefunden. Zuerst "docusaurus build" ausführen.`,
  );
  process.exit(1);
}

console.log(`[csp] Walking ${BUILD_DIR}/ …`);
await walk(BUILD_DIR);

const scriptHashList = formatHashList(scriptHashes);
const styleBlockHashList = formatHashList(styleBlockHashes);
const styleAttrHashList = formatHashList(styleAttrHashes);

const scriptSrc = ["'self'", scriptHashList].filter(Boolean).join(' ');
const styleSrcParts = ["'self'", styleBlockHashList];
if (styleAttrHashes.size > 0) {
  styleSrcParts.push("'unsafe-hashes'", styleAttrHashList);
}
const styleSrc = styleSrcParts.filter(Boolean).join(' ');

// Mozilla Observatory verlangt `default-src 'none'` für volle Punktzahl
// → alle benötigten Ressourcen-Typen müssen explizit gelistet werden.
const cspDirectives = [
  `default-src 'none'`,
  `script-src ${scriptSrc}`,
  `style-src ${styleSrc}`,
  `img-src 'self' data:`,
  `font-src 'self' data:`,
  `connect-src 'self'`,
  `manifest-src 'self'`,
  `media-src 'self'`,
  `worker-src 'self'`,
  `frame-src 'none'`,
  `object-src 'none'`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `upgrade-insecure-requests`,
];
const csp = cspDirectives.join('; ') + ';';

const generated = new Date().toISOString();
const snippet = `# ============================================================================
#  Content-Security-Policy snippet — AUTO-GENERATED. DO NOT EDIT.
#  Source: scripts/generate-csp.mjs (Postbuild)
#  Generated: ${generated}
#  Stats:
#    HTML files scanned       : ${htmlCount}
#    Unique inline scripts    : ${scriptHashes.size}
#    Unique inline <style>    : ${styleBlockHashes.size}
#    Unique style="…" attrs   : ${styleAttrHashes.size}
# ----------------------------------------------------------------------------
#  Wird vom vhost via   Include /etc/apache2/snippets/docu-csp-hashes.conf
#  geladen. Bei jedem Deploy mitkopieren und Apache reloaden.
# ============================================================================

<IfModule mod_headers.c>
    Header always unset Content-Security-Policy
    Header always set Content-Security-Policy "${csp}"
</IfModule>
`;

await writeFile(OUTPUT_FILE, snippet, 'utf8');

console.log(`[csp] ✓ Wrote ${OUTPUT_FILE}`);
console.log(`[csp]   HTML files scanned   : ${htmlCount}`);
console.log(`[csp]   Inline <script> hash : ${scriptHashes.size}`);
console.log(`[csp]   Inline <style>  hash : ${styleBlockHashes.size}`);
console.log(`[csp]   style="…"       hash : ${styleAttrHashes.size}`);
console.log(`[csp]   Header byte size     : ${csp.length} bytes`);
