"""Run a scripted sequence and take screenshots of the 3D view into tests/out/.
Usage: python tests/shots.py tests/scenarios/<file>.json
The JSON is a list: first item {"model":"d-05","w":1100,"h":800}, then steps
{"js":"<code run in the page>","wait":ms,"shot":"<name>"}. In the page, window.__oa gives
{api, S, inst, load, r (renderer), MAT}; e.g. __oa.api.keys([0]), __oa.api.stops([1,0,1,0,0]),
__oa.api.cam([x,y,z],[tx,ty,tz]), __oa.api.xray(true), __oa.api.ctl(name, value)."""
import asyncio, os, sys, json
from playwright.async_api import async_playwright
from _common import ARGS, page_url, OUT

cmds = json.load(open(sys.argv[1], encoding="utf8"))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=ARGS)
        pg = await b.new_page(viewport={"width": cmds[0].get("w", 1100), "height": cmds[0].get("h", 800)})
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto(page_url(cmds[0].get("model", "a-01"))); await pg.wait_for_timeout(cmds[0].get("wait0", 4000))
        print("loaded", errs[:3], flush=True)
        el = await pg.query_selector("#stagewrap")
        for c in cmds[1:]:
            if "js" in c:
                r = await pg.evaluate(c["js"])
                if r is not None: print("R:", r, flush=True)
            await pg.wait_for_timeout(c.get("wait", 300))
            if "shot" in c:
                bb = await el.bounding_box() if not c.get("full") else None
                path = os.path.join(OUT, c["shot"] + ".png")
                await pg.screenshot(path=path, clip=bb, full_page=bool(c.get("full"))); print("shot", path)
        print("errors:", errs[:8], flush=True)
        await b.close()
asyncio.run(main())
