import random
import os
import json


objectfplist = os.listdir("./resources/map-objects/")

for objfp in objectfplist:
    fp = "./resources/map-objects/"+objfp
    data = {}

    with open(fp, "r", encoding="UTF-8") as f:
        data = json.load(f)

    x = int(random.random() * 2000)
    y = int(random.random() * 1500)
    data["object"]["coordinate"] = { "x": x, "y": y }


    with open(fp, "w", encoding="UTF-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

