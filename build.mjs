// Build script: assembles src/ into single-file pages. No dependencies (Node 18+).
//   node build.mjs                 → dist/index.html (website, Three.js from vendor/) + dist/artifact.html (Claude artifact, Three.js from CDN)
//   node build.mjs --check <file>  → also verify that dist/artifact.html is byte-identical to <file>
import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src', OUT = 'dist', THREE = 'three-0.147.0';
const CDN = 'https://cdn.jsdelivr.net/npm/three@0.147.0/';
const read = p => readFileSync(join(SRC, p), 'utf8');

// I18N table: src/i18n/strings.json (Japanese → [en, de, fr, nl]), serialized compactly in the page
function i18n() {
  const o = JSON.parse(read('i18n/strings.json'));
  return '{' + Object.entries(o).map(([k, v]) => JSON.stringify(k) + ': ' +
    (Array.isArray(v) ? '[' + v.map(x => JSON.stringify(x)).join(', ') + ']' : JSON.stringify(v))).join(', ') + '}';
}

const js = readdirSync(join(SRC, 'js')).filter(f => f.endsWith('.js')).sort()
  .map(f => read('js/' + f)).join('').replace('/*@I18N*/', () => i18n());
const head = read('head.html'), css = read('style.css'), body = read('body.html');
const scripts = base => `<script src="${base}build/three.min.js"></script>\n<script src="${base}examples/js/controls/OrbitControls.js"></script>\n`;
const main = '<script>\n' + js + '</script>\n';

// Claude artifact: same shape as the original single file (the artifact host adds the document skeleton)
const artifact = head + '<style>\n' + css + '</style>\n' + body + scripts(CDN) + main;

// Website: complete document, Three.js served from our own copy.
// Vercel Web Analytics (website only; enable it in the Vercel project): the page itself is counted on load, and each model
// that is opened is counted as a page view of "/<id>" (load() in 470-model-loading.js calls window.va).
const analytics = '<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>\n' +
  '<script defer src="/_vercel/insights/script.js"></script>\n';
const webHead = head.split('\n').filter(l => !l.includes('name="claude:')).join('\n') + analytics;
const web = '<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  webHead + '<style>\n' + css + '</style>\n</head>\n<body>\n' + body +
  `<script src="vendor/${THREE}/three.min.js"></script>\n<script src="vendor/${THREE}/OrbitControls.js"></script>\n` + main + '</body>\n</html>\n';

mkdirSync(join(OUT, 'vendor', THREE), { recursive: true });
for (const f of ['three.min.js', 'OrbitControls.js', 'LICENSE']) copyFileSync(join('vendor', THREE, f), join(OUT, 'vendor', THREE, f));
writeFileSync(join(OUT, 'artifact.html'), artifact);
writeFileSync(join(OUT, 'index.html'), web);
console.log(`built dist/index.html (${web.length} chars), dist/artifact.html`);

const ci = process.argv.indexOf('--check');
if (ci > 0) {
  const ref = readFileSync(process.argv[ci + 1], 'utf8');
  if (ref === artifact) console.log('check: identical');
  else { let i = 0; while (ref[i] === artifact[i]) i++; console.log('check: DIFFERENT at char', i, JSON.stringify(ref.slice(i, i + 80))); process.exit(1); }
}
// quick syntax check of the main script
try { new Function(js); console.log('syntax ok'); } catch (e) { console.log('SYNTAX ERROR', e.message); process.exit(1); }
