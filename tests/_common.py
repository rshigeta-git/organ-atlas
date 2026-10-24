import os
from pathlib import Path
ARGS = ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def page_url(model=None, page="dist/index.html"):
    return Path(ROOT, page).as_uri() + ("#" + model if model else "")
OUT = os.path.join(ROOT, "tests", "out")
os.makedirs(OUT, exist_ok=True)
