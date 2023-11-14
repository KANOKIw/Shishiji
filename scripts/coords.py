import os
import sys
import re
import tkinter as tk

from tkinter import ttk
from PIL import Image, ImageTk



class CoordinateWindow:
    def __init__(self, bgi: str) -> None:
        self.bgi = bgi
        self.root = tk.Tk()
        self.root.title("Get Coordinate")
        self.canvas = tk.Canvas(self.root)
        self.prevID = None
        self.coords_fotmat = "Coords: {{ x: {0}, y: {1} }}"


    def create(self) -> None:
        image = Image.open(self.bgi)
        photo = ImageTk.PhotoImage(image)

        self.canvas.pack(fill="both", expand=True)
        self.canvas.create_image(0, 0, image=photo, anchor="nw")
        self.canvas.config(scrollregion=self.canvas.bbox("all"))

        vcrlbar = ttk.Scrollbar(self.root, orient="vertical", command=self.canvas.yview)
        vcrlbar.pack(side="right", fill="y")

        self.canvas.configure(yscrollcommand=vcrlbar.set)

        crlbar = ttk.Scrollbar(self.root, orient="horizontal", command=self.canvas.xview)
        crlbar.pack(side="bottom", fill="x")

        self.canvas.configure(xscrollcommand=crlbar.set)

        label = tk.Label(self.root, text="", font=("Helvetica", 24))
        label.pack()
        label.config(text=self.coords_fotmat.format(None, None))

        self.canvas.bind("<Button-1>", lambda e: self.showCoords(e, label, self.coords_fotmat))

        self.root.mainloop()


    def showCoords(self, event, label: tk.Label, format_: str) -> None:
        x, y = event.x, event.y

        canvas_x = self.canvas.canvasx(x)
        canvas_y = self.canvas.canvasy(y)

        label.config(text=format_.format(canvas_x, canvas_y))

        id = self.canvas.create_oval(canvas_x-5, canvas_y-5, canvas_x+5, canvas_y+5, fill="red")

        if self.prevID:
            self.canvas.delete(self.prevID)

        self.prevID = id



if __name__ == "__main__":
    window = CoordinateWindow("./resources/img/mc4k.png")
    window.create()
