"""
divide map image by pixel for *lazy load
"""
import json
import math
import os
import shutil
import pathlib

from colorama import Fore
from typing import *
from PIL import Image


Image.MAX_IMAGE_PIXELS = 2**50

def divide(
        src: str, out_path: str, wi: int, he: int, *,
        cleardir: bool=False
        ) -> Dict[str, int]:
    """ Although whatever extension src had, its divideds are forced to be .png for mode RGBA """
    if out_path.endswith("/"): out_path = out_path[:-1]
    if cleardir:
        shutil.rmtree(out_path)
        os.mkdir(out_path)
    image = Image.open(src)
    width, height = image.size
    ext = "png"#pathlib.Path(src).suffix[1:]

    print(f"Image: {{ width: {width}, height: {height} }}")

    w = math.ceil(width / wi)
    h = math.ceil(height / he)

    tileW, tileH = wi, he

    for i in range(h):
        for j in range(w):
            left = j * tileW
            upper = i * tileH
            right = (j + 1) * tileW
            lower = (i + 1) * tileH
            tile = (image.crop((left, upper, right, lower)))
            tile.save(f"{out_path}/tile_{i}_{j}.{ext}")

    det = { "tile_width": wi, "tile_height": he, "xrange": j, "yrange": i }
    with open(f"{out_path}/data.json", "w") as f:
        json.dump({**det, "width": tileW, "height": tileH, "format": f"tile_{{0}}_{{1}}.{ext}"},
                f,
                indent=4
        )
    image.close()

    canvaswidth, canvasheight = wi*(j+1), he*(i+1)
    canvasarea = canvaswidth * canvasheight

    if canvasarea > 16777216:
        print(f"\033[1m{Fore.YELLOW}WARN{Fore.RESET} Canvas area exceeded the maximum limit (width * height = {canvasarea} > 16777216(=2^24))\n\
    This means safari will no longer support this map.\033[0m")

    return det


def transparent(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    data: list[int] = image.getdata()
    new_data = []

    for item in data:
        if item[0] < 10 and item[1] < 10 and item[2] < 10:
            new_data.append((21, 32, 43, 1))
        else:
            new_data.append(item)

    image.putdata(new_data)
    return image


if __name__ == "__main__":
    d = divide("./resources/img/reel_map/pre-basement_1.png", "./resources/map-tiles/basement_1", 1250, 1250, cleardir=True)
    print(d)
