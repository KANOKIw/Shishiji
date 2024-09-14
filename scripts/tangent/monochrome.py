import math
import sys

from PIL import Image
from coordinates import getCoords



SN = "<Image-name>"
coordinates = getCoords(f"./db/{SN}.db")

def monochrome(imgp: str, threshold: int, outp: str) -> None:
    monochrome_img = Image.open(imgp).convert("L")
    pixels = monochrome_img.load()
    
    for y in range(monochrome_img.height):
        for x in range(monochrome_img.width):
            # make black when only the brightness is higher than threshold
            if pixels[x, y] <= threshold:
                pixels[x, y] = 0
            else:
                pixels[x, y] = 255
    
    monochrome_img.save(outp)



monochrome(f"./resources/{SN}.png", 175, f"./resources/{SN}_gloom.png")
