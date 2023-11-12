import tkinter as tk

from tkinter import ttk
from PIL import Image, ImageTk



def main(source: str) -> None:
    image = Image.open(source)

    root = tk.Tk()
    root.title("Get Coordinate")

    photo = ImageTk.PhotoImage(image)

    canvas = tk.Canvas(root)

    canvas.pack(fill="both", expand=True)
    canvas.create_image(0, 0, image=photo, anchor="nw")
    canvas.config(scrollregion=canvas.bbox("all"))


    vcrlbar = ttk.Scrollbar(root, orient="vertical", command=canvas.yview)
    vcrlbar.pack(side="right", fill="y")

    canvas.configure(yscrollcommand=vcrlbar.set)

    crlbar = ttk.Scrollbar(root, orient="horizontal", command=canvas.xview)
    crlbar.pack(side="bottom", fill="x")

    canvas.configure(xscrollcommand=crlbar.set)


    label = tk.Label(root, text="", font=("Helvetica", 24))
    label.pack()

    coords_fotmat = "Coords: {{ x: {0}, y: {1} }}"

    label.config(text=coords_fotmat.format(None, None))


    def showCoords(event):
        x, y = event.x, event.y

        canvas_x = canvas.canvasx(x)
        canvas_y = canvas.canvasy(y)

        label.config(text=coords_fotmat.format(canvas_x, canvas_y))

        id = canvas.create_oval(canvas_x-5, canvas_y-5, canvas_x+5, canvas_y+5, fill="red")

        if hasattr(showCoords, "prev_id"):
            canvas.delete(showCoords.prev_id)
        showCoords.prev_id = id


    canvas.bind("<Button-1>", showCoords)

    root.mainloop()



if __name__ == "__main__":
    main("./resources/img/dokoka.png")
