# パイプオルガンメカニズム図鑑 (Atlas of Pipe Organ Mechanisms)

Interactive Three.js atlas of pipe-organ mechanisms (wind supply, windchests, key/stop actions, couplers, whole organs).
The owner is an organ builder with a mechanical-design background; he talks in Japanese and expects mechanically
correct models (real dimensions, trackers only ever in tension, correct lever directions).

## First-time setup (if there is no .git yet)
The project was delivered without a `.git` folder; the full history is in `organ-atlas-history.bundle`.
Restore it with `git init -b main && git fetch organ-atlas-history.bundle main && git reset FETCH_HEAD`,
check `git status` is clean (only the bundle itself untracked), then delete the bundle (ask the owner first).
Set `git config user.name "Shigeta Ryoji"` and `user.email` locally if Git asks. Do not push anywhere unless asked.

## Layout
- `src/head.html`, `src/style.css`, `src/body.html` – page shell.
- `src/js/NNN-*.js` – the main script, **concatenated in file-name order** into one `<script>` inside an IIFE.
  They are not modules: everything shares one scope, so order matters (helpers before users). Keep the numeric prefixes.
- `src/i18n/strings.json` – UI/explanation translations: Japanese source text → `[en, de, fr, nl]`.
  Injected into `030-i18n-strings.js` at the `/*@I18N*/` marker.
- `vendor/three-0.147.0/` – Three.js r147 (global `THREE` build + examples/js OrbitControls). Do not upgrade casually:
  the code uses the r147 global build (`window.THREE`, `THREE.OrbitControls`).
- `build.mjs` – no dependencies. `node build.mjs` writes
  - `dist/index.html` – the website (complete HTML document, Three.js from `dist/vendor/`).
  - `dist/artifact.html` – same page in the shape used for the claude.ai artifact (Three.js from jsDelivr CDN, no doctype).
  - `node build.mjs --check <file>` additionally verifies dist/artifact.html is byte-identical to `<file>`.
- `tests/` – Playwright (Python) checks; run after `node build.mjs`.

## Commands
```
node build.mjs                          # build + syntax check
python tests/check_all_models.py        # load every model, run step 1, report page errors (~10 min in software GL)
python tests/check_all_models.py d-05   # just some models
python tests/shots.py tests/scenarios/d-05.json   # scripted screenshots → tests/out/
python tests/check_language.py nl d-05  # Japanese text left on the page in a language
```
Setup for tests: `pip install playwright` then `python -m playwright install chromium`.
Always look at screenshots after changing geometry; a model that loads without errors can still be wrong.

## Conventions
- Units: 1 scene unit = 7.8 mm (`MM=1/7.8`). Pipes are drawn at `SC=0.45` (45 % of real length and diameter);
  H-03 is built at full size (`sc:1`).
- Stop indices (`STOPS` in 050-data.js): 0 Gedackt 8′, 1 Rohrflöte 4′, 2 Prinzipal 2′, 3 Mixtur, 4 Vox humana,
  5 Prinzipal 8′, 6 Octave 4′, 7 Quinte, 8 Octave 2′, 9 Trompete, 10 Blockflöte, 11 Subbass 16′, 12 Posaune 16′.
- Part labels: `LB(ja, de)`; the German term is the key into `TR` (`de: [en, fr]`, 010-part-names.js) and `TRNL`
  (`de: nl`). Every new German term needs entries in both.
- Any new Japanese UI/explanation string (model `name`, `summary`, `foot`, step `t`, pins `t`, stop-row labels…)
  needs an entry in `src/i18n/strings.json` with all four languages, or it shows in Japanese.
- Models are defined in `MODELS` (430-model-definitions.js): `id, name, terms, stops0, floor, cam{p,t}, clip[min,max]
  (x range of the cut slider), foot, summary, steps[{t, run(api)}], build()` → instance with optional `chest, update(dt),
  pins, stopRows, ctl{}, noStops/noKeys`. The chapter list is `INDEX` (440-model-index.js); `DEV` hides models still in development.
- Shared builders: `buildChest(o)` (slider/spring chest; options y, z, kd, sp, stops, rows, mixz, P (channel pitch),
  palMat, volN, order; gives `pos(k)`, `pullDown(k)`), `buildKeyboard`, `makeTracker(mat,label).set(top,bottom,thick)`
  (top = hook end, bottom goes through a hole with a leather nut underneath), `rod`, `box`, `plank`, `bore`.
- In the page, `window.__oa = {api, S, inst, load, r, MAT}` is the debug/test hook.
- All user-facing text is written for a general audience in Japanese first; keep the existing tone.

## Publishing
- The current public preview is a claude.ai artifact (https://claude.ai/artifact/2D7TJwyGVRjEnuk1DzsSfa); publish
  `dist/artifact.html` there to update it.
- The website is meant for Vercel as a static site: build command `node build.mjs`, output directory `dist`
  (see vercel.json). Nothing is deployed yet.
