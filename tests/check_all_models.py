"""Load every published model, click step 1, and report page errors.
Usage: python tests/check_all_models.py [model ...]     (run `node build.mjs` first)"""
import asyncio, sys
from playwright.async_api import async_playwright
from _common import ARGS, page_url

async def main(only):
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS)
        pg = await b.new_page(viewport={"width": 900, "height": 700})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(page_url("a-01")); await pg.wait_for_timeout(2500)
        ids = await pg.evaluate("[...document.querySelectorAll('.item:not([disabled])')].map(b=>b.dataset.id)")
        bad = 0
        for i in ids:
            if only and i not in only: continue
            n = len(errs)
            await pg.evaluate(f"__oa.load('{i}')"); await pg.wait_for_timeout(600)
            await pg.evaluate("document.querySelector('.steps button[data-s=\"1\"]')&&document.querySelector('.steps button[data-s=\"1\"]').click()")
            await pg.wait_for_timeout(600)
            e = errs[n:]; bad += bool(e)
            print(i, e or "ok", flush=True)
        print("FAILED" if bad else "all ok", f"({len(ids)} models)" if not only else "")
        await b.close()
        sys.exit(1 if bad else 0)
asyncio.run(main(set(sys.argv[1:])))
