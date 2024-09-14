import random
import math


current = 0
string = ""
for i in range(1,101, 2):
    liter = math.ceil(360*random.random()*((-1)**random.randint(0,1)))
    current += liter
    string += f"{i}%{{transform: rotate({current}deg)}}\n"

with open("./scripts/rotate.txt", "w") as f:
    f.write(string)
