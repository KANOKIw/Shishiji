import json
import math
import os
import shutil

from typing import Dict
from PIL import Image


def divide(
        src: str, out_path: str, wi: int, he: int, *,
        cleardir: bool=False
        ) -> Dict[str, int]:
    if out_path.endswith("/"): out_path = out_path[:-1]
    if cleardir:
        shutil.rmtree(out_path)
        os.mkdir(out_path)
    image = Image.open(src)
    width, height = image.size

    w = math.ceil(width / wi)
    h = math.ceil(height / he)
    tileW = wi
    tileH = he

    for i in range(h):
        for j in range(w):
            left = j * tileW
            upper = i * tileH
            right = (j + 1) * tileW
            lower = (i + 1) * tileH
            tile = image.crop((left, upper, right, lower))
            tile = transparent(tile)
            tile.save(f"{out_path}/tile_{i}_{j}.png")

    det = {"tile_width": wi, "tile_height": he, "xrange": j, "yrange": i}
    with open(f"{out_path}/data.json", "w") as f:
        json.dump({**det, "width": tileW, "height": tileH, "format": "tile_{y}_{x}"}, f, indent=4)
    image.close()
    return det

def transparent(image):
    image = image.convert('RGBA')
    data = image.getdata()
    new_data = []

    for item in data:
        if item[0] < 10 and item[1] < 10 and item[2] < 10:
            # kuro
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    image.putdata(new_data)
    return image


d = divide("./src/resources/img/dokoka.png", "./src/resources/map_divided/dokoka", 100, 100, cleardir=True)
print(d)
