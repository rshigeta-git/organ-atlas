import os
ARGS = ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def page_url(model=None, page="dist/index.html"):
    return "file://" + os.path.join(ROOT, page) + ("#" + model if model else "")
OUT = os.path.join(ROOT, "tests", "out")
os.makedirs(OUT, exist_ok=True)
