r"""Using [rad]"""
import sys
import math
import sys
import json

from typing import List, Dict
from coordinates import Coord, getCoords
from PIL import Image



targetx = float(sys.argv[1])
targety = float(sys.argv[2])
source = str(sys.argv[3])

REQUIRED_MIN_ARG = ( 10 )*(math.pi / 180)

origin = Coord(0, 0)
coordinates = getCoords(f"./db/{source}.db")


def getTangent(parallel: Coord) -> List[Dict]:
    aspects = { "right": coordinates[0].x, "left": coordinates[0].y }
    # you can't write as a = b = [] as you know
    gradients = []; tan_data = []; gradient_candidates = [0, 0]
    max_gap_compared: List = None

    # get every gradient
    for coord in coordinates:
        gradient = coord.get_gradient(parallel)
        gradients.append(gradient)

        if coord.x > aspects.get("right"):
            aspects["right"] = coord.x
        elif coord.x < aspects.get("left"):
            aspects["left"] = coord.x
    
    gradients.sort(reverse=True)
    
    # when it comes to the origin being inside the map, the tangency gradients get complicated somewhat
    if aspects.get("right") > parallel.x and aspects.get("left") < parallel.x:
        gradient_candidates.clear()
        last_line = { "arg": math.atan(gradients[0]), "gradient": gradients[0] }
        last_line_setter = lambda arg, gradient: last_line.update({ "arg": arg, "gradient": gradient })

        for gradient in gradients:
            arg = math.atan(gradient)
            arg_gap = last_line["arg"] - arg

            # leave biggest argument
            if (
                    not max_gap_compared or arg_gap > max_gap_compared["arg"]
                # regard as not a tangency at least
                ) and arg_gap >= REQUIRED_MIN_ARG:
                max_gap_compared = {
                    "arg": arg_gap,
                    "em": [
                        last_line["gradient"], gradient
                    ]
                }

            last_line_setter(arg, gradient)

        gradient_candidates = max_gap_compared["em"]
        
        if len(gradient_candidates) < 2:
            raise Exception()
    else:
        gradient_candidates[0], gradient_candidates[1] = gradients[0], gradients[-1]
    
    # as [y = ax + b]
    for gradient in gradient_candidates:
        tan_data.append({
            "a": gradient,
            "b": parallel.y - gradient*parallel.x
        })

    return tan_data



def main() -> None:
    coordinates = getCoords("./db/Coords.db")
    gradients = []

    for coord in coordinates:
        tangent = coord.get_gradient()
        gradients.append(tangent)
    
    tangent_gradients = [ max(gradients), min(gradients) ]



print(json.dumps(getTangent(Coord(targetx, targety))))
