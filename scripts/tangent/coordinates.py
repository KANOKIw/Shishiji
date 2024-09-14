from __future__ import annotations

import sqlite3
import sys

from collections import namedtuple
from typing import Iterator, Sequence, List
from PIL import Image



SN = "<Image-name>"

class Coord:
    def __init__(self, x: int, y: int) -> None:
        self.x, self.y = x, y
    
    def get_gradient(self, origin: Coord = None) -> float:
        tx = (self.x - (0 if not origin else origin.x))
        if tx == 0:
            return 0
        else:
            return (self.y - (0 if not origin else origin.y))/tx



def readPoints(
        imgp: str, threshold: int
    ) -> Iterator[Coord]:
    
    image = Image.open(imgp).convert("L")
    pixels = image.load()
    
    for x in range(image.width):
        for y in range(image.height):
            if pixels[x, y] <= threshold:
                yield Coord(x, image.height - y)



def saveCoords(
        connection: sqlite3.Connection | str,
        coordinate_list: Sequence[Coord]
    ) -> None:

    if connection.__class__ == str:
        connection = sqlite3.connect(connection, isolation_level=None)
        
    cursor = connection.cursor()
    cursor.execute(r"""CREATE TABLE IF NOT EXISTS Coordinates(
        idx INTEGER PRIMARY KEY,
        X INTEGER,
        Y INTEGER
    )""")
    cursor.execute(r"""DELETE FROM Coordinates""")

    for coord in coordinate_list:
        cursor.execute(
            r"""INSERT INTO Coordinates (X, Y) VALUES (?, ?)""",
            (coord.x, coord.y)
        )
    connection.commit()



def getCoords(
        connection: sqlite3.Connection | str
    ) -> List[Coord]:

    if connection.__class__ == str:
        connection = sqlite3.connect(connection, isolation_level=None)

    cursor = connection.cursor()
    cursor.execute(r"""SELECT * FROM Coordinates""")
    rows = cursor.fetchall()
    coords = []

    for row in rows:
        data = { "x": row[1], "y": row[2] }
        coords.append(Coord(**data))
    return coords
    


def check() -> None:
    """you can check whether your database is correct by using this"""

    image = Image.new("L", (500, 500))
    pixels = image.load()

    for coord in coordinates:
        pixels[coord.x, 500-coord.y] = 255

    image.save("./resources/check_coords.png")



if __name__ == "__main__":
    coordData = [ data for data in readPoints(f"./resources/{SN}_gloom.png", 0) ]
    saveCoords(f"./db/{SN}.db", coordData)
