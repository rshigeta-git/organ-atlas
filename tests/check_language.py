"""For each language, load models and list any Japanese text left on the page (untranslated strings).
Usage: python tests/check_language.py [lang] [model ...]   e.g.  python tests/check_language.py nl d-05 h-03"""
import asyncio, re, sys
from playwright.async_api import async_playwright
from _common import ARGS, page_url
JP = re.compile(r"[぀-ヿ一-鿿]+")

async def main(langs, only):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS)
        pg = await b.new_page(viewport={"width": 1300, "height": 900}); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(page_url("a-01")); await pg.wait_for_timeout(2500)
        ids = await pg.evaluate("[...document.querySelectorAll('.item:not([disabled])')].map(b=>b.dataset.id)")
        for lg in langs:
            await pg.select_option("#langSel", lg); await pg.wait_for_timeout(300)
            for m in ids:
                if only and m not in only: continue
                await pg.evaluate(f"__oa.load('{m}')"); await pg.wait_for_timeout(700)
                left = set(x for x in JP.findall(await pg.evaluate("document.body.innerText")) if x != "日本語")
                if left: print(lg, m, sorted(left)[:12], flush=True)
            print(lg, "done", flush=True)
        print("errors", errs[:5]); await b.close()
args = sys.argv[1:]
langs = [a for a in args if a in ("en", "de", "fr", "nl", "it", "es")] or ["en", "de", "fr", "nl", "it", "es"]
asyncio.run(main(langs, set(a for a in args if a not in langs)))
