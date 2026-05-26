#!/usr/bin/env node
/**
 * generate-csp.mjs
 * ------------------------------------------------------------------
 * Postbuild-Script für die Docusaurus-Site docu.msk-scripts.de.
 *
 * Walks `build/` rekursiv, extrahiert pro HTML-Datei:
 *   - alle inline <script>…</script>      (ohne src)
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
 * Apache reload nach Deploy nicht vergessen.
 * ------------------------------------------------------------------
 */

import {readdir, readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';

const BUILD_DIR = 'build';
const OUTPUT_FILE = join(BUILD_DIR, 'csp-hashes.conf');

// ----- Regex -------------------------------------------------------
const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const STYLE_RE = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
const STYLE_ATTR_RE = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

const HAS_SRC_RE = /\bsrc\s*=/i;
const TYPE_ATTR_RE = /\btype\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;

/**
 * Liefert true, wenn das <script>-Tag als ausführbares JavaScript zählt
 * (und damit von CSP `script-src` enforced wird). Nicht-ausführbare Types
 * wie application/ld+json, application/json oder template-Daten werden
 * laut W3C-CSP-Spec ignoriert — die müssen wir nicht hashen.
 */
function isExecutableJsScript(attrs) {
  const m = attrs.match(TYPE_ATTR_RE);
  if (!m) return true; // kein type → JS
  const value = (m[1] ?? m[2] ?? m[3] ?? '').trim().toLowerCase();
  if (value === '') return true;
  if (value === 'module') return true;
  // JS MIME types laut HTML-Spec
  const jsMimes = new Set([
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
  return jsMimes.has(value);
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

  // Inline <script> — nur ausführbares JavaScript hashen.
  // JSON-LD / application/json u. Ä. werden von CSP `script-src` nicht enforced.
  for (const match of html.matchAll(SCRIPT_RE)) {
    const [, attrs, body] = match;
    if (HAS_SRC_RE.test(attrs)) continue;
    if (!body.trim()) continue;
    if (!isExecutableJsScript(attrs)) continue;
    scriptHashes.add(sha256Base64(body));
  }

  // Inline <style>
  for (const match of html.matchAll(STYLE_RE)) {
    const [, body] = match;
    if (!body.trim()) continue;
    styleBlockHashes.add(sha256Base64(body));
  }

  // style="…" attributes
  for (const match of html.matchAll(STYLE_ATTR_RE)) {
    const value = match[1] ?? match[2] ?? '';
    if (!value) continue;
    styleAttrHashes.add(sha256Base64(value));
  }
}

function formatHashList(set) {
  return [...set].map((h) => `'sha256-${h}'`).join(' ');
}

// ----- Main --------------------------------------------------------
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
