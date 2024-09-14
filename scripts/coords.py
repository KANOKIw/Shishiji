"""
set base map image path on main
creates a window to get obj coordinate by clicking
"""
import tkinter as tk

from collections import namedtuple
from typing import *
from tkinter import ttk
from PIL import Image, ImageTk


class Coords:
    def __init__(self, x: int, y: int) -> None:
        self._x = x; self._y = y
    # editor hint
    @property
    def x(self): return self._x
    @property
    def y(self): return self._y
    @x.setter
    def x(self, x: int): self._x = x
    @y.setter
    def y(self, y: int): self._y = y


class CoordinateWindow:
    def __init__(self, bgi: str) -> None:
        self.bgi = bgi
        self.root = tk.Tk()
        self.root.title("Get Coordinate")
        self.canvas = tk.Canvas(self.root)
        self.prev_id = None
        self.coords_format = "Coords: {{ x: {0}, y: {1} }}"
        self.image = Image.open(self.bgi)


    def create(self) -> None:
        photo = ImageTk.PhotoImage(self.image)

        self.canvas.pack(fill="both", expand=True)
        self.canvas.create_image(0, 0, image=photo, anchor="nw")
        self.canvas.config(scrollregion=self.canvas.bbox("all"))

        v_scrollbar = ttk.Scrollbar(self.root, orient="vertical", command=self.canvas.yview)
        v_scrollbar.pack(side="right", fill="y")
        self.canvas.configure(yscrollcommand=v_scrollbar.set)

        h_scrollbar = ttk.Scrollbar(self.root, orient="horizontal", command=self.canvas.xview)
        h_scrollbar.pack(side="bottom", fill="x")
        self.canvas.configure(xscrollcommand=h_scrollbar.set)

        label = tk.Label(self.root, text="", font=("Helvetica", 24))
        label.pack()
        label.config(text=self.coords_format.format(None, None))

        self.canvas.bind("<Button-1>", lambda e: self.show_coords(e, label, self.coords_format))

        self.root.mainloop()


    def show_coords(self, event: tk.Event, label: tk.Label, format_: str) -> None:
        position = Coords(event.x, event.y)

        canvas_x = self.canvas.canvasx(position.x)
        canvas_y = self.canvas.canvasy(position.y)

        label.config(text=format_.format(canvas_x, canvas_y))

        icolor = self.get_inversed_color(self.image, position)

        current_id = self.canvas.create_oval(canvas_x - 5, canvas_y - 5, canvas_x + 5, canvas_y + 5, fill=icolor)

        if self.prev_id:
            self.canvas.delete(self.prev_id)

        self.prev_id = current_id

    
    def get_inversed_color(self, img: Image.Image, position: Coords) -> str:
        colorL = self.image.getpixel((position.x, position.y))
        return "#{:02x}{:02x}{:02x}".format(255 - colorL[0], 255 - colorL[1], 255 - colorL[2])



if __name__ == "__main__":
    window = CoordinateWindow("./resources/img/reel_map/pre-floor1.png")
    window.create()
